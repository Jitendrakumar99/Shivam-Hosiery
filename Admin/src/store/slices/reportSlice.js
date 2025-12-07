import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    totalRevenue: 827500,
    revenueGrowth: 24.5,
    totalOrders: 26,
    ordersGrowth: 18.2,
    totalCustomers: 4,
    customersGrowth: 32.7,
    avgOrderValue: 31827,
  },
  revenueTrend: [
    { month: 'Jul', revenue: 45000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 65000 },
    { month: 'Oct', revenue: 78000 },
    { month: 'Nov', revenue: 88000 },
    { month: 'Dec', revenue: 92000 },
  ],
  orderStatusDistribution: {
    pending: 1,
    packed: 1,
    shipped: 1,
    delivered: 1,
  },
  categoryDistribution: {
    'Safety Vests': 33,
    'Safety Jackets': 33,
    'Coveralls': 33,
  },
  couponPerformance: [
    { code: 'WELCOME50', description: 'Welcome discount for new customers', used: 45, total: 100 },
    { code: 'BULK500', description: 'Flat discount on bulk orders', used: 23, total: 50 },
    { code: 'SAFETY15', description: 'Special discount on safety products', used: 87, total: 200 },
  ],
  loading: false,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
  },
});

export const { updateMetrics } = reportSlice.actions;
export default reportSlice.reducer;

