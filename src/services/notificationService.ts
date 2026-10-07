import {
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
  registerDeviceForRemoteMessages,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import type {RemoteMessage} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';

class NotificationService {
  private setupPromise?: Promise<void>;
  private static readonly channelId = 'default';

  public setup(): Promise<void> {
    if (!this.setupPromise) {
      this.setupPromise = this.initialize();
    }
    return this.setupPromise;
  }

  private async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await this.createAndroidChannel();
      }

      const messaging = getMessaging();
      onMessage(messaging, async remoteMessage => {
        console.log('Received FCM message in foreground:', remoteMessage.messageId);
        await this.displayLocalNotification(remoteMessage);
      });
    } catch (error) {
      console.error('Unable to register foreground notification handler:', error);
    }

    try {
      notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('User pressed foreground notification', detail.notification);
        }
      });
    } catch (error) {
      console.error('Unable to register foreground notification event handler:', error);
    }

    try {
      await this.requestUserPermission();
    } catch (error) {
      console.error('Unable to request notification permission:', error);
    }

    try {
      await this.getDeviceToken();
    } catch (error) {
      console.error('Unable to get FCM registration token:', error);
    }
  }

  private async requestUserPermission(): Promise<void> {
    if (Platform.OS === 'ios') {
      const messaging = getMessaging();
      const authStatus = await requestPermission(messaging);
      if (authStatus === 1 || authStatus === 2) {
        console.log('Notification permission granted:', authStatus);
      } else {
        console.warn('Notification permission was not granted:', authStatus);
      }
      return;
    }

    const settings = await notifee.requestPermission();
    if (__DEV__) {
      console.log(
        'Android notification permission status:',
        settings.authorizationStatus,
      );
    }
    if (settings.authorizationStatus !== 1) {
      console.warn(
        'Android notification permission is not authorized:',
        settings.authorizationStatus,
      );
    }
  }

  public async getDeviceToken(): Promise<string> {
    const messaging = getMessaging();
    if (
      Platform.OS === 'ios' &&
      !isDeviceRegisteredForRemoteMessages(messaging)
    ) {
      await registerDeviceForRemoteMessages(messaging);
    }
    const token = await getToken(messaging);
    if (__DEV__) {
      console.log('FCM registration token for Firebase Console test:', token);
    }
    return token;
  }

  private async createAndroidChannel(): Promise<string> {
    return notifee.createChannel({
      id: NotificationService.channelId,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  public async displayLocalNotification(
    remoteMessage: RemoteMessage,
  ): Promise<void> {
    try {
      const channelId = await this.createAndroidChannel();

      const data = Object.fromEntries(
        Object.entries(remoteMessage.data ?? {}).map(([key, value]) => [
          key,
          typeof value === 'string'
            ? value
            : JSON.stringify(value) ?? String(value),
        ]),
      );
      const dataTitle = remoteMessage.data?.title;
      const dataBody =
        remoteMessage.data?.body ?? remoteMessage.data?.message;

      await notifee.displayNotification({
        title:
          remoteMessage.notification?.title ??
          (typeof dataTitle === 'string' ? dataTitle : undefined) ??
          'New Notification',
        body:
          remoteMessage.notification?.body ??
          (typeof dataBody === 'string' ? dataBody : undefined) ??
          '',
        data,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
    } catch (error) {
      console.error('Error displaying local notification:', error);
    }
  }
}

export const notificationService = new NotificationService();

try {
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log(
        'Received FCM message in background:',
        remoteMessage.messageId,
        remoteMessage.notification?.title,
      );
      if (!remoteMessage.notification) {
        await notificationService.displayLocalNotification(remoteMessage);
    }
  });
} catch (error) {
  console.error('Unable to register background notification handler:', error);
}

try {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('User pressed background notification', detail.notification);
    }
  });
} catch (error) {
  console.error('Unable to register background notification event handler:', error);
}

// Injecting test function globally for debugging
(global as any).testNotification = async () => {
  console.log("Triggering test notification...");
  try {
    await notificationService.displayLocalNotification({
      notification: { title: "Test Notification", body: "This is a local test to verify Notifee is working!" },
      data: {}
    } as any);
    console.log("Test notification triggered successfully");
  } catch (e) {
    console.error("Test notification failed:", e);
  }
};
