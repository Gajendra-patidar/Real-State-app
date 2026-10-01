import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {authApi} from '../../services/api/authApi';
import {useNavigation} from '@react-navigation/native';
import {
  MapPin,
  Handshake,
  CheckSquare,
  Clock,
  FileText,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

export const ManagerMoreScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.log('API logout skipped:', e);
    }
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.log('AsyncStorage clear error:', e);
    }
    dispatch(logout());
  };

  const renderMenuItem = (
    Icon: React.FC<any>,
    iconColor: string,
    iconBg: string,
    title: string,
    onPress: () => void,
    isDanger?: boolean,
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconWrap, {backgroundColor: isDanger ? '#FEF2F2' : iconBg}]}>
        <Icon size={18} color={isDanger ? colors.error : iconColor} strokeWidth={2} />
      </View>
      <Text style={[styles.menuText, isDanger && {color: colors.error}]}>{title}</Text>
      {!isDanger && <ChevronRight size={16} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom + 16}]}>
      <Text style={styles.title}>More Options</Text>

      <View style={styles.section}>
        {renderMenuItem(MapPin,     colors.warning,   colors.warningLight,  'Site Visits',  () => navigation.navigate('SiteVisits'))}
        {renderMenuItem(Handshake,  colors.secondary, colors.infoLight,     'Deals',        () => navigation.navigate('Deals'))}
        {renderMenuItem(CheckSquare, colors.success,  colors.successLight,  'Tasks',        () => navigation.navigate('Tasks'))}
        {renderMenuItem(Clock,      colors.accent,    colors.purpleLight,   'Follow-ups',   () => navigation.navigate('FollowUps'))}
        {renderMenuItem(FileText,   colors.textSecondary, colors.background, 'Documents',   () => navigation.navigate('Documents'))}
      </View>

      <View style={styles.section}>
        {renderMenuItem(User,    colors.primary,  colors.background, 'Profile',  () => {})}
        {renderMenuItem(LogOut,  colors.error,    colors.errorLight,  'Logout',  handleLogout, true)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});