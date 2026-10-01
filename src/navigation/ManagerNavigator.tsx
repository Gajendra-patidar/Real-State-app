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
  Menu as MenuIcon,
} from 'lucide-react-native';
import {colors} from '../theme/colors';

import {ManagerDashboardScreen} from '../screens/manager/ManagerDashboardScreen';
import {ManagerLeadsScreen}     from '../screens/manager/ManagerLeadsScreen';
import {ManagerContactsScreen}  from '../screens/manager/ManagerContactsScreen';
import {ManagerPropertiesScreen} from '../screens/manager/ManagerPropertiesScreen';
import {ManagerMoreScreen}      from '../screens/manager/ManagerMoreScreen';
import {ManagerMenuScreen}      from '../screens/manager/ManagerMenuScreen';
import {ProfileScreen}          from '../screens/shared/ProfileScreen';
import {ManagerSiteVisitsScreen} from '../screens/manager/ManagerSiteVisitsScreen';
import {ManagerDealsScreen}     from '../screens/manager/ManagerDealsScreen';
import {ManagerTasksScreen}     from '../screens/manager/ManagerTasksScreen';
import {ManagerFollowUpsScreen} from '../screens/manager/ManagerFollowUpsScreen';
import {ManagerDocumentsScreen} from '../screens/manager/ManagerDocumentsScreen';
import {ManagerSupportDeskScreen} from '../screens/manager/ManagerSupportDeskScreen';
import {ManagerTeamsScreen} from '../screens/manager/ManagerTeamsScreen';
import {ManagerReportsScreen} from '../screens/manager/ManagerReportsScreen';
import {ManagerActivityLogScreen} from '../screens/manager/ManagerActivityLogScreen';
import {ManagerPaymentsScreen} from '../screens/manager/ManagerPaymentsScreen';
import {ManagerPermissionsScreen} from '../screens/manager/ManagerPermissionsScreen';
import {ManagerHRMSDashboardScreen} from '../screens/manager/ManagerHRMSDashboardScreen';
import {ManagerHRMSStaffDirectoryScreen} from '../screens/manager/ManagerHRMSStaffDirectoryScreen';
import {ManagerHRMSAttendanceScreen} from '../screens/manager/ManagerHRMSAttendanceScreen';
import {ManagerHRMSLeaveManagementScreen} from '../screens/manager/ManagerHRMSLeaveManagementScreen';
import {ManagerHRMSPayrollScreen} from '../screens/manager/ManagerHRMSPayrollScreen';
import {NotificationsScreen} from '../screens/shared/NotificationsScreen';
import {ManagerTeamChatScreen} from '../screens/manager/ManagerTeamChatScreen';
import {ManagerChatRoomScreen} from '../screens/manager/ManagerChatRoomScreen';
import {ManagerLeadDetailsScreen} from '../screens/manager/ManagerLeadDetailsScreen';

import { ScheduleSiteVisitScreen, StartNegotiationScreen, RecordBookingScreen, DropLeadScreen } from '../screens/manager/ManagerActionScreens';

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
          if (route.name === 'Menu')       return <MenuIcon size={s} color={color} strokeWidth={w} />;
          return <LayoutDashboard size={s} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard"  component={ManagerDashboardScreen} />
      <Tab.Screen name="Leads"      component={ManagerLeadsScreen} />
      <Tab.Screen name="Contacts"   component={ManagerContactsScreen} />
      <Tab.Screen name="Properties" component={ManagerPropertiesScreen} />
      <Tab.Screen name="Menu"       component={ManagerMenuScreen} />
    </Tab.Navigator>
  );
};

export const ManagerNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ManagerTabs"  component={TabNavigator} />
    <Stack.Screen name="SiteVisits"   component={ManagerSiteVisitsScreen}  options={{headerShown: false}} />
    <Stack.Screen name="Deals"        component={ManagerDealsScreen}        options={{headerShown: false}} />
    <Stack.Screen name="Tasks"        component={ManagerTasksScreen}        options={{headerShown: false}} />
    <Stack.Screen name="FollowUps"    component={ManagerFollowUpsScreen}    options={{headerShown: false}} />
    <Stack.Screen name="SupportDesk"  component={ManagerSupportDeskScreen}  options={{headerShown: false}} />
    <Stack.Screen name="Teams"        component={ManagerTeamsScreen}        options={{headerShown: false}} />
    <Stack.Screen name="Reports"      component={ManagerReportsScreen}      options={{headerShown: false}} />
    <Stack.Screen name="ActivityLog"  component={ManagerActivityLogScreen}  options={{headerShown: false}} />
    <Stack.Screen name="Payments"     component={ManagerPaymentsScreen}     options={{headerShown: false}} />
    <Stack.Screen name="Permissions"  component={ManagerPermissionsScreen}  options={{headerShown: false}} />
    <Stack.Screen name="HRMSDashboard" component={ManagerHRMSDashboardScreen} options={{headerShown: false}} />
    <Stack.Screen name="HRMSStaffDirectory" component={ManagerHRMSStaffDirectoryScreen} options={{headerShown: false}} />
    <Stack.Screen name="HRMSAttendance" component={ManagerHRMSAttendanceScreen} options={{headerShown: false}} />
    <Stack.Screen name="HRMSLeaveManagement" component={ManagerHRMSLeaveManagementScreen} options={{headerShown: false}} />
    <Stack.Screen name="HRMSPayroll"  component={ManagerHRMSPayrollScreen}  options={{headerShown: false}} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{headerShown: false}} />
    <Stack.Screen name="TeamChat"     component={ManagerTeamChatScreen}     options={{headerShown: false}} />
    <Stack.Screen name="ChatRoom"     component={ManagerChatRoomScreen}     options={{headerShown: false}} />
    <Stack.Screen name="Documents"    component={ManagerDocumentsScreen}    options={{headerShown: false}} />
    <Stack.Screen name="ManagerLeadDetails" component={ManagerLeadDetailsScreen} options={{headerShown: false}} />
    
    <Stack.Screen name="ScheduleSiteVisit" component={ScheduleSiteVisitScreen} options={{headerShown: false}} />
    <Stack.Screen name="StartNegotiation" component={StartNegotiationScreen} options={{headerShown: false}} />
    <Stack.Screen name="RecordBooking" component={RecordBookingScreen} options={{headerShown: false}} />
    <Stack.Screen name="DropLead" component={DropLeadScreen} options={{headerShown: false}} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
  </Stack.Navigator>
);
