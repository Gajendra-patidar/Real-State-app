const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /clockIn: async \(payload: \{ latitude: number; longitude: number; address\?: string \}\) => \{/,
  `clockIn: async (payload: any) => {`
);

content = content.replace(
  /const response = await api\.post\('\/executive\/attendance\/clock-in', payload\);/,
  `const isFormData = payload instanceof FormData;
      const response = await api.post('/executive/attendance/clock-in', payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });`
);

fs.writeFileSync(file, content);
console.log('Updated clockIn signature');
