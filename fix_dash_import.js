const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import AsyncStorage from '@react-native-async-storage\/async-storage'; from '@react-navigation\/native';/,
  "import AsyncStorage from '@react-native-async-storage/async-storage';"
);

fs.writeFileSync(file, content);
