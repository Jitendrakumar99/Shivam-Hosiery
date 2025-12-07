import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminUsers: [
    {
      id: 1,
      role: 'Super Admin',
      email: 'admin@shivamhosiery.com',
      roleTag: 'admin',
      status: 'Active',
      permissions: ['all'],
    },
    {
      id: 2,
      role: 'Inventory Manager',
      email: 'inventory@shivamhosiery.com',
      roleTag: 'inventory',
      status: 'Active',
      permissions: ['products', 'inventory', 'stock'],
    },
    {
      id: 3,
      role: 'Customer Support',
      email: 'support@shivamhosiery.com',
      roleTag: 'support',
      status: 'Active',
      permissions: ['orders', 'customers', 'reviews'],
    },
  ],
  loading: false,
};

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    addAdminUser: (state, action) => {
      state.adminUsers.push(action.payload);
    },
    updateAdminUser: (state, action) => {
      const index = state.adminUsers.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.adminUsers[index] = action.payload;
      }
    },
    deleteAdminUser: (state, action) => {
      state.adminUsers = state.adminUsers.filter(u => u.id !== action.payload);
    },
  },
});

export const { addAdminUser, updateAdminUser, deleteAdminUser } = adminUserSlice.actions;
export default adminUserSlice.reducer;

