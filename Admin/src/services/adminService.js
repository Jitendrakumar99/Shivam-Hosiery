import api from './api';

export const adminService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};

