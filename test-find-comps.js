const m = require('./src/ai/circuitChatAI.js');
const r = m.circuitChatAI;

// We need to hook into circuitChatAI to see what it's doing.
// Let's just redefine _findComps with some console.logs.

const testStr = 'connect 3 leds to arduino';
const comps = r._findComps(testStr);
console.log('Final output:', comps);
