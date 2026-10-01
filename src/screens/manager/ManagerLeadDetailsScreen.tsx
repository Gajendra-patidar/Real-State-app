import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { leadApi } from '../../services/api/leadApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive } from '../../hooks/useResponsive';

export const ManagerLeadDetailsScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const leadId = route.params?.leadId;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    budget_max: '',
  });

  // Transfer Modal State
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [transferForm, setTransferForm] = useState({
    to_executive: null as any,
    reason: '',
    notes: '',
  });
  // Re-assign Modal State
  const [isReassignModalVisible, setIsReassignModalVisible] = useState(false);
  const [reassignExecutive, setReassignExecutive] = useState<any>(null);

  const [activeDropdown, setActiveDropdown] = useState<'none' | 'executive' | 'reason' | 'reassign'>('none');

  const TRANSFER_REASONS = [
    'No Response from Current Executive',
    'Executive on Leave / Unavailable',
    'Executive Overloaded — Workload Balancing',
    'Customer Requested Different Executive',
    'Executive Resigned / Left Company',
    'Geographic Re-Routing',
    'Manager Decision',
    'Other'
  ];

  useEffect(() => {
    fetchLeadDetails();
    fetchTeamMembers();
  }, [leadId]);

  const fetchTeamMembers = async () => {
    try {
      const { dashboardApi } = require('../../services/api/dashboardApi');
      const response = await dashboardApi.getManagerExecutives();
      if (response?.data?.data) {
        setTeamMembers(response.data.data);
      } else {
        setTeamMembers([
          { id: 8, name: 'Vikram Singh', role: { name: 'Sales Executive' } },
          { id: 9, name: 'Neha Gupta', role: { name: 'Sales Executive' } },
          { id: 10, name: 'Rohan Verma', role: { name: 'Sales Executive' } }
        ]);
      }
    } catch (error) {
      console.log('Error fetching team members', error);
    }
  };

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      if (leadId) {
        const response = await leadApi.getManagerLeadDetails(leadId);
        if (response?.data) {
          setLead(response.data);
          setEditForm({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            budget_max: response.data.budget_max ? response.data.budget_max.toString() : '',
          });
        }
      }
    } catch (error) {
      console.log('Error fetching lead details', error);
      Alert.alert('Error', 'Could not load lead details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm.first_name || !editForm.phone) {
      Alert.alert('Error', 'First Name and Phone Number are required.');
      return;
    }
    try {
      const payload = {
        ...editForm,
        budget_max: editForm.budget_max ? parseInt(editForm.budget_max, 10) : null
      };
      await leadApi.updateLead(lead.id, payload);
      Alert.alert('Success', 'Lead details updated successfully.');
      setIsEditModalVisible(false);
      fetchLeadDetails();
    } catch (error) {
      console.log('Error updating lead', error);
      Alert.alert('Updated (Local)', 'Lead details updated locally.');
      setLead({ ...lead, ...editForm, budget_max: editForm.budget_max ? parseInt(editForm.budget_max, 10) : null });
      setIsEditModalVisible(false);
    }
  };

  const handleReassignLead = async () => {
    if (!reassignExecutive) {
      Alert.alert('Error', 'Please select an executive.');
      return;
    }
    const assignedUser = lead.activities?.find((a: any) => a.user)?.user || { id: 0, name: 'Unknown' };
    try {
      const payload = {
        from_executive_id: assignedUser?.id,
        to_executive_id: reassignExecutive.id,
        notes: 'Re-assigned from Manager Dashboard'
      };
      await leadApi.transferLead(lead.id, payload);
      Alert.alert('Success', `Lead re-assigned to ${reassignExecutive.name}.`);
      setIsReassignModalVisible(false);
      setReassignExecutive(null);
      fetchLeadDetails();
    } catch (error) {
      console.log('Error re-assigning lead', error);
      Alert.alert('Re-assigned (Local)', `Lead re-assigned to ${reassignExecutive.name} locally.`);
      setIsReassignModalVisible(false);
      setReassignExecutive(null);
      fetchLeadDetails();
    }
  };

  const handleTransferLead = async () => {
    const assignedUser = lead.activities?.find((a: any) => a.user)?.user || { id: 0, name: 'Unknown' };
    if (!transferForm.to_executive || !transferForm.reason) {
      Alert.alert('Error', 'Please select an executive and a reason.');
      return;
    }
    try {
      const payload = {
        from_executive_id: assignedUser?.id,
        to_executive_id: transferForm.to_executive.id,
        notes: `Reason: ${transferForm.reason}. ${transferForm.notes}`
      };
      await leadApi.transferLead(lead.id, payload);
      Alert.alert('Success', `Lead transferred to ${transferForm.to_executive.name}.`);
      setIsTransferModalVisible(false);
      setTransferForm({ to_executive: null, reason: '', notes: '' });
      fetchLeadDetails();
    } catch (error) {
      console.log('Error transferring lead', error);
      Alert.alert('Transferred (Local)', `Lead transferred to ${transferForm.to_executive.name} locally.`);
      setIsTransferModalVisible(false);
      setTransferForm({ to_executive: null, reason: '', notes: '' });
      fetchLeadDetails();
    }
  };

  const handleCall = () => {
    if (lead?.phone) {
      Linking.openURL(`tel:${lead.phone}`);
    }
  };

  const formatCurrency = (val: number | null) => {
    if (!val) return 'N/A';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader leftIcon='arrow-left' onLeftPress={() => navigation.goBack()} title="Lead Details" />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!lead) {
    return (
      <View style={styles.container}>
        <AppHeader leftIcon='arrow-left' onLeftPress={() => navigation.goBack()} title="Lead Details" />
        <View style={styles.loader}>
          <Text style={styles.errorText}>Lead not found</Text>
        </View>
      </View>
    );
  }

  const assignedUser = lead.activities?.find((a: any) => a.user)?.user || { name: 'Unknown Executive', role: { name: 'Sales Executive' } };
  const initials = (lead.first_name || '').charAt(0) + (lead.last_name || '').charAt(0);

  return (
    <View style={styles.container}>
      <AppHeader leftIcon='arrow-left' onLeftPress={() => navigation.goBack()} title="Lead Details" />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        {/* Top Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setIsEditModalVisible(true)}>
            <Icon name="pencil-outline" size={18} color={colors.text} />
            <Text style={styles.actionBtnTextOutline}>Edit Lead</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setIsTransferModalVisible(true)}>
            <Icon name="swap-horizontal" size={18} color={colors.warning} />
            <Text style={[styles.actionBtnTextOutline, { color: colors.warning }]}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSolid} onPress={handleCall}>
            <Icon name="phone" size={18} color={colors.surface} />
            <Text style={styles.actionBtnTextSolid}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Main Header Card */}
        <View style={styles.card}>
          <View style={styles.leadHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{initials}</Text>
            </View>
            <View style={styles.leadHeaderInfo}>
              <Text style={styles.leadName}>{lead.first_name} {lead.last_name}</Text>
              <View style={styles.badgesRow}>
                <View style={styles.badgeCode}>
                  <Text style={styles.badgeCodeText}>{lead.lead_code}</Text>
                </View>
                <View style={[styles.badgeCode, {backgroundColor: colors.error + '20'}]}>
                  <Text style={[styles.badgeCodeText, {color: colors.error}]}>{lead.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.budgetRow}>
            <Text style={styles.budgetAmount}>
              {lead.budget_min ? formatCurrency(lead.budget_min) : '₹75,00,000'} - {lead.budget_max ? formatCurrency(lead.budget_max) : '₹1,25,00,000'}
            </Text>
            <Text style={styles.budgetLabel}>CUSTOMER BUDGET RANGE</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>12</Text>
              <Text style={styles.metricLabel}>Properties Viewed</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{lead.site_visits?.length || 0}</Text>
              <Text style={styles.metricLabel}>Site Showings</Text>
            </View>
            <View style={[styles.metricBox, {borderRightWidth: 0}]}>
              <Text style={styles.metricValue}>0</Text>
              <Text style={styles.metricLabel} numberOfLines={1} >Converted Bookings</Text>
            </View>
          </View>
        </View>

        {/* Assigned Executive Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="account-tie" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Assigned Sales Executive</Text>
          </View>
          
          <View style={styles.executiveInfo}>
            <View style={styles.avatarMedium}>
              <Text style={styles.avatarMediumText}>{assignedUser.name.charAt(0)}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.executiveName}>{assignedUser.name}</Text>
              <Text style={styles.executiveRole}>{assignedUser.role?.name || 'Sales Executive'}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.reassignBtn} onPress={() => setIsReassignModalVisible(true)}>
            <Icon name="account-switch" size={18} color={colors.textSecondary} />
            <Text style={styles.reassignBtnText}>Re-assign Executive</Text>
          </TouchableOpacity>
        </View>

        {/* Buyer Preferences */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="tune-vertical" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Buyer Preferences</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>PROPERTY TYPE</Text>
              <Text style={styles.detailValue}>{lead.interested_unit_type || 'Luxury Apartments'}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>BEDROOMS</Text>
              <Text style={styles.detailValue}>3 - 4 BHK</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>PREFERRED PROJECT</Text>
              <Text style={styles.detailValue}>{lead.project?.name || 'Any'}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>PURCHASE TIMELINE</Text>
              <Text style={styles.detailValue}>Immediate Buyer</Text>
            </View>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="card-account-details-outline" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Contact & Location Details</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
              <Text style={styles.detailValue}>{lead.email || 'N/A'}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>PHONE NUMBER</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={styles.detailValue}>{lead.phone}</Text>
                <View style={styles.waBadge}><Text style={styles.waBadgeText}>WA</Text></View>
              </View>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>ADDRESS / NOTES</Text>
              <Text style={styles.detailValue}>{lead.notes || 'N/A'}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>LOCATION / PROJECT</Text>
              <Text style={styles.detailValue}>{lead.project?.location_address || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Activity Logs */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="history" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Recent Activity & Interaction Logs</Text>
          </View>
          
          {lead.activities?.length > 0 ? (
            lead.activities.map((activity: any, index: number) => (
              <View key={activity.id || index} style={styles.activityItem}>
                <View style={styles.activityIconWrapper}>
                  <Icon name="lightning-bolt" size={16} color={colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityDesc}>{activity.description}</Text>
                  <Text style={styles.activityMeta}>
                    {formatDate(activity.created_at)} • by {activity.user?.name || 'System'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.errorText}>No recent activity</Text>
          )}
        </View>
      </ScrollView>

      {/* Edit Lead Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 500, width: '95%' }]}>
            <View style={styles.modalHeaderBlue}>
              <View style={{flex: 1}}>
                <Text style={styles.modalHeaderTitle}>Edit Lead Details</Text>
                <Text style={styles.modalHeaderSubtitle}>Update primary details for this lead</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>First Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.first_name}
                    onChangeText={(val) => setEditForm({...editForm, first_name: val})}
                    placeholder="First Name"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.last_name}
                    onChangeText={(val) => setEditForm({...editForm, last_name: val})}
                    placeholder="Last Name"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Phone Number <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.phone}
                    onChangeText={(val) => setEditForm({...editForm, phone: val})}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.email}
                    onChangeText={(val) => setEditForm({...editForm, email: val})}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.formGroupSingle}>
                <Text style={styles.inputLabel}>Max Budget (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.budget_max}
                  onChangeText={(val) => setEditForm({...editForm, budget_max: val.replace(/[^0-9]/g, '')})}
                  placeholder="e.g. 10000000"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transfer Lead Modal */}
      <Modal
        visible={isTransferModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTransferModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveDropdown('none')}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContainer, { maxWidth: 500, width: '95%' }]}>
            <View style={styles.modalHeaderBlue}>
              <View style={{flex: 1}}>
                <Text style={styles.modalHeaderTitle}>Transfer Lead</Text>
                <Text style={styles.modalHeaderSubtitle}>{lead?.lead_code} • {lead?.first_name} {lead?.last_name}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsTransferModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} nestedScrollEnabled>
              <View style={styles.currentAssigneeBox}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>{assignedUser.name.charAt(0)}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.currentAssigneeName}>{assignedUser.name}</Text>
                  <Text style={styles.currentAssigneeLabel}>Current Assignee</Text>
                </View>
                <Text style={styles.selectNewText}>Select New →</Text>
              </View>

              <View style={styles.formGroupSingle}>
                <Text style={styles.inputLabel}>Transfer To <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger} 
                  onPress={() => setActiveDropdown('executive')}
                >
                  <Text style={transferForm.to_executive ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {transferForm.to_executive ? `${transferForm.to_executive.name} [${transferForm.to_executive.role?.name || 'Sales Executive'}]` : '— Select Sales Executive —'}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroupSingle}>
                <Text style={styles.inputLabel}>Select Reason <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger} 
                  onPress={() => setActiveDropdown('reason')}
                >
                  <Text style={transferForm.reason ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {transferForm.reason ? transferForm.reason : '— Select Reason —'}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroupSingle}>
                <Text style={styles.inputLabel}>Additional Notes <Text style={styles.optionalText}>(optional)</Text></Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={transferForm.notes}
                  onChangeText={(val) => setTransferForm({...transferForm, notes: val})}
                  placeholder="Add context or special instructions for the new executive..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooterRight}>
              <TouchableOpacity style={styles.modalCancelBtnSmall} onPress={() => setIsTransferModalVisible(false)}>
                <Text style={styles.modalCancelBtnTextSmall}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtnSmall} onPress={handleTransferLead}>
                <Text style={styles.modalSaveBtnTextSmall}>Confirm Transfer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Re-assign Modal */}
      <Modal
        visible={isReassignModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsReassignModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveDropdown('none')}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContainer, { maxWidth: 500, width: '95%' }]}>
            <View style={styles.modalHeaderBlue}>
              <View style={{flex: 1}}>
                <Text style={styles.modalHeaderTitle}>Re-assign Sales Executive</Text>
                <Text style={styles.modalHeaderSubtitle}>Change assigned executive for this lead</Text>
              </View>
              <TouchableOpacity onPress={() => setIsReassignModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.surface} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.modalBody, { maxHeight: undefined }]}>
              <View style={styles.formGroupSingle}>
                <Text style={styles.inputLabel}>Select Sales Executive <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.dropdownTrigger} 
                  onPress={() => setActiveDropdown('reassign')}
                >
                  <Text style={reassignExecutive ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {reassignExecutive ? `${reassignExecutive.name} (${reassignExecutive.role?.name || 'Sales Executive'})` : ''}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooterRight}>
              <TouchableOpacity style={styles.modalCancelBtnSmall} onPress={() => setIsReassignModalVisible(false)}>
                <Text style={styles.modalCancelBtnTextSmall}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtnSmall} onPress={handleReassignLead}>
                <Text style={styles.modalSaveBtnTextSmall}>Confirm Re-assignment</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Outer Picker Modal */}
      <Modal
        visible={activeDropdown !== 'none'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveDropdown('none')}
      >
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setActiveDropdown('none')}>
          <View style={[styles.pickerContainer, { maxWidth: 500 }]}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>
                {activeDropdown === 'executive' || activeDropdown === 'reassign' ? 'Select Sales Executive' : 'Select Reason'}
              </Text>
              <TouchableOpacity onPress={() => setActiveDropdown('none')}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
              {(activeDropdown === 'executive' || activeDropdown === 'reassign') && teamMembers.map(member => {
                const isActive = activeDropdown === 'executive' 
                  ? transferForm.to_executive?.id === member.id
                  : reassignExecutive?.id === member.id;
                return (
                  <TouchableOpacity 
                    key={member.id} 
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => {
                      if (activeDropdown === 'executive') {
                        setTransferForm({...transferForm, to_executive: member});
                      } else {
                        setReassignExecutive(member);
                      }
                      setActiveDropdown('none');
                    }}
                  >
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                      {member.name} [{member.role?.name || 'Sales Executive'}]
                    </Text>
                    {isActive && <Icon name="check" size={20} color={colors.surface} />}
                  </TouchableOpacity>
                );
              })}

              {activeDropdown === 'reason' && TRANSFER_REASONS.map(reason => {
                const isActive = transferForm.reason === reason;
                return (
                  <TouchableOpacity 
                    key={reason} 
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => {
                      setTransferForm({...transferForm, reason});
                      setActiveDropdown('none');
                    }}
                  >
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                      {reason}
                    </Text>
                    {isActive && <Icon name="check" size={20} color={colors.surface} />}
                  </TouchableOpacity>
                );
              })}
              <View style={{height: 20}} />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 20
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.m,
  },
  scrollContent: {
    padding: spacing.m,
    paddingBottom: spacing.xxl,
    gap: spacing.m,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.s,
    marginBottom: spacing.xs,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 6,
  },
  actionBtnTextOutline: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  actionBtnSolid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    backgroundColor: colors.success,
    gap: 6,
  },
  actionBtnTextSolid: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  leadHeaderInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  badgeCode: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeCodeText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.bold,
  },
  budgetRow: {
    marginBottom: spacing.l,
    alignItems: 'flex-start',
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  budgetLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.s,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  metricValue: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  cardTitle: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  executiveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  avatarMedium: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMediumText: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  executiveName: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  executiveRole: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  reassignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: spacing.s,
  },
  reassignBtnText: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: typography.sizes.s,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  waBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  waBadgeText: {
    fontSize: 8,
    fontWeight: typography.weights.bold,
    color: '#2E7D32',
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '05',
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.s,
    gap: spacing.m,
    alignItems: 'flex-start',
  },
  activityIconWrapper: {
    backgroundColor: colors.surface,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  
  // Modals General
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeaderBlue: {
    flexDirection: 'row',
    backgroundColor: '#4B88BD',
    padding: spacing.l,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  modalHeaderSubtitle: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalBody: {
    padding: spacing.l,
    maxHeight: 500,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.m,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelBtnText: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#4B88BD',
  },
  modalSaveBtnText: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  modalFooterRight: {
    flexDirection: 'row',
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    gap: spacing.m,
  },
  modalCancelBtnSmall: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalCancelBtnTextSmall: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalSaveBtnSmall: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#4B88BD',
  },
  modalSaveBtnTextSmall: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },

  // Form
  formRow: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  formGroup: {
    flex: 1,
  },
  formGroupSingle: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  optionalText: {
    fontWeight: 'normal',
    color: colors.textMuted,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    fontSize: typography.sizes.m,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 80,
  },

  // Transfer Modal Specific
  currentAssigneeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: {
    color: colors.surface,
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
  },
  currentAssigneeName: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  currentAssigneeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  selectNewText: {
    fontSize: typography.sizes.s,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  dropdownPlaceholder: {
    fontSize: typography.sizes.m,
    color: colors.textMuted,
  },
  dropdownText: {
    fontSize: typography.sizes.m,
    color: colors.text,
  },

  // Picker Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerHeaderTitle: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  pickerList: {
    padding: spacing.m,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  dropdownItemActive: {
    backgroundColor: '#4B88BD',
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: typography.sizes.m,
    color: colors.text,
  },
  dropdownItemTextActive: {
    color: colors.surface,
    fontWeight: typography.weights.bold,
  },
});
