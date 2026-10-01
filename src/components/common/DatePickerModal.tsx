import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  title?: string;
}

export const DatePickerModal = ({ visible, onClose, onSelectDate, title = 'Select Date' }: DatePickerModalProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formatted = `${selected.getDate().toString().padStart(2, '0')}/${(selected.getMonth() + 1).toString().padStart(2, '0')}/${selected.getFullYear()}`;
    onSelectDate(formatted);
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getDate() === i && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={i} 
          style={[styles.dayCell, isToday && styles.todayCell]}
          onPress={() => handleDateSelect(i)}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
              <Icon name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
              <Icon name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekDays}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxWidth: 400, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width: 0, height: 5} },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  title: { fontSize: typography.sizes.l, fontWeight: typography.weights.bold, color: colors.text },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  arrowBtn: { padding: spacing.xs },
  monthText: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.primary },
  weekDays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.s },
  weekDayText: { width: 40, textAlign: 'center', fontSize: typography.sizes.s, color: colors.textSecondary, fontWeight: typography.weights.bold },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  todayCell: { backgroundColor: colors.primary, borderRadius: 20 },
  dayText: { fontSize: typography.sizes.m, color: colors.text },
  todayText: { color: colors.surface, fontWeight: typography.weights.bold },
});
