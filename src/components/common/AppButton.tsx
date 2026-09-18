import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.secondary;
      case 'secondary': return colors.primary;
      case 'outline': return colors.transparent;
      default: return colors.secondary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'outline': return colors.secondary;
      default: return colors.surface;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: getBackgroundColor()},
        variant === 'outline' && {borderWidth: 1, borderColor: colors.secondary},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, {color: getTextColor()}, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    marginVertical: spacing.s,
  },
  text: {
    fontSize: typography.sizes.m,
    fontWeight: typography.weights.semibold,
  },
});
