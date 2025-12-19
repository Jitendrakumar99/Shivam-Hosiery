# Shivam Hosiery Monorepo

Comprehensive documentation for the Shivam Hosiery monorepo, containing the Tarana backend API, storefront frontend, and an Admin frontend. This document consolidates architecture, environments, setup, runtime, APIs, data models, and conventions used across the project.

- Repo root: g:/New_HC/Shivam-Hosiery
- Subprojects:
  - Tarana/Backend — Node.js/Express REST API with MongoDB (Mongoose)
  - Tarana/Frontend — React + Vite storefront (Redux Toolkit)
  - Admin — React + Vite admin dashboard (Redux Toolkit)
  - Shivam/Frontend — React + Vite site (lightweight)

# Architecture Overview

- Backend (Tarana/Backend)
  - Express app entry at app.js
  - MongoDB via Mongoose; connection in config/database.js
  - REST resources: Auth, Products, Orders, Wishlist, Notifications, Contact, Customizations, Admin, Brands, Clients, Delivery Zones, File Uploads
  - Controllers implement business logic; Routes apply middlewares (auth, pagination, caching)
  - Caching via node-cache (middlewares/cache)
  - Pagination via middlewares/pagination
  - JWT Authentication (middlewares/auth, utils/generateToken.js)
  - Multer-based file uploads served from /uploads

- Frontends (React + Vite)
  - Admin: Admin dashboard using React 19, Redux Toolkit, React Router
  - Tarana Frontend: Storefront app using React 19, Redux Toolkit, Tailwind CSS
  - Shared: Axios with interceptors, JWT in localStorage, protected routes

# Repository Structure

- Admin/
  - package.json, src/
  - src/services/api.js (Axios base, interceptors)
  - src/store/store.js (Redux slices wiring)
