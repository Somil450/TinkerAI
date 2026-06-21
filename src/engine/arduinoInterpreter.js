/**
 * TinkerAI Arduino C++ Interpreter — v2
 * Uses async/await so delay() actually PAUSES code like real hardware.
 * Supports ALL MCUs: Arduino Uno/Nano/Mega, ESP32, ESP8266, Pico, STM32, etc.
 */

export class ArduinoInterpreter {
    constructor() {
        this.pinModes    = {};
        this.pinValues   = {};   // pin -> 0 | 1
        this.pwmValues   = {};   // pin -> 0-255
        this.analogInputs= {};   // virtual sensor values (set by UI)
        this.servoAngles = {};   // pin -> 0-180
        this.isRunning   = false;
        this._loopAbort  = false;
        this.startTime   = 0;
        this.onSerial    = null;
        this.onPinChange = null; // (pin, value, mode) where mode = false|true|'servo'
        this._setupFn    = null;
        this._loopFn     = null;
        this._loopRunning= false;
    }

    // ─── Arduino Hardware API ──────────────────────────────────────────────────

    pinMode(pin, mode) {
        this.pinModes[this._pin(pin)] = mode;
    }

    digitalWrite(pin, value) {
        const p = this._pin(pin);
        const v = (value === 1 || value === true || value === 'HIGH' || value === 1) ? 1 : 0;
        this.pinValues[p] = v;
        this.onPinChange?.(p, v, false);
    }

    digitalRead(pin) {
        const p = this._pin(pin);
        if (this.analogInputs[p] !== undefined) return this.analogInputs[p] > 0 ? 1 : 0;
        return this.pinValues[p] || 0;
    }

    analogWrite(pin, value) {
        const p = this._pin(pin);
        const v = Math.max(0, Math.min(255, Math.round(value)));
        this.pwmValues[p] = v;
        this.pinValues[p] = v > 0 ? 1 : 0;
        this.onPinChange?.(p, v, true);
    }

    analogRead(pin) {
        const p = this._pin(pin);
        return this.analogInputs[p] !== undefined ? this.analogInputs[p] : 512;
    }

    tone(pin, freq, dur) {
        const p = this._pin(pin);
        this.pwmValues[p] = 128;
        this.pinValues[p] = 1;
        this._buzzerFreq = freq;
        this.onPinChange?.(p, 128, true);
        if (dur) setTimeout(() => this.noTone(pin), dur);
    }
    noTone(pin) {
        const p = this._pin(pin);
        this.pwmValues[p] = 0; this.pinValues[p] = 0; this._buzzerFreq = 0;
        this.onPinChange?.(p, 0, false);
    }

    millis()  { return Date.now() - this.startTime; }
    micros()  { return (Date.now() - this.startTime) * 1000; }

    // ── Pin name resolver ──────────────────────────────────────────────────────
    _pin(pin) {
        if (typeof pin === 'number') return `D${pin}`;
        const s = String(pin).trim();
        if (s === 'LED_BUILTIN' || s === 'BUILTIN_LED') return 'D13';
        if (/^[AD]\d+$/.test(s)) return s;
        if (/^GPIO(\d+)$/i.test(s)) return `D${s.match(/\d+/)[0]}`;
        if (/^GP(\d+)$/i.test(s)) return `D${s.match(/\d+/)[0]}`;
        return s;
    }

    // ── Serial ────────────────────────────────────────────────────────────────
    get Serial() {
        const self = this;
        return {
            begin: () => {},
            print:   (v) => { const t = String(v ?? '');   self.onSerial?.(t); },
            println: (v) => { const t = String(v ?? '') + '\n'; self.onSerial?.(t); },
            available: () => 0, read: () => -1,
            readString: () => '', readStringUntil: () => '',
            write: (v) => self.Serial.print(v), flush: () => {}
        };
    }
    get Serial1() { return this.Serial; }
    get Serial2() { return this.Serial; }

    // ── Library Factories ──────────────────────────────────────────────────────
    _makeServo() {
        const self = this;
        return {
            _pin: null, _angle: 90,
            attach(pin) { this._pin = self._pin(pin); self.servoAngles[this._pin] = 90; },
            write(a) {
                this._angle = Math.max(0, Math.min(180, a));
                if (this._pin) { self.servoAngles[this._pin] = this._angle; self.onPinChange?.(this._pin, this._angle, 'servo'); }
            },
            writeMicroseconds(us) { this.write((us - 544) / (2400 - 544) * 180); },
            read() { return this._angle; }, attached() { return !!this._pin; }, detach() { this._pin = null; }
        };
    }

