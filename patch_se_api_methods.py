import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/services/api/salesExecutiveApi.ts', 'r') as f:
    content = f.read()

new_methods = """
  getManagerLeadDetails: async (id: number) => {
    const response = await api.get(`/executive/leads/${id}`);
    return response.data;
  },

  updateLead: async (id: number, payload: any) => {
    const response = await api.put(`/executive/leads/${id}`, payload);
    return response.data;
  },

  transferLead: async (id: number, payload: any) => {
    const response = await api.post(`/executive/leads/${id}/assign`, payload);
    return response.data;
  },
"""

content = content.replace("export const salesExecutiveApi = {", "export const salesExecutiveApi = {\n" + new_methods)

with open('/Users/apple/React_Native_projects/Real-State-app/src/services/api/salesExecutiveApi.ts', 'w') as f:
    f.write(content)
