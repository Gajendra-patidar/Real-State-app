const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveReportsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { ActivityIndicator, RefreshControl } from 'react-native';\nimport { salesExecutiveApi } from '../../services/api/salesExecutiveApi';\nimport { useAuth } from '../../hooks/useAuth';\nimport { View, Text, StyleSheet, ScrollView } from 'react-native';",
  "import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';\nimport { salesExecutiveApi } from '../../services/api/salesExecutiveApi';\nimport { useAuth } from '../../hooks/useAuth';"
);

fs.writeFileSync(file, content);
console.log('Fixed imports');
