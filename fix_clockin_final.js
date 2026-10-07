const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `      const isFormData = payload && payload.append !== undefined;
      // In React Native, explicitly setting multipart/form-data strips the boundary and causes Network Errors.
      // Passing it as headers: { 'Content-Type': 'multipart/form-data' } is bad.
      // We rely on Axios automatically setting the Content-Type when it sees FormData.
      const response = await api.post('/executive/attendance/clock-in', payload, {
        headers: isFormData ? { 'Accept': 'application/json' } : {}
      });`;

const newCode = `      const isFormData = payload && payload.append !== undefined;
      const response = await api.post('/executive/attendance/clock-in', payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log('Final fix for Axios FormData payload');
