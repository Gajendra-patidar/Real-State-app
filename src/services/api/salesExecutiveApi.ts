import api from './axiosInstance';

export const salesExecutiveApi = {
  // -------------------------------------
  // Dashboard
  // -------------------------------------
  getDashboard: async (period = 'today') => {
    try {
      const response = await api.get('/executive/dashboard', { params: { period } });
      return response.data;
    } catch (error: any) {
      console.error("getDashboard API ERROR:", error?.response?.data || error?.message || error);
      throw error;
    }
  },

  getSummaryReports: async () => {
    try {
      const response = await api.get('/executive/reports/summary');
      return response.data;
    } catch (error) {
      console.error("getSummaryReports API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Leads Lifecycle & Pipeline
  // -------------------------------------
  getAssignedLeads: async (params?: any) => {
    try {
      const response = await api.get('/executive/leads', { params });
      return response.data;
    } catch (error) {
      console.error("getAssignedLeads API ERROR:", error);
      throw error;
    }
  },

  addLead: async (payload: any) => {
    try {
      const response = await api.post('/executive/leads', payload);
      return response.data;
    } catch (error) {
      console.error("addLead API ERROR:", error);
      throw error;
    }
  },

  checkDuplicateLead: async (payload: { phone?: string; email?: string }) => {
    try {
      const response = await api.post('/executive/leads/check-duplicate', payload);
      return response.data;
    } catch (error) {
      console.error("checkDuplicateLead API ERROR:", error);
      throw error;
    }
  },

  getLeadDetails: async (id: number) => {
    try {
      const response = await api.get(`/executive/leads/${id}`);
      console.log('getLeadDetails l i xi x', { leadId: id, response: response.data });
      return response.data;
    } catch (error) {
      console.error("getLeadDetails API ERROR:", error);
      throw error;
    }
  },

  updateLeadStatus: async (id: number, payload: { status: string; notes?: string }) => {
    try {
      console.log('Lead Status Updated', { leadId: id, status: payload.status });
      const response = await api.post(`/executive/leads/${id}/status`, payload);
      console.log('Lead Status Updated', { leadId: id, status: payload.status });
      return response.data;
    } catch (error) {
      console.error("updateLeadStatus API ERROR:", error);
      throw error;
    }
  },

  logCall: async (id: number, payload: { call_type: string; duration_seconds?: number; outcome: string; notes?: string }) => {
    try {
      const response = await api.post(`/executive/leads/${id}/calls`, payload);
      return response.data;
    } catch (error) {
      console.error("logCall API ERROR:", error);
      throw error;
    }
  },

  dropLead: async (id: number, payload: { reason: string; notes?: string }) => {
    try {
      const response = await api.post(`/executive/leads/${id}/drop`, payload);
      return response.data;
    } catch (error: any) {
      console.error("dropLead API ERROR:", error.response?.data || error.message);
      throw error;
    }
  },

  // (Legacy methods kept for backward compatibility if needed)
  getManagerLeadDetails: async (id: number) => {
    try {
      return salesExecutiveApi.getLeadDetails(id);
    } catch (error) {
      console.error("getManagerLeadDetails API ERROR:", error);
      throw error;
    }
  },
  updateLead: async (id: number, payload: any) => {
    try {
      console.log("update lead payload", payload, id);
      const response = await api.put(`/executive/leads/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("updateLead API ERROR:", error);
      throw error;
    }
  },
  transferLead: async (id: number, payload: any) => {
    try {
      const response = await api.post(`/executive/leads/${id}/assign`, payload);
      return response.data;
    } catch (error) {
      console.error("transferLead API ERROR:", error);
      throw error;
    }
  },
  logCallNote: async (id: number, payload: { note: string; next_follow_up?: string }) => {
    try {
      return salesExecutiveApi.logCall(id, { call_type: 'outgoing', outcome: 'follow_up', notes: payload.note });
    } catch (error) {
      console.error("logCallNote API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Follow-ups & Calendar
  // -------------------------------------
  getFollowUps: async (params?: { status?: string; from?: string; to?: string }) => {
    try {
      const response = await api.get('/executive/follow-ups', { params });
      return response.data;
    } catch (error) {
      console.error("getFollowUps API ERROR:", error);
      throw error;
    }
  },

  scheduleFollowUp: async (leadId: number, payload: { scheduled_at: string; type: string; notes?: string }) => {
    try {
      console.log('Scheduling follow-up', { leadId, payload });
      const response = await api.post(`/executive/leads/${leadId}/follow-ups`, payload);
      return response.data;
    } catch (error) {
      console.error("scheduleFollowUp API ERROR:", error);
      throw error;
    }
  },

  updateFollowUpStatus: async (followUpId: number, payload: { status: string; notes?: string }) => {
    try {
      const response = await api.patch(`/executive/follow-ups/${followUpId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error("updateFollowUpStatus API ERROR:", error);
      throw error;
    }
  },

  getCalendar: async (params?: { start_date?: string; end_date?: string }) => {
    try {
      const response = await api.get('/executive/calendar', { params });
      return response.data;
    } catch (error) {
      console.error("getCalendar API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Site Visits
  // -------------------------------------
  getSiteVisits: async () => {
    try {
      const response = await api.get('/executive/site-visits');
      return response.data;
    } catch (error) {
      console.error("getSiteVisits API ERROR:", error);
      throw error;
    }
  },

  scheduleSiteVisit: async (payload: { lead_id: number; project_id: number; scheduled_at: string; pickup_location?: string; notes?: string }) => {
    try {
      const response = await api.post('/executive/site-visits', payload);
      console.log('Scheduling site visit response:', { payload, response });
      return response.data;
    } catch (error) {
      console.error("scheduleSiteVisit API ERROR:", error);
      throw error;
    }
  },
  startNegotiation: async (id: number, payload: { offered_price: number; discount_requested: number; notes?: string }) => {
    try {
      const response = await api.post(`/executive/leads/${id}/negotiation`, payload);
      return response.data;
    } catch (error) {
      console.error("startNegotiation API ERROR:", error);
      throw error;
    }
  },

  getNegotiations: async (id: number) => {
    try {
      const response = await api.get(`/executive/leads/${id}/negotiations`);
      return response.data;
    } catch (error) {
      console.error("getNegotiations API ERROR:", error);
      throw error;
    }
  },

  getAllNegotiations: async () => {
    try {
      const response = await api.get('/executive/negotiations');
      return response.data;
    } catch (error) {
      console.error("getAllNegotiations API ERROR:", error);
      throw error;
    }
  },

  updateSiteVisitStatus: async (id: number, payload: any) => {
    try {
      const response = await api.post(`/executive/site-visits/${id}/status`, payload, {
        headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("updateSiteVisitStatus API ERROR:", error);
      throw error;
    }
  },

  verifySiteVisit: async (id: number, payload: { rating: number; feedback: string; outcome: string }) => {
    try {
      const response = await api.post(`/executive/site-visits/${id}/verify-visit`, payload);
      return response.data;
    } catch (error) {
      console.error("verifySiteVisit API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Negotiations
  // -------------------------------------
  startNegotiation: async (id: number, payload: { offered_price: number; discount_requested: number; notes?: string }) => {
    try {
      const response = await api.post(`/executive/leads/${id}/negotiation`, payload);
      return response.data;
    } catch (error) {
      console.error("startNegotiation API ERROR:", error);
      throw error;
    }
  },

  getNegotiations: async (id: number) => {
    try {
      const response = await api.get(`/executive/leads/${id}/negotiations`);
      return response.data;
    } catch (error) {
      console.error("getNegotiations API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Projects & Inventory
  // -------------------------------------
  getProjects: async () => {
    try {
      const response = await api.get('/executive/projects');
      return response.data;
    } catch (error) {
      console.error("getProjects API ERROR:", error);
      throw error;
    }
  },

  getProjectUnits: async (id: number, params?: { status?: string }) => {
    try {
      const response = await api.get(`/executive/projects/${id}/units`, { params });
      return response.data;
    } catch (error) {
      console.error("getProjectUnits API ERROR:", error);
      throw error;
    }
  },

  recordBooking: async (payload: any) => {
    try {
      const response = await api.post(`/executive/bookings`, payload);
      return response.data;
    } catch (error) {
      console.error("recordBooking API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Bookings & Payments
  // -------------------------------------
  getBookings: async () => {
    try {
      const response = await api.get('/executive/bookings');
      return response.data;
    } catch (error) {
      console.error("getBookings API ERROR:", error);
      throw error;
    }
  },

  submitBooking: async (payload: any) => {
    try {
      const response = await api.post('/executive/bookings', payload);
      return response.data;
    } catch (error) {
      console.error("submitBooking API ERROR:", error);
      throw error;
    }
  },

  recordPayment: async (bookingId: number, payload: any) => {
    try {
      const response = await api.post(`/executive/bookings/${bookingId}/payments`, payload);
      return response.data;
    } catch (error) {
      console.error("recordPayment API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Attendance & Leaves
  // -------------------------------------
  getAttendance: async () => {
    try {
      const response = await api.get('/executive/attendance');
      return response.data;
    } catch (error) {
      console.error("getAttendance API ERROR:", error);
      throw error;
    }
  },

  clockIn: async (payload: any) => {
    try {
      console.log('Clocking in with payload:', payload);
      const isFormData = payload && payload.append !== undefined;
      
      if (isFormData) {
        // Use fetch for FormData to bypass Axios boundary stripping issues in React Native
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('https://urbanproperty.in/api/executive/attendance/clock-in', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: payload,
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw { response: { data } };
        }
        return data;
      }

      const response = await api.post('/executive/attendance/clock-in', payload);
      console.log('Clock in response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("clockIn API ERROR:", error?.response?.data || error);
      throw error;
    }
  },

  clockOut: async () => {
    try {
      const response = await api.post('/executive/attendance/clock-out');
      console.log('Clock out response:', response.data);
      return response.data;
    } catch (error) {
      console.error("clockOut API ERROR:", error);
      throw error;
    }
  },

  getLeaves: async () => {
    try {
      const response = await api.get('/executive/attendance/leaves');
      return response.data;
    } catch (error) {
      console.error("getLeaves API ERROR:", error);
      throw error;
    }
  },

  applyLeave: async (payload: { leave_type: string; start_date: string; end_date: string; reason: string }) => {
    try {
      const response = await api.post('/executive/attendance/leaves', payload);
      return response.data;
    } catch (error) {
      console.error("applyLeave API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Notifications & Support
  // -------------------------------------
  getNotifications: async () => {
    try {
      const response = await api.get('/executive/notifications');
      return response.data;
    } catch (error) {
      console.error("getNotifications API ERROR:", error);
      throw error;
    }
  },

  markNotificationRead: async (id: number) => {
    try {
      const response = await api.post(`/executive/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error("markNotificationRead API ERROR:", error);
      throw error;
    }
  },

  getSupportTickets: async () => {
    try {
      const response = await api.get('/executive/support/tickets');
      console.log('getSupportTickets response:', response.data);
      return response.data;
    } catch (error) {
      console.error("getSupportTickets API ERROR:", error.message || error);
      throw error;
    }
  },

  createSupportTicket: async (payload: { category: string; subject: string; description: string; priority: string }) => {
    try {
      console.log('createSupportTicket response:', { payload });
      const response = await api.post('/executive/support/tickets', payload);
      return response.data;
    } catch (error) {
      console.error("createSupportTicket API ERROR:", error.message || error);
      throw error;
    }
  },

  getSupportTicketDetails: async (id: number) => {
    try {
      const response = await api.get(`/executive/support/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error("getSupportTicketDetails API ERROR:", error.message || error);
      throw error;
    }
  },

  replySupportTicket: async (id: number, payload: { message: string }) => {
    try {
      const response = await api.post(`/executive/support/tickets/${id}/reply`, payload);
      return response.data;
    } catch (error) {
      console.error("replySupportTicket API ERROR:", error);
      throw error;
    }
  },

  updateSupportTicketStatus: async (id: number, payload: { status: string }) => {
    try {
      const response = await api.patch(`/executive/support/tickets/${id}/status`, payload);
      return response.data;
    } catch (error) {
      console.error("updateSupportTicketStatus API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Google Calendar Integration
  // -------------------------------------
  connectGoogleCalendar: async (payload: { auth_code: string }) => {
    try {
      const response = await api.post('/executive/google-calendar/connect', payload);
      return response.data;
    } catch (error) {
      console.error("connectGoogleCalendar API ERROR:", error);
      throw error;
    }
  },

  // -------------------------------------
  // Team Chat
  // -------------------------------------
  fetchConversations: async () => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error("fetchConversations API ERROR:", error);
      throw error;
    }
  },

  fetchMessages: async (chatId: number) => {
    console.log('fetchMessages called with chatId:', chatId);
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error("fetchMessages API ERROR:", error);
      throw error;
    }
  },

  sendMessage: async (chatId: number, payload: { message: string }) => {
    try {
      const response = await api.post(`/chat/${chatId}/messages`, payload);
      return response.data;
    } catch (error) {
      console.error("sendMessage API ERROR:", error);
      throw error;
    }
  },

  startDirectChat: async (payload: { user_id: number }) => {
    try {
      const response = await api.post('/chat/direct', payload);
      return response.data;
    } catch (error) {
      console.error("startDirectChat API ERROR:", error);
      throw error;
    }
  },

  createGroupChat: async (payload: { name: string; user_ids: number[] }) => {
    try {
      const response = await api.post('/chat/group', payload);
      return response.data;
    } catch (error) {
      console.error("createGroupChat API ERROR:", error);
      throw error;
    }
  },
};
