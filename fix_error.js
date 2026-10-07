const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\(_error\) => \{\n\s*reject\(error\);/g,
  "(_error) => {\n        reject(_error);"
);

fs.writeFileSync(file, content);
