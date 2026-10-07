import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

const ISSUE_CATEGORIES = [
  'Technical Issue',
  'Billing & Subscription',
  'Inventory / Units',
  'Lead / CRM Pipeline',
  'General Query'
];

const PRIORITIES = [
  'Medium',
  'High',
  'Urgent'
];

export const ManagerSupportDeskScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isRaiseTicketModalVisible, setIsRaiseTicketModalVisible] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General Query');
  const [priority, setPriority] = useState('Medium');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await salesExecutiveApi.getSupportTickets();
      if (response && response.success && response.data && Array.isArray(response.data.data)) {
        setTickets(response.data.data);
      } else if (response && Array.isArray(response.data)) {
        setTickets(response.data);
      } else if (Array.isArray(response)) {
        setTickets(response);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const getFilteredTickets = () => {
    if (activeFilter === 'All') return tickets;
    return tickets.filter(t => t.status?.toLowerCase() === activeFilter.toLowerCase());
  };

  const getStatusCount = (status: string) => {
    return tickets.filter(t => t.status?.toLowerCase() === status.toLowerCase()).length.toString();
  };

  const handleSubmitTicket = async () => {
    try {
      if (!subject || !description) return;

      let apiCategory = category;
      if (category === 'Technical Issue') apiCategory = 'Technical';
      else if (category === 'Billing & Subscription') apiCategory = 'Billing';
      else if (category === 'Inventory / Units') apiCategory = 'Inventory';
      else if (category === 'Lead / CRM Pipeline') apiCategory = 'Lead';
      else if (category === 'General Query') apiCategory = 'General';

      await salesExecutiveApi.createSupportTicket({ 
        category: apiCategory,
        subject: subject, 
        description: description, 
        priority: priority.toLowerCase() 
      });
      setIsRaiseTicketModalVisible(false);
      setSubject('');
      setDescription('');
      setCategory('General Query');
      setPriority('Medium');
      fetchTickets();
    } catch (error: any) {
      console.error('Error creating ticket:', error?.response?.data || error);
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
        data={getFilteredTickets()}
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
              {renderStatCard('OPEN TICKETS', getStatusCount('open'), 'Awaiting Agent', '#F59E0B')}
              {renderStatCard('IN PROGRESS', getStatusCount('in progress'), 'Active Investigation', '#3B82F6')}
              {renderStatCard('RESOLVED', getStatusCount('resolved'), 'Solution Provided', '#10B981')}
              {renderStatCard('CLOSED', getStatusCount('closed'), 'Completed & Closed', '#64748B')}
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.ticket_number || item.ticket_code || `TCK-${item.id}`}</Text>
              <Text style={{ fontSize: 12, color: item.status === 'open' ? '#F59E0B' : (item.status === 'resolved' || item.status === 'closed' ? '#10B981' : colors.textSecondary), textTransform: 'uppercase', fontWeight: 'bold' }}>{item.status}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>{item.subject}</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }} numberOfLines={2}>{item.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>{item.category}</Text>
              <Text style={{ fontSize: 12, color: (item.priority?.toLowerCase() === 'high' || item.priority?.toLowerCase() === 'urgent') ? '#EF4444' : '#3B82F6', fontWeight: 'bold', textTransform: 'uppercase' }}>Priority: {item.priority}</Text>
            </View>
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
                value={subject}
                onChangeText={setSubject}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, zIndex: 10 }}>
                  <Text style={styles.inputLabel}>ISSUE CATEGORY</Text>
                  <TouchableOpacity style={styles.dropdownInput} onPress={() => {setShowCategoryDropdown(!showCategoryDropdown); setShowPriorityDropdown(false);}}>
                    <Text style={styles.dropdownText}>{category}</Text>
                    <Icon name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {showCategoryDropdown && (
                    <View style={styles.dropdownListContainer}>
                      {ISSUE_CATEGORIES.map((cat, idx) => (
                        <TouchableOpacity key={idx} style={styles.dropdownListItem} onPress={() => {setCategory(cat); setShowCategoryDropdown(false);}}>
                          <Text style={[styles.dropdownListText, category === cat && styles.dropdownListTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, zIndex: 10 }}>
                  <Text style={styles.inputLabel}>PRIORITY</Text>
                  <TouchableOpacity style={styles.dropdownInput} onPress={() => {setShowPriorityDropdown(!showPriorityDropdown); setShowCategoryDropdown(false);}}>
                    <Text style={styles.dropdownText}>{priority}</Text>
                    <Icon name={showPriorityDropdown ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {showPriorityDropdown && (
                    <View style={styles.dropdownListContainer}>
                      {PRIORITIES.map((pri, idx) => (
                        <TouchableOpacity key={idx} style={styles.dropdownListItem} onPress={() => {setPriority(pri); setShowPriorityDropdown(false);}}>
                          <Text style={[styles.dropdownListText, priority === pri && styles.dropdownListTextActive]}>{pri}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Text style={[styles.inputLabel, { marginTop: showCategoryDropdown || showPriorityDropdown ? 140 : spacing.m }]}>DETAILED DESCRIPTION</Text>
              <TextInput 
                style={[styles.textInput, styles.textArea]} 
                placeholder="Provide step-by-step details about the issue or request..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsRaiseTicketModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitTicket}>
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

  rowInputs: { flexDirection: 'row', gap: spacing.m, zIndex: 10 },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface },
  dropdownText: { fontSize: typography.sizes.m, color: colors.text, flex: 1, fontWeight: '500' },
  dropdownListContainer: { position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: spacing.s, zIndex: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
  dropdownListItem: { paddingVertical: 10, paddingHorizontal: spacing.m },
  dropdownListText: { fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },
  dropdownListTextActive: { color: '#4F46E5', fontWeight: 'bold' },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '700' },
  submitBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
