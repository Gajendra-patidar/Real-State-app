import api from './axiosInstance';

export const brokerApi = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getBrokerDashboard: async (filter = 'today') => {
    try {
      const response = await api.get('/broker/dashboard', {params: {filter}});
      console.log('getBrokerDashboard API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerDashboard API ERROR:', error);
      throw error;
    }
  },

  // ── Leads ──────────────────────────────────────────────────────────────────
  getBrokerLeads: async (params?: any) => {
    try {
      const response = await api.get('/broker/leads', {params});
      console.log('getBrokerLeads API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerLeads API ERROR:', error);
      throw error;
    }
  },

  getBrokerLeadDetails: async (leadId: string | number) => {
    try {
      const response = await api.get(`/broker/leads/${leadId}`);
      console.log('getBrokerLeadDetails API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerLeadDetails API ERROR:', error);
      throw error;
    }
  },

  submitBrokerLead: async (payload: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    project_id?: number;
    budget?: string;
    bhk_type?: string;
    notes?: string;
  }) => {
    try {
      const response = await api.post('/broker/leads', payload);
      console.log('submitBrokerLead API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('submitBrokerLead API ERROR:', error);
      throw error;
    }
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  getBrokerProjects: async () => {
    try {
      const response = await api.get('/broker/projects');
      console.log('getBrokerProjects API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerProjects API ERROR:', error);
      throw error;
    }
  },

  // ── Commissions ────────────────────────────────────────────────────────────
  getBrokerCommissions: async (params?: {status?: string; page?: number; per_page?: number}) => {
    try {
      const response = await api.get('/broker/commissions', {params});
      console.log('getBrokerCommissions API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerCommissions API ERROR:', error);
      throw error;
    }
  },

  // ── Profile ────────────────────────────────────────────────────────────────
  getBrokerProfile: async () => {
    try {
      const response = await api.get('/broker/profile');
      console.log('getBrokerProfile API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      console.error('getBrokerProfile API ERROR:', error);
      throw error;
    }
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  getBrokerNotifications: async () => {
    try {
      const response = await api.get('/broker/notifications');
      return response.data;
    } catch (error) {
      console.error('getBrokerNotifications API ERROR:', error);
      throw error;
    }
  },
  markNotificationRead: async (id: number) => {
    try {
      const response = await api.post(`/broker/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('markNotificationRead API ERROR:', error);
      throw error;
    }
  },
};
