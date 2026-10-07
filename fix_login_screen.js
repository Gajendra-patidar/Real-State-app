const fs = require('fs');
const file = 'src/screens/auth/LoginScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import messaging')) {
  content = content.replace(
    'import AsyncStorage from \'@react-native-async-storage/async-storage\';',
    'import AsyncStorage from \'@react-native-async-storage/async-storage\';\nimport messaging from \'@react-native-firebase/messaging\';'
  );
}

// Replace handleLogin
const oldHandleLogin = `  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await authApi.login({email, password});
      console.log('Login response:', data);
      if (data.status === 'success' && data.token && data.user) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        dispatch(setCredentials({user: data.user, token: data.token}));
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Network error. Please check your connection.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };`;

const newHandleLogin = `  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. Get FCM Token
      let fcm_token = undefined;
      try {
        fcm_token = await messaging().getToken();
        console.log('Got FCM token for login:', fcm_token);
      } catch (fcmError) {
        console.log('Error getting FCM token during login (maybe native module missing):', fcmError);
      }

      // 2. Pass FCM Token to login payload
      const data = await authApi.login({ email, password, fcm_token });
      console.log('Login response:', data);
      
      if (data.status === 'success' && data.token && data.user) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        // 3. Optional: Sync to the dedicated FCM API as well
        if (fcm_token) {
          try {
            // Note: Make sure the API wrapper has the token before calling this, 
            // but the Axios interceptor usually reads from AsyncStorage or state.
            // Just to be safe, if interceptor requires it to be saved:
            await authApi.registerFcmToken(fcm_token).catch(e => console.log('Silently failing dedicated fcm sync', e));
          } catch (e) {}
        }
        
        dispatch(setCredentials({user: data.user, token: data.token}));
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Network error. Please check your connection.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleLogin, newHandleLogin);
fs.writeFileSync(file, content);
console.log('Fixed LoginScreen.tsx to include fcm_token');
