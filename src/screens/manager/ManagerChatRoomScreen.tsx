import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const ManagerChatRoomScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  
  const { name = 'Unknown', role = 'Member', isGroup = false } = route.params || {};
  const initials = name.substring(0, 1).toUpperCase();

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
      <ScrollView contentContainerStyle={styles.chatArea}>
        <View style={styles.emptyState}>
          <Icon name="chat-processing-outline" size={48} color={colors.border} />
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubText}>Send a message to start the conversation.</Text>
        </View>
      </ScrollView>

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
        <TouchableOpacity style={[styles.sendBtn, message.trim() ? styles.sendBtnActive : {}]}>
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

  chatArea: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.m },
  emptyState: { alignItems: 'center' },
  emptyText: { marginTop: spacing.s, fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.textSecondary },
  emptySubText: { fontSize: typography.sizes.s, color: colors.textMuted },

  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface, paddingHorizontal: spacing.m, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  attachBtn: { padding: spacing.s, marginBottom: 4 },
  textInput: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontSize: typography.sizes.m, color: colors.text, marginHorizontal: spacing.s },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  sendBtnActive: { backgroundColor: '#3B82F6' },
});
