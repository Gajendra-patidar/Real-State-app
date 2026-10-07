import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
import { useAuth } from '../../hooks/useAuth';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveReportsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await salesExecutiveApi.getSummaryReports();
      console.log('Reports fetched:', response.data || response);
      setData(response.data || response);
    } catch (error) {
      console.log('Error fetching reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Reports & Analytics" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
        ) : (
          <>
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
            <Text style={styles.statValue}>{data?.leads?.total || 0}</Text>
            <Text style={styles.statSub}>Conversions: {data?.leads?.converted || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SITE VISITS CONDUCTED</Text>
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>{data?.site_visits || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Scheduled & Conducted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL UNIT BOOKINGS</Text>
            <Text style={[styles.statValue, {color: '#10B981'}]}>{data?.bookings?.total || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Pending: {data?.bookings?.pending || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOKEN REVENUE COLLECTED</Text>
            <Text style={[styles.statValue, {color: '#A855F7'}]}>₹{data?.bookings?.booking_amount || 0}</Text>
            <Text style={[styles.statSub, {color: '#A855F7'}]}>Token Payments</Text>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Sales Executive Performance Breakdown</Text>
          
          <View style={styles.perfRow}>
            <View style={styles.perfUser}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{(data?.executive?.name || user?.name || 'S')[0]}</Text></View>
              <View>
                <Text style={styles.perfName}>{data?.executive?.name || user?.name || 'Sales Executive'}</Text>
                <Text style={styles.perfEmail}>{data?.executive?.email || user?.email || 'sales@company.com'}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.perfStats}>
            <View style={styles.perfStatCol}><Text style={styles.perfStatVal}>{data?.leads?.total || 0}</Text><Text style={styles.perfStatLbl}>Assigned</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>{data?.site_visits || 0}</Text><Text style={styles.perfStatLbl}>Visits</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#10B981'}]}>{data?.bookings?.total || 0}</Text><Text style={styles.perfStatLbl}>Bookings</Text></View>
            <View style={styles.perfStatCol}>
              <View style={styles.rateBadge}><Text style={styles.rateBadgeText}>{data?.leads?.total ? Math.round((data.leads.converted || 0) / data.leads.total * 100) : 0}%</Text></View>
              <Text style={styles.perfStatLbl}>Rate</Text>
            </View>
          </View>
          
        </View>

      </>
        )}
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
  statValue: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 4 },
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
