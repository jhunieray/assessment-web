import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const loginUser = createAsyncThunk('user/loginUser', async (credentials) => {
  const response = await axios.post('/login', credentials);
  return response.data;
});

export const registerUser = createAsyncThunk('user/registerUser', async (userInfo) => {
  const response = await axios.post('/register', userInfo);
  return response.data;
});

export const getUser = createAsyncThunk('user/getUser', async (token) => {
  const response = await axios.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || '',
    status: 'idle',
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;