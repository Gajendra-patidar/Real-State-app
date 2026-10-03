import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive } from '../../hooks/useResponsive';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
import { useAuth } from '../../hooks/useAuth';

const LeadInfoCard = ({ name, phone }: { name?: string, phone?: string }) => (
  <View style={styles.leadInfoCard}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
    </View>
    <View style={styles.leadInfoTextContainer}>
      <Text style={styles.leadName}>{name || 'Harshit Yadav'}</Text>
      <Text style={styles.leadPhone}>{phone || '6260498383'}</Text>
    </View>
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitleText}>{title}</Text>
);

const ActivityLogItem = () => (
  <View style={styles.activityCard}>
    <View style={styles.activityHeader}>
      <Text style={styles.activityType}>Status Change</Text>
      <Text style={styles.activityDate}>28 Sep, 05:01 PM</Text>
    </View>
    <Text style={styles.activityRemark}>Status changed from new to lost.</Text>
    <View style={styles.activityFooter}>
      <Icon name="account-edit" size={14} color={colors.textSecondary} />
      <Text style={styles.activityLogger}>Rajeev Malhotra (Director)</Text>
    </View>
  </View>
);

export const ScheduleSiteVisitScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const lead = route.params?.lead;
  const { user } = useAuth();

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [currentDateTarget, setCurrentDateTarget] = useState<'visit' | 'followup' | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [followupDate, setFollowupDate] = useState('');

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [visitDescription, setVisitDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState('site visit');
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  const INQUIRY_STATUS_OPTIONS = ['Is Followup', 'Under Negotiation', 'Site Visit', 'Booked'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await salesExecutiveApi.getProjects();
        console.log('Fetched projects:', response);
        if (response && response.data) {
          setProjects(response.data || []);
        } else if (Array.isArray(response)) {
          setProjects(response);
        }
      } catch (error) {
        console.log('Error fetching projects', error);
      }
    };
    fetchProjects();
  }, []);

  const handleScheduleVisit = async () => {
    if (!lead?.id && !lead?.lead_id) {
      Alert.alert('Error', 'No lead specified');
      return;
    }
    if (!selectedProject) {
      Alert.alert('Error', 'Please select a project');
      return;
    }
    if (!visitDate) {
      Alert.alert('Error', 'Please select a scheduled date');
      return;
    }

    try {
      setIsSubmitting(true);
      const leadId = lead?.lead?.id || lead?.lead_id || lead?.id;
      const combinedNotes = `Description: ${visitDescription}`.trim();

      await salesExecutiveApi.scheduleSiteVisit({
        lead_id: leadId,
        project_id: selectedProject.id || 1, // Fallback if no ID available in API data
        scheduled_at: visitDate,
        pickup_location: pickupLocation,
        notes: combinedNotes,
      });

      Alert.alert('Success', 'Site Visit Scheduled successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error scheduling site visit', error);
      Alert.alert('Error', 'Failed to schedule site visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Schedule Site Visit" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name || lead?.name || lead?.lead?.first_name} phone={lead?.phone || lead?.lead?.phone} />

        <SectionTitle title="Primary Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Project <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => setIsProjectModalVisible(true)}>
            <Text style={selectedProject ? styles.pickerText : { color: colors.textSecondary }}>
              {selectedProject ? selectedProject.name : 'Select Project'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Scheduled Date <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => { setCurrentDateTarget('visit'); setDateModalVisible(true); }}>
            <Text style={visitDate ? styles.pickerText : { color: colors.textSecondary }}>{visitDate || 'Select Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Site Visited By <Text style={styles.required}>*</Text></Text>
          <View style={[styles.pickerBox, { backgroundColor: '#F3F4F6' }]}>
            <Text style={styles.pickerText}>{user?.name || user?.first_name || 'Executive'}</Text>
          </View>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Pickup Location <Text style={styles.optional}>(Optional)</Text></Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Client Office / Home"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
        </View>

        {/* <SectionTitle title="Broker Involvement" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Broker Name</Text>
          <TextInput style={styles.textInput} placeholder="Enter Broker Name" />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Broker Phone</Text>
          <TextInput style={styles.textInput} placeholder="Enter Broker Phone" keyboardType="phone-pad" />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Broker Company</Text>
          <TextInput style={styles.textInput} placeholder="Enter Agency/Company" />
        </View> */}

        <SectionTitle title="Notes & Remarks" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Visit Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Enter Visit Description"
            multiline
            numberOfLines={3}
            value={visitDescription}
            onChangeText={setVisitDescription}
          />
        </View>
        {/* <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Remarks</Text>
          <TextInput 
            style={[styles.textInput, styles.textArea]} 
            placeholder="Any additional remarks..." 
            multiline 
            numberOfLines={2} 
            value={remarks}
            onChangeText={setRemarks}
          />
        </View> */}

        {/* <SectionTitle title="Follow-up" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Inquiry Status <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => setIsStatusModalVisible(true)}>
            <Text style={styles.pickerText}>{inquiryStatus}</Text>
            <Icon name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Next Followup Dt. <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => { setCurrentDateTarget('followup'); setDateModalVisible(true); }}>
            <Text style={followupDate ? styles.pickerText : {color: colors.textSecondary}}>{followupDate || 'Select Follow-up Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View> */}

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}><Text style={styles.btnCancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPrimary, isSubmitting && { opacity: 0.7 }]}
            onPress={handleScheduleVisit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.btnPrimaryText}>Schedule Visit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSelectDate={(date) => {
          if (currentDateTarget === 'visit') setVisitDate(date);
          if (currentDateTarget === 'followup') setFollowupDate(date);
        }}
      />

      {/* Project Selection Modal */}
      <Modal
        visible={isProjectModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsProjectModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsProjectModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%', paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Project</Text>
              <TouchableOpacity onPress={() => setIsProjectModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {projects.map((proj, idx) => (
                <TouchableOpacity
                  key={proj.id || idx}
                  style={styles.actionMenuItem}
                  onPress={() => {
                    setSelectedProject(proj);
                    setIsProjectModalVisible(false);
                  }}
                >
                  <Text style={styles.actionMenuText}>{proj.name || `Project ${idx + 1}`}</Text>
                  {selectedProject?.id === proj.id && <Icon name="check" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
              {projects.length === 0 && (
                <Text style={{ textAlign: 'center', padding: spacing.m, color: colors.textSecondary }}>
                  No projects found.
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Inquiry Status Modal */}
      <Modal
        visible={isStatusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsStatusModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%', paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Inquiry Status</Text>
              <TouchableOpacity onPress={() => setIsStatusModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {INQUIRY_STATUS_OPTIONS.map((status, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.actionMenuItem}
                  onPress={() => {
                    setInquiryStatus(status);
                    setIsStatusModalVisible(false);
                  }}
                >
                  <Text style={styles.actionMenuText}>{status}</Text>
                  {inquiryStatus === status && <Icon name="check" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const StartNegotiationScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const lead = route.params?.lead;

  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [closingDate, setClosingDate] = React.useState('');
  const [offeredPrice, setOfferedPrice] = React.useState('');
  const [discountRequested, setDiscountRequested] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSaveNegotiation = async () => {
    if (!lead?.id && !lead?.lead_id) {
      Alert.alert('Error', 'Invalid Lead ID');
      return;
    }

    if (!offeredPrice || !closingDate) {
      Alert.alert('Error', 'Please enter Offered Price and Closing Date');
      return;
    }

    try {
      setIsLoading(true);
      const leadId = lead.id || lead.lead_id;
      await salesExecutiveApi.startNegotiation(leadId, {
        "neg_offered_price": Number(offeredPrice),
        "neg_expected_close_date": closingDate || undefined,
        "neg_remarks": notes
      });
      Alert.alert('Success', 'Negotiation Saved successfully!');
      navigation.navigate('Negotiations', { lead });
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to save negotiation');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Start Negotiation" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name || lead?.customerName} phone={lead?.phone} />

        <SectionTitle title="Negotiation Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Offered Price (₹) <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 4500000"
            keyboardType="numeric"
            value={offeredPrice}
            onChangeText={setOfferedPrice}
          />
        </View>
        {/* <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Discount Requested (₹) <Text style={styles.required}>*</Text></Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="e.g. 100000" 
            keyboardType="numeric" 
            value={discountRequested}
            onChangeText={setDiscountRequested}
          />
        </View> */}
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Expected Closing Date</Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => setDateModalVisible(true)}>
            <Text style={closingDate ? styles.pickerText : { color: colors.textSecondary }}>{closingDate || 'Select Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Client Demands / Notes</Text>
          <TextInput
            style={[styles.textInput, { height: 100 }]}
            placeholder="e.g., Client is asking for complimentary club membership..."
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <SectionTitle title="Recent Follow Up Detail" />
        <ActivityLogItem />

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, isLoading && { opacity: 0.7 }]} onPress={handleSaveNegotiation} disabled={isLoading}>
            <Text style={styles.btnPrimaryText}>{isLoading ? 'Saving...' : 'Save Negotiation'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSelectDate={setClosingDate}
      />
    </View>
  );
};

export const RecordBookingScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const lead = route.params?.lead;

  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [bookingDate, setBookingDate] = React.useState('');

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Record Booking" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name} phone={lead?.phone} />

        <SectionTitle title="Property Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Project <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Apex Grand Residency</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Available Unit <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Select a Unit...</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
          <Text style={styles.helperText}>Units filter automatically by project selection.</Text>
        </View>

        <SectionTitle title="Financials" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Token Amount (₹) <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.textInput} placeholder="e.g. 100000" keyboardType="numeric" />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Total Unit Cost (₹)</Text>
          <TextInput style={styles.textInput} placeholder="e.g. 7500000" keyboardType="numeric" />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Booking Date <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => setDateModalVisible(true)}>
            <Text style={bookingDate ? styles.pickerText : { color: colors.textSecondary }}>{bookingDate || 'Select Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <SectionTitle title="Broker & Source" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Select Broker <Text style={styles.optional}>(if applicable)</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Direct Walk-in / Digital Lead</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>

        <SectionTitle title="Recent Follow Up Detail" />
        <ActivityLogItem />

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}><Text style={styles.btnCancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => { Alert.alert('Success', 'Booking Recorded'); navigation.goBack(); }}><Text style={styles.btnPrimaryText}>Confirm Booking</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSelectDate={setBookingDate}
      />
    </View>
  );
};

export const DropLeadScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const lead = route.params?.lead;

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Drop Lead" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name} phone={lead?.phone} />

        <SectionTitle title="Drop Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Reason for Drop <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Select Reason</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>

        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Additional Remarks / Feedback</Text>
          <TextInput style={[styles.textInput, { height: 120 }]} placeholder="Explain the specific reason in detail so marketing/management can analyze..." multiline textAlignVertical="top" />
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}><Text style={styles.btnCancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.error }]} onPress={() => { Alert.alert('Success', 'Lead Dropped'); navigation.goBack(); }}><Text style={styles.btnPrimaryText}>Mark as Dropped</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.m, paddingBottom: spacing.xxl },

  leadInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, marginBottom: spacing.l, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.primary },
  leadInfoTextContainer: { flex: 1 },
  leadName: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text },
  leadPhone: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },

  sectionTitleText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.m, marginTop: spacing.s },

  formGroupSingle: { marginBottom: spacing.m },
  inputLabel: { fontSize: typography.sizes.s, fontWeight: typography.weights.bold, color: colors.textSecondary, marginBottom: 8 },
  required: { color: colors.error },
  optional: { fontWeight: 'normal', color: colors.textMuted },
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.m, paddingVertical: 12, fontSize: typography.sizes.m, color: colors.text, backgroundColor: colors.surface },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  pickerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.m, paddingVertical: 14, backgroundColor: colors.surface },
  pickerText: { fontSize: typography.sizes.m, color: colors.text },
  helperText: { fontSize: 11, color: colors.textMuted, marginTop: 4, marginLeft: 2 },

  activityCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.m, marginBottom: spacing.l },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  activityType: { fontSize: typography.sizes.s, fontWeight: typography.weights.bold, color: colors.text },
  activityDate: { fontSize: typography.sizes.xs, color: colors.textMuted },
  activityRemark: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.s, lineHeight: 20 },
  activityFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.s, gap: 6 },
  activityLogger: { fontSize: typography.sizes.xs, color: colors.textMuted },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.l, marginBottom: spacing.xl },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center' },
  btnCancelText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text },
  btnPrimary: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' },
  btnPrimaryText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.surface },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.m },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.m },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionMenuText: { fontSize: typography.sizes.m, color: colors.text },
});
