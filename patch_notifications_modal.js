const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerNotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import Modal and X icon
if (!content.includes('Modal,')) {
  content = content.replace(
    'ActivityIndicator,',
    'ActivityIndicator,\n  Modal,'
  );
}
if (!content.includes('X,')) {
  content = content.replace(
    'Briefcase, Info}',
    'Briefcase, Info, X}'
  );
}

// 2. Add selectedNotification state
if (!content.includes('const [selectedNotification')) {
  content = content.replace(
    'const [unreadCount, setUnreadCount] = useState(0);',
    'const [unreadCount, setUnreadCount] = useState(0);\n  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);'
  );
}

// 3. Update handlePress
const oldHandlePress = `const handlePress = async (item: NotificationItem) => {
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
  };`;

const newHandlePress = `const handlePress = async (item: NotificationItem) => {
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
  };`;

content = content.replace(oldHandlePress, newHandlePress);

// 4. Add the Modal JSX at the end of the return statement
const modalJsx = `
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
              {selectedNotification?.metadata?.title || (selectedNotification?.activity_type?.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()))}
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
};`;

content = content.replace(/<\/View>\s*\);\s*};\s*const styles/m, modalJsx + '\n\nconst styles');

fs.writeFileSync(file, content);
