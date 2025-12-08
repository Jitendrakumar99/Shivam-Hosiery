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

// Helper function to normalize contact data
const normalizeContactData = (data) => {
  const normalized = { ...data };
  
  // If name is provided (Shivam form), set it as fullName
  if (data.name && !data.fullName) {
    normalized.fullName = data.name;
  }
  
  // Determine source if not provided
  if (!normalized.source) {
    normalized.source = data.inquiryType ? 'tarana' : 'shivam';
  }
  
  return normalized;
};

// Helper function to generate email HTML
const generateEmailHTML = (contact) => {
  const isTarana = contact.source === 'tarana';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p><strong>Website:</strong> ${isTarana ? 'Tarana' : 'Shivam Hosiery'}</p>
      <p><strong>Name:</strong> ${contact.fullName || contact.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
      ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
      ${contact.inquiryType ? `<p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${contact.message}</p>
      <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666;">Submitted on: ${new Date(contact.createdAt).toLocaleString()}</p>
    </div>
  `;
};

// @desc    Create contact inquiry
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res, next) => {
  try {
    // Normalize the incoming data to support both Shivam and Tarana formats
    const normalizedData = normalizeContactData(req.body);
    const contact = await Contact.create(normalizedData);

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New Contact Inquiry - ${contact.source.toUpperCase()} (${contact.inquiryType || contact.company || 'General'})`,
        html: generateEmailHTML(contact)
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

