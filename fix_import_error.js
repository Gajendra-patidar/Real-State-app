const fs = require('fs');
const file = 'src/screens/shared/NotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    "} Modal, ScrollView, } from 'react-native';",
    ", Modal, ScrollView } from 'react-native';"
);

fs.writeFileSync(file, content);
console.log('Fixed import syntax error');
