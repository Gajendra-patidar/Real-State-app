const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('getCalendar: async')) {
  const insertIndex = content.indexOf('getFollowUps:');
  const apiMethod = `
  getCalendar: async () => {
    try {
      const response = await api.get('/executive/calendar');
      return response.data;
    } catch (error) {
      console.error("getCalendar API ERROR:", error);
      throw error;
    }
  },

  `;
  content = content.slice(0, insertIndex) + apiMethod + content.slice(insertIndex);
  fs.writeFileSync(file, content);
  console.log('Added getCalendar to salesExecutiveApi.ts');
}
