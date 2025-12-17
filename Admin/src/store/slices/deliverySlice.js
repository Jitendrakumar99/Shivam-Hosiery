import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deliveryService } from '../../services/deliveryService';

const initialState = {
  zones: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchZones = createAsyncThunk(
  'delivery/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const data = await deliveryService.getZones();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch delivery zones'
      );
    }
  }
);

export const createZone = createAsyncThunk(
  'delivery/createZone',
  async (zoneData, { rejectWithValue }) => {
    try {
      const data = await deliveryService.createZone(zoneData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create delivery zone'
      );
    }
  }
);

export const updateZone = createAsyncThunk(
  'delivery/updateZone',
  async ({ id, zoneData }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.updateZone(id, zoneData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update delivery zone'
      );
    }
  }
);

export const deleteZone = createAsyncThunk(
  'delivery/deleteZone',
  async (id, { rejectWithValue }) => {
    try {
      await deliveryService.deleteZone(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete delivery zone'
      );
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Zones
      .addCase(fetchZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload.data || [];
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Zone
      .addCase(createZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createZone.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.zones.unshift(action.payload.data);
        }
      })
      .addCase(createZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Zone
      .addCase(updateZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZone.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const index = state.zones.findIndex(
            (z) => z._id === action.payload.data._id
          );
          if (index !== -1) {
            state.zones[index] = action.payload.data;
          }
        }
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Zone
      .addCase(deleteZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = state.zones.filter((z) => z._id !== action.payload);
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = deliverySlice.actions;
export default deliverySlice.reducer;

