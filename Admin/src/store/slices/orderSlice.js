import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      items: 1,
      date: '15/11/2024',
      paymentMethod: 'Bank Transfer',
      total: 22500,
      status: 'delivered',
      deliveryAgent: 'Blue Dart',
    },
    {
      id: 'ORD-002',
      customer: 'Priya Sharma',
      email: 'priya@example.com',
      items: 2,
      date: '1/12/2024',
      paymentMethod: 'UPI',
      total: 40500,
      status: 'shipped',
      deliveryAgent: 'DTDC',
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      email: 'amit@example.com',
      items: 1,
      date: '5/12/2024',
      paymentMethod: 'Credit Card',
      total: 180000,
      status: 'packed',
      deliveryAgent: null,
    },
    {
      id: 'ORD-004',
      customer: 'Sunita Verma',
      email: 'sunita@example.com',
      items: 1,
      date: '7/12/2024',
      paymentMethod: 'COD',
      total: 37500,
      status: 'pending',
      deliveryAgent: null,
    },
  ],
  loading: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrderStatus: (state, action) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
  },
});

export const { updateOrderStatus, addOrder } = orderSlice.actions;
export default orderSlice.reducer;

