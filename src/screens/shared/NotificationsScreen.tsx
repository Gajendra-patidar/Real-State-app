import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Bell, CheckCircle2, MessageSquare, UserPlus, Clock } from 'lucide-react-native';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'lead_assigned', title: 'New Lead Assigned', message: 'Vikram Singh has assigned you a new lead (LD-8801).', time: '10 mins ago', isRead: false },
  { id: '2', type: 'message', title: 'New Message', message: 'You have a new direct message from Priya Nair regarding Apex Grand Residency.', time: '1 hour ago', isRead: false },
  { id: '3', type: 'system', title: 'System Update', message: 'Scheduled maintenance will occur tonight at 2 AM.', time: '5 hours ago', isRead: true },
  { id: '4', type: 'task', title: 'Follow-up Reminder', message: 'Reminder: Call Suresh Reddy at 4 PM today.', time: 'Yesterday', isRead: true },
  { id: '5', type: 'lead_converted', title: 'Lead Converted!', message: 'Congratulations! Lead LD-7705 has been marked as booked.', time: '2 days ago', isRead: true },
];

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'lead_assigned': return <UserPlus size={20} color={colors.primary} />;
      case 'message': return <MessageSquare size={20} color={colors.info} />;
      case 'lead_converted': return <CheckCircle2 size={20} color={colors.success} />;
      case 'task': return <Clock size={20} color={colors.warning} />;
      default: return <Bell size={20} color={colors.textMuted} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'lead_assigned': return colors.primary + '15';
      case 'message': return colors.infoLight;
      case 'lead_converted': return colors.successLight;
      case 'task': return colors.warningLight;
      default: return colors.background;
    }
  };

  const renderItem = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
        {renderIcon(item.type)}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader 
        leftIcon="arrow-left" 
        onLeftPress={() => navigation.goBack()} 
        title="Notifications" 
        rightIcon="check-all"
        onRightPress={markAllAsRead}
      />
      
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.m, paddingBottom: insets.bottom + 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.textMuted} style={{opacity: 0.5, marginBottom: spacing.m}} />
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF', // Very light blue
    borderColor: '#E0F2FE',
    borderWidth: 1,
  },
  
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.sizes.m,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '800',
    color: colors.primary,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 8,
  },
  message: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
  },
  
  emptyState: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.m,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
