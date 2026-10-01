import React from 'react';

import { View, Text } from 'react-native';

import {SalesExecutiveContactsScreen} from '../screens/salesExecutive/SalesExecutiveContactsScreen';
import {SalesExecutivePropertiesScreen} from '../screens/salesExecutive/SalesExecutivePropertiesScreen';
import {SalesExecutiveTasksScreen} from '../screens/salesExecutive/SalesExecutiveTasksScreen';
import {SalesExecutiveSupportDeskScreen} from '../screens/salesExecutive/SalesExecutiveSupportDeskScreen';
import {SalesExecutiveProjectInventoryScreen} from '../screens/salesExecutive/SalesExecutiveProjectInventoryScreen';
import {SalesExecutiveProjectShowcaseScreen} from '../screens/salesExecutive/SalesExecutiveProjectShowcaseScreen';
import {SalesExecutiveNegotiationsScreen} from '../screens/salesExecutive/SalesExecutiveNegotiationsScreen';
import {SalesExecutiveReportsScreen} from '../screens/salesExecutive/SalesExecutiveReportsScreen';
import {SalesExecutiveActivityLogScreen} from '../screens/salesExecutive/SalesExecutiveActivityLogScreen';

import {SalesExecutiveTeamChatScreen} from '../screens/salesExecutive/SalesExecutiveTeamChatScreen';
import {SalesExecutivePermissionsScreen} from '../screens/salesExecutive/SalesExecutivePermissionsScreen';
import {SalesExecutiveHRMSDashboardScreen} from '../screens/salesExecutive/SalesExecutiveHRMSDashboardScreen';
import {SalesExecutiveHRMSAttendanceScreen} from '../screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen';
import {SalesExecutiveHRMSLeaveManagementScreen} from '../screens/salesExecutive/SalesExecutiveHRMSLeaveManagementScreen';
import {SalesExecutiveHRMSPayrollScreen} from '../screens/salesExecutive/SalesExecutiveHRMSPayrollScreen';

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

import {SalesExecutiveMenuScreen}       from '../screens/salesExecutive/SalesExecutiveMenuScreen';
import { Menu as MenuIcon } from 'lucide-react-native';
import {SalesExecutiveLeadDetailsScreen} from '../screens/salesExecutive/SalesExecutiveLeadDetailsScreen';
import { ScheduleSiteVisitScreen, StartNegotiationScreen, RecordBookingScreen, DropLeadScreen } from '../screens/salesExecutive/SalesExecutiveActionScreens';
import {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';
import {SalesExecutiveLeadsScreen}      from '../screens/salesExecutive/SalesExecutiveLeadsScreen';
import {SalesExecutiveFollowUpsScreen}  from '../screens/salesExecutive/SalesExecutiveFollowUpsScreen';
import {SalesExecutiveSiteVisitsScreen} from '../screens/salesExecutive/SalesExecutiveSiteVisitsScreen';
import {ProfileScreen}                  from '../screens/shared/ProfileScreen';
import {NotificationsScreen} from '../screens/shared/NotificationsScreen';


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
          if (route.name === 'Menu')      return <MenuIcon size={s} color={color} strokeWidth={w} />;
          return <LayoutDashboard size={s} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={SalesExecutiveDashboardScreen} />
      <Tab.Screen name="Leads"     component={SalesExecutiveLeadsScreen} />
      <Tab.Screen name="FollowUps" component={SalesExecutiveFollowUpsScreen} options={{title: 'Follow-ups'}} />
      <Tab.Screen name="Visits"    component={SalesExecutiveSiteVisitsScreen} />
      <Tab.Screen name="Menu"      component={SalesExecutiveMenuScreen} />
    </Tab.Navigator>
  );
};

export const SalesExecutiveNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SalesTabs" component={TabNavigator} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />

    <Stack.Screen name="Contacts" component={SalesExecutiveContactsScreen} />
    <Stack.Screen name="Properties" component={SalesExecutivePropertiesScreen} />
    <Stack.Screen name="ProjectInventory" component={SalesExecutiveProjectInventoryScreen} />
    <Stack.Screen name="ProjectShowcase" component={SalesExecutiveProjectShowcaseScreen} />
    <Stack.Screen name="Negotiations" component={SalesExecutiveNegotiationsScreen} />
    <Stack.Screen name="Tasks" component={SalesExecutiveTasksScreen} />
    <Stack.Screen name="HRMSDashboard" component={SalesExecutiveHRMSDashboardScreen} />
    <Stack.Screen name="HRMSAttendance" component={SalesExecutiveHRMSAttendanceScreen} />
    <Stack.Screen name="HRMSLeaveManagement" component={SalesExecutiveHRMSLeaveManagementScreen} />
    <Stack.Screen name="HRMSPayroll" component={SalesExecutiveHRMSPayrollScreen} />
    <Stack.Screen name="SupportDesk" component={SalesExecutiveSupportDeskScreen} />
    <Stack.Screen name="TeamChat" component={SalesExecutiveTeamChatScreen} />
    <Stack.Screen name="Permissions" component={SalesExecutivePermissionsScreen} />
    <Stack.Screen name="Reports" component={SalesExecutiveReportsScreen} />
    <Stack.Screen name="ActivityLog" component={SalesExecutiveActivityLogScreen} />
<Stack.Screen name="SalesExecutiveLeadDetails" component={SalesExecutiveLeadDetailsScreen} options={{headerShown: false}} />
    <Stack.Screen name="ScheduleSiteVisit" component={ScheduleSiteVisitScreen} options={{headerShown: false}} />
    <Stack.Screen name="StartNegotiation" component={StartNegotiationScreen} options={{headerShown: false}} />
    <Stack.Screen name="RecordBooking" component={RecordBookingScreen} options={{headerShown: false}} />
    <Stack.Screen name="DropLead" component={DropLeadScreen} options={{headerShown: false}} />
    <Stack.Screen name="Profile" component={ProfileScreen} />


  </Stack.Navigator>
);
