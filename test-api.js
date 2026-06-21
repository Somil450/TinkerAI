import { circuitChatAI } from './src/ai/circuitChatAI.js';

(async () => {
    circuitChatAI.history = [];
    global.localStorage = { getItem: () => 'AIzaSyFakeKey1234567890', setItem: () => {} };
    try {
        const reply = await circuitChatAI.respond("connect 3 leds to mcu");
        console.log(reply);
    } catch (e) {
        console.error("ERROR:", e);
    }
})();
