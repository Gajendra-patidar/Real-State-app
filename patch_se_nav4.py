import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

imports = """
import {SalesExecutiveTeamChatScreen} from '../screens/salesExecutive/SalesExecutiveTeamChatScreen';
import {SalesExecutivePermissionsScreen} from '../screens/salesExecutive/SalesExecutivePermissionsScreen';
"""

content = content.replace("// We'll keep shared placeholders for HRMS, TeamChat, Permissions", imports.strip())

content = content.replace('<Stack.Screen name="TeamChat" component={Placeholder} />', '<Stack.Screen name="TeamChat" component={SalesExecutiveTeamChatScreen} />')
content = content.replace('<Stack.Screen name="Permissions" component={Placeholder} />', '<Stack.Screen name="Permissions" component={SalesExecutivePermissionsScreen} />')

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
