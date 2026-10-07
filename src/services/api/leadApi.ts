import api from './axiosInstance';

export const leadApi = {
  getManagerLeads: async (params?: any) => {
    try {
      const response = await api.get('/manager/leads', { params });
      return response.data;
    } catch (error) {
      console.error("getManagerLeads API ERROR:", error);
      throw error;
    }
  },
  
  getManagerLeadDetails: async (leadId: string | number) => {
    try {
      const response = await api.get(`/manager/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error("getManagerLeadDetails API ERROR:", error);
      throw error;
    }
  },

  updateLead: async (leadId: string | number, payload: any) => {
    try {
      const response = await api.put(`/manager/leads/${leadId}`, payload);
      return response.data;
    } catch (error) {
      console.error("updateLead API ERROR:", error);
      throw error;
    }
  },
  
  updateLeadStatus: async (leadId: string | number, payload: {status: string; notes?: string; lost_reason?: string}) => {
    try {
      const response = await api.post(`/manager/leads/${leadId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error("updateLeadStatus API ERROR:", error);
      throw error;
    }
  },
  
  assignLead: async (leadId: string | number, payload: {executive_id: number; notes?: string}) => {
    try {
      const response = await api.post(`/manager/leads/${leadId}/assign`, payload);
      return response.data;
    } catch (error) {
      console.error("assignLead API ERROR:", error);
      throw error;
    }
  },

  transferLead: async (leadId: string | number, payload: {from_executive_id: number; to_executive_id: number; notes?: string}) => {
    try {
      const response = await api.post(`/manager/leads/${leadId}/transfer`, payload);
      return response.data;
    } catch (error) {
      console.error("transferLead API ERROR:", error);
      throw error;
    }
  },

  startNegotiation: async (leadId: string | number, payload: {notes?: string}) => {
    try {
      const response = await api.post(`/manager/leads/${leadId}/negotiate`, payload);
      return response.data;
    } catch (error) {
      console.error("startNegotiation API ERROR:", error);
      throw error;
    }
  },

  dropLead: async (leadId: string | number, payload: {reason: string}) => {
    try {
      const response = await api.post(`/manager/leads/${leadId}/lost`, payload);
      return response.data;
    } catch (error) {
      console.error("dropLead API ERROR:", error);
      throw error;
    }
  },
};
