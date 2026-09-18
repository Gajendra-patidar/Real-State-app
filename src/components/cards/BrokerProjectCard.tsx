import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface BrokerProjectCardProps {
  city: string;
  unitsFree: number;
  projectName: string;
  onPreviewPress: () => void;
  onCopyLinkPress: () => void;
}

export const BrokerProjectCard: React.FC<BrokerProjectCardProps> = ({
  city,
  unitsFree,
  projectName,
  onPreviewPress,
  onCopyLinkPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{(city || '').toUpperCase()}</Text>
        </View>
        <Text style={styles.unitsText}>
          <Text style={styles.unitsCount}>{unitsFree}</Text> Units Free
        </Text>
      </View>
      
      <Text style={styles.projectName}>{projectName}</Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <TouchableOpacity onPress={onPreviewPress}>
          <Text style={styles.previewText}>Preview Showcase →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.copyBtn} onPress={onCopyLinkPress}>
          <Text style={styles.copyBtnText}>Copy Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    width: 280, // For horizontal scrolling
    marginRight: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  badge: {
    backgroundColor: '#E0F2FE', // Light blue
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  unitsText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: typography.weights.medium,
  },
  unitsCount: {
    fontWeight: typography.weights.bold,
  },
  projectName: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontSize: typography.sizes.s,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  copyBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyBtnText: {
    color: colors.surface,
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.bold,
  },
});
