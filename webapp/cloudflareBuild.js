const fs = require('fs');
const filePath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
delete packageJson.homepage;
fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
console.log("Removed 'homepage' property from package.json.");
