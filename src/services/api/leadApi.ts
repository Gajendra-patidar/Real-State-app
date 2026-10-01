import api from './axiosInstance';

export const leadApi = {
  getManagerLeads: async (params?: any) => {
    const response = await api.get('/manager/leads', { params });
    return response.data;
  },
  
  getManagerLeadDetails: async (leadId: string | number) => {
    const response = await api.get(`/manager/leads/${leadId}`);
    return response.data;
  },

  updateLead: async (leadId: string | number, payload: any) => {
    const response = await api.put(`/manager/leads/${leadId}`, payload);
    return response.data;
  },
  
  updateLeadStatus: async (leadId: string | number, payload: {status: string; notes?: string; lost_reason?: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/status`, payload);
    return response.data;
  },
  
  assignLead: async (leadId: string | number, payload: {executive_id: number; notes?: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/assign`, payload);
    return response.data;
  },

  transferLead: async (leadId: string | number, payload: {from_executive_id: number; to_executive_id: number; notes?: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/transfer`, payload);
    return response.data;
  },

  startNegotiation: async (leadId: string | number, payload: {notes?: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/negotiate`, payload);
    return response.data;
  },

  dropLead: async (leadId: string | number, payload: {reason: string}) => {
    const response = await api.post(`/manager/leads/${leadId}/lost`, payload);
    return response.data;
  },
};
