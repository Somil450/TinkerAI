const fs = require('fs');

const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

const t1 = `        const response = await fetch(\`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {`;
const r1 = `        const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {`;

let matched = false;
if (code.includes(t1)) { code = code.replace(t1, r1); matched = true; }
else if (code.includes(t1.replace(/\n/g, '\r\n'))) { code = code.replace(t1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n')); matched = true; }

if (!matched) {
    console.error("Not found!");
    process.exit(1);
}

fs.writeFileSync(file, code, 'utf8');
console.log("Restored v1beta successfully");
