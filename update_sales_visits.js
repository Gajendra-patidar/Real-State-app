const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveSiteVisitsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The flatlist data mapping
const oldFlatList = `<FlatList
        data={visits}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}`;

const newFlatList = `const filteredVisits = visits.filter(v => {
    const matchesSearch = !searchQuery || v.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || v.lead?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProjectId ? (v.project_id === selectedProjectId || v.project?.id === selectedProjectId || v.lead?.interested_project_id === selectedProjectId) : true;
    return matchesSearch && matchesProject;
  });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Site Visits"
        onLeftPress={() => navigation.goBack()}
        rightIcon="calendar-clock"
        onRightPress={() => navigation.navigate('SalesExecutiveFollowUps')}
      />

      <FlatList
        data={filteredVisits}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}`;

// Replace the return statement + FlatList
content = content.replace(/  return \(\n    <View style=\{styles\.container\}>\n      <AppHeader[\s\S]*?\/>\n\n      <FlatList\n        data=\{visits\}\n        keyExtractor=\{item => item\.id\?\.toString\(\) \|\| Math\.random\(\)\.toString\(\)\}/, newFlatList);


fs.writeFileSync(file, content);
console.log('Fixed Sales Site Visits Data Filter');
