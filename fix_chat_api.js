const fs = require('fs');
const file = 'src/services/api/chatApi.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /startDirectChat: async \(payload: \{ user_id: number \}\) => \{\n    try \{\n      const response = await api\.post\('executive\/chat\/direct', payload\);/g,
  "startSingleChat: async (payload: { user_id: number }) => {\n    try {\n      const response = await api.post('executive/chat/single/start', payload);"
);

fs.writeFileSync(file, content);
console.log('Fixed chatApi.ts');
