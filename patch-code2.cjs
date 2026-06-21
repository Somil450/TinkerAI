const fs = require('fs');

const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

const t1 = `  payload.code = codeStr;
  
  out += \`\\n<!-- ACTION: \${JSON.stringify(payload)} -->\\n\`;`;

const r1 = `  payload.code = codeStr;
  
  out += \`\\n\`\`\`cpp\\n\${codeStr}\`\`\`\\n\`;
  out += \`\\n<!-- ACTION: \${JSON.stringify(payload)} -->\\n\`;`;

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
