const fs = require('fs');

const file = 'src/ai/circuitChatAI.js';
let code = fs.readFileSync(file, 'utf8');

// We are currently on v1beta because of patch-code5.cjs. We need to change it to v1 AND change systemInstruction to system_instruction.
const r1 = `        const response = await fetch(\`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiHistory
          })
        });`;

// Replace using regex to match both v1/v1beta and systemInstruction
code = code.replace(/const response = await fetch\(`https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-1\.5-flash:generateContent\?key=\$\{apiKey\}`,\s*{\s*method:\s*'POST',\s*headers:\s*{\s*'Content-Type':\s*'application\/json'\s*},\s*body:\s*JSON\.stringify\({\s*systemInstruction:\s*{\s*parts:\s*\[{\s*text:\s*systemPrompt\s*}\]\s*},\s*contents:\s*geminiHistory\s*}\)\s*}\);/g, r1);

// Just in case it's v1 right now
code = code.replace(/const response = await fetch\(`https:\/\/generativelanguage\.googleapis\.com\/v1\/models\/gemini-1\.5-flash:generateContent\?key=\$\{apiKey\}`,\s*{\s*method:\s*'POST',\s*headers:\s*{\s*'Content-Type':\s*'application\/json'\s*},\s*body:\s*JSON\.stringify\({\s*systemInstruction:\s*{\s*parts:\s*\[{\s*text:\s*systemPrompt\s*}\]\s*},\s*contents:\s*geminiHistory\s*}\)\s*}\);/g, r1);

fs.writeFileSync(file, code, 'utf8');
console.log("Patched URL and system_instruction successfully.");
