import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppHeader} from '../../components/common/AppHeader';
import {LeadCard} from '../../components/cards/LeadCard';
import {salesExecutiveApi} from '../../services/api/salesExecutiveApi';
import {dashboardApi} from '../../services/api/dashboardApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useResponsive} from '../../hooks/useResponsive';
import {DatePickerModal} from '../../components/common/DatePickerModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const STATUS_FILTERS = ['All Statuses', 'New Leads', 'Contacted', 'Follow Up', 'Site Visit', 'Interested', 'Negotiation', 'Converted', 'Lost'];

export const SalesExecutiveLeadsScreen = () => {
  const { width, numColumns, isTablet } = useResponsive();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedLeadForStatus, setSelectedLeadForStatus] = useState<any>(null);
  
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<any>(null);
  
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<any>(null);

  const INQUIRY_STATUSES = ['Meeting at client place', 'Not interested', 'In Followup', 'Not connected'];
  const BUDGET_OPTIONS = ['15 lac', '30 lac', '50 lac', '1 cr'];

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

  const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes, teamRes] = await Promise.all([
        salesExecutiveApi.getAssignedLeads().catch(() => null),
        salesExecutiveApi.getDashboard().catch(() => null),
        dashboardApi.getManagerExecutives().catch(() => null)
      ]);
      
      if (leadsRes?.data?.data) {
        setLeads(leadsRes.data.data);
      } else if (leadsRes?.data) {
        setLeads(Array.isArray(leadsRes.data) ? leadsRes.data : []);
      } else {
        setLeads(Array.isArray(leadsRes) ? leadsRes : []);
      }

      if (statsRes?.dashboard) {
        setStats(statsRes.dashboard);
      } else {
        setStats({
          total_assigned_leads: 0,
          in_progress_leads: 0,
          site_visits_upcoming: 0,
          total_bookings: 0
        });
      }

      if (teamRes?.data?.data) {
        setTeamMembers(teamRes.data.data);
      } else if (teamRes?.data) {
        setTeamMembers(Array.isArray(teamRes.data) ? teamRes.data : []);
      } else {
        setTeamMembers(Array.isArray(teamRes) ? teamRes : []);
      }
    } catch (error) {
      console.log('Error fetching manager leads data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    Alert.alert('Export CSV', 'CSV Export will be downloaded.');
  };


  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedLeadForStatus) return;
    
    try {
      if (newStatus === 'LOST') {
        const data =  await salesExecutiveApi.dropLead(selectedLeadForStatus.id, {reason: 'Manager dropped'});
        console.log("checking lead data 1", data);
        
      } else {
        const data = await salesExecutiveApi.updateLeadStatus(selectedLeadForStatus.id, {status: newStatus});
        console.log("checking lead data 1", data);
      }
      
      Alert.alert('Success', `Status updated to ${newStatus}`);
      setLeads(prev => prev.map(l => l.id === selectedLeadForStatus.id ? {...l, status: newStatus} : l));
    } catch (error) {
      console.log('Error updating status', error);
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setIsStatusModalVisible(false);
      setSelectedLeadForStatus(null);
    }
  };

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

      await salesExecutiveApi.scheduleFollowUp(selectedLeadForCallLog.id, {
        scheduled_at: callLogForm.nextFollowUpDate,
        type: callLogForm.status,
        notes: finalNotes
      });

      Alert.alert('Success', 'Call log saved successfully');
      setIsCallLogModalVisible(false);
      
      // Optionally reset form
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

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-search-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No leads found</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={{ maxWidth: 1000, alignSelf: 'center', width: '100%' }}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>CRM Sales Pipeline & Leads</Text>
          <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
            <Icon name="download" size={16} color={colors.primary} />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { width: isTablet ? '23%' : '48%' }]}>
            <Text style={styles.statLabel}>Total Pipeline</Text>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats?.total_assigned_leads || 0}</Text>
              <Icon name="account-group" size={20} color={colors.primary} style={styles.statIcon} />
            </View>
          </View>
          <View style={[styles.statCard, { width: isTablet ? '23%' : '48%' }]}>
            <Text style={styles.statLabel}>Active Negotiations</Text>
            <View style={styles.statRow}>
              <Text style={[styles.statValue, {color: colors.warning}]}>{stats?.in_progress_leads || 0}</Text>
              <Icon name="handshake" size={20} color={colors.warning} style={[styles.statIcon, {backgroundColor: colors.warning + '20'}]} />
            </View>
          </View>
          <View style={[styles.statCard, { width: isTablet ? '23%' : '48%' }]}>
            <Text style={styles.statLabel}>Site Visits Scheduled</Text>
            <View style={styles.statRow}>
              <Text style={[styles.statValue, {color: colors.purple}]}>{stats?.site_visits_upcoming || 0}</Text>
              <Icon name="office-building" size={20} color={colors.purple} style={[styles.statIcon, {backgroundColor: colors.purple + '20'}]} />
            </View>
          </View>
          <View style={[styles.statCard, { width: isTablet ? '23%' : '48%' }]}>
            <Text style={styles.statLabel}>Converted Bookings</Text>
            <View style={styles.statRow}>
              <Text style={[styles.statValue, {color: colors.success}]}>{stats?.total_bookings || 0}</Text>
              <Icon name="trophy" size={20} color={colors.success} style={[styles.statIcon, {backgroundColor: colors.success + '20'}]} />
            </View>
          </View>
        </View>
      </View>

      {/* Search & Employee Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone or code..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchData}
          />
        </View>
        <TouchableOpacity style={styles.employeeFilterBtn} onPress={() => { setIsEmployeeModalVisible(true); }}>
          {selectedEmployee ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="check" size={16} color={colors.primary} style={{marginRight: 4}} />
              <Text style={[styles.employeeFilterText, {color: colors.primary}]} numberOfLines={1}>
                {selectedEmployee.name.split(' ')[0]}
              </Text>
            </View>
          ) : (
            <>
              <Icon name="account-tie" size={20} color={colors.textSecondary} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Pipeline Status Filters */}
      <View style={styles.statusFiltersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusFiltersRow}>
          {STATUS_FILTERS.map(status => (
            <TouchableOpacity 
              key={status} 
              style={[styles.statusChip, selectedStatus === status && styles.statusChipActive]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.statusChipText, selectedStatus === status && styles.statusChipTextActive]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modals remain same */}
      <Modal
        visible={isEmployeeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEmployeeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filter by Employee / Staff
              </Text>
              <TouchableOpacity onPress={() => setIsEmployeeModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[styles.modalItem, !selectedEmployee && styles.modalItemActive]}
                onPress={() => {
                  setSelectedEmployee(null); 
                  setIsEmployeeModalVisible(false);
                }}
              >
                <Icon name="account-group" size={20} color={!selectedEmployee ? colors.primary : colors.textSecondary} />
                <Text style={[styles.modalItemText, !selectedEmployee && styles.modalItemTextActive]}>
                  Unassigned / All Leads
                </Text>
                {!selectedEmployee && <Icon name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
              
              {teamMembers.map((member, index) => {
                const isActive = selectedEmployee?.id === member.id;
                return (
                  <TouchableOpacity
                    key={member.id || index}
                    style={[styles.modalItem, isActive && styles.modalItemActive]}
                    onPress={() => {
                      setSelectedEmployee(member); 
                      setIsEmployeeModalVisible(false);
                    }}
                  >
                    <Icon name="account" size={20} color={isActive ? colors.primary : colors.textSecondary} />
                    <Text style={[styles.modalItemText, isActive && styles.modalItemTextActive]}>
                      {member.name} [{member.role?.name || 'Sales Executive'}]
                    </Text>
                    {isActive && <Icon name="check" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Status Filter Modal */}
      <Modal
        visible={isStatusModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Update Status: {selectedLeadForStatus?.lead_code}
              </Text>
              <TouchableOpacity onPress={() => setIsStatusModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {['NEW', 'CONTACTED', 'FOLLOW UP', 'SITE VISIT', 'LOST'].map((status) => {
                const isActive = selectedLeadForStatus?.status === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.modalItem, isActive && styles.modalItemActive]}
                    onPress={() => handleUpdateStatus(status)}
                  >
                    <Icon 
                      name={status === 'NEW' ? 'star' : status === 'CONTACTED' ? 'phone' : 'close-circle'} 
                      size={20} 
                      color={isActive ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[styles.modalItemText, isActive && styles.modalItemTextActive]}>
                      {status}
                    </Text>
                    {isActive && <Icon name="check" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Action Menu Modal */}
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
                Actions for {selectedLeadForAction?.lead_code}
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
                  navigation.navigate('ScheduleSiteVisit', { lead: selectedLeadForAction });
                }}
              >
                <Icon name="map-marker" size={22} color="#6B4EFF" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Schedule Site Visit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionMenuItem, { borderBottomWidth: 0 }]} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('DropLead', { lead: selectedLeadForAction });
                }}
              >
                <Icon name="thumb-down" size={22} color="#EF4444" style={styles.actionMenuIcon} />
                <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Drop Lead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={isHistoryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsHistoryModalVisible(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { justifyContent: 'center', padding: spacing.m }]} 
          activeOpacity={1} 
          onPress={() => setIsHistoryModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { borderRadius: 16, maxHeight: '80%', width: '100%', maxWidth: 600, paddingBottom: spacing.m, alignSelf: 'center' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                Activity History
              </Text>
              <TouchableOpacity onPress={() => setIsHistoryModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {[1, 2, 3, 4].map((_, index) => (
                <View key={index} style={styles.historyItemCard}>
                  <View style={styles.historyItemHeader}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="lightning-bolt" size={16} color={colors.warning} />
                      <Text style={styles.historyItemTitle}>STATUS CHANGE</Text>
                    </View>
                    <Text style={styles.historyItemDate}>2026-09-28T13:02</Text>
                  </View>
                  <Text style={styles.historyItemDesc}>
                    Status changed from {index === 3 ? 'new' : 'contacted'} to CONTACTED.
                  </Text>
                </View>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </View>
  );


  const filteredLeads = leads.filter(lead => {
    // 1. Search Filter
    const searchLower = search.toLowerCase().trim();
    if (searchLower) {
      const name = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
      const phone = (lead.phone || '').toLowerCase();
      const code = (lead.lead_code || '').toLowerCase();
      if (!name.includes(searchLower) && !phone.includes(searchLower) && !code.includes(searchLower)) {
        return false;
      }
    }

    // 2. Status Filter
    if (selectedStatus !== 'All Statuses') {
      const dbStatus = (lead.status || '').toUpperCase();
      let match = false;
      if (selectedStatus === 'New Leads' && dbStatus === 'NEW') match = true;
      else if (selectedStatus === 'Site Visit' && dbStatus === 'SITE VISIT') match = true;
      else if (selectedStatus === 'Converted' && dbStatus === 'BOOKED') match = true;
      else if (selectedStatus.toUpperCase() === dbStatus) match = true;
      
      if (!match) return false;
    }

    // 3. Employee Filter
    if (selectedEmployee) {
      if (lead.user?.id !== selectedEmployee.id) {
        return false;
      }
    }

    return true;
  });

  console.log('Filtered Leads:', filteredLeads);

  return (
    <View style={styles.container}>
      {/* <AppHeader title="Team Leads Pipeline" /> */}
      
      {loading && leads.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          key={numColumns} // necessary to re-render when columns change
          numColumns={numColumns}
          data={filteredLeads}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader()}
          renderItem={({item}) => (
            <View style={{flex: 1, paddingHorizontal: spacing.m, maxWidth: isTablet ? '100%' : 1000}}>
              <LeadCard
                customerName={`${item.first_name} ${item.last_name || ''}`.trim()}
                leadCode={item.lead_code}
                phone={item.phone}
                hasWhatsapp={true}
                property={item.project?.name || 'Any'}
                assignedExecutive={item.user?.name || 'Unassigned'}
                status={item.status}
                onViewPress={() => navigation.navigate('SalesExecutiveLeadDetails', { leadId: item.id })}
                onCallLogPress={() => {
                  setSelectedLeadForCallLog(item);
                  setIsCallLogModalVisible(true);
                }}
                onStatusPress={() => {
                  setSelectedLeadForStatus(item);
                  setIsStatusModalVisible(true);
                }}
                onActionPress={() => {
                  setSelectedLeadForAction(item);
                  setIsActionModalVisible(true);
                }}
                onHistoryPress={() => {
                  setSelectedLeadForHistory(item);
                  setIsHistoryModalVisible(true);
                }}
              />
            </View>
          )}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={fetchData}
        />
      )}

      {/* FAB for Adding Lead */}
      <TouchableOpacity 
        style={styles.addLeadFab} 
        activeOpacity={0.8}
        onPress={() => setIsAddLeadModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#FFF" />
        {/* <Text style={styles.addLeadFabText}>Add</Text> */}
      </TouchableOpacity>
      {/* Call Log Modal */}
      <Modal
        visible={isCallLogModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCallLogModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 0, paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.addLeadModalHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.addLeadModalTitle}>Follow-up Call Log</Text>
                <Text style={styles.addLeadModalSubtitle} numberOfLines={1}>
                  {selectedLeadForCallLog?.first_name} {selectedLeadForCallLog?.last_name || ''} • {selectedLeadForCallLog?.phone}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsCallLogModalVisible(false)} style={{marginLeft: 16}}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: spacing.l }}>
              
              <View style={{ marginBottom: spacing.m }}>
                <Text style={styles.inputLabel}>Inquiry Status <Text style={{color: '#EF4444'}}>*</Text></Text>
                <TouchableOpacity style={styles.inputBoxSelect} onPress={() => setIsCallLogStatusModalVisible(true)}>
                  <Text style={styles.inputText}>{callLogForm.status}</Text>
                  <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: spacing.m }}>
                <Text style={styles.inputLabel}>Next Followup Date <Text style={{color: '#EF4444'}}>*</Text></Text>
                <TouchableOpacity style={styles.inputBoxSelect} onPress={() => setIsCallLogDatePickerVisible(true)}>
                  <Text style={[styles.inputText, !callLogForm.nextFollowUpDate && { color: colors.textMuted }]}>
                    {callLogForm.nextFollowUpDate || 'Select Date & Time'}
                  </Text>
                  <Icon name="calendar" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: spacing.m }}>
                <Text style={styles.inputLabel}>Budget Upto</Text>
                <TouchableOpacity style={styles.inputBoxSelect} onPress={() => setIsCallLogBudgetModalVisible(true)}>
                  <Text style={[styles.inputText, !callLogForm.budget && { color: colors.textMuted }]}>
                    {callLogForm.budget || 'Select Budget'}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: spacing.l }}>
                <Text style={styles.inputLabel}>Remarks / Notes</Text>
                <TextInput 
                  style={[styles.inputBox, { height: 100, paddingTop: 12 }]}
                  multiline={true}
                  placeholder="Enter call notes here..."
                  placeholderTextColor={colors.textMuted}
                  value={callLogForm.remarks}
                  onChangeText={text => setCallLogForm({...callLogForm, remarks: text})}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.addLeadActions}>
                <TouchableOpacity style={styles.addLeadCancelBtn} onPress={() => setIsCallLogModalVisible(false)}>
                  <Text style={styles.addLeadCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addLeadSaveBtn} onPress={handleSaveCallLog}>
                  <Text style={styles.addLeadSaveText}>Save Log</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <DatePickerModal
          visible={isCallLogDatePickerVisible}
          onClose={() => setIsCallLogDatePickerVisible(false)}
          onSelectDate={(date) => {
            setCallLogForm({ ...callLogForm, nextFollowUpDate: date });
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
            <View style={[styles.modalContent, { maxHeight: '60%' }]}>
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
                    style={styles.modalItem}
                    onPress={() => {
                      setCallLogForm(prev => ({ ...prev, status }));
                      setIsCallLogStatusModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{status}</Text>
                    {callLogForm.status === status && <Icon name="check" size={20} color={colors.primary} />}
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
            <View style={[styles.modalContent, { maxHeight: '60%' }]}>
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
                    style={styles.modalItem}
                    onPress={() => {
                      setCallLogForm(prev => ({ ...prev, budget }));
                      setIsCallLogBudgetModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{budget}</Text>
                    {callLogForm.budget === budget && <Icon name="check" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </Modal>


      {/* Add New Lead Modal */}
      <Modal
        visible={isAddLeadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddLeadModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.addLeadModalContent]}>
            <View style={styles.addLeadModalHeader}>
              <View>
                <Text style={styles.addLeadModalTitle}>Add New Customer Lead</Text>
                <Text style={styles.addLeadModalSubtitle}>Enter primary details to create a lead</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddLeadModalVisible(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.addLeadForm}>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>First Name <Text style={{color: '#EF4444'}}>*</Text></Text>
                  <TextInput style={styles.inputBox} placeholder="John" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput style={styles.inputBox} placeholder="Doe" placeholderTextColor={colors.textMuted} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Phone Number <Text style={{color: '#EF4444'}}>*</Text></Text>
                  <TextInput style={styles.inputBox} placeholder="+91" keyboardType="phone-pad" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput style={styles.inputBox} placeholder="john@example.com" keyboardType="email-address" placeholderTextColor={colors.textMuted} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Project Interest</Text>
                  <View style={styles.inputBoxSelect}>
                    <Text style={styles.inputText}>Select Project</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </View>
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Lead Source</Text>
                  <View style={styles.inputBoxSelect}>
                    <Text style={styles.inputText}>Select Source</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </View>
                </View>
              </View>

              <View style={styles.addLeadActions}>
                <TouchableOpacity style={styles.addLeadCancelBtn} onPress={() => setIsAddLeadModalVisible(false)}>
                  <Text style={styles.addLeadCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addLeadSaveBtn} onPress={() => setIsAddLeadModalVisible(false)}>
                  <Text style={styles.addLeadSaveText}>Save Lead</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    marginBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  statsTitle: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    gap: spacing.xs,
  },
  exportText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.s,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    width: '48%', // using slightly less than 50% to leave room for the gap
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statIcon: {
    backgroundColor: colors.primary + '20',
    padding: spacing.xs,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    alignItems: 'center',
    gap: spacing.s,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.s,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.m,
    color: colors.text,
  },
  employeeFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    height: 48,
    gap: spacing.s,
  },
  employeeFilterText: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  statusFiltersWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingBottom: spacing.s,
    borderBottomWidth: 1,
    paddingHorizontal:20,
    borderBottomColor: colors.border,
  },
  statusFiltersLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    marginRight: spacing.s,
  },
  statusFiltersRow: {
    paddingRight: spacing.m,
    gap: spacing.s,
  },
  statusChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  statusChipTextActive: {
    color: colors.surface,
    fontWeight: typography.weights.bold,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.s,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalList: {
    padding: spacing.m,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.s,
  },
  modalItemActive: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    paddingHorizontal: spacing.s,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  modalItemText: {
    flex: 1,
    fontSize: typography.sizes.m,
    color: colors.text,
    paddingHorizontal: spacing.m,
  },
  modalItemTextActive: {
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.s,
  },
  actionMenuIcon: {
    marginRight: spacing.m,
  },
  actionMenuText: {
    fontSize: typography.sizes.m,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  historyItemCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyItemTitle: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginLeft: 4,
  },
  historyItemDate: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  historyItemDesc: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
  },
  modalOverlayCentered: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.m,
  },
  
  addLeadFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  addLeadFabText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },

  addLeadModalContent: {
    padding: 0,
  },
  addLeadModalHeader: {
    backgroundColor: '#4484B7', // Blue header from the image
    padding: spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addLeadModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  addLeadModalSubtitle: { fontSize: typography.sizes.s, color: '#E0F2FE', marginTop: 4 },
  
  addLeadForm: { padding: spacing.l },
  formRow: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.m },
  formCol: { flex: 1 },
  
  inputLabel: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#1E293B', marginBottom: spacing.s },
  inputBox: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: spacing.m, height: 44, backgroundColor: '#FFF', fontSize: typography.sizes.m, color: colors.text },
  inputBoxSelect: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: spacing.m, height: 44, backgroundColor: '#FFF' },
  inputText: { fontSize: typography.sizes.m, color: colors.text },
  
  addLeadActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.m, marginTop: spacing.l },
  addLeadCancelBtn: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 6 },
  addLeadCancelText: { color: '#1E293B', fontWeight: 'bold', fontSize: typography.sizes.m },
  addLeadSaveBtn: { backgroundColor: '#4484B7', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 6 },
  addLeadSaveText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },
});