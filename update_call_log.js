const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<ScrollView contentContainerStyle=\{\{ padding: spacing\.l \}\}>/g,
  `<ScrollView contentContainerStyle={{ padding: spacing.l, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">`
);

fs.writeFileSync(file, content);
console.log('Fixed CallLogModal ScrollView');
