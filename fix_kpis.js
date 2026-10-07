const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerCommissionScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update JSX to use adjustsFontSizeToFit and numberOfLines
content = content.replace(
  /<Text style=\{\[styles\.kpiSubValue, \{color: colors\.success\}\]\}>/g,
  '<Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.success}]}>'
);
content = content.replace(
  /<Text style=\{\[styles\.kpiSubValue, \{color: colors\.warning\}\]\}>/g,
  '<Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.warning}]}>'
);
content = content.replace(
  /<Text style=\{\[styles\.kpiSubValue, \{color: colors\.secondary\}\]\}>/g,
  '<Text adjustsFontSizeToFit numberOfLines={1} style={[styles.kpiSubValue, {color: colors.secondary}]}>'
);

// Update Styles
content = content.replace(
  /kpiRow: \{\n    flexDirection: 'row',\n    gap: 10,/g,
  "kpiRow: {\n    flexDirection: 'row',\n    gap: 8,"
);
content = content.replace(
  /kpiSubCard: \{\n    flex: 1,\n    backgroundColor: colors\.surface,\n    borderRadius: 16,\n    padding: 14,/g,
  "kpiSubCard: {\n    flex: 1,\n    backgroundColor: colors.surface,\n    borderRadius: 16,\n    padding: 10,"
);
content = content.replace(
  /kpiSubValue: \{\n    fontSize: 16,/g,
  "kpiSubValue: {\n    fontSize: 14,"
);

fs.writeFileSync(file, content);
