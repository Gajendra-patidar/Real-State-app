const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace ScrollView with View
const oldScroll = `<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {renderStatBox('Total Emp', '5', '#4B5563')}
              {renderStatBox('Present', '0', '#059669')}
              {renderStatBox('Late', '0', '#F59E0B')}
              {renderStatBox('Absent', '5', '#EF4444')}
              {renderStatBox('Leave', '0', '#8B5CF6')}
              {renderStatBox('Offday', '0', '#6B7280')}
            </ScrollView>`;
            
const newGrid = `<View style={styles.statsGrid}>
              {renderStatBox('Total Emp', '5', '#4B5563')}
              {renderStatBox('Present', '0', '#059669')}
              {renderStatBox('Late', '0', '#F59E0B')}
              {renderStatBox('Absent', '5', '#EF4444')}
              {renderStatBox('Leave', '0', '#8B5CF6')}
              {renderStatBox('Offday', '0', '#6B7280')}
            </View>`;

content = content.replace(oldScroll, newGrid);

// Update styles
content = content.replace(
  `statsScroll: { paddingHorizontal: spacing.m, paddingBottom: spacing.m, gap: spacing.s },`,
  `statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.m, paddingBottom: spacing.m, justifyContent: 'space-between', rowGap: spacing.m },`
);

content = content.replace(
  `statBox: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, minWidth: 90, borderTopWidth: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },`,
  `statBox: { width: '31%', backgroundColor: colors.surface, paddingVertical: spacing.m, paddingHorizontal: 8, borderRadius: 12, borderTopWidth: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, alignItems: 'center' },`
);

// I will also adjust the text in statBox to be centered
content = content.replace(
  `statBoxLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 4 },`,
  `statBoxLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 4, textAlign: 'center' },`
);
content = content.replace(
  `statBoxValue: { fontSize: 24, fontWeight: '900' },`,
  `statBoxValue: { fontSize: 22, fontWeight: '900', textAlign: 'center' },`
);


fs.writeFileSync(file, content);
console.log('Fixed Daily Summary Grid');
