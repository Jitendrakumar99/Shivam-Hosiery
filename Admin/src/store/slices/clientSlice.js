import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService } from '../../services/clientService';

const initialState = {
  clients: [],
  client: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await clientService.getClients(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch clients'
      );
    }
  }
);

export const fetchClient = createAsyncThunk(
  'clients/fetchClient',
  async (id, { rejectWithValue }) => {
    try {
      const data = await clientService.getClient(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch client'
      );
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await clientService.createClient(clientData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create client'
      );
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, clientData }, { rejectWithValue }) => {
    try {
      const data = await clientService.updateClient(id, clientData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update client'
      );
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete client'
      );
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClient: (state) => {
      state.client = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data || [];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Client
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload.data;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.clients.unshift(action.payload.data);
        }
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const index = state.clients.findIndex(
            (c) => c._id === action.payload.data._id
          );
          if (index !== -1) {
            state.clients[index] = action.payload.data;
          }
          if (state.client && state.client._id === action.payload.data._id) {
            state.client = action.payload.data;
          }
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;

