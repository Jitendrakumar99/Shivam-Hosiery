const Client = require('../models/Client');
const { paginate } = require('../middlewares/pagination');
const fs = require('fs');
const path = require('path');

// Helper to delete logo file
const deleteLogoFile = (logoPath) => {
  if (logoPath && logoPath.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, '..', logoPath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`Deleted logo file: ${fullPath}`);
      } catch (err) {
        console.error(`Error deleting logo file: ${err.message}`);
      }
    }
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
exports.getClients = async (req, res, next) => {
  try {
    const { status = 'active', category, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create client
// @route   POST /api/clients
// @access  Private/Admin
exports.createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
exports.updateClient = async (req, res, next) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Handle logo replacement or removal
    if (client.logo && req.body.logo !== client.logo) {
      // If req.body.logo is provided (even if empty string) and it's different from old one
      if (req.body.logo !== undefined) {
        deleteLogoFile(client.logo);
      }
    }

    client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Delete logo file if exists
    if (client.logo) {
      deleteLogoFile(client.logo);
    }

    await client.deleteOne();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

