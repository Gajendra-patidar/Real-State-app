const fs = require('fs');

// Fix LoginScreen.tsx
const loginFile = 'src/screens/auth/LoginScreen.tsx';
let loginContent = fs.readFileSync(loginFile, 'utf8');

loginContent = loginContent.replace(
  "import messaging from '@react-native-firebase/messaging';",
  "import { getMessaging, getToken } from '@react-native-firebase/messaging';"
);

const oldLoginBlock = `      try {
        if (messaging && typeof messaging === 'function') { fcm_token = await messaging().getToken(); } else { throw new Error('Native module missing'); }
        console.log('Got FCM token for login:', fcm_token);
      } catch (fcmError) {`;

const newLoginBlock = `      try {
        const messaging = getMessaging();
        fcm_token = await getToken(messaging);
        console.log('Got FCM token for login:', fcm_token);
      } catch (fcmError) {`;

loginContent = loginContent.replace(oldLoginBlock, newLoginBlock);
fs.writeFileSync(loginFile, loginContent);


// Fix notificationService.ts
const notifFile = 'src/services/notificationService.ts';
let notifContent = fs.readFileSync(notifFile, 'utf8');

notifContent = notifContent.replace(
  "import messaging from '@react-native-firebase/messaging';",
  "import { getMessaging, getToken, setBackgroundMessageHandler, onMessage, requestPermission, isDeviceRegisteredForRemoteMessages, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging';"
);

// We need to fix the try/catch wrappers
notifContent = notifContent.replace(
  "if (messaging && typeof messaging === 'function') { messaging().setBackgroundMessageHandler(async remoteMessage => {",
  "const messaging = getMessaging();\n  setBackgroundMessageHandler(messaging, async remoteMessage => {"
);
notifContent = notifContent.replace(
  "console.log('Message handled in the background!', remoteMessage);\n  }); }\n} catch (e) {",
  "console.log('Message handled in the background!', remoteMessage);\n  });\n} catch (e) {"
);

notifContent = notifContent.replace(
  "if (messaging && typeof messaging === 'function') { messaging().onMessage(async remoteMessage => {",
  "const messaging = getMessaging();\n      onMessage(messaging, async remoteMessage => {"
);
notifContent = notifContent.replace(
  "await this.displayLocalNotification(remoteMessage);\n      }); }",
  "await this.displayLocalNotification(remoteMessage);\n      });"
);

notifContent = notifContent.replace(
  "if (!messaging || typeof messaging !== 'function') return;\n      const authStatus = await messaging().requestPermission();",
  "const messaging = getMessaging();\n      const authStatus = await requestPermission(messaging);"
);

notifContent = notifContent.replace(
  "if (!messaging || typeof messaging !== 'function') return;\n      if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {\n        await messaging().registerDeviceForRemoteMessages();\n      }\n      const token = await messaging().getToken();",
  "const messaging = getMessaging();\n      if (Platform.OS === 'ios' && !isDeviceRegisteredForRemoteMessages(messaging)) {\n        await registerDeviceForRemoteMessages(messaging);\n      }\n      const token = await getToken(messaging);"
);

// We need to change authStatus === messaging.AuthorizationStatus... to the statics import, wait.
// Let's just import AuthorizationStatus from statics, or hardcode the enums (1 = AUTHORIZED, 2 = PROVISIONAL).
notifContent = notifContent.replace(
  "authStatus === messaging.AuthorizationStatus.AUTHORIZED ||\n        authStatus === messaging.AuthorizationStatus.PROVISIONAL;",
  "authStatus === 1 || authStatus === 2;"
);


fs.writeFileSync(notifFile, notifContent);
console.log('Fixed v26 Firebase Messaging syntax');
