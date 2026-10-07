const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

const newApis = `  getNotifications: async () => {
    try {
      const response = await api.get('/executive/notifications');
      return response.data;
    } catch (error) {
      console.error("getNotifications API ERROR:", error);
      throw error;
    }
  },

  markNotificationRead: async (id: number | string) => {
    try {
      const response = await api.post(\`/executive/notifications/\${id}/read\`);
      return response.data;
    } catch (error) {
      console.error("markNotificationRead API ERROR:", error);
      throw error;
    }
  },`;

if (!content.includes('getNotifications:')) {
  // Let's insert it before the closing brace of salesExecutiveApi
  content = content.replace(/};\s*$/, newApis + '\n};\n');
  fs.writeFileSync(file, content);
  console.log('Added notification APIs');
}
