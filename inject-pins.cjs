const fs = require('fs');

let archJS = fs.readFileSync('src/ui/componentArchetypes.js', 'utf8');
archJS = archJS.replace("'breadboard-830': 'breadboard',", "'breadboard-830': 'breadboard-830',");
archJS = archJS.replace("'breadboard-400': 'breadboard',", "'breadboard-400': 'breadboard-400',");
fs.writeFileSync('src/ui/componentArchetypes.js', archJS, 'utf8');

let catJS = fs.readFileSync('src/ui/componentSvgCatalog.js', 'utf8');
const p400 = fs.readFileSync('breadboard-400-pins.txt', 'utf8');
const p830 = fs.readFileSync('breadboard-830-pins.txt', 'utf8');

catJS = catJS.replace("'breadboard': { width: 200, height: 140, pins: [] },", p400 + ',\n  ' + p830 + ',');
fs.writeFileSync('src/ui/componentSvgCatalog.js', catJS, 'utf8');

console.log('Injected pins into catalog and updated archetypes');
