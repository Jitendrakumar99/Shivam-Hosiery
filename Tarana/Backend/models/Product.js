const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  image: {
    type: String,
    default: ''
  }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  handle: {
    type: String,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: {
      type: String,
      required: [true, 'Category name is required']
    },
    parent: {
      type: String,
      default: ''
    }
  },
  pricing: {
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  variants: [variantSchema],
  attributes: {
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unisex'],
      default: 'Unisex'
    },
    fabric: {
      type: String,
      default: ''
    },
    length: {
      type: String,
      default: ''
    },
    sleeve: {
      type: String,
      default: ''
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  },
  images: [{
    type: String
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  seo: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    keywords: [{
      type: String
    }]
  },
  availability: {
    inStock: {
      type: Boolean,
      default: true
    }
  },
  minOrderQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  url: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Generate handle from title before saving
productSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.handle) {
    this.handle = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  // Set featured image if not set
  if (!this.featuredImage && this.images && this.images.length > 0) {
    this.featuredImage = this.images[0];
  }

  // Always in stock for manufacturer
  this.availability.inStock = true;

  next();
});

// Index for search
productSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
productSchema.index({ 'category.name': 1, status: 1 });
productSchema.index({ handle: 1 });
productSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Product', productSchema);

