const fs = require('fs');
const file = 'src/screens/shared/NotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import Modal and ScrollView
if (!content.includes('Modal,')) {
    content = content.replace("from 'react-native';", "Modal, ScrollView, } from 'react-native';");
}

// Add state
const statePattern = `const [notifications, setNotifications] = useState<any[]>([]);`;
if (!content.includes('selectedNotification')) {
    content = content.replace(
        statePattern, 
        `${statePattern}\n  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);\n  const [modalVisible, setModalVisible] = useState(false);`
    );
}

// Update onPress to mark as read AND show modal
const onPressPattern = `onPress={() => !isRead ? markAsRead(item.id) : null}`;
const newOnPress = `onPress={() => {
          if (!isRead) markAsRead(item.id);
          setSelectedNotification({ item, title, message, type, time });
          setModalVisible(true);
        }}`;
content = content.replace(onPressPattern, newOnPress);

// Build the Modal JSX
const modalJSX = `
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: selectedNotification ? getIconBg(selectedNotification.type) : '#eee' }]}>
                {selectedNotification && renderIcon(selectedNotification.type)}
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
              <Text style={styles.modalTime}>{selectedNotification?.time}</Text>
              
              <View style={styles.modalDivider} />
              
              <Text style={styles.modalMessage}>{selectedNotification?.message}</Text>
              
              {selectedNotification?.item?.lead && (
                <View style={styles.modalExtraData}>
                  <Text style={styles.modalExtraTitle}>Related Lead</Text>
                  <Text style={styles.modalExtraText}>Name: {selectedNotification.item.lead.name || selectedNotification.item.lead.first_name}</Text>
                  <Text style={styles.modalExtraText}>Phone: {selectedNotification.item.lead.phone}</Text>
                  <Text style={styles.modalExtraText}>Status: {selectedNotification.item.lead.status}</Text>
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity style={styles.modalActionBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalActionBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
`;

// Insert modalJSX before closing View
content = content.replace(`    </View>\n  );\n};`, modalJSX + `    </View>\n  );\n};`);

// Add styles
const newStyles = `
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.l, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  modalIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  closeButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { fontSize: 16, color: colors.textSecondary, fontWeight: 'bold' },
  modalScroll: { marginBottom: spacing.l },
  modalTitle: { fontSize: typography.sizes.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.xs },
  modalTime: { fontSize: typography.sizes.s, color: colors.textSecondary, marginBottom: spacing.m },
  modalDivider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.m },
  modalMessage: { fontSize: typography.sizes.m, color: colors.text, lineHeight: 22, marginBottom: spacing.l },
  modalExtraData: { backgroundColor: '#F8FAFC', padding: spacing.m, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  modalExtraTitle: { fontSize: typography.sizes.s, fontWeight: 'bold', color: colors.textSecondary, marginBottom: spacing.s, textTransform: 'uppercase' },
  modalExtraText: { fontSize: typography.sizes.m, color: colors.text, marginBottom: 4, fontWeight: '500' },
  modalActionBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalActionBtnText: { color: '#FFF', fontSize: typography.sizes.m, fontWeight: 'bold' },
`;

content = content.replace(`});`, newStyles + `});`);

fs.writeFileSync(file, content);
console.log('Added detailed notification modal');
