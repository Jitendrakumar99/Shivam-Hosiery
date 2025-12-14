import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

const initialState = {
  customers: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await adminService.getUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customers'
      );
    }
  }
);

export const updateCustomerStatus = createAsyncThunk(
  'customers/updateCustomerStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateUserStatus(id, isActive);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update customer status'
      );
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Customer Status
      .addCase(updateCustomerStatus.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.customers.findIndex(
            (c) => c._id === action.payload.data._id
          );
          if (index !== -1) {
            state.customers[index] = action.payload.data;
          }
        }
      });
  },
});

export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;

