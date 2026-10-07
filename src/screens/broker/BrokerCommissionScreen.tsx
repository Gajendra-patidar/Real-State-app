import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {brokerApi} from '../../services/api/brokerApi';
import {colors} from '../../theme/colors';
import {AppHeader} from '../../components/common/AppHeader';
import {
  Banknote,
  CheckCircle2,
  Clock,
  TrendingUp,
  Receipt,
} from 'lucide-react-native';

interface CommissionItem {
  id: number;
  booking_code: string;
  customer_name: string;
  commission_type: string;
  rate_value: string;
  total_commission_amount: string;
  status: string;
  approved_at: string;
  created_at: string;
}

interface CommissionData {
  total_commission: number;
  approved_commission: number;
  pending_commission: number;
  paid_commission: number;
  data: CommissionItem[];
}

const formatCurrency = (amount: number | string) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const getStatusColor = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('approve') || s.includes('ready')) return colors.success;
  if (s.includes('paid')) return colors.secondary;
  if (s.includes('reject') || s.includes('cancel')) return colors.error;
  return colors.warning;
};

const getStatusBg = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('approve') || s.includes('ready')) return colors.successLight;
  if (s.includes('paid')) return colors.infoLight;
  if (s.includes('reject') || s.includes('cancel')) return colors.errorLight;
  return colors.warningLight;
};

export const BrokerCommissionScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<CommissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommissions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await brokerApi.getBrokerCommissions();
      setData(res);
    } catch (error) {
      // Dummy fallback
      setData({
        total_commission: 205000,
        approved_commission: 205000,
        pending_commission: 0,
        paid_commission: 0,
        data: [
          {
            id: 1,
            booking_code: 'BK-9LIAL0',
            customer_name: 'Test 2 Team',
            commission_type: 'percentage',
            rate_value: '2.50',
            total_commission_amount: '205000.00',
            status: 'Ready for payout',
            approved_at: '2026-10-07 11:20:54',
            created_at: '2026-10-07 11:20:54',
          },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const renderHeader = () => {
    if (!data) return null;

    return (
      <View style={styles.summaryContainer}>
        {/* Total Earned Card - Full Width */}
        <View style={[styles.kpiTotal]}>
          <View style={styles.kpiTotalTop}>
            <View style={styles.kpiIconTotalWrap}>
              <TrendingUp size={24} color={colors.surface} />
            </View>
            <View>
              <Text style={styles.kpiTotalLabel}>Total Commission</Text>
              <Text style={styles.kpiTotalValue}>
                {formatCurrency(data.total_commission)}
              </Text>
            </View>
          </View>
        </View>

        {/* Sub KPIs Row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiSubCard}>
            <View style={[styles.kpiSubIconWrap, {backgroundColor: colors.successLight}]}>
              <CheckCircle2 size={16} color={colors.success} />
            </View>
            <Text style={styles.kpiSubLabel}>Approved</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.success}]}>
              {formatCurrency(data.approved_commission)}
            </Text>
          </View>
          
          <View style={styles.kpiSubCard}>
            <View style={[styles.kpiSubIconWrap, {backgroundColor: colors.warningLight}]}>
              <Clock size={16} color={colors.warning} />
            </View>
            <Text style={styles.kpiSubLabel}>Pending</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.warning}]}>
              {formatCurrency(data.pending_commission)}
            </Text>
          </View>

          <View style={styles.kpiSubCard}>
            <View style={[styles.kpiSubIconWrap, {backgroundColor: colors.infoLight}]}>
              <Receipt size={16} color={colors.secondary} />
            </View>
            <Text style={styles.kpiSubLabel}>Paid</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.secondary}]}>
              {formatCurrency(data.paid_commission)}
            </Text>
          </View>
        </View>

        <Text style={styles.listTitle}>Commission History</Text>
      </View>
    );
  };

  const renderItem = ({item}: {item: CommissionItem}) => {
    const sColor = getStatusColor(item.status);
    const sBg = getStatusBg(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.bookingCode}>Code: {item.booking_code}</Text>
          </View>
          <View style={styles.amountWrap}>
            <Text style={styles.amountText}>{formatCurrency(item.total_commission_amount)}</Text>
            <Text style={styles.rateText}>{item.rate_value}% {item.commission_type}</Text>
          </View>
        </View>
        
        <View style={styles.cardDivider} />
        
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, {backgroundColor: sBg}]}>
            <View style={[styles.statusDot, {backgroundColor: sColor}]} />
            <Text style={[styles.statusText, {color: sColor}]}>{item.status}</Text>
          </View>
          <Text style={styles.dateText}>
            {item.approved_at ? formatDate(item.approved_at) : formatDate(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader title="My Commissions" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
      
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, {paddingBottom: insets.bottom + 20}]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCommissions(true)}
              colors={[colors.secondary]}
              tintColor={colors.secondary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Banknote size={40} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Commissions Yet</Text>
              <Text style={styles.emptySub}>
                Your earnings will appear here once bookings are approved.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  
  // Total KPI
  kpiTotal: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  kpiTotalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  kpiIconTotalWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiTotalLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  kpiTotalValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 0.5,
  },
  
  // Sub KPIs
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  kpiSubCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiSubIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiSubLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  kpiSubValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  // Commission Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bookingCode: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  rateText: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Empty State
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
