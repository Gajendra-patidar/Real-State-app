const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/shared/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import {brokerApi}')) {
  content = content.replace("import {authApi} from '../../services/api/authApi';", "import {authApi} from '../../services/api/authApi';\nimport {brokerApi} from '../../services/api/brokerApi';");
}

if (!content.includes('import {ActivityIndicator}')) {
  content = content.replace("Switch,", "Switch,\n  ActivityIndicator,");
}

if (!content.includes('const [brokerProfile, setBrokerProfile] = useState<any>(null);')) {
  content = content.replace("const [loggingOut, setLoggingOut] = useState(false);", 
  `const [loggingOut, setLoggingOut] = useState(false);
  const [brokerProfile, setBrokerProfile] = useState<any>(null);
  const [loadingBroker, setLoadingBroker] = useState(false);
  
  React.useEffect(() => {
    if (role === 'broker') {
      setLoadingBroker(true);
      brokerApi.getBrokerProfile()
        .then(res => {
          if (res?.broker) setBrokerProfile(res.broker);
        })
        .catch(err => console.log('Failed to fetch broker profile', err))
        .finally(() => setLoadingBroker(false));
    }
  }, [role]);`);
}

const brokerCardJSX = `
        {/* ── Broker Profile ──────────────────────────────────────────── */}
        {role === 'broker' && (
          <>
            <SectionHeader title="BROKER INFORMATION" />
            <View style={styles.card}>
              {loadingBroker ? (
                <View style={{padding: 20, alignItems: 'center'}}>
                  <ActivityIndicator size="small" color={colors.secondary} />
                </View>
              ) : brokerProfile ? (
                <>
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
              ) : (
                <View style={{padding: 20, alignItems: 'center'}}>
                  <Text style={{color: colors.textMuted}}>Failed to load broker profile</Text>
                </View>
              )}
            </View>
          </>
        )}
`;

if (!content.includes('BROKER INFORMATION')) {
  content = content.replace("{/* ── Preferences ───────────────────────────────────────────── */}", brokerCardJSX + "\n        {/* ── Preferences ───────────────────────────────────────────── */}");
}

fs.writeFileSync(file, content);
