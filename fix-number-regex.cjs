// fix-number-regex.cjs — CommonJS — patches circuitChatAI.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ai/circuitChatAI.js');
let code = fs.readFileSync(file, 'utf8');

const startMarker = '    // First: find "N component" patterns';
const endMarker   = '    // \u2500\u2500 Comprehensive shorthand alias map';

const startIdx = code.indexOf(startMarker);
const endIdx   = code.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found! startIdx=' + startIdx + ' endIdx=' + endIdx);
  process.exit(1);
}

// New loop that avoids matching digits inside model numbers (l298n, bme280, etc.)
const newBlock = [
  '    // First: find explicit "N component" patterns like "3 leds", "two servos"',
  '    // Digit must be a standalone word, not inside a model number like bme280 or l298n',
  '    for (const comp of allComps) {',
  '      const numAliases = [comp.name.toLowerCase(), comp.id.replace(/-/g, \' \')];',
  '      for (const a of numAliases) {',
  '        if (a.length < 4) continue;',
  '        const esc = a.replace(/[-[\\/\\\\^$*+?.()|{}]/g, \'\\\\$&\');',
  '        const numRe  = new RegExp(\'(?:^|\\\\s)(\\\\d+)\\\\s+\' + esc + \'(?=\\\\s|$)\', \'i\');',
  '        const wordRe = new RegExp(\'\\\\b(two|three|four|five|six|seven|eight|nine|ten)\\\\s+\' + esc + \'\\\\b\', \'i\');',
  '        const mm = searchStr.match(numRe) || searchStr.match(wordRe);',
  '        if (mm) {',
  '          const raw = (mm[1] || \'\').toLowerCase();',
  '          const cnt = parseInt(raw) || {two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10}[raw] || 1;',
  '          for (let j = 0; j < Math.min(cnt, 10); j++) found.push(comp.id);',
  '          searchStr = searchStr.replace(mm[0], \' \');',
  '          break;',
  '        }',
  '      }',
  '    }',
  '',
  '    ',
].join('\n');

code = code.slice(0, startIdx) + newBlock + code.slice(endIdx);
fs.writeFileSync(file, code, 'utf8');
console.log('Fixed number-pattern loop in circuitChatAI.js (' + newBlock.length + ' bytes)');
