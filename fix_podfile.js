const fs = require('fs');
const file = 'ios/Podfile';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('$RNFirebaseDisableSPM = true')) {
    content = '$RNFirebaseDisableSPM = true\n' + content;
    fs.writeFileSync(file, content);
    console.log('Added $RNFirebaseDisableSPM = true to Podfile');
}
