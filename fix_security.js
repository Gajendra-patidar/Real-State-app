const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/shared/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const correctSecurityBlock = `{/* ── Security & Support ────────────────────────────────────── */}
        <SectionHeader title="SECURITY & SUPPORT" />
        <View style={styles.card}>
          <ActionRow
            icon={<HelpCircle size={16} color={colors.success} />}
            iconBg={colors.successLight}
            label="Help & Support"
            onPress={() => Alert.alert('Support', 'Contact support@reoscrm.com')}
          />
          <View style={styles.rowDivider} />
          <ActionRow
            icon={<Info size={16} color={colors.textSecondary} />}
            iconBg={colors.background}
            label="App Version"
            rightEl={
              <Text style={styles.versionText}>v1.0.0</Text>
            }
          />
        </View>`;

content = content.replace(
  /\{\/\* ── Security & Support ────────────────────────────────────── \*\/\}[\s\S]*?<SectionHeader title="SECURITY & SUPPORT" \/>\s*<View style=\{styles\.card\}>\s*/,
  correctSecurityBlock + '\n\n'
);

fs.writeFileSync(file, content);
