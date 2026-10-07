import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  User,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Home,
  FileText,
  ChevronDown,
  CheckCircle2,
  X,
  Send,
} from 'lucide-react-native';
import {brokerApi} from '../../services/api/brokerApi';
import {colors} from '../../theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: number;
  name: string;
  code?: string;
  city?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  project_id: number | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_label: string;
  bhk_type: string;
  notes: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  project_id?: string;
}

// Actual API response from POST /broker/leads
interface SubmitResponse {
  status: string;
  message: string;
  lead_id: number;
  broker_lead_id: number;
  is_duplicate: boolean;
  data: {
    id: number;
    lead_code: string;
    first_name: string;
    last_name: string;
    customer_name: string;
    phone: string;
    email: string;
    project: {id: number; name: string; code: string; city: string} | null;
    property_type: string | null;
    unit_type: string | null;
    budget_min: number | null;
    budget_max: number | null;
    broker_visible_status: string;
    broker_visible_message: string;
    submitted_at: string;
    last_updated_at: string;
  };
}

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Villa', 'Plot'];
const BUDGET_OPTIONS = ['< 20L', '20L – 40L', '40L – 60L', '60L – 80L', '80L – 1Cr', '1Cr – 1.5Cr', '> 1.5Cr'];

const MOCK_PROJECTS: Project[] = [
  {id: 1, name: 'Apex Grand Residency', city: 'Hyderabad'},
  {id: 2, name: 'Subh Angan',           city: 'Indore'},
  {id: 3, name: 'Green Valley Heights', city: 'Pune'},
];

