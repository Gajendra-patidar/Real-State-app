const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /clockIn: async \(payload: any\) => \{[\s\S]*?throw error;\n    \}\n  \},/;

const newCode = `clockIn: async (payload: any) => {
    try {
      console.log('Clocking in with payload:', payload);
      const isFormData = payload && payload.append !== undefined;
      
      if (isFormData) {
        // Use fetch for FormData to bypass Axios boundary stripping issues in React Native
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('https://urbanproperty.in/api/executive/attendance/clock-in', {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Accept': 'application/json',
          },
          body: payload,
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw { response: { data } };
        }
        return data;
      }

      const response = await api.post('/executive/attendance/clock-in', payload);
      console.log('Clock in response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("clockIn API ERROR:", error?.response?.data || error);
      throw error;
    }
  },`;

content = content.replace(regex, newCode);
fs.writeFileSync(file, content);
console.log('Replaced Axios with fetch for clockIn FormData');
