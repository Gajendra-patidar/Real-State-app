const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSLeaveManagementScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the KeyboardAvoidingView
content = content.replace(
  /<KeyboardAvoidingView style=\{styles.modalOverlay\} behavior=\{Platform\.OS === 'ios' \? 'padding' : 'height'\}>/,
  "<KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>"
);

// Replace ScrollView
content = content.replace(
  /<ScrollView style=\{styles.modalBody\} contentContainerStyle=\{\{ paddingBottom: Platform\.OS === 'android' \? 250 : 50 \}\} keyboardShouldPersistTaps="handled">/,
  '<ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">'
);

// We need to ensure the modalContent has a maxHeight so it can scroll
content = content.replace(
  /<View style=\{\[styles\.modalContent, \{ paddingBottom: insets\.bottom \+ 20 \}\]\}>/,
  "<View style={[styles.modalContent, { paddingBottom: insets.bottom + 20, maxHeight: '90%' }]}>"
);

fs.writeFileSync(file, content);
console.log('Fixed Leave Modal Keyboard Properly');
