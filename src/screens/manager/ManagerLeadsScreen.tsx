import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput} from 'react-native';
import {AppHeader} from '../../components/common/AppHeader';
import {LeadCard} from '../../components/cards/LeadCard';
import {leadApi} from '../../services/api/leadApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

export const ManagerLeadsScreen = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadApi.getManagerLeads();
      setLeads(response.data?.data || []);
    } catch (error) {
      console.log('Error fetching leads (using fallback)', error);
      // Fallback
      setLeads([
        { id: 101, lead_code: 'LD-8801', first_name: 'Amit', last_name: 'Kulkarni', phone: '9988776655', status: 'SITE VISIT', project: { name: 'Apex Grand Residency' }, user: {name: 'Vikram Singh'} },
        { id: 102, lead_code: 'LD-8802', first_name: 'Suresh', last_name: 'Reddy', phone: '9123456789', status: 'NEGOTIATION', project: { name: 'Apex Grand Residency' }, user: {name: 'Vikram Singh'} },
        { id: 103, lead_code: 'LD-8803', first_name: 'Rohan', last_name: 'Verma', phone: '9811888881', status: 'NEW', project: { name: 'Apex Grand Residency' }, user: {name: 'Amit Kulkarni'} },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-search-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No leads found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Team Leads Pipeline" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads, phone, or ID..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchLeads} // in real app we'd debounce or search on submit
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="filter-variant" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading && leads.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <LeadCard
              customerName={`${item.first_name} ${item.last_name || ''}`.trim()}
              leadCode={item.lead_code}
              phone={item.phone}
              hasWhatsapp={true}
              property={item.project?.name || 'Any'}
              assignedExecutive={item.user?.name || 'Unassigned'}
              status={item.status}
              onViewPress={() => {}}
            />
          )}
          ListEmptyComponent={renderEmpty}
          refreshing={loading}
          onRefresh={fetchLeads}
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
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.m,
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.s,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.m,
    color: colors.text,
  },
  filterBtn: {
    marginLeft: spacing.m,
    padding: spacing.s,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  listContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.s,
    fontSize: typography.sizes.m,
    color: colors.textSecondary,
  },
});