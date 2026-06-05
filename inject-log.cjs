const fs = require('fs');
let code = fs.readFileSync('src/ai/circuitChatAI.js', 'utf8');

code = code.replace(
  "        const mm = searchStr.match(numRe) || searchStr.match(wordRe);\n        if (mm) {",
  "        const mm = searchStr.match(numRe) || searchStr.match(wordRe);\n        if (mm) {\n          console.log('MATCHED NUMBER PATTERN:', a, 'cnt:', mm[1]);"
);

fs.writeFileSync('src/ai/circuitChatAI.js', code, 'utf8');
