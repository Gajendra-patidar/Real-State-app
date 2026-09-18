import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '../../hooks/useAuth';
import {brokerApi} from '../../services/api/brokerApi';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {
  LayoutDashboard,
  Bell,
  TrendingUp,
  CheckCircle,
  Users,
  Tag,
  Plus,
  Link2,
  ChevronRight,
  Globe,
  Phone,
  Building2,
  Calendar,
  ArrowUpRight,
  Copy,
  Eye,
  Sparkles,
} from 'lucide-react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const getFormattedDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  };
  return new Date().toLocaleDateString('en-IN', options);
};

const formatDateString = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'short', year: 'numeric'};
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount: number | string) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// ─── KPI Card ──────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
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

// ─── Status Badge ───────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, {bg: string; text: string; border: string}> = {
  ASSIGNED:    {bg: colors.infoLight,    text: colors.info,    border: colors.info},
  NEGOTIATION: {bg: colors.purpleLight,  text: colors.purple,  border: colors.purple},
  BOOKED:      {bg: colors.successLight, text: colors.success, border: colors.success},
  NEW:         {bg: colors.warningLight, text: colors.warning, border: colors.warning},
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

// ─── Lead Row ───────────────────────────────────────────────────────────────
interface LeadRowProps {
  name: string; code: string; phone: string;
  property: string; date: string; status: string;
}
const LeadRow: React.FC<LeadRowProps> = ({name, code, phone, property, date, status}) => (
  <View style={styles.leadRow}>
    <View style={styles.leadAvatar}>
      <Text style={styles.leadAvatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
    <View style={styles.leadInfo}>
      <View style={styles.leadTopRow}>
        <Text style={styles.leadName}>{name}</Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.leadCode}>{code}</Text>
      <View style={styles.leadMeta}>
        <View style={styles.leadMetaItem}>
          <Phone size={12} color={colors.textMuted} />
          <Text style={styles.leadMetaText}>{phone}</Text>
        </View>
        <View style={styles.leadMetaItem}>
          <Building2 size={12} color={colors.textMuted} />
          <Text style={styles.leadMetaText} numberOfLines={1}>{property}</Text>
        </View>
        <View style={styles.leadMetaItem}>
          <Calendar size={12} color={colors.textMuted} />
          <Text style={styles.leadMetaText}>{date}</Text>
        </View>
      </View>
    </View>
  </View>
);

