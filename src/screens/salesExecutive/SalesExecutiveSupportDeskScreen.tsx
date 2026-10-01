import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

export const SalesExecutiveSupportDeskScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isRaiseTicketModalVisible, setIsRaiseTicketModalVisible] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await salesExecutiveApi.getSupportTickets();
      if (response && response.data) {
        setTickets(response.data);
      } else if (Array.isArray(response)) {
        setTickets(response);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const filters = ['All', 'Open', 'In Progress', 'Resolved'];

  const renderStatCard = (title: string, count: string, label: string, color: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Support Tickets" />

      <FlatList
        data={tickets}
        keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <Text style={styles.pageTitle}>Customer & Team Support Desk</Text>
              <Text style={styles.pageSubtitle}>Create tickets, track issue resolutions, and collaborate with operations staff.</Text>
              
              <TouchableOpacity style={styles.btnRaiseTicket} onPress={() => setIsRaiseTicketModalVisible(true)}>
                <Icon name="plus" size={16} color="#FFF" style={{marginRight: 6}} />
                <Text style={styles.btnRaiseTicketText}>Raise Support Ticket</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              {renderStatCard('OPEN TICKETS', '0', 'Awaiting Agent', '#F59E0B')}
              {renderStatCard('IN PROGRESS', '0', 'Active Investigation', '#3B82F6')}
              {renderStatCard('RESOLVED', '0', 'Solution Provided', '#10B981')}
              {renderStatCard('CLOSED', '0', 'Completed & Closed', '#64748B')}
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.listTitle}>Support Ticket Register</Text>
            </View>

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
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.id}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="ticket-confirmation-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No support tickets recorded yet.</Text>
            <Text style={styles.emptySubText}>Click "Raise Support Ticket" to create one.</Text>
          </View>
        }
      />

      {/* Raise Ticket Modal */}
      <Modal visible={isRaiseTicketModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Raise New Support Ticket</Text>
              <TouchableOpacity onPress={() => setIsRaiseTicketModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>Ticket Recipient & Destination:</Text>
                <View style={styles.infoBoxRow}>
                  <Icon name="domain" size={16} color="#4F46E5" style={{marginRight: 6}} />
                  <Text style={styles.infoBoxSubtitle}>Apex Realty Infra Pvt Ltd Support & Operations Team</Text>
                </View>
                <Text style={styles.infoBoxDesc}>
                  यह टिकट सबमिट होने के बाद आपकी कंपनी के सपोर्ट मैनेजर्स व एडमिन को रिज़ॉल्यूशन के लिए तुरंत दिखेगा।
                </Text>
              </View>

              <Text style={styles.inputLabel}>ISSUE SUBJECT</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="e.g. Lead assignment not updating..."
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>ISSUE CATEGORY</Text>
                  <TouchableOpacity style={styles.dropdownInput}>
                    <Text style={styles.dropdownText}>General Query</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>PRIORITY</Text>
                  <TouchableOpacity style={styles.dropdownInput}>
                    <Text style={styles.dropdownText}>Medium</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.inputLabel}>DETAILED DESCRIPTION</Text>
              <TextInput 
                style={[styles.textInput, styles.textArea]} 
                placeholder="Provide step-by-step details about the issue or request..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
              />

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsRaiseTicketModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsRaiseTicketModalVisible(false)}>
                <Text style={styles.submitBtnText}>Submit Ticket</Text>
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
  
  btnRaiseTicket: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnRaiseTicketText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.m, justifyContent: 'space-between', gap: spacing.s },
  statCard: { width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.s, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.s },
  statCount: { fontSize: typography.sizes.xl, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },

  listHeaderRow: { marginHorizontal: spacing.m, marginTop: spacing.s, marginBottom: spacing.s },
  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },

  filtersScroll: { paddingHorizontal: spacing.m, gap: spacing.s, marginBottom: spacing.m },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border },
  filterPillActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  filterText: { fontSize: typography.sizes.s, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#FFF' },

  card: { backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: spacing.m, padding: spacing.m, marginBottom: spacing.m },

  emptyState: { backgroundColor: colors.surface, marginHorizontal: spacing.m, borderRadius: 16, padding: spacing.xl, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border },
  emptyText: { marginTop: spacing.m, fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  emptySubText: { marginTop: 4, fontSize: typography.sizes.s, color: colors.textSecondary, textAlign: 'center' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  infoBox: { backgroundColor: '#EEF2FF', borderRadius: 12, padding: spacing.m, borderWidth: 1, borderColor: '#C7D2FE', marginBottom: spacing.m },
  infoBoxTitle: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#312E81', marginBottom: 4 },
  infoBoxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoBoxSubtitle: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#4338CA', flex: 1 },
  infoBoxDesc: { fontSize: 11, color: '#4F46E5', lineHeight: 16 },

  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, marginTop: spacing.m, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },
  textArea: { height: 100, paddingTop: spacing.m },

  rowInputs: { flexDirection: 'row', gap: spacing.m },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface },
  dropdownText: { fontSize: typography.sizes.m, color: colors.text, flex: 1, fontWeight: '500' },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '700' },
  submitBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
