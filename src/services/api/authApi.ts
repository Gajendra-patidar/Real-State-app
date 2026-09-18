import api from './axiosInstance';

export const authApi = {
  login: async (credentials: {email: string; password: string}) => {
    const response = await api.post('/auth/login', credentials);
    console.log("login data", response.data);
    
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  }
};
