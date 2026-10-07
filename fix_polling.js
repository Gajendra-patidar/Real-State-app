const fs = require('fs');
const file = 'src/screens/manager/ManagerChatRoomScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldEffect = `  useEffect(() => {
    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]);`;

const newEffect = `  useEffect(() => {
    let intervalId;
    if (chatId) {
      fetchChatMessages();
      
      // Polling for real-time updates every 3 seconds
      intervalId = setInterval(() => {
        fetchChatMessages();
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [chatId]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync(file, content);
console.log('Added chat polling');
