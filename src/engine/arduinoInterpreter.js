/**
 * TinkerAI Arduino C++ Interpreter — v3
 * Comprehensive support for ALL common Arduino functions, libraries and components.
 * Supports: Uno, Nano, Mega, ESP32, ESP8266, Pico, STM32
 */

export class ArduinoInterpreter {
    constructor() {
        this.pinModes    = {};
        this.pinValues   = {};      // pin → 0 | 1
        this.pwmValues   = {};      // pin → 0-255
        this.analogInputs= {};      // virtual sensor values (set by UI sliders)
        this.servoAngles = {};      // pin → 0-180
        this.isRunning   = false;
        this._loopAbort  = false;
        this.startTime   = 0;
        this.onSerial    = null;
        this.onPinChange = null;    // (pin, value, mode)
        this._setupFn    = null;
        this._loopFn     = null;
        this._loopRunning= false;
        this._eeprom     = new Uint8Array(1024).fill(0xFF);
        this._interrupts = {};
        this._steppers   = [];
        this._buzzerFreq = 0;
        this._tonePin    = null;
    }

    // ─── Core Digital/Analog API ──────────────────────────────────────────────

    pinMode(pin, mode) { this.pinModes[this._pin(pin)] = mode; }

    digitalWrite(pin, value) {
        const p = this._pin(pin);
        const v = (value === 1 || value === true || value === 'HIGH') ? 1 : 0;
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
        if (this.analogInputs[p] !== undefined) return Math.round(this.analogInputs[p]);
        return 512;
    }

    analogReadMilliVolts(pin) { return Math.round(this.analogRead(pin) * 3300 / 4095); }
    analogReference() {}

    // ─── Timing ───────────────────────────────────────────────────────────────

    millis()  { return Date.now() - this.startTime; }
    micros()  { return (Date.now() - this.startTime) * 1000; }

    // ─── Tone / Buzzer ────────────────────────────────────────────────────────

    tone(pin, freq, dur) {
        const p = this._pin(pin);
        this._tonePin = p;
        this._buzzerFreq = freq || 440;
        this.pwmValues[p] = 128;
        this.pinValues[p] = 1;
        this.onPinChange?.(p, 128, true);
        if (dur) setTimeout(() => this.noTone(pin), dur);
    }

    noTone(pin) {
        const p = this._pin(pin);
        this._buzzerFreq = 0;
        this._tonePin = null;
        this.pwmValues[p] = 0;
        this.pinValues[p] = 0;
        this.onPinChange?.(p, 0, false);
    }

    // ─── Pulse ────────────────────────────────────────────────────────────────

    pulseIn(pin, state, timeout = 1000000) {
        const p = this._pin(pin);
        // cm → µs: duration = cm * 58.2 so that distance = duration/58.2 gives exact cm
        const cmToUs = (cm) => Math.round(parseFloat(cm) * 58.2);

        // P1: explicit per-pin analog override
        if (this.analogInputs[p] !== undefined) return cmToUs(this.analogInputs[p]);

        const sv = window.simSensorValues || {};

        // P2: well-known 'distance' key (set at slider init + every move)
        if (sv.distance !== undefined && !isNaN(parseFloat(sv.distance))) {
            return cmToUs(sv.distance);
        }

        // P3: any key starting with 'distance' (e.g. distance_hc-sr04_1)
        for (const k of Object.keys(sv)) {
            if (k.startsWith('distance') && !isNaN(parseFloat(sv[k]))) {
                return cmToUs(sv[k]);
            }
        }

        // P4: any ultrasonic / hc-sr04 key
        for (const k of Object.keys(sv)) {
            if ((k.includes('ultrasonic') || k.includes('hcsr')) && !isNaN(parseFloat(sv[k]))) {
                return cmToUs(sv[k]);
            }
        }

        return cmToUs(100); // default 100 cm
    }

    pulseInLong(pin, state, timeout) { return this.pulseIn(pin, state, timeout); }

    // ─── Shift ────────────────────────────────────────────────────────────────

    shiftOut(dataPin, clockPin, bitOrder, value) {
        for (let i = 0; i < 8; i++) {
            const bit = bitOrder === 'MSBFIRST' ? (value >> (7 - i)) & 1 : (value >> i) & 1;
            this.digitalWrite(dataPin, bit);
            this.digitalWrite(clockPin, 1);
            this.digitalWrite(clockPin, 0);
        }
    }

