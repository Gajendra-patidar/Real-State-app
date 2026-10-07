import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {
  getMessaging,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import {authApi} from '../services/api/authApi';
import {useAuth} from '../hooks/useAuth';
import {notificationService} from '../services/notificationService';
import {restoreSession} from '../store/slices/authSlice';
import {ROLES} from '../constants/roles';

// Navigators
import {AuthNavigator} from './AuthNavigator';
import {ManagerNavigator} from './ManagerNavigator';
import {SalesExecutiveNavigator} from './SalesExecutiveNavigator';
import {BrokerNavigator} from './BrokerNavigator';
import {colors} from '../theme/colors';

export const RootNavigator = () => {
  const dispatch = useDispatch();
  const {isAuthenticated, role, isLoading} = useAuth();

  useEffect(() => {
    dispatch(restoreSession() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;
    const registerToken = async (token: string) => {
      try {
        await authApi.registerFcmToken(token);
      } catch (error) {
        console.error('Unable to register FCM token with the API:', error);
      }
    };

    const syncToken = async () => {
      try {
        await notificationService.setup();
        const token = await notificationService.getDeviceToken();
        if (active) {
          await registerToken(token);
        }
      } catch (error) {
        console.error('Unable to sync FCM token with the API:', error);
      }
    };

    let unsubscribe = () => {};
    try {
      unsubscribe = onTokenRefresh(getMessaging(), token => {
        if (active) {
          registerToken(token);
        }
      });
    } catch (error) {
      console.error('Unable to register FCM token refresh handler:', error);
    }

    syncToken();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderNavigator = () => {
    if (!isAuthenticated) {
      return <AuthNavigator />;
    }

    switch (role) {
      case ROLES.MANAGER:
      case ROLES.SALES_MANAGER:
        return <ManagerNavigator />;
      case ROLES.SALES_EXECUTIVE:
      case ROLES.EXECUTIVE:
        return <SalesExecutiveNavigator />;
      case ROLES.BROKER:
        return <BrokerNavigator />;
      default:
        // Fallback for unknown roles - maybe a generic unauthorized screen
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  }
});
