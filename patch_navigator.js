const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/navigation/BrokerNavigator.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('BrokerCommissionScreen')) {
  content = content.replace(
    "import {ProfileScreen}           from '../screens/shared/ProfileScreen';",
    "import {ProfileScreen}           from '../screens/shared/ProfileScreen';\nimport {BrokerCommissionScreen}  from '../screens/broker/BrokerCommissionScreen';"
  );
  content = content.replace(
    "<Stack.Screen name=\"BrokerTabs\" component={TabNavigator} />",
    "<Stack.Screen name=\"BrokerTabs\" component={TabNavigator} />\n    <Stack.Screen name=\"Commission\" component={BrokerCommissionScreen} />"
  );
  fs.writeFileSync(file, content);
}