    shiftIn(dataPin, clockPin, bitOrder) {
        let val = 0;
        for (let i = 0; i < 8; i++) {
            this.digitalWrite(clockPin, 1);
            const bit = this.digitalRead(dataPin);
            if (bitOrder === 'LSBFIRST') val |= bit << i;
            else val |= bit << (7 - i);
            this.digitalWrite(clockPin, 0);
        }
        return val;
    }

    // ─── Interrupts ───────────────────────────────────────────────────────────

    attachInterrupt(intNum, fn, mode) { this._interrupts[intNum] = fn; }
    detachInterrupt(intNum)           { delete this._interrupts[intNum]; }
    interrupts()   {}
    noInterrupts() {}

    // ─── Pin name resolver ────────────────────────────────────────────────────

    _pin(pin) {
        if (typeof pin === 'number') return `D${pin}`;
        const s = String(pin).trim();
        if (s === 'LED_BUILTIN' || s === 'BUILTIN_LED') return 'D13';
        if (/^[AD]\d+$/.test(s)) return s;
        if (/^GPIO(\d+)$/i.test(s)) return `D${s.match(/\d+/)[0]}`;
        if (/^GP(\d+)$/i.test(s))   return `D${s.match(/\d+/)[0]}`;
        if (/^\d+$/.test(s))        return `D${s}`;
        return s;
    }

    // ─── Serial ───────────────────────────────────────────────────────────────

    get Serial() {
        const self = this;
        return {
            begin: (baud) => {},
            end:   () => {},
            print:   (v, fmt) => {
                let t = '';
                if (fmt === 2 || fmt === 'BIN') t = (v >>> 0).toString(2);
                else if (fmt === 8 || fmt === 'OCT') t = (v >>> 0).toString(8);
                else if (fmt === 16 || fmt === 'HEX') t = (v >>> 0).toString(16).toUpperCase();
                else t = String(v ?? '');
                self.onSerial?.(t);
            },
            println: function(v, fmt) { this.print(v, fmt); self.onSerial?.('\n'); },
            available:      () => 0,
            read:           () => -1,
            readString:     () => '',
            readStringUntil:() => '',
            readLine:       () => '',
            parseInt:       () => 0,
            parseFloat:     () => 0.0,
            write:  (v) => { self.onSerial?.(typeof v === 'number' ? String.fromCharCode(v) : String(v)); },
            flush:  () => {},
            peek:   () => -1,
            setTimeout: () => {},
            find:   () => false,
        };
    }
    get Serial1() { return this.Serial; }
    get Serial2() { return this.Serial; }
    get Serial3() { return this.Serial; }

    // ─── Servo ────────────────────────────────────────────────────────────────

    _makeServo() {
        const self = this;
        return {
            _pin: null, _angle: 90,
            attach(pin, min, max) {
                this._pin = self._pin(pin);
                self.servoAngles[this._pin] = this._angle;
                self.onPinChange?.(this._pin, this._angle, 'servo');
            },
            write(a) {
                this._angle = Math.max(0, Math.min(180, Math.round(a)));
                if (this._pin) {
                    self.servoAngles[this._pin] = this._angle;
                    self.onPinChange?.(this._pin, this._angle, 'servo');
                }
            },
            writeMicroseconds(us) { this.write(Math.round((us - 544) / (2400 - 544) * 180)); },
            read()     { return this._angle; },
            readMicroseconds() { return Math.round(this._angle / 180 * (2400 - 544) + 544); },
            attached() { return !!this._pin; },
            detach()   { this._pin = null; }
        };
    }

    // ─── Stepper ──────────────────────────────────────────────────────────────

    _makeStepper(steps, ...pins) {
        const self = this;
        let currentPos = 0;
        return {
            _speed: 60,
            setSpeed(rpm) { this._speed = rpm; },
            step(n) {
                currentPos += n;
                pins.forEach((p, i) => {
                    const on = (Math.abs(n) > 0) ? 1 : 0;
                    self.digitalWrite(p, on);
                });
            },
            version() { return 5; }
        };
    }

    // ─── LCD ──────────────────────────────────────────────────────────────────

