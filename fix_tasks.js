const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveTasksScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRenderEventCard = `  const renderEventCard = ({ item }: { item: typeof events[0] }) => {
    const cat = CATEGORIES.find(c => c.id === item.type) || CATEGORIES[0];
    
    return (
      <View style={styles.eventCard}>
        <View style={[styles.eventTimeLine, { backgroundColor: cat.color }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTime}>{item.time}</Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.eventTag, { backgroundColor: cat.bg }]}>
            <View style={[styles.eventDot, { backgroundColor: cat.color }]} />
            <Text style={[styles.eventTagText, { color: cat.color }]}>{cat.label}</Text>
          </View>
        </View>
      </View>
    );
  };`;

const newRenderEventCard = `  const renderEventCard = ({ item }: { item: typeof events[0] }) => {
    const timeString = item.start ? new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.time || '12:00 PM');
    const color = item.color || item.backgroundColor || CATEGORIES[0].color;
    const bg = color + '20'; // light version of the color for background
    const label = item.extendedProps?.category || item.event_type || CATEGORIES[0].label;
    
    return (
      <View style={styles.eventCard}>
        <View style={[styles.eventTimeLine, { backgroundColor: color }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTime}>{timeString}</Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.eventTag, { backgroundColor: bg }]}>
            <View style={[styles.eventDot, { backgroundColor: color }]} />
            <Text style={[styles.eventTagText, { color: color }]}>{label}</Text>
          </View>
        </View>
      </View>
    );
  };`;

if(content.includes(oldRenderEventCard)){
  content = content.replace(oldRenderEventCard, newRenderEventCard);
} else {
  console.log("Could not find old renderEventCard");
}

fs.writeFileSync(file, content);
console.log('Updated SalesExecutiveTasksScreen.tsx for renderEventCard');
