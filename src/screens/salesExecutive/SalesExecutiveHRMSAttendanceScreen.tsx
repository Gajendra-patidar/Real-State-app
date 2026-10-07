import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ScrollView, ActivityIndicator, Alert, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { salesExecutiveApi } from '../../services/api/salesExecutiveApi';

interface AttendanceRecord {
  id: string | number;
  name: string;
  role: string;
  status: string;
  checkIn: string;
  checkInLoc: string;
  checkOut: string;
  checkOutLoc: string;
  shift: string;
}


const GOOGLE_MAPS_API_KEY = "AIzaSyD-zPLVMYmi0V5GRRtdeQivDe8CEFBVL5E";

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }
  
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for attendance tracking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return false;
};

const getCurrentLocationAndAddress = async (): Promise<{latitude: string, longitude: string, address: string}> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
          const data = await response.json();
          let address = 'Location not found';
          if (data.results && data.results.length > 0) {
            address = data.results[0].formatted_address;
          }
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address });
        } catch (_error) {
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address: 'Error fetching address' });
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  });
};

export const SalesExecutiveHRMSAttendanceScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, role } = useAuth();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const response = await salesExecutiveApi.getAttendance();
      console.log('Attendance fetched:', response);
      let apiData = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        apiData = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        apiData = response.data;
      } else if (Array.isArray(response)) {
        apiData = response;
      }
      
      const mappedData = apiData.map((item: any) => ({
        id: item.id || Math.random().toString(),
        name: user?.name || user?.first_name || 'Executive',
        role: role || 'Sales Executive',
        status: item.status === 'present' ? 'Present' : (item.status || 'Present'),
        checkIn: item.clock_in ? `${item.date} ${item.clock_in}` : 'N/A',
        checkInLoc: item.address || 'N/A',
        checkOut: item.clock_out ? `${item.date} ${item.clock_out}` : '--:--',
        checkOutLoc: item.checkout_address || 'N/A',
        shift: 'Morning',
      }));
      setAttendance(mappedData);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  };

  const handleClockToggle = async () => {
    try {
      if (isClockedIn) {
        console.log('Clock out response:');
        const response = await salesExecutiveApi.clockOut();
        console.log('Clock out response:', response);
        setIsClockedIn(false);
        setClockInTime(null);
        await AsyncStorage.removeItem('isClockedIn');
        await AsyncStorage.removeItem('clockInTime');
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
            try {
              const locationData = await getCurrentLocationAndAddress();
              
              const formData = new FormData();
              formData.append('work_location', 'office');
              formData.append('latitude', locationData.latitude);
              formData.append('longitude', locationData.longitude);
              formData.append('address', locationData.address);
              formData.append('selfie', {
                uri: asset.uri,
                type: asset.type || 'image/jpeg',
                name: asset.fileName || 'selfie.jpg',
              } as any);

              console.log('Clock in response data:', formData);
              const res = await salesExecutiveApi.clockIn(formData);
              console.log('Clock in response:', res);
              const now = new Date();
              setIsClockedIn(true);
              setClockInTime(now);
              await AsyncStorage.setItem('isClockedIn', 'true');
              await AsyncStorage.setItem('clockInTime', now.toISOString());
              Alert.alert('Success', 'Clocked in successfully');
              fetchAttendance();
            } catch (error: any) {
              console.error('Failed to toggle clock status or fetch location:', error?.response?.data || error);
              const backendMsg = error?.response?.data?.message || error.message || 'Failed to update attendance status';
              Alert.alert('Error', backendMsg);
            }
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to toggle clock status:', error?.response?.data || error);
      const backendMsg = error?.response?.data?.message || 'Failed to update attendance status';
      const validationErrors = error?.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '';
      Alert.alert('Error', `${backendMsg} \n ${validationErrors}`);
    }
  };

  const renderStatBox = (label: string, value: string, color: string) => (
    <View style={[styles.statBox, { borderTopColor: color }]}>
      <Text style={styles.statBoxLabel}>{label}</Text>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
    </View>
  );

  const renderEmployeeCard = ({ item }: { item: AttendanceRecord }) => {
    const isAbsent = item.status === 'Absent';
    const initials = item.name ? item.name.split(' ').map(n => n[0]).join('') : '';

    return (
      <View style={styles.employeeCard}>
        <View style={styles.empHeader}>
          <View style={styles.empProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.empName}>{item.name}</Text>
              <Text style={styles.empRole}>{item.role}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isAbsent ? styles.statusAbsent : styles.statusPresent]}>
            <Text style={[styles.statusText, isAbsent ? {color: '#EF4444'} : {color: '#059669'}]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Check In</Text>
            <Text style={styles.gridValue}>{item.checkIn}</Text>
            <Text style={styles.gridSubValue}>{item.checkInLoc || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Check Out</Text>
            <Text style={styles.gridValue}>{item.checkOut}</Text>
            <Text style={styles.gridSubValue}>{item.checkOutLoc || 'N/A'}</Text>
          </View>
          <View style={[styles.gridItem, {width: '100%'}]}>
            <Text style={styles.gridLabel}>Shift</Text>
            <View style={styles.shiftBadge}>
              <Icon name="clock-outline" size={10} color="#4F46E5" style={{marginRight: 4}} />
              <Text style={styles.shiftBadgeText}>{item.shift} (9 hr Shift : A)</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} title="Attendance Tracking" />

      <FlatList
        data={attendance}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={loading ? <ActivityIndicator size="large" color="#059669" style={{marginTop: 20}} /> : <Text style={{textAlign: 'center', marginTop: 20}}>No attendance records found</Text>}
        ListHeaderComponent={
          <>
            {/* Clock-In Banner */}
            <View style={styles.clockBanner}>
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerTitle}>MY DAILY SHIFT</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>Wed, Sep 30, 2026</Text>
                </View>
              </View>

              <Text style={styles.clockStatus}>{isClockedIn && clockInTime ? `Started at ${clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Off the clock'}</Text>
              <Text style={styles.clockDesc}>Click below to start today's attendance.</Text>



              <TouchableOpacity 
                style={[styles.clockBtn, isClockedIn ? {backgroundColor: '#EF4444'} : {backgroundColor: '#FFF'}]}
                onPress={handleClockToggle}
              >
                <Icon name="clock-outline" size={20} color={isClockedIn ? '#FFF' : '#047857'} style={{marginRight: 8}} />
                <Text style={[styles.clockBtnText, isClockedIn ? {color: '#FFF'} : {color: '#047857'}]}>
                  {isClockedIn ? 'End Shift (Clock-Out)' : 'Start Shift (Clock-In)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Row */}
            <View style={styles.filterRow}>
              <Text style={styles.filterText}>Showing logs for: <Text style={{color: '#059669', fontWeight: 'bold'}}>01 Oct 2026</Text></Text>
              <View style={styles.filterActions}>
                <View style={styles.datePickerFake}>
                  <Text style={styles.datePickerFakeText}>01/10/2026</Text>
                  <Icon name="calendar-month" size={16} color={colors.textSecondary} />
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterBtnText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Daily Summary */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Summary List</Text>
            </View>

            <View style={styles.statsGrid}>
              {renderStatBox('Total Emp', '5', '#4B5563')}
              {renderStatBox('Present', '0', '#059669')}
              {renderStatBox('Late', '0', '#F59E0B')}
              {renderStatBox('Absent', '5', '#EF4444')}
              {renderStatBox('Leave', '0', '#8B5CF6')}
              {renderStatBox('Offday', '0', '#6B7280')}
            </View>

            {/* List Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Attendance List</Text>
            </View>
          </>
        }
        renderItem={renderEmployeeCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  clockBanner: {
    backgroundColor: '#065F46', // Deep green
    margin: spacing.m,
    padding: spacing.l,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  bannerTitle: { fontSize: 12, fontWeight: '800', color: '#A7F3D0', letterSpacing: 1 },
  dateBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dateBadgeText: { fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#D1FAE5', fontWeight: 'bold' },
  clockStatus: { fontSize: 32, fontWeight: 'bold', color: '#FCD34D', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 4 },
  clockDesc: { fontSize: typography.sizes.s, color: '#A7F3D0', marginBottom: spacing.l },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: spacing.m, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#047857', marginBottom: spacing.m },
  dropdownText: { color: '#FFF', fontSize: typography.sizes.m },
  clockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 8 },
  clockBtnText: { fontSize: typography.sizes.m, fontWeight: 'bold' },

  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: spacing.m, marginTop: spacing.m, padding: spacing.m, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  filterText: { fontSize: typography.sizes.s, color: colors.text, flex: 1 },
  filterActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  datePickerFake: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F9FAFB' },
  datePickerFakeText: { fontSize: typography.sizes.xs, color: colors.text, marginRight: 8 },
  filterBtn: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  filterBtnText: { color: '#FFF', fontSize: typography.sizes.xs, fontWeight: 'bold' },

  sectionHeader: { marginHorizontal: spacing.m, marginTop: spacing.m, marginBottom: spacing.s },
  sectionTitle: { fontSize: typography.sizes.l, fontWeight: 'bold', color: colors.text },
  sectionSubtitle: { fontSize: typography.sizes.s, color: colors.textSecondary, marginTop: 2 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.m, paddingBottom: spacing.m, justifyContent: 'space-between', rowGap: spacing.m },
  statBox: { width: '31%', backgroundColor: colors.surface, paddingVertical: spacing.m, paddingHorizontal: 8, borderRadius: 12, borderTopWidth: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, alignItems: 'center' },
  statBoxLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 4, textAlign: 'center' },
  statBoxValue: { fontSize: 22, fontWeight: '900', textAlign: 'center' },

  employeeCard: { backgroundColor: colors.surface, marginHorizontal: spacing.m, marginBottom: spacing.m, borderRadius: 12, padding: spacing.m, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.m },
  empProfile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: spacing.s },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  empName: { fontSize: typography.sizes.m, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  empRole: { fontSize: typography.sizes.s, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusAbsent: { backgroundColor: '#FEE2E2' },
  statusPresent: { backgroundColor: '#ECFDF5' },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#F8FAFC', borderRadius: 8, padding: spacing.s, borderWidth: 1, borderColor: colors.border },
  gridItem: { width: '50%', padding: spacing.s },
  gridLabel: { fontSize: 10, color: colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  gridValue: { fontSize: typography.sizes.s, color: colors.text, fontWeight: 'bold' },
  gridSubValue: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  shiftBadge: { backgroundColor: '#EEF2FF', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#E0E7FF' },
  shiftBadgeText: { fontSize: 10, color: '#4F46E5', fontWeight: 'bold' },
});
