const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveReportsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const importsToAdd = `import { ActivityIndicator, RefreshControl } from 'react-native';\nimport { salesExecutiveApi } from '../../services/api/salesExecutiveApi';\nimport { useAuth } from '../../hooks/useAuth';`;

content = content.replace("import React from 'react';", "import React, { useEffect, useState } from 'react';\n" + importsToAdd);

const componentStart = `export const SalesExecutiveReportsScreen = () => {
  const navigation = useNavigation<any>();`;

const stateAndFetch = `  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await salesExecutiveApi.getSummaryReports();
      setData(response.data || response);
    } catch (error) {
      console.log('Error fetching reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };`;

content = content.replace(componentStart, componentStart + "\n" + stateAndFetch);

// Replace ScrollView with RefreshControl
content = content.replace(
  `<ScrollView contentContainerStyle={styles.content}>`,
  `<ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>`
);

// Add loading state
content = content.replace(
  `        <View style={styles.headerBox}>`,
  `        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
        ) : (
          <>
        <View style={styles.headerBox}>`
);

// Adjust the UI to use the data
content = content.replace(
  `<Text style={styles.statValue}>2</Text>`,
  `<Text style={styles.statValue}>{data?.total_leads || data?.leads_count || data?.metrics?.leads || 0}</Text>`
);
content = content.replace(
  `<Text style={[styles.statValue, {color: '#3B82F6'}]}>0</Text>`,
  `<Text style={[styles.statValue, {color: '#3B82F6'}]}>{data?.site_visits || data?.visits_count || data?.metrics?.visits || 0}</Text>`
);
content = content.replace(
  `<Text style={[styles.statValue, {color: '#10B981'}]}>1</Text>`,
  `<Text style={[styles.statValue, {color: '#10B981'}]}>{data?.total_bookings || data?.bookings_count || data?.metrics?.bookings || 0}</Text>`
);
content = content.replace(
  `<Text style={[styles.statValue, {color: '#A855F7'}]}>₹100,000</Text>`,
  `<Text style={[styles.statValue, {color: '#A855F7'}]}>₹{data?.total_revenue || data?.revenue || data?.metrics?.revenue || 0}</Text>`
);

content = content.replace(
  `</ScrollView>`,
  `</>\n        )}\n      </ScrollView>`
);

// Use actual user data in the breakdown
content = content.replace(
  `<Text style={styles.perfName}>Vikram Singh</Text>`,
  `<Text style={styles.perfName}>{data?.executive?.name || user?.name || 'Sales Executive'}</Text>`
);
content = content.replace(
  `<Text style={styles.perfEmail}>sales@apexrealty.com</Text>`,
  `<Text style={styles.perfEmail}>{data?.executive?.email || user?.email || 'sales@company.com'}</Text>`
);
content = content.replace(
  `<Text style={styles.avatarText}>VI</Text>`,
  `<Text style={styles.avatarText}>{(data?.executive?.name || user?.name || 'S')[0]}</Text>`
);
content = content.replace(
  `<Text style={styles.perfStatVal}>2</Text>`,
  `<Text style={styles.perfStatVal}>{data?.executive?.assigned || data?.metrics?.assigned || data?.total_leads || 0}</Text>`
);
content = content.replace(
  `<Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>0</Text>`,
  `<Text style={[styles.perfStatVal, {color: '#3B82F6'}]}>{data?.executive?.visits || data?.metrics?.visits || data?.site_visits || 0}</Text>`
);
content = content.replace(
  `<Text style={[styles.perfStatVal, {color: '#10B981'}]}>0</Text>`,
  `<Text style={[styles.perfStatVal, {color: '#10B981'}]}>{data?.executive?.bookings || data?.metrics?.bookings || data?.total_bookings || 0}</Text>`
);
content = content.replace(
  `<Text style={styles.rateBadgeText}>0%</Text>`,
  `<Text style={styles.rateBadgeText}>{data?.executive?.conversion_rate || data?.metrics?.conversion_rate || '0%'}</Text>`
);

fs.writeFileSync(file, content);
console.log('Fixed reports screen API integration');
