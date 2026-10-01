#!/bin/bash
cat src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx | sed '/const MOCK_EVENTS = \[/,/\];/d' > src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx.tmp
mv src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx.tmp src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx
