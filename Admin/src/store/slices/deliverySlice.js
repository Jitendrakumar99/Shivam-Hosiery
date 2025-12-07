import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zones: [
    {
      id: 1,
      name: 'Raipur City',
      pincodes: ['492001', '492002', '492003', '492004', '492005'],
      deliveryCharge: 50,
      estimatedDays: 1,
      status: 'active',
    },
    {
      id: 2,
      name: 'Chhattisgarh',
      pincodes: ['490001', '491001', '493001', '494001'],
      deliveryCharge: 100,
      estimatedDays: 2,
      status: 'active',
    },
    {
      id: 3,
      name: 'Central India',
      pincodes: ['440001', '450001', '460001', '470001'],
      deliveryCharge: 150,
      estimatedDays: 3,
      status: 'active',
    },
  ],
  loading: false,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    addZone: (state, action) => {
      state.zones.push(action.payload);
    },
    updateZone: (state, action) => {
      const index = state.zones.findIndex(z => z.id === action.payload.id);
      if (index !== -1) {
        state.zones[index] = action.payload;
      }
    },
    deleteZone: (state, action) => {
      state.zones = state.zones.filter(z => z.id !== action.payload);
    },
  },
});

export const { addZone, updateZone, deleteZone } = deliverySlice.actions;
export default deliverySlice.reducer;

