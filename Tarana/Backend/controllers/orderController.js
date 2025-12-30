const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const DeliveryZone = require('../models/DeliveryZone');
const mongoose = require('mongoose');
const { clearCache } = require('../middlewares/cache');

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
      .populate('items.product', 'name pricing.price images')
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
      .populate('items.product', 'name pricing.price images')
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
        const color = item.customization.Color || item.customization.color;

        variant = product.variants.find(v =>
          v.size === size && (color ? v.color === color : true)
        );

        if (variant) {
          price = variant.price;
        }
      }

      // No stock check needed as we are manufacture

      if (price === undefined || price === null) {
        return res.status(500).json({
          success: false,
          message: `Price not found for product: ${product.title}`
        });
      }

      totalAmount += price * item.quantity;

      validatedItems.push({
        ...item,
        price: price, // Ensure correct price is saved
      });
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

    // Clear products list cache
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

    // No stock adjustments needed as we are manufacture

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (deliveryAgent !== undefined) {
      order.deliveryAgent = deliveryAgent;
    }
    if (paymentStatus !== undefined) {
      const valid = ['pending', 'paid', 'failed'];
      if (!valid.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid payment status' });
      }
      order.paymentStatus = paymentStatus;
    }
    await order.save();

    // Create notification
    await Notification.create({
      user: order.user,
      type: 'order',
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order._id} status has been updated to ${status}.`,
      link: `/orders/${order._id}`
    });

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

    // Clear cache
    clearCache('/api/products');

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

