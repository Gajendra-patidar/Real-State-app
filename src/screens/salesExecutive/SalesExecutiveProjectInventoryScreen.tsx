import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveProjectInventoryScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const project = route.params?.project || { name: 'Apex Grand Residency', code: 'AGR-01', location_address: 'Hyderabad' };

  const [activeTab, setActiveTab] = useState('Inventory');
  const [isTabModalVisible, setIsTabModalVisible] = useState(false);

  const [filter, setFilter] = useState('All Towers');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const tabs = [
    { id: 'Inventory', label: 'Inventory & Floor Matrix' },
    { id: 'Bookings', label: 'Confirmed Bookings (1)' },
    { id: 'Leads', label: 'Interested Leads (15)' },
    { id: 'Specs', label: 'Specs & Amenities' }
  ];

  const filterOptions = [
    { label: 'All Towers', type: 'heading' },
    { label: 'Tower A (Luxury Block)', type: 'option' },
    { label: 'Tower B', type: 'option' },
    { label: 'All Unit Types', type: 'heading' },
    { label: '2BHK', type: 'option' },
    { label: '3BHK', type: 'option' },
    { label: '4BHK/Villa', type: 'option' },
    { label: 'All Statuses', type: 'heading' },
    { label: 'Available', type: 'option' },
    { label: 'Hold/Reserved', type: 'option' },
    { label: 'Sold/Booked', type: 'option' }
  ];

  const leads = [
    { name: 'Harshit Yadav', phone: '6260498383', email: 'hejekwkk@gmal.com', req: '2BHK', exec: 'Vikas Sales', score: '80/100', stage: 'CONTACTED' },
    { name: 'Harshit Yadav', phone: '6260498383', email: 'hejekwkk@gmal.com', req: '2BHK', exec: 'Vikram Singh (Executive 1)', score: '80/100', stage: 'CONTACTED' },
    { name: 'Amit Kulkarni', phone: '9988776655', email: 'amit.k@gmail.com', req: '2BHK', exec: 'Vikram Singh (Executive 1)', score: '80/100', stage: 'NEGOTIATION' },
    { name: 'Rohan Verma', phone: '9811000001', email: 'rohan.verma@gmail.com', req: '2BHK', exec: 'Amit Kulkami (Executive 5)', score: '80/100', stage: 'NEW' },
  ];

  const getStageColor = (stage: string) => {
    if (stage === 'CONTACTED') return { bg: '#FEF3C7', text: '#D97706' };
    if (stage === 'NEGOTIATION') return { bg: '#FEF3C7', text: '#D97706' };
    if (stage === 'NEW') return { bg: '#FEF9C3', text: '#CA8A04' };
    if (stage === 'FOLLOW UP') return { bg: '#FEF3C7', text: '#D97706' };
    return { bg: '#F3F4F6', text: '#4B5563' };
  };

  const renderInventory = () => (
    <View style={{ marginBottom: spacing.xxl }}>
      <View style={styles.towerHeaderCard}>
        <View style={styles.towerIconBox}>
          <Icon name="office-building" size={20} color={colors.textSecondary} />
        </View>
        <View>
          <View style={{ flex: 1 }}>
            <Text style={styles.towerTitle}>Tower A (Luxury Block) <Text style={{ color: colors.textSecondary, fontWeight: 'normal' }}>(TWR-A)</Text></Text>
            <Text style={styles.towerSubtitle}>10 Floors • 4 Total Units</Text>
          </View>
          <View style={styles.towerStats}>
            <View style={[styles.towerBadge, { borderColor: colors.success, backgroundColor: '#ECFDF5' }]}><Text style={{ color: colors.success, fontSize: 12, fontWeight: 'bold' }}>4 Available</Text></View>
            <View style={[styles.towerBadge, { borderColor: colors.warning, backgroundColor: '#FFFBEB' }]}><Text style={{ color: colors.warning, fontSize: 12, fontWeight: 'bold' }}>0 Hold</Text></View>
            <View style={[styles.towerBadge, { borderColor: colors.error, backgroundColor: '#FEF2F2' }]}><Text style={{ color: colors.error, fontSize: 12, fontWeight: 'bold' }}>0 Booked</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.unitsGrid}>
        {[501, 502, 503, 504].map((unitNum) => (
          <View key={unitNum} style={styles.unitCard}>
            <View style={styles.unitTop}>
              <Text style={styles.unitTitle}>Unit {unitNum}</Text>
              <View style={styles.unitType}><Text style={styles.unitTypeText}>{unitNum % 2 === 0 ? '3BHK' : '2BHK'}</Text></View>
            </View>
            <Text style={styles.unitPrice}>₹8,200,000</Text>
            <View style={styles.unitBottomRow}>
              <View>
                <Text style={styles.unitArea}>1350.00</Text>
                <Text style={styles.unitAreaLabel}>sqft</Text>
              </View>
              <View style={styles.statusPill}><Text style={styles.statusPillText}>AVAILABLE</Text></View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBookings = () => (
    <View style={styles.tableCard}>
      <View style={styles.tableHeaderSection}>
        <View>
          <Text style={styles.tableTitle}>Confirmed Unit Bookings</Text>
          <Text style={styles.tableSubtitle}>Active customer bookings and sales agreements for {project.name}</Text>
        </View>
        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>View All Bookings →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.th, { width: 150 }]}>BOOKING CODE</Text>
            <Text style={[styles.th, { width: 200 }]}>CUSTOMER DETAILS</Text>
            <Text style={[styles.th, { width: 150 }]}>UNIT INFO</Text>
            <Text style={[styles.th, { width: 200 }]}>SALES EXECUTIVE</Text>
            <Text style={[styles.th, { width: 150 }]}>BOOKING COST</Text>
            <Text style={[styles.th, { width: 120 }]}>STATUS</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: 150, fontWeight: 'bold' }]}>BKG-APEX-001</Text>
            <View style={{ width: 200, padding: spacing.m }}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>Amit Kulkarni</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>9988776655</Text>
            </View>
            <View style={{ width: 150, padding: spacing.m }}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>Unit 501</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>2BHK</Text>
            </View>
            <Text style={[styles.td, { width: 200 }]}>Vikram Singh (Executive 1)</Text>
            <Text style={[styles.td, { width: 150, color: colors.success, fontWeight: 'bold' }]}>₹8,200,000</Text>
            <View style={{ width: 120, padding: spacing.m }}>
              <View style={[styles.statusPill, { alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.success, backgroundColor: 'transparent' }]}>
                <Text style={styles.statusPillText}>CONFIRMED</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderLeads = () => (
    <View style={styles.tableCard}>
      <View style={styles.tableHeaderSection}>
        <View>
          <Text style={styles.tableTitle}>Interested Customer Leads</Text>
          <Text style={styles.tableSubtitle}>Prospective buyers inquiring for {project.name}</Text>
        </View>
        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>View All Leads →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.th, { width: 150 }]}>LEAD NAME</Text>
            <Text style={[styles.th, { width: 200 }]}>CONTACT INFO</Text>
            <Text style={[styles.th, { width: 120 }]}>REQUIREMENT</Text>
            <Text style={[styles.th, { width: 200 }]}>ASSIGNED EXECUTIVE</Text>
            <Text style={[styles.th, { width: 100 }]}>SCORE</Text>
            <Text style={[styles.th, { width: 120 }]}>STAGE</Text>
            <Text style={[styles.th, { width: 100 }]}>ACTION</Text>
          </View>
          {leads.map((l, i) => {
            const sc = getStageColor(l.stage);
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.td, { width: 150, fontWeight: 'bold' }]}>{l.name}</Text>
                <View style={{ width: 200, padding: spacing.m }}>
                  <Text style={{ color: colors.text, fontSize: 13 }}>{l.phone}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' }}>{l.email}</Text>
                </View>
                <Text style={[styles.td, { width: 120, fontWeight: 'bold' }]}>{l.req}</Text>
                <Text style={[styles.td, { width: 200 }]}>{l.exec}</Text>
                <View style={{ width: 100, padding: spacing.m }}>
                  <View style={styles.scoreBadge}><Text style={styles.scoreText}>{l.score}</Text></View>
                </View>
                <View style={{ width: 120, padding: spacing.m }}>
                  <View style={[styles.stageBadge, { borderColor: sc.text }]}><Text style={{ fontSize: 10, fontWeight: 'bold', color: sc.text }}>{l.stage}</Text></View>
                </View>
                <View style={{ width: 100, padding: spacing.m }}>
                  <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const renderSpecs = () => (
    <View style={styles.tableCard}>
      <View style={[styles.tableHeaderSection, { borderBottomWidth: 0, paddingBottom: 0 }]}>
        <View>
          <Text style={styles.tableTitle}>Project Specifications & Amenities</Text>
          <Text style={styles.tableSubtitle}>Architectural highlights, master plan infrastructure & buyer facilities</Text>
        </View>
      </View>
      <View style={styles.specsGrid}>
        <View style={styles.specCard}>
          <View style={[styles.specIconBox, { backgroundColor: '#ECFDF5' }]}><Icon name="dumbbell" size={16} color={colors.success} /></View>
          <Text style={styles.specTitle}>Clubhouse & Gym</Text>
          <Text style={styles.specDesc}>Fully equipped air-conditioned fitness suite & multi-purpose hall.</Text>
        </View>
        <View style={styles.specCard}>
          <View style={[styles.specIconBox, { backgroundColor: '#EFF6FF' }]}><Icon name="pool" size={16} color="#3B82F6" /></View>
          <Text style={styles.specTitle}>Swimming Pool</Text>
          <Text style={styles.specDesc}>Infinity pool with separate kids splash deck & sun loungers.</Text>
        </View>
        <View style={styles.specCard}>
          <View style={[styles.specIconBox, { backgroundColor: '#FFFBEB' }]}><Icon name="ev-station" size={16} color="#D97706" /></View>
          <Text style={styles.specTitle}>EV Charging Bay</Text>
          <Text style={styles.specDesc}>Dedicated fast EV charging slots per basement level.</Text>
        </View>
        <View style={styles.specCard}>
          <View style={[styles.specIconBox, { backgroundColor: '#F3F4F6' }]}><Icon name="shield-check" size={16} color={colors.textSecondary} /></View>
          <Text style={styles.specTitle}>24x7 Smart Security</Text>
          <Text style={styles.specDesc}>CCTV surveillance, RFID boom barriers & biometric access.</Text>
        </View>
      </View>
      <View style={styles.reraBanner}>
        <Text style={styles.reraTitle}>RERA & Legal Compliance Note</Text>
        <Text style={styles.reraText}>
          Project {project.name} is officially registered under state Real Estate Regulatory Authority (RERA Registration: P02400009876). All title verification, clear property ownership, and approved municipal master plans are fully validated.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Project Command Center" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView style={styles.scroll}>
        <View style={styles.headerSection}>
          <Text style={styles.breadcrumb}>Dashboard / Projects Directory / {project.name}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{project.name}</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>{project.code}</Text></View>
            <View style={[styles.badge, styles.badgeOutline]}><Text style={styles.badgeOutlineText}>residential</Text></View>
            <TouchableOpacity style={styles.shareBtn}>
              <Icon name="share-variant" size={16} color={colors.textSecondary} />
              {/* <Text style={styles.shareText}>Share Link</Text> */}
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="map-marker" size={14} color={colors.error} />
              <Text style={styles.metaText}>Location: <Text style={{ fontWeight: 'bold' }}>{project.location_address}</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="file-document" size={14} color={colors.success} />
              <Text style={styles.metaText}>RERA Registration: <Text style={{ fontWeight: 'bold' }}>P02400009876</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="eye" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Visibility: <Text style={{ fontWeight: 'bold' }}>Public</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL TOWERS</Text>
            <Text style={styles.statVal}>1 <Text style={styles.statUnit}>Towers</Text></Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.primary }]}>
            <Text style={[styles.statLabel, { color: colors.primary }]}>TOTAL INVENTORY</Text>
            <Text style={[styles.statVal, { color: colors.primary }]}>4 <Text style={styles.statUnit}>Units</Text></Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.success }]}>
            <Text style={[styles.statLabel, { color: colors.success }]}>AVAILABLE</Text>
            <Text style={[styles.statVal, { color: colors.success }]}>4 <Text style={styles.statUnit}>Units</Text></Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.warning }]}>
            <Text style={[styles.statLabel, { color: colors.warning }]}>HOLD / RESERVED</Text>
            <Text style={[styles.statVal, { color: colors.warning }]}>0 <Text style={styles.statUnit}>Units</Text></Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.error }]}>
            <Text style={[styles.statLabel, { color: colors.error }]}>BOOKED / SOLD</Text>
            <Text style={[styles.statVal, { color: colors.error }]}>0 <Text style={styles.statUnit}>Units</Text></Text>
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.searchBox}>
            <Icon name="magnify" size={18} color={colors.textSecondary} />
            <TextInput placeholder="Search..." style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setIsTabModalVisible(true)}>
            <Icon name="filter-variant" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.filterBtnText} numberOfLines={1}>{tabs.find(t => t.id === activeTab)?.label}</Text>
            <Icon name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterModalVisible(true)}>
            <Icon name="filter-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.filterBtnText} numberOfLines={1}>{filter}</Text>
            <Icon name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {activeTab === 'Inventory' && renderInventory()}
        {activeTab === 'Bookings' && renderBookings()}
        {activeTab === 'Leads' && renderLeads()}
        {activeTab === 'Specs' && renderSpecs()}

      </ScrollView>

      {/* Tab Selection Modal */}
      <Modal visible={isTabModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsTabModalVisible(false)}>
        <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setIsTabModalVisible(false)}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.modalTitle}>Select View</Text>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.id} style={styles.modalOption} onPress={() => { setActiveTab(tab.id); setIsTabModalVisible(false); }}>
                <Text style={[styles.modalOptionText, activeTab === tab.id && { color: colors.primary, fontWeight: 'bold' }]}>{tab.label}</Text>
                {activeTab === tab.id && <Icon name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Selection Modal */}
      <Modal visible={isFilterModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsFilterModalVisible(false)}>
        <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.modalTitle}>Additional Filters</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {filterOptions.map((opt, i) => (
                opt.type === 'heading' ? (
                  <View key={i} style={styles.modalHeading}>
                    <Text style={styles.modalHeadingText}>{opt.label}</Text>
                  </View>
                ) : (
                  <TouchableOpacity key={i} style={styles.modalOption} onPress={() => { setFilter(opt.label); setIsFilterModalVisible(false); }}>
                    <Text style={[styles.modalOptionText, filter === opt.label && { color: colors.primary, fontWeight: 'bold' }]}>{opt.label}</Text>
                    {filter === opt.label && <Icon name="check" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                )
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.m },
  headerSection: { backgroundColor: '#FFF', padding: spacing.m, borderRadius: 12, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  breadcrumb: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.s },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.s, gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  badge: { backgroundColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.text },
  badgeOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.success },
  badgeOutlineText: { fontSize: 12, fontWeight: '600', color: colors.success },
  shareBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  shareText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  metaRow: {alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  metaDot: { color: colors.border },
  statsRow: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.m, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 140, backgroundColor: '#FFF', padding: spacing.m, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 4 },
  statVal: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statUnit: { fontSize: 12, fontWeight: 'normal', color: colors.textSecondary },

  filtersContainer: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.m, flexWrap: 'wrap' },
  searchBox: { flex: 1, minWidth: 150, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 8, height: 40 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 12, height: 40, maxWidth: 180 },
  filterBtnText: { fontSize: 13, color: colors.text, flex: 1 },

  towerHeaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.m, marginBottom: spacing.m, flexWrap: 'wrap' },
  towerIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  towerTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  towerSubtitle: { fontSize: 12, color: colors.textSecondary },
  towerStats: { flexDirection: 'row', gap: 8, marginTop: 8 },
  towerBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  unitsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  unitCard: { width: '48%', borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: colors.success, borderRadius: 8, padding: spacing.m, backgroundColor: '#FFF', marginBottom: spacing.m },
  unitTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  unitTitle: { fontSize: 14, fontWeight: 'bold' },
  unitType: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  unitTypeText: { fontSize: 10, fontWeight: 'bold', color: colors.textSecondary },
  unitPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.s },
  unitBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  unitArea: { fontSize: 12, fontWeight: 'bold', color: colors.textSecondary },
  unitAreaLabel: { fontSize: 10, color: colors.textSecondary },
  statusPill: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusPillText: { fontSize: 10, fontWeight: 'bold', color: colors.success },

  tableCard: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xxl },
  tableHeaderSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border, flexWrap: 'wrap', gap: spacing.s },
  tableTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  tableSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  outlineBtn: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  outlineBtnText: { fontSize: 12, fontWeight: '600', color: colors.text },
  tableRowHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: '#F9FAFB' },
  th: { padding: spacing.m, fontSize: 11, fontWeight: 'bold', color: colors.textSecondary },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center' },
  td: { padding: spacing.m, fontSize: 13, color: colors.text },
  scoreBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  scoreText: { fontSize: 12, fontWeight: 'bold', color: colors.text },
  stageBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  viewBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, alignSelf: 'flex-start' },
  viewBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.m, gap: spacing.m },
  specCard: { width: 250, padding: spacing.m, borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
  specIconBox: { width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.s },
  specTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  specDesc: { fontSize: 12, color: colors.textSecondary },
  reraBanner: { backgroundColor: '#0F172A', padding: spacing.l, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, margin: spacing.m, marginTop: 0 },
  reraTitle: { color: colors.success, fontSize: 14, fontWeight: 'bold', marginBottom: spacing.s },
  reraText: { color: '#9CA3AF', fontSize: 12, lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.xl },
  modalContent: { backgroundColor: '#FFF', borderRadius: 12, padding: spacing.l, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.m },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  modalOptionText: { fontSize: 16, color: colors.text },
  modalHeading: { paddingVertical: 8, marginTop: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalHeadingText: { fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.l, paddingBottom: spacing.xxl, maxHeight: '80%' },
  bottomSheetHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: spacing.m },
});
