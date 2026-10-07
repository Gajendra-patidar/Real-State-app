const fs = require('fs');
const file = 'src/services/notificationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/smallIcon: 'ic_notification'/g, "smallIcon: 'ic_launcher'");
fs.writeFileSync(file, content);
console.log('Fixed notifee icon');