// ─── Field Wrapper ────────────────────────────────────────────────────────────
const Field = ({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {children}
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

// ─── Text Input Field ─────────────────────────────────────────────────────────
const InputField = ({
  icon, placeholder, value, onChangeText, keyboardType, autoCapitalize, error, multiline, maxLength,
}: any) => (
  <View style={[styles.inputWrap, error && styles.inputError, multiline && styles.inputMultiline]}>
    <View style={styles.inputIcon}>{icon}</View>
    <TextInput
      style={[styles.input, multiline && styles.inputTextMulti]}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      autoCapitalize={autoCapitalize || 'sentences'}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      maxLength={maxLength}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

// ─── Success Modal ────────────────────────────────────────────────────────────
interface SuccessModalProps {
  visible: boolean;
  response: SubmitResponse | null;
  onDone: () => void;
}

const SuccessModal = ({visible, response, onDone}: SuccessModalProps) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true, friction: 6, tension: 80,
      }).start();
    } else {
      scaleAnim.setValue(0.7);
    }
  }, [visible, scaleAnim]);

  if (!response) return null;

  const isDuplicate = response.is_duplicate;
  const leadCode    = response.data?.lead_code || '';
  const message     = response.data?.broker_visible_message || response.message || '';
  const status      = response.data?.broker_visible_status || '';
  const project     = response.data?.project;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalCard, {transform: [{scale: scaleAnim}]}]}>

          {/* Icon */}
          <View style={[
            styles.modalIconWrap,
            {backgroundColor: isDuplicate ? colors.warningLight : colors.successLight},
          ]}>
            <CheckCircle2
              size={52}
              color={isDuplicate ? colors.warning : colors.success}
            />
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>
            {isDuplicate ? 'Lead Already Exists' : 'Lead Submitted!'}
          </Text>

          {/* Duplicate warning banner */}
          {isDuplicate && (
            <View style={styles.duplicateBanner}>
              <Text style={styles.duplicateText}>
                ⚠️ This lead was already submitted previously. Your referral has been recorded.
              </Text>
            </View>
          )}

          {/* Broker visible message */}
          {message ? (
            <Text style={styles.modalSub}>{message}</Text>
          ) : null}

          {/* Lead Code chip */}
          {leadCode ? (
            <View style={styles.modalCodeWrap}>
              <Text style={styles.modalCodeLabel}>Lead Code</Text>
              <Text style={styles.modalCode}>{leadCode}</Text>
            </View>
          ) : null}

          {/* Status + Project detail row */}
          <View style={styles.modalMetaRow}>
            {status ? (
              <View style={styles.modalMetaChip}>
                <View style={styles.modalMetaDot} />
                <Text style={styles.modalMetaText}>{status}</Text>
              </View>
            ) : null}
            {project ? (
              <View style={styles.modalMetaChip}>
                <Text style={styles.modalMetaText}>📍 {project.city}</Text>
              </View>
            ) : null}
          </View>

          {/* Project name */}
          {project ? (
            <Text style={styles.modalProjectName}>{project.name}</Text>
          ) : null}

          <TouchableOpacity style={styles.modalBtn} onPress={onDone}>
            <Text style={styles.modalBtnText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const BrokerSubmitLeadScreen = () => {
  const insets = useSafeAreaInsets();

  const [projects, setProjects]         = useState<Project[]>([]);
  const [submitting, setSubmitting]     = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);

  // Pickers
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showBhkPicker, setShowBhkPicker]         = useState(false);
  const [showBudgetPicker, setShowBudgetPicker]   = useState(false);

  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', phone: '', email: '',
    project_id: null, budget_min: null, budget_max: null, budget_label: '', bhk_type: '', notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (key: keyof FormData, val: any) => {
    setForm(prev => ({...prev, [key]: val}));
    if (errors[key as keyof FormErrors]) {
      setErrors(prev => ({...prev, [key]: undefined}));
    }
  };

  const selectedProject = projects.find(p => p.id === form.project_id);

  const loadProjects = useCallback(async () => {
    try {
      const res = await brokerApi.getBrokerProjects();
      setProjects(res.data || []);
    } catch {
      setProjects(MOCK_PROJECTS);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.first_name.trim())  errs.first_name = 'First name is required';
    if (!form.last_name.trim())   errs.last_name  = 'Last name is required';
    if (!form.phone.trim())       errs.phone      = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
    if (!form.project_id)         errs.project_id = 'Please select a project';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: any = {
        first_name: form.first_name.trim(),
        last_name:  form.last_name.trim(),
        phone:      form.phone.trim(),
      };
      if (form.email.trim())  payload.email      = form.email.trim();
      if (form.project_id)    payload.project_id = form.project_id;
      payload.budget_min = form.budget_min;
      payload.budget_max = form.budget_max;
      if (form.bhk_type)      payload.bhk_type   = form.bhk_type;
      if (form.notes.trim())  payload.notes      = form.notes.trim();

      const res: SubmitResponse = await brokerApi.submitBrokerLead(payload);
      setSubmitResponse(res);
      setShowSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit lead. Please check your connection and try again.';
      Alert.alert('Submission Failed', msg, [{text: 'OK'}]);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({first_name: '', last_name: '', phone: '', email: '', project_id: null, budget_min: null, budget_max: null, budget_label: '', bhk_type: '', notes: ''});
    setErrors({});
    setShowSuccess(false);
    setSubmitResponse(null);
  };


  // ── Picker Modal ──────────────────────────────────────────────────────────
  const PickerModal = ({
    visible, title, options, onSelect, onClose,
  }: {
    visible: boolean; title: string; options: string[]; onSelect: (v: string) => void; onClose: () => void;
  }) => (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.pickerSheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.pickerHandle} />
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.pickerClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={styles.pickerOption}
              onPress={() => { onSelect(opt); onClose(); }}>
              <Text style={styles.pickerOptionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const ProjectPickerModal = () => (
    <Modal visible={showProjectPicker} transparent animationType="slide">
      <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowProjectPicker(false)}>
        <View style={[styles.pickerSheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.pickerHandle} />
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Project</Text>
            <TouchableOpacity onPress={() => setShowProjectPicker(false)} style={styles.pickerClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {projects.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.pickerOption, form.project_id === p.id && styles.pickerOptionActive]}
              onPress={() => { setField('project_id', p.id); setShowProjectPicker(false); }}>
              <View>
                <Text style={[styles.pickerOptionText, form.project_id === p.id && styles.pickerOptionTextActive]}>
                  {p.name}
                </Text>
                {p.city ? (
                  <Text style={styles.pickerOptionSub}>{p.city}</Text>
                ) : null}
              </View>
              {form.project_id === p.id && (
                <CheckCircle2 size={18} color={colors.secondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <Text style={styles.headerTitle}>Submit a Lead</Text>
        <Text style={styles.headerSub}>Refer a client and earn commissions</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: insets.bottom + 30}]}
        keyboardShouldPersistTaps="handled">

        {/* ── Section: Customer Info ───────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, {backgroundColor: colors.infoLight}]}>
              <User size={16} color={colors.info} />
            </View>
            <Text style={styles.sectionTitle}>Customer Information</Text>
          </View>

          <Field label="First Name" required error={errors.first_name}>
            <InputField
              icon={<User size={16} color={colors.textMuted} />}
              placeholder="Enter first name"
              value={form.first_name}
              onChangeText={(v: string) => setField('first_name', v)}
              error={errors.first_name}
            />
          </Field>

          <Field label="Last Name" required error={errors.last_name}>
            <InputField
              icon={<User size={16} color={colors.textMuted} />}
              placeholder="Enter last name"
              value={form.last_name}
              onChangeText={(v: string) => setField('last_name', v)}
              error={errors.last_name}
            />
          </Field>

          <Field label="Phone Number" required error={errors.phone}>
            <InputField
              icon={<Phone size={16} color={colors.textMuted} />}
              placeholder="10-digit mobile number"
              value={form.phone}
              onChangeText={(v: string) => setField('phone', v.replace(/\D/g, ''))}
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={10}
              error={errors.phone}
            />
          </Field>

          <Field label="Email Address">
            <InputField
              icon={<Mail size={16} color={colors.textMuted} />}
              placeholder="Optional"
              value={form.email}
              onChangeText={(v: string) => setField('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Field>
        </View>

        {/* ── Section: Property Interest ───────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, {backgroundColor: colors.purpleLight}]}>
              <Building2 size={16} color={colors.purple} />
            </View>
            <Text style={styles.sectionTitle}>Property Interest</Text>
          </View>

          {/* Project Picker */}
          <Field label="Select Project" required error={errors.project_id}>
            <TouchableOpacity
              style={[styles.selectWrap, errors.project_id && styles.inputError]}
              onPress={() => setShowProjectPicker(true)}
              activeOpacity={0.7}>
              <Building2 size={16} color={colors.textMuted} style={{marginRight: 10}} />
              <Text style={[styles.selectText, !selectedProject && styles.selectPlaceholder]}>
                {selectedProject ? selectedProject.name : 'Choose a project…'}
              </Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </TouchableOpacity>
            {errors.project_id ? <Text style={styles.fieldError}>{errors.project_id}</Text> : null}
          </Field>

          {/* BHK Picker */}
          <Field label="BHK Type">
            <TouchableOpacity
              style={styles.selectWrap}
              onPress={() => setShowBhkPicker(true)}
              activeOpacity={0.7}>
              <Home size={16} color={colors.textMuted} style={{marginRight: 10}} />
              <Text style={[styles.selectText, !form.bhk_type && styles.selectPlaceholder]}>
                {form.bhk_type || 'Select BHK type…'}
              </Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </Field>

          {/* Budget Picker */}
          <Field label="Budget Range">
            <TouchableOpacity
              style={styles.selectWrap}
              onPress={() => setShowBudgetPicker(true)}
              activeOpacity={0.7}>
              <DollarSign size={16} color={colors.textMuted} style={{marginRight: 10}} />
              <Text style={[styles.selectText, !form.budget_label && styles.selectPlaceholder]}>
                {form.budget_label || 'Select budget range…'}
              </Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </Field>
        </View>

        {/* ── Section: Notes ───────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, {backgroundColor: colors.warningLight}]}>
              <FileText size={16} color={colors.warning} />
            </View>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>

          <InputField
            icon={<FileText size={16} color={colors.textMuted} />}
            placeholder="Any remarks about the client or requirement…"
            value={form.notes}
            onChangeText={(v: string) => setField('notes', v)}
            multiline
          />
        </View>

        {/* ── Submit Button ────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <>
              <Send size={18} color={colors.surface} />
              <Text style={styles.submitBtnText}>Submit Lead</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          By submitting, you confirm this client has given consent to be contacted by our sales team.
        </Text>
      </ScrollView>

      {/* ── Pickers ──────────────────────────────────────────────── */}
      <ProjectPickerModal />
      <PickerModal
        visible={showBhkPicker}
        title="Select BHK Type"
        options={BHK_OPTIONS}
        onSelect={v => setField('bhk_type', v)}
        onClose={() => setShowBhkPicker(false)}
      />
      <PickerModal
        visible={showBudgetPicker}
        title="Select Budget Range"
        options={BUDGET_OPTIONS}
        onSelect={v => {
          setField('budget_label', v);
          let min = null, max = null;
          if (v === '< 20L') { max = 2000000; }
          else if (v === '20L – 40L') { min = 2000000; max = 4000000; }
          else if (v === '40L – 60L') { min = 4000000; max = 6000000; }
          else if (v === '60L – 80L') { min = 6000000; max = 8000000; }
          else if (v === '80L – 1Cr') { min = 8000000; max = 10000000; }
          else if (v === '1Cr – 1.5Cr') { min = 10000000; max = 15000000; }
          else if (v === '> 1.5Cr') { min = 15000000; }
          setForm(prev => ({...prev, budget_min: min, budget_max: max}));
        }}
        onClose={() => setShowBudgetPicker(false)}
      />

      {/* ── Success Modal ─────────────────────────────────────────── */}
      <SuccessModal
        visible={showSuccess}
        response={submitResponse}
        onDone={resetForm}
      />
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.surface,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },

  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  // Sections
  section: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  // Field
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  required: {
    color: colors.error,
  },
  fieldError: {
    fontSize: 11,
    color: colors.error,
    marginTop: 4,
  },

  // Text Input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputMultiline: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  inputTextMulti: {
    textAlignVertical: 'top',
  },

  // Select
  selectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  selectPlaceholder: {
    color: colors.textMuted,
  },

  // Submit
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 14,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.surface,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },

  // Picker
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  pickerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  pickerClose: {
    padding: 4,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerOptionActive: {
    backgroundColor: colors.infoLight,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pickerOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  pickerOptionTextActive: {
    fontWeight: '700',
    color: colors.secondary,
  },
  pickerOptionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  // Duplicate warning
  duplicateBanner: {
    backgroundColor: colors.warningLight,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    width: '100%',
  },
  duplicateText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
    lineHeight: 18,
  },
  // Lead code
  modalCodeWrap: {
    backgroundColor: colors.infoLight,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  modalCodeLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalCode: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 1.5,
  },
  // Status + city chips row
  modalMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
  },
  modalMetaDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.success,
  },
  modalMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  // Project name
  modalProjectName: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Done button
  modalBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 4,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
});
