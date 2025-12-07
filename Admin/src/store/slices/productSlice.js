import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    {
      id: 1,
      name: 'High Visibility Safety Vest - Class 2',
      price: 450.00,
      category: 'Safety Vests',
      description: 'Premium quality high-visibility safety vest with reflective strips, designed for maximum visibility in low-light conditions.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      stock: 50,
      minStock: 50,
    },
    {
      id: 2,
      name: 'Safety Jacket with Hood',
      price: 1200.00,
      category: 'Safety Jackets',
      description: 'Weather-resistant safety jacket with detachable hood and high-visibility reflective tape.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      stock: 8,
      minStock: 25,
    },
    {
      id: 3,
      name: 'Industrial Coverall - Full Body',
      price: 1800.00,
      category: 'Coveralls',
      description: 'Heavy-duty full-body coverall with reflective strips for industrial and construction work.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      stock: 30,
      minStock: 20,
    },
    {
      id: 4,
      name: 'Reflective Safety Vest - Mesh',
      price: 350.00,
      category: 'Safety Vests',
      description: 'Lightweight mesh safety vest ideal for hot weather conditions with excellent breathability.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      stock: 15,
      minStock: 50,
    },
    {
      id: 5,
      name: 'Winter Safety Parka',
      price: 2500.00,
      category: 'Safety Jackets',
      description: 'Insulated winter parka with high-visibility features for cold weather operations.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      stock: 25,
      minStock: 20,
    },
    {
      id: 6,
      name: 'Flame Resistant Coverall',
      price: 3200.00,
      category: 'Coveralls',
      description: 'FR-rated coverall for high-risk environments requiring flame protection.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      stock: 18,
      minStock: 15,
    },
  ],
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;

