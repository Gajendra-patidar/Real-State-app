import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface LeadCardProps {
  customerName: string;
  leadCode: string;
  phone: string;
  hasWhatsapp: boolean;
  property: string;
  assignedExecutive: string;
  status: string;
  onViewPress: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  customerName,
  leadCode,
  phone,
  hasWhatsapp,
  property,
  assignedExecutive,
  status,
  onViewPress,
}) => {
  const getStatusColor = () => {
    switch ((status || '').toUpperCase()) {
      case 'NEW': return colors.info;
      case 'SITE VISIT': return colors.warning;
      case 'NEGOTIATION': return colors.purple;
      case 'BOOKED': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const initials = (customerName || '').charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{customerName}</Text>
          <Text style={styles.leadCode}>{leadCode}</Text>
        </View>
        <TouchableOpacity style={styles.viewBtn} onPress={onViewPress}>
          <Icon name="eye-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.row}>
        <Icon name="phone" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{phone}</Text>
        {hasWhatsapp && <View style={styles.waBadge}><Text style={styles.waText}>WA</Text></View>}
      </View>

      <View style={styles.row}>
        <Icon name="office-building" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{property}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="account-tie" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>Assigned: <Text style={styles.bold}>{assignedExecutive}</Text></Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor() + '20'}]}>
          <Text style={[styles.statusText, {color: getStatusColor()}]}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
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
    backgroundColor: '#E0F2FE', // light blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  avatarText: {
    color: colors.info,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.m,
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
    color: colors.textSecondary,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  infoText: {
    fontSize: typography.sizes.s,
    color: colors.text,
    marginLeft: spacing.s,
  },
  bold: {
    fontWeight: typography.weights.bold,
  },
  waBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginLeft: spacing.s,
  },
  waText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  footer: {
    marginTop: spacing.xs,
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
});
