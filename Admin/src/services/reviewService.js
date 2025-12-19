import api from './api';

export const reviewService = {
    // Get all reviews
    getReviews: async (params = {}) => {
        const response = await api.get('/reviews', { params });
        return response.data;
    },

    // Update review status
    updateReviewStatus: async (id, status) => {
        const response = await api.put(`/reviews/${id}/status`, { status });
        return response.data;
    },

    // Delete review
    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    },

    // Reply to review
    replyToReview: async (id, message) => {
        const response = await api.post(`/reviews/${id}/reply`, { message });
        return response.data;
    },
};
