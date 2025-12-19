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
          if (variant.inventory.quantity < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${product.title} (${size}${color ? ` - ${color}` : ''}). Available: ${variant.inventory.quantity}, Requested: ${item.quantity}`
            });
          }
        } else {
          // Fallback or error if variant requested but not found?
          // Proceeding with base price if strict check not enforced, but warning:
        }
      }

      // Stock check for non-variant or if no variant matched but product is simple
      if (!variant) {
        if (product.availability && product.availability.inStock === false) {
          return res.status(400).json({
            success: false,
            message: `Product out of stock: ${product.title}`
          });
        }
      }

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
        _variantId: variant ? variant._id : null // Keep track for stock update
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

    // Update product stock
    for (const item of validatedItems) {
      if (item._variantId) {
        // Update variant stock
        await Product.findOneAndUpdate(
          { _id: item.product, 'variants._id': item._variantId },
          { $inc: { 'variants.$.inventory.quantity': -item.quantity } }
        );
      } else {
        // Simple product - we can't decrement quantity as it doesn't exist, 
        // but if we had it, we would here. 
        // For now, do nothing or update inStock? 
        // Schema doesn't allow decrementing boolean.
      }

      // Update global availability only if needed (complex logic omitted for brevity, usually pre-save hook handles it)
      // Actually Product pre-save hook re-calculates inStock based on variants.
      // So if we updated variant quantity, we should trigger a save?
      // findOneAndUpdate might not trigger pre-save.
      // Let's rely on the direct update for now. 
      // To strictly trigger header update, we might need to findById and save.

      const product = await Product.findById(item.product);
      await product.save(); // This triggers the pre-save hook to update inStock

      try {
        clearCache(`/api/products/${item.product}`);
      } catch (_) { }
    }
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

    // Handle stock adjustments based on status transitions
    if (prevStatus !== 'cancelled' && status === 'cancelled') {
      // Order is being cancelled now: restore stock
      for (const item of order.items) {
        // Identify if item had variant based on customization
        const product = await Product.findById(item.product);
        if (product && product.variants && product.variants.length > 0 && item.customization) {
          const size = item.customization.get('Size') || item.customization.get('size'); // Map access
          // For restore, we try to find the variant again
          if (size) {
            // We need to match precise variant
            // This is tricky if variant data changed. 
            // Ideally we should have stored variantId in order item, but schema doesn't have it explicitly.
            // We rely on matching logic again.
            const variant = product.variants.find(v => v.size === size); // heuristic
            if (variant) {
              variant.inventory.quantity += item.quantity;
            }
          }
        }
        if (product) await product.save();
        try { clearCache(`/api/products/${item.product}`); } catch (_) { }
      }
      clearCache('/api/products');
    } else if (prevStatus === 'cancelled' && status !== 'cancelled') {
      // Order was cancelled before, now being re-activated: decrease stock again
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
        try { clearCache(`/api/products/${item.product}`); } catch (_) { }
      }
      clearCache('/api/products');
    }

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

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Try to identify variant and restore stock
        if (product.variants && product.variants.length > 0 && item.customization) {
          const size = item.customization.get('Size') || item.customization.get('size');
          if (size) {
            const variant = product.variants.find(v => v.size === size);
            if (variant) {
              variant.inventory.quantity += item.quantity;
            }
          }
        }
        await product.save();
      }
      try { clearCache(`/api/products/${item.product}`); } catch (_) { }
    }
    // Clear products list cache
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

