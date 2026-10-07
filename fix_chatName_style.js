const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /chatName: \{ fontSize: typography\.sizes\.m, fontWeight: 'bold', color: colors\.text, marginBottom: 4 \},/,
  "chatName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, flex: 1, marginRight: 8 },"
);

fs.writeFileSync(file, content);
