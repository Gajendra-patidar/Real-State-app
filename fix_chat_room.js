const fs = require('fs');
const file = 'src/screens/manager/ManagerChatRoomScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFetch = `      const res = await chatApi.getMessages(chatId);
      setMessages(res.data?.data || res.data || []);`;

const newFetch = `      const res = await chatApi.getMessages(chatId);
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
      // Ensure latest message is shown correctly by reversing if backend sends oldest first, or just passing to FlatList
      setMessages(msgs);`;

content = content.replace(oldFetch, newFetch);

// Also remove direct APIs from chatApi.ts as requested "remove direct apis it signle api"
fs.writeFileSync(file, content);
console.log('Fixed chat room');
