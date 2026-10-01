import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveReportsScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Reports & Analytics" />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerBox}>
          <Text style={styles.title}>Executive Sales & Analytics Report</Text>
          <Text style={styles.subtitle}>Real-time pipeline performance & conversions</Text>
          <View style={styles.syncBadge}>
            <Icon name="lightning-bolt" size={14} color="#4F46E5" />
            <Text style={styles.syncText}>Live Real-time Sync Active</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL CRM LEADS</Text>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statSub}>Conversions: 0</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SITE VISITS CONDUCTED</Text>
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>0</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Scheduled & Conducted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL UNIT BOOKINGS</Text>
            <Text style={[styles.statValue, {color: '#10B981'}]}>1</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Units Secured</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOKEN REVENUE COLLECTED</Text>
            <Text style={[styles.statValue, {color: '#A855F7'}]}>₹100,000</Text>
            <Text style={[styles.statSub, {color: '#A855F7'}]}>Token Payments</Text>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Sales Executive Performance Breakdown</Text>
          
          <View style={styles.perfRow}>
            <View style={styles.perfUser}>
              <View style={styles.avatar}><Text style={styles.avatarText}>VI</Text></View>
              <View>
                <Text style={styles.perfName}>Vikram Singh</Text>
                <Text style={styles.perfEmail}>sales@apexrealty.com</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.perfStats}>
            <View style={styles.perfStatCol}><Text style={styles.perfStatVal}>2</Text><Text style={styles.perfStatLbl}>Assigned</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>0</Text><Text style={styles.perfStatLbl}>Visits</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#10B981'}]}>0</Text><Text style={styles.perfStatLbl}>Bookings</Text></View>
            <View style={styles.perfStatCol}>
              <View style={styles.rateBadge}><Text style={styles.rateBadgeText}>0%</Text></View>
              <Text style={styles.perfStatLbl}>Rate</Text>
            </View>
          </View>
          
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: spacing.m },
  
  headerBox: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  syncBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: '#C7D2FE' },
  syncText: { color: '#4F46E5', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m, marginBottom: spacing.m },
  statCard: { width: '47%', backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, marginBottom: spacing.s },
  statValue: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 4 },
  statSub: { fontSize: 10, fontWeight: 'bold', color: '#10B981' },

  breakdownCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl },
  breakdownTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.m },
  
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  perfUser: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 12 },
  perfName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  perfEmail: { fontSize: 10, color: colors.textMuted },
  
  perfStats: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.m, justifyContent: 'space-between' },
  perfStatCol: { alignItems: 'center' },
  perfStatVal: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  perfStatLbl: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase' },
  rateBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12, marginBottom: 4 },
  rateBadgeText: { fontSize: 12, fontWeight: 'bold', color: colors.text },
});
