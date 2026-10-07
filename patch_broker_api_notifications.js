const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/services/api/brokerApi.ts';
let content = fs.readFileSync(file, 'utf8');

const notificationMethods = `
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
      const response = await api.post(\`/broker/notifications/\${id}/read\`);
      return response.data;
    } catch (error) {
      console.error('markNotificationRead API ERROR:', error);
      throw error;
    }
  },
`;

if (!content.includes('getBrokerNotifications')) {
  content = content.replace(/};\s*$/, notificationMethods + '};\n');
  fs.writeFileSync(file, content);
}
