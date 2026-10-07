import api from './axiosInstance';

export const authApi = {
  login: async (credentials: {email: string; password: string; fcm_token?: string}) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log("login data", response.data);
      return response.data;
    } catch (error) {
      console.error("login API ERROR:", error);
      throw error;
    }
  },
  
  verifyOtp: async (payload: {phone: string; otp: string}) => {
    try {
      const response = await api.post('/auth/otp/verify', payload);
      return response.data;
    } catch (error) {
      console.error("verifyOtp API ERROR:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error("logout API ERROR:", error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error("getProfile API ERROR:", error);
      throw error;
    }
  },

  updateProfile: async (payload: {name?: string; phone?: string}) => {
    try {
      const response = await api.put('/auth/profile', payload);
      return response.data;
    } catch (error) {
      console.error("updateProfile API ERROR:", error);
      throw error;
    }
  },

  registerFcmToken: async (fcmToken: string) => {
    try {
      const response = await api.post('/fcm-token', { fcm_token: fcmToken });
      return response.data;
    } catch (error) {
      console.error("registerFcmToken API ERROR:", error);
      throw error;
    }
  },

  removeFcmToken: async (fcmToken: string) => {
    try {
      const response = await api.delete('/fcm-token', { data: { fcm_token: fcmToken } });
      return response.data;
    } catch (error) {
      console.error("removeFcmToken API ERROR:", error);
      throw error;
    }
  }
};
