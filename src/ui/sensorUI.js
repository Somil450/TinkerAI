/**
 * TinkerAI — Complete Simulation Sensor Controls Panel
 * Auto-detects every interactive component type and creates appropriate controls.
 * Connects to arduinoInterpreter via window.simSensorValues.
 */

import { arduinoInterpreter } from '../engine/arduinoInterpreter.js';

let _panel = null;
window.simSensorValues = window.simSensorValues || {};
window._buttonStates   = window._buttonStates   || {};

// ─── Sensor type map ─────────────────────────────────────────────────────────
const SENSOR_CONFIGS = {
    'hc-sr04':         { label: '📡 Distance',     unit: 'cm',  min: 2,   max: 400, def: 100, key: 'distance' },
    'dht11':           { label: '🌡️ Temp',          unit: '°C',  min: -20, max: 80,  def: 25,  key: 'dhtTemp' },
    'dht22':           { label: '🌡️ Temp',          unit: '°C',  min: -40, max: 80,  def: 25,  key: 'dhtTemp' },
    'ldr':             { label: '☀️ Light',          unit: '',    min: 0,   max: 1023,def: 512, key: 'light', analog: 'A0' },
    'soil-moisture':   { label: '💧 Moisture',       unit: '%',   min: 0,   max: 100, def: 50,  key: 'moisture', analog: 'A0' },
    'mq2-gas':         { label: '💨 Gas (MQ-2)',     unit: 'ppm', min: 0,   max: 1023,def: 200, key: 'gas', analog: 'A0' },
    'mq135-air':       { label: '💨 Air (MQ-135)',   unit: 'ppm', min: 0,   max: 1023,def: 150, key: 'air', analog: 'A0' },
    'mq3-gas':         { label: '🍷 Alcohol',        unit: 'ppm', min: 0,   max: 1023,def: 100, key: 'alcohol', analog: 'A0' },
    'mq7-gas':         { label: '💨 CO (MQ-7)',      unit: 'ppm', min: 0,   max: 1023,def: 100, key: 'co', analog: 'A0' },
    'mq8-gas':         { label: '💨 H2 (MQ-8)',      unit: 'ppm', min: 0,   max: 1023,def: 100, key: 'h2', analog: 'A0' },
    'water-level':     { label: '🌊 Water Level',    unit: '%',   min: 0,   max: 100, def: 30,  key: 'waterLevel', analog: 'A0' },
    'flame-sensor':    { label: '🔥 Flame',          unit: '',    min: 0,   max: 1023,def: 0,   key: 'flame', analog: 'A0' },
    'sound-sensor':    { label: '🔊 Sound',          unit: 'dB',  min: 0,   max: 1023,def: 512, key: 'sound', analog: 'A0' },
    'ky-038':          { label: '🔊 Sound',          unit: '',    min: 0,   max: 1023,def: 512, key: 'sound2', analog: 'A0' },
    'rain-sensor':     { label: '🌧️ Rain',           unit: '%',   min: 0,   max: 100, def: 0,   key: 'rain', analog: 'A0' },
    'tilt-sensor':     { label: '📐 Tilt',           unit: '°',   min: 0,   max: 360, def: 0,   key: 'tilt', analog: 'A0' },
    'flex-sensor':     { label: '🤸 Flex',           unit: '°',   min: 0,   max: 180, def: 0,   key: 'flex', analog: 'A0' },
    'force-sensor':    { label: '✊ Force',          unit: 'g',   min: 0,   max: 1000,def: 0,   key: 'force', analog: 'A0' },
    'potentiometer':   { label: '🎛️ Pot',            unit: '',    min: 0,   max: 1023,def: 512, key: 'pot', analog: 'A0' },
    'voltage-sensor':  { label: '⚡ Voltage',        unit: 'V',   min: 0,   max: 25,  def: 5,   key: 'voltage', analog: 'A0', scale: 1 },
    'joystick':        { label: '🕹️ Joystick X',     unit: '',    min: 0,   max: 1023,def: 512, key: 'joyX', analog: 'A0' },
    'hall-effect':     { label: '🧲 Magnetic',       unit: 'G',   min: -500,max: 500, def: 0,   key: 'hall', analog: 'A0' },
    'acs712':          { label: '⚡ Current',         unit: 'A',   min: -30, max: 30,  def: 0,   key: 'current', analog: 'A0' },
    'turbidity-sensor':{ label: '💧 Turbidity',      unit: 'NTU', min: 0,   max: 1000,def: 100, key: 'turbidity', analog: 'A0' },
    'ph-sensor':       { label: '🧪 pH',             unit: 'pH',  min: 0,   max: 14,  def: 7,   key: 'ph', analog: 'A0' },
    'uv-sensor':       { label: '☀️ UV Index',        unit: 'mW',  min: 0,   max: 1023,def: 100, key: 'uv', analog: 'A0' },
};

