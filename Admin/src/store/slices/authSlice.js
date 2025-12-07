import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated || false,
        loading: false,
      };
    } catch {
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('auth', JSON.stringify({ user: action.payload, isAuthenticated: true }));
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

