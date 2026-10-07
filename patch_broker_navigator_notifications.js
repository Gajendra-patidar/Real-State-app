const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/navigation/BrokerNavigator.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('BrokerNotificationsScreen')) {
  content = content.replace(
    "import {BrokerCommissionScreen}  from '../screens/broker/BrokerCommissionScreen';",
    "import {BrokerCommissionScreen}  from '../screens/broker/BrokerCommissionScreen';\nimport {BrokerNotificationsScreen} from '../screens/broker/BrokerNotificationsScreen';"
  );
  content = content.replace(
    "<Stack.Screen name=\"Commission\" component={BrokerCommissionScreen} />",
    "<Stack.Screen name=\"Commission\" component={BrokerCommissionScreen} />\n    <Stack.Screen name=\"Notifications\" component={BrokerNotificationsScreen} />"
  );
  fs.writeFileSync(file, content);
}
