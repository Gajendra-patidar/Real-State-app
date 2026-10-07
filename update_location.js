const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import Geolocation
if (!content.includes("@react-native-community/geolocation")) {
  content = content.replace(
    /import \{ launchCamera \} from 'react-native-image-picker';/,
    "import { launchCamera } from 'react-native-image-picker';\nimport Geolocation from '@react-native-community/geolocation';"
  );
}

// Add getCurrentLocationAndAddress function before SalesExecutiveHRMSAttendanceScreen
const locationFunc = `
const GOOGLE_MAPS_API_KEY = "AIzaSyD-zPLVMYmi0V5GRRtdeQivDe8CEFBVL5E";

const getCurrentLocationAndAddress = (): Promise<{latitude: string, longitude: string, address: string}> => {
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
};

export const SalesExecutiveHRMSAttendanceScreen`;

content = content.replace(/export const SalesExecutiveHRMSAttendanceScreen/, locationFunc);

// Update handleClockToggle
const oldCameraCallback = `const formData = new FormData();
            formData.append('work_location', 'office');
            formData.append('latitude', '28.7041');
            formData.append('longitude', '77.1025');`;

const newCameraCallback = `const locationData = await getCurrentLocationAndAddress().catch(e => ({ latitude: '28.7041', longitude: '77.1025', address: 'Unknown' }));
            
            const formData = new FormData();
            formData.append('work_location', 'office');
            formData.append('latitude', locationData.latitude);
            formData.append('longitude', locationData.longitude);
            formData.append('address', locationData.address);`;

content = content.replace(oldCameraCallback, newCameraCallback);

fs.writeFileSync(file, content);
console.log('Location update complete');
