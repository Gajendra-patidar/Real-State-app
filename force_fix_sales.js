const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveSiteVisitsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('<Text style={styles.modalTitle}>Filter Visits</Text>'));
const scrollStartIndex = lines.findIndex((l, i) => i > startIndex && l.includes('<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>'));

// Find the corresponding closing tag (it's the first </ScrollView> after scrollStartIndex)
const scrollEndIndex = lines.findIndex((l, i) => i > scrollStartIndex && l.includes('</ScrollView>'));

const newScrollLines = `            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
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

const before = lines.slice(0, scrollStartIndex);
const after = lines.slice(scrollEndIndex + 1);

content = [...before, newScrollLines, ...after].join('\n');

fs.writeFileSync(file, content);
console.log('Force fixed sales filter');
