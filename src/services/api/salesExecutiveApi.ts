import api from './axiosInstance';

export const salesExecutiveApi = {
  getDashboard: async (filter = 'today') => {
    const response = await api.get('/executive/dashboard', {params: {filter}});
    return response.data;
  },

  getAssignedLeads: async (params?: any) => {
    const response = await api.get('/executive/leads', {params});
    return response.data;
  },

  updateLeadStatus: async (leadId: number, payload: {status: string; notes?: string}) => {
    const response = await api.post(`/executive/leads/${leadId}/status`, payload);
    return response.data;
  },

  logCallNote: async (leadId: number, payload: {note: string; next_follow_up?: string}) => {
    const response = await api.post(`/executive/leads/${leadId}/notes`, payload);
    return response.data;
  },

  getSiteVisits: async () => {
    const response = await api.get('/executive/site-visits');
    return response.data;
  },
};
