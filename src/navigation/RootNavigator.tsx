import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {useAuth} from '../hooks/useAuth';
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
