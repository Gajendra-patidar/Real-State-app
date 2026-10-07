const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerDashboardScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const unitsCode = `
            {project.units && project.units.length > 0 && (
              <View style={{marginTop: 24}}>
                <Text style={{fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase'}}>Units Inventory</Text>
                {project.units.map((u: any) => {
                  const s = (u.status || '').toLowerCase();
                  let sColor = colors.success;
                  let sBg = colors.successLight;
                  if (s === 'booked' || s === 'sold') {
                    sColor = colors.textSecondary;
                    sBg = colors.background;
                  } else if (s === 'hold') {
                    sColor = colors.warning;
                    sBg = colors.warningLight;
                  }
                  
                  return (
                    <View key={u.id} style={{flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 8}}>
                      <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4}}>
                          <Text style={{fontSize: 15, fontWeight: '700', color: colors.text}}>{u.unit_number}</Text>
                          <View style={{backgroundColor: colors.infoLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                            <Text style={{fontSize: 10, fontWeight: '700', color: colors.info}}>{u.unit_type}</Text>
                          </View>
                        </View>
                        <Text style={{fontSize: 12, color: colors.textSecondary}}>{u.carpet_area} sq.ft</Text>
                      </View>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 14, fontWeight: '800', color: colors.primary, marginBottom: 4}}>
                          {u.final_price ? \`₹\${Number(u.final_price).toLocaleString('en-IN')}\` : 'N/A'}
                        </Text>
                        <View style={{backgroundColor: sBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12}}>
                          <Text style={{fontSize: 10, fontWeight: '700', color: sColor, textTransform: 'capitalize'}}>{u.status}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
`;

content = content.replace(
  /\{\s*project\.company && \(/,
  unitsCode + "\n            {project.company && ("
);

fs.writeFileSync(file, content);
