import api from './api';

export const deliveryService = {
  // Get all delivery zones
  getZones: async () => {
    const response = await api.get('/delivery-zones');
    return response.data;
  },

  // Create a new delivery zone
  createZone: async (zoneData) => {
    const response = await api.post('/delivery-zones', zoneData);
    return response.data;
  },

  // Update an existing delivery zone
  updateZone: async (id, zoneData) => {
    const response = await api.put(`/delivery-zones/${id}`, zoneData);
    return response.data;
  },

  // Delete a delivery zone
  deleteZone: async (id) => {
    const response = await api.delete(`/delivery-zones/${id}`);
    return response.data;
  },
};


