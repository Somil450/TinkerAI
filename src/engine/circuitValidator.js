export function validatePreSimulation(code, connections, placedComponents) {
    const errors = [];

    // 1. COMPILATION CHECK
    try {
        // Attempt to transpile the code using the global arduinoInterpreter
        if (window.arduinoInterpreter) {
            window.arduinoInterpreter.transpile(code);
        }
    } catch (e) {
        errors.push(`CODE ERROR: ${e.message}`);
        return { valid: false, errors }; // Critical fail, stop here
    }

    // Prepare connection graph for easier lookup
    const wireGraph = {};
    connections.forEach(wire => {
        if (!wireGraph[wire.from]) wireGraph[wire.from] = [];
        if (!wireGraph[wire.to]) wireGraph[wire.to] = [];
        wireGraph[wire.from].push(wire.to);
        wireGraph[wire.to].push(wire.from);
    });

    // Helper: Find if a specific pin traces back to any MCU pin
    const tracesToMCU = (startPin) => {
        const visited = new Set();
        const queue = [startPin];
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) continue;
            visited.add(current);
            
            // If the current pin belongs to an MCU, we found a path
            const compId = current.split('.')[0];
            const comp = placedComponents.find(c => c.dataset.componentId === compId);
            if (comp) {
                const type = comp.dataset.componentId.replace(/_\d+$/, '');
                if (type.includes('arduino') || type.includes('esp') || type.includes('pico') || type.includes('stm32')) {
                    return true;
                }
            }
            
            (wireGraph[current] || []).forEach(neighbor => {
                if (!visited.has(neighbor)) queue.push(neighbor);
            });
        }
        return false;
    };

    // 2. WIRING CHECKS
    placedComponents.forEach(el => {
        const id = el.dataset.componentId;
        if (!id) return;
        const type = id.replace(/_\d+$/, '');
        
        // Skip MCUs themselves
        if (type.includes('arduino') || type.includes('esp') || type.includes('pico') || type.includes('stm32')) {
            return;
        }

        // Check Power (VCC/5V/3V3/VIN)
        const powerPins = [`${id}.VCC`, `${id}.5V`, `${id}.3V3`, `${id}.3.3V`, `${id}.VIN`, `${id}.VDD`];
        const hasPowerPin = powerPins.some(p => document.getElementById(p)); // Check if component has this pin in DOM
        
        if (hasPowerPin) {
            const isPowered = powerPins.some(p => tracesToMCU(p));
            if (!isPowered) {
                errors.push(`HARDWARE ERROR: ${id} is missing Power (VCC/5V) connection to MCU.`);
            }
        }

        // Check Ground (GND)
        const gndPins = [`${id}.GND`, `${id}.AGND`, `${id}.VSS`];
        const hasGndPin = gndPins.some(p => document.getElementById(p));
        
        if (hasGndPin) {
            const isGrounded = gndPins.some(p => tracesToMCU(p));
            if (!isGrounded) {
                errors.push(`HARDWARE ERROR: ${id} is missing Ground (GND) connection to MCU.`);
            }
        }

        // Specific Logic Checks based on component type
        if (type.includes('lcd') && type.includes('i2c')) {
            const sda = tracesToMCU(`${id}.SDA`);
            const scl = tracesToMCU(`${id}.SCL`);
            if (!sda || !scl) {
                errors.push(`HARDWARE ERROR: ${id} (I2C LCD) is missing SDA or SCL data connections to MCU.`);
            }
            if (!code.includes('LiquidCrystal_I2C')) {
                errors.push(`CODE ERROR: LCD is wired, but code is missing LiquidCrystal_I2C initialization.`);
            }
        }

        if (type.includes('hc-sr04')) {
            const trig = tracesToMCU(`${id}.TRIG`);
            const echo = tracesToMCU(`${id}.ECHO`);
            if (!trig || !echo) {
                errors.push(`HARDWARE ERROR: ${id} (Ultrasonic) is missing TRIG or ECHO data connections to MCU.`);
            }
            if (!code.includes('pulseIn')) {
                errors.push(`CODE ERROR: Ultrasonic sensor is wired, but code does not use pulseIn() to read it.`);
            }
        }
        
        if (type.includes('dht')) {
            const data = tracesToMCU(`${id}.DATA`) || tracesToMCU(`${id}.OUT`) || tracesToMCU(`${id}.D`);
            if (!data) {
                errors.push(`HARDWARE ERROR: ${id} (DHT Sensor) is missing DATA connection to MCU.`);
            }
        }

        if (type.includes('servo')) {
            const sig = tracesToMCU(`${id}.SIG`) || tracesToMCU(`${id}.PWM`) || tracesToMCU(`${id}.S`);
            if (!sig) {
                errors.push(`HARDWARE ERROR: ${id} (Servo) is missing Signal connection to MCU.`);
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}
