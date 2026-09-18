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
import {salesExecutiveApi} from '../../services/api/salesExecutiveApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {
  LayoutDashboard,
  Bell,
  Plus,
  Users,
  MapPin,
  Trophy,
  Phone,
  Building2,
  ChevronRight,
  Eye,
  ClipboardList,
  Sparkles,
  ArrowUpRight,
  Activity,
  MessageCircle,
} from 'lucide-react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getFormattedDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  };
  return new Date().toLocaleDateString('en-IN', options);
};

// ─── Status config ────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, {bg: string; text: string; border: string; label: string}> = {
  NEW:         {bg: colors.infoLight,    text: colors.info,    border: colors.info,    label: 'NEW'},
  'SITE VISIT':{bg: colors.warningLight, text: colors.warning, border: colors.warning, label: 'SITE VISIT'},
  NEGOTIATION: {bg: colors.purpleLight,  text: colors.purple,  border: colors.purple,  label: 'NEGOTIATION'},
  BOOKED:      {bg: colors.successLight, text: colors.success, border: colors.success, label: 'BOOKED'},
  ASSIGNED:    {bg: colors.infoLight,    text: colors.info,    border: colors.info,    label: 'ASSIGNED'},
  FOLLOWUP:    {bg: colors.warningLight, text: colors.warning, border: colors.warning, label: 'FOLLOW-UP'},
};

// ─── Sub-components ───────────────────────────────────────────────────────

// KPI Card
interface KpiCardProps {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; accent: string; accentBg: string;
}
const KpiCard: React.FC<KpiCardProps> = ({label, value, sub, icon, accent, accentBg}) => (
  <View style={[styles.kpiCard, {borderLeftColor: accent}]}>
    <View style={[styles.kpiIconWrap, {backgroundColor: accentBg}]}>{icon}</View>
    <Text style={styles.kpiLabel}>{label}</Text>
    <Text style={[styles.kpiValue, {color: accent}]}>{value}</Text>
    <View style={styles.kpiSubRow}>
      <Text style={styles.kpiSub}>{sub}</Text>
      <ArrowUpRight size={12} color={accent} />
    </View>
  </View>
);

// Status Badge
const StatusBadge: React.FC<{status: string}> = ({status}) => {
  const key = (status || '').toUpperCase();
  const cfg = STATUS_MAP[key] ?? {bg: colors.border, text: colors.textSecondary, border: colors.textMuted, label: key};
  return (
    <View style={[styles.statusBadge, {backgroundColor: cfg.bg, borderColor: cfg.border}]}>
      <View style={[styles.statusDot, {backgroundColor: cfg.text}]} />
      <Text style={[styles.statusText, {color: cfg.text}]}>{cfg.label}</Text>
    </View>
  );
};

