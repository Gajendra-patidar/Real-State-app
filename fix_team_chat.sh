#!/bin/bash
# Remove MOCK arrays and replace with state and fetch
cat src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx | sed '/const USERS = \[/,/];/d' | sed '/const ACTIVE_CHATS = \[/,/];/d' > src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx.tmp
mv src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx.tmp src/screens/salesExecutive/SalesExecutiveTeamChatScreen.tsx
