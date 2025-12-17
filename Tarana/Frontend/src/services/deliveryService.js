import api from './api';

export const deliveryService = {
  // Get all active delivery zones
  getZones: async () => {
    const response = await api.get('/delivery-zones');
    return response.data;
  },
};


