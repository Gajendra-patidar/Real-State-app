import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Search,
  Users,
  Phone,
  Mail,
  Building2,
  Calendar,
  ChevronRight,
  X,
  ArrowUpRight,
  Hash,
  MapPin,
  Clock,
  MessageCircle,
  Tag,
  Info,
  RefreshCw,
} from 'lucide-react-native';
import {brokerApi} from '../../services/api/brokerApi';
import {colors} from '../../theme/colors';

// ─── Types (matching actual API response) ────────────────────────────────────
interface Lead {
  id: number;
  lead_code: string;
  first_name: string;
  last_name: string;
  customer_name: string;
  phone: string;
  email: string;
  project: {
    id: number;
    name: string;
    code: string;
    city: string;
  } | null;
  property_type: string | null;
  unit_type: string | null;
  budget_min: number | null;
  budget_max: number | null;
  broker_visible_status: string;
  broker_visible_message: string;
  submitted_at: string;
  last_updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (ds: string) => {
  try {
    return new Date(ds).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return ds;
  }
};

const formatDateTime = (ds: string) => {
  try {
    return new Date(ds).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return ds;
  }
};

const formatBudget = (min: number | null, max: number | null) => {
  if (!min && !max) return null;
  const fmt = (n: number) => `₹${(n / 100000).toFixed(0)}L`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

// ─── Status Map (broker_visible_status values) ────────────────────────────────
const STATUS_MAP: Record<string, {bg: string; text: string; dot: string}> = {
  SUBMITTED:   {bg: colors.infoLight,    text: colors.info,     dot: colors.info},
  ASSIGNED:    {bg: '#EDE9FE',           text: '#7C3AED',       dot: '#7C3AED'},
  NEGOTIATION: {bg: colors.purpleLight,  text: colors.purple,   dot: colors.purple},
  BOOKED:      {bg: colors.successLight, text: colors.success,  dot: colors.success},
  LOST:        {bg: colors.errorLight,   text: colors.error,    dot: colors.error},
  NEW:         {bg: colors.warningLight, text: colors.warning,  dot: colors.warning},
};

const getStatusCfg = (status: string) => {
  const key = (status || '').toUpperCase();
  return STATUS_MAP[key] ?? {bg: colors.border, text: colors.textSecondary, dot: colors.textMuted};
};

const STATUS_FILTERS = ['All', 'Submitted', 'Assigned', 'Negotiation', 'Booked', 'Lost'];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({status, large}: {status: string; large?: boolean}) => {
  const cfg = getStatusCfg(status);
  return (
    <View style={[styles.badge, {backgroundColor: cfg.bg}, large && styles.badgeLarge]}>
      <View style={[styles.badgeDot, {backgroundColor: cfg.dot}]} />
      <Text style={[styles.badgeText, {color: cfg.text}, large && styles.badgeTextLarge]}>
        {status || '—'}
      </Text>
    </View>
  );
};

// ─── Detail Row (used inside modal) ──────────────────────────────────────────
const DetailRow = ({
  icon, label, value, accent,
}: {
  icon: React.ReactNode; label: string; value?: string | null; accent?: string;
}) => {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconWrap}>{icon}</View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, accent ? {color: accent} : {}]}>{value}</Text>
      </View>
    </View>
  );
};

