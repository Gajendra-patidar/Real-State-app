import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SalesExecutiveActivityLogScreen = () => {
  const navigation = useNavigation<any>();

  const LOGS = [
    { id: 1, date: '01 Oct 2026, 04:15 PM', ago: '49 minutes ago', staff: 'Vikram Singh', lead: 'Amit Patidar', category: 'LEAD UPDATED', remark: 'Lead details updated by Vikram Singh' },
    { id: 2, date: '01 Oct 2026, 03:48 PM', ago: '1 hour ago', staff: 'Vikram Singh', lead: 'Amit Patidar', category: 'STATUS CHANGE', remark: 'Status changed from site_visit to interested.' },
    { id: 3, date: '01 Oct 2026, 01:59 PM', ago: '3 hours ago', staff: 'Neha Gupta', lead: 'Rohan sharma', category: 'ASSIGNED', remark: 'Lead auto-assigned (Round Robin) to Sales Executive Neha Gupta' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Activity Log" />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerBox}>
          <View style={styles.titleRow}>
            <Icon name="format-list-bulleted" size={20} color="#6366F1" style={{marginRight: 8}} />
            <Text style={styles.title}>Team Activity Log & Work Feed</Text>
          </View>
          <Text style={styles.subtitle}>Monitor sales call feedback, site visits, lead assignments, and interactions</Text>
          
          <View style={styles.syncBadge}>
            <View style={styles.dot} />
            <Text style={styles.syncText}>Real-time Work Activity Feed</Text>
          </View>
        </View>

        {LOGS.map(log => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <View>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logAgo}>{log.ago}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{log.category}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.logBody}>
              <View style={styles.logCol}>
                <Text style={styles.logLbl}>Staff Member</Text>
                <Text style={styles.logVal}>{log.staff}</Text>
              </View>
              <View style={styles.logCol}>
                <Text style={styles.logLbl}>Customer Lead</Text>
                <Text style={styles.logVal}>{log.lead}</Text>
              </View>
            </View>
            
            <View style={styles.remarkBox}>
              <Text style={styles.remarkText}>{log.remark}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: spacing.m },
  
  headerBox: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 11, color: colors.textSecondary, marginBottom: spacing.m },
  syncBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#A7F3D0' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669', marginRight: 6 },
  syncText: { color: colors.text, fontSize: 10, fontWeight: 'bold' },

  logCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.m, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logDate: { fontSize: 12, fontWeight: 'bold', color: colors.text },
  logAgo: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  
  categoryBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  categoryText: { fontSize: 9, fontWeight: 'bold', color: colors.textSecondary },
  
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.s },
  
  logBody: { flexDirection: 'row', marginBottom: spacing.s },
  logCol: { flex: 1 },
  logLbl: { fontSize: 9, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2 },
  logVal: { fontSize: typography.sizes.s, fontWeight: '600', color: '#4F46E5' },
  
  remarkBox: { backgroundColor: '#F8FAFC', padding: spacing.s, borderRadius: 8 },
  remarkText: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
});
