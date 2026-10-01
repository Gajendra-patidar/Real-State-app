import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_DATA = [
  { id: '1', initials: 'VI', name: 'Vikram Singh (Executive 1)', email: 'sales@apexrealty.com', leads: 18, visits: 0, bookings: 0, conv: '0%' },
  { id: '2', initials: 'NE', name: 'Neha Gupta (Executive 2)', email: 'neha.exec@apexrealty.com', leads: 1, visits: 0, bookings: 0, conv: '0%' },
  { id: '3', initials: 'RO', name: 'Rohan Verma (Executive 3)', email: 'rohan.exec@apexrealty.com', leads: 1, visits: 0, bookings: 0, conv: '0%' },
  { id: '4', initials: 'KA', name: 'Kavita Patel (Executive 4)', email: 'kavita.exec@apexrealty.com', leads: 0, visits: 0, bookings: 0, conv: '0%' },
  { id: '5', initials: 'AM', name: 'Amit Kulkarni (Executive 5)', email: 'amit.exec@apexrealty.com', leads: 2, visits: 0, bookings: 0, conv: '0%' },
];

export const ManagerReportsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const renderStatCard = (title: string, count: string, subtitle: string, titleColor: string, countColor: string, subColor: string) => (
    <View style={styles.statCard}>
      <Text style={[styles.statTitle, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.statCount, { color: countColor }]}>{count}</Text>
      <Text style={[styles.statSubtitle, { color: subColor }]}>{subtitle}</Text>
    </View>
  );

  const renderExecCard = ({ item }: { item: typeof MOCK_DATA[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.cardMetrics}>
        <View style={styles.metricCol}>
          <Text style={styles.metricValue}>{item.leads}</Text>
          <Text style={styles.metricLabel}>Assigned</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, {color: '#3B82F6'}]}>{item.visits}</Text>
          <Text style={styles.metricLabel}>Visits</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={[styles.metricValue, {color: '#10B981'}]}>{item.bookings}</Text>
          <Text style={styles.metricLabel}>Bookings</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricValue}>{item.conv}</Text>
          <Text style={styles.metricLabel}>Conv. Rate</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.btnActionSecondary}>
          <Icon name="cog" size={16} color="#6366F1" style={{marginRight: 6}} />
          <Text style={styles.btnActionSecondaryText}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnActionSecondary}>
          <Icon name="format-list-bulleted" size={16} color="#475569" style={{marginRight: 6}} />
          <Text style={styles.btnActionGreyText}>View Leads</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Reports & Analytics" />

      <FlatList
        data={MOCK_DATA}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <Text style={styles.pageTitle}>Executive Sales & Analytics Report</Text>
              <Text style={styles.pageSubtitle}>Real-time pipeline performance, inventory conversion rates, and sales team efficiency.</Text>
              
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.btnManage} onPress={() => navigation.navigate('Teams')}>
                  <Icon name="account-cog" size={16} color="#FFF" style={{marginRight: 6}} />
                  <Text style={styles.btnManageText}>Manage Sales Executives</Text>
                </TouchableOpacity>
                <View style={styles.syncBadge}>
                  <Icon name="lightning-bolt" size={14} color="#6366F1" style={{marginRight: 4}} />
                  <Text style={styles.syncBadgeText}>Live Sync</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsGrid}>
              {renderStatCard('TOTAL CRM LEADS', '20', 'Conversions: 0', colors.textSecondary, colors.text, '#10B981')}
              {renderStatCard('SITE VISITS', '0', 'Scheduled & Conducted', colors.textSecondary, '#3B82F6', colors.textMuted)}
              {renderStatCard('TOTAL BOOKINGS', '1', 'Units Secured', colors.textSecondary, '#10B981', colors.textMuted)}
              {renderStatCard('TOKEN REVENUE', '₹100,000', 'Token Payments', colors.textSecondary, '#A855F7', colors.textMuted)}
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.listTitle}>Performance Breakdown</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Teams')}>
                <Text style={styles.linkText}>+ Add / Manage</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={renderExecCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  
  actionButtonsRow: { flexDirection: 'row', gap: spacing.m, alignItems: 'center' },
  btnManage: { flex: 1, flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnManageText: { color: '#FFF', fontSize: typography.sizes.s, fontWeight: 'bold' },
  syncBadge: { flexDirection: 'row', backgroundColor: '#EEF2FF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  syncBadgeText: { color: '#4F46E5', fontSize: typography.sizes.s, fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.m, justifyContent: 'space-between', gap: spacing.s },
  statCard: { width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.s, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: spacing.xs },
  statCount: { fontSize: typography.sizes.xl, fontWeight: '800', marginBottom: 2 },
  statSubtitle: { fontSize: 10, fontWeight: '500' },

  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.m, marginBottom: spacing.s },
  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  linkText: { fontSize: typography.sizes.s, color: '#3B82F6', fontWeight: 'bold' },

  card: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', padding: spacing.m, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#4F46E5' },
  userName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  userEmail: { fontSize: typography.sizes.s, color: colors.textSecondary },

  cardMetrics: { flexDirection: 'row', paddingVertical: spacing.m, borderTopWidth: 1, borderTopColor: colors.border, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: '#F8FAFC' },
  metricCol: { flex: 1, alignItems: 'center' },
  metricDivider: { width: 1, backgroundColor: colors.border },
  metricValue: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text },
  metricLabel: { fontSize: 9, color: colors.textSecondary, marginTop: 4, fontWeight: '700', textTransform: 'uppercase' },

  cardFooter: { flexDirection: 'row', gap: spacing.m, padding: spacing.m },
  btnActionSecondary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  btnActionSecondaryText: { color: '#4F46E5', fontSize: typography.sizes.s, fontWeight: 'bold' },
  btnActionGreyText: { color: '#475569', fontSize: typography.sizes.s, fontWeight: 'bold' },
});
