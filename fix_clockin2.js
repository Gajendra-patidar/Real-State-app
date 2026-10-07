const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `      const isFormData = payload instanceof FormData;
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        transformRequest: (data, headers) => {
          // Axios strips boundary if Content-Type is explicitly set. 
          // By not stringifying FormData, Axios will pass it directly to XHR
          // Wait, returning data directly works. But we need to ensure the boundary isn't overwritten.
          // The best approach in RN is to delete the Content-Type header so the XHR can generate it.
          delete headers.post['Content-Type'];
          delete headers['Content-Type'];
          return data;
        },
      } : {};
      
      const response = await api.post('/executive/attendance/clock-in', payload, config);`;

const newCode = `      const isFormData = payload && payload.append !== undefined;
      // In React Native, explicitly setting multipart/form-data strips the boundary and causes Network Errors.
      // Passing it as headers: { 'Content-Type': 'multipart/form-data' } is bad.
      // We rely on Axios automatically setting the Content-Type when it sees FormData.
      const response = await api.post('/executive/attendance/clock-in', payload, {
        headers: isFormData ? { 'Accept': 'application/json' } : {}
      });`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log('Simplified Axios FormData payload');
