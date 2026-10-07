import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveBookingsScreen = () => {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await salesExecutiveApi.getBookings();
      setBookings(res?.data?.data || res?.data || []);
    } catch (error) {
      console.log('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending_approval': return '#F59E0B';
      default: return colors.textSecondary;
    }
  };

  const renderBookingCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <Icon name="check-decagram" size={20} color="#10B981" style={{marginRight: 6}}/>
           <Text style={styles.bookingCode}>{item.booking_code}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '1A' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{item.customer_name}</Text>
          <Text style={styles.subValue}>{item.customer_phone}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.label}>Project & Unit</Text>
          <Text style={styles.value}>{item.project?.name}</Text>
          <Text style={styles.subValue}>{item.unit?.unit_number} ({item.unit?.unit_type})</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.label}>Booking Amount</Text>
          <Text style={styles.amount}>₹ {parseFloat(item.booking_amount).toLocaleString('en-IN')}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.label}>Total Value</Text>
          <Text style={styles.totalAmount}>₹ {parseFloat(item.total_unit_cost).toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Bookings" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
      <FlatList
        data={bookings}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderBookingCard}
        contentContainerStyle={bookings.length === 0 ? { flex: 1, padding: spacing.m } : { padding: spacing.m, paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={fetchBookings}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Icon name="file-document-outline" size={48} color={colors.border} />
              <Text style={{marginTop: 10, color: colors.textSecondary}}>No bookings found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m, paddingBottom: spacing.s, borderBottomWidth: 1, borderBottomColor: colors.border },
  bookingCode: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', marginBottom: spacing.m },
  label: { fontSize: typography.sizes.s, color: colors.textMuted, marginBottom: 2 },
  value: { fontSize: typography.sizes.m, fontWeight: '600', color: colors.text },
  subValue: { fontSize: typography.sizes.s, color: colors.textSecondary },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.s, borderRadius: 8 },
  amount: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#10B981' },
  totalAmount: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
});
