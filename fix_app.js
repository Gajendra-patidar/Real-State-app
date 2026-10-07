const fs = require('fs');
const file = 'App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('notificationService.setup()')) {
    content = content.replace('import React from \'react\';', 'import React, { useEffect } from \'react\';\nimport { notificationService } from \'./src/services/notificationService\';');
    
    const target = 'const App = () => {';
    content = content.replace(target, target + '\n  useEffect(() => {\n    notificationService.setup();\n  }, []);\n');
    
    fs.writeFileSync(file, content);
    console.log('Added notificationService to App.tsx');
}
