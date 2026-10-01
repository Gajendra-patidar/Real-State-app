import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ManagerHRMSLeaveManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Leave Management" />

      <ScrollView contentContainerStyle={{ padding: spacing.m, paddingBottom: insets.bottom + 20 }}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerBreadcrumb}>Home  ›  HRMS  ›  Leave Management</Text>
          <Text style={styles.bannerTitle}>Leave Management</Text>
          <Text style={styles.bannerSubtitle}>Track, approve, and manage staff leave requests seamlessly.</Text>
          
          <TouchableOpacity style={styles.applyBtn} onPress={() => {}}>
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

          {/* Empty State */}
          <View style={styles.emptyStateContainer}>
            <Icon name="beach" size={64} color="#E2E8F0" style={{marginBottom: spacing.m}} />
            <Text style={styles.emptyStateText}>No leave requests found.</Text>
          </View>
        </View>

      </ScrollView>
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
});
