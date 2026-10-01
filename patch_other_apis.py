import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'r') as f:
    content = f.read()

exec_old = """
        const r = await dashboardApi.getManagerExecutives();
        eData = r.data?.data || [];
"""

exec_new = """
        let r = await dashboardApi.getManagerExecutives();
        if (typeof r === 'string') {
          try { r = JSON.parse(r); } catch (e) {}
        }
        eData = r?.data?.data || r?.data || r || [];
"""

content = content.replace(exec_old, exec_new)

leads_old = """
        const r = await dashboardApi.getRecentLeads({per_page: 5});
        lData = r.data?.data || [];
"""

leads_new = """
        let r = await dashboardApi.getRecentLeads({per_page: 5});
        if (typeof r === 'string') {
          try { r = JSON.parse(r); } catch (e) {}
        }
        lData = r?.data?.data || r?.data || r || [];
"""

content = content.replace(leads_old, leads_new)

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/manager/ManagerDashboardScreen.tsx', 'w') as f:
    f.write(content)
