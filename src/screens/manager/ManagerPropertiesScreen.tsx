import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader} from '../../components/common/AppHeader';
import {propertyApi} from '../../services/api/propertyApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ManagerPropertiesScreen = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getManagerProjects();
      setProjects(response.data || []);
    } catch (error) {
      console.log('Error fetching projects (fallback)', error);
      setProjects([
        { id: 3, name: 'Apex Grand Residency', code: 'APX-GND', location_address: 'Bandra West, Mumbai', status: 'active', total_units_count: 120, available_units_count: 45 },
        { id: 4, name: 'Subh Angan', code: 'SUBH-IND', location_address: 'Indore', status: 'active', total_units_count: 50, available_units_count: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.code}>{item.code}</Text>
        </View>
        <View style={[styles.statusBadge, {backgroundColor: item.status === 'active' ? '#D1FAE5' : '#FEE2E2'}]}>
          <Text style={[styles.statusText, {color: item.status === 'active' ? colors.success : colors.error}]}>
            {(item.status || '').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationRow}>
        <Icon name="map-marker" size={16} color={colors.textSecondary} />
        <Text style={styles.locationText}>{item.location_address}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{item.total_units_count}</Text>
          <Text style={styles.statLabel}>Total Units</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{item.available_units_count}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{item.total_units_count - item.available_units_count}</Text>
          <Text style={styles.statLabel}>Booked/Sold</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Projects Catalog" />
      {loading && projects.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchProjects}
        />
      )}
    </View>
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
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  code: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  locationText: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.s,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
});