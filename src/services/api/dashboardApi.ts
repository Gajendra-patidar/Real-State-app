import api from './axiosInstance';

export const dashboardApi = {
  getManagerDashboard: async (filter = 'today') => {
    // Expected to return the shape from the docs: total_assigned_leads, new_leads, etc.
    const response = await api.get('/manager/dashboard', { params: { filter } });
    return response.data;
  },

  getManagerExecutives: async () => {
    const response = await api.get('/manager/team');
    return response.data;
  },

  getRecentLeads: async (params?: any) => {
    const response = await api.get('/manager/leads', { params });
    return response.data;
  },
};
