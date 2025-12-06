# Trana Safety Backend API

Complete RESTful API for Trana Safety e-commerce platform with admin panel support.

## Features

- ✅ User Authentication (JWT)
- ✅ Product Management
- ✅ Order Management
- ✅ Wishlist
- ✅ Notifications
- ✅ Contact Inquiries
- ✅ Customization Requests
- ✅ Admin Dashboard
- ✅ Pagination
- ✅ Caching
- ✅ File Upload

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/trana-safety
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products (with pagination, filtering, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Protected, with pagination)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create new order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (Protected)
- `POST /api/wishlist` - Add to wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (Protected)

### Notifications
- `GET /api/notifications` - Get notifications (Protected, with pagination)
- `PUT /api/notifications/:id/read` - Mark as read (Protected)
- `PUT /api/notifications/read-all` - Mark all as read (Protected)
- `DELETE /api/notifications/:id` - Delete notification (Protected)

### Contact
- `POST /api/contact` - Submit contact inquiry (Public)
- `GET /api/contact` - Get all inquiries (Admin)
- `PUT /api/contact/:id/status` - Update inquiry status (Admin)

### Customizations
- `POST /api/customizations` - Create customization request (Protected)
- `GET /api/customizations` - Get customizations (Protected, with pagination)
- `GET /api/customizations/:id` - Get single customization (Protected)
- `PUT /api/customizations/:id/status` - Update status (Admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin, with pagination)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)

### File Upload
- `POST /api/upload` - Upload file (returns file path)

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Products
- `category` - Filter by category
- `search` - Search in name/description
- `status` - Filter by status (default: active)

### Orders
- `status` - Filter by order status

### Notifications
- `type` - Filter by type (order, promotion, system)
- `read` - Filter by read status (true/false)

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "pagination": {...} // if applicable
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Start Server

```bash
# Development
npm run dev

# Production
npm start
```

