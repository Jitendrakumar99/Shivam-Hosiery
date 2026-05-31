const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const {
  getTotalStock,
  isLowStock,
  LOW_STOCK_THRESHOLD,
} = require('../utils/inventory');

// All admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', cache(300), async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      newContacts
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { 
          $match: { 
            status: { $in: ['delivered', 'shipped'] },
            paymentStatus: 'paid' // Only count paid orders for revenue
          } 
        },
        { 
          $project: {
            grandTotal: { $add: ['$totalAmount', { $ifNull: ['$shippingCost', 0] }] }
          }
        },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'new' })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        newContacts
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get products with low stock (admin only)
// @route   GET /api/admin/low-stock
// @access  Private/Admin
router.get('/low-stock', async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'active' })
      .select('title sku category variants availability featuredImage images status')
      .lean();

    const lowStockProducts = products
      .filter((product) => isLowStock(product))
      .map((product) => {
        const totalStock = getTotalStock(product);
        return {
          _id: product._id,
          title: product.title,
          sku: product.sku,
          category: product.category,
          featuredImage: product.featuredImage,
          images: product.images,
          totalStock,
          lowStockVariants: (product.variants || [])
            .filter((v) => (v.inventory?.quantity ?? 0) < LOW_STOCK_THRESHOLD)
            .map((v) => ({
              size: v.size,
              color: v.color,
              quantity: v.inventory?.quantity ?? 0,
            })),
          availability: product.availability,
        };
      })
      .sort((a, b) => a.totalStock - b.totalStock);

    res.json({
      success: true,
      threshold: LOW_STOCK_THRESHOLD,
      count: lowStockProducts.length,
      data: lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', paginate(User), cache(300), async (req, res, next) => {
  try {
    const { startIndex, limit } = req.pagination;
    const users = await User.find()
      .select('-password')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new user (admin can create users with specific role)
// @route   POST /api/admin/users
// @access  Private/Admin
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, phone, company, address, role = 'user' } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      company,
      address,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    next(error);
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent deleting yourself
    if (req.user?.id && String(req.user.id) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

