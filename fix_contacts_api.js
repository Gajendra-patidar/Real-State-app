const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveContactsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import \{ dashboardApi \} from '\.\.\/\.\.\/services\/api\/dashboardApi';/,
  "import { chatApi } from '../../services/api/chatApi';"
);

content = content.replace(
  /const response = await dashboardApi\.getManagerExecutives\(\);/,
  "const response = await chatApi.getUsers();"
);

content = content.replace(
  /setTeam\(response\.data\?\.data \|\| \[\]\);/,
  "setTeam(response?.data?.data || response?.data || []);"
);

fs.writeFileSync(file, content);
console.log('Fixed contacts API');
