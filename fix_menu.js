const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveMenuScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<MenuItem icon="handshake" title="Negotiations" routeName="Negotiations" iconColor="#D97706" isLast \/>/,
  '<MenuItem icon="handshake" title="Negotiations" routeName="Negotiations" iconColor="#D97706" />\n          <MenuItem icon="check-decagram" title="Booked" routeName="Bookings" iconColor="#10B981" isLast />'
);

fs.writeFileSync(file, content);
console.log('Added Booked to Menu');
