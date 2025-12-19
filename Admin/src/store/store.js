import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import categoryReducer from './slices/categorySlice';
import customerReducer from './slices/customerSlice';
import clientReducer from './slices/clientSlice';
import adminUserReducer from './slices/adminUserSlice';
import paymentReducer from './slices/paymentSlice';
import deliveryReducer from './slices/deliverySlice';
import reportReducer from './slices/reportSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    categories: categoryReducer,
    customers: customerReducer,
    clients: clientReducer,
    adminUsers: adminUserReducer,
    payments: paymentReducer,
    delivery: deliveryReducer,
    reports: reportReducer,
    reviews: reviewReducer,
  },
});

