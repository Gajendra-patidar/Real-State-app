import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { chatApi } from '../../services/api/chatApi';
import { useAuth } from '../../hooks/useAuth';

export const ManagerChatRoomScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  
  const { chatId, name = 'Unknown', role = 'Member', isGroup = false } = route.params || {};
  const initials = name.substring(0, 1).toUpperCase();

  useEffect(() => {
    let intervalId;
    if (chatId) {
      fetchChatMessages();
      
      // Polling for real-time updates every 3 seconds
      intervalId = setInterval(() => {
        fetchChatMessages();
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [chatId]);

  const fetchChatMessages = async () => {
    try {
      const res = await chatApi.getMessages(chatId);
      let msgs = [];
      if (res?.messages && Array.isArray(res.messages)) {
        msgs = res.messages;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        msgs = res.data.data;
      } else if (res?.data && Array.isArray(res.data)) {
        msgs = res.data;
      } else if (Array.isArray(res)) {
        msgs = res;
      }
      // Sort newest-first for inverted FlatList
      msgs.sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at).getTime() || a.id;
        const timeB = new Date(b.created_at || b.updated_at).getTime() || b.id;
        return timeB - timeA;
      });
      setMessages(msgs);
    } catch (error) {
      console.log('Error fetching chat messages', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) return;
    const msgObj = { message: message.trim() };
    setMessage('');
    
    // Optimistic UI update
    const tempId = Date.now();
    setMessages(prev => [{ id: tempId, message: msgObj.message, is_sender: true, created_at: new Date().toISOString(), user_id: user?.id, sender_id: user?.id }, ...prev]);

    try {
      await chatApi.sendMessage(chatId, msgObj);
      fetchChatMessages();
    } catch (error) {
      console.log('Error sending message', error);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    // If the API returns sender_id, compare it to the logged in user's ID
    const isMyMessage = item.is_sender === true || item.sender_id === user?.id || item.user_id === user?.id || item.is_me === true;
    
    return (
      <View style={[{ padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '80%' }, isMyMessage ? { backgroundColor: '#3B82F6', alignSelf: 'flex-end', borderBottomRightRadius: 0 } : { backgroundColor: '#E2E8F0', alignSelf: 'flex-start', borderBottomLeftRadius: 0 }]}>
        <Text style={{ color: isMyMessage ? '#FFF' : '#333' }}>{item.message}</Text>
        {item.created_at && (
          <Text style={{ fontSize: 10, color: isMyMessage ? '#DBEAFE' : '#94A3B8', marginTop: 4, alignSelf: 'flex-end' }}>
            {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) !== 'Invalid Date' ? new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top - 50 : insets.top - 20 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          {isGroup ? (
            <Icon name="account-group" size={20} color="#059669" />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSubtitle}>{isGroup ? 'Group Chat' : role}</Text>
        </View>
        <TouchableOpacity style={styles.infoBtn}>
          <Icon name="dots-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <View style={styles.chatArea}>
        {messages.length === 0 ? (
          <View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>
            <Icon name="chat-processing-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubText}>Send a message to start the conversation.</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => (item.id || Math.random()).toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: spacing.m }}
            inverted={true}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, spacing.m) }]}>
        <TouchableOpacity style={styles.attachBtn}>
          <Icon name="paperclip" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TextInput 
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, message.trim() ? styles.sendBtnActive : {}]} onPress={handleSendMessage}>
          <Icon name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingBottom: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { padding: spacing.m },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: typography.sizes.m, fontWeight: 'bold', color: '#059669' },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },
  infoBtn: { padding: spacing.m },

  chatArea: { flexGrow: 1, padding: spacing.m },
  emptyState: { alignItems: 'center' },
  emptyText: { marginTop: spacing.s, fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.textSecondary },
  emptySubText: { fontSize: typography.sizes.s, color: colors.textMuted },

  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface, paddingHorizontal: spacing.m, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  attachBtn: { padding: spacing.s, marginBottom: 4 },
  textInput: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontSize: typography.sizes.m, color: colors.text, marginHorizontal: spacing.s },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  sendBtnActive: { backgroundColor: '#3B82F6' },
});
