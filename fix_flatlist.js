const fs = require('fs');
const file = 'src/screens/manager/ManagerChatRoomScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update fetchChatMessages to sort newest-first
const oldFetch = `      // Ensure latest message is shown correctly by reversing if backend sends oldest first, or just passing to FlatList
      setMessages(msgs);`;

const newFetch = `      // Sort newest-first for inverted FlatList
      msgs.sort((a, b) => {
        const timeA = new Date(a.created_at || a.updated_at).getTime() || a.id;
        const timeB = new Date(b.created_at || b.updated_at).getTime() || b.id;
        return timeB - timeA;
      });
      setMessages(msgs);`;
content = content.replace(oldFetch, newFetch);

// Update optimistic UI to put new message at the BEGINNING (index 0) because list is inverted
const oldOptimistic = `setMessages(prev => [...prev, { id: tempId, message: msgObj.message, is_sender: true, created_at: new Date().toISOString() }]);`;
const newOptimistic = `setMessages(prev => [{ id: tempId, message: msgObj.message, is_sender: true, created_at: new Date().toISOString(), user_id: user?.id, sender_id: user?.id }, ...prev]);`;
content = content.replace(oldOptimistic, newOptimistic);

// Update FlatList to be inverted
const oldFlatList = `<FlatList
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: spacing.m }}
          />`;

const newFlatList = `<FlatList
            data={messages}
            keyExtractor={item => (item.id || Math.random()).toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: spacing.m }}
            inverted={true}
            showsVerticalScrollIndicator={false}
          />`;
content = content.replace(oldFlatList, newFlatList);

fs.writeFileSync(file, content);
console.log('Fixed chat room sorting and flatlist');
