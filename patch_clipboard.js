const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('@react-native-clipboard/clipboard')) {
  content = content.replace(
    "import {SafeAreaView",
    "import Clipboard from '@react-native-clipboard/clipboard';\nimport {SafeAreaView"
  );
}

// Remove Linking.openURL(p.share_link) and replace with Clipboard
content = content.replace(
  /onCopy=\{\(\) => Linking\.openURL\(p\.share_link\)\}/g,
  "onCopy={() => {\n                  const link = p.share_link || `https://reoscrm.com/project/${p.code}`;\n                  Clipboard.setString(link);\n                  Alert.alert('Link Copied', `Referral link for ${p.name} copied to clipboard!`);\n                }}"
);

fs.writeFileSync(file, content);
