# 🛡️ Shivam Hosiery - E-Commerce Platform

> A comprehensive monorepo containing a complete e-commerce platform for safety apparel (vests, jackets, coveralls) with customer storefront, admin dashboard, and corporate website.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Applications](#running-the-applications)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

**Shivam Hosiery** is a full-stack e-commerce solution designed specifically for safety apparel businesses. The platform enables:

- **Customers**: Browse products, manage carts, place orders, track shipments, and review products
- **Administrators**: Manage inventory, process orders, handle customer relations, and view analytics
- **Site Visitors**: Access corporate information via the Shivam Frontend

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend API** | Node.js + Express + MongoDB |
| **Admin Dashboard** | React 19 + Vite + Redux Toolkit |
| **Customer Storefront** | React 19 + Vite + Redux Toolkit + Tailwind CSS |
| **Corporate Website** | React 19 + Vite + Tailwind v4 |
| **Deployment** | Vercel (frontends), Self-hosted (backend) |

---

## ✨ Key Features

### 🛍️ Customer Storefront (Tarana/Frontend)
- ✅ Product browsing with category filtering and search
- ✅ Shopping cart with persistent state
- ✅ Secure checkout with delivery zone-based shipping
- ✅ User authentication (register/login)
- ✅ Order history and real-time tracking
- ✅ Wishlist management
- ✅ Product reviews and ratings
- ✅ Push notifications for order updates
- ✅ Custom product request system

### 🎛️ Admin Dashboard (Admin/)
- ✅ Complete product catalog management (CRUD)
- ✅ Order processing and status management
- ✅ Customer relationship management
- ✅ Delivery zone configuration
- ✅ Brand and client portfolio management
- ✅ Invoice generation and payment tracking
- ✅ Reports and analytics
- ✅ Admin user management

### 🏢 Corporate Website (Shivam/Frontend)
- ✅ Company information and branding
- ✅ Portfolio showcase
- ✅ Responsive design across all devices

---

## 📁 Project Structure

```
Shivam-Hosiery/
├── Admin/                              # Admin Dashboard (React + Vite)
│   ├── src/
│   │   ├── components/                # UI components & modals
│   │   ├── pages/                     # Page components
│   │   ├── services/                  # API service layer
│   │   ├── store/                     # Redux slices
│   │   └── main.jsx                   # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── Tarana/                             # Main product directory
│   ├── Backend/                        # Node.js/Express API
│   │   ├── app.js                     # Express server setup
│   │   ├── config/
│   │   │   └── database.js            # MongoDB connection
│   │   ├── models/                    # Mongoose schemas
│   │   ├── controllers/               # Business logic
│   │   ├── routes/                    # API endpoints
│   │   ├── middlewares/               # Auth, cache, error handling
│   │   ├── services/                  # Helper services
│   │   ├── utils/                     # Utility functions
│   │   ├── uploads/                   # File storage
│   │   └── package.json
│   │
│   └── Frontend/                       # Customer Storefront (React + Vite)
│       ├── src/
│       │   ├── components/            # Reusable components
│       │   ├── pages/                 # Page components
│       │   ├── services/              # API service layer
│       │   ├── store/                 # Redux slices
│       │   └── main.jsx               # Entry point
│       ├── package.json
│       ├── vite.config.js
│       └── vercel.json
│
├── Shivam/                             # Corporate website
│   └── Frontend/                       # React + Vite
│       ├── src/
│       ├── package.json
│       └── vite.config.js
│
└── README.md                           # This file
```

---

## 🏗️ Architecture

### System Overview

The platform follows a **client-server architecture** with multiple frontend applications consuming a shared backend API.

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients (Browsers)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ Storefront       │  │ Admin Dashboard  │  │  Corporate │ │
│  │ (Tarana/Frontend)│  │ (Admin/)         │  │  (Shivam/) │ │
│  └──────────────────┘  └──────────────────┘  └────────────┘ │
│  (React 19 + Vite)     (React 19 + Vite)  (React 19 + Vite)  │
│  (Redux Toolkit)       (Redux Toolkit)                        │
└─────────────────────────────────────────────────────────────┘
                              ↕
                        JWT Authentication
                        (Axios Interceptors)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                     │
│                    (Tarana/Backend)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ REST Routes     │  │ Controllers  │  │  Middlewares   │ │
│  │ • Auth          │  │ • Auth       │  │  • JWT Auth    │ │
│  │ • Products      │  │ • Products   │  │  • Caching     │ │
│  │ • Orders        │  │ • Orders     │  │  • Pagination  │ │
│  │ • Users         │  │ • Users      │  │  • Error       │ │
│  │ • Wishlist      │  │ • Wishlist   │  │    Handler     │ │
│  │ • Notifications │  │ • Reviews    │  │  • Multer      │ │
│  │ • Admin         │  │ • Brands     │  │    Upload      │ │
│  │ • Brands        │  │ • Clients    │  │                │ │
│  │ • Delivery      │  │ • Delivery   │  │                │ │
│  │   Zones         │  │   Zones      │  │                │ │
│  │ • File Upload   │  │ • Notif      │  │                │ │
│  └─────────────────┘  └──────────────┘  └────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Services & Utils                           │  │
│  │  • Invoice Generation                               │  │
│  │  • Email Notifications                              │  │
│  │  • Image Generation (Stability AI)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    Node-Cache (in-memory)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐  │
│  │  Users   │ │ Products │ │ Orders     │ │ Wishlist   │  │
│  │  Brands  │ │ Reviews  │ │ Notif      │ │ Contact    │  │
│  │ Clients  │ │Delivery  │ │ Custom     │ │ Categories │  │
│  │          │ │ Zones    │ │ Requests   │ │            │  │
│  └──────────┘ └──────────┘ └────────────┘ └────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Backend Components

#### Express Server (`Tarana/Backend/app.js`)
- **Configuration**: Environment variables via `dotenv`
- **Database**: MongoDB connection via Mongoose
- **Middleware Stack**:
  - JSON/URL-encoded body parser
  - CORS configuration
  - Static file serving (`/uploads`)
  - Error handling centralization
- **Routes**: Registered under `/api/*` namespace

#### Authentication & Authorization
- **Type**: JWT (JSON Web Tokens)
- **Location**: `Tarana/Backend/middlewares/auth.js`
- **Flow**: 
  - User registers/logs in → JWT token generated
  - Token stored in client localStorage
  - Axios interceptors automatically inject token in request headers
  - Protected routes validate token and user role
- **Roles**: `user` (customer), `admin` (administrator)

#### Caching Layer
- **Tool**: `node-cache`
- **Implementation**: `Tarana/Backend/middlewares/cache.js`
- **Strategy**:
  - Read endpoints cached with TTL (e.g., 300 seconds)
  - Mutations automatically clear related cache keys
  - Example: Product list cached, creating/updating clears cache

#### File Upload
- **Tool**: Multer
- **Location**: `Tarana/Backend/middlewares/upload.js`
- **Endpoint**: `POST /api/upload`
- **Storage**: `/uploads` directory with timestamp-based naming

#### Pagination
- **Middleware**: `Tarana/Backend/middlewares/pagination.js`
- **Default**: page=1, limit=10
- **Response**: Includes total count and current page in metadata

---

## 🗄️ Database Schema

### Models Overview

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Authentication & profiles | email, password, role, address, phone |
| **Product** | Catalog items | name, category, price, stock, images, specifications |
| **Order** | Customer purchases | user, items, status, shippingAddress, trackingNumber |
| **OrderItem** | Line items in orders | product, quantity, price, customization |
| **Wishlist** | Saved products | user, items[] |
| **Review** | Product ratings | product, user, rating, comment |
| **Brand** | Brand portfolio | name, logo, category, description |
| **Client** | Client portfolio | name, logo, websiteUrl |
| **DeliveryZone** | Shipping areas | pincodes[], deliveryCharge, status |
| **Notification** | User alerts | user, type, title, message, read |
| **Contact** | Contact form submissions | name, email, message, status |
| **Customization** | Custom requests | user, description, status |
| **Category** | Product categories | name, description |

### Key Relationships

```
User (1) ──── (Many) Order
User (1) ──── (Many) Wishlist
User (1) ──── (Many) Review
User (1) ──── (Many) Notification
User (1) ──── (Many) Contact

Product (1) ──── (Many) Order (via OrderItem)
Product (1) ──── (Many) Review
Product (1) ──── (Many) Wishlist

Order (1) ──── (Many) Notification
Order (Many) ──── (1) DeliveryZone

Product (Many) ──── (1) Category
Product (Many) ──── (1) Brand
```

### Indexes for Performance

| Model | Indexes |
|-------|---------|
| Product | `{ name, description }` (text), `{ category, status }` (compound) |
| Order | `{ user, createdAt }`, `{ status }` |
| Brand | `{ name, description }` (text), `{ status }` |
| Client | `{ name }` (text), `{ status, category }` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: Local instance or cloud URI (MongoDB Atlas)
- **Git**: For version control

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jitendrakumar99/Shivam-Hosiery.git
   cd Shivam-Hosiery
   ```

2. **Verify structure**
   ```bash
   ls -la  # Should show Admin/, Tarana/, Shivam/, README.md
   ```

---

## ⚙️ Environment Configuration

### Backend Configuration (`Tarana/Backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shivam-hosiery
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shivam-hosiery

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=30d

# Email Notifications
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# File Upload
UPLOAD_DIR=uploads

# Optional: Image Generation
STABILITY_AI_KEY=your-stability-ai-key (optional)
```

### Frontend Configuration

Create `.env` files in `Admin/`, `Tarana/Frontend/`, and `Shivam/Frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
# OR for production:
# VITE_API_URL=https://api.shivamhosiery.com/api
```

---

## 🏃 Running the Applications

### 1. Backend Server

```bash
cd Tarana/Backend

# Install dependencies
npm install

# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start

# Seed database (optional - populate with sample data)
npm run seed
```

**Expected Output**:
```
Connected to MongoDB
Server running on http://localhost:3000
```

### 2. Customer Storefront

```bash
cd Tarana/Frontend

# Install dependencies
npm install

# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### 3. Admin Dashboard

```bash
cd Admin

# Install dependencies
npm install

# Start development server (default: http://localhost:5174)
npm run dev

# Build for production
npm run build
```

### 4. Corporate Website

```bash
cd Shivam/Frontend

# Install dependencies
npm install

# Start development server (default: http://localhost:5175)
npm run dev

# Build for production
npm run build
```

### Running All Applications (Terminal Multiplexing)

Use `tmux` or multiple terminal windows:

```bash
# Terminal 1: Backend
cd Tarana/Backend && npm run dev

# Terminal 2: Storefront
cd Tarana/Frontend && npm run dev

# Terminal 3: Admin
cd Admin && npm run dev

# Terminal 4: Corporate Site
cd Shivam/Frontend && npm run dev
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

### Response Format

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Core Endpoints

#### Authentication
```
POST   /auth/register          # Create new account
POST   /auth/login             # Login and get JWT token
GET    /auth/me                # Get current user profile
PUT    /auth/profile           # Update user profile
```

#### Products
```
GET    /products               # Get all products (paginated, filterable)
  ?category=Safety%20Vests&search=vest&status=active&page=1&limit=10
GET    /products/:id           # Get product details
POST   /products               # Create product (admin only)
PUT    /products/:id           # Update product (admin only)
DELETE /products/:id           # Delete product (admin only)
```

#### Orders
```
GET    /orders                 # Get user's orders or all (admin)
GET    /orders/:id             # Get order details
POST   /orders                 # Create new order
  Body: { items: [{ productId, quantity }], shippingAddress, paymentMethod }
PUT    /orders/:id/status      # Update order status (admin only)
PUT    /orders/:id/cancel      # Cancel order (if eligible)
```

#### Wishlist
```
GET    /wishlist               # Get user's wishlist
POST   /wishlist               # Add product to wishlist
  Body: { productId }
DELETE /wishlist/:productId    # Remove from wishlist
```

#### Reviews
```
GET    /reviews                # Get product reviews
POST   /reviews                # Create review
  Body: { productId, rating, comment }
PUT    /reviews/:id            # Update review
DELETE /reviews/:id            # Delete review
```

#### Notifications
```
GET    /notifications          # Get user notifications
PUT    /notifications/:id/read # Mark as read
PUT    /notifications/read-all # Mark all as read
DELETE /notifications/:id      # Delete notification
```

#### Admin - Orders Management
```
GET    /admin/orders           # Get all orders
PUT    /admin/orders/:id/status # Update status + tracking info
GET    /admin/orders/:id       # Get order details
```

#### Admin - Products
```
POST   /admin/products         # Create product
PUT    /admin/products/:id     # Update product
DELETE /admin/products/:id     # Delete product
```

#### File Upload
```
POST   /upload                 # Upload image
  Headers: Content-Type: multipart/form-data
  Field: file (binary)
  Response: { file: { filename, path: "/uploads/..." } }
```

---

## 🌍 Deployment

### Frontend Deployment (Vercel)

All three frontends use **Vercel** for hosting with automatic deployments on git push.

#### Vercel Configuration Files

Each frontend has a `vercel.json` for SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Deployment Steps

1. **Connect Vercel to GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Import the repository
   - Vercel auto-detects Vite config

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://api.shivamhosiery.com/api
   ```

3. **Deploy**
   ```bash
   git push origin main  # Auto-triggers Vercel deployment
   ```

### Backend Deployment

#### Option 1: Self-hosted with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
cd Tarana/Backend
npm install --production
pm2 start app.js --name "shivam-api"

# Auto-restart on reboot
pm2 startup
pm2 save

# View logs
pm2 logs shivam-api
```

#### Option 2: Docker

Create `Tarana/Backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

Build and run:

```bash
docker build -t shivam-api .
docker run -e MONGO_URI=mongodb://mongo:27017/shivam -p 3000:3000 shivam-api
```

#### Option 3: Heroku/Railway

```bash
# Configure environment variables via dashboard
heroku config:set JWT_SECRET=xxx MONGO_URI=xxx

# Deploy
git push heroku main
```

### Database Setup

#### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Whitelist IP and create database user
4. Get connection URI
5. Set `MONGO_URI` in `.env`

#### Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS:
brew tap mongodb/brew && brew install mongodb-community

# Start the service
brew services start mongodb-community

# Verify connection
mongosh  # Open MongoDB shell
```

---

## 🔧 Troubleshooting

### Issue: Backend won't start - MongoDB connection error

**Solution**:
- Verify MongoDB is running: `mongosh` or `mongo`
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Issue: Frontend shows 401 Unauthorized on API calls

**Solution**:
- Verify token is stored in localStorage after login
- Check `VITE_API_URL` environment variable
- Verify backend is running and CORS is enabled
- Check browser console for token value

### Issue: File upload returns 400 "No file uploaded"

**Solution**:
- Ensure `Content-Type: multipart/form-data` in request
- Verify field name is `file` (not `files` or other)
- Check upload directory permissions: `chmod 755 Tarana/Backend/uploads`

### Issue: Stale product data showing in storefront

**Solution**:
- Cache TTL is 300 seconds by default
- Force refresh: Admin updates clear cache automatically
- Hard browser refresh: Ctrl+Shift+R (Chrome/Firefox)

### Issue: Build fails with "command not found: npm"

**Solution**:
- Install Node.js v18+: [nodejs.org](https://nodejs.org/)
- Verify: `node --version` and `npm --version`

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test locally before committing

3. **Commit with conventional format**
   ```bash
   git add .
   git commit -m "feat: add user authentication flow"
   # or
   git commit -m "fix: resolve order status update bug"
   git commit -m "docs: update API documentation"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Merge when approved**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/your-feature-name
   git push origin main
   ```

### Code Style

- **Backend**: ESLint with Node.js rules
- **Frontend**: ESLint + Prettier
- **Database**: Mongoose schema validation

### Testing

```bash
# Backend tests (if available)
cd Tarana/Backend && npm test

# Frontend tests (if available)
cd Tarana/Frontend && npm test
cd Admin && npm test
```

---

## 📚 Documentation

- **Backend Details**: See `Tarana/Backend/README.md`
- **Database Schema**: Full details in `Tarana/Backend/models/`
- **API Routes**: Reference `Tarana/Backend/routes/`
- **Controllers**: Business logic in `Tarana/Backend/controllers/`

---

## 📄 License

Internal project for Shivam Hosiery. All rights reserved.

---

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review recent commits: `git log --oneline`
3. Contact the development team

---

## 🎉 Quick Reference

### Install Everything
```bash
cd Tarana/Backend && npm install
cd ../Frontend && npm install
cd ../../Admin && npm install
cd ../Shivam/Frontend && npm install
```

### Run All Services
```bash
# Terminal 1
cd Tarana/Backend && npm run dev

# Terminal 2
cd Tarana/Frontend && npm run dev

# Terminal 3
cd Admin && npm run dev

# Terminal 4
cd Shivam/Frontend && npm run dev
```

### Useful Commands
```bash
# Seed database
cd Tarana/Backend && npm run seed

# Build all frontends
cd Admin && npm run build
cd ../Tarana/Frontend && npm run build
cd ../Shivam/Frontend && npm run build

# Check git status
git status

# View recent changes
git diff
```

---

**Last Updated**: 2024
**Maintained by**: Shivam Hosiery Development Team
