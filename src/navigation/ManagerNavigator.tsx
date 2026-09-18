import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Building2,
  MoreHorizontal,
  UserCircle,
} from 'lucide-react-native';
import {colors} from '../theme/colors';

import {ManagerDashboardScreen} from '../screens/manager/ManagerDashboardScreen';
import {ManagerLeadsScreen}     from '../screens/manager/ManagerLeadsScreen';
import {ManagerContactsScreen}  from '../screens/manager/ManagerContactsScreen';
import {ManagerPropertiesScreen} from '../screens/manager/ManagerPropertiesScreen';
import {ManagerMoreScreen}      from '../screens/manager/ManagerMoreScreen';
import {ProfileScreen}          from '../screens/shared/ProfileScreen';
import {ManagerSiteVisitsScreen} from '../screens/manager/ManagerSiteVisitsScreen';
import {ManagerDealsScreen}     from '../screens/manager/ManagerDealsScreen';
import {ManagerTasksScreen}     from '../screens/manager/ManagerTasksScreen';
import {ManagerFollowUpsScreen} from '../screens/manager/ManagerFollowUpsScreen';
import {ManagerDocumentsScreen} from '../screens/manager/ManagerDocumentsScreen';

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
          if (route.name === 'Dashboard')  return <LayoutDashboard size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Leads')      return <Users size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Contacts')   return <PhoneCall size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Properties') return <Building2 size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Profile')    return <UserCircle size={s} color={color} strokeWidth={w} />;
          return <LayoutDashboard size={s} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard"  component={ManagerDashboardScreen} />
      <Tab.Screen name="Leads"      component={ManagerLeadsScreen} />
      <Tab.Screen name="Contacts"   component={ManagerContactsScreen} />
      <Tab.Screen name="Properties" component={ManagerPropertiesScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const ManagerNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ManagerTabs"  component={TabNavigator} />
    <Stack.Screen name="SiteVisits"   component={ManagerSiteVisitsScreen}  options={{headerShown: true, title: 'Site Visits'}} />
    <Stack.Screen name="Deals"        component={ManagerDealsScreen}        options={{headerShown: true, title: 'Deals & Bookings'}} />
    <Stack.Screen name="Tasks"        component={ManagerTasksScreen}        options={{headerShown: true, title: 'Tasks'}} />
    <Stack.Screen name="FollowUps"    component={ManagerFollowUpsScreen}    options={{headerShown: true, title: 'Follow-ups'}} />
    <Stack.Screen name="Documents"    component={ManagerDocumentsScreen}    options={{headerShown: true, title: 'Documents'}} />
  </Stack.Navigator>
);
