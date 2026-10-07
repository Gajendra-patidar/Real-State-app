const fs = require('fs');
const file = 'src/screens/salesExecutive/SalesExecutiveSiteVisitsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove unused openDatePicker
content = content.replace(/  const openDatePicker = \([\s\S]*?setDatePickerVisible\(true\);\n  };\n/g, '');

// Remove unused handleDateSelect
content = content.replace(/  const handleDateSelect = \([\s\S]*?setDatePickerVisible\(false\);\n  };\n/g, '');

// Remove unused formatDate
content = content.replace(/  const formatDate = \([\s\S]*?return date\.toLocaleDateString\('en-GB'\);\n  };\n/g, '');

// Remove datePickerVisible state
content = content.replace(/  \/\/ Date Picker State\n  const \[datePickerVisible, setDatePickerVisible\] = useState\(false\);\n  const \[activeDateField, setActiveDateField\] = useState<'visitFrom' \| 'visitTo' \| 'nextFollowDt' \| null>\(null\);\n\n  const \[visitFromDate, setVisitFromDate\] = useState<Date \| null>\(null\);\n  const \[visitToDate, setVisitToDate\] = useState<Date \| null>\(null\);\n  const \[nextFollowDtDate, setNextFollowDtDate\] = useState<Date \| null>\(null\);\n/g, '');

// Remove DatePickerModal from bottom
content = content.replace(/      <DatePickerModal[\s\S]*? \/>\n/g, '');

fs.writeFileSync(file, content);
console.log('Cleaned Sales Screen');
