import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: 1,
      name: 'Safety Vests',
      description: 'High-visibility safety vests for various industries',
      status: 'active',
    },
    {
      id: 2,
      name: 'Safety Jackets',
      description: 'Weather-resistant safety jackets with reflective tape',
      status: 'active',
    },
    {
      id: 3,
      name: 'Coveralls',
      description: 'Full-body coveralls for industrial protection',
      status: 'active',
    },
    {
      id: 4,
      name: 'Work Pants',
      description: 'Durable work pants with safety features',
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

