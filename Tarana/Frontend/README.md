# Trana Safety Frontend

Modern React application with Redux Toolkit for state management.

## Features

- ✅ Redux Toolkit for state management
- ✅ Secure API integration with Axios interceptors
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Responsive Design with Tailwind CSS
- ✅ Product Management
- ✅ Order Management
- ✅ Wishlist
- ✅ Notifications

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Redux Store Structure

- `auth` - Authentication state
- `products` - Products state
- `orders` - Orders state
- `wishlist` - Wishlist state
- `notifications` - Notifications state

## Security Features

- JWT token stored in localStorage
- Automatic token injection in API requests
- Automatic logout on 401 errors
- Protected routes for authenticated pages
- Secure API service with interceptors
