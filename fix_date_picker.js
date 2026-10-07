const fs = require('fs');
const file = 'src/components/common/DatePickerModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const newComponent = `import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

export const DatePickerModal = ({ visible, onClose, onSelectDate, title = 'Select Date & Time' }: DatePickerModalProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [selectedHour, setSelectedHour] = useState(new Date().getHours() % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(Math.floor(new Date().getMinutes() / 5) * 5); // Nearest 5 min
  const [selectedAmPm, setSelectedAmPm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');
  
  // When opened, reset to today if no date is explicitly selected
  useEffect(() => {
    if (visible && selectedDay === null) {
      setSelectedDay(new Date().getDate());
      setSelectedMonth(new Date().getMonth());
      setSelectedYear(new Date().getFullYear());
    }
  }, [visible]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDay(day);
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  const handleConfirm = () => {
    if (selectedDay === null) return;
    
    const formattedDate = \`\${selectedDay.toString().padStart(2, '0')}/\${(selectedMonth + 1).toString().padStart(2, '0')}/\${selectedYear}\`;
    const formattedTime = \`\${selectedHour.toString().padStart(2, '0')}:\${selectedMinute.toString().padStart(2, '0')} \${selectedAmPm}\`;
    
    // Most fields likely expect the time appended, or the backend will parse it if provided.
    // Standard JS Date or moment can parse "DD/MM/YYYY HH:MM AM/PM" but let's make sure it's cleanly appended
    onSelectDate(\`\${formattedDate} \${formattedTime}\`);
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={\`empty-\${i}\`} style={styles.dayCell} />);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = selectedDay === i && selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={i} 
          style={[styles.dayCell, isSelected && styles.todayCell]}
          onPress={() => handleDateSelect(i)}
        >
          <Text style={[styles.dayText, isSelected && styles.todayText]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Time Picker Section */}
          <View style={styles.timeSection}>
             <Text style={styles.timeLabel}>Select Time</Text>
             <View style={styles.timePickers}>
                {/* Hour */}
                <View style={styles.timeColumn}>
                  <TouchableOpacity onPress={() => setSelectedHour(prev => prev === 12 ? 1 : prev + 1)}>
                    <Icon name="chevron-up" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{selectedHour.toString().padStart(2, '0')}</Text>
                  <TouchableOpacity onPress={() => setSelectedHour(prev => prev === 1 ? 12 : prev - 1)}>
                    <Icon name="chevron-down" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.timeColon}>:</Text>

                {/* Minute */}
                <View style={styles.timeColumn}>
                  <TouchableOpacity onPress={() => setSelectedMinute(prev => prev >= 55 ? 0 : prev + 5)}>
                    <Icon name="chevron-up" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{selectedMinute.toString().padStart(2, '0')}</Text>
                  <TouchableOpacity onPress={() => setSelectedMinute(prev => prev <= 0 ? 55 : prev - 5)}>
                    <Icon name="chevron-down" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* AM/PM */}
                <View style={[styles.timeColumn, { marginLeft: spacing.m }]}>
                  <TouchableOpacity onPress={() => setSelectedAmPm(prev => prev === 'AM' ? 'PM' : 'AM')}>
                    <Icon name="chevron-up" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{selectedAmPm}</Text>
                  <TouchableOpacity onPress={() => setSelectedAmPm(prev => prev === 'AM' ? 'PM' : 'AM')}>
                    <Icon name="chevron-down" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
             </View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
             <Text style={styles.confirmBtnText}>Confirm Date & Time</Text>
          </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxWidth: 400, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.m, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width: 0, height: 5}, maxHeight: '90%' },
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
  
  timeSection: { marginTop: spacing.l, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.m },
  timeLabel: { fontSize: typography.sizes.m, fontWeight: typography.weights.bold, color: colors.text, textAlign: 'center', marginBottom: spacing.m },
  timePickers: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  timeColumn: { alignItems: 'center' },
  timeValue: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginVertical: spacing.xs },
  timeColon: { fontSize: 28, fontWeight: 'bold', color: colors.textSecondary, marginHorizontal: spacing.m, paddingBottom: 6 },
  
  confirmBtn: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 12, alignItems: 'center', marginTop: spacing.l },
  confirmBtnText: { color: colors.surface, fontSize: typography.sizes.m, fontWeight: typography.weights.bold },
});
`;

fs.writeFileSync(file, newComponent);
console.log('Fixed custom DatePickerModal.tsx');
