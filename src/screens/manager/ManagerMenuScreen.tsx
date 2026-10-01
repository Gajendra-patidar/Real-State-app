import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const MenuItem = ({ icon, title, routeName, iconColor = colors.primary, isLast = false }: { icon: string, title: string, routeName?: string, iconColor?: string, isLast?: boolean }) => {
  const navigation = useNavigation<any>();
  
  const handlePress = () => {
    if (routeName) {
      navigation.navigate(routeName);
    } else {
      Alert.alert('Coming Soon', `${title} is not yet implemented.`);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
      onPress={handlePress}
    >
      <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
      <Icon name="chevron-right" size={20} color={colors.border} />
    </TouchableOpacity>
  );
};


const ExpandableMenuItem = ({ icon, title, iconColor = colors.primary, subItems, isLast = false }: { icon: string, title: string, iconColor?: string, subItems: {title: string, routeName?: string}[], isLast?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <View style={!isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <TouchableOpacity 
        style={[styles.menuItem, { borderBottomWidth: 0 }]} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={{ backgroundColor: '#F8FAFC', paddingBottom: spacing.s }}>
          {subItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ paddingVertical: 12, paddingLeft: 64, paddingRight: spacing.m, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (item.routeName) {
                  navigation.navigate(item.routeName);
                } else {
                  Alert.alert('Coming Soon', `${item.title} is not yet implemented.`);
                }
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: iconColor, marginRight: 12, opacity: 0.5 }} />
              <Text style={{ fontSize: typography.sizes.m, color: colors.textSecondary, fontWeight: '500' }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const ManagerMenuScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { user, role } = useAuth();
  const userName = user?.name || 'User';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('auth_token');
          dispatch(logout());
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 10 : insets.top - 20 }]}>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileRole}>{role?.replace('_', ' ') || 'Manager'}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Sales & Pipeline Group */}
        <SectionHeader title="Sales & Pipeline" />
        <View style={styles.cardGroup}>
          <MenuItem icon="account-multiple" title="Leads" routeName="Leads" iconColor="#6366F1" />
          <MenuItem icon="contacts" title="Contacts" routeName="Contacts" iconColor="#10B981" />
          <MenuItem icon="office-building" title="Properties" routeName="Properties" iconColor="#F59E0B" />
          <MenuItem icon="map-marker" title="Site Visits" routeName="SiteVisits" iconColor="#EC4899" />
          <MenuItem icon="cash-multiple" title="Deals" routeName="Deals" iconColor="#14B8A6" isLast />
        </View>

        {/* Operations Group */}
        <SectionHeader title="Operations" />
        <View style={styles.cardGroup}>
          <MenuItem icon="format-list-checks" title="Tasks" routeName="Tasks" iconColor="#8B5CF6" />
          <MenuItem icon="rocket-launch" title="Follow-ups" routeName="FollowUps" iconColor="#F97316" />
          <ExpandableMenuItem 
            icon="account-clock" 
            title="HRMS" 
            iconColor="#3B82F6" 
            subItems={[
              { title: 'Dashboard', routeName: 'HRMSDashboard' },
              { title: 'Staff Directory', routeName: 'HRMSStaffDirectory' },
              { title: 'Attendance', routeName: 'HRMSAttendance' },
              { title: 'Leave Management', routeName: 'HRMSLeaveManagement' },
              { title: 'Payroll & Salary', routeName: 'HRMSPayroll' }
            ]}
          />
          <MenuItem icon="headset" title="Support Desk" routeName="SupportDesk" iconColor="#06B6D4" />
          <MenuItem icon="chat-processing" title="Team Chat" routeName="TeamChat" iconColor="#22C55E" isLast />
        </View>

        {/* Management Group */}
        <SectionHeader title="Management" />
        <View style={styles.cardGroup}>
          <MenuItem icon="account-tie" title="Teams" routeName="Teams" iconColor="#64748B" />
          <MenuItem icon="chart-bar" title="Reports" routeName="Reports" iconColor="#EAB308" />
          <MenuItem icon="format-list-bulleted" title="Activity Log" routeName="ActivityLog" iconColor="#84CC16" />
          <MenuItem icon="credit-card" title="Payments" routeName="Payments" iconColor="#1D4ED8" />
          <MenuItem icon="shield-check" title="My Permissions" routeName="Permissions" iconColor="#3F6212" isLast />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Standard light grey app background
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.m,
  },
  
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 16,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  avatarText: {
    color: colors.surface,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },

  // Sections & Groups
  sectionHeader: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginLeft: spacing.s,
    marginBottom: spacing.s,
    marginTop: spacing.s,
    letterSpacing: 0.5,
  },
  cardGroup: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.l,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 16,
    marginTop: spacing.m,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    marginLeft: spacing.s,
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.error,
  },
});
