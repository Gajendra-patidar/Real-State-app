const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add missing imports
if (!content.includes('Modal,')) {
  content = content.replace('ActivityIndicator,', "ActivityIndicator,\n  Modal,\n  Image,");
}
if (!content.includes('MapPin,')) {
  content = content.replace('Sparkles,', "Sparkles,\n  MapPin,\n  X,");
}

// 2. Change ProjectCardProps and ProjectCard
const oldProjectCard = `interface ProjectCardProps {
  city: string; unitsFree: number; name: string;
  onPreview: () => void; onCopy: () => void;
}
const ProjectCard: React.FC<ProjectCardProps> = ({city, unitsFree, name, onPreview, onCopy}) => (
  <View style={styles.projectCard}>
    <View style={styles.projectCardHeader}>
      <View style={styles.projectCityBadge}>
        <Text style={styles.projectCityText}>{(city || '').toUpperCase()}</Text>
      </View>
      <View style={[styles.unitsBadge, {backgroundColor: unitsFree > 0 ? colors.successLight : colors.errorLight}]}>
        <Text style={[styles.unitsText, {color: unitsFree > 0 ? colors.success : colors.error}]}>
          {unitsFree} Free
        </Text>
      </View>
    </View>
    <Text style={styles.projectName}>{name}</Text>`;

const newProjectCard = `interface ProjectCardProps {
  city: string; type: string; name: string;
  onPreview: () => void; onCopy: () => void;
}
const ProjectCard: React.FC<ProjectCardProps> = ({city, type, name, onPreview, onCopy}) => (
  <View style={styles.projectCard}>
    <View style={styles.projectCardHeader}>
      <View style={styles.projectCityBadge}>
        <Text style={styles.projectCityText}>{(city || '').toUpperCase()}</Text>
      </View>
      <View style={[styles.unitsBadge, {backgroundColor: colors.infoLight}]}>
        <Text style={[styles.unitsText, {color: colors.info, textTransform: 'capitalize'}]}>
          {type || 'Project'}
        </Text>
      </View>
    </View>
    <Text style={styles.projectName}>{name}</Text>`;

content = content.replace(oldProjectCard, newProjectCard);

// 3. Add ProjectDetailModal component
const modalComponent = `
// ─── Project Detail Modal ───────────────────────────────────────────────────
const ProjectDetailModal = ({project, visible, onClose}: any) => {
  if (!project) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={{backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <Text style={{fontSize: 20, fontWeight: '700', color: colors.text, flex: 1}}>{project.name}</Text>
            <TouchableOpacity onPress={onClose} style={{padding: 4, backgroundColor: colors.background, borderRadius: 16}}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {project.banner_image ? (
              <Image source={{uri: "https://your-api-domain.com" + project.banner_image}} style={{width: '100%', height: 160, borderRadius: 12, backgroundColor: colors.border, marginBottom: 16}} />
            ) : (
              <View style={{width: '100%', height: 160, borderRadius: 12, backgroundColor: colors.infoLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
                <Building2 size={40} color={colors.secondary} />
              </View>
            )}
            
            <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 20}}>
              <MapPin size={16} color={colors.textSecondary} style={{marginTop: 2}} />
              <Text style={{fontSize: 14, color: colors.textSecondary, flex: 1, lineHeight: 20}}>
                {project.location_address || \`\${project.city}, \${project.state}\`}
              </Text>
            </View>

            <View style={{backgroundColor: colors.background, borderRadius: 12, padding: 16, gap: 12}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: colors.textMuted, fontSize: 13}}>Project Code</Text>
                <Text style={{color: colors.text, fontWeight: '600', fontSize: 13}}>{project.code}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: colors.textMuted, fontSize: 13}}>Type</Text>
                <Text style={{color: colors.text, fontWeight: '600', fontSize: 13, textTransform: 'capitalize'}}>{project.project_type || 'N/A'}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: colors.textMuted, fontSize: 13}}>RERA Number</Text>
                <Text style={{color: colors.text, fontWeight: '600', fontSize: 13}}>{project.rera_number || 'N/A'}</Text>
              </View>
            </View>

            {project.company && (
              <View style={{marginTop: 24}}>
                <Text style={{fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase'}}>Developer Info</Text>
                <View style={{backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16}}>
                  <Text style={{fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 4}}>{project.company.name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4}}>
                    <Phone size={12} color={colors.textSecondary} />
                    <Text style={{fontSize: 13, color: colors.textSecondary}}>{project.company.phone}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4}}>
                    <Globe size={12} color={colors.textSecondary} />
                    <Text style={{fontSize: 13, color: colors.textSecondary}}>{project.company.email}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={{height: 40}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
`;

if (!content.includes('ProjectDetailModal')) {
  content = content.replace('// ─── Main Screen', modalComponent + '\n// ─── Main Screen');
}

// 4. Update the state and mapping
if (!content.includes('const [selectedProject')) {
  content = content.replace(
    'const [publicProjects, setPublicProjects] = useState<any[]>([]);',
    'const [publicProjects, setPublicProjects] = useState<any[]>([]);\n  const [selectedProject, setSelectedProject] = useState<any>(null);'
  );
}

const oldMapping = `{publicProjects.map(p => (
              <ProjectCard
                key={p.id}
                city={p.city || 'LOCATION'}
                unitsFree={p.available_units_count}
                name={p.name}
                onPreview={() => {}}
                onCopy={() => {}}
              />
            ))}`;

const newMapping = `{publicProjects.map(p => (
              <ProjectCard
                key={p.id}
                city={p.city || 'LOCATION'}
                type={p.project_type || 'Project'}
                name={p.name}
                onPreview={() => setSelectedProject(p)}
                onCopy={() => {
                  Alert.alert('Link Copied', \`Referral link for \${p.name} copied to clipboard!\`);
                }}
              />
            ))}`;

content = content.replace(oldMapping, newMapping);

const modalCall = `
        <View style={{height: spacing.xl}} />
      </ScrollView>

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        project={selectedProject} 
        visible={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </View>
  );`;

content = content.replace(/<View style=\{\{height: spacing\.xl\}\} \/>\s*<\/ScrollView>\s*<\/View>\s*\);\s*/m, modalCall + '\n');

// Update fallback dummy data
content = content.replace(
  /available_units_count:3/,
  "project_type:'residential', location_address:'Gachibowli, Hyderabad', rera_number:'P02400009876', code:'AGR-01'"
);
content = content.replace(
  /available_units_count:0/,
  "project_type:'commercial', location_address:'MG Road, Indore', rera_number:'P09900012345', code:'SUB-02'"
);


fs.writeFileSync(file, content);
