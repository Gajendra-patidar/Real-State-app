const fs = require('fs');
const file = 'index.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('notificationService')) {
    content = content.replace(
        "import App from './App';",
        "import './src/services/notificationService';\nimport App from './App';"
    );
    fs.writeFileSync(file, content);
    console.log('Injected notificationService into index.js');
}
