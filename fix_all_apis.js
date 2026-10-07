const fs = require('fs');

const files = [
  'src/screens/salesExecutive/SalesExecutiveContactsScreen.tsx',
  'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx',
  'src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import\s*\{\s*dashboardApi\s*\}\s*from\s*'[^']+\/services\/api\/dashboardApi';/g, '');
  content = content.replace(/dashboardApi\.getManagerExecutives\(\)\.catch\(\(\) => null\)/g, "chatApi.getUsers().catch(() => null)");
  content = content.replace(/dashboardApi\.getManagerExecutives\(\)/g, "chatApi.getUsers()");
  
  if (file.includes('SalesExecutiveLeadsScreen.tsx') && !content.includes('import { chatApi }')) {
     content = content.replace(
       /import \{ salesExecutiveApi \} from '\.\.\/\.\.\/services\/api\/salesExecutiveApi';/,
       "import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';\nimport { chatApi } from '../../services/api/chatApi';"
     );
  }
  
  if (file.includes('SalesExecutiveContactsScreen.tsx') && !content.includes('import { chatApi }')) {
     content = content.replace(
       /import \{ useNavigation \} from '@react-navigation\/native';/,
       "import { useNavigation } from '@react-navigation/native';\nimport { chatApi } from '../../services/api/chatApi';"
     );
  }
  
  fs.writeFileSync(file, content);
});
console.log('Fixed all manager APIs in Sales');
