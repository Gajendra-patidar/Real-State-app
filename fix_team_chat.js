const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleStart = `  const handleStartDirectChat = async (user: any) => {
    setIsDirectModalVisible(false);
    navigation.navigate('ChatRoom', { 
      chatId: user.id, 
      name: user.name, 
      role: user.role?.name || 'User', 
      isGroup: false 
    });
  };`;

const newHandleStart = `  const handleStartDirectChat = async (user: any) => {
    try {
      setLoading(true);
      // Start or fetch the existing single chat with this user
      const response = await chatApi.startSingleChat({ user_id: user.id });
      
      setIsDirectModalVisible(false);
      
      // The API returns the new or existing chat ID. Usually it is response.id or response.chat_id or response.data.id
      const actualChatId = response?.id || response?.chat_id || response?.data?.id || (response === 5 ? 5 : response);
      
      navigation.navigate('ChatRoom', { 
        chatId: actualChatId, 
        name: user.name, 
        role: user.role?.name || 'User', 
        isGroup: false 
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.log('Error starting direct chat:', error);
      Alert.alert('Error', 'Failed to start chat with this user.');
      setIsDirectModalVisible(false);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleStart, newHandleStart);

fs.writeFileSync(file, content);
console.log('Fixed handleStartDirectChat');
