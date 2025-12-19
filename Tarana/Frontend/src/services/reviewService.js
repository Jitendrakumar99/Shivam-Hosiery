import api from './api';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Like review
  likeReview: async (id) => {
    const response = await api.put(`/reviews/${id}/like`);
    return response.data;
  },

  // Dislike review
  dislikeReview: async (id) => {
    const response = await api.put(`/reviews/${id}/dislike`);
    return response.data;
  },
};
