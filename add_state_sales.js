const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveSiteVisitsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = "const [isFilterVisible, setIsFilterVisible] = useState(false);";
const stateToAdd = `const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await salesExecutiveApi.getProjects();
      setProjects(res?.data || res || []);
    } catch (e) {
      console.log('Failed to load projects for filter');
    }
  };`;

content = content.replace(targetStr, stateToAdd);

fs.writeFileSync(file, content);
console.log('Added states to SalesExecutiveSiteVisitsScreen');
