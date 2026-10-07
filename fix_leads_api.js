const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might import dashboardApi
content = content.replace(
  /import \{ dashboardApi \} from '\.\.\/\.\.\/services\/api\/dashboardApi';\n/,
  "import { chatApi } from '../../services/api/chatApi';\n"
);
content = content.replace(
  /import \{ dashboardApi \} from '\.\.\/\.\.\/services\/api\/dashboardApi';/,
  "import { chatApi } from '../../services/api/chatApi';"
);

content = content.replace(
  /dashboardApi\.getManagerExecutives\(\)\.catch\(\(\) => null\)/,
  "chatApi.getUsers().catch(() => null)"
);

fs.writeFileSync(file, content);
console.log('Fixed leads API');
