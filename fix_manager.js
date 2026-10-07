const fs = require('fs');
const file = 'src/screens/manager/ManagerTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `const renderChatCard = ({ item, index }: { item: any, index: number }) => (`;
const insertStr = `const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'Direct' && isGroup) return false;
    if (activeFilter === 'Groups' && !isGroup) return false;
    
    return matchesSearch;
  });

  const renderChatCard = ({ item, index }: { item: any, index: number }) => (`;

if (content.includes(targetStr) && !content.includes('displayedChats')) {
  content = content.replace(targetStr, insertStr);
}

// FlatList data prop
content = content.replace(`data={activeChats}`, `data={displayedChats}`);

fs.writeFileSync(file, content);
