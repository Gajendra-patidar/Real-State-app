const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const actualChatId = response\?\.id \|\| response\?\.chat_id \|\| response\?\.data\?\.id \|\| \(response === 5 \? 5 : response\);/,
  "const actualChatId = response?.id || response?.chat_id || response?.data?.id || response;"
);

fs.writeFileSync(file, content);
console.log('Fixed chatId extraction');
