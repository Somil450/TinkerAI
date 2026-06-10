import { componentRegistry as aiComponentRegistry } from '../ai/componentRegistry.js';

export const simulationModels = {
    'l298n': {
        updateLogic: (id, sources, grounds, poweredSet, el, canReach) => {
            const isPowered = (canReach(`${id}.12V`, sources) || canReach(`${id}.5V`, sources)) && canReach(`${id}.GND`, grounds);
            if (!isPowered) return;
            
            const in1 = canReach(`${id}.IN1`, sources);
            const in2 = canReach(`${id}.IN2`, sources);
            const in3 = canReach(`${id}.IN3`, sources);
            const in4 = canReach(`${id}.IN4`, sources);
            // Default ENA/ENB to true if not connected to anything (hardware jumper present)
            // But if connected to a LOW pin, they should be false.
            // Since we can't easily detect "not connected" vs "connected to LOW", 
            // we will just assume true if it reaches a source, OR if it doesn't reach ground.
            const ena = canReach(`${id}.ENA`, sources) || !canReach(`${id}.ENA`, grounds); 
            const enb = canReach(`${id}.ENB`, sources) || !canReach(`${id}.ENB`, grounds);

            if (ena) {
                if (in1 && !in2) {
                    sources.push(`${id}.OUT1`);
                    grounds.add(`${id}.OUT2`);
                } else if (!in1 && in2) {
                    sources.push(`${id}.OUT2`);
                    grounds.add(`${id}.OUT1`);
                }
            }
            
            if (enb) {
                if (in3 && !in4) {
                    sources.push(`${id}.OUT3`);
                    grounds.add(`${id}.OUT4`);
                } else if (!in3 && in4) {
                    sources.push(`${id}.OUT4`);
                    grounds.add(`${id}.OUT3`);
                }
            }
        }
    },
    
    '4wd-car-chassis': {
        updatePhysics: (id, sources, grounds, poweredSet, el, canReach) => {
            const m1f = canReach(`${id}.M1+`, sources) && canReach(`${id}.M1-`, grounds);
            const m1r = canReach(`${id}.M1-`, sources) && canReach(`${id}.M1+`, grounds);
            
            const m2f = canReach(`${id}.M2+`, sources) && canReach(`${id}.M2-`, grounds);
            const m2r = canReach(`${id}.M2-`, sources) && canReach(`${id}.M2+`, grounds);
            
            const m3f = canReach(`${id}.M3+`, sources) && canReach(`${id}.M3-`, grounds);
            const m3r = canReach(`${id}.M3-`, sources) && canReach(`${id}.M3+`, grounds);
            
            const m4f = canReach(`${id}.M4+`, sources) && canReach(`${id}.M4-`, grounds);
            const m4r = canReach(`${id}.M4-`, sources) && canReach(`${id}.M4+`, grounds);
            
            let leftSpeed = 0;
            if (m1f || m3f) leftSpeed = 1;
            else if (m1r || m3r) leftSpeed = -1;
            
            let rightSpeed = 0;
            if (m2f || m4f) rightSpeed = 1;
            else if (m2r || m4r) rightSpeed = -1;
            
            el.dataset.m1 = m1f ? '1' : (m1r ? '-1' : '0');
            el.dataset.m2 = m2f ? '1' : (m2r ? '-1' : '0');
            el.dataset.m3 = m3f ? '1' : (m3r ? '-1' : '0');
            el.dataset.m4 = m4f ? '1' : (m4r ? '-1' : '0');
            
            if (leftSpeed !== 0 || rightSpeed !== 0) {
                poweredSet.add(id);
            }

            if (!el.physics) {
                el.physics = { 
                    x: parseFloat(el.style.left) || 0, 
                    y: parseFloat(el.style.top) || 0, 
                    rotation: 0 
                };
                el.style.transformOrigin = "center center";
            }
            
            const speedMult = 2.0;
            const rotMult = 0.05;
            
            const v = (leftSpeed + rightSpeed) * speedMult;
            const omega = (rightSpeed - leftSpeed) * rotMult;
            
            if (v !== 0 || omega !== 0) {
                el.physics.rotation += omega;
                el.physics.x += v * Math.sin(el.physics.rotation);
                el.physics.y -= v * Math.cos(el.physics.rotation);
                
                el.style.left = `${el.physics.x}px`;
                el.style.top = `${el.physics.y}px`;
                const scale = el.dataset.scale || 1;
                el.style.transform = `scale(${scale}) rotate(${el.physics.rotation}rad)`;
                
                if (window.renderWires) window.renderWires();
            }
        }
    }
};