// Lead Card Row
interface LeadCardRowProps {
  name: string; code: string; phone: string;
  property: string; status: string;
  onView: () => void;
}
const LeadCardRow: React.FC<LeadCardRowProps> = ({name, code, phone, property, status, onView}) => (
  <View style={styles.leadCard}>
    {/* Left avatar + info */}
    <View style={styles.leadAvatar}>
      <Text style={styles.leadAvatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
    <View style={styles.leadMain}>
      <View style={styles.leadTopRow}>
        <View style={styles.leadNameBlock}>
          <Text style={styles.leadName} numberOfLines={1}>{name}</Text>
          <Text style={styles.leadCode}>{code}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
      <View style={styles.leadMeta}>
        <View style={styles.leadMetaItem}>
          <Phone size={11} color={colors.textMuted} />
          <Text style={styles.leadMetaText}>{phone}</Text>
        </View>
        <View style={styles.leadMetaItem}>
          <Building2 size={11} color={colors.textMuted} />
          <Text style={styles.leadMetaText} numberOfLines={1}>{property}</Text>
        </View>
      </View>
      {/* Action buttons */}
      <View style={styles.leadActions}>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={onView}>
          <Eye size={13} color={colors.secondary} />
          <Text style={styles.actionBtnOutlineText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline}>
          <MessageCircle size={13} color={colors.success} />
          <Text style={[styles.actionBtnOutlineText, {color: colors.success}]}>Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSolid}>
          <Phone size={13} color={colors.surface} />
          <Text style={styles.actionBtnSolidText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────
export const SalesExecutiveDashboardScreen = () => {
  const {user} = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('Today');

  const filters = ['Today', 'This Week', 'This Month', 'Custom'];

  useEffect(() => { fetchAll(); }, [timeFilter]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      let dData: any = null;
      let lData: any[] = [];

      try {
        const r = await salesExecutiveApi.getDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        dData = r.dashboard;
      } catch {
        dData = {
          assigned_leads_count: 3,
          site_visits_count: 1,
          converted_bookings: 0,
        };
      }

      try {
        const r = await salesExecutiveApi.getAssignedLeads({per_page: 10});
        lData = r.data?.data || r.data || [];
      } catch {
        lData = [
          {id: 1, first_name: 'Krishna', last_name: 'Kumar',   lead_code: 'LD-BRK2728', phone: '5555555555', project: {name: 'Apex Grand Residency'}, status: 'NEGOTIATION'},
          {id: 2, first_name: 'Amit',    last_name: 'Kulkarni', lead_code: 'LD-8801',    phone: '9988776655', project: {name: 'Apex Grand Residency'}, status: 'SITE VISIT'},
          {id: 3, first_name: 'Suresh',  last_name: 'Reddy',    lead_code: 'LD-8802',    phone: '9123456789', project: {name: 'Apex Grand Residency'}, status: 'NEGOTIATION'},
        ];
      }

      setDashboardData(dData);
      setAssignedLeads(lData);
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

  const firstName = (user?.name || 'Executive').split(' ')[0];
  const assignedCount = dashboardData?.assigned_leads_count || 0;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.headerGreeting}>{getGreeting()} 👋</Text>
            <Text style={styles.headerName} numberOfLines={1}>{user?.name || 'Sales Executive'}</Text>
            <Text style={styles.headerDate}>{getFormattedDate()} • Sales Executive</Text>
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
              <Text style={styles.heroBadgeText}>
                {assignedCount} Assigned · {dashboardData?.site_visits_count || 0} Site Visits
              </Text>
            </View>
            <Text style={styles.heroTitle}>Sales Executive{'\n'}Workspace</Text>
            <Text style={styles.heroSub}>Your pipeline, visits & follow-ups</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroIconBg}>
              <LayoutDashboard size={40} color="rgba(255,255,255,0.2)" />
            </View>
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroPrimaryBtn}>
              <Plus size={16} color={colors.primary} />
              <Text style={styles.heroPrimaryBtnText}>Add Customer Lead</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryBtn}>
              <ClipboardList size={16} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroSecondaryBtnText}>Open Pipeline</Text>
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

        {/* ── KPI Grid (3 cards) ────────────────────────────────────── */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>My Performance</Text>
          <Activity size={16} color={colors.secondary} />
        </View>
        <View style={styles.kpiGrid}>
          <KpiCard
            label="ASSIGNED QUEUE"
            value={`${assignedCount} Leads`}
            sub="Active Queue Inquiries"
            icon={<Users size={18} color={colors.secondary} />}
            accent={colors.secondary}
            accentBg={colors.infoLight}
          />
          <KpiCard
            label="SITE VISITS"
            value={`${dashboardData?.site_visits_count || 0} Visits`}
            sub="Scheduled Tours"
            icon={<MapPin size={18} color={colors.warning} />}
            accent={colors.warning}
            accentBg={colors.warningLight}
          />
          <KpiCard
            label="CONVERTED BOOKINGS"
            value={`${dashboardData?.converted_bookings || 0} Booked`}
            sub="Closed Deals"
            icon={<Trophy size={18} color={colors.success} />}
            accent={colors.success}
            accentBg={colors.successLight}
          />
        </View>

        {/* ── Assigned Leads Pipeline ───────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={[styles.sectionIconWrap, {backgroundColor: colors.infoLight}]}>
                <ClipboardList size={16} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Your Assigned Customer Leads</Text>
                <Text style={styles.sectionSub}>Update stage, log notes & schedule follow-ups</Text>
              </View>
            </View>
          </View>

          {/* Column headers */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, {flex: 2}]}>Customer Lead</Text>
            <Text style={[styles.tableHeaderText, {flex: 1.5}]}>Project</Text>
            <Text style={[styles.tableHeaderText, {flex: 1.2, textAlign: 'right'}]}>Status</Text>
          </View>
          <View style={styles.tableDivider} />

          {assignedLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No leads assigned yet</Text>
            </View>
          ) : (
            assignedLeads.map((lead, idx) => (
              <View key={lead.id}>
                <LeadCardRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  status={lead.status}
                  onView={() => {}}
                />
                {idx < assignedLeads.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))
          )}

          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>Open Full Pipeline</Text>
            <ChevronRight size={16} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* ── Quick Actions ─────────────────────────────────────────── */}
        <View style={styles.quickActionsGrid}>
          {[
            {icon: <MapPin size={20} color={colors.warning} />,    bg: colors.warningLight,  label: 'Site Visits',  sub: 'Manage tours'},
            {icon: <ClipboardList size={20} color={colors.accent} />, bg: colors.purpleLight, label: 'Tasks',        sub: 'Pending tasks'},
            {icon: <MessageCircle size={20} color={colors.success} />, bg: colors.successLight, label: 'Follow-ups', sub: 'Scheduled calls'},
            {icon: <Building2 size={20} color={colors.secondary} />, bg: colors.infoLight,   label: 'Properties',  sub: 'Browse catalog'},
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.quickActionCard} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, {backgroundColor: item.bg}]}>{item.icon}</View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
              <Text style={styles.quickActionSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: spacing.xl}} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},

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
  headerLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  headerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  headerAvatarText: {color: colors.surface, fontSize: 18, fontWeight: '700'},
  headerGreeting: {fontSize: 11, color: colors.textMuted, fontWeight: '500'},
  headerName: {fontSize: 15, fontWeight: '700', color: colors.primary, maxWidth: SCREEN_WIDTH * 0.5},
  headerDate: {fontSize: 10, color: colors.textMuted},
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  bellDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5, borderColor: colors.surface,
  },

  scrollContent: {paddingBottom: 20},

  // Hero Banner
  heroBanner: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: colors.accent,   // Indigo/purple for SE (distinct from Manager navy & Broker navy)
    borderRadius: 20, padding: 22,
    overflow: 'hidden', position: 'relative',
  },
  heroLeft: {flex: 1},
  heroRight: {position: 'absolute', right: 16, top: 16},
  heroIconBg: {opacity: 0.5},
  heroBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.4)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 10, gap: 5,
  },
  heroBadgeText: {color: colors.accentGold, fontSize: 11, fontWeight: '600'},
  heroTitle: {fontSize: 24, fontWeight: '800', color: colors.surface, lineHeight: 30, marginBottom: 6},
  heroSub: {fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 20},
  heroActions: {flexDirection: 'row', gap: 10},
  heroPrimaryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, gap: 6,
  },
  heroPrimaryBtnText: {color: colors.accent, fontSize: 12, fontWeight: '700'},
  heroSecondaryBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, gap: 6,
  },
  heroSecondaryBtnText: {color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600'},

  // Filters
  filterScroll: {flexGrow: 0, marginTop: 16},
  filterRow: {paddingHorizontal: 16, gap: 8},
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: {backgroundColor: colors.accent, borderColor: colors.accent},
  filterText: {fontSize: 12, color: colors.textSecondary, fontWeight: '600'},
  filterTextActive: {color: colors.surface},

  // Section Label
  sectionLabelRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, marginTop: 22, marginBottom: 10,
  },
  sectionLabel: {fontSize: 14, fontWeight: '700', color: colors.text},

  // KPI Grid — 3 cards spanning full width
  kpiGrid: {paddingHorizontal: 12, gap: 10},
  kpiCard: {
    backgroundColor: colors.surface,
    borderRadius: 16, padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  kpiIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  kpiLabel: {fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.8, marginBottom: 4},
  kpiValue: {fontSize: 22, fontWeight: '800', marginBottom: 4},
  kpiSubRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  kpiSub: {fontSize: 10, color: colors.textMuted, flex: 1},

  // Section Cards
  sectionCard: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: colors.surface, borderRadius: 20, padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: {fontSize: 14, fontWeight: '700', color: colors.text},
  sectionSub: {fontSize: 11, color: colors.textMuted, marginTop: 1},

  // Table header
  tableHeader: {flexDirection: 'row', paddingBottom: 8},
  tableHeaderText: {
    fontSize: 10, fontWeight: '700',
    color: colors.textMuted, letterSpacing: 0.5,
  },
  tableDivider: {height: 1, backgroundColor: colors.border, marginBottom: 4},

  // Lead Card Row
  leadCard: {
    flexDirection: 'row', paddingVertical: 12, alignItems: 'flex-start',
  },
  leadAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  leadAvatarText: {color: colors.surface, fontSize: 16, fontWeight: '700'},
  leadMain: {flex: 1},
  leadTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 3,
  },
  leadNameBlock: {flex: 1, marginRight: 8},
  leadName: {fontSize: 14, fontWeight: '700', color: colors.text},
  leadCode: {fontSize: 11, color: colors.accent, fontWeight: '600', marginTop: 1},
  leadMeta: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10},
  leadMetaItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  leadMetaText: {fontSize: 11, color: colors.textMuted},
  leadActions: {flexDirection: 'row', gap: 8},
  actionBtnOutline: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.background,
  },
  actionBtnOutlineText: {fontSize: 11, color: colors.secondary, fontWeight: '600'},
  actionBtnSolid: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, backgroundColor: colors.secondary,
  },
  actionBtnSolidText: {fontSize: 11, color: colors.surface, fontWeight: '700'},

  // Status Badge
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, gap: 4,
  },
  statusDot: {width: 5, height: 5, borderRadius: 3},
  statusText: {fontSize: 9, fontWeight: '700', letterSpacing: 0.4},

  rowDivider: {height: 1, backgroundColor: colors.borderLight},
  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 14, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: colors.borderLight, gap: 4,
  },
  viewAllText: {fontSize: 13, color: colors.secondary, fontWeight: '600'},

  emptyState: {alignItems: 'center', paddingVertical: 24, gap: 8},
  emptyText: {fontSize: 13, color: colors.textMuted},

  // Quick Action Grid
  quickActionsGrid: {
    marginHorizontal: 16, marginTop: 16,
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16, padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  quickActionIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  quickActionLabel: {fontSize: 14, fontWeight: '700', color: colors.text},
  quickActionSub: {fontSize: 11, color: colors.textMuted, marginTop: 2},
});
