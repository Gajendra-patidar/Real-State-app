const fs = require('fs');
const file = 'src/screens/manager/ManagerTeamChatScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /  const renderChatCard = \(\{ item, index \}: \{ item: any, index: number \}\) => \(/g;

const insertStr = `  const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'Direct' && isGroup) return false;
    if (activeFilter === 'Groups' && !isGroup) return false;
    
    return matchesSearch;
  });

  const renderChatCard = ({ item, index }: { item: any, index: number }) => (`;

content = content.replace(regex, insertStr);
content = content.replace(/data=\{activeChats\}/g, `data={displayedChats}`);

fs.writeFileSync(file, content);
