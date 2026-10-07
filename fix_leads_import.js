const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import {chatApi}')) {
  content = content.replace(
    /import \{salesExecutiveApi\} from '\.\.\/\.\.\/services\/api\/salesExecutiveApi';/,
    "import {salesExecutiveApi} from '../../services/api/salesExecutiveApi';\nimport {chatApi} from '../../services/api/chatApi';"
  );
  fs.writeFileSync(file, content);
  console.log('Fixed missing import in Leads Screen');
}
