const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove chatTab
  content = content.replace(/  const \[chatTab, setChatTab\] = useState<'direct' \| 'group'>\('direct'\);\n/g, '');

  // Update displayedChats
  const oldFilter = `const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (chatTab === 'direct' && isGroup) return false;
    if (chatTab === 'group' && !isGroup) return false;
    
    return matchesSearch;
  });`;

  const newFilter = `const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'Direct' && isGroup) return false;
    if (activeFilter === 'Groups' && !isGroup) return false;
    
    return matchesSearch;
  });`;

  content = content.replace(oldFilter, newFilter);

  fs.writeFileSync(file, content);
}

fix('src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx');
fix('src/screens/manager/ManagerTeamChatScreen.tsx');
console.log('Fixed filters');
