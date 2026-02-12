import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrders(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrder(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, deliveryAgent, paymentStatus, trackingNumber }, { rejectWithValue }) => {
    try {
      const data = await orderService.updateOrderStatus(id, status, deliveryAgent, paymentStatus, trackingNumber);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.data;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          const updatedOrder = action.payload.data;
          const orderId = updatedOrder._id || updatedOrder.id;
          
          // Update in orders array
          const index = state.orders.findIndex(
            (o) => (o._id || o.id) === orderId
          );
          if (index !== -1) {
            // Merge the updated order data to preserve all fields
            state.orders[index] = { ...state.orders[index], ...updatedOrder };
          }
          
          // Update single order if it matches
          if (state.order && (state.order._id || state.order.id) === orderId) {
            state.order = { ...state.order, ...updatedOrder };
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;

