const fs = require('fs');
const file = 'src/screens/manager/ManagerSiteVisitsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add State for projects and selected project
const statePattern = `const [isFilterVisible, setIsFilterVisible] = useState(false);`;
const newState = `const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { salesExecutiveApi } = require('../../services/api/salesExecutiveApi');
      const res = await salesExecutiveApi.getProjects();
      setProjects(res?.data || res || []);
    } catch (e) {
      console.log('Failed to load projects for filter');
    }
  };
`;
if (!content.includes('const [projects, setProjects]')) {
    content = content.replace(statePattern, newState);
}

// 2. Replace the ScrollView inside the Filter Modal
const modalScrollPattern = /<ScrollView showsVerticalScrollIndicator=\{false\} contentContainerStyle=\{\{ paddingBottom: spacing\.xxl \}\}>[\s\S]*?<\/ScrollView>/;

const newModalScroll = `<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
              <Text style={{ fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.m }}>Select Project to Filter</Text>
              
              <TouchableOpacity 
                style={[styles.filterDropdown, selectedProjectId === null && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }, { marginBottom: spacing.s }]} 
                onPress={() => setSelectedProjectId(null)}
              >
                <Text style={[styles.filterDropdownText, selectedProjectId === null && { color: colors.primary, fontWeight: 'bold' }]}>All Projects</Text>
                {selectedProjectId === null && <Icon name="check-circle" size={20} color={colors.primary} />}
              </TouchableOpacity>

              {projects.map((proj: any) => (
                <TouchableOpacity 
                  key={proj.id}
                  style={[styles.filterDropdown, selectedProjectId === proj.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }, { marginBottom: spacing.s }]} 
                  onPress={() => setSelectedProjectId(proj.id)}
                >
                  <Text style={[styles.filterDropdownText, selectedProjectId === proj.id && { color: colors.primary, fontWeight: 'bold' }]}>{proj.name}</Text>
                  {selectedProjectId === proj.id && <Icon name="check-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>`;

content = content.replace(modalScrollPattern, newModalScroll);

// 3. FlatList update
const oldFlatList = `<FlatList
        data={MOCK_VISITS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}`;

const newFlatList = `const filteredVisits = MOCK_VISITS.filter(v => {
    const matchesSearch = !searchQuery || v.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProjectId ? (v.projectId === selectedProjectId || v.project === selectedProjectId) : true; // Assuming mock uses project or projectId
    return matchesSearch && matchesProject;
  });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Team Site Visits"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={filteredVisits}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}`;

content = content.replace(/  return \(\n    <View style=\{styles\.container\}>\n      <AppHeader\n        title="Team Site Visits"\n        onLeftPress=\{\(\) => navigation\.goBack\(\)\}\n      \/>\n\n      <FlatList\n        data=\{MOCK_VISITS\}\n        keyExtractor=\{item => item\.id\}\n        contentContainerStyle=\{styles\.listContent\}/, newFlatList);


fs.writeFileSync(file, content);
console.log('Fixed Manager Site Visits Filter');
