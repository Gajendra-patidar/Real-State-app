import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ManagerHRMSDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="HRMS Dashboard" />

      <ScrollView contentContainerStyle={{ padding: spacing.m, paddingBottom: insets.bottom + 20 }}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>HRMS Command Center</Text>
          <Text style={styles.bannerSubtitle}>Real-time insights into your workforce's attendance, leaves, and payroll.</Text>
        </View>

        {/* My Shift Card */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
            <Text style={styles.shiftTitle}>MY SHIFT</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>Wed, Sep 30, 2026</Text>
            </View>
          </View>
          
          <Text style={styles.shiftStatus}>Off the clock</Text>
          <Text style={styles.shiftDesc}>Head over to the Attendance page to start your shift.</Text>

          <TouchableOpacity style={styles.shiftBtn} onPress={() => {}}>
            <Icon name="account-clock" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.shiftBtnText}>Go to Attendance Page</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Card */}
        <View style={styles.actionsCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m}}>
            <Icon name="lightning-bolt" size={20} color="#EAB308" style={{marginRight: 8}} />
            <Text style={styles.actionsTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtnLeave}>
              <Icon name="calendar-plus" size={32} color="#4F46E5" style={{marginBottom: 8}} />
              <Text style={styles.actionBtnLeaveText}>Leave Management</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnSalary}>
              <Icon name="file-document-outline" size={32} color="#059669" style={{marginBottom: 8}} />
              <Text style={styles.actionBtnSalaryText}>Salary Slips</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  banner: {
    backgroundColor: '#312E81', // Dark blue
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  bannerSubtitle: { fontSize: typography.sizes.s, color: '#C7D2FE', lineHeight: 20 },

  shiftCard: {
    backgroundColor: '#111827', // Dark gray/black
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  shiftHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  shiftTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1 },
  dateBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dateBadgeText: { fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#D1D5DB' },
  shiftStatus: { fontSize: 28, fontWeight: 'bold', color: '#FBBF24', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 8 },
  shiftDesc: { fontSize: typography.sizes.s, color: '#9CA3AF', marginBottom: spacing.l },
  shiftBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12 },
  shiftBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },

  actionsCard: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  actionsTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  actionsRow: { flexDirection: 'row', gap: spacing.m },
  
  actionBtnLeave: { flex: 1, backgroundColor: '#EEF2FF', paddingVertical: spacing.l, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0E7FF' },
  actionBtnLeaveText: { color: '#4F46E5', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  
  actionBtnSalary: { flex: 1, backgroundColor: '#ECFDF5', paddingVertical: spacing.l, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1FAE5' },
  actionBtnSalaryText: { color: '#059669', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
});
