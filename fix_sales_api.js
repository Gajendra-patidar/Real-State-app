const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethod = `  getAssignedLeads: async () => {
    try {
      const response = await api.get('executive/leads/assigned');
      return response.data;
    } catch (error) {
      console.error("getAssignedLeads API ERROR:", error);
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const response = await api.get('executive/bookings');
      return response.data;
    } catch (error) {
      console.error("getBookings API ERROR:", error);
      throw error;
    }
  },`;

content = content.replace(
  /getAssignedLeads: async \(\) => \{\n    try \{\n      const response = await api.get\('executive\/leads\/assigned'\);\n      return response\.data;\n    \} catch \(error\) \{\n      console\.error\("getAssignedLeads API ERROR:", error\);\n      throw error;\n    \}\n  \},/,
  newMethod
);

fs.writeFileSync(file, content);
console.log('Added getBookings API');
