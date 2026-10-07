const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveContactsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import {chatApi}')) {
  content = content.replace(
    /import \{useNavigation\} from '@react-navigation\/native';/,
    "import {useNavigation} from '@react-navigation/native';\nimport {chatApi} from '../../services/api/chatApi';"
  );
  fs.writeFileSync(file, content);
  console.log('Fixed missing import in Contacts Screen');
}
