const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/services/api/brokerApi.ts';
let content = fs.readFileSync(file, 'utf8');

const profileMethod = `
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
`;

content = content.replace(/};\s*$/, profileMethod + '};\n');

fs.writeFileSync(file, content);
