import React from 'react';
import {View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Banknote,
  UserCircle,
} from 'lucide-react-native';
import {colors} from '../theme/colors';

import {BrokerDashboardScreen}  from '../screens/broker/BrokerDashboardScreen';
import {BrokerLeadsScreen}      from '../screens/broker/BrokerLeadsScreen';
import {BrokerSubmitLeadScreen} from '../screens/broker/BrokerSubmitLeadScreen';
import {ProfileScreen}          from '../screens/shared/ProfileScreen';

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
          // Key fix: add paddingBottom = device bottom inset so bar sits above home indicator / gesture bar
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
          const size = TAB_ICON_SIZE;
          if (route.name === 'Dashboard') return <LayoutDashboard size={size} color={color} strokeWidth={focused ? 2.5 : 1.8} />;
          if (route.name === 'MyLeads')   return <Users size={size} color={color} strokeWidth={focused ? 2.5 : 1.8} />;
          if (route.name === 'Submit')    return <PlusCircle size={size} color={color} strokeWidth={focused ? 2.5 : 1.8} />;
          if (route.name === 'Profile')   return <UserCircle size={size} color={color} strokeWidth={focused ? 2.5 : 1.8} />;
          return <LayoutDashboard size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={BrokerDashboardScreen} />
      <Tab.Screen name="MyLeads"   component={BrokerLeadsScreen}     options={{title: 'My Leads'}} />
      <Tab.Screen name="Submit"    component={BrokerSubmitLeadScreen} options={{title: 'Submit Lead'}} />
      <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const BrokerNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BrokerTabs" component={TabNavigator} />
  </Stack.Navigator>
);
