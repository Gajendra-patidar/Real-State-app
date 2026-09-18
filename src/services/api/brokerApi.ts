import api from './axiosInstance';

export const brokerApi = {
  getBrokerDashboard: async (filter = 'today') => {
    const response = await api.get('/broker/dashboard', { params: { filter } });
    return response.data;
  },

  getBrokerLeads: async (params?: any) => {
    const response = await api.get('/broker/leads', { params });
    return response.data;
  },

  getBrokerProjects: async () => {
    const response = await api.get('/broker/projects');
    return response.data;
  }
};
