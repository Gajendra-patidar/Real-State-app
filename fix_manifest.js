const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let content = fs.readFileSync(file, 'utf8');

const perms = `    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />`;

content = content.replace(
    /<uses-permission android:name="android.permission.INTERNET" \/>\s*<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" \/>\s*<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" \/>/,
    perms
);

fs.writeFileSync(file, content);
console.log('Added Android permissions');
