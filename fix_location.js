const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add PermissionsAndroid import
if (!content.includes('PermissionsAndroid')) {
  content = content.replace(
    /Alert \} from 'react-native';/,
    "Alert, PermissionsAndroid } from 'react-native';"
  );
}

// Replace getCurrentLocationAndAddress
const oldLocationFunc = `const getCurrentLocationAndAddress = (): Promise<{latitude: string, longitude: string, address: string}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(\`https://maps.googleapis.com/maps/api/geocode/json?latlng=\${latitude},\${longitude}&key=\${GOOGLE_MAPS_API_KEY}\`);
          const data = await response.json();
          let address = 'Location not found';
          if (data.results && data.results.length > 0) {
            address = data.results[0].formatted_address;
          }
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address });
        } catch (error) {
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address: 'Error fetching address' });
        }
      },
      (_error) => {
        reject(_error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};`;

const newLocationFunc = `const requestLocationPermission = async () => {
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
          const response = await fetch(\`https://maps.googleapis.com/maps/api/geocode/json?latlng=\${latitude},\${longitude}&key=\${GOOGLE_MAPS_API_KEY}\`);
          const data = await response.json();
          let address = 'Location not found';
          if (data.results && data.results.length > 0) {
            address = data.results[0].formatted_address;
          }
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address });
        } catch (error) {
          resolve({ latitude: latitude.toString(), longitude: longitude.toString(), address: 'Error fetching address' });
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};`;

content = content.replace(oldLocationFunc, newLocationFunc);

// Update handleClockToggle
const oldCallback = `const locationData = await getCurrentLocationAndAddress().catch(_e => ({ latitude: '28.7041', longitude: '77.1025', address: 'Unknown' }));
            
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

            try {
              console.log('Clock in response data:', formData);
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
            }`;

const newCallback = `try {
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
              setIsClockedIn(true);
              setClockInTime(new Date());
              Alert.alert('Success', 'Clocked in successfully');
              fetchAttendance();
            } catch (error: any) {
              console.error('Failed to toggle clock status or fetch location:', error?.response?.data || error);
              const backendMsg = error?.response?.data?.message || error.message || 'Failed to update attendance status';
              Alert.alert('Error', backendMsg);
            }`;

content = content.replace(oldCallback, newCallback);

fs.writeFileSync(file, content);
console.log('Removed location fallback');
