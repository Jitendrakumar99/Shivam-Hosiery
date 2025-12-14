import api from './api';

export const brandService = {
  // Get all brands
  getBrands: async (params = {}) => {
    // Add cache-busting param to avoid stale cached list after create/update/delete
    const response = await api.get('/brands', { params: { _ts: Date.now(), ...params } });
    return response.data;
  },

  // Get single brand
  getBrand: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Create brand
  createBrand: async (brandData) => {
    const response = await api.post('/brands', brandData);
    return response.data;
  },

  // Update brand
  updateBrand: async (id, brandData) => {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};

