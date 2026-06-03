/**
 * Wokwi Arduino Compiler API integration
 */

export async function compileCode(code) {
    const data = {
        sketch: `${code}`,
        files: [] // No extra files for now
    };

    try {
        const response = await fetch('https://hexi.wokwi.com/build', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result; // contains { hex: "...", stderr: "...", stdout: "..." }
    } catch (e) {
        return { compilerError: e.message };
    }
}
