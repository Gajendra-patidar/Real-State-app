const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveReportsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// I need to change how the data is displayed. Let's replace the whole statsGrid and breakdownCard manually.
// First, check the exact format I generated earlier.
const oldGrid = `<View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL CRM LEADS</Text>
            <Text style={styles.statValue}>{data?.total_leads || data?.leads_count || data?.metrics?.leads || 0}</Text>
            <Text style={styles.statSub}>Conversions: 0</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SITE VISITS CONDUCTED</Text>
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>{data?.site_visits || data?.visits_count || data?.metrics?.visits || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Scheduled & Conducted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL UNIT BOOKINGS</Text>
            <Text style={[styles.statValue, {color: '#10B981'}]}>{data?.total_bookings || data?.bookings_count || data?.metrics?.bookings || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Units Secured</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOKEN REVENUE COLLECTED</Text>
            <Text style={[styles.statValue, {color: '#A855F7'}]}>₹{data?.total_revenue || data?.revenue || data?.metrics?.revenue || 0}</Text>
            <Text style={[styles.statSub, {color: '#A855F7'}]}>Token Payments</Text>
          </View>
        </View>`;

const newGrid = `<View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL CRM LEADS</Text>
            <Text style={styles.statValue}>{data?.leads?.total || 0}</Text>
            <Text style={styles.statSub}>Conversions: {data?.leads?.converted || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SITE VISITS CONDUCTED</Text>
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>{data?.site_visits || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Scheduled & Conducted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL UNIT BOOKINGS</Text>
            <Text style={[styles.statValue, {color: '#10B981'}]}>{data?.bookings?.total || 0}</Text>
            <Text style={[styles.statSub, {color: colors.textSecondary}]}>Pending: {data?.bookings?.pending || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOKEN REVENUE COLLECTED</Text>
            <Text style={[styles.statValue, {color: '#A855F7'}]}>₹{data?.bookings?.booking_amount || 0}</Text>
            <Text style={[styles.statSub, {color: '#A855F7'}]}>Token Payments</Text>
          </View>
        </View>`;

const oldBreakdownStats = `<View style={styles.perfStats}>
            <View style={styles.perfStatCol}><Text style={styles.perfStatVal}>{data?.executive?.assigned || data?.metrics?.assigned || data?.total_leads || 0}</Text><Text style={styles.perfStatLbl}>Assigned</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>{data?.executive?.visits || data?.metrics?.visits || data?.site_visits || 0}</Text><Text style={styles.perfStatLbl}>Visits</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#10B981'}]}>{data?.executive?.bookings || data?.metrics?.bookings || data?.total_bookings || 0}</Text><Text style={styles.perfStatLbl}>Bookings</Text></View>
            <View style={styles.perfStatCol}>
              <View style={styles.rateBadge}><Text style={styles.rateBadgeText}>{data?.executive?.conversion_rate || data?.metrics?.conversion_rate || '0%'}</Text></View>
              <Text style={styles.perfStatLbl}>Rate</Text>
            </View>
          </View>`;

const newBreakdownStats = `<View style={styles.perfStats}>
            <View style={styles.perfStatCol}><Text style={styles.perfStatVal}>{data?.leads?.total || 0}</Text><Text style={styles.perfStatLbl}>Assigned</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>{data?.site_visits || 0}</Text><Text style={styles.perfStatLbl}>Visits</Text></View>
            <View style={styles.perfStatCol}><Text style={[styles.perfStatVal, {color: '#10B981'}]}>{data?.bookings?.total || 0}</Text><Text style={styles.perfStatLbl}>Bookings</Text></View>
            <View style={styles.perfStatCol}>
              <View style={styles.rateBadge}><Text style={styles.rateBadgeText}>{data?.leads?.total ? Math.round((data.leads.converted || 0) / data.leads.total * 100) : 0}%</Text></View>
              <Text style={styles.perfStatLbl}>Rate</Text>
            </View>
          </View>`;


content = content.replace(oldGrid, newGrid);
content = content.replace(oldBreakdownStats, newBreakdownStats);

fs.writeFileSync(file, content);
console.log('Fixed reports screen mappings');
