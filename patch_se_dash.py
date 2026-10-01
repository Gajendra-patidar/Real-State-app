import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveDashboardScreen.tsx', 'r') as f:
    content = f.read()

# Fix stringified JSON parsing for fetchAll
fetch_all_logic = """
      try {
        let r = await salesExecutiveApi.getDashboard(timeFilter.toLowerCase().replace(' ', '_'));
        if (typeof r === 'string') {
          try { r = JSON.parse(r); } catch (e) {}
        }
        console.log("sales dasborad", r);
        dData = r?.dashboard || r;
      } catch {
        dData = null;
      }

      try {
        let r = await salesExecutiveApi.getAssignedLeads({per_page: 10});
        if (typeof r === 'string') {
          try { r = JSON.parse(r); } catch (e) {}
        }
        lData = r?.data?.data || r?.data || r || [];
      } catch {
        lData = [];
      }
"""
content = re.sub(r"try \{\s*const r = await salesExecutiveApi\.getDashboard\(.*?\n\s*lData = \[.*?\];\n\s*\}", fetch_all_logic.strip(), content, flags=re.DOTALL)

# Fix KPI bindings
content = content.replace("const assignedCount = dashboardData?.assigned_leads_count || 0;", "const assignedCount = dashboardData?.total_assigned_leads || dashboardData?.assigned_leads_count || 0;\n  const siteVisits = (dashboardData?.site_visits_today || 0) + (dashboardData?.site_visits_upcoming || 0);\n  const convertedBookings = dashboardData?.total_bookings || dashboardData?.converted_bookings || 0;")
content = content.replace("dashboardData?.site_visits_count || 0", "siteVisits")
content = content.replace("dashboardData?.converted_bookings || 0", "convertedBookings")

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveDashboardScreen.tsx', 'w') as f:
    f.write(content)
