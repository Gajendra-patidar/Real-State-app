const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /if \(lead\.user\?\.id !== selectedEmployee\.id\) \{/,
  "if (lead.user?.id !== selectedEmployee.id && lead.assigned_to_user_id !== selectedEmployee.id) {"
);

fs.writeFileSync(file, content);
console.log('Fixed leads employee filter');
