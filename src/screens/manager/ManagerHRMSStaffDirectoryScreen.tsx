import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_STAFF = [
  { id: '1', name: 'Vikram Singh', role: 'Sales Executive 1', phone: '+91 98765 43210', email: 'vikram.s@urbanproperty.com', status: 'Active', bg: '#EEF2FF', color: '#4F46E5' },
  { id: '2', name: 'Harshit Yadav', role: 'Sales Executive 2', phone: '+91 87654 32109', email: 'harshit.y@urbanproperty.com', status: 'On Leave', bg: '#FEF3C7', color: '#D97706' },
  { id: '3', name: 'Priya Nair', role: 'Sales Manager', phone: '+91 76543 21098', email: 'priya.n@urbanproperty.com', status: 'Active', bg: '#ECFDF5', color: '#059669' },
  { id: '4', name: 'Rajeev Malhotra', role: 'Director', phone: '+91 65432 10987', email: 'rajeev.m@urbanproperty.com', status: 'Active', bg: '#F3E8FF', color: '#9333EA' },
];

export const ManagerHRMSStaffDirectoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const renderStaffCard = ({ item }: { item: typeof MOCK_STAFF[0] }) => {
    const initials = item.name.split(' ').map(n => n[0]).join('');
    const isActive = item.status === 'Active';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, { backgroundColor: item.bg }]}>
              <Text style={[styles.avatarText, { color: item.color }]}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusLeave]}>
            <View style={[styles.statusDot, isActive ? {backgroundColor: '#059669'} : {backgroundColor: '#D97706'}]} />
            <Text style={[styles.statusText, isActive ? {color: '#059669'} : {color: '#D97706'}]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Icon name="phone-outline" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="email-outline" size={16} color={colors.textSecondary} style={{marginRight: 8}} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="message-text-outline" size={18} color="#4F46E5" style={{marginRight: 6}} />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#ECFDF5', borderColor: '#A7F3D0'}]}>
            <Icon name="phone" size={18} color="#059669" style={{marginRight: 6}} />
            <Text style={[styles.actionBtnText, {color: '#059669'}]}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Staff Directory" />

      <FlatList
        data={MOCK_STAFF}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <Text style={styles.pageTitle}>Company Directory</Text>
              <Text style={styles.pageSubtitle}>Find and contact your team members quickly.</Text>
            </View>

            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, role, or email..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={renderStaffCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 8, paddingHorizontal: spacing.m, margin: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },

  card: { backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: spacing.m, marginBottom: spacing.m, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  profileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  name: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  role: { fontSize: typography.sizes.s, color: colors.textSecondary },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusActive: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusLeave: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.m },
  
  contactInfo: { marginBottom: spacing.m },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  contactText: { fontSize: typography.sizes.s, color: colors.textSecondary },

  actionRow: { flexDirection: 'row', gap: spacing.s },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE' },
  actionBtnText: { fontSize: typography.sizes.s, fontWeight: 'bold', color: '#4F46E5' },
});
