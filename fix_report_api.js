const fs = require('fs');
const file = 'src/services/api/salesExecutiveApi.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("api.get('/reports/summary')", "api.get('/executive/reports/summary')");

fs.writeFileSync(file, content);
console.log('Fixed reports api endpoint');
