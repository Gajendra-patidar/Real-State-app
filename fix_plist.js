const fs = require('fs');
const file = 'ios/realstate/Info.plist';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<key>NSLocationWhenInUseUsageDescription<\/key>[\s\n]*<string\/>/g,
  "<key>NSLocationWhenInUseUsageDescription</key>\n\t<string>This app needs access to your location for attendance tracking.</string>"
);

fs.writeFileSync(file, content);
