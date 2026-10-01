import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const PERMISSIONS = [
  { id: '1', module: 'Leads & Pipeline', icon: 'account-group', read: true, write: true, edit: true, delete: false },
  { id: '2', module: 'Site Visits', icon: 'map-marker', read: true, write: true, edit: true, delete: false },
  { id: '3', module: 'Deals & Bookings', icon: 'currency-inr', read: true, write: true, edit: true, delete: false },
  { id: '4', module: 'Tasks & Follow-ups', icon: 'format-list-checks', read: true, write: true, edit: true, delete: true },
  { id: '5', module: 'Team Chat', icon: 'chat-processing', read: true, write: true, edit: true, delete: true },
  { id: '6', module: 'Team Management', icon: 'account-tie', read: true, write: true, edit: true, delete: false },
  { id: '7', module: 'Reports & Analytics', icon: 'chart-bar', read: true, write: false, edit: false, delete: false },
  { id: '8', module: 'Payments Ledger', icon: 'credit-card', read: true, write: false, edit: false, delete: false },
];

export const ManagerPermissionsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const renderPermissionBadge = (label: string, hasAccess: boolean) => (
    <View style={[styles.badge, hasAccess ? styles.badgeActive : styles.badgeInactive]}>
      <Icon name={hasAccess ? 'check' : 'close'} size={12} color={hasAccess ? '#059669' : '#94A3B8'} style={{marginRight: 2}} />
      <Text style={[styles.badgeText, hasAccess ? styles.badgeTextActive : styles.badgeTextInactive]}>{label}</Text>
    </View>
  );

  const renderModuleCard = ({ item }: { item: typeof PERMISSIONS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Icon name={item.icon} size={20} color="#4F46E5" />
        </View>
        <Text style={styles.moduleName}>{item.module}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.permissionsRow}>
        {renderPermissionBadge('View', item.read)}
        {renderPermissionBadge('Create', item.write)}
        {renderPermissionBadge('Edit', item.edit)}
        {renderPermissionBadge('Delete', item.delete)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="My Permissions" />

      <FlatList
        data={PERMISSIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>PN</Text>
              </View>
              <Text style={styles.userName}>Priya Nair</Text>
              <View style={styles.roleBadge}>
                <Icon name="shield-account" size={14} color="#059669" style={{marginRight: 4}} />
                <Text style={styles.roleText}>Sales Manager</Text>
              </View>
              <Text style={styles.profileDesc}>Your current system access privileges. Contact your System Administrator to request elevated access.</Text>
            </View>
            <Text style={styles.sectionTitle}>Module Access Rights</Text>
          </>
        }
        renderItem={renderModuleCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  profileSection: { backgroundColor: colors.surface, padding: spacing.l, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.m },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#4F46E5' },
  userName: { fontSize: typography.sizes.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.s },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0', marginBottom: spacing.m },
  roleText: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#059669' },
  profileDesc: { textAlign: 'center', fontSize: typography.sizes.s, color: colors.textSecondary, paddingHorizontal: spacing.m },

  sectionTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },

  card: { backgroundColor: colors.surface, marginHorizontal: spacing.m, marginBottom: spacing.m, borderRadius: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.m },
  iconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  moduleName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  
  permissionsRow: { flexDirection: 'row', padding: spacing.m, justifyContent: 'space-between' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeActive: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  badgeInactive: { backgroundColor: '#F8FAFC', borderColor: colors.border },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  badgeTextActive: { color: '#059669' },
  badgeTextInactive: { color: '#94A3B8' },
});
