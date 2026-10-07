import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const MOCK_VISITS = [
  { id: '1', customerName: 'Amit Kulkarni', phone: '9988776655', project: 'Apex Grand Residency, Hyderabad', executive: 'Vikram Singh (Executive 1)', status: 'Negotiation', hasFeedback: false, hasPhotos: false, initials: 'AM' },
  { id: '2', customerName: 'Suresh Reddy', phone: '9123456789', project: 'Apex Grand Residency, Hyderabad', executive: 'Vikram Singh (Executive 1)', status: 'Negotiation', hasFeedback: false, hasPhotos: false, initials: 'SU' },
];

const RATING_LABELS = ['Not rated', 'Not Interested', 'Slightly', 'Moderate', 'Interested', 'Very Hot 🔥'];

export const ManagerSiteVisitsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { salesExecutiveApi } = require('../../services/api/salesExecutiveApi');
      const res = await salesExecutiveApi.getProjects();
      setProjects(res?.data || res || []);
    } catch (e) {
      console.log('Failed to load projects for filter');
    }
  };



  // Feedback Modal State
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<typeof MOCK_VISITS[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');



  const formatDate = (date: Date | null) => {
    if (!date) return 'dd/mm/yyyy';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleLogFeedback = (visit: typeof MOCK_VISITS[0]) => {
    setSelectedVisit(visit);
    setRating(0);
    setFeedbackText('');
    setIsFeedbackModalVisible(true);
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={[styles.statIconWrap, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
    </View>
  );

  const renderVisitCard = ({ item }: { item: typeof MOCK_VISITS[0] }) => (
    <View style={styles.visitCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.customerName}</Text>
            <Text style={styles.userPhone}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Icon name="office-building" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.project}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account-tie" size={16} color={colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.executive}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusIcons}>
          <View style={styles.miniBadge}>
            <Icon name="message-alert-outline" size={14} color={colors.textMuted} />
            <Text style={styles.miniBadgeText}>No feedback</Text>
          </View>
          <View style={styles.miniBadge}>
            <Icon name="camera-off-outline" size={14} color={colors.textMuted} />
            <Text style={styles.miniBadgeText}>No photos</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.btnLogFeedback} onPress={() => handleLogFeedback(item)}>
            <Icon name="comment-edit-outline" size={16} color="#FFF" />
            {/* <Text style={styles.btnLogFeedbackText}>Log Feedback</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWhatsapp}>
            <Icon name="whatsapp" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Site Visits" />

      <FlatList
        data={MOCK_VISITS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.statsGrid}>
              {renderStatCard('Scheduled', '2', 'map-marker', '#3B82F6')}
              {renderStatCard('With Photos', '0', 'camera', '#10B981')}
              {renderStatCard('Feedback', '0', 'comment-text-multiple', '#8B5CF6')}
              {renderStatCard('Projects', '1', 'bookmark', '#F59E0B')}
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search customer name..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
                <Icon name="tune-variant" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.listTitle}>Scheduled & Conducted Visits</Text>
          </>
        }
        renderItem={renderVisitCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20, maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Visits</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
              <Text style={{ fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.m }}>Select Project to Filter</Text>
              
              <TouchableOpacity 
                style={[styles.filterDropdown, selectedProjectId === null && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }, { marginBottom: spacing.s }]} 
                onPress={() => setSelectedProjectId(null)}
              >
                <Text style={[styles.filterDropdownText, selectedProjectId === null && { color: colors.primary, fontWeight: 'bold' }]}>All Projects</Text>
                {selectedProjectId === null && <Icon name="check-circle" size={20} color={colors.primary} />}
              </TouchableOpacity>

              {projects.map((proj: any) => (
                <TouchableOpacity 
                  key={proj.id}
                  style={[styles.filterDropdown, selectedProjectId === proj.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }, { marginBottom: spacing.s }]} 
                  onPress={() => setSelectedProjectId(proj.id)}
                >
                  <Text style={[styles.filterDropdownText, selectedProjectId === proj.id && { color: colors.primary, fontWeight: 'bold' }]}>{proj.name}</Text>
                  {selectedProjectId === proj.id && <Icon name="check-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.applyFilterBtn} onPress={() => setIsFilterVisible(false)}>
              <Icon name="filter-variant" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.applyFilterText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Log Feedback Modal */}
      <Modal visible={isFeedbackModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20, maxHeight: '90%' }]}>
            
            {/* Header */}
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackHeaderLeft}>
                <View style={styles.feedbackIconWrap}>
                  <Icon name="camera" size={20} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Log Site Visit Feedback</Text>
                  <Text style={styles.feedbackSubtitle}>{selectedVisit?.customerName} — feedback & photos</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsFeedbackModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
              
              {/* Rating Section */}
              <Text style={styles.inputLabel}>Customer Interest Rating</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon name={star <= rating ? "star" : "star-outline"} size={42} color={star <= rating ? "#F59E0B" : "#CBD5E1"} />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingStatusText}>{RATING_LABELS[rating]}</Text>

              {/* Feedback Textarea */}
              <Text style={styles.inputLabel}>Customer Reaction & Feedback <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.textArea}
                placeholder="Customer's reaction, property interest level, floor/unit preference, objections raised, budget concerns..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                value={feedbackText}
                onChangeText={setFeedbackText}
                textAlignVertical="top"
              />

              {/* Next Action Dropdown */}
              <Text style={styles.inputLabel}>Next Action Step <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity style={styles.actionDropdown}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="phone" size={18} color={colors.text} style={{marginRight: 8}} />
                  <Text style={styles.actionDropdownText}>Schedule Follow-up Call</Text>
                </View>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Photos Upload Zone */}
              <View>
                <Text style={styles.inputLabel} >
                <Icon name="image-multiple-outline" size={16} /> 
                <Text>  Visit Photos </Text>
                </Text>
                <Text style={styles.optionalText}>(optional — up to 10 images, 5 MB each)</Text>
              </View>
              <TouchableOpacity style={styles.uploadZone}>
                <View style={styles.uploadCloudWrap}>
                  <Icon name="cloud-upload" size={28} color="#FFF" />
                </View>
                <Text style={styles.uploadTitle}>Tap to upload site visit photos</Text>
                <Text style={styles.uploadSubtitle}>JPG, PNG, WEBP — Max 5 MB each</Text>
              </TouchableOpacity>

            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.feedbackFooterRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsFeedbackModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsFeedbackModalVisible(false)}>
                <Icon name="send" size={18} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerSubtitleBox: { paddingHorizontal: spacing.m, paddingBottom: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary },
  listContent: { padding: spacing.m, paddingBottom: spacing.xxl },
  
  // KPI Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.l },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  statContent: { flex: 1 },
  statTitle: { fontSize: 10, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  statIconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  // Search
  searchRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.l },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: spacing.m, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: spacing.s },
  searchInput: { flex: 1, height: 44, fontSize: typography.sizes.m, color: colors.text },
  filterBtn: { width: 44, height: 44, backgroundColor: '#3B82F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  
  listTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.m },

  // Visit Card
  visitCard: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: '#3730A3' },
  userName: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text },
  userPhone: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#B45309', textTransform: 'uppercase' },

  detailsBox: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.m, marginBottom: spacing.m },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: spacing.s },
  detailText: { fontSize: typography.sizes.s, color: colors.textSecondary, flex: 1 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
  statusIcons: { flexDirection: 'row', gap: spacing.m },
  miniBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniBadgeText: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  actionButtons: { flexDirection: 'row', gap: spacing.s },
  btnLogFeedback: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 6 },
  btnLogFeedbackText: { color: '#FFF', fontSize: typography.sizes.s, fontWeight: typography.weights.bold },
  btnWhatsapp: { backgroundColor: '#25D366', width: 36, height: 36, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },

  // Modals Base
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  
  // Filter Modal specific
  filterRow: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.m },
  filterCol: { flex: 1 },
  filterLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.textSecondary, marginBottom: 4 },
  filterDropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.s, height: 40 },
  filterDropdownText: { fontSize: typography.sizes.s, color: colors.text, flex: 1, marginRight: 4 },
  filterInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.s, height: 40, fontSize: typography.sizes.s, color: colors.text },
  applyFilterBtn: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: spacing.m },
  applyFilterText: { color: colors.surface, fontSize: typography.sizes.m, fontWeight: typography.weights.bold },

  // Feedback Modal specific
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  feedbackHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  feedbackIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  feedbackSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  inputLabel: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text, marginTop: spacing.l, marginBottom: spacing.s },
  asterisk: { color: colors.error },
  optionalText: { fontSize: typography.sizes.s, fontWeight: '400', color: colors.textMuted },
  
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.s, marginVertical: spacing.s },
  ratingStatusText: { textAlign: 'center', fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: spacing.xs, fontWeight: '600' },
  
  textArea: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.m, fontSize: typography.sizes.m, color: colors.text, height: 120, backgroundColor: '#F8FAFC' },
  
  actionDropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.m, backgroundColor: '#F8FAFC' },
  actionDropdownText: { fontSize: typography.sizes.m, fontWeight: '600', color: colors.text },
  
  uploadZone: { borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 12, padding: spacing.l, alignItems: 'center', backgroundColor: '#F8FAFC', marginTop: spacing.s },
  uploadCloudWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#94A3B8', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.s },
  uploadTitle: { fontSize: typography.sizes.m, fontWeight: '600', color: colors.text, marginBottom: 4 },
  uploadSubtitle: { fontSize: typography.sizes.s, color: colors.textMuted },

  feedbackFooterRow: { flexDirection: 'row', gap: spacing.s, marginTop: spacing.l, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '600' },
  submitBtn: { flex: 2, flexDirection: 'row', paddingVertical: 14, borderRadius: 12, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