const BUTTON_TYPES = ['push-button', 'rocker-switch', 'toggle-switch', 'slide-switch', 'dip-switch-4'];
const DHT_TYPES    = ['dht11', 'dht22', 'dht-module'];

export function initSensorUI() {
    if (!document.getElementById('sim-sensor-panel')) {
        _panel = document.createElement('div');
        _panel.id = 'sim-sensor-panel';
        _panel.className = 'sim-sensor-panel hidden';
        document.body.appendChild(_panel);
    } else {
        _panel = document.getElementById('sim-sensor-panel');
    }
}

export function updateSensorUI() {
    if (!_panel) initSensorUI();

    const placed = Array.from(document.querySelectorAll('.placed-component'));
    let html = `<div class="sim-sensor-title">🔬 Simulation Active — Virtual Inputs</div>`;
    let hasContent = false;

    // ── Buttons / switches ────────────────────────────────────────────────────
    const buttons = placed.filter(el => {
        const t = (el.dataset.componentId||'').replace(/_\d+$/, '');
        return BUTTON_TYPES.includes(t);
    });
    if (buttons.length > 0) {
        hasContent = true;
        html += `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:4px;">`;
        buttons.forEach(el => {
            const id = el.dataset.componentId;
            const t  = id.replace(/_\d+$/, '');
            const label = t.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
            const n = id.match(/_(\d+)$/)?.[1] || '';
            html += `<button id="simbtn_${id}" class="sim-sensor-btn"
                onmousedown="window._btnPress('${id}',true)"
                onmouseup="window._btnPress('${id}',false)"
                ontouchstart="window._btnPress('${id}',true)"
                ontouchend="window._btnPress('${id}',false)"
                style="padding:8px 18px;font-size:12px;">🔘 ${label} ${n}</button>`;
        });
        html += `</div>`;

        // Bind canvas-level click too
        buttons.forEach(el => {
            const id = el.dataset.componentId;
            if (!el.dataset.simBound) {
                el.dataset.simBound = '1';
                el.style.cursor = 'pointer';
                el.title = 'Click to press button';
                el.addEventListener('mousedown',  () => window._btnPress(id, true));
                el.addEventListener('mouseup',    () => window._btnPress(id, false));
                el.addEventListener('mouseleave', () => window._btnPress(id, false));
            }
        });
    }

    // ── DHT Temp + Humidity ───────────────────────────────────────────────────
    const hasDHT = placed.some(el => DHT_TYPES.includes(el.dataset.componentId?.replace(/_\d+$/, '')));
    if (hasDHT) {
        hasContent = true;
        const t = window.simSensorValues.dhtTemp ?? 25;
        const h = window.simSensorValues.dhtHumidity ?? 60;
        html += _sliderRow('dhtTemp',     '🌡️ Temperature', t, -40, 85, 0.5, '°C');
        html += _sliderRow('dhtHumidity', '💧 Humidity',    h, 0,  100, 1,   '%');
    }

    // ── Specific sensor sliders ────────────────────────────────────────────────
    placed.forEach(el => {
        const id   = el.dataset.componentId || '';
        const type = id.replace(/_\d+$/, '');
        const cfg  = SENSOR_CONFIGS[type];
        if (!cfg || DHT_TYPES.includes(type)) return;

        hasContent = true;
        const key = `${cfg.key}_${id}`;
        if (window.simSensorValues[key] === undefined)
            window.simSensorValues[key] = cfg.def;
        const val = window.simSensorValues[key];

        html += _sliderRow(key, `${cfg.label} <small style="color:#64748b">(${id.match(/_(\d+)$/)?.[1]||''})</small>`,
            val, cfg.min, cfg.max, cfg.min < 0 ? 0.5 : 1, cfg.unit,
            `window._sensorSlider('${key}','${cfg.analog||'A0'}', this.value)`
        );
    });

    if (hasContent) {
        _panel.innerHTML = html;
        _panel.classList.remove('hidden');
        document.getElementById('canvas')?.classList.add('sim-running');
    } else {
        _panel.classList.add('hidden');
        document.getElementById('canvas')?.classList.remove('sim-running');
    }
}

