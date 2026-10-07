import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Bell, CheckCircle2, MessageSquare, UserPlus, Clock } from 'lucide-react-native';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await salesExecutiveApi.getNotifications();
      let notifs: any[] = [];
      if (Array.isArray(response)) {
        notifs = response;
      } else if (response?.data && Array.isArray(response.data)) {
        notifs = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        notifs = response.data.data;
      } else if (response?.notifications && Array.isArray(response.notifications)) {
        notifs = response.notifications;
      }
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: number | string) => {
    try {
      await salesExecutiveApi.markNotificationRead(Number(id));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read_at: new Date().toISOString() } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const renderIcon = (type: string) => {
    if (!type) return <Bell size={20} color={colors.textMuted} />;
    if (type.includes('assign')) return <UserPlus size={20} color={colors.primary} />;
    if (type.includes('message')) return <MessageSquare size={20} color={colors.info} />;
    if (type.includes('convert') || type.includes('booking')) return <CheckCircle2 size={20} color={colors.success} />;
    if (type.includes('visit') || type.includes('follow') || type.includes('task')) return <Clock size={20} color={colors.warning} />;
    return <Bell size={20} color={colors.textMuted} />;
  };

  const getIconBg = (type: string) => {
    if (!type) return colors.background;
    if (type.includes('assign')) return colors.primary + '15';
    if (type.includes('message')) return colors.infoLight;
    if (type.includes('convert') || type.includes('booking')) return colors.successLight;
    if (type.includes('visit') || type.includes('follow') || type.includes('task')) return colors.warningLight;
    return colors.background;
  };

  const formatTitle = (type: string) => {
    if (!type) return 'Notification';
    const words = type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return words.join(' ');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isRead = item.isRead || (item.read_at !== null && item.read_at !== undefined);
    const title = item.title || item.metadata?.title || item.data?.title || formatTitle(item.activity_type);
    const message = item.message || item.metadata?.message || item.description || item.data?.message || item.body || '';
    const type = item.activity_type || item.type || item.data?.type || 'default';
    const time = item.time || formatDate(item.created_at) || '';

    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !isRead && styles.unreadCard]}
        onPress={() => {
          if (!isRead) markAsRead(item.id);
          setSelectedNotification({ item, title, message, type, time });
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: getIconBg(type) }]}>
          {renderIcon(type)}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !isRead && styles.unreadTitle]} numberOfLines={1} >{title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </View>
        {/* {!isRead && <View style={styles.unreadDot} />} */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        leftIcon="arrow-left" 
        onLeftPress={() => navigation.goBack()} 
        title="Notifications" 
      />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.border} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: selectedNotification ? getIconBg(selectedNotification.type) : '#eee' }]}>
                {selectedNotification && renderIcon(selectedNotification.type)}
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
              <Text style={styles.modalTime}>{selectedNotification?.time}</Text>
              
              <View style={styles.modalDivider} />
              
              <Text style={styles.modalMessage}>{selectedNotification?.message}</Text>
              
              {selectedNotification?.item?.lead && (
                <View style={styles.modalExtraData}>
                  <Text style={styles.modalExtraTitle}>Related Lead</Text>
                  <Text style={styles.modalExtraText}>Name: {selectedNotification.item.lead.name || selectedNotification.item.lead.first_name}</Text>
                  <Text style={styles.modalExtraText}>Phone: {selectedNotification.item.lead.phone}</Text>
                  <Text style={styles.modalExtraText}>Status: {selectedNotification.item.lead.status}</Text>
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity style={styles.modalActionBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalActionBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  listContainer: { padding: spacing.m, gap: spacing.s },
  
  notificationCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: 'transparent' },
  unreadCard: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  
  contentContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: typography.sizes.m, color: colors.text, flex: 1, marginRight: spacing.s, fontWeight: '500' },
  unreadTitle: { fontWeight: 'bold' },
  time: { fontSize: 11, color: colors.textMuted },
  message: { fontSize: typography.sizes.s, color: colors.textSecondary, lineHeight: 18 },
  
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.s, marginTop: 6 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: spacing.m, fontSize: typography.sizes.m, color: colors.textMuted },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.l, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  modalIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  closeButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { fontSize: 16, color: colors.textSecondary, fontWeight: 'bold' },
  modalScroll: { marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.xs },
  modalTime: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  modalDivider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.m },
  modalMessage: { fontSize: typography.sizes.m, color: colors.text, lineHeight: 22, marginBottom: spacing.l },
  modalExtraData: { backgroundColor: '#F8FAFC', padding: spacing.m, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  modalExtraTitle: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.textSecondary, marginBottom: spacing.s, textTransform: 'uppercase' },
  modalExtraText: { fontSize: typography.sizes.m, color: colors.text, marginBottom: 4, fontWeight: '500' },
  modalActionBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalActionBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
