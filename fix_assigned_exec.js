const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import {useAuth}")) {
  content = content.replace(
    /import \{useNavigation\} from '@react-navigation\/native';/,
    `import {useNavigation} from '@react-navigation/native';\nimport {useAuth} from '../../hooks/useAuth';`
  );
}

if (!content.includes("const { user } = useAuth();")) {
  content = content.replace(
    /export const SalesExecutiveLeadsScreen = \(\) => \{/,
    `export const SalesExecutiveLeadsScreen = () => {\n  const { user } = useAuth();`
  );
}

content = content.replace(
  /assignedExecutive=\{item\.user\?\.name \|\| 'Unassigned'\}/g,
  `assignedExecutive={user?.name || item.user?.name || 'Unassigned'}`
);

fs.writeFileSync(file, content);
console.log('Fixed assignedExecutive');
