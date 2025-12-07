import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: 1,
      name: 'Safety Vests',
      description: 'High-visibility safety vests for various industries',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      status: 'active',
    },
    {
      id: 2,
      name: 'Safety Jackets',
      description: 'Weather-resistant safety jackets with reflective tape',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      status: 'active',
    },
    {
      id: 3,
      name: 'Coveralls',
      description: 'Full-body coveralls for industrial protection',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      status: 'active',
    },
    {
      id: 4,
      name: 'Work Pants',
      description: 'Durable work pants with safety features',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      status: 'active',
    },
  ],
  loading: false,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;

