import { circuitChatAI } from './src/ai/circuitChatAI.js';
(async () => {
    circuitChatAI.history = [];
    try {
        const reply = await circuitChatAI.respond("connect 3 leds to mcu");
        console.log(reply);
    } catch (e) {
        console.error("ERROR:", e);
    }
})();
