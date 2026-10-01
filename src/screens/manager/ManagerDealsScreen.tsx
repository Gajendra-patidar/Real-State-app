import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_DEALS = [
  {
    id: '1',
    bookingCode: 'BKG-APEX-001',
    customerName: 'Amit Kulkarni',
    customerEmail: 'amit.k@gmail.com',
    unit: 'Unit 501',
    project: 'Apex Grand Residency',
    cost: '₹8,200,000',
    status: 'REJECTED',
    initials: 'AK',
  },
  {
    id: '2',
    bookingCode: 'BKG-APEX-002',
    customerName: 'Suresh Reddy',
    customerEmail: 'suresh.r@gmail.com',
    unit: 'Unit 204',
    project: 'Apex Grand Residency',
    cost: '₹7,500,000',
    status: 'PENDING',
    initials: 'SR',
  }
];

export const ManagerDealsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Booking Modal State
  const [isNewBookingModalVisible, setIsNewBookingModalVisible] = useState(false);
  const [isExpressLock, setIsExpressLock] = useState(false);

  const renderStatCard = (title: string, value: string, icon: string, color: string, bgColor: string) => (
    <View style={styles.statCard}>
      <View style={styles.statCardTop}>
        <Text style={styles.statTitle}>{title}</Text>
        <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={20} color={color} />
        </View>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const renderDealCard = ({ item }: { item: typeof MOCK_DEALS[0] }) => {
    const isRejected = item.status === 'REJECTED';
    const isPending = item.status === 'PENDING';
    const statusColor = isRejected ? '#EF4444' : isPending ? '#F59E0B' : '#10B981';
    const statusBg = isRejected ? '#FEE2E2' : isPending ? '#FEF3C7' : '#D1FAE5';

    return (
      <View style={styles.dealCard}>
        {/* Header: Code & Status */}
        <View style={styles.cardHeader}>
          <Text style={styles.bookingCode}>{item.bookingCode}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.customerName}</Text>
            <Text style={styles.userEmail}>{item.customerEmail}</Text>
          </View>
        </View>

        {/* Project & Unit details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Icon name="office-building" size={16} color={colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.project}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="door" size={16} color={colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.unit}</Text>
          </View>
        </View>

        {/* Cost & Actions */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.costLabel}>Total Unit Cost</Text>
            <Text style={styles.costValue}>{item.cost}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnDoc}>
              <Icon name="file-document-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnViewRecord}>
              <Icon name="file-eye-outline" size={16} color="#6366F1" style={{ marginRight: 6 }} />
              <Text style={styles.btnViewRecordText}>View Record</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Deals & Bookings" />
      
      <View style={styles.headerSubtitleBox}>
        <TouchableOpacity style={styles.btnNewBooking} onPress={() => setIsNewBookingModalVisible(true)}>
          <Icon name="plus" size={18} color="#FFF" style={{ marginRight: 4 }} />
          <Text style={styles.btnNewBookingText}>New Booking Entry</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_DEALS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* KPI Cards Grid */}
            <View style={styles.statsGrid}>
              {renderStatCard('TOTAL BOOKINGS', '1', 'clipboard-text', '#1E293B', '#F1F5F9')}
              {renderStatCard('CONFIRMED', '0', 'check-circle', '#10B981', '#D1FAE5')}
              {renderStatCard('PENDING', '0', 'clock-outline', '#F59E0B', '#FEF3C7')}
              {renderStatCard('REJECTED', '1', 'close-circle', '#EF4444', '#FEE2E2')}
            </View>

            {/* Search */}
            <Text style={styles.listTitle}>Current Bookings & Agreement Directory</Text>
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Customer Name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={renderDealCard}
        showsVerticalScrollIndicator={false}
      />

      {/* New Booking Modal */}
      <Modal visible={isNewBookingModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Initiate Unit Booking Lock</Text>
              <TouchableOpacity onPress={() => setIsNewBookingModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              
              <Text style={styles.inputLabel}>Customer Lead <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Amit Kulkarni (9988776655)</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Unit Lock Selection <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Unit 501 (2BHK) — ₹8,200,000</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Token Advance (₹) <Text style={styles.asterisk}>*</Text></Text>
                  <TextInput style={styles.textInput} value="100000" keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Total Cost (₹) <Text style={styles.asterisk}>*</Text></Text>
                  <TextInput style={styles.textInput} value="7500000" keyboardType="numeric" />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.checkboxBox, isExpressLock && { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]} 
                onPress={() => setIsExpressLock(!isExpressLock)}
                activeOpacity={0.8}
              >
                <Icon 
                  name={isExpressLock ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={24} 
                  color={isExpressLock ? "#D97706" : colors.textMuted} 
                />
                <Text style={[styles.checkboxText, isExpressLock && { color: '#B45309', fontWeight: 'bold' }]}>
                  Skip Agreement Draft Stage (Direct Express Unit Lock)
                </Text>
              </TouchableOpacity>

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsNewBookingModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsNewBookingModalVisible(false)}>
                <Text style={styles.submitBtnText}>Lock Unit & Create Booking</Text>
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
  headerSubtitleBox: { paddingHorizontal: spacing.m, paddingBottom: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  btnNewBooking: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop:10 },
  btnNewBookingText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
  
  listContent: { paddingBottom: spacing.xxl },
  
  // KPI Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, padding: spacing.m, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.s },
  statTitle: { fontSize: 10, fontWeight: '700', color: colors.textMuted, flex: 1, marginRight: spacing.s, marginTop: 4 },
  statValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  statIconWrap: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  // Search & List Title
  listTitle: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: spacing.m, marginHorizontal: spacing.m, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },

  // Deal Card
  dealCard: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: spacing.m, padding: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  bookingCode: { fontSize: typography.sizes.s, fontWeight: '700', color: '#6366F1' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: '#3730A3' },
  userName: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text },
  userEmail: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },

  detailsBox: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.m, marginBottom: spacing.m },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: spacing.s },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary, flex: 1 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
  costLabel: { fontSize: typography.sizes.xs, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  costValue: { fontSize: typography.sizes.l, fontWeight: '800', color: '#10B981' },
  
  actionButtons: { flexDirection: 'row', gap: spacing.s, alignItems: 'center' },
  btnViewRecord: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnViewRecordText: { color: '#6366F1', fontSize: typography.sizes.s, fontWeight: typography.weights.bold },
  btnDoc: { backgroundColor: '#F1F5F9', width: 36, height: 36, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  inputLabel: { fontSize: typography.sizes.s, fontWeight: typography.weights.bold, color: colors.textSecondary, marginTop: spacing.m, marginBottom: 6 },
  asterisk: { color: colors.error },
  
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface },
  dropdownText: { fontSize: typography.sizes.m, color: colors.text, flex: 1, fontWeight: '600' },
  
  rowInputs: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xs },
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, fontSize: typography.sizes.m, color: colors.text, fontWeight: '600' },

  checkboxBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A', backgroundColor: '#FEF9C3', borderRadius: 12, padding: spacing.m, marginTop: spacing.l },
  checkboxText: { marginLeft: spacing.s, fontSize: typography.sizes.s, color: '#92400E', flex: 1 },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.l, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '600' },
  submitBtn: { flex: 2, paddingVertical: 10, borderRadius: 12, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.s, fontWeight: 'bold' },
});
