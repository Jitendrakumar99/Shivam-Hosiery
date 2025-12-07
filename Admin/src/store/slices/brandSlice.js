import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [
    {
      id: 1,
      name: 'Trana',
      category: 'Safety Garments',
      slogan: 'सुरक्षा, हमारी प्राथमिकता',
      description: 'Premium safety garments designed for industrial protection.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    },
    {
      id: 2,
      name: 'ComfortWear',
      category: 'Casual Wear',
      slogan: 'Style Meets Comfort',
      description: 'Everyday casual clothing with quality and comfort.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      id: 3,
      name: 'ActiveSports',
      category: 'Sports Apparel',
      slogan: 'Performance Redefined',
      description: 'Performance-focused sportswear for active lifestyles.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    },
    {
      id: 4,
      name: 'CorporatePro',
      category: 'Corporate Uniforms',
      slogan: 'Professional Excellence',
      description: 'Professional uniforms for businesses and organizations.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    },
  ],
  loading: false,
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action) => {
      const index = state.brands.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter(b => b.id !== action.payload);
    },
  },
});

export const { addBrand, updateBrand, deleteBrand } = brandSlice.actions;
export default brandSlice.reducer;

