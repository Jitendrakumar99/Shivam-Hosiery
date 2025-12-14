import api from './api';

export const brandService = {
  // Get all brands
  getBrands: async (params = {}) => {
    // Bust API cache so new entries reflect immediately on the site
    const response = await api.get('/brands', { params: { _ts: Date.now(), ...params } });
    return response.data;
  },
};

