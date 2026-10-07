const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/shared/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Company ID
content = content.replace(
  /<View style=\{styles\.rowDivider\} \/>\s*<InfoRow\s*icon=\{<Building2 size=\{16\} color=\{colors\.warning\} \/>\}\s*label="Company ID"\s*value=\{user\?\.company_id \? `\#\$\{user\.company_id\}` : 'Not assigned'\}\s*\/>/m,
  ''
);

// 2. Remove Change Password
content = content.replace(
  /<ActionRow\s*icon=\{<Lock size=\{16\} color=\{colors\.secondary\} \/>\}\s*iconBg=\{colors\.infoLight\}\s*label="Change Password"[\s\S]*?<\/View>/m,
  ''
);

// 3. Update Phone to use brokerProfile?.phone
content = content.replace(
  /value=\{user\?\.phone \|\| 'Not set'\}/,
  "value={brokerProfile?.phone || user?.phone || 'Not set'}"
);

// 4. Extract Broker Information and merge into Account Info
const brokerDataMatch = content.match(/\{\/\* ── Broker Profile ──[\s\S]*?\{\/\* ── Preferences ──/);
if (brokerDataMatch) {
  content = content.replace(brokerDataMatch[0], '{/* ── Preferences ──');
}

// Merge broker fields into Account Info
const brokerFields = `
          {role === 'broker' && brokerProfile && (
            <>
              <View style={styles.rowDivider} />
              <InfoRow icon={<Building2 size={16} color={colors.secondary} />} label="Firm Name" value={brokerProfile.firm_name || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.accent} />} label="RERA Number" value={brokerProfile.rera_number || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.warning} />} label="PAN Number" value={brokerProfile.pan_number || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Building2 size={16} color={colors.success} />} label="Bank Name" value={brokerProfile.bank_name || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.textSecondary} />} label="Account Number" value={brokerProfile.account_number || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.textSecondary} />} label="IFSC Code" value={brokerProfile.ifsc_code || 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.primary} />} label="Commission Rate" value={brokerProfile.commission_rate ? \`\${brokerProfile.commission_rate}%\` : 'Not set'} />
              <View style={styles.rowDivider} />
              <InfoRow icon={<Info size={16} color={colors.purple} />} label="Referral Code" value={brokerProfile.referral_code || 'Not set'} />
            </>
          )}
          {role === 'broker' && loadingBroker && (
            <View style={{padding: 20, alignItems: 'center'}}>
              <ActivityIndicator size="small" color={colors.secondary} />
            </View>
          )}`;

content = content.replace(
  /<InfoRow\s*icon=\{<Shield size=\{16\} color=\{roleInfo\.color\} \/>\}\s*label="Role"\s*value=\{roleInfo\.label\}\s*\/>/,
  `<InfoRow\n            icon={<Shield size={16} color={roleInfo.color} />}\n            label="Role"\n            value={roleInfo.label}\n          />${brokerFields}`
);

fs.writeFileSync(file, content);
