import api from './axiosInstance';

export const dashboardApi = {
  getManagerDashboard: async (filter = 'today') => {
    try {
      // Expected to return the shape from the docs: total_assigned_leads, new_leads, etc.
      const response = await api.get('/manager/dashboard', { params: { filter } });
      return response.data;
    } catch (error) {
      console.error("getManagerDashboard API ERROR:", error);
      throw error;
    }
  },

  getManagerExecutives: async () => {
    try {
      const response = await api.get('/manager/team');
      return response.data;
    } catch (error) {
      console.error("getManagerExecutives API ERROR:", error);
      throw error;
    }
  },

  getRecentLeads: async (params?: any) => {
    try {
      const response = await api.get('/manager/leads', { params });
      return response.data;
    } catch (error) {
      console.error("getRecentLeads API ERROR:", error);
      throw error;
    }
  },
};
