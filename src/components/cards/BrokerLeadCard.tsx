import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface BrokerLeadCardProps {
  customerName: string;
  leadCode: string;
  phone: string;
  property: string;
  date: string;
  status: string;
}

export const BrokerLeadCard: React.FC<BrokerLeadCardProps> = ({
  customerName,
  leadCode,
  phone,
  property,
  date,
  status,
}) => {
  const getStatusColor = () => {
    switch ((status || '').toUpperCase()) {
      case 'ASSIGNED': return colors.info;
      case 'NEGOTIATION': return colors.purple;
      case 'BOOKED': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{customerName}</Text>
          <Text style={styles.leadCode}>{leadCode}</Text>
        </View>
        <View style={[styles.statusBadge, {borderColor: getStatusColor()}]}>
          <Text style={[styles.statusText, {color: getStatusColor()}]}>{(status || '').toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.infoCol}>
          <Icon name="phone" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{phone}</Text>
        </View>
        <View style={styles.infoCol}>
          <Icon name="office-building" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{property}</Text>
        </View>
      </View>

      <View style={[styles.row, {marginTop: spacing.xs}]}>
        <View style={styles.infoCol}>
          <Icon name="calendar" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  leadCode: {
    fontSize: typography.sizes.xs,
    color: colors.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: typography.sizes.s,
    color: colors.text,
    marginLeft: 6,
  },
});
