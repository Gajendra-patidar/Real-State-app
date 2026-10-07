const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 \}/g,
  "{ enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }"
);

fs.writeFileSync(file, content);
