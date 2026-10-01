import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'r') as f:
    content = f.read()

old_code = """
        const r = await dashboardApi.getManagerDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        console.log("dashboard data", r);
        
        dData = r.dashboard;
"""

new_code = """
        let r = await dashboardApi.getManagerDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        console.log("dashboard data", r);
        
        // Handle case where backend returns stringified JSON
        if (typeof r === 'string') {
          try {
            r = JSON.parse(r);
          } catch (e) {
            console.warn("Could not parse dashboard data string", e);
          }
        }
        
        dData = r?.dashboard || r?.data?.dashboard || r;
"""

content = content.replace(old_code, new_code)

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'w') as f:
    f.write(content)
