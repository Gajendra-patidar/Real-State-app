import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface ExecutiveCardProps {
  name: string;
  role: string;
  assigned: number;
  booked: number;
  conversionRate: string;
}

export const ExecutivePerformanceCard: React.FC<ExecutiveCardProps> = ({
  name,
  role,
  assigned,
  booked,
  conversionRate,
}) => {
  // Generate initials
  const initials = (name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{assigned}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{booked}</Text>
          <Text style={styles.statLabel}>Booked</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Conversion Rate:</Text>
        <Text style={styles.footerValue}>{conversionRate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.s,
    marginRight: spacing.s,
    width: 200, // Fixed width for horizontal scrolling on mobile
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  avatarText: {
    color: colors.surface,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.s,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  role: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.s,
    marginBottom: spacing.m,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  footerValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
});
