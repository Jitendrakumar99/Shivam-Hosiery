const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

dotenv.config();

const categories = [
  {
    name: 'Safety Vests',
    slug: 'safety-vests',
    description: 'High-visibility safety vests for various work environments',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=500&fit=crop',
    parent: null
  },
  {
    name: 'Safety Jackets',
    slug: 'safety-jackets',
    description: 'Protective jackets with reflective materials for enhanced visibility',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    parent: null
  },
  {
    name: 'Coveralls',
    slug: 'coveralls',
    description: 'Full-body protective coveralls for industrial and construction work',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&h=500&fit=crop',
    parent: null
  }
];

const getProducts = (categoryId, categoryName) => [
  {
    title: `Hi-Vis ${categoryName} - Professional Grade`,
    handle: `hi-vis-${categoryName.toLowerCase().replace(/\s+/g, '-')}-professional`,
    shortDescription: 'Premium quality safety garment with 360° reflective tape',
    description: 'Our professional-grade safety garment is designed for maximum visibility and comfort. Features include breathable fabric, reinforced stitching, and ANSI/ISEA certified reflective tape. Perfect for construction, road work, and industrial environments.',
    category: {
      id: categoryId,
      name: categoryName,
      parent: ''
    },
    pricing: {
      price: 599,
      compareAtPrice: 799,
      currency: 'INR'
    },
    variants: [
      { size: 'S', color: 'Orange', price: 599, inventory: { quantity: 50 }, image: '' },
      { size: 'M', color: 'Orange', price: 599, inventory: { quantity: 100 }, image: '' },
      { size: 'L', color: 'Orange', price: 649, inventory: { quantity: 75 }, image: '' },
      { size: 'XL', color: 'Orange', price: 649, inventory: { quantity: 60 }, image: '' },
      { size: 'S', color: 'Yellow', price: 599, inventory: { quantity: 40 }, image: '' },
      { size: 'M', color: 'Yellow', price: 599, inventory: { quantity: 80 }, image: '' },
      { size: 'L', color: 'Yellow', price: 649, inventory: { quantity: 50 }, image: '' }
    ],
    attributes: {
      gender: 'Unisex',
      fabric: 'Polyester Mesh',
      length: 'Regular',
      sleeve: 'Sleeveless'
    },
    rating: {
      average: 4.5,
      count: 0
    },
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=800&fit=crop'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop',
    seo: {
      title: `Buy ${categoryName} Online - Professional Safety Gear`,
      description: `High-quality ${categoryName.toLowerCase()} with reflective tape. ANSI certified, comfortable fit, bulk orders available.`,
      keywords: ['safety vest', 'hi-vis', 'reflective', 'construction', 'industrial safety']
    },
    availability: {
      inStock: true
    },
    status: 'active',
    features: [
      '360° reflective tape for maximum visibility',
      'ANSI/ISEA 107 certified',
      'Breathable mesh fabric',
      'Adjustable velcro closure',
      'Multiple pockets for tools',
      'Machine washable'
    ]
  },
  {
    title: `Economy ${categoryName} - Value Pack`,
    handle: `economy-${categoryName.toLowerCase().replace(/\s+/g, '-')}-value`,
    shortDescription: 'Affordable safety solution without compromising on quality',
    description: 'Our economy line offers excellent value for money while maintaining safety standards. Ideal for bulk purchases, temporary workers, or budget-conscious buyers. Meets all essential safety requirements.',
    category: {
      id: categoryId,
      name: categoryName,
      parent: ''
    },
    pricing: {
      price: 349,
      compareAtPrice: 499,
      currency: 'INR'
    },
    variants: [
      { size: 'M', color: 'Orange', price: 349, inventory: { quantity: 200 }, image: '' },
      { size: 'L', color: 'Orange', price: 349, inventory: { quantity: 150 }, image: '' },
      { size: 'XL', color: 'Orange', price: 379, inventory: { quantity: 100 }, image: '' },
      { size: 'M', color: 'Yellow', price: 349, inventory: { quantity: 180 }, image: '' },
      { size: 'L', color: 'Yellow', price: 349, inventory: { quantity: 120 }, image: '' }
    ],
    attributes: {
      gender: 'Unisex',
      fabric: 'Polyester',
      length: 'Regular',
      sleeve: 'Sleeveless'
    },
    rating: {
      average: 4.2,
      count: 0
    },
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    images: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=800&fit=crop'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=800&fit=crop',
    seo: {
      title: `Affordable ${categoryName} - Best Price Online`,
      description: `Budget-friendly ${categoryName.toLowerCase()} for bulk orders. Quality safety gear at competitive prices.`,
      keywords: ['cheap safety vest', 'bulk order', 'economy', 'affordable safety gear']
    },
    availability: {
      inStock: true
    },
    status: 'active',
    features: [
      'Reflective strips for visibility',
      'Lightweight and comfortable',
      'Easy velcro fastening',
      'Suitable for various industries',
      'Available in bulk quantities'
    ]
  },
  {
    title: `Premium ${categoryName} - Executive Series`,
    handle: `premium-${categoryName.toLowerCase().replace(/\s+/g, '-')}-executive`,
    shortDescription: 'Top-tier safety garment with advanced features',
    description: 'The executive series represents the pinnacle of safety garment technology. Features include moisture-wicking fabric, ergonomic design, enhanced reflective materials, and premium construction. Perfect for supervisors, managers, and professionals who demand the best.',
    category: {
      id: categoryId,
      name: categoryName,
      parent: ''
    },
    pricing: {
      price: 899,
      compareAtPrice: 1199,
      currency: 'INR'
    },
    variants: [
      { size: 'M', color: 'Orange', price: 899, inventory: { quantity: 30 }, image: '' },
      { size: 'L', color: 'Orange', price: 899, inventory: { quantity: 40 }, image: '' },
      { size: 'XL', color: 'Orange', price: 949, inventory: { quantity: 25 }, image: '' },
      { size: 'M', color: 'Yellow', price: 899, inventory: { quantity: 35 }, image: '' },
      { size: 'L', color: 'Yellow', price: 899, inventory: { quantity: 30 }, image: '' },
      { size: 'M', color: 'Red', price: 949, inventory: { quantity: 20 }, image: '' },
      { size: 'L', color: 'Red', price: 949, inventory: { quantity: 15 }, image: '' }
    ],
    attributes: {
      gender: 'Unisex',
      fabric: 'Premium Polyester Mesh with Moisture-Wicking',
      length: 'Regular',
      sleeve: 'Sleeveless'
    },
    rating: {
      average: 4.8,
      count: 0
    },
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=800&fit=crop'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop',
    seo: {
      title: `Premium ${categoryName} - Executive Quality`,
      description: `Top-quality ${categoryName.toLowerCase()} with advanced features. Perfect for professionals and supervisors.`,
      keywords: ['premium safety vest', 'executive', 'high-end', 'professional safety gear']
    },
    availability: {
      inStock: true
    },
    status: 'active',
    features: [
      'Enhanced 360° reflective tape',
      'Moisture-wicking fabric technology',
      'Ergonomic design for all-day comfort',
      'Multiple secure pockets',
      'Reinforced stress points',
      'Premium zipper and velcro closures',
      'Extended size range',
      'ANSI/ISEA 107 Type R Class 2 certified'
    ]
  }
];

