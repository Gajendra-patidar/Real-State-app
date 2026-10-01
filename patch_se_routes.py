import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

import_statement = """
import { View, Text } from 'react-native';
const Placeholder = ({route}: any) => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{route.name} (Coming Soon)</Text></View>;
"""

stack_screens = """
    <Stack.Screen name="Contacts" component={Placeholder} />
    <Stack.Screen name="Properties" component={Placeholder} />
    <Stack.Screen name="Tasks" component={Placeholder} />
    <Stack.Screen name="HRMSDashboard" component={Placeholder} />
    <Stack.Screen name="HRMSAttendance" component={Placeholder} />
    <Stack.Screen name="HRMSLeaveManagement" component={Placeholder} />
    <Stack.Screen name="HRMSPayroll" component={Placeholder} />
    <Stack.Screen name="SupportDesk" component={Placeholder} />
    <Stack.Screen name="TeamChat" component={Placeholder} />
    <Stack.Screen name="Permissions" component={Placeholder} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
"""

content = content.replace("import React from 'react';", "import React from 'react';\n" + import_statement)
content = content.replace('    <Stack.Screen name="Notifications" component={NotificationsScreen} />', '    <Stack.Screen name="Notifications" component={NotificationsScreen} />\n' + stack_screens)

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
