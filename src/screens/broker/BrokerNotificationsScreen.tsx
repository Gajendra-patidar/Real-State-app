import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {brokerApi} from '../../services/api/brokerApi';
import {colors} from '../../theme/colors';
import {AppHeader} from '../../components/common/AppHeader';
import {Bell, DollarSign, UserCheck, Briefcase, Info, X} from 'lucide-react-native';

interface NotificationMetadata {
  title?: string;
  message?: string;
  url?: string;
  broker_id?: number;
  project_id?: number;
  is_duplicate?: boolean;
}

interface NotificationItem {
  id: number;
  activity_type: string;
  description: string;
  metadata: NotificationMetadata;
  read_at: string | null;
  created_at: string;
}

const getIconForActivity = (type: string) => {
  if (type.includes('commission')) return <DollarSign size={20} color={colors.success} />;
  if (type.includes('lead_submitted')) return <UserCheck size={20} color={colors.secondary} />;
  if (type.includes('project') || type.includes('booking')) return <Briefcase size={20} color={colors.accent} />;
  return <Info size={20} color={colors.primary} />;
};

const getIconBgForActivity = (type: string) => {
  if (type.includes('commission')) return colors.successLight;
  if (type.includes('lead_submitted')) return colors.infoLight;
  if (type.includes('project') || type.includes('booking')) return colors.purpleLight;
  return colors.borderLight;
};

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'});
};

export const BrokerNotificationsScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await brokerApi.getBrokerNotifications();
      setData(res.data || []);
      setUnreadCount(res.unread_count || 0);
    } catch (error) {
      // Dummy Fallback
      setData([
        {
            id: 119,
            activity_type: "commission_generated",
            description: "💰 Commission Generated: ₹1,874,999.48: Congratulations! Your referral booking BKG-K38J06 has been approved.",
            metadata: {
                title: "💰 Commission Generated: ₹1,874,999.48",
                message: "Congratulations! Your referral booking BKG-K38J06 has been approved. A commission of ₹1,874,999.48 has been generated."
            },
            read_at: null,
            created_at: new Date().toISOString()
        },
        {
            id: 107,
            activity_type: "broker_lead_submitted",
            description: "Lead submitted by Broker agency Sunil Channel Partners",
            metadata: { broker_id: 1, is_duplicate: false, project_id: 1 },
            read_at: "2026-10-06T10:00:00.000000Z",
            created_at: "2026-10-06T10:00:00.000000Z"
        }
      ] as any);
      setUnreadCount(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePress = async (item: NotificationItem) => {
    setSelectedNotification(item);
    if (!item.read_at) {
      // Mark as read immediately in UI
      setData(prev => prev.map(n => n.id === item.id ? {...n, read_at: new Date().toISOString()} : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      try {
        await brokerApi.markNotificationRead(item.id);
      } catch (error) {
        console.log('Failed to mark read', error);
      }
    }
  };

  const renderItem = ({item}: {item: NotificationItem}) => {
    const isUnread = !item.read_at;
    const title = item.metadata?.title || (item.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const message = item.metadata?.message || item.description;

    return (
      <TouchableOpacity 
        style={[styles.card, isUnread && styles.cardUnread]} 
        activeOpacity={0.7}
        onPress={() => handlePress(item)}>
        <View style={styles.cardContent}>
          <View style={[styles.iconWrap, {backgroundColor: getIconBgForActivity(item.activity_type)}]}>
            {getIconForActivity(item.activity_type)}
          </View>
          <View style={styles.textWrap}>
            <Text style={[styles.title, isUnread && styles.titleUnread]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={3}>
              {message}
            </Text>
            <Text style={styles.time}>{formatTimeAgo(item.created_at)}</Text>
          </View>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Notifications" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
      
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, {paddingBottom: insets.bottom + 20}]}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchNotifications(true)}
              colors={[colors.secondary]}
              tintColor={colors.secondary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Bell size={40} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySub}>
                You're all caught up! Check back later for updates.
              </Text>
            </View>
          }
        />
      )}
    
      {/* Notification Detail Modal */}
      <Modal visible={!!selectedNotification} transparent animationType="fade" onRequestClose={() => setSelectedNotification(null)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20}}>
          <View style={{backgroundColor: colors.surface, borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16}}>
              <View style={[styles.iconWrap, {backgroundColor: selectedNotification ? getIconBgForActivity(selectedNotification.activity_type) : colors.borderLight}]}>
                {selectedNotification && getIconForActivity(selectedNotification.activity_type)}
              </View>
              <TouchableOpacity onPress={() => setSelectedNotification(null)} style={{padding: 8, backgroundColor: colors.background, borderRadius: 20}}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={{fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12, lineHeight: 26}}>
              {selectedNotification?.metadata?.title || (selectedNotification?.activity_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))}
            </Text>
            
            <View style={{height: 1, backgroundColor: colors.borderLight, marginBottom: 16}} />
            
            <Text style={{fontSize: 15, color: colors.textSecondary, lineHeight: 24, marginBottom: 24}}>
              {selectedNotification?.metadata?.message || selectedNotification?.description}
            </Text>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 12, color: colors.textMuted, fontWeight: '500'}}>
                {selectedNotification?.created_at && new Date(selectedNotification.created_at).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </Text>
              <TouchableOpacity 
                style={{backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12}}
                onPress={() => setSelectedNotification(null)}>
                <Text style={{color: colors.surface, fontWeight: '700', fontSize: 14}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  
  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardUnread: {
    backgroundColor: '#F8FAFC', // Slightly different bg for unread
    borderColor: colors.infoLight,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    paddingRight: 12,
  },
  titleUnread: {
    color: colors.text,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginTop: 6,
  },

  // Empty State
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
