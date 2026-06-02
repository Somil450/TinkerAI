import { componentRegistry } from '../ai/componentRegistry.js';
import { getComponentIcon } from './componentIcons.js';

export function getComponentHTML(type, componentCounter) {
  if(type === "LED" || type === "led-red" || type === "led-green" || type === "rgb-led"){
    return `
      <img src="/src/assets/led.svg" class="svg-component" style="width: 60px; height: 120px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div style="display: none; align-items: center; justify-content: center; width: 60px; height: 120px; font-weight: bold; background: #eee; border: 2px solid #ccc; border-radius: 8px;">LED</div>
      <div class="pin" data-pin="anode" style="left: 16px; top: 50px; transform: translate(-50%, -50%);" title="anode"></div>
      <div class="pin" data-pin="cathode" style="left: 36px; top: 110px; transform: translate(-50%, -50%);" title="cathode"></div>
    `
  }

  if(type === "Resistor" || type.startsWith("resistor-")){
    return `
      <img src="/src/assets/resistor.svg" class="svg-component" style="width: 120px; height: 40px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div style="display: none; align-items: center; justify-content: center; width: 120px; height: 40px; font-weight: bold; background: #eee; border: 2px solid #ccc; border-radius: 8px;">RES</div>
      <div class="pin" data-pin="pin1" style="left: 0px; top: 20px; transform: translate(-50%, -50%);" title="pin1"></div>
      <div class="pin" data-pin="pin2" style="left: 120px; top: 20px; transform: translate(-50%, -50%);" title="pin2"></div>
    `
  }

  if(type === "Arduino" || type === "arduino-uno"){
    let topPinsHTML = '';
    // Top header hole centers (SVG rects at x+4): GND @93, D13–D2 @107–261
    topPinsHTML += `<div class="pin" data-pin="GND" style="left: 93px; top: 17px; transform: translate(-50%, -50%);" title="GND"></div>`;
    for (let n = 13; n >= 2; n--) {
      const px = 107 + (13 - n) * 14;
      topPinsHTML += `<div class="pin" data-pin="D${n}" style="left: ${px}px; top: 17px; transform: translate(-50%, -50%);" title="D${n}"></div>`;
    }

    // Bottom power header — aligned to SVG hole centers
    const powerPins = [
      { id: "3V3", x: 107 },
      { id: "5V", x: 121 },
      { id: "GND", x: 135 },
      { id: "VIN", x: 163 },
    ];
    let bottomPinsHTML = '';
    powerPins.forEach(p => {
       bottomPinsHTML += `<div class="pin" data-pin="${p.id}" style="left: ${p.x}px; top: 203px; transform: translate(-50%, -50%);" title="${p.id}"></div>`;
    });

    // A0 to A5
    for (let i = 0; i <= 5; i++) {
       let px = 199 + (i * 14);
       bottomPinsHTML += `<div class="pin" data-pin="A${i}" style="left: ${px}px; top: 203px; transform: translate(-50%, -50%);" title="A${i}"></div>`;
    }

    return `
      <img src="/src/assets/arduino.svg" class="svg-component" style="width: 300px; height: 220px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div style="display: none; align-items: center; justify-content: center; width: 300px; height: 220px; font-weight: bold; background: #eee; border: 2px solid #ccc; border-radius: 8px;">Arduino Uno</div>
      ${topPinsHTML}
      ${bottomPinsHTML}
    `
  }

  // Fallback for dynamically added components
  const comp = componentRegistry.get(type);
  if (comp) {
    const pins = comp.pins ? Object.keys(comp.pins) : [];
    const width = 140;
    const height = Math.max(100, pins.length * 20 + 20);
    
    let pinsHTML = '';
    pins.forEach((pin, index) => {
      const isLeft = index % 2 === 0;
      const x = isLeft ? 0 : width;
      const y = 20 + Math.floor(index / 2) * 40;
      pinsHTML += `<div class="pin" data-pin="${pin}" style="left: ${x}px; top: ${y}px; transform: translate(-50%, -50%);" title="${pin}"></div>`;
      pinsHTML += `<div style="position: absolute; left: ${isLeft ? 15 : width - 15}px; top: ${y}px; transform: translate(${isLeft ? '0' : '-100%'}, -50%); font-size: 10px; color: #555; pointer-events: none;">${pin}</div>`;
    });

    return `
      <div style="display: flex; align-items: center; justify-content: center; width: ${width}px; height: ${height}px; background: #fff; border: 2px solid #1a73e8; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-direction: column; text-align: center; padding: 10px; box-sizing: border-box;">
        <div style="width: 40px; height: 40px; margin-bottom: 8px;">
          ${getComponentIcon(type)}
        </div>
        <span style="font-size: 12px; font-weight: bold; color: #1a73e8; word-wrap: break-word; line-height: 1.2;">${comp.name}</span>
      </div>
      ${pinsHTML}
    `
  }

  return `<div style="padding: 20px; background: #f44336; color: white; border-radius: 8px;">Unknown: ${type}</div>`
}