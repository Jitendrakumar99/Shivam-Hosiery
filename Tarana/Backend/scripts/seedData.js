const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Load models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');
const Contact = require('../models/Contact');
const Customization = require('../models/Customization');

// Load env vars
dotenv.config();

// Seed data
const seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Wishlist.deleteMany();
    await Notification.deleteMany();
    await Contact.deleteMany();
    await Customization.deleteMany();

    // Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@trana.com',
      password: hashedPassword,
      phone: '+91 98765 43210',
      company: 'Trana Safety',
      address: 'Raipur, Chhattisgarh, India',
      role: 'admin'
    });

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '+91 98765 43211',
        company: 'ABC Industries',
        address: 'Mumbai, Maharashtra, India',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '+91 98765 43212',
        company: 'XYZ Construction',
        address: 'Delhi, India',
        role: 'user'
      },
      {
        name: 'Raj Kumar',
        email: 'raj@example.com',
        password: hashedPassword,
        phone: '+91 98765 43213',
        company: 'Safety First Ltd',
        address: 'Bangalore, Karnataka, India',
        role: 'user'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        phone: '+91 98765 43214',
        address: 'Pune, Maharashtra, India',
        role: 'user'
      }
    ]);

    console.log(`Created ${users.length + 1} users`);

    // Create Products
    console.log('Creating products...');
    const products = await Product.insertMany([
      {
        name: 'High Visibility Safety Vest - Class 2',
        category: 'Safety Vests',
        description: 'Premium quality high-visibility safety vest with reflective strips, designed for maximum visibility in low-light conditions. ANSI/ISEA 107 compliant.',
        features: ['360° reflective strips', 'Breathable fabric', 'Multiple pockets', 'Adjustable straps'],
        price: 450,
        stock: 100,
        images: ['/uploads/vest1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Polyester',
          'Color': 'Orange',
          'Size': 'M, L, XL',
          'Standard': 'ANSI/ISEA 107'
        }
      },
      {
        name: 'Safety Jacket with Hood',
        category: 'Safety Jackets',
        description: 'Weather-resistant safety jacket with detachable hood and high-visibility reflective tape. Perfect for outdoor work in all weather conditions.',
        features: ['Waterproof', 'Detachable hood', '3M reflective tape', 'Insulated'],
        price: 1200,
        stock: 75,
        images: ['/uploads/jacket1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Polyester with PVC coating',
          'Color': 'Orange/Yellow',
          'Size': 'S, M, L, XL, XXL',
          'Waterproof': 'Yes'
        }
      },
      {
        name: 'Industrial Coverall - Full Body',
        category: 'Coveralls',
        description: 'Heavy-duty full-body coverall with reflective strips for industrial and construction work. Durable and comfortable for long shifts.',
        features: ['Durable cotton blend', 'Reinforced knees', 'Multiple tool pockets', 'Breathable'],
        price: 1800,
        stock: 50,
        images: ['/uploads/coverall1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Cotton-Polyester blend',
          'Color': 'Orange',
          'Size': 'S, M, L, XL, XXL',
          'Weight': 'Medium'
        }
      },
      {
        name: 'Reflective Safety Vest - Mesh',
        category: 'Safety Vests',
        description: 'Lightweight mesh safety vest ideal for hot weather conditions with excellent breathability. Perfect for summer work environments.',
        features: ['Ultra-lightweight', 'Mesh construction', 'Hi-vis reflective strips', 'Cool and comfortable'],
        price: 350,
        stock: 150,
        images: ['/uploads/vest2.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Polyester Mesh',
          'Color': 'Orange/Yellow',
          'Size': 'M, L, XL',
          'Weight': 'Light'
        }
      },
      {
        name: 'Winter Safety Parka',
        category: 'Safety Jackets',
        description: 'Insulated winter parka with high-visibility features for cold weather operations. Keeps workers warm and visible.',
        features: ['Heavy insulation', 'Wind and water resistant', '360° reflective tape', 'Fleece lining'],
        price: 2500,
        stock: 40,
        images: ['/uploads/parka1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Polyester with insulation',
          'Color': 'Orange',
          'Size': 'M, L, XL, XXL',
          'Temperature Rating': '-10°C to 10°C'
        }
      },
      {
        name: 'Flame Resistant Coverall',
        category: 'Coveralls',
        description: 'FR-rated coverall for high-risk environments requiring flame protection. NFPA 2112 certified for maximum safety.',
        features: ['NFPA 2112 certified', 'Arc flash protection', 'Reflective trim', 'Flame resistant'],
        price: 3200,
        stock: 30,
        images: ['/uploads/fr-coverall1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'FR Cotton',
          'Color': 'Orange/Yellow',
          'Size': 'M, L, XL, XXL',
          'Certification': 'NFPA 2112'
        }
      },
      {
        name: 'Class 3 Safety Vest',
        category: 'Safety Vests',
        description: 'High-visibility Class 3 safety vest with enhanced visibility features. Meets highest safety standards for high-risk areas.',
        features: ['Class 3 certification', 'Enhanced visibility', 'Durable construction', 'Multiple sizes'],
        price: 650,
        stock: 80,
        images: ['/uploads/vest3.jpg'],
        status: 'active',
        specifications: {
          'Material': 'Polyester',
          'Color': 'Orange',
          'Size': 'S, M, L, XL, XXL',
          'Standard': 'ANSI/ISEA 107 Class 3'
        }
      },
      {
        name: 'Rain Safety Jacket',
        category: 'Safety Jackets',
        description: 'Waterproof rain safety jacket with high-visibility features. Perfect for monsoon and wet weather conditions.',
        features: ['100% Waterproof', 'Breathable membrane', 'Reflective strips', 'Adjustable cuffs'],
        price: 1500,
        stock: 60,
        images: ['/uploads/rain-jacket1.jpg'],
        status: 'active',
        specifications: {
          'Material': 'PVC Coated Polyester',
          'Color': 'Yellow/Orange',
          'Size': 'M, L, XL, XXL',
          'Waterproof Rating': '10,000mm'
        }
      }
    ]);

    console.log(`Created ${products.length} products`);

    // Create Orders
    console.log('Creating orders...');
    const orders = await Order.insertMany([
      {
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 10,
            price: products[0].price,
            customization: {}
          },
          {
            product: products[3]._id,
            quantity: 5,
            price: products[3].price,
            customization: {}
          }
        ],
        totalAmount: 6250,
        status: 'delivered',
        shippingAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        trackingNumber: 'TRK123456789',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card'
      },
      {
        user: users[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 20,
            price: products[1].price,
            customization: {}
          }
        ],
        totalAmount: 24000,
        status: 'processing',
        shippingAddress: {
          name: 'Jane Smith',
          phone: '+91 98765 43212',
          address: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer'
      },
      {
        user: users[2]._id,
        items: [
          {
            product: products[2]._id,
            quantity: 15,
            price: products[2].price,
            customization: {}
          }
        ],
        totalAmount: 27000,
        status: 'shipped',
        shippingAddress: {
          name: 'Raj Kumar',
          phone: '+91 98765 43213',
          address: '789 Industrial Area',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        trackingNumber: 'TRK987654321',
        paymentStatus: 'paid',
        paymentMethod: 'UPI'
      },
      {
        user: users[0]._id,
        items: [
          {
            product: products[4]._id,
            quantity: 8,
            price: products[4].price,
            customization: {}
          }
        ],
        totalAmount: 20000,
        status: 'pending',
        shippingAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        paymentStatus: 'pending',
        paymentMethod: 'Cash on Delivery'
      }
    ]);

    console.log(`Created ${orders.length} orders`);

    // Create Wishlists
    console.log('Creating wishlists...');
    await Wishlist.insertMany([
      {
        user: users[0]._id,
        items: [
          { product: products[0]._id },
          { product: products[1]._id }
        ]
      },
      {
        user: users[1]._id,
        items: [
          { product: products[2]._id },
          { product: products[4]._id },
          { product: products[5]._id }
        ]
      },
      {
        user: users[2]._id,
        items: [
          { product: products[3]._id }
        ]
      }
    ]);

    console.log('Created 3 wishlists');

    // Create Notifications
    console.log('Creating notifications...');
    await Notification.insertMany([
      {
        user: users[0]._id,
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #ORD-002 has been shipped and is on its way.',
        read: false,
        link: `/orders/${orders[1]._id}`
      },
      {
        user: users[0]._id,
        type: 'promotion',
        title: 'Special Discount',
        message: 'Get 20% off on all safety jackets this week!',
        read: false,
        link: '/products?category=safety-jackets'
      },
      {
        user: users[0]._id,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #ORD-001 has been delivered successfully.',
        read: true,
        link: `/orders/${orders[0]._id}`
      },
      {
        user: users[1]._id,
        type: 'order',
        title: 'Order Processing',
        message: 'Your order is being processed and will be shipped soon.',
        read: false,
        link: `/orders/${orders[1]._id}`
      },
      {
        user: users[2]._id,
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully.',
        read: true,
        link: '/profile'
      },
      {
        user: users[2]._id,
        type: 'promotion',
        title: 'New Product Launch',
        message: 'Check out our new flame-resistant coverall collection!',
        read: false,
        link: '/products'
      }
    ]);

    console.log('Created 6 notifications');

    // Create Contact Inquiries
    console.log('Creating contact inquiries...');
    await Contact.insertMany([
      {
        fullName: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91 98765 43220',
        inquiryType: 'bulk',
        message: 'I need to place a bulk order for 500 safety vests. Please provide pricing and delivery timeline.',
        status: 'new'
      },
      {
        fullName: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 98765 43221',
        inquiryType: 'customization',
        message: 'Can you customize safety jackets with our company logo? What are the minimum order quantities?',
        status: 'read'
      },
      {
        fullName: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 98765 43222',
        inquiryType: 'product',
        message: 'Do you have flame-resistant coveralls in stock? Need urgent delivery.',
        status: 'replied'
      },
      {
        fullName: 'Anjali Mehta',
        email: 'anjali@example.com',
        inquiryType: 'support',
        message: 'I have not received my order yet. Order number: ORD-123. Please help.',
        status: 'new'
      },
      {
        fullName: 'Rohit Sharma',
        email: 'rohit@example.com',
        phone: '+91 98765 43223',
        inquiryType: 'other',
        message: 'Interested in becoming a distributor. Please contact me.',
        status: 'new'
      }
    ]);

    console.log('Created 5 contact inquiries');

    // Create Customizations
    console.log('Creating customizations...');
    await Customization.insertMany([
      {
        user: users[0]._id,
        productType: 'safety-vest',
        primaryColor: 'Orange (Hi-Vis)',
        size: 'L',
        reflectiveTape: true,
        companyLogo: 'ABC Industries',
        logoPlacement: 'Front Center',
        quantity: 50,
        estimatedPrice: 22500,
        status: 'submitted'
      },
      {
        user: users[1]._id,
        productType: 'safety-jacket',
        primaryColor: 'Yellow (Hi-Vis)',
        size: 'XL',
        reflectiveTape: true,
        companyLogo: 'XYZ Construction',
        logoPlacement: 'Back Center',
        quantity: 100,
        estimatedPrice: 120000,
        status: 'processing'
      },
      {
        user: users[2]._id,
        productType: 'coverall',
        primaryColor: 'Orange (Hi-Vis)',
        size: 'M',
        reflectiveTape: true,
        companyLogo: 'Safety First Ltd',
        logoPlacement: 'Left Chest',
        quantity: 75,
        estimatedPrice: 135000,
        status: 'draft'
      }
    ]);

    console.log('Created 3 customizations');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@trana.com / password123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('User: raj@example.com / password123');
    console.log('User: priya@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed
seedData();

