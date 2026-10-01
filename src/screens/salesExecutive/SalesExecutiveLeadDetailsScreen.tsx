import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive } from '../../hooks/useResponsive';
import { useAuth } from '../../hooks/useAuth';

export const SalesExecutiveLeadDetailsScreen = () => {
  const { maxWidth } = useResponsive();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const leadId = route.params?.leadId;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    budget_max: '',
  });

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      if (leadId) {
        const response = await salesExecutiveApi.getManagerLeadDetails(leadId);
        console.log("leads details screen", response);
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
      const data = await salesExecutiveApi.updateLead(lead.id, payload);
      
      Alert.alert('Success', 'Lead details updated successfully.');
      setIsEditModalVisible(false);
      fetchLeadDetails();
    } catch (error) {
      console.log('Error updating lead', error);
      Alert.alert('Error', 'Failed to update lead details.');
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

  const assignedUser = user || { name: 'Unknown Executive', role: 'Sales Executive' };
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

          {/* <View style={styles.metricsRow}>
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
          </View> */}
        </View>

        {/* Assigned Executive Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="account-tie" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Assigned Sales Executive</Text>
          </View>
          
          <View style={styles.executiveInfo}>
            <View style={styles.avatarMedium}>
              <Text style={styles.avatarMediumText}>{(assignedUser?.name || 'S').charAt(0)}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.executiveName}>{assignedUser?.name || 'Sales Executive'}</Text>
              <Text style={styles.executiveRole}>{assignedUser?.role?.name || 'Sales Executive'}</Text>
            </View>
          </View>
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


});
