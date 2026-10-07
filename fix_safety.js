const fs = require('fs');

// Fix LoginScreen.tsx
const loginFile = 'src/screens/auth/LoginScreen.tsx';
let loginContent = fs.readFileSync(loginFile, 'utf8');
loginContent = loginContent.replace(
  'fcm_token = await messaging().getToken();',
  "if (messaging && typeof messaging === 'function') { fcm_token = await messaging().getToken(); } else { throw new Error('Native module missing'); }"
);
fs.writeFileSync(loginFile, loginContent);

// Fix notificationService.ts
const notifFile = 'src/services/notificationService.ts';
let notifContent = fs.readFileSync(notifFile, 'utf8');
notifContent = notifContent.replace(
  'messaging().setBackgroundMessageHandler(async remoteMessage => {',
  "if (messaging && typeof messaging === 'function') { messaging().setBackgroundMessageHandler(async remoteMessage => {"
);
notifContent = notifContent.replace(
  "console.log('Message handled in the background!', remoteMessage);\n  });\n} catch (e) {",
  "console.log('Message handled in the background!', remoteMessage);\n  }); }\n} catch (e) {"
);

notifContent = notifContent.replace(
  "messaging().onMessage(async remoteMessage => {",
  "if (messaging && typeof messaging === 'function') { messaging().onMessage(async remoteMessage => {"
);
notifContent = notifContent.replace(
  "await this.displayLocalNotification(remoteMessage);\n      });",
  "await this.displayLocalNotification(remoteMessage);\n      }); }"
);

notifContent = notifContent.replace(
  "const authStatus = await messaging().requestPermission();",
  "if (!messaging || typeof messaging !== 'function') return;\n      const authStatus = await messaging().requestPermission();"
);

notifContent = notifContent.replace(
  "if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {",
  "if (!messaging || typeof messaging !== 'function') return;\n      if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {"
);

fs.writeFileSync(notifFile, notifContent);
console.log('Fixed safety checks');
