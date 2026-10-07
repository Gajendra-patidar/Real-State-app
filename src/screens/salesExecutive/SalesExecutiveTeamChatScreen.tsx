import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';



import { chatApi } from '../../services/api/chatApi';


const USERS = [
  { id: 1, name: 'Amit Kulkarni (Executive 5)', role: {name: 'Sales Executive'}, email: 'amit.exec@apexrealty.com' },
  { id: 2, name: 'Anil Verma (Admin)', role: {name: 'Admin'}, email: 'admin@apexrealty.com' },
  { id: 3, name: 'Anjali Mehta (Manager)', role: {name: 'Manager'}, email: 'anjali.manager@apexrealty.com' },
  { id: 4, name: 'Deepika Roy (Executive 7)', role: {name: 'Sales Executive'}, email: 'deepika.exec@apexrealty.com' },
];

export const SalesExecutiveTeamChatScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>(USERS);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDirectModalVisible, setIsDirectModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chatRes, usersRes] = await Promise.all([
        chatApi.getConversations(),
        chatApi.getUsers()
      ]);
      console.log('Fetched chats:', chatRes);
      let chats = [];
      if (chatRes?.conversations && Array.isArray(chatRes.conversations)) {
        chats = chatRes.conversations;
      } else if (Array.isArray(chatRes)) {
        chats = chatRes;
      } else if (chatRes?.data) {
        chats = chatRes.data;
      }
      setActiveChats(chats);
      setUsersList(usersRes?.data?.data || usersRes?.data || []);
    } catch (error) {
      console.log('Error fetching chat data', error);
      setActiveChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDirectChat = async (user: any) => {
    try {
      setLoading(true);
      // Start or fetch the existing single chat with this user
      const response = await chatApi.startSingleChat({ user_id: user.id });
      
      setIsDirectModalVisible(false);
      
      // The API returns the new or existing chat ID. Usually it is response.id or response.chat_id or response.data.id
      const actualChatId = response?.id || response?.chat_id || response?.data?.id || response;
      
      navigation.navigate('ChatRoom', { 
        chatId: actualChatId, 
        name: user.name, 
        role: user.role?.name || 'User', 
        isGroup: false 
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.log('Error starting direct chat:', error);
      Alert.alert('Error', 'Failed to start chat with this user.');
      setIsDirectModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  
  const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'Direct' && isGroup) return false;
    if (activeFilter === 'Groups' && !isGroup) return false;
    
    return matchesSearch;
  });

  const renderChatCard = ({ item, index }: { item: any, index: number }) => {
    const isGroup = item.type === 'group' || item.is_group;
    const role = item.other_user_role || item.role || (isGroup ? 'Group' : 'Direct');
    const lastMsg = typeof item.last_message === 'string' ? item.last_message : (item.last_message?.message || item.lastMessage || 'No messages yet');
    
    return (
      <TouchableOpacity 
        style={styles.chatCard}
        onPress={() => navigation.navigate('ChatRoom', { chatId: item.id || item.chat_id || index, name: item.name || item.title || 'Chat', role: role, isGroup: isGroup })}
      >
        <View style={styles.avatar}>
          {isGroup ? (
            <Icon name="account-group" size={20} color="#059669" />
          ) : (
            <Text style={styles.avatarText}>{(item.name || item.title || 'C').substring(0, 1).toUpperCase()}</Text>
          )}
        </View>
        
        <View style={styles.chatDetails}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
            <Text style={styles.chatName} numberOfLines={1}>{(item.name || item.title || 'Chat')}</Text>
            {item.last_message_time ? (
              <Text style={{fontSize: 10, color: '#94A3B8'}}>{item.last_message_time}</Text>
            ) : null}
          </View>
          <Text style={styles.chatLastMessage} numberOfLines={1}>{lastMsg}</Text>
        </View>
        
        <View style={{alignItems: 'flex-end', justifyContent: 'center', marginLeft: 8}}>
          <View style={styles.chatBadge}>
            <Text style={styles.chatBadgeText} numberOfLines={1}>{role}</Text>
          </View>
          {item.unread_count > 0 && (
            <View style={{backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, minWidth: 20, alignItems: 'center'}}>
              <Text style={{color: '#FFF', fontSize: 10, fontWeight: 'bold'}}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Team & Broker Chat" />

      <FlatList
        data={displayedChats}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshing={loading}
        onRefresh={fetchData}
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
              {usersList.map(user => (
                <TouchableOpacity key={user.id} style={styles.userListItem} onPress={() => handleStartDirectChat(user)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRoleEmail}>{user.role?.name || 'Executive'} • {user.email}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  chatName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, flex: 1, marginRight: 8 },
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
});
