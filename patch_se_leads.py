import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace("import {leadApi} from '../../services/api/leadApi';", "import {salesExecutiveApi} from '../../services/api/salesExecutiveApi';\nimport {leadApi} from '../../services/api/leadApi';")
content = content.replace("leadApi.getManagerLeads()", "salesExecutiveApi.getAssignedLeads()")
content = content.replace("dashboardApi.getManagerDashboard()", "salesExecutiveApi.getDashboard()")
content = content.replace("ManagerLeadDetails", "SalesExecutiveLeadDetails")

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx', 'w') as f:
    f.write(content)
