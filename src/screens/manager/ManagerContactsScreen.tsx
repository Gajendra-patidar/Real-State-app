import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader} from '../../components/common/AppHeader';
import {dashboardApi} from '../../services/api/dashboardApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ManagerContactsScreen = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await dashboardApi.getManagerExecutives();
      setTeam(response.data?.data || []);
    } catch (error) {
      console.log('Error fetching team (fallback)', error);
      setTeam([
        { id: 1, name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876000001', role: {name: 'Sales Executive'}, is_active: true },
        { id: 2, name: 'Neha Gupta', email: 'neha@example.com', phone: '9876000002', role: {name: 'Sales Executive'}, is_active: true },
        { id: 3, name: 'Rohan Verma', email: 'rohan@example.com', phone: '9876000003', role: {name: 'Sales Executive'}, is_active: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: any}) => {
    const initials = (item.name || '').substring(0, 2).toUpperCase();
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role?.name}</Text>
          <View style={styles.contactRow}>
            <Icon name="phone" size={14} color={colors.textSecondary} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="email" size={14} color={colors.textSecondary} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, {backgroundColor: item.is_active ? '#D1FAE5' : '#FEE2E2'}]}>
          <Text style={[styles.statusText, {color: item.is_active ? colors.success : colors.error}]}>
            {item.is_active ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Team Roster" />
      {loading && team.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={team}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchTeam}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.m,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  avatarText: {
    color: colors.surface,
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  role: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
});