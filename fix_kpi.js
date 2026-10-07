const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldInterface = `interface KpiCardProps {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; accent: string; accentBg: string;
}`;

const newInterface = `interface KpiCardProps {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; accent: string; accentBg: string;
  onPress?: () => void;
}`;

const oldComp = `const KpiCard: React.FC<KpiCardProps> = ({label, value, sub, icon, accent, accentBg}) => (
  <View style={[styles.kpiCard, {borderLeftColor: accent}]}>
    <View style={[styles.kpiIconWrap, {backgroundColor: accentBg}]}>{icon}</View>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={[styles.kpiValue, {color: accent}]}>{value}</Text>
    <View style={styles.kpiSubRow}>
      <Text style={styles.kpiSub}>{sub}</Text>
      <ArrowUpRight size={12} color={accent} />
    </View>
  </View>
);`;

const newComp = `const KpiCard: React.FC<KpiCardProps> = ({label, value, sub, icon, accent, accentBg, onPress}) => (
  <TouchableOpacity style={[styles.kpiCard, {borderLeftColor: accent}]} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.kpiIconWrap, {backgroundColor: accentBg}]}>{icon}</View>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={[styles.kpiValue, {color: accent}]}>{value}</Text>
    <View style={styles.kpiSubRow}>
      <Text style={styles.kpiSub}>{sub}</Text>
      <ArrowUpRight size={12} color={accent} />
    </View>
  </TouchableOpacity>
);`;

content = content.replace(oldInterface, newInterface);
content = content.replace(oldComp, newComp);

const oldGrid = `<KpiCard
            label="ASSIGNED QUEUE"
            value={\`\${assignedCount} Leads\`}
            sub="Active Queue Inquiries"
            icon={<Users size={18} color={colors.secondary} />}
            accent={colors.secondary}
            accentBg={colors.infoLight}
          />
          <KpiCard
            label="SITE VISITS"
            value={\`\${siteVisits} Visits\`}
            sub="Scheduled Tours"
            icon={<MapPin size={18} color={colors.warning} />}
            accent={colors.warning}
            accentBg={colors.warningLight}
          />
          <KpiCard
            label="CONVERTED BOOKINGS"
            value={\`\${convertedBookings} Booked\`}
            sub="Closed Deals"
            icon={<Trophy size={18} color={colors.success} />}
            accent={colors.success}
            accentBg={colors.successLight}
          />`;

const newGrid = `<KpiCard
            label="ASSIGNED QUEUE"
            value={\`\${assignedCount} Leads\`}
            sub="Active Queue Inquiries"
            icon={<Users size={18} color={colors.secondary} />}
            accent={colors.secondary}
            accentBg={colors.infoLight}
            onPress={() => navigation.navigate('Leads')}
          />
          <KpiCard
            label="SITE VISITS"
            value={\`\${siteVisits} Visits\`}
            sub="Scheduled Tours"
            icon={<MapPin size={18} color={colors.warning} />}
            accent={colors.warning}
            accentBg={colors.warningLight}
            onPress={() => navigation.navigate('Visits')}
          />
          <KpiCard
            label="CONVERTED BOOKINGS"
            value={\`\${convertedBookings} Booked\`}
            sub="Closed Deals"
            icon={<Trophy size={18} color={colors.success} />}
            accent={colors.success}
            accentBg={colors.successLight}
            onPress={() => navigation.navigate('Bookings')}
          />`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync(file, content);
console.log('Fixed KpiCards');
