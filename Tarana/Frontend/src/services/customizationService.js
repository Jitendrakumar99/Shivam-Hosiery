import api from './api';

export const customizationService = {
  // Create customization
  createCustomization: async (customizationData) => {
    const response = await api.post('/customizations', customizationData);
    return response.data;
  },

  // Get customizations
  getCustomizations: async (params = {}) => {
    const response = await api.get('/customizations', { params });
    return response.data;
  },

  // Get single customization
  getCustomization: async (id) => {
    const response = await api.get(`/customizations/${id}`);
    return response.data;
  },

  // Generate image preview
  generateImagePreview: async (customizationData, productImage, baseImageDescription) => {
    const response = await api.post('/customizations/generate-preview', {
      customizationData,
      productImage,
      baseImageDescription
    });
    return response.data;
  }
};