- Tarana/
  - Backend/
    - app.js (server setup and routes)
    - config/database.js (Mongoose connection)
    - routes/*.js (resource routing)
    - controllers/*.js (business logic)
    - models/*.js (Mongoose schemas)
    - middlewares/*.js (auth, cache, pagination, error handler)
    - utils/generateToken.js
    - scripts/seedData.js
  - Frontend/
    - package.json, vite.config.js, tailwind config, src/
- Shivam/
  - Frontend/
    - package.json, vite.config.js, src/

# Environments & Configuration

- Global Requirements
  - Node.js LTS (18+ recommended)
  - MongoDB (local or remote)

- Tarana/Backend .env
  - PORT=3000
  - NODE_ENV=development
  - MONGO_URI=mongodb://localhost:27017/trana-safety
  - JWT_SECRET=your-secret-key
  - JWT_EXPIRE=30d
  - EMAIL=your-email@gmail.com
  - EMAIL_PASSWORD=your-app-password

- Frontend .env (Admin, Tarana/Frontend, Shivam/Frontend)
  - VITE_API_URL=http://localhost:3000/api

# Install & Run

- Tarana Backend
  - cd Tarana/Backend
  - npm install
  - npm run dev (development, nodemon)
  - npm start (production)

- Tarana Frontend (Storefront)
  - cd Tarana/Frontend
  - npm install
  - npm run dev (default Vite port)

- Admin Frontend
  - cd Admin
  - npm install
  - npm run dev

- Shivam Frontend
  - cd Shivam/Frontend
  - npm install
  - npm run dev

# Backend Services

- Server entry: app.js
  - Loads env via dotenv
  - Connects Mongo via connectDB()
  - Parses JSON and urlencoded bodies
  - Sets CORS
  - Serves static /uploads
  - Registers routes under /api/*
  - File upload endpoint POST /api/upload (multer)
  - Health check GET /
  - Centralized error handler

- Middlewares
  - middlewares/auth.js — protect (JWT), authorize(role)
  - middlewares/pagination.js — injects pagination (page, limit) to req.pagination
  - middlewares/cache.js — node-cache with cache(ttlSec), clearCache(key)
  - middlewares/errorHandler.js — uniform error responses

# Data Models (Mongoose)

- Product (models/Product.js)
  - name, category ['Safety Vests','Safety Jackets','Coveralls'], description, features[], price, stock, images[], status ['active','inactive'], specifications(Map)
  - Indexes: text(name, description), category+status

- Order (models/Order.js)
  - user(ref User), items[{product(ref Product), quantity, price, customization(Map)}], totalAmount, status ['pending','processing','shipped','delivered','cancelled'], shippingAddress{name,phone,address,city,state,pincode}, trackingNumber, deliveryAgent, shippingCost, deliveryZone(ref DeliveryZone), paymentStatus ['pending','paid','failed'], paymentMethod
  - Indexes: user+createdAt, status

- Brand (models/Brand.js)
  - name(unique), category, slogan, description, image, websiteUrl, status
  - Indexes: text(name, description), status

- Client (models/Client.js)
  - name, category, logo, websiteUrl, status
  - Indexes: text(name), status+category

- Wishlist (models/Wishlist.js) — referenced by wishlistController.js
  - user(ref User), items[{ product(ref Product) }]

- DeliveryZone (models/DeliveryZone.js) — referenced by orderController.js
  - status, pincodes[], deliveryCharge

- Notification (models/Notification.js) — referenced by orderController.js
  - user(ref User), type, title, message, link, read

- User (models/User.js) — referenced by auth routes
  - JWT-based auth, roles: 'user','admin'

# API Surface (Selected)

Base URL: http://localhost:3000/api
Auth: Authorization: Bearer <token>
Response format: { success: boolean, data?: any, message?: string, pagination?: {...} }

- Auth
  - POST /auth/register
  - POST /auth/login
  - GET /auth/me
  - PUT /auth/profile

- Products (routes/productRoutes.js; controller/productController.js)
  - GET /products?category=&search=&status=&page=&limit=
  - GET /products/:id
  - POST /products (admin)
  - PUT /products/:id (admin)
  - DELETE /products/:id (admin)

- Orders (routes/orderRoutes.js; controller/orderController.js)
  - GET /orders?status=&page=&limit= (user sees own orders, admin sees all)
  - GET /orders/:id (owner or admin)
  - POST /orders
    - Validates items[], shippingAddress (name, phone, address, pincode)
    - Resolves DeliveryZone by pincode; computes shippingCost
    - Decrements product stock; creates Notification
  - PUT /orders/:id/status (admin)
    - Adjusts stock on transitions to/from cancelled
    - Optional: trackingNumber, deliveryAgent, paymentStatus
  - PUT /orders/:id/cancel (owner)
    - Blocks when shipped/delivered; restores stock

- Wishlist (routes/wishlistRoutes.js; controller/wishlistController.js)
  - All require auth
  - GET /wishlist (auto-creates empty wishlist)
  - POST /wishlist { productId }
  - DELETE /wishlist/:productId

- Notifications
  - GET /notifications (pagination)
  - PUT /notifications/:id/read
  - PUT /notifications/read-all
  - DELETE /notifications/:id

- Contact
  - POST /contact (public)
  - GET /contact (admin)
  - PUT /contact/:id/status (admin)

- Customizations
  - POST /customizations
  - GET /customizations
  - GET /customizations/:id
  - PUT /customizations/:id/status (admin)

- Brands, Clients, Delivery Zones
  - CRUD endpoints; common patterns with pagination, caching where safe

- File Upload
  - POST /upload (field: file) → { file: { filename, path: /uploads/<file> } }

# Query & Pagination

- Pagination params: page (default 1), limit (default 10)
- Product filters: category, search, status (default active)
- Order filters: status
- Notification filters: type, read

# Caching Strategy

- Read endpoints like GET /products and GET /products/:id cached (e.g., 300s)
- Mutations clear relevant keys via clearCache()
- Orders are not cached to avoid stale personal data

# Security Model

- JWT-based auth; Bearer token in Authorization header
- Role-based authorization for admin-only actions
- Sensitive mutations protected by middlewares/auth
- Frontend stores token in localStorage; Axios interceptors inject token and redirect to /login on 401

# Frontend Conventions

- State Management: Redux Toolkit slices (Admin and Tarana Frontend)
- API Layer: src/services/api.js (Axios instance, interceptors)
- Routing: react-router-dom v7
- Styling: Tailwind CSS (Tarana Frontend) and Tailwind v4 in Admin/Shivam
- Notifications: react-hot-toast (Tarana Frontend)

# Scripts

- Tarana/Backend/package.json
  - start: node app.js
  - dev: nodemon app.js
  - seed: node scripts/seedData.js

- Frontend (Admin, Tarana/Frontend, Shivam/Frontend)
  - dev, build, preview, lint (Vite-based)

# Error Handling & Responses

- Central error handler returns { success: false, message }
- Controllers return { success: true, data, pagination? }
- Controllers validate inputs and IDs; return 400/404/403 appropriately

# Deployment Notes

- Backend
  - Provide environment variables
  - Serve uploads directory (ensure persistence on host)
  - Scale: Node process manager (PM2), reverse proxy (NGINX), HTTPS termination

- Frontends
  - Build with npm run build
  - Configure VITE_API_URL to backend URL
  - Host static build on any CDN or static host

# Troubleshooting

- 401 from API on frontends
  - Ensure valid token in localStorage
  - Check VITE_API_URL and CORS

- MongoDB connection errors
  - Verify MONGO_URI and server availability

- File upload 400 "No file uploaded"
  - Ensure multipart/form-data with field name file

- Stale product data
  - Caching is enabled — mutations clear cache; if running behind proxy, disable extra caches for dynamic endpoints

# Future Enhancements

- Add comprehensive tests for controllers and models
- CI pipeline for lint/test/build across packages
- Shared UI/components library for frontends
- Role-based feature flagging in UI

# Licensing & Ownership

Internal project for Shivam Hosiery. All rights reserved.
