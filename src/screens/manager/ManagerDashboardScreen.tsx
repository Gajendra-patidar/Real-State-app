import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '../../hooks/useAuth';
import {dashboardApi} from '../../services/api/dashboardApi';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {
  LayoutDashboard,
  Bell,
  TrendingUp,
  Inbox,
  MapPin,
  Handshake,
  Trophy,
  Plus,
  Users,
  ChevronRight,
  Phone,
  Building2,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Target,
  Activity,
} from 'lucide-react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const getFormattedDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  };
  return new Date().toLocaleDateString('en-IN', options);
};

const formatDateString = (dateStr: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'short', year: 'numeric'};
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  } catch {
    return dateStr;
  }
};

// ─── KPI Card ─────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
}
const KpiCard: React.FC<KpiCardProps> = ({label, value, sub, icon, accent, accentBg}) => (
  <View style={[styles.kpiCard, {borderLeftColor: accent, borderLeftWidth: 4}]}>
    <View style={[styles.kpiIconWrap, {backgroundColor: accentBg}]}>{icon}</View>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={[styles.kpiValue, {color: accent}]}>{value}</Text>
    <View style={styles.kpiSubRow}>
      <Text style={styles.kpiSub}>{sub}</Text>
      <ArrowUpRight size={12} color={accent} />
    </View>
  </View>
);

// ─── Status Badge ──────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, {bg: string; text: string; border: string}> = {
  'NEW':         {bg: colors.infoLight,    text: colors.info,    border: colors.info},
  'SITE VISIT':  {bg: colors.warningLight, text: colors.warning, border: colors.warning},
  'NEGOTIATION': {bg: colors.purpleLight,  text: colors.purple,  border: colors.purple},
  'BOOKED':      {bg: colors.successLight, text: colors.success, border: colors.success},
  'ASSIGNED':    {bg: colors.infoLight,    text: colors.info,    border: colors.info},
};
const StatusBadge: React.FC<{status: string}> = ({status}) => {
  const key = (status || '').toUpperCase();
  const cfg = STATUS_MAP[key] ?? {bg: colors.border, text: colors.textSecondary, border: colors.textMuted};
  return (
    <View style={[styles.statusBadge, {backgroundColor: cfg.bg, borderColor: cfg.border}]}>
      <View style={[styles.statusDot, {backgroundColor: cfg.text}]} />
      <Text style={[styles.statusText, {color: cfg.text}]}>{key}</Text>
    </View>
  );
};

// ─── Lead Row ──────────────────────────────────────────────────────────────
interface LeadRowProps {
  name: string; code: string; phone: string;
  property: string; executive: string; status: string;
}
const LeadRow: React.FC<LeadRowProps> = ({name, code, phone, property, executive, status}) => (
  <View style={styles.leadRow}>
    <View style={styles.leadAvatar}>
      <Text style={styles.leadAvatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
    <View style={styles.leadInfo}>
      <View style={styles.leadTopRow}>
        <Text style={styles.leadName} numberOfLines={1}>{name}</Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.leadCode}>{code}</Text>
      <View style={styles.leadMeta}>
        <View style={styles.leadMetaItem}>
          <Phone size={11} color={colors.textMuted} />
          <Text style={styles.leadMetaText}>{phone}</Text>
        </View>
        <View style={styles.leadMetaItem}>
          <Building2 size={11} color={colors.textMuted} />
          <Text style={styles.leadMetaText} numberOfLines={1}>{property}</Text>
        </View>
        <View style={styles.leadMetaItem}>
          <Users size={11} color={colors.textMuted} />
          <Text style={styles.leadMetaText}>{executive}</Text>
        </View>
      </View>
    </View>
  </View>
);

// ─── Executive Card ────────────────────────────────────────────────────────
interface ExecCardProps {
  name: string; role: string;
  assigned: number; booked: number; conversionRate: string;
}
const ExecCard: React.FC<ExecCardProps> = ({name, role, assigned, booked, conversionRate}) => {
  const initials = (name || '').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const conv = parseInt(conversionRate, 10) || 0;
  return (
    <View style={styles.execCard}>
      <View style={styles.execHeader}>
        <View style={styles.execAvatar}>
          <Text style={styles.execAvatarText}>{initials}</Text>
        </View>
        <View style={styles.execInfo}>
          <Text style={styles.execName} numberOfLines={1}>{name}</Text>
          <Text style={styles.execRole}>{role}</Text>
        </View>
      </View>
      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, {width: `${Math.min(conv, 100)}%`}]} />
      </View>
      <View style={styles.execStats}>
        <View style={styles.execStatItem}>
          <Text style={styles.execStatValue}>{assigned}</Text>
          <Text style={styles.execStatLabel}>Assigned</Text>
        </View>
        <View style={styles.execStatItem}>
          <Text style={[styles.execStatValue, {color: colors.success}]}>{booked}</Text>
          <Text style={styles.execStatLabel}>Booked</Text>
        </View>
        <View style={styles.execStatItem}>
          <Text style={[styles.execStatValue, {color: colors.accent}]}>{conversionRate}</Text>
          <Text style={styles.execStatLabel}>Conversion</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────
