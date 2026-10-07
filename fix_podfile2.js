const fs = require('fs');
const file = 'ios/Podfile';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('use_modular_headers!')) {
    content = content.replace('config = use_native_modules!', 'config = use_native_modules!\n  use_modular_headers!');
    fs.writeFileSync(file, content);
    console.log('Added use_modular_headers! to Podfile');
}
