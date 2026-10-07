const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update fetchData
const oldFetch = `      console.log('Fetched chats:', chatRes?.data);
      setActiveChats(chatRes?.data || []);`;

const newFetch = `      console.log('Fetched chats:', chatRes);
      let chats = [];
      if (chatRes?.conversations && Array.isArray(chatRes.conversations)) {
        chats = chatRes.conversations;
      } else if (Array.isArray(chatRes)) {
        chats = chatRes;
      } else if (chatRes?.data) {
        chats = chatRes.data;
      }
      setActiveChats(chats);`;
content = content.replace(oldFetch, newFetch);

// Update renderChatCard
const oldRenderCard = `  const renderChatCard = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity 
      style={styles.chatCard}
      onPress={() => navigation.navigate('ChatRoom', { chatId: item.id || item.chat_id || index, name: item.name || item.title || 'Chat', role: item.role || (item.is_group ? 'Group' : 'Direct'), isGroup: item.is_group })}
    >
      <View style={styles.avatar}>
        {item.is_group ? (
          <Icon name="account-group" size={20} color="#059669" />
        ) : (
          <Text style={styles.avatarText}>{(item.name || item.title || 'C').substring(0, 1)}</Text>
        )}
      </View>
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name || item.title || 'Chat'}</Text>
        <Text style={styles.chatLastMessage}>{item.last_message?.message || item.lastMessage || 'No messages yet'}</Text>
      </View>
      <View style={styles.chatBadge}>
        <Text style={styles.chatBadgeText}>{item.role || (item.is_group ? 'Group' : 'Direct')}</Text>
      </View>
    </TouchableOpacity>
  );`;

const newRenderCard = `  const renderChatCard = ({ item, index }: { item: any, index: number }) => {
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
  };`;

content = content.replace(oldRenderCard, newRenderCard);

fs.writeFileSync(file, content);
console.log('Fixed chat screen data mapping');
