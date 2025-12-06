const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { clearCache } = require('../middlewares/cache');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// @desc    Create contact inquiry
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New Contact Inquiry - ${contact.inquiryType}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${contact.fullName}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
          <p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>
          <p><strong>Message:</strong> ${contact.message}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    clearCache('/api/contact');

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const { status, inquiryType } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    const query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;

    const contacts = await Contact.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    clearCache('/api/contact');

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

