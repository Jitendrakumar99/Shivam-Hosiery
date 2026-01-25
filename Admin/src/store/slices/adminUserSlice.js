import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

// Fetch admin users from backend
export const fetchAdminUsers = createAsyncThunk(
  'adminUsers/fetchAdminUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await adminService.getAdminUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin users'
      );
    }
  }
);

// Create new admin user
export const createAdminUser = createAsyncThunk(
  'adminUsers/createAdminUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await adminService.createUser({
        ...userData,
        role: 'admin'
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create admin user'
      );
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  'adminUsers/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateUserRole(id, role);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user role'
      );
    }
  }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
  'adminUsers/updateUserStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateUserStatus(id, isActive);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user status'
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const data = await adminService.deleteUser(id);
      return { id, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

const initialState = {
  adminUsers: [],
  loading: false,
  error: null,
  pagination: null,
};

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUsers = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Admin User
      .addCase(createAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.adminUsers.push(action.payload.data);
        }
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const index = state.adminUsers.findIndex(
            u => (u._id || u.id) === (action.payload.data._id || action.payload.data.id)
          );
          if (index !== -1) {
            // If role changed to 'user', remove from admin users list
            if (action.payload.data.role === 'user') {
              state.adminUsers = state.adminUsers.filter(
                u => (u._id || u.id) !== (action.payload.data._id || action.payload.data.id)
              );
            } else {
              state.adminUsers[index] = action.payload.data;
            }
          }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const index = state.adminUsers.findIndex(
            u => (u._id || u.id) === (action.payload.data._id || action.payload.data.id)
          );
          if (index !== -1) {
            state.adminUsers[index] = action.payload.data;
          }
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.adminUsers = state.adminUsers.filter(
          u => String(u._id || u.id) !== String(deletedId)
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminUserSlice.actions;
export default adminUserSlice.reducer;

