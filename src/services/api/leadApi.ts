import api from './axiosInstance';

export const leadApi = {
  getManagerLeads: async (params?: any) => {
    const response = await api.get('/manager/leads', { params });
    return response.data;
  },
  
  updateLeadStatus: async (leadId: string | number, payload: {status: string; notes?: string; lost_reason?: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/status`, payload);
    return response.data;
  }
};
