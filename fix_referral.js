const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /onPress=\{.*?navigation\.navigate\('ReferralLink'\)\}/,
  "onPress={() => { Alert.alert('Coming Soon', 'Referral link sharing will be available in a future update.'); }}"
);

fs.writeFileSync(file, content);
