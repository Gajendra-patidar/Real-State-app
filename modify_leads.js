const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add new state variables
content = content.replace(
  /const \[isAddLeadModalVisible, setIsAddLeadModalVisible\] = useState\(false\);/,
  `const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [addLeadForm, setAddLeadForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    project_id: '',
    project_name: '',
    source: ''
  });
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isSourceModalVisible, setIsSourceModalVisible] = useState(false);
  const LEAD_SOURCES = ['Website', 'Broker channel'];`
);

// 2. Fetch projects in fetchData
content = content.replace(
  /const \[leadsRes, statsRes, teamRes\] = await Promise.all\(\[([\s\S]*?)\]\);/,
  `const [leadsRes, statsRes, teamRes, projectsRes] = await Promise.all([$1,
        salesExecutiveApi.getProjects().catch(() => null)
      ]);`
);

content = content.replace(
  /if \(teamRes\?\.data\?\.data\) \{([\s\S]*?)\} else \{([\s\S]*?)\}/,
  `if (teamRes?.data?.data) {$1} else {$2}
      
      if (projectsRes?.data?.data) {
        setProjects(projectsRes.data.data);
      } else if (projectsRes?.data) {
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      } else {
        setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      }`
);

// 3. Update the modal structure
// we need to fix the KeyboardAvoidingView issue and add input bindings + modals for project and source
let modalStart = content.indexOf('{/* Add New Lead Modal */}');
let modalEnd = content.indexOf('</View>', content.indexOf('</Modal>', modalStart));
// The modal ends at:
//       </Modal>
//
//     </View>
//   );
// };

let modalReplacement = `{/* Add New Lead Modal */}
      <Modal
        visible={isAddLeadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddLeadModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.addLeadModalContent]}>
            <View style={styles.addLeadModalHeader}>
              <View>
                <Text style={styles.addLeadModalTitle}>Add New Customer Lead</Text>
                <Text style={styles.addLeadModalSubtitle}>Enter primary details to create a lead</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddLeadModalVisible(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              contentContainerStyle={[styles.addLeadForm, { paddingBottom: 100 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>First Name <Text style={{color: '#EF4444'}}>*</Text></Text>
                  <TextInput 
                    style={styles.inputBox} 
                    placeholder="John" 
                    placeholderTextColor={colors.textMuted}
                    value={addLeadForm.first_name}
                    onChangeText={(text) => setAddLeadForm({...addLeadForm, first_name: text})}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput 
                    style={styles.inputBox} 
                    placeholder="Doe" 
                    placeholderTextColor={colors.textMuted}
                    value={addLeadForm.last_name}
                    onChangeText={(text) => setAddLeadForm({...addLeadForm, last_name: text})}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Phone Number <Text style={{color: '#EF4444'}}>*</Text></Text>
                  <TextInput 
                    style={styles.inputBox} 
                    placeholder="+91" 
                    keyboardType="phone-pad" 
                    placeholderTextColor={colors.textMuted}
                    value={addLeadForm.phone}
                    onChangeText={(text) => setAddLeadForm({...addLeadForm, phone: text})}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput 
                    style={styles.inputBox} 
                    placeholder="john@example.com" 
                    keyboardType="email-address" 
                    placeholderTextColor={colors.textMuted}
                    value={addLeadForm.email}
                    onChangeText={(text) => setAddLeadForm({...addLeadForm, email: text})}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Project Interest</Text>
                  <TouchableOpacity style={styles.inputBoxSelect} onPress={() => setIsProjectModalVisible(true)}>
                    <Text style={styles.inputText}>{addLeadForm.project_name || 'Select Project'}</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Lead Source</Text>
                  <TouchableOpacity style={styles.inputBoxSelect} onPress={() => setIsSourceModalVisible(true)}>
                    <Text style={styles.inputText}>{addLeadForm.source || 'Select Source'}</Text>
                    <Icon name="chevron-down" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.addLeadActions}>
                <TouchableOpacity style={styles.addLeadCancelBtn} onPress={() => setIsAddLeadModalVisible(false)}>
                  <Text style={styles.addLeadCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addLeadSaveBtn} onPress={async () => {
                   if (!addLeadForm.first_name || !addLeadForm.phone) {
                     Alert.alert('Validation Error', 'First name and phone are required');
                     return;
                   }
                   try {
                     const payload = {
                       first_name: addLeadForm.first_name,
                       last_name: addLeadForm.last_name,
                       phone: addLeadForm.phone,
                       email: addLeadForm.email,
                       project_id: addLeadForm.project_id || null,
                       source: addLeadForm.source || null,
                     };
                     await salesExecutiveApi.createLead(payload);
                     Alert.alert('Success', 'Lead created successfully');
                     setIsAddLeadModalVisible(false);
                     fetchData(); // Refresh leads
                     setAddLeadForm({
                       first_name: '', last_name: '', phone: '', email: '', project_id: '', project_name: '', source: ''
                     });
                   } catch (error) {
                     console.log('Error creating lead:', error);
                     Alert.alert('Error', 'Failed to create lead');
                   }
                }}>
                  <Text style={styles.addLeadSaveText}>Save Lead</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Project Selection Modal */}
      <Modal
        visible={isProjectModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsProjectModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsProjectModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Project</Text>
              <TouchableOpacity onPress={() => setIsProjectModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {projects.map(proj => (
                <TouchableOpacity 
                  key={proj.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setAddLeadForm(prev => ({ ...prev, project_id: proj.id, project_name: proj.name }));
                    setIsProjectModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{proj.name}</Text>
                  {addLeadForm.project_id === proj.id && <Icon name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Lead Source Selection Modal */}
      <Modal
        visible={isSourceModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSourceModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsSourceModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Lead Source</Text>
              <TouchableOpacity onPress={() => setIsSourceModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {LEAD_SOURCES.map(source => (
                <TouchableOpacity 
                  key={source}
                  style={styles.modalItem}
                  onPress={() => {
                    setAddLeadForm(prev => ({ ...prev, source }));
                    setIsSourceModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{source}</Text>
                  {addLeadForm.source === source && <Icon name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
`;

let contentBeforeModal = content.substring(0, modalStart);
let contentAfterModal = content.substring(content.indexOf('</Modal>', modalStart) + 8);

content = contentBeforeModal + modalReplacement + contentAfterModal;

fs.writeFileSync(file, content);
console.log('Done replacing');
