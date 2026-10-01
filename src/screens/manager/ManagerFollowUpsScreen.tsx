import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_DATA = [
  { id: '1', initials: 'HA', name: 'Harshit Yadav', phone: '6260498383', executive: 'Vikram Singh (Executive 1)', stage: 'CONTACTED', time: '20 hours ago' },
  { id: '2', initials: 'HA', name: 'Harshit Yadav', phone: '6260498383', executive: 'Vikram Singh (Executive 1)', stage: 'CONTACTED', time: '21 hours ago' },
  { id: '3', initials: 'HA', name: 'Harshit Yadav', phone: '6260498383', executive: 'Vikram Singh (Executive 1)', stage: 'FOLLOW UP', time: '4 days ago' },
  { id: '4', initials: 'AM', name: 'Amit Kulkarni', phone: '9988776655', executive: 'Vikram Singh (Executive 1)', stage: 'NEGOTIATION', time: '5 days ago' },
];

export const ManagerFollowUpsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const handleActionPress = (item: any) => {
    setSelectedLead(item);
    setIsActionModalVisible(true);
  };

  const renderStatCard = (title: string, count: string, label: string, icon: string, color: string, bgColor: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statBody}>
        <View style={{flex: 1}}>
          <Text style={[styles.statCount, { color }]}>{count} <Text style={styles.statLabel}>{label}</Text></Text>
        </View>
        <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const renderFollowUpCard = ({ item }: { item: typeof MOCK_DATA[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userPhone}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.stage}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon name="account-tie" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.executive}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.btnLogCall}>
          <Icon name="phone" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.btnLogCallText}>Log Call</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtonsRight}>
          <TouchableOpacity style={styles.btnAction} onPress={() => handleActionPress(item)}>
            <Icon name="lightning-bolt" size={18} color="#B45309" />
            <Text style={styles.btnActionText}>Action</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWhatsapp}>
            <Icon name="whatsapp" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const filteredData = MOCK_DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.phone.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Follow-ups & Tasks" />
      
      <View style={styles.headerSubtitleBox}>
        <Text style={styles.pageTitle}>Follow-ups & Sales Executive Tasks</Text>
        <Text style={styles.pageSubtitle}>Pending lead call logs, customer follow-up tasks, and activity history.</Text>
        
        <View style={styles.activeTag}>
          <Icon name="format-list-checks" size={16} color="#B45309" style={{marginRight: 6}} />
          <Text style={styles.activeTagText}>11 Active Follow-up Tasks</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.statsScroll}>
              {renderStatCard('PENDING CALLS', '11', 'Tasks', 'phone-outgoing', '#F59E0B', '#FEF3C7')}
              {renderStatCard('ACTIVE STAFF', '3', 'Staff', 'account', '#10B981', '#D1FAE5')}
              {renderStatCard('LOGGED', '8', 'Logs', 'history', '#6366F1', '#E0E7FF')}
            </View>
            <Text style={styles.listTitle}>Pending Lead Follow-ups Directory</Text>
            
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Customer Name..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={renderFollowUpCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Menu Modal (Reused from ManagerLeadsScreen) */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsActionModalVisible(false)}>
          <View style={[styles.modalContent, { paddingBottom: spacing.l }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Actions for {selectedLead?.name}
              </Text>
              <TouchableOpacity onPress={() => setIsActionModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              <TouchableOpacity 
                style={styles.actionMenuItem} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('ScheduleSiteVisit', { lead: selectedLead });
                }}
              >
                <Icon name="map-marker" size={22} color="#6B4EFF" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Schedule Site Visit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionMenuItem} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('StartNegotiation', { lead: selectedLead });
                }}
              >
                <Icon name="handshake" size={22} color="#F59E0B" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Start Negotiation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionMenuItem} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('RecordBooking', { lead: selectedLead });
                }}
              >
                <Icon name="cash-multiple" size={22} color="#10B981" style={styles.actionMenuIcon} />
                <Text style={styles.actionMenuText}>Record Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionMenuItem, { borderBottomWidth: 0 }]} 
                onPress={() => {
                  setIsActionModalVisible(false);
                  navigation.navigate('DropLead', { lead: selectedLead });
                }}
              >
                <Icon name="thumb-down" size={22} color="#EF4444" style={styles.actionMenuIcon} />
                <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Drop Lead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  
  activeTag: { flexDirection: 'row', backgroundColor: '#FEF3C7', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignItems: 'center' },
  activeTagText: { color: '#B45309', fontWeight: 'bold', fontSize: 12 },

  statsScroll: { flexDirection: 'row', gap: spacing.m, padding: spacing.m, flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '47%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.s, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statTitle: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.s },
  statBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statCount: { fontSize: typography.sizes.xl, fontWeight: '800' },
  statLabel: { fontSize: typography.sizes.s, fontWeight: '600' },
  statIconWrap: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  listTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginHorizontal: spacing.m, marginBottom: spacing.s },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: spacing.m, marginHorizontal: spacing.m, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },

  card: { backgroundColor: colors.surface, borderRadius: 16, marginHorizontal: spacing.m, marginBottom: spacing.m, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  userInfoRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#B45309' },
  userName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  userPhone: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },

  cardDetails: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.m, marginBottom: spacing.m },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: spacing.s },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
  btnLogCall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnLogCallText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.s },
  
  actionButtonsRight: { flexDirection: 'row', gap: spacing.s, alignItems: 'center' },
  btnAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' },
  btnActionText: { color: '#B45309', fontWeight: 'bold', fontSize: typography.sizes.s, marginLeft: 4 },
  btnWhatsapp: { backgroundColor: '#10B981', width: 38, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // Action Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.m },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  modalList: { paddingTop: spacing.m },
  actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionMenuIcon: { width: 30 },
  actionMenuText: { fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },
});