    _makeLCD(cols = 16, rows = 2) {
        const self = this;
        const buf  = Array.from({length: rows}, () => Array(cols).fill(' '));
        let cr = 0, cc = 0;
        const flush = () => { if (window.simUpdateLCD) window.simUpdateLCD(buf.map(r => r.join('')).join('\n')); };
        return {
            begin() {}, init() {},
            clear()   { buf.forEach(r => r.fill(' ')); cr = cc = 0; flush(); },
            home()    { cr = cc = 0; },
            setCursor(col, row) { cc = Math.max(0, col); cr = Math.max(0, row); },
            print(v)   { for (const ch of String(v ?? '')) { if (cc < cols && cr < rows) buf[cr][cc++] = ch; } flush(); },
            println(v) { this.print(v); cr++; cc = 0; flush(); },
            write(ch)  { this.print(typeof ch === 'number' ? String.fromCharCode(ch) : ch); },
            backlight() {}, noBacklight() {},
            display() {}, noDisplay() {},
            cursor() {}, noCursor() {},
            blink() {}, noBlink() {},
            leftToRight() {}, rightToLeft() {},
            autoscroll() {}, noAutoscroll() {},
            createChar(n, arr) {},
            scrollDisplayLeft() {}, scrollDisplayRight() {}
        };
    }

    // ─── DHT Temperature Sensor ───────────────────────────────────────────────

    _makeDHT(pin, type) {
        return {
            begin() {},
            readTemperature(f = false, force = false) {
                const t = window.simSensorValues?.dhtTemp ?? 25;
                return f ? +(t * 9/5 + 32).toFixed(1) : +t.toFixed(1);
            },
            readHumidity(force = false) { return +(window.simSensorValues?.dhtHumidity ?? 60).toFixed(1); },
            computeHeatIndex(t, h, isFahr = false) { return t; },
            read() { return true; },
            isnan: isNaN
        };
    }

    // ─── OLED SSD1306 ─────────────────────────────────────────────────────────

    _makeOLED(w = 128, h = 64, wire, addr) {
        let textBuf = '';
        return {
            begin(vcc, addr) { return true; },
            clearDisplay() { textBuf = ''; if (window.simUpdateOLED) window.simUpdateOLED(''); },
            display()      { if (window.simUpdateOLED) window.simUpdateOLED(textBuf); },
            setCursor(x, y) {},
            setTextSize(s)  {},
            setTextColor(c, bg) {},
            print(v)   { textBuf += String(v ?? ''); },
            println(v) { textBuf += String(v ?? '') + '\n'; if (window.simUpdateOLED) window.simUpdateOLED(textBuf); },
            write(c)   { this.print(typeof c === 'number' ? String.fromCharCode(c) : c); },
            drawBitmap() {}, drawPixel() {}, drawLine() {},
            drawRect() {}, fillRect(x,y,w,h,c) {},
            drawCircle() {}, fillCircle() {},
            drawRoundRect() {}, fillRoundRect() {},
            drawTriangle() {}, fillTriangle() {},
            getTextBounds() {},
            setFont() {}, cp437() {},
            fillScreen(c) { if (c === 0) this.clearDisplay(); },
            WHITE: 1, BLACK: 0, INVERSE: 2,
            SSD1306_WHITE: 1, SSD1306_BLACK: 0
        };
    }

    // ─── NewPing / HC-SR04 ────────────────────────────────────────────────────

    _makeNewPing(trigPin, echoPin, maxDist = 200) {
        const self = this;
        const tp = self._pin(trigPin), ep = self._pin(echoPin);
        return {
            ping()        { return self.pulseIn(ep, 1) * 2; },
            ping_cm()     { return self.analogInputs[ep] ?? self.analogInputs[tp] ?? (window.simSensorValues?.distance ?? 25); },
            ping_in()     { return this.ping_cm() / 2.54; },
            ping_median(n){ return this.ping_cm(); },
            convert_cm(t) { return t / 58.0; },
            convert_in(t) { return t / 148.0; },
            ping_timer(fn){ fn && fn(); },
            check_timer()  { return false; }
        };
    }

    // ─── MPU6050 / IMU ────────────────────────────────────────────────────────

    _makeMPU6050() {
        return {
            begin() { return true; },
            getMotionSensorEvent() {},
            getAccelerometerSensor() { return this; },
            getGyroSensor()         { return this; },
            getTemperatureSensor()  { return this; },
            getEvent(e) {
                if (e) {
                    e.acceleration = { x: 0.1, y: 0.1, z: 9.8 };
                    e.gyro         = { x: 0, y: 0, z: 0 };
                    e.temperature  = window.simSensorValues?.temp ?? 25;
                }
                return true;
            },
            setAccelerometerRange() {},
            setGyroRange() {},
            setFilterBandwidth() {},
            getAcceleration(x, y, z) {},
            getRotation(x, y, z) {},
            getTemperature() { return (window.simSensorValues?.temp ?? 25) * 340 + 36530; },
            dmpInitialize() { return 0; },
            dmpGetCurrentFIFOPacket() { return false; },
            setDMPEnabled() {}
        };
    }

