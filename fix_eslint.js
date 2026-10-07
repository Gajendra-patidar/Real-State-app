const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\(error\) => \{/,
  "(_error) => {"
);

content = content.replace(
  /\.catch\(e => \(/,
  ".catch(_e => ("
);

fs.writeFileSync(file, content);
