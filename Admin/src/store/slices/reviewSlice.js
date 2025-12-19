import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';

const initialState = {
    reviews: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
};

// Async thunks
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await reviewService.getReviews(params);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch reviews'
            );
        }
    }
);

export const updateReviewStatus = createAsyncThunk(
    'reviews/updateReviewStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const data = await reviewService.updateReviewStatus(id, status);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update review status'
            );
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id, { rejectWithValue }) => {
        try {
            await reviewService.deleteReview(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete review'
            );
        }
    }
);

export const replyToReview = createAsyncThunk(
    'reviews/replyToReview',
    async ({ id, message }, { rejectWithValue }) => {
        try {
            const data = await reviewService.replyToReview(id, message);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to reply to review'
            );
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews || action.payload.data || []; // Handle different response structures
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Review Status
            .addCase(updateReviewStatus.fulfilled, (state, action) => {
                const index = state.reviews.findIndex((r) => r._id === action.payload.data._id);
                if (index !== -1) {
                    state.reviews[index] = action.payload.data;
                }
            })
            // Delete Review
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((r) => r._id !== action.payload);
            })
            // Reply to Review
            .addCase(replyToReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex((r) => r._id === action.payload.data._id);
                if (index !== -1) {
                    state.reviews[index] = action.payload.data;
                }
            });
    },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