    // ─── HX711 Load Cell ──────────────────────────────────────────────────────

    _makeHX711() {
        return {
            begin() {}, setScale(s) {}, tare(n) {},
            get_units(n = 1)    { return window.simSensorValues?.weight ?? 0; },
            get_value(n = 1)    { return (window.simSensorValues?.weight ?? 0) * 100; },
            is_ready()          { return true; },
            wait_ready(d)       {},
            read()              { return (window.simSensorValues?.weight ?? 0) * 100; },
            power_down()        {}, power_up() {}
        };
    }

    // ─── EEPROM ───────────────────────────────────────────────────────────────

    get EEPROM() {
        const mem = this._eeprom;
        return {
            read(addr)         { return mem[addr & 0x3FF] ?? 0xFF; },
            write(addr, val)   { mem[addr & 0x3FF] = val & 0xFF; },
            update(addr, val)  { mem[addr & 0x3FF] = val & 0xFF; },
            get(addr, v)       { return mem[addr & 0x3FF]; },
            put(addr, v)       {},
            length()           { return 1024; },
            begin(size)        {},
            commit()           { return true; },
            end()              {}
        };
    }

    // ─── Wire (I2C) ───────────────────────────────────────────────────────────

    get Wire() {
        const self = this;
        let _buf = [];
        return {
            begin(addr)          {},
            beginTransmission(a) {},
            endTransmission(s)   { return 0; },
            requestFrom(a, n)    { return n; },
            write(v)             { _buf.push(v); return 1; },
            read()               { return _buf.shift() ?? 0; },
            available()          { return _buf.length; },
            onReceive(fn)        {},
            onRequest(fn)        {},
            setClock(hz)         {},
            setWireTimeout()     {}
        };
    }

    // ─── SPI ─────────────────────────────────────────────────────────────────

    get SPI() {
        return {
            begin() {}, end() {},
            beginTransaction() {}, endTransaction() {},
            transfer(v)  { return v; },
            transfer16(v){ return v; },
            setBitOrder() {}, setClockDivider() {}, setDataMode() {}
        };
    }

    // ─── WiFi (ESP32/ESP8266 stub) ────────────────────────────────────────────

    get WiFi() {
        return {
            begin(ssid, pass)  {},
            status()           { return 3; },
            localIP()          { return { toString: () => '192.168.1.100' }; },
            SSID()             { return 'SimulatedWiFi'; },
            RSSI()             { return -65; },
            disconnect() {}, mode() {}, softAP() {},
            macAddress()       { return 'AA:BB:CC:DD:EE:FF'; }
        };
    }

    // ─── RTClib ───────────────────────────────────────────────────────────────

    _makeRTC() {
        return {
            begin() { return true; },
            isrunning() { return true; },
            adjust() {},
            now() {
                const d = new Date();
                return {
                    year: () => d.getFullYear(), month: () => d.getMonth() + 1, day: () => d.getDate(),
                    hour: () => d.getHours(), minute: () => d.getMinutes(), second: () => d.getSeconds(),
                    dayOfTheWeek: () => d.getDay(),
                    unixtime: () => Math.floor(d.getTime() / 1000)
                };
            }
        };
    }