// ─── Lead Detail Modal ────────────────────────────────────────────────────────
const LeadDetailModal = ({
  lead, visible, onClose,
}: {
  lead: Lead | null; visible: boolean; onClose: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0, useNativeDriver: true, friction: 8, tension: 70,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600, duration: 250, useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!lead) return null;

  const cfg        = getStatusCfg(lead.broker_visible_status);
  const budget     = formatBudget(lead.budget_min, lead.budget_max);
  const initial    = (lead.customer_name || lead.first_name || '?')[0].toUpperCase();

  const handleCall = () => {
    if (lead.phone) Linking.openURL(`tel:${lead.phone}`);
  };
  const handleEmail = () => {
    if (lead.email) Linking.openURL(`mailto:${lead.email}`);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalSheet,
            {paddingBottom: insets.bottom + 16, transform: [{translateY: slideAnim}]},
          ]}>
          {/* ── Handle ───────────────────────────────────────────── */}
          <View style={styles.sheetHandle} />

          {/* ── Close button ─────────────────────────────────────── */}
          <TouchableOpacity style={styles.sheetClose} onPress={onClose}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ── Hero: Avatar + Name + Status ─────────────────── */}
            <View style={[styles.sheetHero, {borderBottomColor: cfg.dot + '30'}]}>
              <View style={[styles.sheetAvatar, {backgroundColor: cfg.dot + '18'}]}>
                <Text style={[styles.sheetAvatarText, {color: cfg.dot}]}>{initial}</Text>
              </View>
              <Text style={styles.sheetName}>{lead.customer_name || `${lead.first_name} ${lead.last_name}`}</Text>
              <View style={styles.sheetCodeRow}>
                <Hash size={12} color={colors.textMuted} />
                <Text style={styles.sheetCode}>{lead.lead_code}</Text>
              </View>
              <StatusBadge status={lead.broker_visible_status} large />
            </View>

            {/* ── Status Message Banner ────────────────────────── */}
            {lead.broker_visible_message ? (
              <View style={[styles.messageBanner, {backgroundColor: cfg.bg, borderLeftColor: cfg.dot}]}>
                <Info size={14} color={cfg.text} style={{marginTop: 1}} />
                <Text style={[styles.messageText, {color: cfg.text}]}>
                  {lead.broker_visible_message}
                </Text>
              </View>
            ) : null}

            {/* ── Contact Section ──────────────────────────────── */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>Contact Information</Text>

              <DetailRow
                icon={<Phone size={14} color={colors.info} />}
                label="Phone"
                value={lead.phone}
                accent={colors.info}
              />
              <DetailRow
                icon={<Mail size={14} color={colors.purple} />}
                label="Email"
                value={lead.email}
                accent={colors.purple}
              />

              {/* Quick Action Buttons */}
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={[styles.contactBtn, {backgroundColor: colors.infoLight}]}
                  onPress={handleCall}>
                  <Phone size={16} color={colors.info} />
                  <Text style={[styles.contactBtnText, {color: colors.info}]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contactBtn, {backgroundColor: colors.purpleLight}]}
                  onPress={handleEmail}>
                  <Mail size={16} color={colors.purple} />
                  <Text style={[styles.contactBtnText, {color: colors.purple}]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contactBtn, {backgroundColor: colors.successLight}]}
                  onPress={() => Linking.openURL(`https://wa.me/91${lead.phone}`)}>
                  <MessageCircle size={16} color={colors.success} />
                  <Text style={[styles.contactBtnText, {color: colors.success}]}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Project Section ──────────────────────────────── */}
            {lead.project ? (
              <View style={styles.sheetSection}>
                <Text style={styles.sheetSectionTitle}>Project Details</Text>

                <View style={styles.projectCard}>
                  <View style={styles.projectCardHeader}>
                    <View style={styles.projectIconWrap}>
                      <Building2 size={18} color={colors.secondary} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.projectName}>{lead.project.name}</Text>
                      <Text style={styles.projectCode}>{lead.project.code}</Text>
                    </View>
                  </View>
                  <View style={styles.projectMetaRow}>
                    <MapPin size={12} color={colors.textMuted} />
                    <Text style={styles.projectCity}>{lead.project.city}</Text>
                  </View>
                </View>

                {/* Property prefs */}
                {(lead.property_type || lead.unit_type || budget) ? (
                  <View style={styles.prefRow}>
                    {lead.unit_type ? (
                      <View style={styles.prefChip}>
                        <Tag size={11} color={colors.accent} />
                        <Text style={styles.prefChipText}>{lead.unit_type}</Text>
                      </View>
                    ) : null}
                    {lead.property_type ? (
                      <View style={styles.prefChip}>
                        <Building2 size={11} color={colors.accent} />
                        <Text style={styles.prefChipText}>{lead.property_type}</Text>
                      </View>
                    ) : null}
                    {budget ? (
                      <View style={styles.prefChip}>
                        <Text style={styles.prefChipText}>{budget}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* ── Timeline Section ─────────────────────────────── */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>Timeline</Text>

              <View style={styles.timeline}>
                {/* Submitted */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDotWrap}>
                    <View style={[styles.timelineDot, {backgroundColor: colors.success}]} />
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>Submitted</Text>
                    <View style={styles.timelineTimeRow}>
                      <Clock size={11} color={colors.textMuted} />
                      <Text style={styles.timelineTime}>{formatDateTime(lead.submitted_at)}</Text>
                    </View>
                  </View>
                </View>

                {/* Last Updated */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDotWrap}>
                    <View style={[styles.timelineDot, {backgroundColor: cfg.dot}]} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>
                      Status: <Text style={{color: cfg.text, fontWeight: '700'}}>{lead.broker_visible_status}</Text>
                    </Text>
                    <View style={styles.timelineTimeRow}>
                      <RefreshCw size={11} color={colors.textMuted} />
                      <Text style={styles.timelineTime}>{formatDateTime(lead.last_updated_at)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={{height: 8}} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Lead Card ────────────────────────────────────────────────────────────────
const LeadCard = ({item, onPress}: {item: Lead; onPress: () => void}) => {
  const cfg     = getStatusCfg(item.broker_visible_status);
  const initial = (item.customer_name || item.first_name || '?')[0].toUpperCase();
  const budget  = formatBudget(item.budget_min, item.budget_max);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Left accent bar */}
      <View style={[styles.cardAccent, {backgroundColor: cfg.dot}]} />

      <View style={styles.cardBody}>
        {/* Row 1: Avatar + Name + Badge */}
        <View style={styles.cardTopRow}>
          <View style={[styles.avatar, {backgroundColor: cfg.dot + '18'}]}>
            <Text style={[styles.avatarText, {color: cfg.dot}]}>{initial}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.customer_name || `${item.first_name} ${item.last_name}`}
            </Text>
            <Text style={styles.cardCode}>{item.lead_code || '—'}</Text>
          </View>
          <StatusBadge status={item.broker_visible_status} />
        </View>

        {/* Row 2: Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Phone size={11} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.phone || '—'}</Text>
          </View>
          {item.project?.name ? (
            <View style={styles.metaItem}>
              <Building2 size={11} color={colors.textMuted} />
              <Text style={styles.metaText} numberOfLines={1}>{item.project.name}</Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Calendar size={11} color={colors.textMuted} />
            <Text style={styles.metaText}>{formatDate(item.submitted_at)}</Text>
          </View>
        </View>

        {/* Row 3: Pref chips */}
        {(budget || item.unit_type || item.property_type) ? (
          <View style={styles.chipsRow}>
            {item.unit_type ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item.unit_type}</Text>
              </View>
            ) : null}
            {item.property_type ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item.property_type}</Text>
              </View>
            ) : null}
            {budget ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{budget}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Status message preview */}
        {item.broker_visible_message ? (
          <Text style={styles.cardMessage} numberOfLines={1}>
            {item.broker_visible_message}
          </Text>
        ) : null}
      </View>

      <View style={styles.cardChevron}>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({searching}: {searching: boolean}) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIcon}>
      <Users size={40} color={colors.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>
      {searching ? 'No matching leads' : 'No leads yet'}
    </Text>
    <Text style={styles.emptySub}>
      {searching
        ? 'Try a different name, code or status'
        : 'Submit a new lead to start tracking commissions'}
    </Text>
  </View>
);

// ─── Mock Data (matches actual API shape) ─────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  {
    id: 15, lead_code: 'LD-4ZDID6RZ',
    first_name: 'Gajendra', last_name: 'Patidar', customer_name: 'Gajendra Patidar',
    phone: '6979876767', email: 'ganesh12@gmail.com',
    project: {id: 1, name: 'Apex Grand Residency', code: 'AGR-01', city: 'Hyderabad'},
    property_type: null, unit_type: null, budget_min: null, budget_max: null,
    broker_visible_status: 'Submitted',
    broker_visible_message: 'Lead successfully submitted and waiting for manager review.',
    submitted_at: '2026-10-07T05:00:22.000000Z',
    last_updated_at: '2026-10-07T05:00:22.000000Z',
  },
  {
    id: 2, lead_code: 'LD-8802',
    first_name: 'Suresh', last_name: 'Reddy', customer_name: 'Suresh Reddy',
    phone: '9123456789', email: 'suresh.reddy@yahoo.com',
    project: {id: 1, name: 'Apex Grand Residency', code: 'AGR-01', city: 'Hyderabad'},
    property_type: null, unit_type: '3 BHK', budget_min: 4500000, budget_max: 6000000,
    broker_visible_status: 'Lost',
    broker_visible_message: 'Lead status updated to Lost',
    submitted_at: '2026-09-29T07:17:55.000000Z',
    last_updated_at: '2026-10-06T08:59:38.000000Z',
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const BrokerLeadsScreen = () => {
  const insets = useSafeAreaInsets();
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [filtered, setFiltered]     = useState<Lead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery]           = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setModalVisible(true);
  };
  const closeDetail = () => setModalVisible(false);

  const fetchLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await brokerApi.getBrokerLeads({per_page: 50});
      setLeads(res.data || []);
    } catch {
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Apply search + status filter
  useEffect(() => {
    let result = [...leads];
    if (activeFilter !== 'All') {
      result = result.filter(
        l => (l.broker_visible_status || '').toLowerCase() === activeFilter.toLowerCase(),
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(l =>
        (l.customer_name || '').toLowerCase().includes(q) ||
        (l.lead_code || '').toLowerCase().includes(q) ||
        (l.phone || '').includes(q) ||
        (l.email || '').toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [leads, activeFilter, query]);

  const statusCount = (s: string) =>
    s === 'All'
      ? leads.length
      : leads.filter(l => (l.broker_visible_status || '').toLowerCase() === s.toLowerCase()).length;

  // Booked count for header stat
  const bookedCount = leads.filter(
    l => (l.broker_visible_status || '').toLowerCase() === 'booked',
  ).length;

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Leads</Text>
          <Text style={styles.headerSub}>{leads.length} total referrals</Text>
        </View>
        {bookedCount > 0 ? (
          <View style={styles.headerStat}>
            <ArrowUpRight size={14} color={colors.success} />
            <Text style={styles.headerStatText}>{bookedCount} Booked</Text>
          </View>
        ) : null}
      </View>

      {/* ── Search ────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, code, phone or email…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Status Filter Chips ───────────────────────────────────── */}
      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={s => s}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
        renderItem={({item: s}) => {
          const active = activeFilter === s;
          const cfg = getStatusCfg(s);
          return (
            <TouchableOpacity
              style={[
                styles.filterChip,
                active && {backgroundColor: cfg.dot, borderColor: cfg.dot},
              ]}
              onPress={() => setActiveFilter(s)}>
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {s}
              </Text>
              <View style={[styles.countBubble, active && styles.countBubbleActive]}>
                <Text style={[styles.countText, active && styles.countTextActive]}>
                  {statusCount(s)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* ── Lead List ────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLeads(true)}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
        ListEmptyComponent={<EmptyState searching={query.length > 0 || activeFilter !== 'All'} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => (
          <LeadCard item={item} onPress={() => openDetail(item)} />
        )}
      />

      {/* ── Detail Modal ─────────────────────────────────────────── */}
      <LeadDetailModal
        lead={selectedLead}
        visible={modalVisible}
        onClose={closeDetail}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:       {flex: 1, backgroundColor: colors.background},
  loaderWrap: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},

  // ── Header ──
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: {fontSize: 20, fontWeight: '800', color: colors.primary},
  headerSub:   {fontSize: 12, color: colors.textMuted, marginTop: 2},
  headerStat: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.successLight, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, gap: 4,
  },
  headerStatText: {fontSize: 12, fontWeight: '700', color: colors.success},

  // ── Search ──
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    marginHorizontal: 16, marginTop: 14, marginBottom: 2,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, height: 44,
  },
  searchIcon:  {marginRight: 8},
  searchInput: {flex: 1, fontSize: 14, color: colors.text},
  clearBtn:    {padding: 4},

  // ── Filters ──
  filterScroll: {flexGrow: 0, marginTop: 12, marginBottom: 4},
  filterRow: {paddingHorizontal: 16, gap: 8},
  filterChip: {
    height: 32,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6,
    marginBottom: '12%',
    borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  filterChipText:       {fontSize: 12, fontWeight: '600', color: colors.textSecondary},
  filterChipTextActive: {color: colors.surface},
  countBubble: {
    backgroundColor: colors.background, borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  countBubbleActive: {backgroundColor: 'rgba(255,255,255,0.25)'},
  countText:         {fontSize: 10, fontWeight: '700', color: colors.textSecondary},
  countTextActive:   {color: colors.surface},

  // ── List ──
  listContent: {paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20},
  listEmpty:   {flex: 1},
  separator:   {height: 10},

  // ── Card ──
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardAccent:  {width: 4},
  cardBody:    {flex: 1, padding: 14},
  cardChevron: {justifyContent: 'center', paddingRight: 12},
  cardTopRow:  {flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10},
  avatar: {width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center'},
  avatarText:  {fontSize: 16, fontWeight: '800'},
  nameBlock:   {flex: 1},
  cardName:    {fontSize: 14, fontWeight: '700', color: colors.text},
  cardCode:    {fontSize: 11, color: colors.secondary, fontWeight: '600', marginTop: 1},
  metaRow:     {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8},
  metaItem:    {flexDirection: 'row', alignItems: 'center', gap: 4},
  metaText:    {fontSize: 11, color: colors.textMuted},
  chipsRow:    {flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 4},
  chip:        {backgroundColor: colors.infoLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3},
  chipText:    {fontSize: 11, color: colors.info, fontWeight: '600'},
  cardMessage: {fontSize: 11, color: colors.textMuted, fontStyle: 'italic', marginTop: 4},

  // ── Badge ──
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4,
  },
  badgeLarge:    {paddingHorizontal: 12, paddingVertical: 6},
  badgeDot:      {width: 6, height: 6, borderRadius: 3},
  badgeText:     {fontSize: 10, fontWeight: '700'},
  badgeTextLarge:{fontSize: 12, fontWeight: '700'},

  // ── Empty State ──
  emptyWrap:  {flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60},
  emptyIcon:  {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 16},
  emptyTitle: {fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6},
  emptySub:   {fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20},

  // ── Detail Modal ──
  modalOverlay: {flex: 1, justifyContent: 'flex-end'},
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: 12,
  },
  sheetClose: {
    position: 'absolute', top: 16, right: 16,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },

  // ── Hero ──
  sheetHero: {
    alignItems: 'center', paddingHorizontal: 24,
    paddingBottom: 20, borderBottomWidth: 1,
  },
  sheetAvatar: {
    width: 70, height: 70, borderRadius: 35,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  sheetAvatarText: {fontSize: 28, fontWeight: '800'},
  sheetName:       {fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4, textAlign: 'center'},
  sheetCodeRow:    {flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10},
  sheetCode:       {fontSize: 13, color: colors.secondary, fontWeight: '700', letterSpacing: 0.5},

  // ── Status Banner ──
  messageBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, marginTop: 16,
    padding: 12, borderRadius: 12, borderLeftWidth: 3,
  },
  messageText: {flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '500'},

  // ── Section ──
  sheetSection: {
    marginHorizontal: 20, marginTop: 20,
    backgroundColor: colors.background, borderRadius: 16, padding: 16,
  },
  sheetSectionTitle: {
    fontSize: 12, fontWeight: '800', color: colors.textMuted,
    letterSpacing: 0.8, marginBottom: 14, textTransform: 'uppercase',
  },

  // ── Detail Row ──
  detailRow:      {flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12},
  detailIconWrap: {width: 32, height: 32, borderRadius: 8, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center'},
  detailContent:  {flex: 1},
  detailLabel:    {fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 2},
  detailValue:    {fontSize: 14, color: colors.text, fontWeight: '600'},

  // ── Contact Actions ──
  contactActions: {flexDirection: 'row', gap: 10, marginTop: 6},
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 10, gap: 6,
  },
  contactBtnText: {fontSize: 12, fontWeight: '700'},

  // ── Project Card ──
  projectCard: {backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 10},
  projectCardHeader: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8},
  projectIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.infoLight, justifyContent: 'center', alignItems: 'center',
  },
  projectName:    {fontSize: 15, fontWeight: '700', color: colors.text},
  projectCode:    {fontSize: 11, color: colors.secondary, fontWeight: '600', marginTop: 2},
  projectMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  projectCity:    {fontSize: 12, color: colors.textMuted},

  // ── Pref Chips ──
  prefRow:  {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  prefChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  prefChipText: {fontSize: 12, color: colors.text, fontWeight: '600'},

  // ── Timeline ──
  timeline:      {gap: 0},
  timelineItem:  {flexDirection: 'row', gap: 12},
  timelineDotWrap: {alignItems: 'center', width: 20},
  timelineDot:   {width: 12, height: 12, borderRadius: 6, marginTop: 2},
  timelineLine:  {width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4, marginBottom: 4, alignSelf: 'center'},
  timelineContent: {flex: 1, paddingBottom: 18},
  timelineLabel: {fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4},
  timelineTimeRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  timelineTime:  {fontSize: 11, color: colors.textMuted},
});
