import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_TEAM = [
  { id: '1', initials: 'VI', name: 'Vikram Singh (Executive 1)', role: 'Sales Executive', manager: 'Priya Nair (Sales Manager 1)', branch: 'Head Office', email: 'sales@apexrealty.com', phone: '9888000004', leads: 10, converted: 0 },
  { id: '2', initials: 'NE', name: 'Neha Gupta (Executive 2)', role: 'Sales Executive', manager: 'Priya Nair (Sales Manager 1)', branch: 'Head Office', email: 'neha.exec@apexrealty.com', phone: '9800000014', leads: 1, converted: 0 },
  { id: '3', initials: 'RO', name: 'Rohan Verma (Executive 3)', role: 'Sales Executive', manager: 'Priya Nair (Sales Manager 1)', branch: 'Head Office', email: 'rohan.exec@apexrealty.com', phone: '9888000015', leads: 1, converted: 0 },
  { id: '4', initials: 'KA', name: 'Kavita Patel (Executive 4)', role: 'Sales Executive', manager: 'Priya Nair (Sales Manager 1)', branch: 'Head Office', email: 'kavita.exec@apexrealty.com', phone: '9800000016', leads: 0, converted: 0 },
];

export const ManagerTeamsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [activeFilter, setActiveFilter] = useState('Sales Executives (4)');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const filters = ['All Staff (4)', 'Admins & Directors (0)', 'Managers (0)', 'Sales Executives (4)'];

  const renderStatCard = (title: string, count: string, label: string, icon: string, color: string, bgColor: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statBody}>
        <View style={{flex: 1}}>
          <Text style={[styles.statCount, { color }]}>{count} <Text style={styles.statLabel}>{label}</Text></Text>
        </View>
        <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const renderTeamCard = ({ item }: { item: typeof MOCK_TEAM[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Icon name="account" size={12} color="#4F46E5" style={{marginRight: 4}} />
              <Text style={styles.roleBadgeText}>{item.role}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Active</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon name="account-tie" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>Mgr: {item.manager}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="office-building" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>{item.branch} • Sales</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="email" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.cardMetrics}>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={styles.metricValue}>{item.leads}</Text>
          <Text style={styles.metricLabel}>Assigned Leads</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={[styles.metricValue, {color: '#10B981'}]}>{item.converted}</Text>
          <Text style={styles.metricLabel}>Converted Bookings</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.btnEdit}>
          <Icon name="pencil" size={16} color="#B45309" style={{marginRight: 6}} />
          <Text style={styles.btnEditText}>Edit Specs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete}>
          <Icon name="trash-can-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Team & Staff" />

      <FlatList
        data={MOCK_TEAM}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.pageTitle}>Sales Executives Management</Text>
                  <Text style={styles.pageSubtitle}>Add and manage internal Sales Executives.</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 10, color: colors.textSecondary, fontWeight: 'bold'}}>PLAN LIMIT</Text>
                  <Text style={{fontSize: 12, color: '#10B981', fontWeight: 'bold', marginBottom: 8}}>17 / 25 Users</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.btnAdd} onPress={() => setIsAddModalVisible(true)}>
                <Icon name="account-plus" size={16} color="#FFF" style={{marginRight: 6}} />
                <Text style={styles.btnAddText}>Add Sales Executive</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {renderStatCard('TOTAL ACTIVE', '4', 'Members', 'account-group', '#4F46E5', '#EEF2FF')}
              {renderStatCard('SALES STAFF', '4', 'Executives', 'account-tie', '#059669', '#D1FAE5')}
              {renderStatCard('CONVERTED', '0', 'Bookings', 'chart-line', '#7C3AED', '#F3E8FF')}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
              {filters.map(filter => (
                <TouchableOpacity 
                  key={filter} 
                  style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.listTitle}>Internal Team Members Directory</Text>
          </>
        }
        renderItem={renderTeamCard}
      />

      {/* Add Staff Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.modalIconWrap}>
                  <Icon name="account-plus" size={24} color="#EF4444" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Add Staff Member</Text>
                  <Text style={styles.modalSubtitle}>Create new internal employee account</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              
              {/* Section 1 */}
              <View style={styles.sectionHeaderRow}>
                <Icon name="account" size={16} color="#4F46E5" />
                <Text style={styles.sectionHeader}>1. PERSONAL INFORMATION</Text>
              </View>
              <Text style={styles.inputLabel}>FULL NAME *</Text>
              <TextInput style={styles.textInput} placeholder="e.g. Rohan Sharma" placeholderTextColor={colors.textMuted} />
              
              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS *</Text>
                  <TextInput style={styles.textInput} placeholder="rohan@company.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>PHONE NUMBER *</Text>
                  <TextInput style={styles.textInput} placeholder="9876543210" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
                </View>
              </View>

              {/* Section 2 */}
              <View style={[styles.sectionHeaderRow, {marginTop: spacing.xl}]}>
                <Icon name="domain" size={16} color="#475569" />
                <Text style={[styles.sectionHeader, {color: '#475569'}]}>2. ORGANIZATION SPECS</Text>
              </View>
              <View style={styles.specsBox}>
                <Text style={styles.inputLabel}>BRANCH</Text>
                <TextInput style={styles.textInput} placeholder="Head Office" placeholderTextColor={colors.textMuted} />
                <View style={[styles.rowInputs, {marginTop: spacing.m}]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>DEPARTMENT</Text>
                    <TextInput style={styles.textInput} placeholder="Sales" placeholderTextColor={colors.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>DESIGNATION</Text>
                    <TextInput style={styles.textInput} placeholder="Sr. Executive" placeholderTextColor={colors.textMuted} />
                  </View>
                </View>
              </View>

              {/* Section 3 */}
              <View style={[styles.sectionHeaderRow, {marginTop: spacing.xl}]}>
                <Icon name="shield-check" size={16} color="#059669" />
                <Text style={[styles.sectionHeader, {color: '#059669'}]}>3. ACCESS ROLE & SECURITY</Text>
              </View>
              <Text style={styles.inputLabel}>SYSTEM ACCESS ROLE *</Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Sales Executive</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>REPORTING MANAGER *</Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Priya Nair (Sales Manager 1)</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.inputLabel}>INITIAL PASSWORD *</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput style={styles.passwordInput} value="••••••••••" secureTextEntry editable={false} />
                <Icon name="eye-outline" size={20} color={colors.textMuted} />
              </View>

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.submitBtnText}>Create Staff Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  
  btnAdd: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnAddText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },

  statsScroll: { padding: spacing.m, gap: spacing.s },
  statCard: { width: 200, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.s },
  statBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statCount: { fontSize: typography.sizes.xl, fontWeight: '800' },
  statLabel: { fontSize: typography.sizes.s, fontWeight: '600' },
  statIconWrap: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },

  filtersScroll: { paddingHorizontal: spacing.m, gap: spacing.s, marginBottom: spacing.m },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border },
  filterPillActive: { backgroundColor: '#F8FAFC', borderColor: colors.border, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  filterText: { fontSize: typography.sizes.s, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#EF4444' }, // Mimicking the active state coloring if desired, or keep default

  card: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'flex-start' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: typography.sizes.l, fontWeight: 'bold', color: '#4F46E5' },
  userName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#C7D2FE' },
  roleBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#4F46E5' },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#6EE7B7' },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },

  cardDetails: { padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary },

  cardMetrics: { flexDirection: 'row', padding: spacing.m, backgroundColor: '#F8FAFC' },
  metricDivider: { width: 1, backgroundColor: colors.border },
  metricValue: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text },
  metricLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, fontWeight: '600' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  btnEdit: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' },
  btnEditText: { color: '#B45309', fontWeight: 'bold', fontSize: typography.sizes.s },
  btnDelete: { padding: 8 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.l },
  modalIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  modalSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  sectionHeader: { fontSize: 12, fontWeight: '800', color: '#4F46E5', marginLeft: 6, letterSpacing: 0.5 },

  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, fontSize: typography.sizes.m, color: colors.text, marginBottom: spacing.m },
  rowInputs: { flexDirection: 'row', gap: spacing.m },
  
  specsBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: spacing.m, borderWidth: 1, borderColor: colors.border },

  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, marginBottom: spacing.m },
  dropdownText: { fontSize: typography.sizes.m, color: colors.text, flex: 1 },

  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface },
  passwordInput: { flex: 1, fontSize: typography.sizes.m, color: colors.text },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '700' },
  submitBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
