import api from './axiosInstance';

export const authApi = {
  login: async (credentials: {email: string; password: string}) => {
    const response = await api.post('/auth/login', credentials);
    console.log("login data", response.data);
    return response.data;
  },
  
  verifyOtp: async (payload: {phone: string; otp: string}) => {
    const response = await api.post('/auth/otp/verify', payload);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  updateProfile: async (payload: {name?: string; phone?: string}) => {
    const response = await api.put('/auth/profile', payload);
    return response.data;
  },

  registerFcmToken: async (fcmToken: string) => {
    const response = await api.post('/fcm-token', { fcm_token: fcmToken });
    return response.data;
  },

  removeFcmToken: async (fcmToken: string) => {
    const response = await api.delete('/fcm-token', { data: { fcm_token: fcmToken } });
    return response.data;
  }
};
