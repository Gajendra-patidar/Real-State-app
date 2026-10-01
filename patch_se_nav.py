import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

import_statement = "import {NotificationsScreen} from '../screens/shared/NotificationsScreen';\n"
content = content.replace("import {ProfileScreen}                  from '../screens/shared/ProfileScreen';", "import {ProfileScreen}                  from '../screens/shared/ProfileScreen';\n" + import_statement)

stack_screen = '    <Stack.Screen name="Notifications" component={NotificationsScreen} />\n'
content = content.replace('<Stack.Screen name="SalesTabs" component={TabNavigator} />', '<Stack.Screen name="SalesTabs" component={TabNavigator} />\n' + stack_screen)

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
