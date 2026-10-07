const fs = require('fs');
const file = '/Users/apple/React_Native_projects/Real-State-app/src/screens/broker/BrokerSubmitLeadScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /budget_min: number \| null;\n  budget_max: number \| null;/,
  "budget_min: number | null;\n  budget_max: number | null;\n  budget_label: string;"
);

content = content.replace(
  /project_id: null, budget: '', bhk_type: '', notes: '',/g,
  "project_id: null, budget_min: null, budget_max: null, budget_label: '', bhk_type: '', notes: '',"
);

content = content.replace(
  /if \(form\.budget\)        payload\.budget     = form\.budget;/,
  "payload.budget_min = form.budget_min;\n      payload.budget_max = form.budget_max;"
);

content = content.replace(
  /!form\.budget &&/g,
  "!form.budget_label &&"
);

content = content.replace(
  /\{form\.budget \|\| /g,
  "{form.budget_label || "
);

const selectBudgetLogic = `onSelect={v => {
          setField('budget_label', v);
          let min = null, max = null;
          if (v === '< 20L') { max = 2000000; }
          else if (v === '20L – 40L') { min = 2000000; max = 4000000; }
          else if (v === '40L – 60L') { min = 4000000; max = 6000000; }
          else if (v === '60L – 80L') { min = 6000000; max = 8000000; }
          else if (v === '80L – 1Cr') { min = 8000000; max = 10000000; }
          else if (v === '1Cr – 1.5Cr') { min = 10000000; max = 15000000; }
          else if (v === '> 1.5Cr') { min = 15000000; }
          setForm(prev => ({...prev, budget_min: min, budget_max: max}));
        }}`;

content = content.replace(
  /onSelect=\{v => setField\('budget', v\)\}/,
  selectBudgetLogic
);

fs.writeFileSync(file, content);
