import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

imports = """
import {SalesExecutiveHRMSDashboardScreen} from '../screens/salesExecutive/SalesExecutiveHRMSDashboardScreen';
import {SalesExecutiveHRMSAttendanceScreen} from '../screens/salesExecutive/SalesExecutiveHRMSAttendanceScreen';
import {SalesExecutiveHRMSLeaveManagementScreen} from '../screens/salesExecutive/SalesExecutiveHRMSLeaveManagementScreen';
import {SalesExecutiveHRMSPayrollScreen} from '../screens/salesExecutive/SalesExecutiveHRMSPayrollScreen';
"""

content = content.replace("// We'll keep shared placeholders for HRMS, TeamChat, Permissions", "// We'll keep shared placeholders for HRMS, TeamChat, Permissions\n" + imports.strip())

content = content.replace('<Stack.Screen name="HRMSDashboard" component={Placeholder} />', '<Stack.Screen name="HRMSDashboard" component={SalesExecutiveHRMSDashboardScreen} />')
content = content.replace('<Stack.Screen name="HRMSAttendance" component={Placeholder} />', '<Stack.Screen name="HRMSAttendance" component={SalesExecutiveHRMSAttendanceScreen} />')
content = content.replace('<Stack.Screen name="HRMSLeaveManagement" component={Placeholder} />', '<Stack.Screen name="HRMSLeaveManagement" component={SalesExecutiveHRMSLeaveManagementScreen} />')
content = content.replace('<Stack.Screen name="HRMSPayroll" component={Placeholder} />', '<Stack.Screen name="HRMSPayroll" component={SalesExecutiveHRMSPayrollScreen} />')

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
