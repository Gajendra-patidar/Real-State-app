import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {logout} from '../../store/slices/authSlice';
import {useAuth} from '../../hooks/useAuth';
import {authApi} from '../../services/api/authApi';
import {brokerApi} from '../../services/api/brokerApi';
import {AppHeader} from '../../components/common/AppHeader';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Bell,
  Moon,
  ChevronRight,
  LogOut,
  Lock,
  HelpCircle,
  Info,
  Edit3,
  Banknote,
} from 'lucide-react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ROLE_LABELS: Record<string, {label: string; color: string; bg: string}> = {
  manager:        {label: 'Manager',                color: colors.secondary,  bg: colors.infoLight},
  sales_manager:  {label: 'Sales Manager',          color: colors.secondary,  bg: colors.infoLight},
  sales_executive:{label: 'Sales Executive',        color: colors.accent,     bg: colors.purpleLight},
  executive:      {label: 'Sales Executive',        color: colors.accent,     bg: colors.purpleLight},
  broker:         {label: 'External Partner Broker',color: colors.success,    bg: colors.successLight},
};

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {user, role} = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [brokerProfile, setBrokerProfile] = useState<any>(null);
  const [loadingBroker, setLoadingBroker] = useState(false);
  
  React.useEffect(() => {
    if (role === 'broker') {
      setLoadingBroker(true);
      brokerApi.getBrokerProfile()
        .then(res => {
          if (res?.broker) setBrokerProfile(res.broker);
        })
        .catch(err => console.log('Failed to fetch broker profile', err))
        .finally(() => setLoadingBroker(false));
    }
  }, [role]);

  const roleInfo = ROLE_LABELS[role || ''] ?? {label: role || 'User', color: colors.textSecondary, bg: colors.border};
  const userName = user?.name || 'User';
  const userEmail = user?.email || '—';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of REOS CRM?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            // Try to notify server — ignore if API is unreachable
            try {
              await authApi.logout();
            } catch (e) {
              console.log('API logout skipped (network/server error):', e);
            }
            // Always clear local session regardless of API result
            try {
              await AsyncStorage.removeItem('auth_token');
              await AsyncStorage.removeItem('user');
            } catch (e) {
              console.log('AsyncStorage clear error:', e);
            }
            dispatch(logout());
          },
        },
      ],
    );
  };

  // ─── Section & Row helpers ────────────────────────────────────────────────
  const SectionHeader = ({title}: {title: string}) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const ActionRow = ({
    icon,
    iconBg,
    label,
    onPress,
    rightEl,
    isDanger,
  }: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    onPress?: () => void;
    rightEl?: React.ReactNode;
    isDanger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.actionRow}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      <View style={[styles.actionIconWrap, {backgroundColor: iconBg}]}>
        {icon}
      </View>
      <Text style={[styles.actionLabel, isDanger && {color: colors.error}]}>
        {label}
      </Text>
      {rightEl ?? <ChevronRight size={18} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root]}>
      <AppHeader title="Profile" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: insets.bottom + 24}]}>

        {/* ── Avatar Hero ───────────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Edit3 size={12} color={colors.surface} />
          </TouchableOpacity>

          <Text style={styles.heroName}>{userName}</Text>
          <Text style={styles.heroEmail}>{userEmail}</Text>

          <View style={[styles.rolePill, {backgroundColor: roleInfo.bg}]}>
            <Shield size={12} color={roleInfo.color} strokeWidth={2.5} />
            <Text style={[styles.rolePillText, {color: roleInfo.color}]}>
              {roleInfo.label}
            </Text>
          </View>
        </View>

        {/* ── Account Info ──────────────────────────────────────────── */}
        <SectionHeader title="ACCOUNT INFORMATION" />
        <View style={styles.card}>
          <InfoRow
            icon={<User size={16} color={colors.secondary} />}
            label="Full Name"
            value={userName}
          />
          <View style={styles.rowDivider} />
          <InfoRow
            icon={<Mail size={16} color={colors.accent} />}
            label="Email Address"
            value={userEmail}
          />
          <View style={styles.rowDivider} />
          <InfoRow
            icon={<Phone size={16} color={colors.success} />}
            label="Phone"
            value={brokerProfile?.phone || user?.phone || 'Not set'}
          />
          
          <View style={styles.rowDivider} />
          <InfoRow
            icon={<Shield size={16} color={roleInfo.color} />}
            label="Role"
            value={roleInfo.label}
          />
          
        </View>

        
        
        {/* ── Business & Earnings ─────────────────────────────────── */}
        {role === 'broker' && (
          <>
            <SectionHeader title="BUSINESS & EARNINGS" />
            <View style={styles.card}>
              <ActionRow
                icon={<Banknote size={16} color={colors.success} />}
                iconBg={colors.successLight}
                label="My Commissions"
                onPress={() => navigation.navigate('Commission')}
              />
            </View>
          </>
        )}

        {/* ── Preferences ───────────────────────────────────────────── */}
        <SectionHeader title="PREFERENCES" />
        <View style={styles.card}>
          <ActionRow
            icon={<Bell size={16} color={colors.warning} />}
            iconBg={colors.warningLight}
            label="Push Notifications"
            rightEl={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{false: colors.border, true: colors.secondary}}
                thumbColor={colors.surface}
              />
            }
          />
          <View style={styles.rowDivider} />
          <ActionRow
            icon={<Moon size={16} color={colors.accent} />}
            iconBg={colors.purpleLight}
            label="Dark Mode"
            rightEl={
              <Switch
                value={false}
                onValueChange={() =>
                  Alert.alert('Coming Soon', 'Dark mode will be available in a future update.')
                }
                trackColor={{false: colors.border, true: colors.secondary}}
                thumbColor={colors.surface}
              />
            }
          />
        </View>

        {/* ── Security & Support ────────────────────────────────────── */}
        <SectionHeader title="SECURITY & SUPPORT" />
        <View style={styles.card}>
          <ActionRow
            icon={<HelpCircle size={16} color={colors.success} />}
            iconBg={colors.successLight}
            label="Help & Support"
            onPress={() => Alert.alert('Support', 'Contact support@reoscrm.com')}
          />
          <View style={styles.rowDivider} />
          <ActionRow
            icon={<Info size={16} color={colors.textSecondary} />}
            iconBg={colors.background}
            label="App Version"
            rightEl={
              <Text style={styles.versionText}>v1.0.0</Text>
            }
          />
        </View>

{/* ── Logout Button ─────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
          disabled={loggingOut}>
          <LogOut size={20} color={colors.error} strokeWidth={2.5} />
          <Text style={styles.logoutText}>
            {loggingOut ? 'Logging out…' : 'Logout'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>REOS CRM • Real Estate Operating System</Text>
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    position: 'relative',
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    padding: 3,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 1,
  },
  editBadge: {
    position: 'absolute',
    top: 24 + 64,
    right: SCREEN_WIDTH / 2 - 54,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Section Header
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 54,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  versionText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },

  // Footer
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 20,
    marginBottom: 4,
  },
});