// Generic fallback models based on component category/subcategory
export const genericModels = {
    'LED': {
        updatePhysics: (id, sources, grounds, poweredSet, el, canReach) => {
            if (canReach(`${id}.anode`, sources) && canReach(`${id}.cathode`, grounds)) {
                poweredSet.add(id);
            } else if (canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds)) {
                poweredSet.add(id);
            }
        }
    },
    'Motor': {
        updatePhysics: (id, sources, grounds, poweredSet, el, canReach) => {
            const fwd = canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds);
            const rev = canReach(`${id}.-`, sources) && canReach(`${id}.+`, grounds);
            if (fwd || rev) {
                poweredSet.add(id);
            }
        }
    },
    'Buzzer': {
        updatePhysics: (id, sources, grounds, poweredSet, el, canReach) => {
            if (canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds)) {
                poweredSet.add(id);
            }
        }
    },
    'Sensor': {
        updatePhysics: (id, sources, grounds, poweredSet, el, canReach, pinsState) => {
            const isPowered = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
            if (isPowered) {
                poweredSet.add(id);
            }
        }
    }
};

export function evaluateLogic(id, type, sources, grounds, poweredSet, el, canReach, pinsState) {
    if (simulationModels[type] && simulationModels[type].updateLogic) {
        simulationModels[type].updateLogic(id, sources, grounds, poweredSet, el, canReach, pinsState);
        return;
    }
    
    const spec = aiComponentRegistry.get(type);
    if (spec) {
        let genericModel = null;
        if (spec.subcategory === 'LED' || spec.subcategory === 'Addressable LED') genericModel = genericModels['LED'];
        else if (spec.subcategory === 'Motor' || spec.subcategory === 'Fan' || spec.subcategory === 'Pump' || spec.subcategory === 'Servo') genericModel = genericModels['Motor'];
        else if (spec.subcategory === 'Audio') genericModel = genericModels['Buzzer'];
        else if (spec.category === 'Sensor') genericModel = genericModels['Sensor'];
        
        if (genericModel && genericModel.updateLogic) {
            genericModel.updateLogic(id, sources, grounds, poweredSet, el, canReach, pinsState);
        }
    }
}

export function evaluatePhysics(id, type, sources, grounds, poweredSet, el, canReach, pinsState) {
    if (simulationModels[type] && simulationModels[type].updatePhysics) {
        simulationModels[type].updatePhysics(id, sources, grounds, poweredSet, el, canReach, pinsState);
        return;
    }
    
    const spec = aiComponentRegistry.get(type);
    if (spec) {
        let genericModel = null;
        if (spec.subcategory === 'LED' || spec.subcategory === 'Addressable LED') genericModel = genericModels['LED'];
        else if (spec.subcategory === 'Motor' || spec.subcategory === 'Fan' || spec.subcategory === 'Pump' || spec.subcategory === 'Servo') genericModel = genericModels['Motor'];
        else if (spec.subcategory === 'Audio') genericModel = genericModels['Buzzer'];
        else if (spec.category === 'Sensor') genericModel = genericModels['Sensor'];
        
        if (genericModel && genericModel.updatePhysics) {
            genericModel.updatePhysics(id, sources, grounds, poweredSet, el, canReach, pinsState);
        }
    }
}
