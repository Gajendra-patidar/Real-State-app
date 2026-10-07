const fs = require('fs');
const file = 'src/screens/manager/ManagerChatRoomScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useAuth')) {
  content = content.replace(
    /import \{ chatApi \} from '\.\.\/\.\.\/services\/api\/chatApi';/,
    "import { chatApi } from '../../services/api/chatApi';\nimport { useAuth } from '../../hooks/useAuth';"
  );
  
  content = content.replace(
    /const insets = useSafeAreaInsets\(\);/,
    "const insets = useSafeAreaInsets();\n  const { user } = useAuth();"
  );
}

const oldRenderMsg = `  const renderMessage = ({ item }: { item: any }) => (
    <View style={[{ padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '80%' }, item.is_sender ? { backgroundColor: '#3B82F6', alignSelf: 'flex-end', borderBottomRightRadius: 0 } : { backgroundColor: '#E2E8F0', alignSelf: 'flex-start', borderBottomLeftRadius: 0 }]}>
      <Text style={{ color: item.is_sender ? '#FFF' : '#333' }}>{item.message}</Text>
    </View>
  );`;

const newRenderMsg = `  const renderMessage = ({ item }: { item: any }) => {
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
  };`;

content = content.replace(oldRenderMsg, newRenderMsg);

fs.writeFileSync(file, content);
console.log('Updated Chat Room with user checking');
