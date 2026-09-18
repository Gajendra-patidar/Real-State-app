import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Users,
  Clock,
  MapPin,
  Handshake,
  UserCircle,
} from 'lucide-react-native';
import {colors} from '../theme/colors';

import {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';
import {SalesExecutiveLeadsScreen}      from '../screens/salesExecutive/SalesExecutiveLeadsScreen';
import {SalesExecutiveFollowUpsScreen}  from '../screens/salesExecutive/SalesExecutiveFollowUpsScreen';
import {SalesExecutiveSiteVisitsScreen} from '../screens/salesExecutive/SalesExecutiveSiteVisitsScreen';
import {ProfileScreen}                  from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TAB_ICON_SIZE = 22;

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -4},
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIcon: ({color, focused}) => {
          const s = TAB_ICON_SIZE;
          const w = focused ? 2.5 : 1.8;
          if (route.name === 'Dashboard') return <LayoutDashboard size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Leads')     return <Users size={s} color={color} strokeWidth={w} />;
          if (route.name === 'FollowUps') return <Clock size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Visits')    return <MapPin size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Profile')   return <UserCircle size={s} color={color} strokeWidth={w} />;
          return <LayoutDashboard size={s} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={SalesExecutiveDashboardScreen} />
      <Tab.Screen name="Leads"     component={SalesExecutiveLeadsScreen} />
      <Tab.Screen name="FollowUps" component={SalesExecutiveFollowUpsScreen} options={{title: 'Follow-ups'}} />
      <Tab.Screen name="Visits"    component={SalesExecutiveSiteVisitsScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const SalesExecutiveNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SalesTabs" component={TabNavigator} />
  </Stack.Navigator>
);
