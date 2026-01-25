import { createSlice } from '@reduxjs/toolkit';

// Helper function to convert orders to transactions
export const buildTransactionsFromOrders = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];
  
  return orders.map((order) => {
    const orderId = order._id || order.id;
    const paymentStatus = (order.paymentStatus || 'pending').toLowerCase();
    const totalAmount = Number(order.totalAmount || order.total || 0);
    const shippingCost = Number(order.shippingCost || 0);
    const grandTotal = totalAmount + shippingCost;
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    
    // Map payment status to transaction status
    let status = 'pending';
    if (paymentStatus === 'paid') {
      status = 'success';
    } else if (paymentStatus === 'failed') {
      status = 'failed';
    } else if (paymentStatus === 'refunded') {
      status = 'refunded';
    } else {
      status = 'pending';
    }
    
    return {
      id: `TXN-${orderId.toString().slice(-8)}`,
      orderId: orderId.toString(),
      status: status,
      amount: grandTotal,
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      date: createdAt.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      datetime: createdAt.toISOString(),
      customer: order.user?.name || order.customer || 'N/A',
      customerEmail: order.user?.email || order.email || 'N/A',
      orderStatus: order.status || 'pending',
      paymentStatus: paymentStatus,
    };
  });
};

// Helper function to calculate summary from transactions
// For successful payments, only count delivered/shipped orders to match revenue calculation
export const calculateSummaryFromTransactions = (transactions) => {
  const summary = {
    successful: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
  };
  
  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount || 0);
    switch (transaction.status) {
      case 'success':
        // Only count successful payments for delivered/shipped orders (to match revenue calculation)
        if (transaction.orderStatus === 'delivered' || transaction.orderStatus === 'shipped') {
          summary.successful += amount;
        } else {
          // If paid but not delivered/shipped yet, count as pending
          summary.pending += amount;
        }
        break;
      case 'pending':
        summary.pending += amount;
        break;
      case 'failed':
        summary.failed += amount;
        break;
      case 'refunded':
        summary.refunded += amount;
        break;
      default:
        summary.pending += amount;
    }
  });
  
  return summary;
};

const initialState = {
  transactions: [],
  summary: {
    successful: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
  },
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.summary = calculateSummaryFromTransactions(action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
        state.summary = calculateSummaryFromTransactions(state.transactions);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTransactions, updateTransaction, setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer;

