import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/services/api/salesExecutiveApi.ts', 'r') as f:
    content = f.read()

new_methods = """
  getFollowUps: async () => {
    const response = await api.get('/executive/follow-ups');
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/executive/projects');
    return response.data;
  },
"""

content = content.replace("export const salesExecutiveApi = {", "export const salesExecutiveApi = {\n" + new_methods)

with open('/Users/apple/React_Native_projects/Real-State-app/src/services/api/salesExecutiveApi.ts', 'w') as f:
    f.write(content)
