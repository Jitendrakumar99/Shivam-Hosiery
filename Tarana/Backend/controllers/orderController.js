const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const DeliveryZone = require('../models/DeliveryZone');
const mongoose = require('mongoose');
const { clearCache } = require('../middlewares/cache');
const { generateInvoicePdf } = require('../services/invoiceService');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    // Build query - Always filter by user for non-admin users
    const query = {};
    if (req.user.role !== 'admin') {
      // Filter by the authenticated user's ID
      // Mongoose will handle ObjectId conversion automatically
      query.user = req.user._id || req.user.id;
    }
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'title pricing.price images featuredImage sku gst_percentage')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title pricing.price images featuredImage sku gst_percentage')
      .lean(); // Use lean() to get plain JavaScript object instead of Mongoose document

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    // Handle case where user might not be populated or is an ObjectId
    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (req.user.role !== 'admin' && orderUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error in getOrder:', error);
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address with name, phone, and address is required'
      });
    }

    if (!shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode is required for shipping'
      });
    }

    // Find matching delivery zone based on pincode
    const pincode = shippingAddress.pincode.toString();
    const deliveryZone = await DeliveryZone.findOne({
      status: 'active',
      pincodes: pincode,
    });

    if (!deliveryZone) {
      return res.status(400).json({
        success: false,
        message: 'We currently do not deliver to this pincode. Please choose a different delivery address.',
      });
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product and quantity'
        });
      }

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID format: ${item.product}`
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Enforce minOrderQuantity
      if (product.minOrderQuantity && item.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for ${product.title} is ${product.minOrderQuantity}`
        });
      }

      let price = product.pricing?.price;
      let variant = null;

      // Handle variants
      if (item.customization && product.variants && product.variants.length > 0) {
        const size = item.customization.Size || item.customization.size;
        const color = item.customization.Color || item.customization.color || '';

        variant = findVariant(product, size, color);

        if (variant) {
          price = variant.price;
        }
      }

      if (price === undefined || price === null) {
        return res.status(500).json({
          success: false,
          message: `Price not found for product: ${product.title}`
        });
      }

      // Calculate GST and final price
      const gstPercentage = product.gst_percentage || 0;
      const gstAmount = parseFloat(((price * gstPercentage) / 100).toFixed(2));
      const finalPrice = parseFloat((price + gstAmount).toFixed(2));

      // Calculate item total
      const itemTotal = parseFloat((finalPrice * item.quantity).toFixed(2));

      totalAmount += itemTotal;

      const orderItem = {
        product: product._id,
        quantity: item.quantity,
        price: finalPrice,
        total: itemTotal,
        gst: gstAmount,
      };

      if (item.customization) {
        orderItem.customization = item.customization;
      }
      if (variant?.sku) {
        orderItem.variantSKU = variant.sku;
      }

      validatedItems.push(orderItem);
    }

    const order = await Order.create({
      user: req.user.id,
      items: validatedItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      shippingCost: deliveryZone.deliveryCharge || 0,
      deliveryZone: deliveryZone._id,
    });

    clearCache('/api/products');

    // Create notification
    try {
      await Notification.create({
        user: req.user.id,
        type: 'order',
        title: 'Order Placed',
        message: `Your order #${order._id} has been placed successfully.`,
        link: `/orders/${order._id}`
      });
    } catch (notifError) {
      // Log notification error but don't fail the order
      console.error('Error creating notification:', notifError);
    }

    clearCache('/api/orders');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, deliveryAgent, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const prevStatus = order.status;
    const prevPaymentStatus = order.paymentStatus;

    // Update status if provided
    if (status !== undefined && status !== null) {
      // Validate order status
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      order.status = status;
    }
    
    // Update payment status if provided
    if (paymentStatus !== undefined && paymentStatus !== null) {
      // Validate payment status
      const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      order.paymentStatus = paymentStatus;
    }
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (deliveryAgent !== undefined) {
      order.deliveryAgent = deliveryAgent;
    }
    
    await order.save();

    // Create notification for status or payment status changes
    // Wrap in try-catch so notification failures don't break the update
    const statusChanged = status !== undefined && status !== prevStatus;
    const paymentStatusChanged = paymentStatus !== undefined && paymentStatus !== prevPaymentStatus;
    
    if (statusChanged) {
      try {
    await Notification.create({
      user: order.user,
      type: 'order',
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order._id} status has been updated to ${status}.`,
      link: `/orders/${order._id}`
    });
      } catch (notifError) {
        // Log notification error but don't fail the order update
        console.error('Error creating order status notification:', notifError);
      }
    }
    
    if (paymentStatusChanged) {
      try {
        await Notification.create({
          user: order.user,
          type: 'order', // Use 'order' type since payment status is order-related
          title: `Payment Status Updated`,
          message: `Your order #${order._id} payment status has been updated to ${paymentStatus}.`,
          link: `/orders/${order._id}`
        });
      } catch (notifError) {
        // Log notification error but don't fail the order update
        console.error('Error creating payment status notification:', notifError);
      }
    }

    // Clear all relevant caches
    clearCache('/api/orders');
    clearCache(`/api/orders/${req.params.id}`);
    
    // Clear stats cache when payment status or order status changes (affects revenue calculations)
    if (paymentStatusChanged || (statusChanged && (status === 'delivered' || status === 'shipped' || prevStatus === 'delivered' || prevStatus === 'shipped'))) {
      clearCache('/api/admin/stats');
    }

    // Convert Mongoose document to plain object for JSON response
    const orderData = order.toObject ? order.toObject() : order;

    res.json({
      success: true,
      data: orderData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered orders'
      });
    }

    order.status = 'cancelled';
    await order.save();

    clearCache('/api/orders');
    clearCache(`/api/orders/${req.params.id}`);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.getOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title pricing.price sku hsn')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (req.user.role !== 'admin' && orderUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Map Order to Invoice Data
    const invoiceData = {
      invoiceNo: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
      date: new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
      supplier: {
        name: "SUMAN INTERNATIONAL",
        address: "SAGAR ESTATE, 2, NARENDRA CH. DUTTA SARANI, 12T FLOOR, KOLKATA- 700001",
        gstin: "19ACQPJ5066M1ZU",
        state: "West Bengal",
        stateCode: "19",
        pan: "ACQPJ5066M"
      },
      buyer: {
        name: order.shippingAddress.name,
        address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}-${order.shippingAddress.pincode}`,
        phone: order.shippingAddress.phone,
        state: order.shippingAddress.state,
        // Defaulting these for now, can be expanded if stored in user profile
        gstin: "URP (Unregistered Person)", 
        stateCode: "22" 
      },
      items: order.items.map(item => ({
        description: item.product?.title || 'Product',
        hsn: item.product?.hsn || '39219099',
        quantity: `${item.quantity}.000`,
        rate: item.price.toFixed(2),
        unit: 'PCS',
        amount: (item.price * item.quantity).toFixed(2),
        subDetails: item.variantSKU ? [`SKU: ${item.variantSKU}`] : []
      })),
      taxDetails: {
        breakdown: [
          { 
            hsn: "39219099", 
            taxableValue: order.totalAmount.toFixed(2), 
            rate: "18%", 
            amount: (order.totalAmount * 0.18).toFixed(2) 
          }
        ]
      },
      bankDetails: {
        name: "HDFC - O/D A/C",
        accNo: "50200038864999",
        ifsc: "P/34, INDIA EXCHANGE PLACE, KOLKATA-1 & HDFC0001242"
      },
      totalQty: order.items.reduce((acc, item) => acc + item.quantity, 0) + '.000',
      // The generateInvoicePdf will use numberToWords if we pass it, 
      // or we can calculate it here.
      amountInWords: "", // Service handles this or we can add it
      qrUrl: `https://shivamhosiery.com/verify/${order._id}`
    };

    const pdfBuffer = await generateInvoicePdf(invoiceData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
