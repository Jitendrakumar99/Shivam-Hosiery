import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [
    {
      id: 'TXN-001',
      orderId: 'ORD-001',
      status: 'success',
      amount: 22500,
      paymentMethod: 'Bank Transfer',
      date: '15/11/2024',
    },
    {
      id: 'TXN-002',
      orderId: 'ORD-002',
      status: 'success',
      amount: 40500,
      paymentMethod: 'UPI',
      date: '1/12/2024',
    },
    {
      id: 'TXN-003',
      orderId: 'ORD-003',
      status: 'success',
      amount: 180000,
      paymentMethod: 'Credit Card',
      date: '5/12/2024',
    },
    {
      id: 'TXN-004',
      orderId: 'ORD-004',
      status: 'pending',
      amount: 37500,
      paymentMethod: 'COD',
      date: '7/12/2024',
    },
  ],
  summary: {
    successful: 243000,
    pending: 37500,
    failed: 0,
    refunded: 0,
  },
  loading: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
  },
});

export const { addTransaction, updateTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;

