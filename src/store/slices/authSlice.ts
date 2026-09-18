import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../../services/api/authApi';

interface User {
  id: number;
  name: string;
  email: string;
  role: string | { id: number; name: string; slug: string };
  company_id?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: true, // true initially while checking session
  error: null,
};

// Async thunk to restore session on app launch
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        let roleStr = typeof user.role === 'string' ? user.role : user.role?.slug;
        return {token, user, role: roleStr};
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to restore session');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{user: User; token: string}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Handle the case where role is an object
      const userRole = action.payload.user.role;
      state.role = typeof userRole === 'string' ? userRole : userRole?.slug || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.role = action.payload.role;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  }
});

export const {setCredentials, logout, setLoading, setError} = authSlice.actions;

export default authSlice.reducer;