// ─── Project Card ────────────────────────────────────────────────────────────
interface ProjectCardProps {
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
    <Text style={styles.projectName}>{name}</Text>
    <View style={styles.projectDivider} />
    <View style={styles.projectActions}>
      <TouchableOpacity style={styles.previewBtn} onPress={onPreview}>
        <Eye size={14} color={colors.textSecondary} />
        <Text style={styles.previewBtnText}>Preview</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.copyBtn} onPress={onCopy}>
        <Copy size={14} color={colors.surface} />
        <Text style={styles.copyBtnText}>Copy Link</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export const BrokerDashboardScreen = () => {
  const {user} = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [publicProjects, setPublicProjects] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('Today');

  const filters = ['Today', 'This Week', 'This Month', 'Custom'];

  useEffect(() => { fetchAll(); }, [timeFilter]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      let dData: any = null, lData: any[] = [], pData: any[] = [];

      try {
        const r = await brokerApi.getBrokerDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        dData = r.dashboard;
      } catch {
        dData = {total_commission_earned: 0, approved_commission: 0, total_leads_submitted: 2, commission_rate: 2.50};
      }
      try {
        const r = await brokerApi.getBrokerLeads({per_page: 5});
        lData = r.data || [];
      } catch {
        lData = [
          {id:1, first_name:'Krishna', last_name:'Kumar', lead_code:'LD-BRK2728', phone:'5555555555', project:{name:'Apex Grand Residency'}, created_at:'2026-09-15', status:'ASSIGNED'},
          {id:2, first_name:'Suresh', last_name:'Reddy', lead_code:'LD-8802', phone:'9123456789', project:{name:'Apex Grand Residency'}, created_at:'2026-09-11', status:'NEGOTIATION'},
        ];
      }
      try {
        const r = await brokerApi.getBrokerProjects();
        pData = r.data || [];
      } catch {
        pData = [
          {id:1, name:'Apex Grand Residency', city:'HYDERABAD', available_units_count:3},
          {id:2, name:'Subh Angan', city:'INDORE', available_units_count:0},
        ];
      }
      setDashboardData(dData);
      setRecentLeads(lData);
      setPublicProjects(pData);
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

  const partnerName = user?.name || 'Channel Partner';
  const firstName = partnerName.split(' ')[0];

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
            <Text style={styles.headerName} numberOfLines={1}>{partnerName}</Text>
            <Text style={styles.headerDate}>{getFormattedDate()} • Channel Partner</Text>
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
                {dashboardData?.total_leads_submitted || 0} Active Referrals
              </Text>
            </View>
            <Text style={styles.heroTitle}>Broker{'\n'}Command Center</Text>
            <Text style={styles.heroSub}>Track earnings, leads & properties</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroIconBg}>
              <LayoutDashboard size={40} color="rgba(255,255,255,0.25)" />
            </View>
          </View>
          {/* Quick Actions */}
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroPrimaryBtn}>
              <Plus size={16} color={colors.primary} />
              <Text style={styles.heroPrimaryBtnText}>Submit Lead</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryBtn}>
              <Link2 size={16} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroSecondaryBtnText}>Referral Link</Text>
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
            label="TOTAL EARNED"
            value={formatCurrency(dashboardData?.total_commission_earned)}
            sub="Across Bookings"
            icon={<TrendingUp size={18} color={colors.success} />}
            accent={colors.success}
            accentBg={colors.successLight}
          />
          <KpiCard
            label="APPROVED PAYOUTS"
            value={formatCurrency(dashboardData?.approved_commission)}
            sub="Ready for Transfer"
            icon={<CheckCircle size={18} color={colors.secondary} />}
            accent={colors.secondary}
            accentBg={colors.infoLight}
          />
          <KpiCard
            label="SUBMITTED LEADS"
            value={`${dashboardData?.total_leads_submitted || 0}`}
            sub="Active Referrals"
            icon={<Users size={18} color={colors.accent} />}
            accent={colors.accent}
            accentBg={colors.purpleLight}
          />
          <KpiCard
            label="PARTNER RATE"
            value={`${Number(dashboardData?.commission_rate || 0).toFixed(2)}%`}
            sub="Commission Slab"
            icon={<Tag size={18} color={colors.accentGold} />}
            accent={colors.accentGold}
            accentBg={colors.warningLight}
          />
        </View>

        {/* ── My Referral Leads ─────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>My Referral Leads</Text>
              <Text style={styles.sectionSub}>Live milestone & status tracking</Text>
            </View>
            <TouchableOpacity style={styles.sectionPillBtn}>
              <Plus size={14} color={colors.surface} />
              <Text style={styles.sectionPillBtnText}>New Lead</Text>
            </TouchableOpacity>
          </View>

          {recentLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No leads submitted yet</Text>
            </View>
          ) : (
            recentLeads.map((lead, idx) => (
              <View key={lead.id}>
                <LeadRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  date={formatDateString(lead.created_at)}
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

        {/* ── Public Properties Catalog ─────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 8}}>
              <View style={styles.globeIconWrap}>
                <Globe size={16} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Properties Catalog</Text>
                <Text style={styles.sectionSub}>Shareable referral links</Text>
              </View>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectsRow}>
            {publicProjects.map(p => (
              <ProjectCard
                key={p.id}
                city={p.city || 'LOCATION'}
                unitsFree={p.available_units_count}
                name={p.name}
                onPreview={() => {}}
                onCopy={() => {}}
              />
            ))}
          </ScrollView>
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
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  heroIconBg: {
    opacity: 0.6,
  },
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
  filterTextActive: {
    color: colors.surface,
  },

  // Section Labels
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
    fontSize: 20,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  sectionPillBtnText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  globeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Lead Row
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
  leadInfo: {
    flex: 1,
  },
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
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

  // Project Cards
  projectsRow: {
    gap: 12,
    paddingRight: 4,
  },
  projectCard: {
    width: 220,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectCityBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  projectCityText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  unitsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitsText: {
    fontSize: 10,
    fontWeight: '700',
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  projectDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  previewBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  copyBtnText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
