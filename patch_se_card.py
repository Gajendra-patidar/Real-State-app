import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveDashboardScreen.tsx', 'r') as f:
    content = f.read()

# 1. Update LeadCardRow buttons
card_row_old = """
      <View style={styles.leadActions}>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={onView}>
          <Eye size={13} color={colors.secondary} />
          <Text style={styles.actionBtnOutlineText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline}>
          <MessageCircle size={13} color={colors.success} />
          <Text style={[styles.actionBtnOutlineText, {color: colors.success}]}>Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSolid}>
          <Phone size={13} color={colors.surface} />
          <Text style={styles.actionBtnSolidText}>Call</Text>
        </TouchableOpacity>
      </View>
"""
card_row_new = """
      <View style={styles.leadActions}>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={onView}>
          <Eye size={13} color={colors.secondary} />
          <Text style={styles.actionBtnOutlineText}>View Lead Details</Text>
        </TouchableOpacity>
      </View>
"""
content = content.replace(card_row_old.strip(), card_row_new.strip())

# 2. Add onView logic in render
render_old = """
                <LeadCardRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  status={lead.status}
                  onView={() => {}}
                />
"""
render_new = """
                <LeadCardRow
                  name={`${lead.first_name || ''} ${lead.last_name || ''}`.trim()}
                  code={lead.lead_code}
                  phone={lead.phone}
                  property={lead.project?.name || 'Any'}
                  status={lead.status}
                  onView={() => navigation.navigate('SalesExecutiveLeadDetails', {leadId: lead.id})}
                />
"""
content = content.replace(render_old.strip(), render_new.strip())

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveDashboardScreen.tsx', 'w') as f:
    f.write(content)
