const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<TouchableOpacity style=\{styles\.bellBtn\}>/g,
  "<TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>"
);

fs.writeFileSync(file, content);
