const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let content = fs.readFileSync(file, 'utf8');

const meta = `<meta-data
        android:name="com.google.firebase.messaging.default_notification_channel_id"
        android:value="default" />
      <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@mipmap/ic_launcher" />
      <activity`;

if (!content.includes('com.google.firebase.messaging.default_notification_channel_id')) {
    content = content.replace(/<activity/, meta);
    fs.writeFileSync(file, content);
    console.log('Added Firebase meta-data to AndroidManifest');
}
