import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const USERS = [
  { id: '1', name: 'Amit Kulkarni (Executive 5)', role: 'Sales Executive', email: 'amit.exec@apexrealty.com' },
  { id: '2', name: 'Anil Verma (Admin)', role: 'Admin', email: 'admin@apexrealty.com' },
  { id: '3', name: 'Anjali Mehta (Sales Manager 3)', role: 'Manager', email: 'anjali.manager@apexrealty.com' },
  { id: '4', name: 'Deepika Roy (Executive 7)', role: 'Sales Executive', email: 'deepika.exec@apexrealty.com' },
];

const ACTIVE_CHATS = [
  { id: 'c1', name: 'Amit Kulkarni (Executive 5)', role: 'Sales Executive', isGroup: false, lastMessage: 'No messages yet' },
  { id: 'c2', name: 'Anil Verma (Admin)', role: 'Admin', isGroup: false, lastMessage: 'No messages yet' },
];

export const ManagerTeamChatScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDirectModalVisible, setIsDirectModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleStartDirectChat = (user: typeof USERS[0]) => {
    setIsDirectModalVisible(false);
    navigation.navigate('ChatRoom', { name: user.name, role: user.role, isGroup: false });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    setIsGroupModalVisible(false);
    navigation.navigate('ChatRoom', { name: groupName, role: 'Group', isGroup: true });
    setGroupName('');
    setSelectedParticipants([]);
  };

  const renderChatCard = ({ item }: { item: typeof ACTIVE_CHATS[0] }) => (
    <TouchableOpacity 
      style={styles.chatCard}
      onPress={() => navigation.navigate('ChatRoom', { name: item.name, role: item.role, isGroup: item.isGroup })}
    >
      <View style={styles.avatar}>
        {item.isGroup ? (
          <Icon name="account-group" size={20} color="#059669" />
        ) : (
          <Text style={styles.avatarText}>{item.name.substring(0, 1)}</Text>
        )}
      </View>
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatBadge}>
        <Text style={styles.chatBadgeText}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Team & Broker Chat" />

      <FlatList
        data={ACTIVE_CHATS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.headerSubtitleBox}>
              <Text style={styles.pageTitle}>Team & Broker Chat</Text>
              <Text style={styles.pageSubtitle}>Direct 1-to-1 messaging and team group discussions.</Text>
              
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.btnDirect} onPress={() => setIsDirectModalVisible(true)}>
                  <Icon name="account-plus" size={16} color="#059669" style={{marginRight: 6}} />
                  <Text style={styles.btnDirectText}>New Direct Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnGroup} onPress={() => setIsGroupModalVisible(true)}>
                  <Icon name="account-group" size={16} color="#FFF" style={{marginRight: 6}} />
                  <Text style={styles.btnGroupText}>Create Group Chat</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chats..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.filtersContainer}>
              {['All', 'Direct', 'Groups'].map(filter => (
                <TouchableOpacity 
                  key={filter} 
                  style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={renderChatCard}
      />

      {/* Start Direct Chat Modal */}
      <Modal visible={isDirectModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="account-plus" size={24} color="#059669" style={{marginRight: 8}} />
                <Text style={styles.modalTitle}>Start Direct Chat</Text>
              </View>
              <TouchableOpacity onPress={() => setIsDirectModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              {USERS.map(user => (
                <TouchableOpacity key={user.id} style={styles.userListItem} onPress={() => handleStartDirectChat(user)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRoleEmail}>{user.role} • {user.email}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Group Chat Modal */}
      <Modal visible={isGroupModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="account-group" size={24} color="#4F46E5" style={{marginRight: 8}} />
                <Text style={styles.modalTitle}>Create Group Chat</Text>
              </View>
              <TouchableOpacity onPress={() => setIsGroupModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              
              <Text style={styles.inputLabel}>GROUP NAME</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="e.g. Sales Team Alpha"
                placeholderTextColor={colors.textMuted}
                value={groupName}
                onChangeText={setGroupName}
              />

              <Text style={styles.inputLabel}>SELECT PARTICIPANTS</Text>
              <View style={styles.participantsBox}>
                {USERS.map(user => (
                  <TouchableOpacity key={user.id} style={styles.participantItem} onPress={() => toggleParticipant(user.id)}>
                    <View style={[styles.checkbox, selectedParticipants.includes(user.id) && styles.checkboxActive]}>
                      {selectedParticipants.includes(user.id) && <Icon name="check" size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.participantName}>{user.name}</Text>
                    <Text style={styles.participantRole}>({user.role})</Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsGroupModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitBtn, !groupName.trim() && {opacity: 0.5}]} onPress={handleCreateGroup}>
                <Text style={styles.submitBtnText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerSubtitleBox: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  
  actionButtonsRow: { flexDirection: 'row', gap: spacing.m },
  btnDirect: { flex: 1, flexDirection: 'row', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnDirectText: { color: '#059669', fontSize: typography.sizes.s, fontWeight: 'bold' },
  btnGroup: { flex: 1, flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnGroupText: { color: '#FFF', fontSize: typography.sizes.s, fontWeight: 'bold' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, paddingHorizontal: spacing.m, marginHorizontal: spacing.m, marginTop: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 40, fontSize: typography.sizes.m, color: colors.text },

  filtersContainer: { flexDirection: 'row', backgroundColor: '#F8FAFC', marginHorizontal: spacing.m, marginTop: spacing.m, marginBottom: spacing.s, borderRadius: 8, padding: 4 },
  filterPill: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  filterPillActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  filterText: { fontSize: typography.sizes.s, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.text },

  chatCard: { flexDirection: 'row', padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center', backgroundColor: colors.surface },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  avatarText: { fontSize: typography.sizes.l, fontWeight: 'bold', color: '#059669' },
  chatDetails: { flex: 1 },
  chatName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  chatLastMessage: { fontSize: typography.sizes.s, color: colors.textMuted },
  chatBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  chatBadgeText: { fontSize: 10, fontWeight: 'bold', color: colors.textSecondary },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  userListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  userName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  userRoleEmail: { fontSize: typography.sizes.s, color: colors.textMuted },

  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, marginTop: spacing.m, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, fontSize: typography.sizes.m, color: colors.text },
  
  participantsBox: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.s },
  participantItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: colors.textMuted, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  participantName: { fontSize: typography.sizes.m, fontWeight: '600', color: colors.text, marginRight: 6 },
  participantRole: { fontSize: typography.sizes.s, color: colors.textMuted },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.m, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '700' },
  submitBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
