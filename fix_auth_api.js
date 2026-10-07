const fs = require('fs');
const file = 'src/services/api/authApi.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'login: async (credentials: {email: string; password: string}) => {',
  'login: async (credentials: {email: string; password: string; fcm_token?: string}) => {'
);

fs.writeFileSync(file, content);
console.log('Fixed authApi.login signature');
