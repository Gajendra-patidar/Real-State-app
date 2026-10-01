import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerLeadsScreen.tsx', 'r') as f:
    content = f.read()

# Replace `data={leads}` with `data={filteredLeads}`
content = content.replace("data={leads}", "data={filteredLeads}")

# Insert filteredLeads logic before `return`
logic = """
  const filteredLeads = leads.filter(lead => {
    // 1. Search Filter
    const searchLower = search.toLowerCase().trim();
    if (searchLower) {
      const name = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
      const phone = (lead.phone || '').toLowerCase();
      const code = (lead.lead_code || '').toLowerCase();
      if (!name.includes(searchLower) && !phone.includes(searchLower) && !code.includes(searchLower)) {
        return false;
      }
    }

    // 2. Status Filter
    if (selectedStatus !== 'All Statuses') {
      const dbStatus = (lead.status || '').toUpperCase();
      let match = false;
      if (selectedStatus === 'New Leads' && dbStatus === 'NEW') match = true;
      else if (selectedStatus === 'Site Visit' && dbStatus === 'SITE VISIT') match = true;
      else if (selectedStatus === 'Converted' && dbStatus === 'BOOKED') match = true;
      else if (selectedStatus.toUpperCase() === dbStatus) match = true;
      
      if (!match) return false;
    }

    // 3. Employee Filter
    if (selectedEmployee) {
      if (lead.user?.id !== selectedEmployee.id) {
        return false;
      }
    }

    return true;
  });

  return (
"""

content = content.replace("  return (\n    <View style={styles.container}>", logic + "    <View style={styles.container}>")

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerLeadsScreen.tsx', 'w') as f:
    f.write(content)
