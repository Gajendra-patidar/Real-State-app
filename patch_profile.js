const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/shared/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Banknote import
if (!content.includes('Banknote')) {
  content = content.replace(
    'Edit3,',
    'Edit3,\n  Banknote,'
  );
}

// Add the Earnings section
const earningsSection = `
        {/* ── Business & Earnings ─────────────────────────────────── */}
        {role === 'broker' && (
          <>
            <SectionHeader title="BUSINESS & EARNINGS" />
            <View style={styles.card}>
              <ActionRow
                icon={<Banknote size={16} color={colors.success} />}
                iconBg={colors.successLight}
                label="My Commissions"
                onPress={() => navigation.navigate('Commission')}
              />
            </View>
          </>
        )}
`;

if (!content.includes('BUSINESS & EARNINGS')) {
  content = content.replace(
    '{/* ── Preferences ──',
    earningsSection + '\n        {/* ── Preferences ──'
  );
}

fs.writeFileSync(file, content);
