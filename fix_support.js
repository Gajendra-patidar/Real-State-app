const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveSupportDeskScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldState = `  const [tickets, setTickets] = useState<any[]>([]);`;
const newState = `  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);`;
content = content.replace(oldState, newState);

const oldFetch = `  const fetchTickets = async () => {
    try {
      const response = await salesExecutiveApi.getSupportTickets();`;
const newFetch = `  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await salesExecutiveApi.getSupportTickets();`;
content = content.replace(oldFetch, newFetch);

const oldCatch = `    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };`;
const newCatch = `    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };`;
content = content.replace(oldCatch, newCatch);

const oldFlatList = `<FlatList
        data={getFilteredTickets()}
        keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}`;
const newFlatList = `<FlatList
        data={getFilteredTickets()}
        keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshing={loading}
        onRefresh={fetchTickets}`;
content = content.replace(oldFlatList, newFlatList);

fs.writeFileSync(file, content);
console.log('Added pull to refresh to Support Tickets');
