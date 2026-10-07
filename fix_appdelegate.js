const fs = require('fs');
const file = 'ios/realstate/AppDelegate.swift';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import FirebaseCore')) {
    content = content.replace('import UIKit', 'import UIKit\nimport FirebaseCore');
    content = content.replace(
        '  func application(\n    _ application: UIApplication,\n    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil\n  ) -> Bool {\n',
        '  func application(\n    _ application: UIApplication,\n    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil\n  ) -> Bool {\n    FirebaseApp.configure()\n'
    );
    fs.writeFileSync(file, content);
    console.log('Configured Firebase in AppDelegate.swift');
}