const reviews = [
  {
    rating: 5,
    title: 'Excellent quality and visibility',
    comment: 'I work in construction and this vest is perfect. The reflective tape is very bright and the fit is comfortable even after wearing it all day. Highly recommend!',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    rating: 4,
    title: 'Good value for money',
    comment: 'Bought these for my team. Good quality at a reasonable price. The only minor issue is that they run slightly small, so order one size up.',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    rating: 5,
    title: 'Best safety vest I have owned',
    comment: 'The material is breathable and the reflective strips are very effective. I feel much safer working on the road now. Worth every rupee!',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    rating: 4,
    title: 'Great for night shifts',
    comment: 'Very visible at night which is exactly what I needed. The vest is lightweight and does not restrict movement. Good purchase.',
    verifiedPurchase: false,
    status: 'approved'
  },
  {
    rating: 5,
    title: 'Comfortable and durable',
    comment: 'Been using this for 3 months now and it still looks new. The velcro is strong and the fabric has not faded. Excellent product!',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    rating: 3,
    title: 'Decent but could be better',
    comment: 'It does the job but I wish it had more pockets. The reflective tape is good though.',
    verifiedPurchase: true,
    status: 'approved'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    console.log('Existing data cleared');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    // Create products for each category
    console.log('Creating products...');
    const allProducts = [];
    for (const category of createdCategories) {
      const categoryProducts = getProducts(category._id, category.name);
      allProducts.push(...categoryProducts);
    }
    const createdProducts = await Product.insertMany(allProducts);
    console.log(`${createdProducts.length} products created`);

    // Get or create a test user for reviews
    console.log('Finding/creating test user...');
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      testUser = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log('Test user created');
    } else {
      console.log('Test user found');
    }

    // Create reviews for products
    console.log('Creating reviews...');
    const allReviews = [];
    for (let i = 0; i < createdProducts.length; i++) {
      const product = createdProducts[i];
      // Add 2-3 reviews per product
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2 or 3 reviews
      
      for (let j = 0; j < numReviews; j++) {
        const reviewTemplate = reviews[Math.floor(Math.random() * reviews.length)];
        allReviews.push({
          productId: product._id,
          user: {
            id: testUser._id,
            name: testUser.name
          },
          ...reviewTemplate,
          likes: Math.floor(Math.random() * 10),
          dislikes: Math.floor(Math.random() * 3)
        });
      }
    }
    const createdReviews = await Review.insertMany(allReviews);
    console.log(`${createdReviews.length} reviews created`);

    // Update product ratings based on reviews
    console.log('Updating product ratings...');
    for (const product of createdProducts) {
      const productReviews = createdReviews.filter(
        r => r.productId.toString() === product._id.toString() && r.status === 'approved'
      );
      
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const average = totalRating / productReviews.length;
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        productReviews.forEach(review => {
          distribution[review.rating]++;
        });
        
        await Product.findByIdAndUpdate(product._id, {
          'rating.average': Math.round(average * 10) / 10,
          'rating.count': productReviews.length,
          ratingDistribution: distribution
        });
      }
    }
    console.log('Product ratings updated');

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- ${createdCategories.length} categories`);
    console.log(`- ${createdProducts.length} products`);
    console.log(`- ${createdReviews.length} reviews`);
    console.log(`\nTest user credentials:`);
    console.log(`Email: testuser@example.com`);
    console.log(`Password: password123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
