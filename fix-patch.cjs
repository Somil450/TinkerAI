const fs = require('fs');

const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

const t1 = `    if (w.toComp === 'mcu') { mcuPin = w.toPin; compId = w.fromComp.split('_')[0]; }
    else if (w.fromComp === 'mcu') { mcuPin = w.fromPin; compId = w.toComp.split('_')[0]; }
    
    if (mcuPin && !['GND','5V','3V3','3.3V','VIN','VCC'].includes(mcuPin) && !mcuPin.startsWith('A') && !isNaN(parseInt(mcuPin))) {`;

const r1 = `    if (w.toComp === 'mcu') { mcuPin = w.toPin; compId = w.fromComp.split('_')[0]; }
    else if (w.fromComp === 'mcu') { mcuPin = w.fromPin; compId = w.toComp.split('_')[0]; }
    
    if (mcuPin) mcuPin = String(mcuPin);
    if (mcuPin && !['GND','5V','3V3','3.3V','VIN','VCC'].includes(mcuPin) && !mcuPin.startsWith('A') && !isNaN(parseInt(mcuPin))) {`;

if (code.includes(t1)) {
    code = code.replace(t1, r1);
    console.log("Patched LF");
} else if (code.includes(t1.replace(/\n/g, '\r\n'))) {
    code = code.replace(t1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n'));
    console.log("Patched CRLF");
} else {
    console.error("Not found!");
    process.exit(1);
}

fs.writeFileSync(file, code, 'utf8');
