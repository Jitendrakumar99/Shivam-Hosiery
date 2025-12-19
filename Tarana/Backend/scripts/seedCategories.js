const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  {
    name: 'Safety Vests',
    description: 'High-visibility safety vests for various work environments',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop'
  },
  {
    name: 'Safety Jackets',
    description: 'Protective jackets with reflective materials for enhanced visibility',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop'
  },
  {
    name: 'Coveralls',
    description: 'Full-body protective coveralls for industrial and construction work',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&h=500&fit=crop'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing categories
    await Category.deleteMany();
    console.log('Existing categories cleared');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
