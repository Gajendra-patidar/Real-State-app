import api from './axiosInstance';

export const propertyApi = {
  getManagerProjects: async () => {
    try {
      const response = await api.get('/manager/projects');
      return response.data;
    } catch (error) {
      console.error("getManagerProjects API ERROR:", error);
      throw error;
    }
  },

  getProjectUnits: async (projectId: string | number, params?: any) => {
    try {
      const response = await api.get(`/manager/projects/${projectId}/units`, { params });
      return response.data;
    } catch (error) {
      console.error("getProjectUnits API ERROR:", error);
      throw error;
    }
  }
};
