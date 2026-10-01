import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_PAYMENTS = [
  { 
    id: '1', 
    customer: 'Amit Kulkarni', 
    bookingCode: 'BKG-APEX-001', 
    project: 'Apex Grand Residency', 
    unit: 'Unit 501 (2BHK)', 
    amount: '₹100,000', 
    method: 'ONLINE', 
    date: '23 Sep 2026, 10:14 AM', 
    status: 'CLEARED', 
    collectedBy: 'Gateway',
    phone: '9988776655',
    email: 'amit.k@gmail.com',
    txnRef: 'TXN-C4CA4238A0',
    receiptNum: '#RCT-C4CA4238'
  },
];

export const ManagerPaymentsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedReceipt, setSelectedReceipt] = useState<typeof MOCK_PAYMENTS[0] | null>(null);

  const renderStatCard = (title: string, amount: string, subtitle: string, amountColor: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statAmount, { color: amountColor }]}>{amount}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderPaymentCard = ({ item }: { item: typeof MOCK_PAYMENTS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.customerName}>{item.customer}</Text>
          <Text style={styles.bookingCode}>{item.bookingCode}</Text>
        </View>
        <Text style={styles.cardAmount}>{item.amount}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="office-building" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>{item.project} • {item.unit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="credit-card-outline" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.detailText}>{item.method} • {item.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.statusBadge}>
            <Icon name="check-circle" size={12} color="#059669" style={{marginRight: 4}} />
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
          <Text style={styles.collectedByText}>via {item.collectedBy}</Text>
        </View>
        
        <TouchableOpacity style={styles.btnDownload} onPress={() => setSelectedReceipt(item)}>
          <Icon name="file-download-outline" size={16} color="#4F46E5" style={{marginRight: 4}} />
          <Text style={styles.btnDownloadText}>Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Payments & Receipts" />

      <FlatList
        data={MOCK_PAYMENTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={{flex: 1, paddingRight: spacing.m}}>
                  <Text style={styles.pageTitle}>Payments Ledger & GST Receipts</Text>
                  <Text style={styles.pageSubtitle}>Recorded unit token payments, Razorpay gateways, and official tax invoice downloads.</Text>
                </View>
                <View style={styles.totalBadge}>
                  <Text style={styles.totalBadgeLabel}>Total Collected:</Text>
                  <Text style={styles.totalBadgeValue}>₹100,000</Text>
                </View>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {renderStatCard('TOTAL REVENUE COLLECTED', '₹100,000', 'Confirmed Token Payments', '#059669')}
              {renderStatCard('RAZORPAY GATEWAY', '0', 'Online Direct Receipts', '#3B82F6')}
              {renderStatCard('MANUAL / CHEQUE', '0', 'Bank Transfers & Cash', '#8B5CF6')}
            </ScrollView>

            <Text style={styles.listTitle}>Recorded Unit Token Payments</Text>
          </>
        }
        renderItem={renderPaymentCard}
      />

      {/* Receipt Modal */}
      <Modal visible={!!selectedReceipt} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedReceipt(null)} style={styles.closeBtn}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Receipt Preview</Text>
            <TouchableOpacity style={styles.shareBtn}>
              <Icon name="share-variant" size={24} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.receiptScroll} contentContainerStyle={{padding: spacing.m}}>
            {selectedReceipt && (
              <View style={styles.receiptPaper}>
                {/* Paper Header */}
                <View style={styles.receiptTop}>
                  <View>
                    <Text style={styles.companyName}>Apex Realty Infra Pvt Ltd</Text>
                    <View style={styles.officialBadge}>
                      <Text style={styles.officialBadgeText}>OFFICIAL PAYMENT RECEIPT & TAX INVOICE</Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.receiptWord}>RECEIPT</Text>
                    <Text style={styles.receiptNum}>{selectedReceipt.receiptNum}</Text>
                    <Text style={styles.receiptDate}>Date: {selectedReceipt.date.split(',')[0]}</Text>
                  </View>
                </View>

                {/* Details Boxes */}
                <View style={styles.receiptBoxes}>
                  <View style={[styles.receiptBox, {marginRight: 8}]}>
                    <Text style={styles.boxTitle}>RECEIVED FROM (CUSTOMER)</Text>
                    <Text style={styles.boxMain}>{selectedReceipt.customer}</Text>
                    <Text style={styles.boxSub}>Phone: {selectedReceipt.phone}</Text>
                    <Text style={styles.boxSub}>Email: {selectedReceipt.email}</Text>
                  </View>
                  <View style={[styles.receiptBox, {marginLeft: 8}]}>
                    <Text style={styles.boxTitle}>BOOKING & PROJECT DETAILS</Text>
                    <Text style={styles.boxMain}>{selectedReceipt.project}</Text>
                    <Text style={styles.boxSub}>Booking Code: <Text style={{fontWeight: 'bold'}}>{selectedReceipt.bookingCode}</Text></Text>
                    <Text style={styles.boxSub}>Unit Assigned: <Text style={{fontWeight: 'bold'}}>{selectedReceipt.unit}</Text></Text>
                  </View>
                </View>

                {/* Table */}
                <View style={styles.receiptTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCol, {flex: 2, color: '#FFF'}]}>DESCRIPTION</Text>
                    <Text style={[styles.tableCol, {flex: 1.5, color: '#FFF'}]}>PAYMENT MODE</Text>
                    <Text style={[styles.tableCol, {flex: 1.2, color: '#FFF', textAlign: 'right'}]}>AMOUNT (INR)</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={{flex: 2, paddingRight: 8}}>
                      <Text style={styles.itemTitle}>Property Booking Token Payment</Text>
                      <Text style={styles.itemSub}>Advance token deposit for {selectedReceipt.unit}, {selectedReceipt.project}</Text>
                    </View>
                    <View style={{flex: 1.5, paddingRight: 8}}>
                      <Text style={styles.itemVal}>{selectedReceipt.method} / ONLINE</Text>
                      <Text style={styles.itemSub}>{selectedReceipt.txnRef}</Text>
                    </View>
                    <View style={{flex: 1.2, alignItems: 'flex-end'}}>
                      <Text style={styles.itemAmount}>{selectedReceipt.amount}</Text>
                    </View>
                  </View>
                </View>

                {/* Total Box */}
                <View style={styles.receiptTotalSection}>
                  <View style={{flex: 1}}>
                    <Text style={styles.signatureText}>Authorized Signature / Digital Seal</Text>
                    <Text style={styles.signatureCompany}>Apex Realty Infra Pvt Ltd</Text>
                  </View>
                  <View style={styles.totalBox}>
                    <Text style={styles.totalBoxTitle}>TOTAL AMOUNT RECEIVED</Text>
                    <Text style={styles.totalBoxValue}>{selectedReceipt.amount}</Text>
                    <Text style={styles.totalBoxStatus}>Status: PAYMENT VERIFIED & CONFIRMED</Text>
                  </View>
                </View>

                <Text style={styles.receiptFooterText}>This is a computer-generated official payment receipt. Generated via UrbanProperty - Real Estate Operating System.{"\n"}Thank you for your business!</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },
  totalBadge: { backgroundColor: '#ECFDF5', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#A7F3D0', alignItems: 'flex-end' },
  totalBadgeLabel: { fontSize: 10, color: '#059669', fontWeight: 'bold' },
  totalBadgeValue: { fontSize: typography.sizes.m, color: '#059669', fontWeight: '900' },

  statsScroll: { padding: spacing.m, gap: spacing.s },
  statCard: { width: 220, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.s },
  statAmount: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statSubtitle: { fontSize: 10, color: colors.textMuted },

  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },

  card: { backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: spacing.m },
  customerName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  bookingCode: { fontSize: typography.sizes.s, color: colors.textSecondary, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  cardAmount: { fontSize: typography.sizes.l, fontWeight: 'bold', color: '#059669' },

  divider: { height: 1, backgroundColor: colors.border },

  cardBody: { padding: spacing.m },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.m },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#A7F3D0' },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },
  collectedByText: { fontSize: 10, color: colors.textSecondary, marginLeft: 8 },
  btnDownload: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#C7D2FE' },
  btnDownloadText: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#4F46E5' },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#1E293B' }, // Dark background like PDF viewer
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.m, backgroundColor: colors.surface },
  modalHeaderTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  closeBtn: { padding: 4 },
  shareBtn: { padding: 4 },
  
  receiptScroll: { flex: 1 },
  receiptPaper: { backgroundColor: '#FFF', marginVertical: spacing.l, padding: spacing.l, borderRadius: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  
  receiptTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#4F46E5', paddingBottom: spacing.m, marginBottom: spacing.m },
  companyName: { fontSize: typography.sizes.l, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  officialBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  officialBadgeText: { fontSize: 8, fontWeight: '800', color: '#4F46E5' },
  receiptWord: { fontSize: typography.sizes.m, fontWeight: '900', color: '#4F46E5', marginBottom: 2 },
  receiptNum: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  receiptDate: { fontSize: 10, color: colors.textSecondary },

  receiptBoxes: { flexDirection: 'row', marginBottom: spacing.m },
  receiptBox: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.m },
  boxTitle: { fontSize: 9, fontWeight: '800', color: colors.textSecondary, marginBottom: 8 },
  boxMain: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  boxSub: { fontSize: 10, color: colors.textSecondary, marginBottom: 2 },

  receiptTable: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, overflow: 'hidden', marginBottom: spacing.l },
  tableHeader: { flexDirection: 'row', backgroundColor: '#4F46E5', padding: spacing.s },
  tableCol: { fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: spacing.m, backgroundColor: '#FFF' },
  itemTitle: { fontSize: 11, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  itemSub: { fontSize: 9, color: colors.textSecondary },
  itemVal: { fontSize: 10, fontWeight: '600', color: colors.text, marginBottom: 4 },
  itemAmount: { fontSize: 14, fontWeight: '900', color: colors.text },

  receiptTotalSection: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.xl },
  signatureText: { fontSize: 10, color: colors.textSecondary, fontStyle: 'italic', marginBottom: 4 },
  signatureCompany: { fontSize: 11, fontWeight: 'bold', color: colors.text },
  totalBox: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 8, padding: spacing.m, alignItems: 'flex-end' },
  totalBoxTitle: { fontSize: 9, fontWeight: 'bold', color: '#059669', marginBottom: 4 },
  totalBoxValue: { fontSize: 20, fontWeight: '900', color: '#059669', marginBottom: 4 },
  totalBoxStatus: { fontSize: 9, fontWeight: 'bold', color: '#059669' },

  receiptFooterText: { textAlign: 'center', fontSize: 9, color: colors.textMuted, marginTop: spacing.l, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
});
