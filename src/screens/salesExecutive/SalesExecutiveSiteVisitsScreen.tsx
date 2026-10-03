import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Platform, ActivityIndicator, Alert, Image, Linking } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

const RATING_LABELS = ['Not rated', 'Not Interested', 'Slightly', 'Moderate', 'Interested', 'Very Hot 🔥'];

export const SalesExecutiveSiteVisitsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSiteVisits();
  }, []);

  const fetchSiteVisits = async () => {
    try {
      setIsLoading(true);
      const res = await salesExecutiveApi.getSiteVisits();
      console.log('Fetched site visits:', res);
      const visitsArray = res?.data?.data || [];
      setVisits(visitsArray);
    } catch (error) {
      console.error('Failed to fetch site visits', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Date Picker State
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'visitFrom' | 'visitTo' | 'nextFollowDt' | null>(null);

  const [visitFromDate, setVisitFromDate] = useState<Date | null>(null);
  const [visitToDate, setVisitToDate] = useState<Date | null>(null);
  const [nextFollowDtDate, setNextFollowDtDate] = useState<Date | null>(null);

  // Feedback Modal State
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const [nextActionStep, setNextActionStep] = useState('Schedule Follow-up call');
  const [isNextActionModalVisible, setIsNextActionModalVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [visitStatus, setVisitStatus] = useState('visited');
  const [isVisitStatusModalVisible, setIsVisitStatusModalVisible] = useState(false);
  const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedVisitForAction, setSelectedVisitForAction] = useState<any>(null);

  const NEXT_ACTION_OPTIONS = [
    'Schedule Follow-up call',
    'Move to price nagotiation',
    'Draft unit booking',
    'Not interested / close lead'
  ];

  const VISIT_STATUS_OPTIONS = [
    { label: 'Visited / Completed', value: 'visited' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Client No-Show', value: 'no_show' }
  ];

  const openDatePicker = (field: 'visitFrom' | 'visitTo' | 'nextFollowDt') => {
    setActiveDateField(field);
    setDatePickerVisible(true);
  };

  const handleDateSelect = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (activeDateField === 'visitFrom') setVisitFromDate(date);
    if (activeDateField === 'visitTo') setVisitToDate(date);
    if (activeDateField === 'nextFollowDt') setNextFollowDtDate(date);
    setDatePickerVisible(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'dd/mm/yyyy';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleLogFeedback = (visit: any) => {
    setSelectedVisit(visit);
    setRating(0);
    setFeedbackText('');
    setPhotos([]);
    setVisitStatus('visited');
    setNextActionStep('Schedule Follow-up call');
    setIsFeedbackModalVisible(true);
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Choose photo source',
      [
        {
          text: 'Camera / Selfie',
          onPress: async () => {
            try {
              const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
              if (result.assets && result.assets.length > 0) {
                setPhotos(prev => [...prev, result.assets![0].uri!]);
              }
            } catch (err) {
              console.log('Camera error', err);
            }
          }
        },
        {
          text: 'Gallery',
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 10 });
              if (result.assets && result.assets.length > 0) {
                const uris = result.assets.map(a => a.uri!);
                setPhotos(prev => [...prev, ...uris]);
              }
            } catch (err) {
              console.log('Gallery error', err);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVisit) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('project_id', String(selectedVisit.project_id || 1));
      formData.append('status', visitStatus);
      formData.append('feedback_notes', feedbackText);
      formData.append('customer_rating', String(rating));
      formData.append('latitude', '9.076000');
      formData.append('longitude', '72.877700');

      if (photos.length > 0) {
        formData.append('photo', {
          uri: photos[0],
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`
        } as any);
      }

      console.log('Submitting feedback for visit:', formData);
      await salesExecutiveApi.updateSiteVisitStatus(selectedVisit.id, formData);
      Alert.alert('Success', 'Site visit feedback logged successfully!');
      setIsFeedbackModalVisible(false);
      fetchSiteVisits();
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsLoading(false);
    }
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

  const renderVisitCard = ({ item }: { item: any }) => {
    const firstName = item.lead?.first_name || 'Unknown';
    const lastName = item.lead?.last_name || '';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
    const customerName = `${firstName} ${lastName}`.trim();
    const phone = item.lead?.phone || 'No Phone';
    const projectName = item.project?.name || 'Unknown Project';
    const scheduledDate = item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'No Schedule';

    return (
      <View style={styles.visitCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{customerName}</Text>
              <Text style={styles.userPhone}>{phone}</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Icon name="office-building" size={16} color={colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{projectName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar-clock" size={16} color={colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{scheduledDate}</Text>
          </View>
          {item.pickup_location ? (
            <View style={styles.detailRow}>
              <Icon name="map-marker-outline" size={16} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>{item.pickup_location}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusIcons}>
            <View style={styles.miniBadge}>
              {item.customer_rating > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {[...Array(item.customer_rating)].map((_, i) => (
                    <Icon key={i} name="star" size={14} color="#F59E0B" />
                  ))}
                  {item.customer_rating < 5 && [...Array(5 - item.customer_rating)].map((_, i) => (
                    <Icon key={`empty-${i}`} name="star-outline" size={14} color="#CBD5E1" />
                  ))}
                </View>
              ) : (
                <>
                  <Icon name="message-alert-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.miniBadgeText}>No feedback</Text>
                </>
              )}
            </View>
            {item.visit_photo_path ? (
              <TouchableOpacity onPress={() => setFullScreenImageUri(item.visit_photo_path)}>
                <Image
                  source={{ uri: item.visit_photo_path }}
                  style={{ width: 28, height: 28, borderRadius: 4, marginLeft: 8 }}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.miniBadge}>
                <Icon name="camera-off-outline" size={14} color={colors.textMuted} />
                <Text style={styles.miniBadgeText}>No photos</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnLogFeedback} onPress={() => handleLogFeedback(item)}>
              <Icon name="comment-edit-outline" size={16} color="#FFF" />
              {/* <Text style={styles.btnLogFeedbackText}>Log Feedback</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWhatsapp}
              onPress={() => {
                if (phone && phone !== 'No Phone') {
                  const phoneNumber = phone.replace(/[^0-9+]/g, '');
                  Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
                    Alert.alert('Error', 'Make sure WhatsApp is installed on your device');
                  });
                } else {
                  Alert.alert('Error', 'No valid phone number found for this lead.');
                }
              }}
            >
              <Icon name="whatsapp" size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btnWhatsapp, { backgroundColor: '#475569' }]}
              onPress={() => {
                setSelectedVisitForAction(item);
                setIsActionMenuVisible(true);
              }}
            >
              <Icon name="dots-vertical" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Site Visits" />

      <FlatList
        data={visits}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
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
              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Source</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Source</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Lead</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Lead</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Assign By</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Assign By</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Site Visited By</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>-SELECT-</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Interested in</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Inquiry Code</Text>
                  <TextInput style={styles.filterInput} placeholder="Code" placeholderTextColor={colors.textMuted} />
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Inquiry Status</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select status</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Visit From</Text>
                  <TouchableOpacity style={styles.filterDropdown} onPress={() => openDatePicker('visitFrom')}>
                    <Text style={styles.filterDropdownText} numberOfLines={1}>{formatDate(visitFromDate)}</Text>
                    <Icon name="calendar" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Visit To</Text>
                  <TouchableOpacity style={styles.filterDropdown} onPress={() => openDatePicker('visitTo')}>
                    <Text style={styles.filterDropdownText} numberOfLines={1}>{formatDate(visitToDate)}</Text>
                    <Icon name="calendar" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Next Follow Dt</Text>
                  <TouchableOpacity style={styles.filterDropdown} onPress={() => openDatePicker('nextFollowDt')}>
                    <Text style={styles.filterDropdownText} numberOfLines={1}>{formatDate(nextFollowDtDate)}</Text>
                    <Icon name="calendar" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Project</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Project</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Budget Upto</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Budget</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Status</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Pending</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>State</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select State</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>City</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select City</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Purpose</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Locality</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Broker</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Size/Area</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>FB Page</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>FB Form</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>- ALL -</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Resource</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select Resource</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Mode</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select All</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Stage</Text>
                  <TouchableOpacity style={styles.filterDropdown}><Text style={styles.filterDropdownText} numberOfLines={1}>Select All</Text><Icon name="chevron-down" size={18} color={colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>
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

              {/* Visit Status Dropdown */}
              <Text style={styles.inputLabel}>Visit Status <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity style={styles.actionDropdown} onPress={() => setIsVisitStatusModalVisible(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="progress-clock" size={18} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={styles.actionDropdownText}>
                    {VISIT_STATUS_OPTIONS.find(opt => opt.value === visitStatus)?.label || 'Select Status'}
                  </Text>
                </View>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

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
              <TouchableOpacity style={styles.actionDropdown} onPress={() => setIsNextActionModalVisible(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="phone" size={18} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={styles.actionDropdownText}>{nextActionStep}</Text>
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

              {photos.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {photos.map((uri, idx) => (
                    <View key={idx} style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => setFullScreenImageUri(uri)}>
                        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ position: 'absolute', top: -5, right: -5, backgroundColor: colors.error, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      >
                        <Icon name="close" size={14} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.uploadZone} onPress={handleUploadPhoto}>
                <View style={styles.uploadCloudWrap}>
                  <Icon name="camera-plus" size={24} color="#FFF" />
                </View>
                <Text style={styles.uploadTitle}>Tap to take a Selfie or upload photos</Text>
                <Text style={styles.uploadSubtitle}>JPG, PNG, WEBP — Max 5 MB each</Text>
              </TouchableOpacity>

            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.feedbackFooterRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsFeedbackModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitFeedback}>
                <Icon name="send" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelectDate={handleDateSelect}
      />

      {/* Full Screen Image Modal */}
      <Modal
        visible={!!fullScreenImageUri}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenImageUri(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 20, zIndex: 1, padding: 8 }}
            onPress={() => setFullScreenImageUri(null)}
          >
            <Icon name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          {fullScreenImageUri && (
            <Image
              source={{ uri: fullScreenImageUri }}
              style={{ width: '100%', height: '80%' }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Visit Status Modal */}
      <Modal
        visible={isVisitStatusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisitStatusModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsVisitStatusModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Visit Status</Text>
              <TouchableOpacity onPress={() => setIsVisitStatusModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {VISIT_STATUS_OPTIONS.map((status, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  onPress={() => {
                    setVisitStatus(status.value);
                    setIsVisitStatusModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: typography.sizes.m, color: colors.text }}>{status.label}</Text>
                  {visitStatus === status.value && <Icon name="check" size={20} color="#6366F1" style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Action Menu Modal */}
      <Modal
        visible={isActionMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsActionMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsActionMenuVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '40%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Actions</Text>
              <TouchableOpacity onPress={() => setIsActionMenuVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border }}
                onPress={() => {
                  setIsActionMenuVisible(false);
                  navigation.navigate('StartNegotiation', { lead: selectedVisitForAction?.lead });
                }}
              >
                <Icon name="handshake" size={20} color={colors.text} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: typography.sizes.m, color: colors.text }}>Start Negotiation</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m }}
                onPress={() => {
                  setIsActionMenuVisible(false);
                  navigation.navigate('RecordBooking', { lead: selectedVisitForAction?.lead });
                }}
              >
                <Icon name="file-document-edit-outline" size={20} color={colors.text} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: typography.sizes.m, color: colors.text }}>Record Booking</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Next Action Modal */}
      <Modal
        visible={isNextActionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsNextActionModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsNextActionModalVisible(false)}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Next Action</Text>
              <TouchableOpacity onPress={() => setIsNextActionModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {NEXT_ACTION_OPTIONS.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  onPress={() => {
                    setNextActionStep(action);
                    setIsNextActionModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: typography.sizes.m, color: colors.text }}>{action}</Text>
                  {nextActionStep === action && <Icon name="check" size={20} color="#6366F1" style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
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
  visitCard: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m, marginBottom: spacing.m, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
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
