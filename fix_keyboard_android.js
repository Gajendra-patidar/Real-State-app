const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSLeaveManagementScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change behavior for Android
content = content.replace(
  /behavior=\{Platform\.OS === 'ios' \? 'padding' : undefined\}/,
  "behavior={Platform.OS === 'ios' ? 'padding' : 'height'}"
);

// Add contentContainerStyle with paddingBottom to ScrollView
content = content.replace(
  /<ScrollView style=\{styles\.modalBody\} keyboardShouldPersistTaps="handled">/,
  `<ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 250 : 50 }} keyboardShouldPersistTaps="handled">`
);

fs.writeFileSync(file, content);
console.log('Fixed Android Modal Keyboard');
