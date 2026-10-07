import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppHeader } from '../../components/common/AppHeader';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const CATEGORIES = [
  { id: 'site', label: 'Property Site Visits', color: '#10B981', bg: '#D1FAE5' },
  { id: 'followup', label: 'Client Follow-up', color: '#6366F1', bg: '#E0E7FF' },
  { id: 'meeting', label: 'Key Client Meetings', color: '#EF4444', bg: '#FEE2E2' },
  { id: 'launch', label: 'Project Launches', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'hr', label: 'HR & Attendance', color: '#8B5CF6', bg: '#EDE9FE' },
];


import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const SalesExecutiveTasksScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isNewEventModalVisible, setIsNewEventModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(new Date());
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await salesExecutiveApi.getCalendar();
      console.log('Fetched tasks:', response);
      let list = [];
      if (response && response.data) {
        const eventsArr = response.data.events || [];
        const upcomingArr = response.data.upcoming_events || [];
        const allEvents = [...eventsArr, ...upcomingArr];
        // Deduplicate by id
        const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
        list = uniqueEvents;
      }
      setEvents(list);
    } catch (error) {
      console.log('Error fetching tasks', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'dd/mm/yyyy, 00:00 PM';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, 03:24 PM`;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    
    return days;
  }, [year, month]);

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return Array.isArray(events) ? events.filter(e => e.start?.startsWith(dateStr) || e.scheduled_at?.startsWith(dateStr) || e.date?.startsWith(dateStr)) : [];
  };

  const selectedEvents = selectedDay ? getEventsForDate(selectedDay) : [];

  const renderEventCard = ({ item }: { item: typeof events[0] }) => {
    const timeString = item.start ? new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.time || '12:00 PM');
    const color = item.color || item.backgroundColor || CATEGORIES[0].color;
    const bg = color + '20'; // light version of the color for background
    const label = item.extendedProps?.category || item.event_type || CATEGORIES[0].label;
    
    return (
      <View style={styles.eventCard}>
        <View style={[styles.eventTimeLine, { backgroundColor: color }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTime}>{timeString}</Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.eventTag, { backgroundColor: bg }]}>
            <View style={[styles.eventDot, { backgroundColor: color }]} />
            <Text style={[styles.eventTagText, { color: color }]}>{label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Tasks & Schedule" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        
        {/* Header Actions */}
        <View style={styles.headerSection}>
          <View style={styles.headerTextGroup}>
            <Text style={styles.pageTitle}>Calendar & Event Schedule</Text>
            <Text style={styles.pageSubtitle}>View all scheduled property site visits, client follow-up calls, and booking milestones.</Text>
          </View>
          {/* <TouchableOpacity style={styles.btnNewEvent} onPress={() => setIsNewEventModalVisible(true)}>
            <Icon name="plus" size={16} color="#FFF" style={{marginRight: 4}} />
            <Text style={styles.btnNewEventText}>New Event</Text>
          </TouchableOpacity> */}
          
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
              <Icon name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{MONTHS[month].toUpperCase()} {year}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
              <Icon name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View style={styles.weekDaysRow}>
            {WEEK_DAYS.map(d => <Text key={d} style={styles.weekDayText}>{d}</Text>)}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} style={styles.dayCell} />;
              }

              const isSelected = day === selectedDay;
              const hasEvents = getEventsForDate(day).length > 0;
              const isToday = day === 29 && month === 8 && year === 2026; // Hardcoded "today" matching mockup

              return (
                <TouchableOpacity 
                  key={day} 
                  style={[styles.dayCell, isSelected && styles.dayCellSelected, isToday && !isSelected && styles.dayCellToday]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isToday && !isSelected && styles.dayTextToday]}>
                    {day}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventDotWrap}>
                      <View style={[styles.eventDotMini, isSelected && {backgroundColor: '#FFF'}]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.sectionTitle}>Event Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendScroll}>
            {CATEGORIES.map(cat => (
              <View key={cat.id} style={[styles.legendChip, { backgroundColor: cat.bg }]}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.legendText, { color: cat.color }]}>{cat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Selected Day Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            Upcoming Schedule <Text style={styles.sectionTitleLight}>({selectedDay} {MONTHS[month]})</Text>
          </Text>

          {loading ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : selectedEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-blank-outline" size={48} color={colors.border} />
              <Text style={styles.emptyText}>No upcoming events scheduled.</Text>
            </View>
          ) : (
            <View style={{ gap: spacing.m }}>
              {selectedEvents.map((ev: any, index: number) => React.cloneElement(renderEventCard({ item: ev }), { key: index }))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* New Event Modal */}
      <Modal visible={isNewEventModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule New Event / Site Visit</Text>
              <TouchableOpacity onPress={() => setIsNewEventModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.l }}>
              
              <Text style={styles.inputLabel}>EVENT CATEGORY</Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Schedule Property Site Visit</Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.inputLabel}>TITLE / NOTE</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="Enter event title..."
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>DATE & TIME</Text>
              <TouchableOpacity style={styles.dropdownInput} onPress={() => setDatePickerVisible(true)}>
                <Text style={styles.dropdownText}>{formatDate(eventDate)}</Text>
                <Icon name="calendar-blank-outline" size={20} color={colors.text} />
              </TouchableOpacity>

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsNewEventModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={() => setIsNewEventModalVisible(false)}>
                <Text style={styles.submitBtnText}>Save Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal purely for event date picking */}
      <DatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelect={(date) => {
          setEventDate(date);
          setDatePickerVisible(false);
        }}
        initialDate={eventDate || new Date()}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  headerSection: { padding: spacing.m, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTextGroup: { marginBottom: spacing.m },
  pageTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  pageSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 4 },
  btnNewEvent: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnNewEventText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },

  calendarCard: { backgroundColor: colors.surface, margin: spacing.m, borderRadius: 16, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  monthText: { fontSize: typography.sizes.m, fontWeight: '800', color: colors.text, letterSpacing: 1 },
  monthNavBtn: { padding: spacing.s },
  
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.s },
  weekDayText: { fontSize: 10, fontWeight: '700', color: colors.textMuted, width: '14%', textAlign: 'center' },
  
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 2, borderRadius: 20 },
  dayCellSelected: { backgroundColor: '#111827' },
  dayCellToday: { backgroundColor: '#FEF3C7' },
  dayText: { fontSize: typography.sizes.m, fontWeight: '600', color: colors.text },
  dayTextSelected: { color: '#FFF' },
  dayTextToday: { color: '#D97706' },
  
  eventDotWrap: { position: 'absolute', bottom: 4, flexDirection: 'row' },
  eventDotMini: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3B82F6' },

  legendContainer: { marginHorizontal: spacing.m, marginBottom: spacing.l },
  sectionTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.s },
  sectionTitleLight: { fontWeight: '400', color: colors.textSecondary },
  legendScroll: { gap: spacing.s },
  legendChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, fontWeight: '600' },

  eventsSection: { marginHorizontal: spacing.m },
  emptyState: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.xl, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border },
  emptyText: { marginTop: spacing.s, fontSize: typography.sizes.s, color: colors.textSecondary },

  eventCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  eventTimeLine: { width: 4 },
  eventContent: { flex: 1, padding: spacing.m },
  eventTime: { fontSize: typography.sizes.s, fontWeight: '700', color: colors.textMuted, marginBottom: 4 },
  eventTitle: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: spacing.s },
  eventTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  eventTagText: { fontSize: 11, fontWeight: '700' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.l, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, marginTop: spacing.l, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface },
  dropdownText: { fontSize: typography.sizes.m, color: colors.text, flex: 1, fontWeight: '500' },
  
  textInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.m, height: 48, backgroundColor: colors.surface, fontSize: typography.sizes.m, color: colors.text, fontWeight: '500' },

  footerRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl, paddingTop: spacing.m, borderTopWidth: 1, borderTopColor: colors.border },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: colors.text, fontSize: typography.sizes.m, fontWeight: '700' },
  submitBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: '#DC2626', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
});