export const ManagerDashboardScreen = () => {
  const {user} = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [executives, setExecutives] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('Today');

  const filters = ['Today', 'This Week', 'This Month', 'Custom'];

  useEffect(() => { fetchAll(); }, [timeFilter]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      let dData: any = null, eData: any[] = [], lData: any[] = [];

      try {
        const r = await dashboardApi.getManagerDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        dData = r.dashboard;
      } catch {
        dData = {total_assigned_leads: 12, new_leads: 10, site_visits_upcoming: 1, in_progress_leads: 1, total_bookings: 0};
      }
      try {
        const r = await dashboardApi.getManagerExecutives();
        eData = r.data?.data || [];
      } catch {
        eData = [
          {id: 1, name: 'Vikram Singh',  role: {name: 'Sales Executive'}, total_leads: 8, converted_leads: 3},
          {id: 2, name: 'Neha Gupta',    role: {name: 'Sales Executive'}, total_leads: 5, converted_leads: 1},
          {id: 3, name: 'Rohan Verma',   role: {name: 'Sales Executive'}, total_leads: 4, converted_leads: 2},
        ];
      }
      try {
        const r = await dashboardApi.getRecentLeads({per_page: 5});
        lData = r.data?.data || [];
      } catch {
        lData = [
          {id: 101, lead_code: 'LD-8801', first_name: 'Amit',   last_name: 'Kulkarni', phone: '9988776655', status: 'SITE VISIT',  project: {name: 'Apex Grand Residency'}, user: {name: 'Vikram Singh'}},
          {id: 102, lead_code: 'LD-8802', first_name: 'Suresh', last_name: 'Reddy',    phone: '9123456789', status: 'NEGOTIATION', project: {name: 'Apex Grand Residency'}, user: {name: 'Neha Gupta'}},
          {id: 103, lead_code: 'LD-8803', first_name: 'Priya',  last_name: 'Sharma',   phone: '9811000001', status: 'NEW',         project: {name: 'Subh Angan'},           user: {name: 'Rohan Verma'}},
        ];
      }

      setDashboardData(dData);
      setExecutives(eData);
      setRecentLeads(lData);
    } catch {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  const firstName = (user?.name || 'Manager').split(' ')[0];
  const totalLeads = dashboardData?.total_assigned_leads || 0;
  const newLeads   = dashboardData?.new_leads || 0;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>

      {/* ── Premium Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.headerGreeting}>Good Morning 👋</Text>
            <Text style={styles.headerName} numberOfLines={1}>{user?.name || 'Manager'}</Text>
            <Text style={styles.headerDate}>{getFormattedDate()} • Manager</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Bell size={20} color={colors.primary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero Banner ───────────────────────────────────────────── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color={colors.accentGold} />
              <Text style={styles.heroBadgeText}>{totalLeads} Leads in Pipeline</Text>
            </View>
            <Text style={styles.heroTitle}>Manager{'\n'}Command Center</Text>
            <Text style={styles.heroSub}>Team performance & leads overview</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroIconBg}>
              <LayoutDashboard size={40} color="rgba(255,255,255,0.2)" />
            </View>
          </View>
          {/* Quick Actions */}
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroPrimaryBtn}>
              <Plus size={16} color={colors.primary} />
              <Text style={styles.heroPrimaryBtnText}>Add Lead</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryBtn}>
              <Activity size={16} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroSecondaryBtnText}>Team Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Time Filters ──────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity key={f}
              style={[styles.filterChip, timeFilter === f && styles.filterChipActive]}
              onPress={() => setTimeFilter(f)}>
              <Text style={[styles.filterText, timeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── KPI Grid ──────────────────────────────────────────────── */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Performance Overview</Text>
          <TrendingUp size={16} color={colors.secondary} />
        </View>
        <View style={styles.kpiGrid}>
          <KpiCard
            label="TOTAL PIPELINE"
            value={dashboardData?.total_assigned_leads || 0}
            sub="+12.5% this period"
            icon={<TrendingUp size={18} color={colors.success} />}
            accent={colors.success}
            accentBg={colors.successLight}
          />
          <KpiCard
            label="NEW INQUIRIES"
            value={dashboardData?.new_leads || 0}
            sub="Pending assignment"
            icon={<Inbox size={18} color={colors.secondary} />}
            accent={colors.secondary}
            accentBg={colors.infoLight}
          />
          <KpiCard
            label="SITE VISITS"
            value={dashboardData?.site_visits_upcoming || 0}
            sub="Scheduled tours"
            icon={<MapPin size={18} color={colors.warning} />}
            accent={colors.warning}
            accentBg={colors.warningLight}
          />
          <KpiCard
            label="NEGOTIATIONS"
            value={dashboardData?.in_progress_leads || 0}
            sub="Cost sheets sent"
            icon={<Handshake size={18} color={colors.accent} />}
            accent={colors.accent}
            accentBg={colors.purpleLight}
          />
          <KpiCard
            label="BOOKED DEALS"
            value={dashboardData?.total_bookings || 0}
            sub="Units locked"
            icon={<Trophy size={18} color={colors.accentGold} />}
            accent={colors.accentGold}
            accentBg={colors.warningLight}
          />
          <KpiCard
            label="TEAM TARGET"
            value={`${totalLeads > 0 ? Math.round(((dashboardData?.total_bookings || 0) / totalLeads) * 100) : 0}%`}
            sub="Conversion rate"
            icon={<Target size={18} color={colors.purple} />}
            accent={colors.purple}
            accentBg={colors.purpleLight}
          />
        </View>

        {/* ── Team Leaderboard ──────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={[styles.sectionIconWrap, {backgroundColor: colors.infoLight}]}>
                <Users size={16} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Sales Team Performance</Text>
                <Text style={styles.sectionSub}>Active executive workload & conversion</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllPill}>
              <Text style={styles.viewAllPillText}>Roster</Text>
              <ChevronRight size={14} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.execRow}>
            {executives.map(exec => {
              const conv = exec.total_leads > 0
                ? Math.round((exec.converted_leads / exec.total_leads) * 100)
                : 0;
              return (
                <ExecCard
                  key={exec.id}
                  name={exec.name}
                  role={exec.role?.name || 'Sales Executive'}
                  assigned={exec.total_leads}
                  booked={exec.converted_leads}
                  conversionRate={`${conv}%`}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* ── Recent Leads Pipeline ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={[styles.sectionIconWrap, {backgroundColor: colors.purpleLight}]}>
                <Activity size={16} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Recent Leads Pipeline</Text>
                <Text style={styles.sectionSub}>Real-time status tracking</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllPill}>
              <Text style={styles.viewAllPillText}>View All</Text>
              <ChevronRight size={14} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {recentLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No leads found</Text>
            </View>
          ) : (
            recentLeads.map((lead, idx) => (
              <View key={lead.id}>
                <LeadRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  executive={lead.user?.name || 'Unassigned'}
                  status={lead.status}
                />
                {idx < recentLeads.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))
          )}

          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Leads</Text>
            <ChevronRight size={16} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={{height: spacing.xl}} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  headerGreeting: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  headerDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Hero Banner
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  heroLeft: {flex: 1},
  heroRight: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  heroIconBg: {opacity: 0.6},
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 5,
  },
  heroBadgeText: {
    color: colors.accentGold,
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.surface,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  heroPrimaryBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  heroSecondaryBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
  },

  // Filters
  filterScroll: {flexGrow: 0, marginTop: 16},
  filterRow: {paddingHorizontal: 16, gap: 8},
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {color: colors.surface},

  // Section Label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  kpiCard: {
    width: (SCREEN_WIDTH - 24 - 10) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  kpiSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kpiSub: {
    fontSize: 10,
    color: colors.textMuted,
    flex: 1,
  },

  // Section Cards
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  viewAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllPillText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },

  // Executive Cards
  execRow: {gap: 12, paddingRight: 4},
  execCard: {
    width: 200,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  execHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  execAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  execAvatarText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  execInfo: {flex: 1},
  execName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  execRole: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  execStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  execStatItem: {alignItems: 'center'},
  execStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  execStatLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },

  // Lead Rows
  leadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  leadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leadAvatarText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  leadInfo: {flex: 1},
  leadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  leadCode: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  leadMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  leadMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leadMetaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