    _makeLCD(cols = 16, rows = 2) {
        const self = this;
        const buf  = Array.from({length: rows}, () => Array(cols).fill(' '));
        let cr = 0, cc = 0;
        const flush = () => { if (window.simUpdateLCD) window.simUpdateLCD(buf.map(r => r.join('')).join('\n')); };
        return {
            begin() {},
            init() {},
            clear()   { buf.forEach(r => r.fill(' ')); cr = cc = 0; flush(); },
            home()    { cr = cc = 0; },
            setCursor(c, r) { cc = c; cr = r; },
            print(v) { for (const ch of String(v ?? '')) { if (cc < cols && cr < rows) buf[cr][cc++] = ch; } flush(); },
            println(v) { this.print(v); cr++; cc = 0; },
            backlight() {}, noBacklight() {}, display() {}, noDisplay() {},
            createChar() {}, scrollDisplayLeft() {}, scrollDisplayRight() {}
        };
    }

    _makeDHT() {
        return {
            begin() {},
            readTemperature(f = false) { const t = window.simSensorValues?.dhtTemp ?? 25; return f ? t*9/5+32 : t; },
            readHumidity()             { return window.simSensorValues?.dhtHumidity ?? 60; },
            read() { return true; },
            computeHeatIndex(t, h) { return t; },
            isnan: isNaN
        };
    }

    _makeOLED() {
        let textBuf = '';
        return {
            begin() {}, clearDisplay() { textBuf = ''; if (window.simUpdateOLED) window.simUpdateOLED(''); },
            display()       { if (window.simUpdateOLED) window.simUpdateOLED(textBuf); },
            setCursor(x,y)  {},
            setTextSize(s)  {},
            setTextColor()  {},
            print(v)   { textBuf += String(v ?? ''); },
            println(v) { textBuf += String(v ?? '') + '\n'; if (window.simUpdateOLED) window.simUpdateOLED(textBuf); },
            fillRect()  {}, drawRect()  {}, drawLine() {}, drawCircle() {}, fillCircle() {},
            drawPixel() {}, setFont() {},
            WHITE: 1, BLACK: 0, INVERSE: 2
        };
    }

