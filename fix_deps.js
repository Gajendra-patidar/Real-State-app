const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /useEffect\(\(\) => \{\n    fetchAttendance\(\);\n  \}, \[\]\);/m,
  "useEffect(() => {\n    fetchAttendance();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);"
);

fs.writeFileSync(file, content);
