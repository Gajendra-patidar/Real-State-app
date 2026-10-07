const fs = require('fs');
const file = 'android/app/build.gradle';
let content = fs.readFileSync(file, 'utf8');

const target = 'apply plugin: "com.facebook.react"';
if (!content.includes('com.google.gms.google-services')) {
    content = content.replace(target, target + '\napply plugin: "com.google.gms.google-services"');
    fs.writeFileSync(file, content);
    console.log('Added google-services plugin to app/build.gradle');
}
