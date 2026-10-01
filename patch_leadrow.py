import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'r') as f:
    content = f.read()

old_code = """
          {recentLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No leads found</Text>
            </View>
          ) : (
            recentLeads.map((lead, idx) => (
              <View key={lead.id}>
                <LeadRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  executive={lead.user?.name || 'Unassigned'}
                  status={lead.status}
                />
                {idx < recentLeads.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))
          )}
"""

new_code = """
          {recentLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No leads found</Text>
            </View>
          ) : (
            recentLeads.map((lead, idx) => (
              <View key={lead.id}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => navigation.navigate('ManagerLeadDetails', { leadId: lead.id })}
                >
                  <LeadRow
                    name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                    code={lead.lead_code}
                    phone={lead.phone}
                    property={lead.project?.name || 'Any'}
                    executive={lead.user?.name || 'Unassigned'}
                    status={lead.status}
                  />
                </TouchableOpacity>
                {idx < recentLeads.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))
          )}
"""

content = content.replace(old_code.strip(), new_code.strip())

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'w') as f:
    f.write(content)
