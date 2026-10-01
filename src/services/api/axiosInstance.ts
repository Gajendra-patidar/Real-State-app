import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../../store';
import {logout} from '../../store/slices/authSlice';

// API Configuration
// Replace with the actual domain or use env variables
const API_BASE_URL = 'https://urbanproperty.in/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token is invalid/expired — clear session and logout
      try {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.log('AsyncStorage clear error:', e);
      }
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default api;
