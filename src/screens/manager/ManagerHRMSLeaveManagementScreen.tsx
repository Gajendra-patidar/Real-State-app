import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
import { DatePickerModal } from '../../components/common/DatePickerModal';

export const ManagerHRMSLeaveManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);
  
  const [leaveType, setLeaveType] = useState('casual leave');
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
  const leaveTypes = ['casual leave', 'sick leave', 'earned leave'];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await salesExecutiveApi.getLeaves();
      if (response && response.data && Array.isArray(response.data)) {
        setLeaves(response.data);
      } else if (Array.isArray(response)) {
        setLeaves(response);
      } else if (response && response.data && Array.isArray(response.data.data)) {
        setLeaves(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
  };

  const handleApplyLeave = async () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Map UI types to backend types if necessary, though backend usually expects 'casual', 'sick', etc.
      let mappedType = 'casual';
      if (leaveType === 'sick leave') mappedType = 'sick';
      if (leaveType === 'earned leave') mappedType = 'earned';

      // The API expects 'yyyy-mm-dd', our datepicker returns 'dd/mm/yyyy'. We need to convert.
      const parseDate = (d: string) => {
        const [day, month, year] = d.split('/');
        return `${year}-${month}-${day}`;
      };

      await salesExecutiveApi.applyLeave({
        leave_type: mappedType,
        start_date: startDate.includes('/') ? parseDate(startDate) : startDate,
        end_date: endDate.includes('/') ? parseDate(endDate) : endDate,
        reason: reason
      });

      Alert.alert('Success', 'Leave request submitted successfully.');
      setIsModalVisible(false);
      
      // Reset form
      setLeaveType('casual leave');
      setStartDate('');
      setEndDate('');
      setReason('');
      
      fetchLeaves();
    } catch (error: any) {
      console.error('Failed to apply leave:', error?.response?.data || error);
      const backendMsg = error?.response?.data?.message || 'Failed to submit leave request';
      const validationErrs = error?.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '';
      Alert.alert('Error', `${backendMsg}\n${validationErrs}`);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Leave Management" />

      <ScrollView contentContainerStyle={{ padding: spacing.m, paddingBottom: insets.bottom + 20 }}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerBreadcrumb}>Home  ›  HRMS  ›  Leave Management</Text>
          <Text style={styles.bannerTitle}>Leave Management</Text>
          <Text style={styles.bannerSubtitle}>Track, approve, and manage staff leave requests seamlessly.</Text>
          
          <TouchableOpacity style={styles.applyBtn} onPress={() => setIsModalVisible(true)}>
            <Icon name="plus" size={20} color="#4F46E5" style={{marginRight: 6}} />
            <Text style={styles.applyBtnText}>Apply for Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Requests Log Card */}
        <View style={styles.logCard}>
          <View style={styles.logCardHeader}>
            <Icon name="calendar-check" size={22} color="#4F46E5" style={{marginRight: 8}} />
            <Text style={styles.logCardTitle}>Leave Requests Log</Text>
          </View>
          
          <View style={styles.divider} />

          {leaves.length > 0 ? (
            leaves.map((item: any, index: number) => (
              <View key={item.id || index} style={{ padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontWeight: 'bold', color: colors.text, textTransform: 'capitalize' }}>{item.leave_type || item.type || 'Leave'}</Text>
                  <Text style={{ fontSize: 12, color: item.status === 'approved' ? '#10B981' : (item.status === 'rejected' ? '#EF4444' : '#F59E0B'), fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {item.status || 'Pending'}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
                  {item.start_date} to {item.end_date}
                </Text>
                {item.reason ? <Text style={{ fontSize: 14, color: colors.textSecondary }}>{item.reason}</Text> : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="beach" size={64} color="#E2E8F0" style={{marginBottom: spacing.m}} />
              <Text style={styles.emptyStateText}>No leave requests found.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Leave Type */}
              <Text style={styles.inputLabel}>Leave Type</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}>
                <Text style={styles.inputText} style={{textTransform: 'capitalize'}}>{leaveType}</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showLeaveTypeDropdown && (
                <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: spacing.l, marginTop: -10 }}>
                  {leaveTypes.map((type) => (
                    <TouchableOpacity key={type} style={{ padding: spacing.m, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }} onPress={() => { setLeaveType(type); setShowLeaveTypeDropdown(false); }}>
                      <Text style={{ textTransform: 'capitalize', color: colors.text }}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Dates */}
              <View style={styles.dateRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TouchableOpacity style={styles.inputBox} onPress={() => setShowStartDatePicker(true)}>
                    <Text style={startDate ? styles.inputText : styles.inputPlaceholder}>{startDate || 'dd/mm/yyyy'}</Text>
                    <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.inputLabel}>End Date</Text>
                  <TouchableOpacity style={styles.inputBox} onPress={() => setShowEndDatePicker(true)}>
                    <Text style={endDate ? styles.inputText : styles.inputPlaceholder}>{endDate || 'dd/mm/yyyy'}</Text>
                    <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Reason */}
              <Text style={styles.inputLabel}>Reason</Text>
              <TextInput 
                style={styles.textArea} 
                placeholder="Please mention the reason..."
                placeholderTextColor={colors.textMuted}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={reason}
                onChangeText={setReason}
              />

              {/* Submit */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleApplyLeave}>
                <Text style={styles.submitBtnText}>Submit Request</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      <DatePickerModal 
        visible={showStartDatePicker} 
        onClose={() => setShowStartDatePicker(false)} 
        onSelectDate={(date) => setStartDate(date)} 
        title="Select Start Date" 
      />
      
      <DatePickerModal 
        visible={showEndDatePicker} 
        onClose={() => setShowEndDatePicker(false)} 
        onSelectDate={(date) => setEndDate(date)} 
        title="Select End Date" 
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  banner: {
    backgroundColor: '#1E1B4B', // Very dark blue/indigo
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerBreadcrumb: { fontSize: 10, color: '#A5B4FC', marginBottom: spacing.m, fontWeight: '600' },
  bannerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  bannerSubtitle: { fontSize: typography.sizes.s, color: '#C7D2FE', lineHeight: 20, marginBottom: spacing.l },
  applyBtn: { flexDirection: 'row', backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: spacing.l, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  applyBtnText: { color: '#4F46E5', fontSize: typography.sizes.m, fontWeight: 'bold' },

  logCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logCardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.m },
  logCardTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  
  emptyStateContainer: { paddingVertical: 80, alignItems: 'center', justifyContent: 'center' },
  emptyStateText: { fontSize: typography.sizes.m, color: colors.textMuted, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalHeader: { padding: spacing.l, paddingBottom: spacing.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  modalBody: { paddingHorizontal: spacing.l, paddingTop: spacing.s },
  
  inputLabel: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#334155', marginBottom: spacing.s },
  inputBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: spacing.m, height: 48, marginBottom: spacing.l },
  inputText: { fontSize: typography.sizes.m, color: colors.text },
  inputPlaceholder: { fontSize: typography.sizes.m, color: colors.textMuted },
  
  dateRow: { flexDirection: 'row', gap: spacing.m },
  dateCol: { flex: 1 },
  
  textArea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: spacing.m, fontSize: typography.sizes.m, color: colors.text, minHeight: 100, marginBottom: spacing.xl },
  
  submitBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },
});
