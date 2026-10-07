const fs = require('fs');
const file = 'src/navigation/SalesExecutiveNavigator.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import \{SalesExecutiveNegotiationsScreen\} from '\.\.\/screens\/salesExecutive\/SalesExecutiveNegotiationsScreen';/,
  "import {SalesExecutiveNegotiationsScreen} from '../screens/salesExecutive/SalesExecutiveNegotiationsScreen';\nimport {SalesExecutiveBookingsScreen} from '../screens/salesExecutive/SalesExecutiveBookingsScreen';"
);

content = content.replace(
  /<Stack.Screen name="Negotiations" component=\{SalesExecutiveNegotiationsScreen\} \/>/,
  "<Stack.Screen name=\"Negotiations\" component={SalesExecutiveNegotiationsScreen} />\n    <Stack.Screen name=\"Bookings\" component={SalesExecutiveBookingsScreen} />"
);

fs.writeFileSync(file, content);
console.log('Added Bookings to Navigator');
