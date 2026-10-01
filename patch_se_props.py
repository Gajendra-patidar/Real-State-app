import re

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutivePropertiesScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace("import {propertyApi} from '../../services/api/propertyApi';", "import {salesExecutiveApi} from '../../services/api/salesExecutiveApi';")
content = content.replace("propertyApi.getManagerProjects()", "salesExecutiveApi.getProjects()")

with open('/Users/apple/React_Native_projects/Real-State-app/src/screens/salesExecutive/SalesExecutivePropertiesScreen.tsx', 'w') as f:
    f.write(content)
