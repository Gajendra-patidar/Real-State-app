const fs = require('fs');
const file = 'src/screens/manager/ManagerChatRoomScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /chatArea: \{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: spacing\.m \},/,
  "chatArea: { flexGrow: 1, padding: spacing.m },"
);

const oldEmpty = `<View style={styles.emptyState}>`;
const newEmpty = `<View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>`;
content = content.replace(oldEmpty, newEmpty);

fs.writeFileSync(file, content);
console.log('Fixed chat room styles');
