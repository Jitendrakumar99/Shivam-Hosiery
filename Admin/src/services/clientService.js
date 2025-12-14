import api from './api';

export const clientService = {
  // Get all clients
  getClients: async (params = {}) => {
    // Add cache-busting param to avoid stale cached list after create/update/delete
    const response = await api.get('/clients', { params: { _ts: Date.now(), ...params } });
    return response.data;
  },

  // Get single client
  getClient: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Create client
  createClient: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Update client
  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Delete client
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

