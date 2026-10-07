const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/catch \(error\)/, 'catch (_error)');
fs.writeFileSync(file, content);
