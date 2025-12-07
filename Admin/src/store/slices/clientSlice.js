import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [
    {
      id: 1,
      name: 'National Construction Corp',
      category: 'Construction',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    },
    {
      id: 2,
      name: 'Industrial Safety Solutions',
      category: 'Manufacturing',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    },
    {
      id: 3,
      name: 'Metro Rail Services',
      category: 'Transportation',
      logo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      id: 4,
      name: 'Power Grid Corporation',
      category: 'Energy',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    },
    {
      id: 5,
      name: 'Highway Development Authority',
      category: 'Infrastructure',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    },
    {
      id: 6,
      name: 'Mining Corporation Ltd',
      category: 'Mining',
      logo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
  ],
  loading: false,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
  },
});

export const { addClient, updateClient, deleteClient } = clientSlice.actions;
export default clientSlice.reducer;