function _sliderRow(key, label, val, min, max, step, unit, oninput) {
    const id_val = `sval_${key.replace(/[^a-zA-Z0-9]/g,'_')}`;
    const cb = oninput || `window._sensorSlider('${key}','',this.value)`;
    return `
    <div class="sim-sensor-row">
        <span class="sim-sensor-label">${label}</span>
        <input type="range" class="sim-sensor-slider"
            min="${min}" max="${max}" step="${step}" value="${val}"
            oninput="${cb}; document.getElementById('${id_val}').textContent=parseFloat(this.value).toFixed(1)+'${unit}'">
        <span class="sim-sensor-value" id="${id_val}">${parseFloat(val).toFixed(1)}${unit}</span>
    </div>`;
}

export function hideSensorUI() {
    if (_panel) _panel.classList.add('hidden');
    document.getElementById('canvas')?.classList.remove('sim-running');
}

// ─── Global handlers ──────────────────────────────────────────────────────────

window._btnPress = function(componentId, pressed) {
    window._buttonStates = window._buttonStates || {};
    window._buttonStates[componentId] = pressed;

    // Find connected MCU pin via wireObjects
    const wires = window.wireObjects || [];
    for (const w of wires) {
        const fromId  = w.fromId  || w.pin1?.closest?.('.placed-component')?.dataset?.componentId;
        const toId    = w.toId    || w.pin2?.closest?.('.placed-component')?.dataset?.componentId;
        const fromPin = w.fromPin || w.pin1?.dataset?.pin || '';
        const toPin   = w.toPin   || w.pin2?.dataset?.pin || '';
        const otherPin = fromId === componentId ? toPin : (toId === componentId ? fromPin : null);
        if (otherPin) {
            arduinoInterpreter.setDigitalInput(otherPin, pressed ? 0 : 1); // active LOW typical
        }
    }

    // UI feedback
    const btn = document.getElementById(`simbtn_${componentId}`);
    if (btn) btn.classList.toggle('active', pressed);
    const el = document.querySelector(`.placed-component[data-component-id="${componentId}"]`);
    if (el) el.style.filter = pressed ? 'brightness(1.8) drop-shadow(0 0 8px #38bdf8)' : '';
};

window._sensorSlider = function(key, analogPin, rawValue) {
    const v = parseFloat(rawValue);
    window.simSensorValues[key] = v;
    // Sync special well-known keys
    if (key === 'dhtTemp')     window.simSensorValues.dhtTemp     = v;
    if (key === 'dhtHumidity') window.simSensorValues.dhtHumidity = v;
    if (key === 'distance')    window.simSensorValues.distance    = v;
    // Feed into analog input of interpreter
    if (analogPin) arduinoInterpreter.setSensorValue(analogPin, Math.round(v));
};

window._simSensorChange = function(key, value) {
    window.simSensorValues[key] = value;
};
window._simAnalogSet = function(pin, value) {
    arduinoInterpreter.setSensorValue(pin, value);
};
