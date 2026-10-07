const fs = require('fs');

function applyTab(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add state
  const stateSearch = `const [searchQuery, setSearchQuery] = useState('');`;
  const stateReplace = `const [searchQuery, setSearchQuery] = useState('');
  const [chatTab, setChatTab] = useState<'direct' | 'group'>('direct');`;
  
  if (!content.includes('setChatTab')) {
    content = content.replace(stateSearch, stateReplace);
  }

  // Filter logic inside the component body, above render
  const flatListData = `data={activeChats}`;
  
  if (!content.includes('displayedChats')) {
    const listHeaderEnd = `<View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chats..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
`;
    // We will inject a segmented control right after search container
    const newListHeader = `<View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chats..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4, marginTop: 16 }}>
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: chatTab === 'direct' ? '#FFFFFF' : 'transparent', borderRadius: 6, shadowColor: chatTab === 'direct' ? '#000' : 'transparent', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: {width: 0, height: 1} }}
                onPress={() => setChatTab('direct')}
              >
                <Text style={{ fontWeight: chatTab === 'direct' ? 'bold' : 'normal', color: chatTab === 'direct' ? colors.primary : colors.textSecondary }}>Direct</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: chatTab === 'group' ? '#FFFFFF' : 'transparent', borderRadius: 6, shadowColor: chatTab === 'group' ? '#000' : 'transparent', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: {width: 0, height: 1} }}
                onPress={() => setChatTab('group')}
              >
                <Text style={{ fontWeight: chatTab === 'group' ? 'bold' : 'normal', color: chatTab === 'group' ? colors.primary : colors.textSecondary }}>Groups</Text>
              </TouchableOpacity>
            </View>

          </View>
        }
`;
    content = content.replace(listHeaderEnd, newListHeader);

    // Apply filter
    const renderChatCardMatch = `const renderChatCard = ({ item, index }: { item: any, index: number }) => {`;
    const filterLogic = `
  const displayedChats = activeChats.filter(chat => {
    const isGroup = chat.type === 'group' || chat.is_group;
    const matchesSearch = !searchQuery || chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (chatTab === 'direct' && isGroup) return false;
    if (chatTab === 'group' && !isGroup) return false;
    
    return matchesSearch;
  });

  const renderChatCard = ({ item, index }: { item: any, index: number }) => {`;
    content = content.replace(renderChatCardMatch, filterLogic);

    content = content.replace(`data={activeChats}`, `data={displayedChats}`);
  }

  fs.writeFileSync(file, content);
}

applyTab('src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx');
applyTab('src/screens/manager/ManagerTeamChatScreen.tsx');

console.log('Tabs added');
