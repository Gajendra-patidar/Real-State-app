import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

export const SalesExecutiveNegotiationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const lead = route.params?.lead;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
  const [selectedLeadForNegotiation, setSelectedLeadForNegotiation] = useState<any>(null);

  React.useEffect(() => {
    if (isModalVisible) {
      fetchAssignedLeads();
    }
  }, [isModalVisible]);

  const fetchAssignedLeads = async () => {
    try {
      const res = await salesExecutiveApi.getAssignedLeads();
      const leadsData = res.data?.data || res.data || [];
      setAssignedLeads(leadsData);
    } catch (e) {
      console.error('Failed to fetch assigned leads for dropdown', e);
    }
  };

  React.useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        setIsLoading(true);
        const leadId = lead?.id || lead?.lead_id;
        
        // Use specific lead API if navigated with a lead, otherwise fetch all
        const res = leadId 
          ? await salesExecutiveApi.getNegotiations(leadId)
          : await salesExecutiveApi.getAllNegotiations();
          
        if (res.status === 'success') {
          const negotiationsData = Array.isArray(res.data) ? res.data : [res.data];
          
          // Fetch lead data for each negotiation
          const enrichedNegotiations = await Promise.all(
            negotiationsData.map(async (neg: any) => {
              try {
                if (neg.lead_id) {
                  const leadRes = await salesExecutiveApi.getLeadDetails(neg.lead_id);
                  const leadData = leadRes.data || leadRes; // fallback depending on response format
                  return {
                    ...neg,
                    lead: leadData,
                    leadName: leadData.first_name || leadData.name || 'Unknown',
                    project: leadData.project?.name || leadData.project_name || 'Unknown Project',
                  };
                }
                return neg;
              } catch (e) {
                console.error('Failed to fetch lead details for negotiation', e);
                return neg;
              }
            })
          );
          
          setNegotiations(enrichedNegotiations);
        }
      } catch (error) {
        console.error('Failed to fetch negotiations', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNegotiations();
  }, [lead]);

  const renderNegotiationCard = ({ item }: { item: any }) => {
    const leadName = item.lead?.first_name || item.leadName || 'Unknown Lead';
    const projectName = item.lead?.project?.name || item.project || 'Unknown Project';
    const status = item.status || 'negotiation';
    const date = item.created_at ? new Date(item.created_at).toLocaleDateString() : item.date || 'N/A';
    const executiveName = item.executive?.name || item.executive || 'Executive';
    const offeredPrice = item.offered_price || item.offeredPrice || '0';

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.7}
        onPress={() => {
          const targetLeadId = item.lead_id || item.lead?.id;
          if (targetLeadId) {
            navigation.navigate('SalesExecutiveLeadDetails', { leadId: targetLeadId });
          }
        }}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{leadName}</Text>
            <Text style={styles.cardSubtitle}>{projectName}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="account-tie" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{executiveName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="cash-multiple" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>Offered: ₹{offeredPrice}</Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.m, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' }}>
          <TouchableOpacity 
            style={{ backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('RecordBooking', { lead: item.lead || { id: item.lead_id, first_name: item.leadName } });
            }}
          >
            <Icon name="file-document-edit-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: typography.sizes.s, fontWeight: 'bold', color: '#FFF' }}>Record Booking</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Negotiations" />
      
      <View style={styles.content}>

        <FlatList
          data={negotiations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNegotiationCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="handshake-outline" size={48} color={colors.textSecondary} style={{ marginBottom: spacing.m, opacity: 0.5 }} />
              <Text style={styles.emptyStateText}>No negotiations found.</Text>
            </View>
          }
        />
        
        <TouchableOpacity style={styles.fab} onPress={() => setIsModalVisible(true)} activeOpacity={0.8}>
          <Icon name="plus" size={24} color="#FFF" style={{marginRight: 8}} />
          <Text style={styles.fabText}>Start Negotiation</Text>
        </TouchableOpacity>
      </View>

      {/* Start Negotiation Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="handshake" size={24} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.modalTitle}>Select Lead to Start Negotiation</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>SELECT LEAD <Text style={{color: '#EF4444'}}>*</Text></Text>
              
              <View style={{ maxHeight: 250, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: spacing.xl, backgroundColor: '#FFF' }}>
                <FlatList
                  data={assignedLeads}
                  keyExtractor={item => item.id.toString()}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={{ 
                        padding: spacing.m, 
                        borderBottomWidth: 1, 
                        borderBottomColor: colors.border,
                        backgroundColor: selectedLeadForNegotiation?.id === item.id ? '#EFF6FF' : '#FFF'
                      }}
                      onPress={() => setSelectedLeadForNegotiation(item)}
                    >
                      <Text style={{ fontWeight: 'bold', color: colors.text }}>
                        {item.lead_code} - {item.first_name} {item.last_name}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.s, marginTop: 4 }}>
                        <Icon name="phone" size={12} /> {item.phone}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={{ padding: spacing.m, color: colors.textSecondary, textAlign: 'center' }}>Loading leads...</Text>}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.proceedBtn, !selectedLeadForNegotiation && { opacity: 0.5 }]} 
                  disabled={!selectedLeadForNegotiation}
                  onPress={() => {
                    setIsModalVisible(false);
                    navigation.navigate('StartNegotiation', { lead: selectedLeadForNegotiation });
                  }}
                >
                  <Text style={styles.proceedBtnText}>Proceed to Negotiate →</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { flex: 1, paddingBottom: 80 }, // Extra padding for FAB
  fab: {
    position: 'absolute',
    bottom: '10%',
    right: 24,
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },
  
  listContainer: { padding: spacing.m },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: spacing.m, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  cardTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#D97706' },
  cardBody: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m, gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: typography.sizes.s, color: colors.text },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  emptyStateText: { fontSize: typography.sizes.m, color: colors.textSecondary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalHeader: { backgroundColor: '#4B88BD', padding: spacing.l, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
  modalBody: { padding: spacing.xl },
  inputLabel: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.textSecondary, marginBottom: spacing.s },
  selectBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.m, height: 48, marginBottom: spacing.xl },
  selectBoxText: { fontSize: typography.sizes.m, color: colors.text },
  modalActions: { gap: spacing.m, marginTop: spacing.l },
  proceedBtn: { backgroundColor: '#D97706', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  proceedBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: typography.sizes.m },
  cancelBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontWeight: 'bold', fontSize: typography.sizes.m },
});
