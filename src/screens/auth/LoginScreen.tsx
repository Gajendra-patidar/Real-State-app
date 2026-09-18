import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../../services/api/authApi';
import {setCredentials} from '../../store/slices/authSlice';
import {colors} from '../../theme/colors';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  TrendingUp,
  Users,
  ChevronRight,
} from 'lucide-react-native';

const {width: W, height: H} = Dimensions.get('window');

// ─── Feature Bullet ───────────────────────────────────────────────────────
const FeatureBullet = ({icon, text}: {icon: React.ReactNode; text: string}) => (
  <View style={styles.featureRow}>
    <View style={styles.featureIconWrap}>{icon}</View>
    <Text style={styles.featureText}>{text}</Text>
    <ChevronRight size={12} color="rgba(255,255,255,0.4)" />
  </View>
);

// ─── Custom Text Input ────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  icon: React.ReactNode;
  error?: string;
  isPassword?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
}
const InputField: React.FC<InputFieldProps> = ({
  label, placeholder, value, onChangeText,
  icon, error, isPassword, keyboardType = 'default', autoCapitalize = 'none',
}) => {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);
  // ref so tapping anywhere on the row opens keyboard
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      {/* Outer TouchableOpacity forces focus even if user taps icon/padding */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}>
        <View style={styles.inputIconLeft}>{icon}</View>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCorrect={false}
          editable={true}
          pointerEvents="box-none"
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(p => !p)}>
            {showPass
              ? <EyeOff size={18} color={colors.textMuted} />
              : <Eye size={18} color={colors.textMuted} />}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {!!error && (
        <View style={styles.errorRow}>
          <Shield size={11} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────
export const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{email?: string; password?: string}>({});

  const validate = () => {
    const e: {email?: string; password?: string} = {};
    if (!email) {
      e.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await authApi.login({email, password});
      if (data.status === 'success' && data.token && data.user) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        dispatch(setCredentials({user: data.user, token: data.token}));
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Network error. Please check your connection.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, {paddingTop: insets.top, paddingBottom: insets.bottom + 24}]}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>

          {/* ── Top Brand Section ───────────────────────────────────── */}
          <View style={styles.brandSection}>
            {/* Logo mark */}
            <View style={styles.logoMark}>
              <Building2 size={32} color={colors.surface} strokeWidth={2} />
            </View>

            {/* <Text style={styles.brandName}>REOS CRM</Text> */}
            <Text style={styles.brandTagline}>Real Estate Operating System</Text>
            {/* <Text style={styles.brandSub}>SaaS Workspace</Text> */}

            {/* Feature pills */}
            {/* <View style={styles.featuresContainer}>
              <FeatureBullet
                icon={<TrendingUp size={13} color={colors.accentGold} />}
                text="Real-time leads & pipeline"
              />
              <FeatureBullet
                icon={<Users size={13} color={colors.accentGold} />}
                text="Team performance tracking"
              />
              <FeatureBullet
                icon={<Shield size={13} color={colors.accentGold} />}
                text="Role-based secure access"
              />
            </View> */}
          </View>

          {/* ── Login Card ───────────────────────────────────────────── */}
          <View style={styles.card}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <LogIn size={20} color={colors.secondary} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSub}>Sign in to your workspace</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Inputs */}
            <InputField
              label="Email Address"
              placeholder="you@company.com"
              value={email}
              onChangeText={t => {setEmail(t); setErrors(e => ({...e, email: undefined}));}}
              icon={<Mail size={18} color={errors.email ? colors.error : colors.textMuted} />}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={t => {setPassword(t); setErrors(e => ({...e, password: undefined}));}}
              icon={<Lock size={18} color={errors.password ? colors.error : colors.textMuted} />}
              error={errors.password}
              isPassword
            />

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => Alert.alert('Forgot Password', 'Please contact your administrator to reset your password.')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <LogIn size={18} color={colors.surface} strokeWidth={2.5} />
                  <Text style={styles.loginBtnText}>Sign In to Dashboard</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info note */}
            <View style={styles.infoNote}>
              <Shield size={18} color={colors.textMuted} />
              <Text style={styles.infoNoteText}>
                Access is provided by your administrator. New accounts cannot be self-registered.
              </Text>
            </View>
          </View>

          {/* ── Role badges ─────────────────────────────────────────── */}
          <View style={styles.rolesRow}>
            {['Manager', 'Sales Executive', 'Broker Partner'].map(role => (
              <View key={role} style={styles.rolePill}>
                <Text style={styles.rolePillText}>{role}</Text>
              </View>
            ))}
          </View>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <Text style={styles.footer}>REOS CRM v1.0 • Secured with TLS</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flex: {flex: 1},
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  // Brand Section
  brandSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.surface,
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 10,
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(245,158,11,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  cardHeaderIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 24,
  },

  // Input
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: colors.secondary,
    backgroundColor: colors.surface,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  inputIconLeft: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  errorText: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '500',
  },

  // Forgot
  forgotBtn: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },

  // Login Button
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    height: 54,
    gap: 10,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 0.3,
  },

  // Info note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    fontWeight: '500',
  },

  // Role badges
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rolePillText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 16,
    fontWeight: '500',
  },
});
