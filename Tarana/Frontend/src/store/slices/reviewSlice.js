import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const data = await reviewService.getProductReviews(productId, params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await reviewService.createReview(reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create review'
      );
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const data = await reviewService.updateReview(id, reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update review'
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      const data = await reviewService.deleteReview(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete review'
      );
    }
  }
);

export const likeReview = createAsyncThunk(
  'reviews/likeReview',
  async (id, { rejectWithValue }) => {
    try {
      const data = await reviewService.likeReview(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like review'
      );
    }
  }
);

export const dislikeReview = createAsyncThunk(
  'reviews/dislikeReview',
  async (id, { rejectWithValue }) => {
    try {
      const data = await reviewService.dislikeReview(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to dislike review'
      );
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.pagination = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.data);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
      })
      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.meta.arg);
      })
      // Like Review
      .addCase(likeReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
      })
      // Dislike Review
      .addCase(dislikeReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
      });
  },
});

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
