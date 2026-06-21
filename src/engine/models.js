/**
 * TinkerAI — Complete Component Simulation Models
 * Covers EVERY component in the catalog with verified pin names.
 *
 * Two phases:
 *  evaluateLogic  — propagates electrical signals (motor drivers, relays)
 *  evaluatePhysics — applies visual state to DOM elements
 */

import { componentRegistry as aiComponentRegistry } from '../ai/componentRegistry.js';

// ─── Web Audio context (lazy) ─────────────────────────────────────────────────
const _toneNodes = {};
function _playTone(id, freq = 800, type = 'square') {
    if (_toneNodes[id]) return;
    try {
        const ctx  = window._simAudioCtx = window._simAudioCtx || new AudioContext();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq; osc.type = type;
        gain.gain.value = 0.04;
        osc.connect(gain); gain.connect(ctx.destination); osc.start();
        _toneNodes[id] = { osc, gain };
    } catch(e) {}
}
function _stopTone(id) {
    if (!_toneNodes[id]) return;
    try { _toneNodes[id].osc.stop(); } catch(e) {}
    delete _toneNodes[id];
}

// ─── CSS helpers ──────────────────────────────────────────────────────────────
function _glow(el, on, color = '#ff4400', radius = 12) {
    if (on) {
        el.classList.add('sim-glow');
        el.style.setProperty('--led-color', color);
        el.style.filter = `brightness(2.2) drop-shadow(0 0 ${radius}px ${color})`;
    } else {
        el.classList.remove('sim-glow');
        el.style.filter = '';
    }
}
function _spin(el, on, dir = 'cw', dur = '0.5s') {
    if (on) {
        el.style.setProperty('--spin-duration', dur);
        el.classList.add(dir === 'cw' ? 'sim-motor-cw' : 'sim-motor-ccw');
        el.classList.remove(dir === 'cw' ? 'sim-motor-ccw' : 'sim-motor-cw');
    } else {
        el.classList.remove('sim-motor-cw', 'sim-motor-ccw');
        el.style.setProperty('--spin-duration', '0.5s');
    }
}
function _setStatus(el, on, glowColor = 'rgba(56,189,248,0.4)') {
    if (on) {
        el.style.boxShadow = `0 0 12px ${glowColor}`;
        el.classList.add('sim-powered');
    } else {
        el.style.boxShadow = '';
        el.classList.remove('sim-powered');
    }
}

// ─── Helper: is a pin powered (source) or grounded? ──────────────────────────
const _isPowered = (id, pins, sources) =>
    pins.some(p => sources.includes(`${id}.${p}`));

const _isGrounded = (id, pins, grounds) =>
    pins.some(p => grounds.has(`${id}.${p}`));

// Shorthand: component has power supply (VCC/5V/3V3/VIN) and GND
function _hasPower(id, sources, grounds) {
    return (sources.includes(`${id}.VCC`)  || sources.includes(`${id}.5V`) ||
            sources.includes(`${id}.3V3`)  || sources.includes(`${id}.3.3V`) ||
            sources.includes(`${id}.VIN`)  || sources.includes(`${id}.VDD`) ||
            sources.includes(`${id}.VSYS`) || sources.includes(`${id}.V+`)) &&
           (grounds.has(`${id}.GND`) || grounds.has(`${id}.AGND`) || grounds.has(`${id}.G`));
}

// Simple +/- powered (motors, buzzers, LEDs)
function _hasPlusMinus(id, sources, grounds) {
    return sources.includes(`${id}.+`) && grounds.has(`${id}.-`);
}
function _hasMinusPlus(id, sources, grounds) {
    return sources.includes(`${id}.-`) && grounds.has(`${id}.+`);
}

