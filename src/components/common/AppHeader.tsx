import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  leftIcon?: string;
  onLeftPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  leftIcon,
  onLeftPress,
}) => {
  return (
    <View style={styles.container}>
      {leftIcon ? (
        <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
          <Icon name={leftIcon} size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
      
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>

      {rightIcon ? (
        <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
          <Icon name={rightIcon} size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.s,
  },
  iconPlaceholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