    // ─── Code Transpiler ──────────────────────────────────────────────────────
    transpile(code) {
        let js = code;

        // Strip preprocessor
        js = js.replace(/^\s*#include\s*[<"][^>"]*[>"]\s*$/gm, '');
        js = js.replace(/^\s*#pragma\s.*$/gm, '');
        js = js.replace(/^\s*#ifndef\b.*$/gm, '').replace(/^\s*#endif\b.*$/gm, '');

        // #define constants → const
        js = js.replace(/^\s*#define\s+(\w+)\s+([^\n]+)$/gm, (_, n, v) => {
            v = v.trim();
            if (/^-?\d+(\.\d+)?$/.test(v)) return `const ${n} = ${v};`;
            if (/^".*"$/.test(v) || /^'.'$/.test(v)) return `const ${n} = ${v};`;
            return `const ${n} = ${v};`;
        });

        // C++ types → let  (must be longest-first)
        const TYPES = ['unsigned long long','unsigned long','unsigned int','unsigned char','unsigned short',
            'long long','uint64_t','uint32_t','uint16_t','uint8_t','int64_t','int32_t','int16_t','int8_t',
            'long','float','double','bool','boolean','char','byte','word','int',
            'const int','const long','const float','const bool','const unsigned long',
            'static int','static long','static float','static bool','static unsigned long',
            'volatile int','volatile bool','volatile unsigned long','volatile long',
            'String','string'].sort((a,b)=>b.length-a.length);
        const TP = TYPES.map(t => t.replace(/\s+/g,'\\s+')).join('|');

        // Variable declarations: type name = val; or type name;
        js = js.replace(new RegExp(`\\b(${TP})\\s+(\\w+)\\s*(\\[\\d*\\])?\\s*(?:=\\s*([^;{\\n]+?))?\\s*;`, 'g'),
            (_, type, name, arr, val) => {
                if (arr) return val ? `let ${name} = [${val}];` : `let ${name} = [];`;
                return val !== undefined ? `let ${name} = ${val.trim()};` : `let ${name};`;
            }
        );

        // for loop type declarations: for(int i = 0...) → for(let i = 0...)
        js = js.replace(/\bfor\s*\(\s*(?:unsigned\s+)?(?:int|long|uint\w+|byte|char|size_t)\s+(\w+)/g, 'for (let $1');

        // Function return types → function keyword (do NOT touch setup/loop)
        // First convert 'void funcName(' → 'async function funcName('
        js = js.replace(/\bvoid\s+(\w+)\s*\(/g, (_, name) => {
            if (name === 'setup' || name === 'loop') return `async function ${name}(`;
            return `async function ${name}(`;
        });
        // Other return types (also make them async so delay() works inside them)
        js = js.replace(/\b(?:int|float|double|bool|long|char|String|byte|unsigned\s+long)\s+(\w+)\s*\(/g, 'async function $1(');

        // Strip C++ types from function arguments: function foo(int a, float b) -> function foo(a, b)
        js = js.replace(/\b(?:async\s+)?function\s+\w+\s*\(([^)]*)\)/g, (match, args) => {
            const cleanArgs = args.replace(/\b(?:const\s+)?(?:unsigned\s+)?(?:int|float|double|long|bool|boolean|char|String|string|byte|word|uint\d+_t|int\d+_t)\s*(?:&\s*)?(\w+)(?:\s*\[\s*\])?/g, '$1');
            return match.replace(args, cleanArgs);
        });

        // Arduino constants
        js = js.replace(/\bHIGH\b/g, '1').replace(/\bLOW\b/g, '0');
        js = js.replace(/\bINPUT_PULLUP\b/g, '"INPUT_PULLUP"');
        js = js.replace(/\bINPUT\b/g, '"INPUT"').replace(/\bOUTPUT\b/g, '"OUTPUT"');
        js = js.replace(/\bNULL\b/g, 'null').replace(/\bTRUE\b/g, 'true').replace(/\bFALSE\b/g, 'false');
        js = js.replace(/\btrue\b/g, 'true').replace(/\bfalse\b/g, 'false');
        js = js.replace(/\bLED_BUILTIN\b/g, '13');

        // *** KEY FIX: delay() → await __sleep() ***
        js = js.replace(/\bdelay\s*\(/g, 'await __sleep(');
        js = js.replace(/\bdelayMicroseconds\s*\(/g, 'await __sleepUs(');
        js = js.replace(/\byield\s*\(\s*\)/g, 'await __sleep(0)');

        // Loop protection for JS Mode to prevent browser freeze
        js = js.replace(/\bwhile\s*\(\s*(1|true|TRUE)\s*\)\s*\{/gi, 'while(true) { await __sleep(1); ');
        js = js.replace(/\bwhile\s*\([^;{}]+\)\s*;/g, match => match.slice(0, -1) + ' { await __sleep(1); }');


        // C++ cast removal
        js = js.replace(/\(\s*(?:int|float|double|long|byte|uint8_t|uint16_t|uint32_t|char|bool)\s*\)\s*/g, '');

        // Library types → factory calls
        js = js.replace(/\bServo\s+(\w+)\s*;/g, 'let $1 = __newServo();');
        js = js.replace(/\bLiquidCrystal_I2C\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newLCD(16,2);');
        js = js.replace(/\bLiquidCrystal\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newLCD(16,2);');
        js = js.replace(/\bDHT\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newDHT();');
        js = js.replace(/\bAdafruit_SSD1306\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newOLED();');

        // Math/stdlib shims
        js = js.replace(/\babs\s*\(/g, 'Math.abs(');
        js = js.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
        js = js.replace(/\bpow\s*\(/g, 'Math.pow(');
        js = js.replace(/\bsin\s*\(/g, 'Math.sin(');
        js = js.replace(/\bcos\s*\(/g, 'Math.cos(');
        js = js.replace(/\btan\s*\(/g, 'Math.tan(');
        js = js.replace(/\bmap\s*\(/g, '__map(');
        js = js.replace(/\bconstrain\s*\(/g, '__constrain(');
        js = js.replace(/\brandom\s*\(/g, '__random(');
        js = js.replace(/\brandomSeed\s*\([^)]*\)/g, '/* randomSeed */');

        // Bit ops
        js = js.replace(/\bbitRead\s*\(([^,]+),([^)]+)\)/g, '(($1 >> $2) & 1)');
        js = js.replace(/\bbitSet\s*\(([^,]+),([^)]+)\)/g, '($1 |= (1 << $2))');
        js = js.replace(/\bbitClear\s*\(([^,]+),([^)]+)\)/g, '($1 &= ~(1 << $2))');

        // String method stubs
        js = js.replace(/\.toInt\(\)/g, ' | 0');
        js = js.replace(/\.toFloat\(\)/g, ' * 1.0');

        // Stub headers
        js = js.replace(/\bWire\b\./g, '__Wire.');
        js = js.replace(/\bSPI\b\./g, '__SPI.');

        return js;
    }

    // ─── Main Runner ──────────────────────────────────────────────────────────
    async run(code) {
        this.stop();
        this.isRunning   = true;
        this._loopAbort  = false;
        this.startTime   = Date.now();
        this.pinValues   = {};
        this.pwmValues   = {};
        this.servoAngles = {};

        const transpiled = this.transpile(code);
        console.log('[Interpreter] First 600 chars of transpiled code:\n', transpiled.slice(0, 600));

        const self = this;

        // Build sandbox object
        const sandbox = {
            // Core API
            pinMode:     (p,m)   => self.pinMode(p,m),
            digitalWrite:(p,v)   => self.digitalWrite(p,v),
            digitalRead: (p)     => self.digitalRead(p),
            analogWrite: (p,v)   => self.analogWrite(p,v),
            analogRead:  (p)     => self.analogRead(p),
            tone:        (p,f,d) => self.tone(p,f,d),
            noTone:      (p)     => self.noTone(p),
            millis:      ()      => self.millis(),
            micros:      ()      => self.micros(),
            // *** async sleep — the key to proper delay() ***
            __sleep:   (ms) => new Promise(r => setTimeout(r, Math.max(0, ms))),
            __sleepUs: (us) => new Promise(r => setTimeout(r, Math.max(0, us / 1000))),
            // Serial
            Serial:  self.Serial,
            Serial1: self.Serial,
            Serial2: self.Serial,
            // Library factories
            __newServo: () => self._makeServo(),
            __newLCD:   (c,r) => self._makeLCD(c,r),
            __newDHT:   () => self._makeDHT(),
            __newOLED:  () => self._makeOLED(),
            // Stdlib
            __map:       (v,a,b,c,d) => (v-a)*(d-c)/(b-a)+c,
            __constrain: (v,lo,hi)   => Math.min(hi, Math.max(lo, v)),
            __random:    (a,b)       => b === undefined ? Math.floor(Math.random()*a) : Math.floor(Math.random()*(b-a))+a,
            // Stubs
            __Wire: { begin(){}, beginTransmission(){}, write(){}, endTransmission(){}, requestFrom(){return 0;}, read(){return 0;}, available(){return 0;} },
            __SPI:  { begin(){}, transfer(v){return v;}, end(){} },
            // Constants
            Math, console, parseInt, parseFloat, isNaN, isFinite,
            String: (v) => String(v),
            PI: Math.PI, TWO_PI: Math.PI*2, HALF_PI: Math.PI/0.5,
            DEG_TO_RAD: Math.PI/180, RAD_TO_DEG: 180/Math.PI,
            // no-ops
            randomSeed: () => {},
            attachInterrupt: () => {}, detachInterrupt: () => {},
            interrupts: () => {}, noInterrupts: () => {},
            F: (s) => s,
            PROGMEM: 0
        };

        const keys   = Object.keys(sandbox);
        const values = Object.values(sandbox);

        try {
            // Use Function() constructor so sandbox keys become named parameters
            // This is the ONLY reliable way to inject a sandbox in strict module context
            const fnBody = `
"use strict";
return (async function() {
${transpiled}
return {
    setup: typeof setup === 'function' ? setup : null,
    loop:  typeof loop  === 'function' ? loop  : null
};
})();
`;
            // Create function with sandbox keys as parameters
            const AsyncFn = Object.getPrototypeOf(async function(){}).constructor;
            const fn = new AsyncFn(...keys, fnBody);
            const result = await fn(...values);

            this._setupFn = result?.setup;
            this._loopFn  = result?.loop;

            if (!this._setupFn && !this._loopFn) {
                this.onSerial?.(`[Warning] No setup() or loop() function found. Check your code.\n`);
            }
        } catch(e) {
            console.error('[Interpreter] compilation error:', e);
            this.onSerial?.(`\n⚠️ Code Error: ${e.message}\nLine hint: Check for unsupported C++ syntax.\n`);
            this.isRunning = false;
            return;
        }


        // Run setup()
        if (this._setupFn) {
            try { await this._setupFn(); }
            catch(e) { this.onSerial?.(`[Error in setup()] ${e.message}\n`); }
        }

        // Run loop() continuously
        this._runLoop();
    }

    async _runLoop() {
        if (this._loopRunning) return;
        this._loopRunning = true;
        while (this.isRunning && !this._loopAbort) {
            if (this._loopFn) {
                try { await this._loopFn(); }
                catch(e) {
                    if (e.message?.includes('stop')) break;
                    this.onSerial?.(`[Error in loop()] ${e.message}\n`);
                    break;
                }
            } else {
                await new Promise(r => setTimeout(r, 100));
            }
            // Small yield to keep browser responsive
            await new Promise(r => setTimeout(r, 1));
        }
        this._loopRunning = false;
    }

    stop() {
        this.isRunning   = false;
        this._loopAbort  = true;
        this._loopRunning= false;
        this.pinValues   = {};
        this.pwmValues   = {};
        this.servoAngles = {};
        this.onPinChange?.('*', 0, false);
    }

    setSensorValue(pin, value)   { this.analogInputs[this._pin(pin)] = value; }
    setDigitalInput(pin, value)  { this.analogInputs[this._pin(pin)] = value ? 1 : 0; }
}

export const arduinoInterpreter = new ArduinoInterpreter();
