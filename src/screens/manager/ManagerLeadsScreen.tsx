import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Alert, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppHeader} from '../../components/common/AppHeader';
import {LeadCard} from '../../components/cards/LeadCard';
import {leadApi} from '../../services/api/leadApi';
import {dashboardApi} from '../../services/api/dashboardApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useResponsive} from '../../hooks/useResponsive';

const STATUS_FILTERS = ['All Statuses', 'New Leads', 'Contacted', 'Follow Up', 'Site Visit', 'Interested', 'Negotiation', 'Converted', 'Lost'];

export const ManagerLeadsScreen = () => {
  const { width, numColumns, isTablet } = useResponsive();
  const navigation = useNavigation<any>();
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState<'filter' | 'assign'>('filter');
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<any>(null);
  
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedLeadForStatus, setSelectedLeadForStatus] = useState<any>(null);
  
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes, teamRes] = await Promise.all([
        leadApi.getManagerLeads().catch(() => null),
        dashboardApi.getManagerDashboard().catch(() => null),
        dashboardApi.getManagerExecutives().catch(() => null)
      ]);
      
      if (leadsRes?.data?.data) {
        setLeads(leadsRes.data.data);
      } else {
        // Fallback leads
        setLeads([
          { id: 101, lead_code: 'LD-8801', first_name: 'Amit', last_name: 'Kulkarni', phone: '9988776655', status: 'SITE VISIT', project: { name: 'Apex Grand Residency' }, user: {name: 'Vikram Singh'} },
          { id: 102, lead_code: 'LD-8802', first_name: 'Suresh', last_name: 'Reddy', phone: '9123456789', status: 'NEGOTIATION', project: { name: 'Apex Grand Residency' }, user: {name: 'Priya Nair'} },
          { id: 103, lead_code: 'LD-8803', first_name: 'Rohan', last_name: 'Verma', phone: '9811888881', status: 'NEW', project: { name: 'Apex Grand Residency' }, user: {name: 'Amit Kulkarni'} },
        ]);
      }

      if (statsRes?.dashboard) {
        setStats(statsRes.dashboard);
      } else {
        // Fallback stats
        setStats({
          total_assigned_leads: 12,
          in_progress_leads: 2,
          site_visits_upcoming: 0,
          total_bookings: 0
        });
      }

      if (teamRes?.data?.data) {
        setTeamMembers(teamRes.data.data);
      } else {
        // Fallback team members
        setTeamMembers([
          { id: 8, name: 'Vikram Singh (Executive 1)', role: { name: 'Sales Executive' } },
          { id: 9, name: 'Neha Gupta (Executive 2)', role: { name: 'Sales Executive' } },
          { id: 10, name: 'Rohan Verma (Executive 3)', role: { name: 'Sales Executive' } },
          { id: 11, name: 'Kavita Patel (Executive 4)', role: { name: 'Sales Executive' } }
        ]);
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

  const handleAssignLead = async (executive: any) => {
    if (!selectedLeadForAssign) return;
    
    try {
      console.log("assigned data:", executive);
      // In a real app we would call leadApi.assignLead or transferLead
      const data = await leadApi.assignLead(selectedLeadForAssign.id, {executive_id: executive.id});
      Alert.alert('Success', `Lead ${selectedLeadForAssign.lead_code} assigned to ${executive.name}`);

      console.log("assigned data:", data);
      
      
      // Optimitically update list
      setLeads(prev => prev.map(l => l.id === selectedLeadForAssign.id ? {...l, user: executive} : l));
    } catch (error) {
      console.log('Error assigning lead', error);
      Alert.alert('Assigned (Local)', `Lead ${selectedLeadForAssign.lead_code} locally assigned to ${executive.name}`);
      setLeads(prev => prev.map(l => l.id === selectedLeadForAssign.id ? {...l, user: executive} : l));
    } finally {
      setIsEmployeeModalVisible(false);
      setSelectedLeadForAssign(null);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedLeadForStatus) return;
    
    try {
      if (newStatus === 'LOST') {
        const data =  await leadApi.dropLead(selectedLeadForStatus.id, {reason: 'Manager dropped'});
        console.log("checking lead data 1", data);
        
      } else {
        const data = await leadApi.updateLeadStatus(selectedLeadForStatus.id, {status: newStatus});
        console.log("checking lead data 1", data);
      }
      
      Alert.alert('Success', `Status updated to ${newStatus}`);
      setLeads(prev => prev.map(l => l.id === selectedLeadForStatus.id ? {...l, status: newStatus} : l));
    } catch (error) {
      console.log('Error updating status', error);
      Alert.alert('Updated (Local)', `Status updated to ${newStatus} locally`);
      setLeads(prev => prev.map(l => l.id === selectedLeadForStatus.id ? {...l, status: newStatus} : l));
    } finally {
      setIsStatusModalVisible(false);
      setSelectedLeadForStatus(null);
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
        <TouchableOpacity style={styles.employeeFilterBtn} onPress={() => { setEmployeeModalMode('filter'); setIsEmployeeModalVisible(true); }}>
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
                {employeeModalMode === 'assign' 
                  ? `Assign Lead: ${selectedLeadForAssign?.lead_code}` 
                  : 'Filter by Employee / Staff'}
              </Text>
              <TouchableOpacity onPress={() => setIsEmployeeModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={[styles.modalItem, !selectedEmployee && employeeModalMode === 'filter' && styles.modalItemActive]}
                onPress={() => {
                  if (employeeModalMode === 'assign') {
                    handleAssignLead({id: null, name: 'Unassigned'});
                  } else {
                    setSelectedEmployee(null); 
                    setIsEmployeeModalVisible(false);
                  }
                }}
              >
                <Icon name="account-group" size={20} color={(!selectedEmployee && employeeModalMode === 'filter') ? colors.primary : colors.textSecondary} />
                <Text style={[styles.modalItemText, !selectedEmployee && employeeModalMode === 'filter' && styles.modalItemTextActive]}>
                  {employeeModalMode === 'assign' ? 'Unassign Lead' : 'Unassigned / All Leads'}
                </Text>
                {!selectedEmployee && employeeModalMode === 'filter' && <Icon name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
              
              {teamMembers.map((member, index) => {
                const isActive = employeeModalMode === 'filter' && selectedEmployee?.id === member.id;
                return (
                  <TouchableOpacity
                    key={member.id || index}
                    style={[styles.modalItem, isActive && styles.modalItemActive]}
                    onPress={() => {
                      if (employeeModalMode === 'assign') {
                        handleAssignLead(member);
                      } else {
                        setSelectedEmployee(member); 
                        setIsEmployeeModalVisible(false);
                      }
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
              {['NEW', 'CONTACTED', 'LOST'].map((status) => {
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
                style={styles.actionMenuItem} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('StartNegotiation', { lead: selectedLeadForAction });
                }}
              >
                <Icon name="handshake" size={22} color="#F59E0B" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Start Negotiation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionMenuItem} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('RecordBooking', { lead: selectedLeadForAction });
                }}
              >
                <Icon name="cash-multiple" size={22} color="#10B981" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Record Booking</Text>
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
                onViewPress={() => navigation.navigate('ManagerLeadDetails', { leadId: item.id })}
                onAssignPress={() => {
                  setSelectedLeadForAssign(item);
                  setEmployeeModalMode('assign');
                  setIsEmployeeModalVisible(true);
                }}
                onStatusPress={() => {
                  setSelectedLeadForStatus(item);
                  setIsStatusModalVisible(true);
                }}
                onActionPress={() => {
                  setSelectedLeadForAction(item);
                  setIsActionModalVisible(true);
                }}
              />
            </View>
          )}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={fetchData}
        />
      )}
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
});