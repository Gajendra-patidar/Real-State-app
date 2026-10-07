const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSLeaveManagementScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
if (!content.includes('KeyboardAvoidingView')) {
  content = content.replace(
    /import \{ View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert \} from 'react-native';/,
    "import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';"
  );
}

// Replace Modal Overlay
const oldModal = `<View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>`;

const newModal = `<KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>`;

content = content.replace(oldModal, newModal);

// Close KeyboardAvoidingView
const oldModalClose = `</View>
        </View>
      </Modal>`;

const newModalClose = `</View>
        </KeyboardAvoidingView>
      </Modal>`;

content = content.replace(oldModalClose, newModalClose);

// Also wrap the modal body in a ScrollView so it doesn't get squished out of view on smaller screens
const oldModalBody = `<View style={styles.modalBody}>`;
const newModalBody = `<ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">`;

const oldModalBodyClose = `</View>

          </View>`;
const newModalBodyClose = `</ScrollView>

          </View>`;

content = content.replace(oldModalBody, newModalBody);
content = content.replace(oldModalBodyClose, newModalBodyClose);

fs.writeFileSync(file, content);
console.log('Fixed Leave Modal Keyboard Issue');
