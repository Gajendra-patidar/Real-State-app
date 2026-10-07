const fs = require('fs');
const file = 'android/build.gradle';
let content = fs.readFileSync(file, 'utf8');

const target = 'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")';
if (!content.includes('com.google.gms:google-services')) {
    content = content.replace(target, target + '\n        classpath("com.google.gms:google-services:4.4.2")');
    fs.writeFileSync(file, content);
    console.log('Added google-services classpath');
}
