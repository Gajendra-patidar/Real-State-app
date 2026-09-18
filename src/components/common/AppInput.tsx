import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          !!error && styles.inputContainerError,
        ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureText}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setSecureText(!secureText)}>
            <Icon
              name={secureText ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  label: {
    fontSize: typography.sizes.s,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  inputContainerFocused: {
    borderColor: colors.secondary,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.m,
    fontSize: typography.sizes.m,
    color: colors.text,
  },
  iconContainer: {
    padding: spacing.m,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});
