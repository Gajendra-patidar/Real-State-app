const fs = require('fs');
const file = 'src/screens/shared/NotificationsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTime = `const time = item.time || item.created_at || '';`;
const newTime = `const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const time = item.time || formatDate(item.created_at) || '';`;

content = content.replace(oldTime, newTime);
fs.writeFileSync(file, content);
console.log('Fixed date format');
