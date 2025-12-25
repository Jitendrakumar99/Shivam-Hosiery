const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [150, 'Category name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    image: {
      type: String,
      default: ''
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual field to get subcategories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
