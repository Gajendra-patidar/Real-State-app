import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

imports = """
import {SalesExecutiveLeadDetailsScreen} from '../screens/salesExecutive/SalesExecutiveLeadDetailsScreen';
import { ScheduleSiteVisitScreen, StartNegotiationScreen, RecordBookingScreen, DropLeadScreen } from '../screens/salesExecutive/SalesExecutiveActionScreens';
"""

content = content.replace("import {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';", imports.strip() + "\nimport {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';")

screens = """
    <Stack.Screen name="SalesExecutiveLeadDetails" component={SalesExecutiveLeadDetailsScreen} options={{headerShown: false}} />
    <Stack.Screen name="ScheduleSiteVisit" component={ScheduleSiteVisitScreen} options={{headerShown: false}} />
    <Stack.Screen name="StartNegotiation" component={StartNegotiationScreen} options={{headerShown: false}} />
    <Stack.Screen name="RecordBooking" component={RecordBookingScreen} options={{headerShown: false}} />
    <Stack.Screen name="DropLead" component={DropLeadScreen} options={{headerShown: false}} />
"""

content = content.replace('<Stack.Screen name="Permissions" component={SalesExecutivePermissionsScreen} />', '<Stack.Screen name="Permissions" component={SalesExecutivePermissionsScreen} />\n' + screens.strip())

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
