const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import AsyncStorage")) {
  content = content.replace(
    /import \{ useNavigation \} from '@react-navigation\/native';/,
    "import { useNavigation } from '@react-navigation/native';\nimport AsyncStorage from '@react-native-async-storage/async-storage';"
  );
}

// Update useEffect to load from AsyncStorage
const oldUseEffect = `  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`;

const newUseEffect = `  useEffect(() => {
    fetchAttendance();
    loadClockState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClockState = async () => {
    try {
      const clockedIn = await AsyncStorage.getItem('isClockedIn');
      const time = await AsyncStorage.getItem('clockInTime');
      if (clockedIn === 'true' && time) {
        setIsClockedIn(true);
        setClockInTime(new Date(time));
      }
    } catch (e) {
      console.log('Failed to load clock state');
    }
  };`;

content = content.replace(oldUseEffect, newUseEffect);

// Update handleClockToggle clockOut block
const oldClockOut = `setIsClockedIn(false);
        setClockInTime(null);
        Alert.alert('Success', 'Clocked out successfully');`;

const newClockOut = `setIsClockedIn(false);
        setClockInTime(null);
        await AsyncStorage.removeItem('isClockedIn');
        await AsyncStorage.removeItem('clockInTime');
        Alert.alert('Success', 'Clocked out successfully');`;

content = content.replace(oldClockOut, newClockOut);

// Update handleClockToggle clockIn block
const oldClockIn = `setIsClockedIn(true);
              setClockInTime(new Date());
              Alert.alert('Success', 'Clocked in successfully');`;

const newClockIn = `const now = new Date();
              setIsClockedIn(true);
              setClockInTime(now);
              await AsyncStorage.setItem('isClockedIn', 'true');
              await AsyncStorage.setItem('clockInTime', now.toISOString());
              Alert.alert('Success', 'Clocked in successfully');`;

content = content.replace(oldClockIn, newClockIn);

fs.writeFileSync(file, content);
console.log('Persisted clock state with AsyncStorage');
