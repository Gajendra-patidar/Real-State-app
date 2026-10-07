const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `      if (response && response.data && response.data.events) {
        list = response.data.events;
      }`;

const newCode = `      if (response && response.data) {
        const eventsArr = response.data.events || [];
        const upcomingArr = response.data.upcoming_events || [];
        const allEvents = [...eventsArr, ...upcomingArr];
        // Deduplicate by id
        const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
        list = uniqueEvents;
      }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log('Fixed fetchTasks to merge upcoming_events');
