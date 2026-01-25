import api from './api';

export const orderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (and optional delivery agent and payment status)
  updateOrderStatus: async (id, status, deliveryAgent, paymentStatus) => {
    const payload = {};
    if (status !== undefined && status !== null) {
      payload.status = status;
    }
    if (deliveryAgent !== undefined && deliveryAgent !== null) {
      payload.deliveryAgent = deliveryAgent;
    }
    if (paymentStatus !== undefined && paymentStatus !== null) {
      payload.paymentStatus = paymentStatus;
    }
    const response = await api.put(`/orders/${id}/status`, payload);
    return response.data;
  },
};

