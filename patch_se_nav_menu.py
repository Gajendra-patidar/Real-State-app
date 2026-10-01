import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'r') as f:
    content = f.read()

# Add Menu import
import_statement = "import {SalesExecutiveMenuScreen}       from '../screens/salesExecutive/SalesExecutiveMenuScreen';\nimport { Menu as MenuIcon } from 'lucide-react-native';"
content = content.replace("import {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';", import_statement + "\nimport {SalesExecutiveDashboardScreen}  from '../screens/salesExecutive/SalesExecutiveDashboardScreen';")

# Update icon mapping
icon_logic = """
          if (route.name === 'FollowUps') return <Clock size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Visits')    return <MapPin size={s} color={color} strokeWidth={w} />;
          if (route.name === 'Menu')      return <MenuIcon size={s} color={color} strokeWidth={w} />;
"""
content = re.sub(r"if \(route.name === 'FollowUps'\).*?if \(route.name === 'Profile'\).*?;", icon_logic.strip(), content, flags=re.DOTALL)

# Update screen mapping
screen_logic = """
      <Tab.Screen name="Visits"    component={SalesExecutiveSiteVisitsScreen} />
      <Tab.Screen name="Menu"      component={SalesExecutiveMenuScreen} />
"""
content = re.sub(r"<Tab\.Screen name=\"Visits\".*?<Tab\.Screen name=\"Profile\".*?/>", screen_logic.strip(), content, flags=re.DOTALL)


with open('/Users/apple/React_Native_projects/Real-State-app/src/navigation/SalesExecutiveNavigator.tsx', 'w') as f:
    f.write(content)
