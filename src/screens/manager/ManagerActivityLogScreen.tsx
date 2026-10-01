import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_LOGS = [
  { id: '1', date: '28 Sep 2026, 11:22 AM', timeAgo: '5 minutes ago', staff: 'Priya Nair (Sales Manager 1)', role: 'Manager', lead: 'General Activity', category: 'SUPPORT TICKET', desc: 'New Support Ticket #TCK-2026-1045FT (Technical) was submitted by Vikram Singh (Executive 1) with High priority.', icon: 'headset' },
  { id: '2', date: '28 Sep 2026, 04:55 PM', timeAgo: '1 day ago', staff: 'Priya Nair (Sales Manager 1)', role: 'Manager', lead: 'Harshit Yadav\nLD-5249', category: 'STATUS CHANGE', desc: 'Status changed from contacted to CONTACTED.', icon: 'swap-horizontal' },
  { id: '3', date: '28 Sep 2026, 05:01 PM', timeAgo: '1 day ago', staff: 'Priya Nair (Sales Manager 1)', role: 'Manager', lead: 'General Activity', category: 'LEAD STATUS CHANGED', desc: 'Lead Status Updated: Harshit Yadav -> LOST. Remarks: None. Review details on HRMS for direct next steps.', icon: 'alert-circle-outline' },
  { id: '4', date: '25 Sep 2026, 09:13 AM', timeAgo: '3 days ago', staff: 'Priya Nair (Sales Manager 1)', role: 'Manager', lead: 'General Activity', category: 'SALES ACTIVITY LOGGED', desc: 'Activity Update from Vikram Singh (Executive 1) on Harshit Yadav: Logged work on lead. Outcome: Connected. Remarks: Sir needs visit for plan. Please review on HRMS for direct next steps.', icon: 'clipboard-text-outline' },
  { id: '5', date: '24 Sep 2026, 11:32 PM', timeAgo: '4 days ago', staff: 'Vikram Singh (Executive 1)', role: 'Sales Executive', lead: 'General Activity', category: 'LEAD ASSIGNED', desc: 'New CRM Lead Assigned: Harshit Yadav has been registered and assigned to you for project Apex Grand Residency.', icon: 'account-arrow-right-outline' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'SUPPORT TICKET': return { bg: '#EEF2FF', text: '#4F46E5' };
    case 'STATUS CHANGE': return { bg: '#FEF3C7', text: '#D97706' };
    case 'LEAD STATUS CHANGED': return { bg: '#FEE2E2', text: '#EF4444' };
    case 'SALES ACTIVITY LOGGED': return { bg: '#ECFDF5', text: '#059669' };
    case 'LEAD ASSIGNED': return { bg: '#F3E8FF', text: '#9333EA' };
    default: return { bg: '#F1F5F9', text: '#475569' };
  }
};

export const ManagerActivityLogScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const renderLogCard = ({ item }: { item: typeof MOCK_LOGS[0] }) => {
    const catColor = getCategoryColor(item.category);
    const leadParts = item.lead.split('\n');
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: catColor.bg }]}>
            <Text style={[styles.badgeText, { color: catColor.text }]}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>STAFF MEMBER</Text>
            <Text style={styles.value}>{item.staff}</Text>
            <Text style={styles.subValue}>{item.role}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>CUSTOMER LEAD</Text>
            <Text style={styles.value}>{leadParts[0]}</Text>
            {leadParts.length > 1 && <Text style={styles.subValue}>{leadParts[1]}</Text>}
          </View>
        </View>

        <View style={styles.descBox}>
          <Icon name={item.icon} size={16} color={catColor.text} style={{marginTop: 2, marginRight: 8}} />
          <Text style={styles.descText}>{item.desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Activity Log" />

      <FlatList
        data={MOCK_LOGS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <Icon name="format-list-bulleted" size={20} color={colors.text} style={{marginRight: 6}} />
                    <Text style={styles.pageTitle}>Team Activity Log</Text>
                  </View>
                  <Text style={styles.pageSubtitle}>Monitor sales call feedback, site visits conducted, lead assignments, and customer interactions.</Text>
                </View>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveBadgeText}>Live Feed</Text>
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search customer, lead code..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View style={styles.dropdownRow}>
                <TouchableOpacity style={styles.dropdownInput}>
                  <Text style={styles.dropdownText}>All Activity Types</Text>
                  <Icon name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownInput}>
                  <Text style={styles.dropdownText}>All Executive Staff</Text>
                  <Icon name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.filterBtnRow}>
                <TouchableOpacity style={styles.btnReset}>
                  <Text style={styles.btnResetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnFilter}>
                  <Text style={styles.btnFilterText}>Filter Activities</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={renderLogCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669', marginRight: 4 },
  liveBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },

  filterSection: { backgroundColor: colors.surface, padding: spacing.m, marginBottom: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, paddingHorizontal: spacing.m, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.s },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },
  
  dropdownRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.s },
  dropdownInput: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, paddingHorizontal: spacing.s, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  dropdownText: { fontSize: typography.sizes.s, color: colors.text },

  filterBtnRow: { flexDirection: 'row', gap: spacing.s, justifyContent: 'flex-end' },
  btnReset: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  btnResetText: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.textSecondary },
  btnFilter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#3B82F6' },
  btnFilterText: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#FFF' },

  card: { backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: spacing.m, marginBottom: spacing.m, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dateText: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  timeAgoText: { fontSize: 10, color: colors.textMuted },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '800' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.m },

  row: { flexDirection: 'row', marginBottom: spacing.m },
  col: { flex: 1 },
  label: { fontSize: 9, fontWeight: '800', color: colors.textMuted, marginBottom: 4 },
  value: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  subValue: { fontSize: 11, color: colors.textSecondary },

  descBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: spacing.s, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  descText: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 18 },
});
