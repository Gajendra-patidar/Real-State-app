import api from './axiosInstance';

export const chatApi = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (chatId: number) => {
    const response = await api.get(`/chat/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: number, payload: { message: string }) => {
    const response = await api.post(`/chat/${chatId}/messages`, payload);
    return response.data;
  },

  startDirectChat: async (payload: { user_id: number }) => {
    const response = await api.post('/chat/direct', payload);
    return response.data;
  },

  createGroupChat: async (payload: { name: string; user_ids: number[] }) => {
    const response = await api.post('/chat/group', payload);
    return response.data;
  },
};
