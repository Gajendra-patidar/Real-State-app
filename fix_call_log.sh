#!/bin/bash
cat src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx | sed '/{.. Call Log Modal ..}/,/<\/Modal>/d' > src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx.tmp
mv src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx.tmp src/screens/salesExecutive/SalesExecutiveLeadsScreen.tsx
