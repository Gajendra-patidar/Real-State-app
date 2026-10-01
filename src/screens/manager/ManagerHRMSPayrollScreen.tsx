import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ManagerHRMSPayrollScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Payroll & Salary" />

      <ScrollView contentContainerStyle={{ padding: spacing.m, paddingBottom: insets.bottom + 20 }}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerBreadcrumb}>Home  ›  HRMS  ›  Payroll Management</Text>
          <Text style={styles.bannerTitle}>Payroll & Salary Slips</Text>
          <Text style={styles.bannerSubtitle}>Generate, manage, and distribute monthly salary slips for your staff.</Text>
        </View>

        {/* Slips Log Card */}
        <View style={styles.logCard}>
          <View style={styles.logCardHeader}>
            <Icon name="cash-multiple" size={22} color="#059669" style={{marginRight: 8}} />
            <Text style={styles.logCardTitle}>Generated Salary Slips</Text>
          </View>
          
          <View style={styles.divider} />

          {/* Empty State */}
          <View style={styles.emptyStateContainer}>
            <Icon name="file-document-outline" size={64} color="#E2E8F0" style={{marginBottom: spacing.m}} />
            <Text style={styles.emptyStateText}>No salary slips generated yet.</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  banner: {
    backgroundColor: '#065F46', // Deep emerald green
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerBreadcrumb: { fontSize: 10, color: '#A7F3D0', marginBottom: spacing.m, fontWeight: '600' },
  bannerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  bannerSubtitle: { fontSize: typography.sizes.s, color: '#D1FAE5', lineHeight: 20, marginBottom: spacing.s },

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
