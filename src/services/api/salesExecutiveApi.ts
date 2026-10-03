import api from './axiosInstance';

export const salesExecutiveApi = {
  // -------------------------------------
  // Dashboard
  // -------------------------------------
  getDashboard: async (filter = 'today') => {
    try {
      const response = await api.get('/executive/dashboard', { params: { filter } });
      console.log("checking dashborard slaes SUCCESS", response);
      return response.data;
    } catch (error: any) {
      console.error("checking dashborard slaes ERROR:", error?.response?.data || error?.message || error);
      throw error;
    }
  },

  getSummaryReports: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },

  // -------------------------------------
  // Leads Lifecycle & Pipeline
  // -------------------------------------
  getAssignedLeads: async (params?: any) => {
    const response = await api.get('/executive/leads', { params });
    return response.data;
  },

  addLead: async (payload: any) => {
    const response = await api.post('/executive/leads', payload);
    return response.data;
  },

  checkDuplicateLead: async (payload: { phone?: string; email?: string }) => {
    const response = await api.post('/executive/leads/check-duplicate', payload);
    return response.data;
  },

  getLeadDetails: async (id: number) => {
    const response = await api.get(`/executive/leads/${id}`);
    console.log('getLeadDetails l i xi x', { leadId: id, response: response.data });
    return response.data;
  },

  updateLeadStatus: async (id: number, payload: { status: string; notes?: string }) => {
    console.log('Lead Status Updated', { leadId: id, status: payload.status });
    const response = await api.post(`/executive/leads/${id}/status`, payload);
    console.log('Lead Status Updated', { leadId: id, status: payload.status });
    return response.data;
  },

  logCall: async (id: number, payload: { call_type: string; duration_seconds?: number; outcome: string; notes?: string }) => {
    const response = await api.post(`/executive/leads/${id}/calls`, payload);
    return response.data;
  },

  dropLead: async (id: number, payload: { reason: string; notes?: string }) => {
    const response = await api.post(`/executive/leads/${id}/drop`, payload);
    return response.data;
  },

  // (Legacy methods kept for backward compatibility if needed)
  getManagerLeadDetails: async (id: number) => {
    return salesExecutiveApi.getLeadDetails(id);
  },
  updateLead: async (id: number, payload: any) => {
    console.log("update lead payload", payload, id);
    const response = await api.put(`/executive/leads/${id}`, payload);
    return response.data;
  },
  transferLead: async (id: number, payload: any) => {
    const response = await api.post(`/executive/leads/${id}/assign`, payload);
    return response.data;
  },
  logCallNote: async (id: number, payload: { note: string; next_follow_up?: string }) => {
    return salesExecutiveApi.logCall(id, { call_type: 'outgoing', outcome: 'follow_up', notes: payload.note });
  },

  // -------------------------------------
  // Follow-ups & Calendar
  // -------------------------------------
  getFollowUps: async (params?: { status?: string; from?: string; to?: string }) => {
    const response = await api.get('/executive/follow-ups', { params });
    return response.data;
  },

  scheduleFollowUp: async (leadId: number, payload: { scheduled_at: string; type: string; notes?: string }) => {
    console.log('Scheduling follow-up', { leadId, payload });
    const response = await api.post(`/executive/leads/${leadId}/follow-ups`, payload);
    return response.data;
  },

  updateFollowUpStatus: async (followUpId: number, payload: { status: string; notes?: string }) => {
    const response = await api.patch(`/executive/follow-ups/${followUpId}/status`, payload);
    return response.data;
  },

  getCalendar: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get('/executive/calendar', { params });
    return response.data;
  },

  // -------------------------------------
  // Site Visits
  // -------------------------------------
  getSiteVisits: async () => {
    const response = await api.get('/executive/site-visits');
    return response.data;
  },

  scheduleSiteVisit: async (payload: { lead_id: number; project_id: number; scheduled_at: string; pickup_location?: string; notes?: string }) => {
    const response = await api.post('/executive/site-visits', payload);
    console.log('Scheduling site visit response:', { payload, response });
    return response.data;
  },
  startNegotiation: async (id: number, payload: { offered_price: number; discount_requested: number; notes?: string }) => {
    const response = await api.post(`/executive/leads/${id}/negotiation`, payload);
    return response.data;
  },

  getNegotiations: async (id: number) => {
    const response = await api.get(`/executive/leads/${id}/negotiations`);
    return response.data;
  },

  getAllNegotiations: async () => {
    const response = await api.get('/executive/negotiations');
    return response.data;
  },

  updateSiteVisitStatus: async (id: number, payload: any) => {
    const response = await api.post(`/executive/site-visits/${id}/status`, payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  verifySiteVisit: async (id: number, payload: { rating: number; feedback: string; outcome: string }) => {
    const response = await api.post(`/executive/site-visits/${id}/verify-visit`, payload);
    return response.data;
  },

  // -------------------------------------
  // Negotiations
  // -------------------------------------
  startNegotiation: async (id: number, payload: { offered_price: number; discount_requested: number; notes?: string }) => {
    const response = await api.post(`/executive/leads/${id}/negotiation`, payload);
    return response.data;
  },

  getNegotiations: async (id: number) => {
    const response = await api.get(`/executive/leads/${id}/negotiations`);
    return response.data;
  },

  // -------------------------------------
  // Projects & Inventory
  // -------------------------------------
  getProjects: async () => {
    const response = await api.get('/executive/projects');
    return response.data;
  },

  getProjectUnits: async (id: number, params?: { status?: string }) => {
    const response = await api.get(`/executive/projects/${id}/units`, { params });
    return response.data;
  },

  recordBooking: async (payload: any) => {
    const response = await api.post(`/executive/bookings`, payload);
    return response.data;
  },

  // -------------------------------------
  // Bookings & Payments
  // -------------------------------------
  getBookings: async () => {
    const response = await api.get('/executive/bookings');
    return response.data;
  },

  submitBooking: async (payload: any) => {
    const response = await api.post('/executive/bookings', payload);
    return response.data;
  },

  recordPayment: async (bookingId: number, payload: any) => {
    const response = await api.post(`/executive/bookings/${bookingId}/payments`, payload);
    return response.data;
  },

  // -------------------------------------
  // Attendance & Leaves
  // -------------------------------------
  getAttendance: async () => {
    const response = await api.get('/executive/attendance');
    return response.data;
  },

  clockIn: async (payload: { latitude: number; longitude: number; address?: string }) => {
    const response = await api.post('/executive/attendance/clock-in', payload);
    return response.data;
  },

  clockOut: async () => {
    const response = await api.post('/executive/attendance/clock-out');
    return response.data;
  },

  getLeaves: async () => {
    const response = await api.get('/executive/attendance/leaves');
    return response.data;
  },

  applyLeave: async (payload: { leave_type: string; start_date: string; end_date: string; reason: string }) => {
    const response = await api.post('/executive/attendance/leaves', payload);
    return response.data;
  },

  // -------------------------------------
  // Notifications & Support
  // -------------------------------------
  getNotifications: async () => {
    const response = await api.get('/executive/notifications');
    return response.data;
  },

  markNotificationRead: async (id: number) => {
    const response = await api.post(`/executive/notifications/${id}/read`);
    return response.data;
  },

  getSupportTickets: async () => {
    const response = await api.get('/executive/support/tickets');
    return response.data;
  },

  createSupportTicket: async (payload: { subject: string; description: string; priority: string }) => {
    const response = await api.post('/executive/support/tickets', payload);
    return response.data;
  },

  getSupportTicketDetails: async (id: number) => {
    const response = await api.get(`/executive/support/tickets/${id}`);
    return response.data;
  },

  replySupportTicket: async (id: number, payload: { message: string }) => {
    const response = await api.post(`/executive/support/tickets/${id}/reply`, payload);
    return response.data;
  },

  updateSupportTicketStatus: async (id: number, payload: { status: string }) => {
    const response = await api.patch(`/executive/support/tickets/${id}/status`, payload);
    return response.data;
  },

  // -------------------------------------
  // Google Calendar Integration
  // -------------------------------------
  connectGoogleCalendar: async (payload: { auth_code: string }) => {
    const response = await api.post('/executive/google-calendar/connect', payload);
    return response.data;
  },
};
