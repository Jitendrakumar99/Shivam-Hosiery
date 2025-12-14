import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { brandService } from '../../services/brandService';

const initialState = {
  brands: [],
  brand: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await brandService.getBrands(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch brands'
      );
    }
  }
);

export const fetchBrand = createAsyncThunk(
  'brands/fetchBrand',
  async (id, { rejectWithValue }) => {
    try {
      const data = await brandService.getBrand(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch brand'
      );
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const data = await brandService.createBrand(brandData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create brand'
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const data = await brandService.updateBrand(id, brandData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update brand'
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await brandService.deleteBrand(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete brand'
      );
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearBrand: (state) => {
      state.brand = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.data || [];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Brand
      .addCase(fetchBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload.data;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.brands.unshift(action.payload.data);
        }
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const index = state.brands.findIndex(
            (b) => b._id === action.payload.data._id
          );
          if (index !== -1) {
            state.brands[index] = action.payload.data;
          }
          if (state.brand && state.brand._id === action.payload.data._id) {
            state.brand = action.payload.data;
          }
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBrand, clearError } = brandSlice.actions;
export default brandSlice.reducer;

