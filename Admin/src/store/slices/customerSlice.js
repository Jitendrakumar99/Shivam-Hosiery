import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      address: 'Industrial Area, Raipur, CG',
      joined: '15/6/2023',
      totalOrders: 12,
      totalSpent: 245000,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      address: 'Sector 5, Noida, UP',
      joined: '20/8/2023',
      totalOrders: 8,
      totalSpent: 156000,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+91 98765 43212',
      address: 'Gandhinagar, Ahmedabad, GJ',
      joined: '10/1/2024',
      totalOrders: 5,
      totalSpent: 389000,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sunita Verma',
      email: 'sunita@example.com',
      phone: '+91 98765 43213',
      address: 'MG Road, Bangalore, KA',
      joined: '5/11/2024',
      totalOrders: 1,
      totalSpent: 37500,
      status: 'Active',
    },
  ],
  loading: false,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlice.actions;
export default customerSlice.reducer;

