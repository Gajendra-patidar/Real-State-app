const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/navigation/BrokerNavigator.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove import
content = content.replace(/import \{BrokerCommissionScreen\}.*?\n/, '');

// Remove Banknote icon
content = content.replace(/\s*Banknote,\n/, '\n');

// Remove Commission tab icon logic
content = content.replace(/\s*if \(route\.name === 'Commission'\).*?\n/, '\n');

// Remove Commission Tab.Screen
content = content.replace(/\s*<Tab\.Screen name="Commission".*?\/>\n/, '\n');

fs.writeFileSync(file, content);
