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

  // Get admin users only
  getAdminUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    // Filter to only return users with role='admin'
    const adminUsers = response.data.data?.filter(user => user.role === 'admin') || [];
    return {
      ...response.data,
      data: adminUsers,
      count: adminUsers.length
    };
  },

  // Create new user (admin can create users with specific role)
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

