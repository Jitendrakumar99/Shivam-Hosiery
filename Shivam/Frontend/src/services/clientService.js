import api from './api';

export const clientService = {
  // Get all clients
  getClients: async (params = {}) => {
    // Bust API cache so new entries reflect immediately on the site
    const response = await api.get('/clients', { params: { _ts: Date.now(), ...params } });
    return response.data;
  },
};

