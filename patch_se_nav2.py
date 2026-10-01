import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

# Replace imports
imports = """
import {SalesExecutiveContactsScreen} from '../screens/salesExecutive/SalesExecutiveContactsScreen';
import {SalesExecutivePropertiesScreen} from '../screens/salesExecutive/SalesExecutivePropertiesScreen';
import {SalesExecutiveTasksScreen} from '../screens/salesExecutive/SalesExecutiveTasksScreen';
import {SalesExecutiveSupportDeskScreen} from '../screens/salesExecutive/SalesExecutiveSupportDeskScreen';

// We'll keep shared placeholders for HRMS, TeamChat, Permissions
"""

content = re.sub(r"const Placeholder = .*?;", "const Placeholder = ({route}: any) => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{route.name} (Coming Soon)</Text></View>;\n" + imports.strip(), content)

# Replace screen components
content = content.replace('<Stack.Screen name="Contacts" component={Placeholder} />', '<Stack.Screen name="Contacts" component={SalesExecutiveContactsScreen} />')
content = content.replace('<Stack.Screen name="Properties" component={Placeholder} />', '<Stack.Screen name="Properties" component={SalesExecutivePropertiesScreen} />')
content = content.replace('<Stack.Screen name="Tasks" component={Placeholder} />', '<Stack.Screen name="Tasks" component={SalesExecutiveTasksScreen} />')
content = content.replace('<Stack.Screen name="SupportDesk" component={Placeholder} />', '<Stack.Screen name="SupportDesk" component={SalesExecutiveSupportDeskScreen} />')

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
