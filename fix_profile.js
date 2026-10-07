const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/shared/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const mergedRegex = /\{role === 'broker' && brokerProfile && \([\s\S]*?<\/View>\s*\)\}/;
content = content.replace(mergedRegex, '');

fs.writeFileSync(file, content);
