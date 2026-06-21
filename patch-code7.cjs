const fs = require('fs');
const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

const t1 = `        const response = await fetch(\`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiHistory
          })
        });`;

const r1 = `        const response = await fetch(\`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              { role: 'model', parts: [{ text: 'Understood. I will strictly follow these rules to the letter.' }] },
              ...geminiHistory
            ]
          })
        });`;

let matched = false;
if (code.includes(t1)) { code = code.replace(t1, r1); matched = true; }
else if (code.includes(t1.replace(/\n/g, '\r\n'))) { code = code.replace(t1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n')); matched = true; }

if (!matched) {
    console.error("Not found!");
    process.exit(1);
}

fs.writeFileSync(file, code, 'utf8');
console.log("Patched to use contents array for system prompt.");
