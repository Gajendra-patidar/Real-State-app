import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import { ScrollView } from 'react-native';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

export const SalesExecutiveFollowUpsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setIsLoading(true);
      const response = await salesExecutiveApi.getFollowUps();
      console.log('Fetched follow-ups:', response);
      
      
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (response && Array.isArray(response.data)) {
        list = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        list = response.data.data;
      }
      
      setData(list);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const INQUIRY_STATUSES = ['Meeting at client place', 'Not interested', 'In Followup', 'Not connected'];
  const BUDGET_OPTIONS = ['15 lac', '30 lac', '50 lac', '1 cr'];

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [isCallLogModalVisible, setIsCallLogModalVisible] = useState(false);
  const [selectedLeadForCallLog, setSelectedLeadForCallLog] = useState<any>(null);
  const [callLogForm, setCallLogForm] = useState({
    status: 'In Followup',
    nextFollowUpDate: '',
    budget: '',
    remarks: ''
  });
  const [isCallLogDatePickerVisible, setIsCallLogDatePickerVisible] = useState(false);
  const [isCallLogStatusModalVisible, setIsCallLogStatusModalVisible] = useState(false);
  const [isCallLogBudgetModalVisible, setIsCallLogBudgetModalVisible] = useState(false);

  const [leadLogs, setLeadLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (selectedLeadForCallLog && isCallLogModalVisible) {
      const fetchLogs = async () => {
        try {
          setIsLoadingLogs(true);
          const leadId = selectedLeadForCallLog.lead?.id || selectedLeadForCallLog.lead_id || selectedLeadForCallLog.id;
          const res = await salesExecutiveApi.getLeadDetails(leadId);
          // Assuming the details return activities or call logs
          const activities = res.data?.calls || res.calls || [];
          console.log('Fetched lead logs:', activities);
          setLeadLogs(activities);
        } catch (err) {
          console.log('Error fetching lead logs', err);
        } finally {
          setIsLoadingLogs(false);
        }
      };
      fetchLogs();
    }
  }, [selectedLeadForCallLog, isCallLogModalVisible]);

  const handleSaveCallLog = async () => {
    if (!selectedLeadForCallLog) return;
    if (!callLogForm.nextFollowUpDate) {
      Alert.alert('Validation Error', 'Please select Next Followup Date');
      return;
    }

    try {
      let finalNotes = callLogForm.remarks || '';
      if (callLogForm.budget) {
        finalNotes = `Budget: ${callLogForm.budget}\n${finalNotes}`.trim();
      }

      const leadId = selectedLeadForCallLog.lead?.id || selectedLeadForCallLog.lead_id || selectedLeadForCallLog.id;

      await salesExecutiveApi.scheduleFollowUp(leadId, {
        scheduled_at: callLogForm.nextFollowUpDate,
        type: callLogForm.status,
        notes: finalNotes
      });

      Alert.alert('Success', 'Call log saved successfully');
      setIsCallLogModalVisible(false);
      
      setCallLogForm({
        status: 'In Followup',
        nextFollowUpDate: '',
        budget: '',
        remarks: ''
      });
      setSelectedLeadForCallLog(null);
    } catch (error) {
      console.log('Error saving call log', error);
      Alert.alert('Error', 'Failed to save call log.');
    }
  };

  const handleActionPress = (item: any) => {
    setSelectedLead(item);
    setIsActionModalVisible(true);
  };

  console.log('Follow-ups data:', selectedLeadForCallLog);

  const renderStatCard = (title: string, count: string, label: string, icon: string, color: string, bgColor: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statBody}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statCount, { color }]}>{count} <Text style={styles.statLabel}>{label}</Text></Text>
        </View>
        <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const renderFollowUpCard = ({ item }: { item: any }) => {
    const name = item.lead?.first_name + ' ' + item.lead?.last_name || 'Unknown';
    const phone = item.phone || item.lead?.phone || item.lead_phone || 'N/A';
    const initials = item.initials || name.substring(0, 2).toUpperCase();
    const stage = item.stage || item.status || 'NEW';
    const executive = item.executive || item.assigned_to?.name || 'Sales Executive';
    const time = item.time || item.scheduled_at || item.created_at || 'Recently';

    return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userPhone}>{phone}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{stage}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon name="account-tie" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{executive}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{time}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.btnLogCall}
          onPress={() => {
            setSelectedLeadForCallLog(item);
            setIsCallLogModalVisible(true);
          }}
        >
          <Icon name="phone" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.btnLogCallText}>Log Call</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonsRight}>
          <TouchableOpacity style={styles.btnAction} onPress={() => handleActionPress(item)}>
            <Icon name="lightning-bolt" size={18} color="#B45309" />
            <Text style={styles.btnActionText}>Action</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnWhatsapp} 
            onPress={() => {
              if (phone && phone !== 'N/A') {
                const phoneNumber = phone.replace(/[^0-9+]/g, '');
                Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
                  Alert.alert('Error', 'Make sure WhatsApp is installed on your device');
                });
              } else {
                Alert.alert('Error', 'No valid phone number found for this lead.');
              }
            }}
          >
            <Icon name="whatsapp" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  };

  const filteredData = Array.isArray(data) ? data.filter((item: any) => {
    const itemName = item.name || item.lead?.name || item.lead_name || '';
    const itemPhone = item.phone || item.lead?.phone || item.lead_phone || '';
    return itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           itemPhone.includes(searchQuery);
  }) : [];


  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Follow-ups & Tasks" />

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <Text style={styles.pageTitle}>Follow-ups & Sales Executive Tasks</Text>
              <Text style={styles.pageSubtitle}>Pending lead call logs, customer follow-up tasks, and activity history.</Text>

              <View style={styles.activeTag}>
                <Icon name="format-list-checks" size={16} color="#B45309" style={{ marginRight: 6 }} />
                <Text style={styles.activeTagText}>11 Active Follow-up Tasks</Text>
              </View>
            </View>
            <View style={styles.statsScroll}>
              {renderStatCard('PENDING CALLS', '11', 'Tasks', 'phone-outgoing', '#F59E0B', '#FEF3C7')}
              {renderStatCard('ACTIVE STAFF', '3', 'Staff', 'account', '#10B981', '#D1FAE5')}
              {renderStatCard('LOGGED', '8', 'Logs', 'history', '#6366F1', '#E0E7FF')}
            </View>
            <Text style={styles.listTitle}>Pending Lead Follow-ups Directory</Text>

            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Customer Name..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={renderFollowUpCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Menu Modal (Reused from ManagerLeadsScreen) */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsActionModalVisible(false)}>
          <View style={[styles.modalContent, { paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Actions for {selectedLead?.name}
              </Text>
              <TouchableOpacity onPress={() => setIsActionModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              <TouchableOpacity
                style={styles.actionMenuItem}
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('ScheduleSiteVisit', { lead: selectedLead });
                }}
              >
                <Icon name="map-marker" size={22} color="#6B4EFF" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Schedule Site Visit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionMenuItem, { borderBottomWidth: 0 }]}
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('DropLead', { lead: selectedLead });
                }}
              >
                <Icon name="thumb-down" size={22} color="#EF4444" style={styles.actionMenuIcon} />
                <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Drop Lead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Call Log Modal */}
      <Modal
        visible={isCallLogModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCallLogModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsCallLogModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.callLogModalContent}>
            
            <View style={styles.callLogHeader}>
              <Text style={styles.callLogTitle}>Log Call / Follow-up</Text>
              <TouchableOpacity onPress={() => setIsCallLogModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.callLogBody} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
              <View style={styles.customerInfoCard}>
                <Text style={styles.customerInfoTitle}>{selectedLeadForCallLog?.lead?.first_name} {selectedLeadForCallLog?.lead?.last_name}</Text>
                <Text style={styles.customerInfoSubtitle}>Phone: {selectedLeadForCallLog?.lead?.phone}</Text>
              </View>

              <View style={styles.callLogFormRow}>
                <View style={styles.callLogInputGroup}>
                  <Text style={styles.callLogLabel}>Inquiry Status <Text style={styles.textRed}>*</Text></Text>
                  <TouchableOpacity style={styles.callLogSelect} onPress={() => setIsCallLogStatusModalVisible(true)}>
                    <Text style={styles.callLogSelectText}>{callLogForm.status}</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.callLogInputGroup}>
                  <Text style={styles.callLogLabel}>Next Followup Date <Text style={styles.textRed}>*</Text></Text>
                  <TouchableOpacity style={styles.callLogSelect} onPress={() => setIsCallLogDatePickerVisible(true)}>
                    <Text style={[styles.callLogSelectText, !callLogForm.nextFollowUpDate && { color: colors.textSecondary }]}>
                      {callLogForm.nextFollowUpDate || 'Select Date & Time'}
                    </Text>
                    <Icon name="calendar" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.callLogInputGroup}>
                  <Text style={styles.callLogLabel}>Budget Upto</Text>
                  <TouchableOpacity style={styles.callLogSelect} onPress={() => setIsCallLogBudgetModalVisible(true)}>
                    <Text style={[styles.callLogSelectText, !callLogForm.budget && { color: colors.textSecondary }]}>
                      {callLogForm.budget || 'Select Budget Upto'}
                    </Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.callLogTextareaRow}>
                <View style={styles.callLogInputGroup}>
                  <Text style={styles.callLogLabel}>Remarks / Notes</Text>
                  <TextInput 
                    style={styles.callLogTextarea}
                    multiline={true}
                    placeholder="Enter call summary or notes here..."
                    value={callLogForm.remarks}
                    onChangeText={text => setCallLogForm({...callLogForm, remarks: text})}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.callLogSaveBtn} onPress={handleSaveCallLog}>
                <Text style={styles.callLogSaveBtnText}>Save Call Log</Text>
              </TouchableOpacity>

              <View style={styles.recentLogsSection}>
                <Text style={styles.recentLogsTitle}>Recent Call Logs</Text>
                {isLoadingLogs ? (
                  <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.m }} />
                ) : leadLogs && leadLogs.length > 0 ? (
                  leadLogs.map((log: any, index: number) => (
                    <View key={log.id || index} style={{ padding: spacing.m, backgroundColor: '#F8FAFC', borderRadius: 8, marginBottom: spacing.s, borderWidth: 1, borderColor: colors.border }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 13 }}>{log.call_type || log.type || 'Follow Up'}</Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>{log.created_at || log.date || ''}</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: colors.textSecondary }}>{log.notes || log.remarks || 'No notes provided'}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyLogsCard}>
                    <Icon name="history" size={24} color={colors.textMuted} style={{ marginBottom: 8 }} />
                    <Text style={styles.callLogTableEmpty}>No previous call logs recorded for this lead.</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <DatePickerModal
        visible={isCallLogDatePickerVisible}
        onClose={() => setIsCallLogDatePickerVisible(false)}
        onSelectDate={(date: string) => {
          setCallLogForm(prev => ({...prev, nextFollowUpDate: date}));
          setIsCallLogDatePickerVisible(false);
        }}
      />
      
      {/* Status Selection Modal */}
      <Modal
        visible={isCallLogStatusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCallLogStatusModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsCallLogStatusModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%', paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Inquiry Status</Text>
              <TouchableOpacity onPress={() => setIsCallLogStatusModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {INQUIRY_STATUSES.map(status => (
                <TouchableOpacity 
                  key={status}
                  style={styles.actionMenuItem}
                  onPress={() => {
                    setCallLogForm(prev => ({ ...prev, status }));
                    setIsCallLogStatusModalVisible(false);
                  }}
                >
                  <Text style={styles.actionMenuText}>{status}</Text>
                  {callLogForm.status === status && <Icon name="check" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Budget Selection Modal */}
      <Modal
        visible={isCallLogBudgetModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCallLogBudgetModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsCallLogBudgetModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%', paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Budget</Text>
              <TouchableOpacity onPress={() => setIsCallLogBudgetModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {BUDGET_OPTIONS.map(budget => (
                <TouchableOpacity 
                  key={budget}
                  style={styles.actionMenuItem}
                  onPress={() => {
                    setCallLogForm(prev => ({ ...prev, budget }));
                    setIsCallLogBudgetModalVisible(false);
                  }}
                >
                  <Text style={styles.actionMenuText}>{budget}</Text>
                  {callLogForm.budget === budget && <Icon name="check" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },

  activeTag: { flexDirection: 'row', backgroundColor: '#FEF3C7', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignItems: 'center' },
  activeTagText: { color: '#B45309', fontWeight: 'bold', fontSize: 12 },

  statsScroll: { flexDirection: 'row', gap: spacing.m, padding: spacing.m, flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '47%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.s, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.s },
  statBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statCount: { fontSize: typography.sizes.xl, fontWeight: '800' },
  statLabel: { fontSize: typography.sizes.s, fontWeight: '600' },
  statIconWrap: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: spacing.m, marginHorizontal: spacing.m, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },

  card: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: spacing.m, marginBottom: spacing.m, padding: spacing.m, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  userInfoRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#B45309' },
  userName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  userPhone: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },

  cardDetails: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.m, marginBottom: spacing.m },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: spacing.s },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
  btnLogCall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnLogCallText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.s },

  actionButtonsRight: { flexDirection: 'row', gap: spacing.s, alignItems: 'center' },
  btnAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' },
  btnActionText: { color: '#B45309', fontWeight: 'bold', fontSize: typography.sizes.s, marginLeft: 4 },
  btnWhatsapp: { backgroundColor: '#10B981', width: 38, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // Action Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.m },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  modalList: { paddingTop: spacing.m },
  actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionMenuIcon: { width: 30 },
  actionMenuText: { fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },
  
  // Call Log Modal
  callLogModalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  callLogHeader: { padding: spacing.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  callLogTitle: { color: colors.text, fontSize: typography.sizes.l, fontWeight: 'bold' },
  callLogBody: { padding: spacing.m },
  
  customerInfoCard: { backgroundColor: '#F8FAFC', padding: spacing.m, borderRadius: 8, marginBottom: spacing.l, borderWidth: 1, borderColor: colors.border },
  customerInfoTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  customerInfoSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },

  callLogFormRow: { flexDirection: 'column', gap: spacing.m, marginBottom: spacing.m },
  callLogInputGroup: { flex: 1 },
  callLogLabel: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.textSecondary, marginBottom: spacing.xs },
  textRed: { color: '#EF4444' },
  callLogSelect: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.m, height: 48 },
  callLogSelectText: { fontSize: typography.sizes.m, color: colors.text },
  
  callLogTextareaRow: { flexDirection: 'column', marginBottom: spacing.l },
  callLogTextarea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 8, height: 100, padding: spacing.m, fontSize: typography.sizes.m },
  
  callLogSaveBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: spacing.xl },
  callLogSaveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },
  
  recentLogsSection: { marginTop: spacing.m },
  recentLogsTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.m },
  emptyLogsCard: { backgroundColor: '#F8FAFC', padding: spacing.xl, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  callLogTableEmpty: { fontStyle: 'italic', color: colors.textSecondary, fontSize: typography.sizes.m, textAlign: 'center' },
});
