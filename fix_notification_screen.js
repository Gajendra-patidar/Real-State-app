const fs = require('fs');
const file = 'src/screens/shared/NotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFetch = `  const fetchNotifications = async () => {
    try {
      const data = await salesExecutiveApi.getNotifications();
      // Assume API returns an array of notifications or { notifications: [...] }
      setNotifications(Array.isArray(data) ? data : data?.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    }
  };`;

const newFetch = `  const fetchNotifications = async () => {
    try {
      const response = await salesExecutiveApi.getNotifications();
      // Safely extract the array whether it's wrapped in data.data (Laravel paginate) or just data
      let notifs = [];
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
  };`;

content = content.replace(oldFetch, newFetch);

// Also update how "isRead" is checked, because laravel typically uses "read_at"
const oldRenderItem = `  const renderItem = ({ item }: { item: any }) => (
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
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title || item.data?.title}</Text>
          <Text style={styles.time}>{item.time || item.created_at}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message || item.data?.message}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );`;

// Wait, the original code had item.title, I'll rewrite the renderItem completely with safer fallback accessors
const safeRenderItem = `  const renderItem = ({ item }: { item: any }) => {
    const isRead = item.isRead || item.read_at !== null && item.read_at !== undefined;
    const title = item.title || item.data?.title || 'Notification';
    const message = item.message || item.data?.message || item.body || '';
    const type = item.type || item.data?.type || 'default';
    const time = item.time || item.created_at || '';

    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !isRead && styles.unreadCard]}
        onPress={() => !isRead ? markAsRead(item.id) : null}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: getIconBg(type) }]}>
          {renderIcon(type)}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !isRead && styles.unreadTitle]}>{title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </View>
        {!isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };`;

// replace old renderItem string with safeRenderItem string
content = content.replace(/  const renderItem = \({ item }: { item: any }\) => \([\s\S]*?\n  \);/, safeRenderItem);

// Also need to update the markAsRead local state update
const oldMarkAsReadState = `setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));`;
const newMarkAsReadState = `setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read_at: new Date().toISOString() } : n));`;
content = content.replace(oldMarkAsReadState, newMarkAsReadState);


fs.writeFileSync(file, content);
console.log('Fixed notification screen arrays and render');
