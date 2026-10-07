const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import for image picker
if (!content.includes('launchCamera')) {
  content = content.replace(
    /import Icon from 'react-native-vector-icons\/MaterialCommunityIcons';/,
    `import Icon from 'react-native-vector-icons/MaterialCommunityIcons';\nimport { launchCamera } from 'react-native-image-picker';`
  );
}

// 2. Add clockInTime state
content = content.replace(
  /const \[isClockedIn, setIsClockedIn\] = useState\(false\);/,
  `const [isClockedIn, setIsClockedIn] = useState(false);\n  const [clockInTime, setClockInTime] = useState<Date | null>(null);`
);

// 3. Update handleClockToggle
const oldHandleClock = /const handleClockToggle = async \(\) => \{[\s\S]*?fetchAttendance\(\); \/\/ refresh the list after clocking in\/out\n    \} catch \(error: any\) \{[\s\S]*?Alert.alert\('Error', `\$\{backendMsg\} \\n \$\{validationErrors\}`\);\n    \}\n  \};/;

const newHandleClock = `const handleClockToggle = async () => {
    try {
      if (isClockedIn) {
        console.log('Clock out response:');
        const response = await salesExecutiveApi.clockOut();
        console.log('Clock out response:', response);
        setIsClockedIn(false);
        setClockInTime(null);
        Alert.alert('Success', 'Clocked out successfully');
        fetchAttendance();
      } else {
        launchCamera({ mediaType: 'photo', cameraType: 'front' }, async (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
            return;
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
            Alert.alert('Error', 'Could not open camera');
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            const formData = new FormData();
            formData.append('work_location', 'office');
            formData.append('latitude', '28.7041');
            formData.append('longitude', '77.1025');
            formData.append('selfie', {
              uri: asset.uri,
              type: asset.type || 'image/jpeg',
              name: asset.fileName || 'selfie.jpg',
            } as any);

            try {
              console.log('Clock in response:');
              const res = await salesExecutiveApi.clockIn(formData);
              console.log('Clock in response:', res);
              setIsClockedIn(true);
              setClockInTime(new Date());
              Alert.alert('Success', 'Clocked in successfully');
              fetchAttendance();
            } catch (error: any) {
              console.error('Failed to toggle clock status:', error?.response?.data || error);
              const backendMsg = error?.response?.data?.message || 'Failed to update attendance status';
              Alert.alert('Error', backendMsg);
            }
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to toggle clock status:', error?.response?.data || error);
      const backendMsg = error?.response?.data?.message || 'Failed to update attendance status';
      const validationErrors = error?.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '';
      Alert.alert('Error', \`\${backendMsg} \\n \${validationErrors}\`);
    }
  };`;

content = content.replace(oldHandleClock, newHandleClock);

// 4. Update the "Office Desk" tag removal and clockStatus text
content = content.replace(
  /<Text style=\{styles\.clockStatus\}>\{isClockedIn \? 'On the clock' : 'Off the clock'\}<\/Text>/,
  `<Text style={styles.clockStatus}>{isClockedIn && clockInTime ? \`Started at \${clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\` : 'Off the clock'}</Text>`
);

const officeDeskTag = `              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>Office Desk</Text>
                <Icon name="chevron-down" size={20} color="#D1FAE5" />
              </TouchableOpacity>`;

content = content.replace(officeDeskTag, '');

fs.writeFileSync(file, content);
console.log('Updated Attendance Screen successfully');
