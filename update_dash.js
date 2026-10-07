const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
if (!content.includes('useState')) {
  content = content.replace(
    /import React from 'react';/,
    "import React, { useState, useEffect } from 'react';"
  );
}

if (!content.includes('AsyncStorage')) {
  content = content.replace(
    /import \{ useNavigation \}/,
    "import { useNavigation } from '@react-navigation/native';\nimport AsyncStorage from '@react-native-async-storage/async-storage';"
  );
}

// Add state and effect
const oldCompStart = `export const SalesExecutiveHRMSDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();`;

const newCompStart = `export const SalesExecutiveHRMSDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadClockState();
    });
    return unsubscribe;
  }, [navigation]);

  const loadClockState = async () => {
    try {
      const clockedIn = await AsyncStorage.getItem('isClockedIn');
      const time = await AsyncStorage.getItem('clockInTime');
      if (clockedIn === 'true' && time) {
        setIsClockedIn(true);
        setClockInTime(new Date(time));
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
      }
    } catch (e) {
      console.log('Failed to load clock state');
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
`;

content = content.replace(oldCompStart, newCompStart);

// Update date badge
content = content.replace(
  /<Text style=\{styles\.dateBadgeText\}>Wed, Sep 30, 2026<\/Text>/,
  "<Text style={styles.dateBadgeText}>{todayStr}</Text>"
);

// Update clock status
const oldStatus = `<Text style={styles.shiftStatus}>Off the clock</Text>
          <Text style={styles.shiftDesc}>Head over to the Attendance page to start your shift.</Text>`;

const newStatus = `<Text style={styles.shiftStatus}>
            {isClockedIn && clockInTime 
              ? \`Started at \${clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\`
              : 'Off the clock'}
          </Text>
          <Text style={styles.shiftDesc}>
            {isClockedIn 
              ? 'You are currently on the clock.'
              : 'Head over to the Attendance page to start your shift.'}
          </Text>`;

content = content.replace(oldStatus, newStatus);

fs.writeFileSync(file, content);
console.log('Dashboard clock status updated');
