import api from './axiosInstance';

export const propertyApi = {
  getManagerProjects: async () => {
    const response = await api.get('/manager/projects');
    return response.data;
  },

  getProjectUnits: async (projectId: string | number, params?: any) => {
    const response = await api.get(`/manager/projects/${projectId}/units`, { params });
    return response.data;
  }
};
