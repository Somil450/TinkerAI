const fs = require('fs');

const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

const t1 = `        // Filter out system messages (like API key submitted) and map to Gemini format
        const geminiHistory = this.history
            .filter(h => h.text !== "[API KEY SUBMITTED]" && h.text && !h.text.includes("API Key saved securely"))
        });
        
        const data = await response.json();`;

const r1 = `        // Filter out system messages (like API key submitted) and map to Gemini format
        const geminiHistory = this.history
            .filter(h => h.text !== "[API KEY SUBMITTED]" && h.text && !h.text.includes("API Key saved securely"))
            .map(h => ({
                role: h.role === 'ai' ? 'model' : 'user',
                parts: [{ text: h.text }]
            }));
        
        const response = await fetch(\`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiHistory
          })
        });
        
        const data = await response.json();`;

let matched = false;
if (code.includes(t1)) { code = code.replace(t1, r1); matched = true; }
else if (code.includes(t1.replace(/\n/g, '\r\n'))) { code = code.replace(t1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n')); matched = true; }

if (!matched) {
    console.error("Not found! Here is the code snippet around line 1541:");
    const lines = code.split('\n');
    console.error(lines.slice(1530, 1550).join('\n'));
    process.exit(1);
}

fs.writeFileSync(file, code, 'utf8');
console.log("Restored successfully");
