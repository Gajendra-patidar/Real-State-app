import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useResponsive } from '../../hooks/useResponsive';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
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

  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [currentDateTarget, setCurrentDateTarget] = React.useState<'visit' | 'followup' | null>(null);
  const [visitDate, setVisitDate] = React.useState('');
  const [followupDate, setFollowupDate] = React.useState('');

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Schedule Site Visit" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name} phone={lead?.phone} />
        
        <SectionTitle title="Primary Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Project <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Apex Grand Residency</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Scheduled Date <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => { setCurrentDateTarget('visit'); setDateModalVisible(true); }}>
            <Text style={visitDate ? styles.pickerText : {color: colors.textSecondary}}>{visitDate || 'Select Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Site Visited By <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>Priya Nair (Sales Manager 1)</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Pickup Location <Text style={styles.optional}>(Optional)</Text></Text>
          <TextInput style={styles.textInput} placeholder="e.g. Client Office / Home" />
        </View>

        <SectionTitle title="Broker Involvement" />
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
        </View>

        <SectionTitle title="Notes & Remarks" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Visit Description</Text>
          <TextInput style={[styles.textInput, styles.textArea]} placeholder="Enter Visit Description" multiline numberOfLines={3} />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Remarks</Text>
          <TextInput style={[styles.textInput, styles.textArea]} placeholder="Any additional remarks..." multiline numberOfLines={2} />
        </View>

        <SectionTitle title="Follow-up" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Inquiry Status <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox}><Text style={styles.pickerText}>SITE VISIT</Text><Icon name="chevron-down" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Next Followup Dt. <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => { setCurrentDateTarget('followup'); setDateModalVisible(true); }}>
            <Text style={followupDate ? styles.pickerText : {color: colors.textSecondary}}>{followupDate || 'Select Follow-up Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}><Text style={styles.btnCancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => { Alert.alert('Success', 'Site Visit Scheduled'); navigation.goBack(); }}><Text style={styles.btnPrimaryText}>Schedule Visit</Text></TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Start Negotiation" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]}>
        <LeadInfoCard name={lead?.first_name} phone={lead?.phone} />
        
        <SectionTitle title="Negotiation Details" />
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Offered Price (₹) <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.textInput} placeholder="e.g. 4500000" keyboardType="numeric" />
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Expected Closing Date <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.pickerBox} onPress={() => setDateModalVisible(true)}>
            <Text style={closingDate ? styles.pickerText : {color: colors.textSecondary}}>{closingDate || 'Select Date'}</Text>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroupSingle}>
          <Text style={styles.inputLabel}>Client Demands / Notes</Text>
          <TextInput style={[styles.textInput, {height: 100}]} placeholder="e.g., Client is asking for complimentary club membership..." multiline textAlignVertical="top" />
        </View>
        
        <SectionTitle title="Recent Follow Up Detail" />
        <ActivityLogItem />

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}><Text style={styles.btnCancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => { Alert.alert('Success', 'Negotiation Saved'); navigation.goBack(); }}><Text style={styles.btnPrimaryText}>Save Negotiation</Text></TouchableOpacity>
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
            <Text style={bookingDate ? styles.pickerText : {color: colors.textSecondary}}>{bookingDate || 'Select Date'}</Text>
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

const REASONS_FOR_DROP = [
  'Budget Issue',
  'Location Mismatch',
  'Bought Elsewhere',
  'Fake / Invalid Number',
  'Not Answering (Multiple Attempts)',
  'Postponed Buying Plan',
  'Competitor Pricing Better',
  'Other'
];

export const DropLeadScreen = () => {
  const { maxWidth } = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const lead = route.params?.lead;

  const [reason, setReason] = useState('Select Reason');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDropLead = async () => {
    if (reason === 'Select Reason') {
      Alert.alert('Error', 'Please select a reason for dropping the lead.');
      return;
    }
    
    if (!lead?.id) {
      Alert.alert('Error', 'Lead ID is missing.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { 
        reason: reason,
        notes: remarks || ""
      };
      
      await salesExecutiveApi.dropLead(lead.id, payload);
      Alert.alert('Success', 'Lead Dropped');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to drop lead. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Drop / Disqualify Lead" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { maxWidth, alignSelf: 'center', width: '100%' }]} keyboardShouldPersistTaps="handled">
        <LeadInfoCard name={lead?.first_name} phone={lead?.phone} />
        
        <SectionTitle title="Drop Details" />
        <View style={[styles.formGroupSingle, { zIndex: 10 }]}>
          <Text style={styles.inputLabel}>Reason for Drop <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity 
            style={styles.pickerBox}
            onPress={() => setShowReasonDropdown(!showReasonDropdown)}
          >
            <Text style={styles.pickerText}>{reason}</Text>
            <Icon name={showReasonDropdown ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {showReasonDropdown && (
            <View style={styles.dropdownListContainer}>
              <TouchableOpacity style={styles.dropdownListItem} onPress={() => { setReason('Select Reason'); setShowReasonDropdown(false); }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {reason === 'Select Reason' && <Icon name="check" size={16} color={colors.text} style={{marginRight: 8}} />}
                  <Text style={[styles.dropdownListText, reason === 'Select Reason' && styles.dropdownListTextActive, { marginLeft: reason === 'Select Reason' ? 0 : 24 }]}>Select Reason</Text>
                </View>
              </TouchableOpacity>
              {REASONS_FOR_DROP.map((r, idx) => (
                <TouchableOpacity key={idx} style={styles.dropdownListItem} onPress={() => { setReason(r); setShowReasonDropdown(false); }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {reason === r && <Icon name="check" size={16} color={colors.text} style={{marginRight: 8}} />}
                    <Text style={[styles.dropdownListText, reason === r && styles.dropdownListTextActive, { marginLeft: reason === r ? 0 : 24 }]}>{r}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <View style={[styles.formGroupSingle, { marginTop: showReasonDropdown ? 350 : 0 }]}>
          <Text style={styles.inputLabel}>Additional Remarks / Feedback</Text>
          <TextInput 
            style={[styles.textInput, {height: 120}]} 
            placeholder="Explain the specific reason in detail so marketing/management can analyze..." 
            multiline 
            textAlignVertical="top" 
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>
        
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()} disabled={isSubmitting}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnPrimary, { backgroundColor: colors.error, opacity: isSubmitting ? 0.7 : 1 }]} 
            onPress={handleDropLead}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.btnPrimaryText}>Mark as Dropped</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.m, paddingBottom: spacing.xxl },
  
  leadInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, marginBottom: spacing.l, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
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
  
  dropdownListContainer: { position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: spacing.s, zIndex: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
  dropdownListItem: { paddingVertical: 12, paddingHorizontal: spacing.m },
  dropdownListText: { fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },
  dropdownListTextActive: { color: colors.primary, fontWeight: 'bold' },

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
});
