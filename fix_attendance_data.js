const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { useAuth }')) {
  content = content.replace(
    /import \{ useNavigation \} from '@react-navigation\/native';/,
    "import { useNavigation } from '@react-navigation/native';\nimport { useAuth } from '../../hooks/useAuth';"
  );
}

if (!content.includes('const { user, role } = useAuth();')) {
  content = content.replace(
    /const navigation = useNavigation<any>\(\);/,
    "const navigation = useNavigation<any>();\n  const { user, role } = useAuth();"
  );
}

const oldFetch = `const fetchAttendance = async () => {
    try {
      const response = await salesExecutiveApi.getAttendance();
      console.log('Attendance fetched:', response);
      setAttendance(response?.data || response || []);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };`;

const newFetch = `const fetchAttendance = async () => {
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
        checkIn: item.clock_in ? \`\${item.date} \${item.clock_in}\` : 'N/A',
        checkInLoc: item.address || 'N/A',
        checkOut: item.clock_out ? \`\${item.date} \${item.clock_out}\` : '--:--',
        checkOutLoc: item.checkout_address || 'N/A',
        shift: 'Morning',
      }));
      setAttendance(mappedData);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldFetch, newFetch);

fs.writeFileSync(file, content);
console.log('Attendance mapping updated');
