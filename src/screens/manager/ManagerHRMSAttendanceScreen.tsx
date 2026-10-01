import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_ATTENDANCE = [
  { id: '1', name: 'Priya Nair', role: 'Manager', status: 'Absent', checkIn: 'Null', checkOut: 'Null', shift: '9 am - 6 pm', worked: '0 hr 00 min' },
  { id: '2', name: 'Vikram Singh', role: 'Sales Executive', status: 'Absent', checkIn: 'Null', checkOut: 'Null', shift: '9 am - 6 pm', worked: '0 hr 00 min' },
  { id: '3', name: 'Neha Gupta', role: 'Sales Executive', status: 'Absent', checkIn: 'Null', checkOut: 'Null', shift: '9 am - 6 pm', worked: '0 hr 00 min' },
  { id: '4', name: 'Rohan Verma', role: 'Sales Executive', status: 'Absent', checkIn: 'Null', checkOut: 'Null', shift: '9 am - 6 pm', worked: '0 hr 00 min' },
];

export const ManagerHRMSAttendanceScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isClockedIn, setIsClockedIn] = useState(false);

  const renderStatBox = (label: string, value: string, color: string) => (
    <View style={[styles.statBox, { borderTopColor: color }]}>
      <Text style={styles.statBoxLabel}>{label}</Text>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
    </View>
  );

  const renderEmployeeCard = ({ item }: { item: typeof MOCK_ATTENDANCE[0] }) => {
    const isAbsent = item.status === 'Absent';
    const initials = item.name.split(' ').map(n => n[0]).join('');

    return (
      <View style={styles.employeeCard}>
        <View style={styles.empHeader}>
          <View style={styles.empProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.empName}>{item.name}</Text>
              <Text style={styles.empRole}>{item.role}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isAbsent ? styles.statusAbsent : styles.statusPresent]}>
            <Text style={[styles.statusText, isAbsent ? {color: '#EF4444'} : {color: '#059669'}]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Check In</Text>
            <Text style={styles.gridValue}>{item.checkIn}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Check Out</Text>
            <Text style={styles.gridValue}>{item.checkOut}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Shift</Text>
            <View style={styles.shiftBadge}>
              <Text style={styles.shiftBadgeText}>{item.shift}</Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Worked</Text>
            <Text style={styles.gridValue}>{item.worked}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Attendance Tracking" />

      <FlatList
        data={MOCK_ATTENDANCE}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            {/* Clock-In Banner */}
            <View style={styles.clockBanner}>
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerTitle}>MY DAILY SHIFT</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>Wed, Sep 30, 2026</Text>
                </View>
              </View>

              <Text style={styles.clockStatus}>{isClockedIn ? 'On the clock' : 'Off the clock'}</Text>
              <Text style={styles.clockDesc}>Click below to start today's attendance.</Text>

              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Office Desk</Text>
                <Icon name="chevron-down" size={20} color="#D1FAE5" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.clockBtn, isClockedIn ? {backgroundColor: '#EF4444'} : {backgroundColor: '#FFF'}]}
                onPress={() => setIsClockedIn(!isClockedIn)}
              >
                <Icon name="clock-outline" size={20} color={isClockedIn ? '#FFF' : '#047857'} style={{marginRight: 8}} />
                <Text style={[styles.clockBtnText, isClockedIn ? {color: '#FFF'} : {color: '#047857'}]}>
                  {isClockedIn ? 'End Shift (Clock-Out)' : 'Start Shift (Clock-In)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Daily Summary */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Summary</Text>
              <Text style={styles.sectionSubtitle}>Showing logs for: 30 Sep 2026</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {renderStatBox('Total Emp', '5', '#4B5563')}
              {renderStatBox('Present', '0', '#059669')}
              {renderStatBox('Late', '0', '#F59E0B')}
              {renderStatBox('Absent', '5', '#EF4444')}
              {renderStatBox('Leave', '0', '#8B5CF6')}
              {renderStatBox('Offday', '0', '#6B7280')}
            </ScrollView>

            {/* List Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Attendance List</Text>
            </View>
          </>
        }
        renderItem={renderEmployeeCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  clockBanner: {
    backgroundColor: '#065F46', // Deep green
    margin: spacing.m,
    padding: spacing.l,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  bannerTitle: { fontSize: 12, fontWeight: '800', color: '#A7F3D0', letterSpacing: 1 },
  dateBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dateBadgeText: { fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#D1FAE5', fontWeight: 'bold' },
  clockStatus: { fontSize: 32, fontWeight: 'bold', color: '#FCD34D', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 4 },
  clockDesc: { fontSize: typography.sizes.s, color: '#A7F3D0', marginBottom: spacing.l },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: spacing.m, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#047857', marginBottom: spacing.m },
  dropdownText: { color: '#FFF', fontSize: typography.sizes.m },
  clockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 8 },
  clockBtnText: { fontSize: typography.sizes.m, fontWeight: 'bold' },

  sectionHeader: { marginHorizontal: spacing.m, marginTop: spacing.m, marginBottom: spacing.s },
  sectionTitle: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text },
  sectionSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },

  statsScroll: { paddingHorizontal: spacing.m, paddingBottom: spacing.m, gap: spacing.s },
  statBox: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, minWidth: 90, borderTopWidth: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statBoxLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 4 },
  statBoxValue: { fontSize: 24, fontWeight: '900' },

  employeeCard: { backgroundColor: colors.surface, marginHorizontal: spacing.m, marginBottom: spacing.m, borderRadius: 12, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  empProfile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  empName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  empRole: { fontSize: typography.sizes.s, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusAbsent: { backgroundColor: '#FEE2E2' },
  statusPresent: { backgroundColor: '#ECFDF5' },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.s, borderWidth: 1, borderColor: colors.border },
  gridItem: { width: '50%', padding: spacing.s },
  gridLabel: { fontSize: 10, color: colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  gridValue: { fontSize: typography.sizes.s, color: colors.text, fontWeight: '500' },
  shiftBadge: { backgroundColor: '#EEF2FF', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#E0E7FF' },
  shiftBadgeText: { fontSize: 9, color: '#4F46E5', fontWeight: 'bold' },
});