// ─── Logic Evaluator (runs BEFORE physics, propagates signals) ────────────────
export function evaluateLogic(id, type, sources, grounds, poweredSet, el, canReach, pinStates) {

    // ── L298N (full bridge) ───────────────────────────────────────────────────
    if (type === 'l298n' || type === 'l298n-mini') {
        const pwr = (canReach(`${id}.12V`, sources) || canReach(`${id}.5V`, sources) ||
                     canReach(`${id}.VCC`, sources)) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        const in1 = canReach(`${id}.IN1`, sources), in2 = canReach(`${id}.IN2`, sources);
        const in3 = canReach(`${id}.IN3`, sources), in4 = canReach(`${id}.IN4`, sources);
        const ena = canReach(`${id}.ENA`, sources) || !canReach(`${id}.ENA`, grounds);
        const enb = canReach(`${id}.ENB`, sources) || !canReach(`${id}.ENB`, grounds);
        el.classList.add('sim-driver-active');
        if (ena) {
            if (in1 && !in2) { sources.push(`${id}.OUT1`); grounds.add(`${id}.OUT2`); }
            else if (!in1 && in2) { sources.push(`${id}.OUT2`); grounds.add(`${id}.OUT1`); }
            const motorA = el.querySelector('.motor-a, [data-motor="A"]');
            if (motorA) _spin(motorA, (in1 || in2), in1 ? 'cw' : 'ccw');
        }
        if (enb) {
            if (in3 && !in4) { sources.push(`${id}.OUT3`); grounds.add(`${id}.OUT4`); }
            else if (!in3 && in4) { sources.push(`${id}.OUT4`); grounds.add(`${id}.OUT3`); }
            const motorB = el.querySelector('.motor-b, [data-motor="B"]');
            if (motorB) _spin(motorB, (in3 || in4), in3 ? 'cw' : 'ccw');
        }
        return;
    }

    // ── L293D ─────────────────────────────────────────────────────────────────
    if (type === 'l293d') {
        const pwr = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        const in1 = canReach(`${id}.1A`, sources), in2 = canReach(`${id}.2A`, sources);
        const in3 = canReach(`${id}.3A`, sources), in4 = canReach(`${id}.4A`, sources);
        if (in1 && !in2) { sources.push(`${id}.1Y`); grounds.add(`${id}.2Y`); }
        else if (!in1 && in2) { sources.push(`${id}.2Y`); grounds.add(`${id}.1Y`); }
        if (in3 && !in4) { sources.push(`${id}.3Y`); grounds.add(`${id}.4Y`); }
        else if (!in3 && in4) { sources.push(`${id}.4Y`); grounds.add(`${id}.3Y`); }
        return;
    }

    // ── TB6612FNG ─────────────────────────────────────────────────────────────
    if (type === 'tb6612fng') {
        const pwr = canReach(`${id}.VM`, sources) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        const ain1 = canReach(`${id}.AIN1`, sources), ain2 = canReach(`${id}.AIN2`, sources);
        const bin1 = canReach(`${id}.BIN1`, sources), bin2 = canReach(`${id}.BIN2`, sources);
        if (ain1 && !ain2) { sources.push(`${id}.AO1`); grounds.add(`${id}.AO2`); }
        else if (!ain1 && ain2) { sources.push(`${id}.AO2`); grounds.add(`${id}.AO1`); }
        if (bin1 && !bin2) { sources.push(`${id}.BO1`); grounds.add(`${id}.BO2`); }
        else if (!bin1 && bin2) { sources.push(`${id}.BO2`); grounds.add(`${id}.BO1`); }
        return;
    }

    // ── BTS7960 half-bridge ───────────────────────────────────────────────────
    if (type === 'bts7960') {
        const pwr = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        const rpwm = canReach(`${id}.RPWM`, sources);
        const lpwm = canReach(`${id}.LPWM`, sources);
        const ren  = canReach(`${id}.R_EN`, sources);
        const len  = canReach(`${id}.L_EN`, sources);
        if (ren && rpwm) { sources.push(`${id}.MOTA`); }
        if (len && lpwm) { sources.push(`${id}.MOTB`); }
        return;
    }

    // ── ULN2003 (Darlington driver for stepper) ───────────────────────────────
    if (type === 'uln2003') {
        const pwr = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        ['1','2','3','4'].forEach(n => {
            if (canReach(`${id}.IN${n}`, sources)) sources.push(`${id}.OUT${n}`);
        });
        return;
    }

    // ── A4988 / DRV8825 (stepper microstepping driver) ────────────────────────
    if (type === 'a4988' || type === 'drv8825') {
        const pwr = canReach(`${id}.VDD`, sources) && canReach(`${id}.GND`, grounds);
        if (!pwr) return;
        poweredSet.add(id);
        const step = canReach(`${id}.STEP`, sources);
        const dir  = canReach(`${id}.DIR`,  sources);
        if (step) {
            sources.push(`${id}.1A`, `${id}.1B`);
            if (dir) sources.push(`${id}.2A`);
            else     sources.push(`${id}.2B`);
        }
        return;
    }

    // ── PCA9685 (PWM servo driver) ────────────────────────────────────────────
    if (type === 'pca9685') {
        const pwr = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (pwr) { poweredSet.add(id); _setStatus(el, true, 'rgba(168,85,247,0.4)'); }
        return;
    }

    // ── Relay (single/4ch/8ch) ────────────────────────────────────────────────
    if (type.includes('relay')) {
        const coilPwr = (canReach(`${id}.VCC`, sources) || canReach(`${id}.5V`, sources))
                     && canReach(`${id}.GND`, grounds);
        const triggered = canReach(`${id}.IN`, sources) || canReach(`${id}.IN1`, sources);
        if (coilPwr && triggered) {
            poweredSet.add(id);
            sources.push(`${id}.COM`);
            el.classList.add('sim-relay-on');
        } else {
            el.classList.remove('sim-relay-on');
        }
        // Multi-channel relay
        ['1','2','3','4','5','6','7','8'].forEach(n => {
            if (coilPwr && canReach(`${id}.IN${n}`, sources)) {
                sources.push(`${id}.COM${n}`);
            }
        });
        return;
    }

    // ── Toggle/slide switch ───────────────────────────────────────────────────
    if (type === 'toggle-switch' || type === 'slide-switch') {
        // If IN/COM is powered, pass to NO (we simulate the switch as always closed to NO)
        if (canReach(`${id}.COM`, sources)) sources.push(`${id}.NO`);
        if (canReach(`${id}.pin1`, sources)) sources.push(`${id}.pin2`);
        return;
    }

    // ── Push button ───────────────────────────────────────────────────────────
    if (type === 'push-button' || type === 'rocker-switch') {
        // Pass-through when user has pressed it (tracked via sensorData)
        const pressed = (window.simSensorValues?.[id] === 1 || window._buttonStates?.[id]);
        if (pressed) {
            if (canReach(`${id}.pin1`, sources)) sources.push(`${id}.pin2`);
            if (canReach(`${id}.pin2`, sources)) sources.push(`${id}.pin1`);
        }
        return;
    }
}

