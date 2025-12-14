import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

const initialState = {
  metrics: {
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0,
    avgOrderValue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    newContacts: 0,
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
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
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
  error: null,
};

// Async thunks
export const fetchStats = createAsyncThunk(
  'reports/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const stats = action.payload.data;
          state.metrics = {
            totalRevenue: stats.totalRevenue || 0,
            revenueGrowth: 0, // Calculate from previous data if needed
            totalOrders: stats.totalOrders || 0,
            ordersGrowth: 0,
            totalCustomers: stats.totalUsers || 0,
            customersGrowth: 0,
            avgOrderValue: stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders) : 0,
            totalProducts: stats.totalProducts || 0,
            pendingOrders: stats.pendingOrders || 0,
            newContacts: stats.newContacts || 0,
          };
        }
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateMetrics, clearError } = reportSlice.actions;
export default reportSlice.reducer;