    transpile(code) {
        let js = code;

        // ── Step 0: Remove line comments to prevent regex interference ──────────
        // Keep them for error reporting by blanking, not removing
        js = js.replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length)); // blank out // comments
        js = js.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')); // blank /* */ keeping newlines

        // ── Step 1: Strip preprocessor directives ─────────────────────────────
        js = js.replace(/^\s*#include\s*[<"][^>"]*[>"]\s*$/gm, '');
        js = js.replace(/^\s*#pragma\s.*$/gm, '');
        js = js.replace(/^\s*#ifndef\b.*$/gm, '').replace(/^\s*#endif\b.*$/gm, '');
        js = js.replace(/^\s*#ifdef\b.*$/gm, '').replace(/^\s*#undef\b.*$/gm, '');
        js = js.replace(/^\s*#else\b.*$/gm, '');

        // ── Step 2: Collect and substitute #define constants ─────────────────
        // Key fix: we actually substitute the defined values in the code
        // so `#define trigPin 9` makes all uses of `trigPin` → `9` inline
        const defines = {};
        js = js.replace(/^\s*#define\s+(\w+)\s+([^\n]+)$/gm, (_, name, val) => {
            val = val.trim();
            // Only substitute simple literals (numbers, strings) to avoid recursion
            if (/^-?\d+(\.\d+)?([ULFulf]*)$/.test(val) || /^"[^"]*"$/.test(val) || /^'[^']'$/.test(val)) {
                // Strip C++ numeric suffixes for the substitution value
                const cleanVal = val.replace(/[ULFulf]+$/, '');
                defines[name] = cleanVal;
                return `const ${name} = ${cleanVal};`;
            }
            return `const ${name} = ${val};`;
        });

        // Substitute #define values in the code (only simple ones)
        // This prevents the variable declaration regex from creating `let 9 = ...`
        for (const [name, val] of Object.entries(defines)) {
            // Only replace when it's NOT on the left side of a declaration
            // i.e., not when preceded by a type keyword
            const safeRe = new RegExp(`(?<!const\\s+)(?<!let\\s+)(?<!var\\s+)\\b${name}\\b`, 'g');
            js = js.replace(safeRe, val);
        }

        // ── Step 3: Fix C++ integer/float suffixes ────────────────────────────
        // e.g., 9600UL → 9600, 1000L → 1000, 3.14f → 3.14
        js = js.replace(/\b(\d+(?:\.\d+)?)[ULFulf]+\b/g, '$1');

        // ── Step 4: Fix C++ octal literals (leading zero) in strict mode ──────
        // 0755 in C++ = octal, invalid in JS strict mode → convert to decimal
        js = js.replace(/\b0([0-7]+)\b/g, (m, digits) => {
            // Make sure it's not 0 alone, not 0x hex, not 0b binary
            if (digits.match(/^[0-7]+$/)) return parseInt(digits, 8).toString();
            return m;
        });

        // ── Step 5: C++ types → JS let ───────────────────────────────────────
        const TYPES = [
            'unsigned long long','unsigned long','unsigned int','unsigned char','unsigned short',
            'long long','uint64_t','uint32_t','uint16_t','uint8_t','int64_t','int32_t','int16_t','int8_t',
            'long','float','double','bool','boolean','char','byte','word','int','size_t',
            'const int','const long','const float','const double','const bool','const unsigned long','const char',
            'static int','static long','static float','static bool','static unsigned long',
            'volatile int','volatile bool','volatile unsigned long','volatile long',
            'String','string'
        ].sort((a, b) => b.length - a.length);
        const TP = TYPES.map(t => t.replace(/\s+/g, '\\s+')).join('|');

        // Variable declarations — only match valid JS identifier names (must start with letter/_)
        js = js.replace(
            new RegExp(`\\b(${TP})\\s+([a-zA-Z_]\\w*)\\s*(\\[\\d*\\])?\\s*(?:=\\s*([^;{\\n]+?))?\\s*;`, 'g'),
            (_, type, name, arr, val) => {
                if (arr) return val ? `let ${name} = [${val.trim()}];` : `let ${name} = [];`;
                return val !== undefined ? `let ${name} = ${val.trim()};` : `let ${name};`;
            }
        );

        // ── Step 6: for-loop declarations ────────────────────────────────────
        js = js.replace(/\bfor\s*\(\s*(?:unsigned\s+)?(?:int|long|uint\w+|byte|char|size_t)\s+([a-zA-Z_]\w*)/g, 'for (let $1');

        // ── Step 7: Function return types → async function ───────────────────
        // void first
        js = js.replace(/\bvoid\s+([a-zA-Z_]\w*)\s*\(/g, 'async function $1(');
        // other return types — only if followed by identifier + (
        js = js.replace(
            /\b(?:int|float|double|bool|long|char|String|byte|unsigned\s+long)\s+([a-zA-Z_]\w*)\s*\(/g,
            'async function $1('
        );

        // ── Step 8: Strip C++ types from function arguments ──────────────────
        js = js.replace(/\b(?:async\s+)?function\s+\w+\s*\(([^)]*)\)/g, (match, args) => {
            const clean = args.replace(
                /\b(?:const\s+)?(?:unsigned\s+)?(?:int|float|double|long|bool|boolean|char|String|string|byte|word|uint\d+_t|int\d+_t)\s*(?:&\s*)?([a-zA-Z_]\w*)(?:\s*\[\s*\])?/g,
                '$1'
            );
            return match.replace(args, clean);
        });

        // ── Step 9: Arduino constants ─────────────────────────────────────────
        js = js.replace(/\bHIGH\b/g, '1').replace(/\bLOW\b/g, '0');
        js = js.replace(/\bINPUT_PULLUP\b/g, '"INPUT_PULLUP"');
        js = js.replace(/\bINPUT\b/g, '"INPUT"').replace(/\bOUTPUT\b/g, '"OUTPUT"');
        js = js.replace(/\bNULL\b/g, 'null').replace(/\bTRUE\b/g, 'true').replace(/\bFALSE\b/g, 'false');
        js = js.replace(/\bLED_BUILTIN\b/g, '13');
        js = js.replace(/\bMSBFIRST\b/g, '"MSBFIRST"').replace(/\bLSBFIRST\b/g, '"LSBFIRST"');
        js = js.replace(/\bCHANGE\b/g, '"CHANGE"').replace(/\bFALLING\b/g, '"FALLING"').replace(/\bRISING\b/g, '"RISING"');
        js = js.replace(/\bDEC\b/g, '10').replace(/\bHEX\b/g, '16').replace(/\bOCT\b/g, '8').replace(/\bBIN\b/g, '2');

        // ── Step 10: delay → await ───────────────────────────────────────────
        js = js.replace(/\bdelay\s*\(/g, 'await __sleep(');
        js = js.replace(/\bdelayMicroseconds\s*\(/g, 'await __sleepUs(');
        js = js.replace(/\byield\s*\(\s*\)/g, 'await __sleep(0)');
        js = js.replace(/\bvTaskDelay\s*\(/g, 'await __sleep(');
        js = js.replace(/\besp_delay\s*\(/g, 'await __sleep(');

        // ── Step 11: Infinite loop protection ───────────────────────────────
        js = js.replace(/\bwhile\s*\(\s*(1|true|TRUE)\s*\)\s*\{/gi, 'while(true) { await __sleep(1); ');
        js = js.replace(/\bfor\s*\(\s*;\s*;\s*\)\s*\{/g, 'for(;;) { await __sleep(1); ');

        // ── Step 12: C++ cast removal ────────────────────────────────────────
        js = js.replace(/\(\s*(?:int|float|double|long|byte|uint8_t|uint16_t|uint32_t|char|bool)\s*\)\s*/g, '');

        // ── Step 13: Math / string helpers ──────────────────────────────────
        js = js.replace(/\babs\s*\(/g, 'Math.abs(');
        js = js.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
        js = js.replace(/\bpow\s*\(/g, 'Math.pow(');
        js = js.replace(/\bsin\s*\(/g, 'Math.sin(');
        js = js.replace(/\bcos\s*\(/g, 'Math.cos(');
        js = js.replace(/\btan\s*\(/g, 'Math.tan(');
        js = js.replace(/\batan2\s*\(/g, 'Math.atan2(');
        js = js.replace(/\batan\s*\(/g, 'Math.atan(');
        js = js.replace(/\basin\s*\(/g, 'Math.asin(');
        js = js.replace(/\bacos\s*\(/g, 'Math.acos(');
        js = js.replace(/\bfloor\s*\(/g, 'Math.floor(');
        js = js.replace(/\bceil\s*\(/g, 'Math.ceil(');
        js = js.replace(/\bround\s*\(/g, 'Math.round(');
        js = js.replace(/\bfabs\s*\(/g, 'Math.abs(');
        js = js.replace(/\bfmod\s*\(/g, '__fmod(');
        js = js.replace(/\bmap\s*\(/g, '__map(');
        js = js.replace(/\bconstrain\s*\(/g, '__constrain(');
        js = js.replace(/\brandom\s*\(/g, '__random(');
        js = js.replace(/\brandomSeed\s*\([^)]*\)/g, '/* randomSeed */');
        js = js.replace(/\bbitRead\s*\(([^,]+),([^)]+)\)/g, '(($1 >> $2) & 1)');
        js = js.replace(/\bbitSet\s*\(([^,]+),([^)]+)\)/g, '($1 |= (1 << $2))');
        js = js.replace(/\bbitClear\s*\(([^,]+),([^)]+)\)/g, '($1 &= ~(1 << $2))');
        js = js.replace(/\bbitWrite\s*\(([^,]+),([^,]+),([^)]+)\)/g, '($3 ? ($1 |= (1 << $2)) : ($1 &= ~(1 << $2)))');
        js = js.replace(/\bbit\s*\(([^)]+)\)/g, '(1 << ($1))');
        js = js.replace(/\bhighByte\s*\(([^)]+)\)/g, '(($1 >> 8) & 0xFF)');
        js = js.replace(/\blowByte\s*\(([^)]+)\)/g, '(($1) & 0xFF)');
        js = js.replace(/\bword\s*\(([^,)]+),([^)]+)\)/g, '(($1 << 8) | $2)');
        js = js.replace(/\.toInt\(\)/g, ' | 0');
        js = js.replace(/\.toFloat\(\)/g, ' * 1.0');
        js = js.replace(/\.c_str\(\)/g, '');
        js = js.replace(/\bString\s*\(/g, 'String(');
        js = js.replace(/\bstrcpy\s*\(([^,]+),([^)]+)\)/g, '($1 = $2)');
        js = js.replace(/\bstrlen\s*\(/g, '__strlen(');
        js = js.replace(/\bsprintf\s*\(/g, '__sprintf(');
        js = js.replace(/\bsnprintf\s*\(/g, '__snprintf(');
        js = js.replace(/\bdtostrf\s*\(([^,]+),([^,]+),([^,]+),([^)]+)\)/g, '(__dtostrf($1,$2,$3,$4))');
        js = js.replace(/\batoi\s*\(/g, 'parseInt(');
        js = js.replace(/\batof\s*\(/g, 'parseFloat(');

        // Library constructors
        js = js.replace(/\bServo\s+(\w+)\s*;/g, 'let $1 = __newServo();');
        js = js.replace(/\bLiquidCrystal_I2C\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newLCD(16,2);');
        js = js.replace(/\bLiquidCrystal\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newLCD(16,2);');
        js = js.replace(/\bDHT\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newDHT();');
        js = js.replace(/\bAdafruit_SSD1306\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newOLED();');
        js = js.replace(/\bAdafruit_GFX\s+(\w+)\s*\([^)]+\)\s*;/g, 'let $1 = __newOLED();');
        js = js.replace(/\bNewPing\s+(\w+)\s*\(([^)]+)\)\s*;/g, (_, name, args) => `let ${name} = __newPing(${args});`);
        js = js.replace(/\bStepper\s+(\w+)\s*\(([^)]+)\)\s*;/g, (_, name, args) => `let ${name} = __newStepper(${args});`);
        js = js.replace(/\bMPU6050\s+(\w+)\s*(?:\([^)]*\))?\s*;/g, 'let $1 = __newMPU6050();');
        js = js.replace(/\bHX711\s+(\w+)\s*;/g, 'let $1 = __newHX711();');
        js = js.replace(/\bRTC_DS3231\s+(\w+)\s*;/g, 'let $1 = __newRTC();');
        js = js.replace(/\bRTC_DS1307\s+(\w+)\s*;/g, 'let $1 = __newRTC();');

        // Wire/SPI stubs
        js = js.replace(/\bWire\b\./g, '__Wire.');
        js = js.replace(/\bSPI\b\./g, '__SPI.');
        js = js.replace(/\bWiFi\b\./g, '__WiFi.');
        js = js.replace(/\bEEPROM\b\./g, '__EEPROM.');

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
        console.log('[Interpreter v3] transpiled (first 800 chars):\n', transpiled.slice(0, 800));

        const self = this;

        const sandbox = {
            // Core
            pinMode:          (p, m)    => self.pinMode(p, m),
            digitalWrite:     (p, v)    => self.digitalWrite(p, v),
            digitalRead:      (p)       => self.digitalRead(p),
            analogWrite:      (p, v)    => self.analogWrite(p, v),
            analogRead:       (p)       => self.analogRead(p),
            analogReadMilliVolts: (p)   => self.analogReadMilliVolts(p),
            analogReference:  ()        => {},
            tone:             (p, f, d) => self.tone(p, f, d),
            noTone:           (p)       => self.noTone(p),
            pulseIn:          (p, s, t) => self.pulseIn(p, s, t),
            pulseInLong:      (p, s, t) => self.pulseIn(p, s, t),
            shiftOut:         (d, c, o, v) => self.shiftOut(d, c, o, v),
            shiftIn:          (d, c, o)    => self.shiftIn(d, c, o),
            millis:           ()        => self.millis(),
            micros:           ()        => self.micros(),
            __sleep:   (ms) => new Promise(r => setTimeout(r, Math.max(0, ms))),
            __sleepUs: (us) => new Promise(r => setTimeout(r, Math.max(0, us / 1000))),
            // Serial
            Serial:   self.Serial,
            Serial1:  self.Serial,
            Serial2:  self.Serial,
            Serial3:  self.Serial,
            // Library factories
            __newServo:    ()           => self._makeServo(),
            __newLCD:      (c, r)       => self._makeLCD(c, r),
            __newDHT:      (p, t)       => self._makeDHT(p, t),
            __newOLED:     (w, h, wire, addr) => self._makeOLED(w, h, wire, addr),
            __newPing:     (t, e, m)    => self._makeNewPing(t, e, m),
            __newStepper:  (steps, ...pins) => self._makeStepper(steps, ...pins),
            __newMPU6050:  ()           => self._makeMPU6050(),
            __newHX711:    ()           => self._makeHX711(),
            __newRTC:      ()           => self._makeRTC(),
            // Hardware stubs
            __Wire:   self.Wire,
            __SPI:    self.SPI,
            __WiFi:   self.WiFi,
            __EEPROM: self.EEPROM,
            // Stdlib
            __map:       (v, a, b, c, d) => (v - a) * (d - c) / (b - a) + c,
            __constrain: (v, lo, hi)     => Math.min(hi, Math.max(lo, v)),
            __random:    (a, b)          => b === undefined ? Math.floor(Math.random() * a) : Math.floor(Math.random() * (b - a)) + a,
            __fmod:      (a, b)          => a % b,
            __strlen:    (s)             => String(s ?? '').length,
            __sprintf:   (buf, fmt, ...args) => { /* simplified no-op */ return fmt; },
            __snprintf:  (buf, n, fmt, ...args) => { return fmt; },
            __dtostrf:   (val, width, prec, buf) => val.toFixed(prec),
            // Interrupts
            attachInterrupt: (n, fn, m) => self.attachInterrupt(n, fn, m),
            detachInterrupt: (n)        => self.detachInterrupt(n),
            interrupts:   () => {},
            noInterrupts: () => {},
            digitalPinToInterrupt: (p) => p,
            // Math & constants
            Math, console, parseInt, parseFloat, isNaN, isFinite,
            String: (v) => String(v),
            PI: Math.PI, TWO_PI: Math.PI * 2, HALF_PI: Math.PI / 2,
            DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI,
            LSBFIRST: 'LSBFIRST', MSBFIRST: 'MSBFIRST',
            INPUT: 'INPUT', OUTPUT: 'OUTPUT', INPUT_PULLUP: 'INPUT_PULLUP',
            HIGH: 1, LOW: 0,
            // No-ops
            randomSeed: () => {},
            F: (s) => s,
            PROGMEM: 0,
            pgm_read_byte: (p) => p,
            pgm_read_word: (p) => p,
        };

        const keys   = Object.keys(sandbox);
        const values = Object.values(sandbox);

        try {
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
            const AsyncFn = Object.getPrototypeOf(async function(){}).constructor;
            const fn      = new AsyncFn(...keys, fnBody);
            const result  = await fn(...values);

            this._setupFn = result?.setup;
            this._loopFn  = result?.loop;

            if (!this._setupFn && !this._loopFn) {
                this.onSerial?.(`[Warning] No setup() or loop() found. Check your code.\n`);
            }
        } catch(e) {
            console.error('[Interpreter] compile error:', e);
            this.onSerial?.(`\n⚠️ Code Error: ${e.message}\nCheck for unsupported C++ syntax.\n`);
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
                    if (this._loopAbort || e.message?.includes('stop')) break;
                    this.onSerial?.(`[Error in loop()] ${e.message}\n`);
                    // Don't break — keep running for recoverable errors
                    await new Promise(r => setTimeout(r, 200));
                }
            } else {
                await new Promise(r => setTimeout(r, 100));
            }
            await new Promise(r => setTimeout(r, 1)); // yield to browser
        }
        this._loopRunning = false;
    }

    stop() {
        this.isRunning    = false;
        this._loopAbort   = true;
        this._loopRunning = false;
        this.pinValues    = {};
        this.pwmValues    = {};
        this.servoAngles  = {};
        this._buzzerFreq  = 0;
        this._tonePin     = null;
        this.onPinChange?.('*', 0, false);
    }

    setSensorValue(pin, value)  { this.analogInputs[this._pin(pin)] = value; }
    setDigitalInput(pin, value) { this.analogInputs[this._pin(pin)] = value ? 1 : 0; }
}

export const arduinoInterpreter = new ArduinoInterpreter();