// ─── Physics Evaluator (applies visuals for every component type) ─────────────
export function evaluatePhysics(id, type, sources, grounds, poweredSet, el, canReach, pinStates, pwmValues, servoAngles) {

    // ── 4WD Car Chassis ───────────────────────────────────────────────────────
    if (type === '4wd-car-chassis') {
        const m1f = canReach(`${id}.M1+`, sources) && canReach(`${id}.M1-`, grounds);
        const m1r = canReach(`${id}.M1-`, sources) && canReach(`${id}.M1+`, grounds);
        const m2f = canReach(`${id}.M2+`, sources) && canReach(`${id}.M2-`, grounds);
        const m2r = canReach(`${id}.M2-`, sources) && canReach(`${id}.M2+`, grounds);
        const m3f = canReach(`${id}.M3+`, sources) && canReach(`${id}.M3-`, grounds);
        const m3r = canReach(`${id}.M3-`, sources) && canReach(`${id}.M3+`, grounds);
        const m4f = canReach(`${id}.M4+`, sources) && canReach(`${id}.M4-`, grounds);
        const m4r = canReach(`${id}.M4-`, sources) && canReach(`${id}.M4+`, grounds);
        const L = (m1f||m3f) ? 1 : (m1r||m3r) ? -1 : 0;
        const R = (m2f||m4f) ? 1 : (m2r||m4r) ? -1 : 0;
        if (L || R) {
            poweredSet.add(id);
            // DO NOT move the entire chassis anymore! 
            // Only spin the wheels to simulate movement in place.
            const m1_3_dir = L > 0 ? 'cw' : 'ccw';
            const m2_4_dir = R > 0 ? 'cw' : 'ccw';
            
            const wheelsLeft = el.querySelectorAll('.wheel.m1, .wheel.m3');
            const wheelsRight = el.querySelectorAll('.wheel.m2, .wheel.m4');
            
            if (L) wheelsLeft.forEach(w => _spin(w, true, m1_3_dir, '0.2s'));
            else wheelsLeft.forEach(w => _spin(w, false));

            if (R) wheelsRight.forEach(w => _spin(w, true, m2_4_dir, '0.2s'));
            else wheelsRight.forEach(w => _spin(w, false));
        } else {
            const wheels = el.querySelectorAll('.wheel');
            wheels.forEach(w => _spin(w, false));
        }
        return;
    }

    // ── LED variants ──────────────────────────────────────────────────────────
    const isLED = type === 'led-red' || type === 'led-green' || type === 'led-blue' ||
                  type === 'led-yellow' || type === 'led-white' || type === 'led-ir' ||
                  type.startsWith('led-');
    if (isLED) {
        const on = (canReach(`${id}.anode`, sources) && canReach(`${id}.cathode`, grounds)) ||
                   (canReach(`${id}.+`, sources)     && canReach(`${id}.-`, grounds));
        if (on) poweredSet.add(id);
        const c = type.includes('red') ? '#ff1100' : type.includes('green') ? '#00ff44' :
                  type.includes('blue') ? '#0055ff' : type.includes('yellow') ? '#ffee00' :
                  type.includes('white') ? '#ffffff' : type.includes('ir') ? '#cc44ff' : '#ff6600';
        _glow(el, on, c);
        return;
    }

    // ── RGB LED ───────────────────────────────────────────────────────────────
    if (type === 'rgb-led') {
        const gnd = canReach(`${id}.GND`, grounds);
        const r = canReach(`${id}.R`, sources) && gnd;
        const g = canReach(`${id}.G`, sources) && gnd;
        const b = canReach(`${id}.B`, sources) && gnd;
        const on = r || g || b;
        if (on) {
            poweredSet.add(id);
            const color = `rgb(${r?255:0},${g?255:0},${b?255:0})`;
            _glow(el, true, color);
        } else { _glow(el, false); }
        return;
    }

    // ── NeoPixel (ring / strip / matrix) ─────────────────────────────────────
    if (type === 'neopixel-ring' || type === 'neopixel-strip' || type === 'ws2812-matrix') {
        const on = (canReach(`${id}.VCC`, sources) || canReach(`${id}.5V`, sources))
                && canReach(`${id}.GND`, grounds)
                && (canReach(`${id}.DIN`, sources) || canReach(`${id}.DIN`, grounds)); // data connected
        if (on) {
            poweredSet.add(id);
            el.classList.add('sim-neopixel-on');
            el.style.filter = 'brightness(1.8)';
        } else {
            el.classList.remove('sim-neopixel-on');
            el.style.filter = '';
        }
        return;
    }

    // ── 7-Segment Display ─────────────────────────────────────────────────────
    if (type === '7seg-display' || type === 'display-7seg') {
        const on = canReach(`${id}.CC`, grounds) || canReach(`${id}.CA`, sources);
        if (on) {
            poweredSet.add(id);
            el.classList.add('sim-display-on');
            el.style.filter = 'brightness(1.5) drop-shadow(0 0 6px #ff4400)';
        } else {
            el.classList.remove('sim-display-on');
            el.style.filter = '';
        }
        return;
    }

    // ── TM1637 4-digit display ────────────────────────────────────────────────
    if (type === '4digit-7seg' || type === 'tm1637') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-display-on'); }
        else      el.classList.remove('sim-display-on');
        return;
    }

    // ── LED Matrix ────────────────────────────────────────────────────────────
    if (type === 'led-matrix-8x8' || type === 'max7219-matrix') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _glow(el, true, '#ff4400', 8); }
        else      _glow(el, false);
        return;
    }

    // ── LCD 16x2 / 20x4 ──────────────────────────────────────────────────────
    if (type === 'lcd-16x2' || type === 'lcd-20x4' || type === 'lcd-12864') {
        const on = (canReach(`${id}.VDD`, sources) || canReach(`${id}.A`, sources) || canReach(`${id}.VCC`, sources))
                && (canReach(`${id}.VSS`, grounds) || canReach(`${id}.K`, grounds) || canReach(`${id}.GND`, grounds));
        if (on) { poweredSet.add(id); el.classList.add('sim-display-on'); }
        else      el.classList.remove('sim-display-on');
        return;
    }

    // ── OLED ─────────────────────────────────────────────────────────────────
    if (type === 'oled-096' || type === 'oled-130' || type.includes('oled') || type.includes('ssd1306')) {
        const on = (canReach(`${id}.VCC`, sources) || canReach(`${id}.3V3`, sources))
                && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-display-on'); }
        else      el.classList.remove('sim-display-on');
        return;
    }

    // ── TFT Display ───────────────────────────────────────────────────────────
    if (type === 'tft-18' || type === 'tft-28' || type.includes('tft')) {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-display-on'); _glow(el, true, 'rgba(0,150,255,0.5)', 6); }
        else    { el.classList.remove('sim-display-on'); el.style.filter = ''; }
        return;
    }

    // ── e-Paper display ───────────────────────────────────────────────────────
    if (type === 'epaper') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-powered'); }
        return;
    }

    // ── DC Motors ─────────────────────────────────────────────────────────────
    if (type === 'dc-motor-3v' || type === 'dc-motor-6v' || type === 'dc-motor-12v' ||
        type === 'vibration-motor' || type === 'water-pump' || type.includes('dc-motor')) {
        const fwd = canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds);
        const rev = canReach(`${id}.-`, sources) && canReach(`${id}.+`, grounds);
        const pwm = Object.values(pwmValues||{}).reduce((m,v) => Math.max(m,v), 0);
        const dur = pwm > 0 ? `${0.4 / (pwm/255)}s` : '0.4s';
        if (fwd || rev) { poweredSet.add(id); _spin(el, true, fwd ? 'cw' : 'ccw', dur); }
        else              _spin(el, false);
        return;
    }

    // ── Fan ───────────────────────────────────────────────────────────────────
    if (type === 'fan-5v' || type.includes('fan')) {
        const on = (canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds)) ||
                   (canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds));
        if (on) { poweredSet.add(id); _spin(el, true, 'cw', '0.2s'); }
        else      _spin(el, false);
        return;
    }

    // ── Stepper Motor (28BYJ-48 + ULN2003) ───────────────────────────────────
    if (type === 'stepper-28byj48') {
        const on = canReach(`${id}.VCC`, sources) &&
            (canReach(`${id}.IN1`, sources) || canReach(`${id}.IN2`, sources) ||
             canReach(`${id}.IN3`, sources) || canReach(`${id}.IN4`, sources));
        if (on) { poweredSet.add(id); _spin(el, true, 'cw', '1.2s'); }
        else      _spin(el, false);
        return;
    }

    // ── Stepper NEMA17 ────────────────────────────────────────────────────────
    if (type === 'stepper-nema17') {
        const on = (canReach(`${id}.A+`, sources) && canReach(`${id}.A-`, grounds)) ||
                   (canReach(`${id}.B+`, sources) && canReach(`${id}.B-`, grounds));
        if (on) { poweredSet.add(id); _spin(el, true, 'cw', '0.8s'); }
        else      _spin(el, false);
        return;
    }

    // ── Linear Actuator / Solenoid ────────────────────────────────────────────
    if (type === 'linear-actuator' || type.includes('solenoid')) {
        const on = canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds);
        if (on) {
            poweredSet.add(id);
            el.classList.add('sim-powered');
            el.style.transform = `scale(${el.dataset.scale||1}) translateY(-4px)`;
        } else {
            el.style.transform = `scale(${el.dataset.scale||1})`;
            el.classList.remove('sim-powered');
        }
        return;
    }

    // ── Servo ─────────────────────────────────────────────────────────────────
    if (type === 'servo-sg90' || type === 'servo-mg996r' || type === 'mg90s' || type === 'sg90s-360') {
        const pwr = (canReach(`${id}.VCC`, sources) || canReach(`${id}.5V`, sources))
                 && canReach(`${id}.GND`, grounds);
        if (pwr) poweredSet.add(id);
        // Find the connected pin to get angle from servoAngles
        const sigPin = _connectedMCUPin(id, ['SIGNAL','SIG']);
        const angle  = (sigPin && servoAngles?.[sigPin] !== undefined) ? servoAngles[sigPin] : 90;
        const deg    = angle - 90;
        // Try to rotate an SVG arm or the whole component
        const arm = el.querySelector('.servo-arm, [class*="arm"], g:last-child');
        if (arm) { arm.style.transformOrigin = 'center'; arm.style.transform = `rotate(${deg}deg)`; }
        else { el.style.transform = `scale(${el.dataset.scale||1}) rotate(${deg * 0.3}deg)`; }
        _setStatus(el, pwr, 'rgba(251,191,36,0.4)');
        return;
    }

    // ── Active / Passive Buzzer ────────────────────────────────────────────────
    if (type === 'buzzer-active' || type === 'buzzer-passive' || type.includes('buzzer')) {
        const on = canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds);
        if (on) {
            poweredSet.add(id);
            el.classList.add('sim-buzzing');
            _playTone(id, type.includes('passive') ? 440 : 800);
        } else {
            el.classList.remove('sim-buzzing');
            _stopTone(id);
        }
        return;
    }

    // ── Speaker ────────────────────────────────────────────────────────────────
    if (type === 'speaker-8ohm') {
        const on = canReach(`${id}.+`, sources) && canReach(`${id}.-`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-buzzing'); _playTone(id, 440, 'sine'); }
        else    { el.classList.remove('sim-buzzing'); _stopTone(id); }
        return;
    }

    // ── Relay visual (logic handled in evaluateLogic) ─────────────────────────
    if (type.includes('relay')) {
        const on = poweredSet.has(id);
        if (on) el.classList.add('sim-relay-on'); else el.classList.remove('sim-relay-on');
        return;
    }

    // ── Sensors ───────────────────────────────────────────────────────────────
    // Ultrasonic
    if (type === 'hc-sr04') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) {
            poweredSet.add(id);
            _setStatus(el, true, 'rgba(56,189,248,0.5)');
            el.classList.add('sim-sonar');
        } else {
            _setStatus(el, false);
            el.classList.remove('sim-sonar');
        }
        return;
    }
    // DHT11 / DHT22
    if (type === 'dht11' || type === 'dht22' || type === 'dht-module') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(34,197,94,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // PIR sensor
    if (type === 'pir-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) {
            poweredSet.add(id);
            _setStatus(el, true, 'rgba(251,191,36,0.5)');
            el.classList.add('sim-pir-active');
        } else {
            _setStatus(el, false);
            el.classList.remove('sim-pir-active');
        }
        return;
    }
    // IR sensor / IR receiver / IR transmitter
    if (type === 'ir-sensor' || type === 'ir-receiver' || type === 'ir-transmitter') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(168,85,247,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // LDR
    if (type === 'ldr') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(250,204,21,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // Soil moisture
    if (type === 'soil-moisture') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(34,197,94,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Gas sensors (MQ-2, MQ-135, MQ-3, MQ-7, MQ-8)
    if (type.startsWith('mq') || type.includes('gas')) {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) {
            poweredSet.add(id);
            _setStatus(el, true, 'rgba(239,68,68,0.4)');
            el.classList.add('sim-gas-active');
        } else {
            _setStatus(el, false);
            el.classList.remove('sim-gas-active');
        }
        return;
    }
    // Water level
    if (type === 'water-level') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // Flame sensor
    if (type === 'flame-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(249,115,22,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // Sound sensor
    if (type === 'sound-sensor' || type === 'ky-038') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(139,92,246,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // MPU6050 / ADXL345 / MPU9250
    if (type === 'mpu6050' || type === 'adxl345' || type === 'mpu9250') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(99,102,241,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // BMP280 / BME280
    if (type === 'bmp280' || type === 'bme280') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(6,182,212,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // MAX30102 (pulse ox)
    if (type === 'max30102') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(239,68,68,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // DS18B20 / DS18B20-waterproof
    if (type === 'ds18b20' || type === 'ds18b20-waterproof') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(245,158,11,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Rotary encoder
    if (type === 'rotary-encoder') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(148,163,184,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Hall effect
    if (type === 'hall-effect') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Touch sensor
    if (type === 'touch-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(168,85,247,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Vibration sensor
    if (type === 'vibration-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(251,146,60,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // UV sensor
    if (type === 'uv-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(139,92,246,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // Fingerprint sensor
    if (type === 'fingerprint-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(59,130,246,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Flex / force / tilt sensor (pin1/pin2)
    if (type === 'flex-sensor' || type === 'force-sensor' || type === 'tilt-sensor') {
        const on = canReach(`${id}.pin1`, sources) || canReach(`${id}.pin2`, sources);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(148,163,184,0.3)'); }
        else      _setStatus(el, false);
        return;
    }
    // ACS712 (current sensor)
    if (type === 'acs712') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // HX711 (load cell amplifier)
    if (type === 'hx711') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(34,197,94,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Voltage sensor
    if (type === 'voltage-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(250,204,21,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // Rain sensor
    if (type === 'rain-sensor') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // TCS3200 color sensor
    if (type === 'tcs3200') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(139,92,246,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // MLX90614 IR thermometer
    if (type === 'mlx90614') {
        const on = canReach(`${id}.VIN`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(239,68,68,0.4)'); }
        else      _setStatus(el, false);
        return;
    }
    // VL53L0X (ToF distance)
    if (type === 'vl53l0x') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // BH1750 / TSL2561 (light sensor)
    if (type === 'bh1750' || type === 'tsl2561') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(250,204,21,0.5)'); }
        else      _setStatus(el, false);
        return;
    }
    // MAX6675 (thermocouple)
    if (type === 'max6675') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(245,158,11,0.4)'); }
        else      _setStatus(el, false);
        return;
    }

    // ── Communication modules ─────────────────────────────────────────────────
    if (type === 'bluetooth-hc05' || type === 'wifi-esp8266' || type === 'hc-12' ||
        type.includes('nrf24') || type.includes('cc2530') || type.includes('sim900') ||
        type === 'esp32-cam') {
        const on = (canReach(`${id}.VCC`, sources) || canReach(`${id}.3V3`, sources) || canReach(`${id}.5V`, sources))
                && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(56,189,248,0.4)'); }
        else      _setStatus(el, false);
        return;
    }

    // ── Power modules ─────────────────────────────────────────────────────────
    if (type === 'battery-9v' || type === 'battery-holder-2cell' || type.includes('solar')) {
        poweredSet.add(id);
        _setStatus(el, true, 'rgba(34,197,94,0.3)');
        return;
    }
    if (type === 'buck-converter' || type === 'boost-converter' || type === 'mt3608' ||
        type === 'xl4015' || type === 'lm2596' || type === 'tp4056' || type === 'ina219') {
        const on = (canReach(`${id}.IN+`, sources) || canReach(`${id}.VIN+`, sources))
                && (canReach(`${id}.IN-`, grounds)  || canReach(`${id}.VIN-`, grounds));
        if (on) {
            poweredSet.add(id);
            // Pass-through: output becomes source
            sources.push(`${id}.OUT+`, `${id}.VOUT+`);
            grounds.add(`${id}.OUT-`); grounds.add(`${id}.VOUT-`);
            _setStatus(el, true, 'rgba(34,197,94,0.4)');
        } else {
            _setStatus(el, false);
        }
        return;
    }

    // ── Passive components ────────────────────────────────────────────────────
    if (type.includes('resistor')) {
        // Pass-through (already in pinGraph), just dim when no current
        return;
    }
    if (type === 'diode') {
        // One-directional pass (simplified: always pass for simulation)
        return;
    }
    if (type === 'transistor') {
        // NPN: when base is HIGH, collector-emitter pass
        const base = canReach(`${id}.B`, sources) || canReach(`${id}.base`, sources);
        if (base) {
            sources.push(`${id}.C`);
            grounds.add(`${id}.E`);
        }
        return;
    }
    if (type === 'potentiometer') {
        // Always a valid analog input source
        if (canReach(`${id}.pin1`, sources) || canReach(`${id}.pin2`, sources) || canReach(`${id}.pin3`, sources)) {
            poweredSet.add(id);
        }
        return;
    }
    if (type.startsWith('cap-') || type.includes('capacitor') || type.includes('inductor')) {
        return; // passive, no visual change
    }

    // ── Joystick ──────────────────────────────────────────────────────────────
    if (type === 'joystick') {
        const on = canReach(`${id}.VCC`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(148,163,184,0.3)'); }
        else      _setStatus(el, false);
        return;
    }

    // ── Keypad ────────────────────────────────────────────────────────────────
    if (type.includes('keypad')) {
        const on = canReach(`${id}.R1`, sources) || canReach(`${id}.R2`, sources);
        if (on) { poweredSet.add(id); _setStatus(el, true, 'rgba(148,163,184,0.3)'); }
        return;
    }

    // ── Nextion display ───────────────────────────────────────────────────────
    if (type === 'nextion-24') {
        const on = canReach(`${id}.5V`, sources) && canReach(`${id}.GND`, grounds);
        if (on) { poweredSet.add(id); el.classList.add('sim-display-on'); }
        else      el.classList.remove('sim-display-on');
        return;
    }

    // ── Fallback: any component with VCC/GND that is powered ─────────────────
    const fallbackOn = _hasPower(id, sources, grounds);
    if (fallbackOn) {
        poweredSet.add(id);
        _setStatus(el, true, 'rgba(56,189,248,0.25)');
    } else {
        _setStatus(el, false);
    }
}

// ─── Helper: find which MCU pin connects to a given component's signal pin ────
function _connectedMCUPin(compId, pinNames) {
    const wires = window.wireObjects || [];
    for (const w of wires) {
        const fromId  = w.fromId  || w.pin1?.closest?.('.placed-component')?.dataset?.componentId;
        const toId    = w.toId    || w.pin2?.closest?.('.placed-component')?.dataset?.componentId;
        const fromPin = w.fromPin || w.pin1?.dataset?.pin || '';
        const toPin   = w.toPin   || w.pin2?.dataset?.pin || '';
        const match   = s => pinNames.some(p => s.toUpperCase().includes(p.toUpperCase()));
        if (fromId === compId && match(fromPin)) return toPin;
        if (toId   === compId && match(toPin))   return fromPin;
    }
    return null;
}
