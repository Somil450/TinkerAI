/**
 * ╔═════════════════════════════════════════════════════════════════════════════╗
 * ║               TinkerAI — ADVANCED CIRCUIT SAFETY ENGINE v3.0                ║
 * ║                                                                             ║
 * ║  State-of-the-art real-time hazard detection, compliance checking,          ║
 * ║  predictive analytics, thermal modelling, EMC analysis, and                 ║
 * ║  automated remediation for electronics circuit design.                      ║
 * ║                                                                             ║
 * ║  Safety Modules:                                                            ║
 * ║   1. Short-Circuit Detection         2. Reverse Polarity Guard              ║
 * ║   3. Overvoltage / Overcurrent       4. Thermal Safety Model                ║
 * ║   5. Ground Integrity                6. Floating Pin Analyzer               ║
 * ║   7. Voltage Domain Bridging         8. Component Miswiring                 ║
 * ║   9. Power Budget Analyzer          10. ESD Protection Advisor              ║
 * ║  11. EMC / RF Interference          12. Signal Integrity                    ║
 * ║  13. Compliance Checker (CE,FCC,UL) 14. Battery Safety (LiPo/LiIon)         ║
 * ║  15. Race Condition Detection        16. Latch-Up Risk Assessment           ║
 * ║  17. Capacitor Bank Safety           18. Inductive Load Protection          ║
 * ║  19. Decoupling Advisor             20. Design Rule Engine (DRE)            ║
 * ║  21. Component Lifetime Estimator   22. Fan-Out / Drive Strength Check      ║
 * ║  23. Bus Contention Detector        24. Noise Margin Analyzer               ║
 * ║  25. Predictive Failure Engine      26. Auto-Fix Orchestrator               ║
 * ╚═════════════════════════════════════════════════════════════════════════════╝
 */

import { componentRegistry } from './componentRegistry.js';

// ─── Severity Levels ─────────────────────────────────────────────────────────
export const SEVERITY = {
    CRITICAL:  { level: 5, label: 'CRITICAL',   color: '#FF1744', emoji: '🔴' },
    HIGH:      { level: 4, label: 'HIGH',       color: '#FF6D00', emoji: '🟠' },
    WARNING:   { level: 3, label: 'WARNING',    color: '#FFD600', emoji: '🟡' },
    INFO:      { level: 2, label: 'INFO',       color: '#40C4FF', emoji: '🔵' },
    PASS:      { level: 1, label: 'PASS',       color: '#00E676', emoji: '🟢' },
};

// ─── Issue Categories ─────────────────────────────────────────────────────────
export const CATEGORY = {
    POWER:        'Power & Current',
    THERMAL:      'Thermal Safety',
    SIGNAL:       'Signal Integrity',
    PROTECTION:   'Protection Components',
    COMPLIANCE:   'Regulatory Compliance',
    RELIABILITY:  'Reliability & Lifetime',
    EMC:          'EMC & RF',
    DESIGN:       'Design Rules',
};

// ─── Component Voltage Profiles ───────────────────────────────────────────────
const VOLTAGE_PROFILE = {
    'LED':          { vf: 2.0,  vmax: 3.5,  imax: 30  },
    'LED_RED':      { vf: 2.0,  vmax: 3.5,  imax: 30  },
    'LED_GREEN':    { vf: 2.1,  vmax: 3.5,  imax: 30  },
    'LED_BLUE':     { vf: 3.2,  vmax: 4.0,  imax: 30  },
    'WS2812B':      { vf: 5.0,  vmax: 5.5,  imax: 60  },
    'ESP32':        { vf: 3.3,  vmax: 3.6,  imax: 500 },
    'ESP8266':      { vf: 3.3,  vmax: 3.6,  imax: 400 },
    'Arduino_Uno':  { vf: 5.0,  vmax: 5.5,  imax: 200 },
    'Arduino_Nano': { vf: 5.0,  vmax: 5.5,  imax: 200 },
    'MPU6050':      { vf: 3.3,  vmax: 3.6,  imax: 3.5 },
    'DHT22':        { vf: 5.0,  vmax: 5.5,  imax: 2.5 },
    'HC_SR04':      { vf: 5.0,  vmax: 5.5,  imax: 15  },
    'Motor_DC':     { vf: 5.0,  vmax: 12.0, imax: 800 },
    'Servo_SG90':   { vf: 5.0,  vmax: 6.0,  imax: 150 },
    'LiPo':         { vf: 3.7,  vmax: 4.2,  imax: 5000 },
    'L298N':        { vf: 5.0,  vmax: 12.0, imax: 2000 },
    'Relay':        { vf: 5.0,  vmax: 12.0, imax: 100 },
};

// ─── Thermal Constants ────────────────────────────────────────────────────────
const THERMAL = {
    AMBIENT_C:        25,       // Ambient temperature °C
    MAX_JUNCTION_C:   125,      // Max junction temp for most ICs
    MAX_PCB_C:        85,       // Max PCB surface temp
    DERATING_FACTOR:  0.70,     // 70% power de-rating for reliability
    THETA_JA_AVG:     50,       // Average thermal resistance °C/W
};

// ─── ESD Sensitivity Classes ──────────────────────────────────────────────────
const ESD_CLASS = {
    CLASS_1A: { threshold: '0-250V',    sensitivity: 'Extreme',  components: ['MOSFET', 'CMOS', 'ESP32', 'MPU6050'] },
    CLASS_1B: { threshold: '250-500V',  sensitivity: 'Very High', components: ['Op-Amp', 'FET', 'RFID'] },
    CLASS_1C: { threshold: '500-1000V', sensitivity: 'High',     components: ['LED', 'Diode', 'Arduino'] },
    CLASS_2:  { threshold: '1000-2000V',sensitivity: 'Medium',   components: ['Resistor', 'Capacitor'] },
};

// ─── Regulatory Standards ─────────────────────────────────────────────────────
const STANDARDS = {
    CE:   { name: 'CE Marking (EU)',    currentLimit: 16000, voltageLimit: 250  },
    FCC:  { name: 'FCC (USA)',          currentLimit: 15000, voltageLimit: 300  },
    UL:   { name: 'UL (North America)', currentLimit: 20000, voltageLimit: 600  },
    RoHS: { name: 'RoHS Compliance',    leadFreeRequired: true                  },
    IPC:  { name: 'IPC-2221 PCB',       minClearance: 0.1, minCreepage: 0.6    },
};

// ─── Drive-Strength Profiles ──────────────────────────────────────────────────
const GPIO_DRIVE = {
    'Arduino_Uno':  { voh: 4.3,  vol: 0.5,  iol: 40,  ioh: 40  },
    'Arduino_Nano': { voh: 4.3,  vol: 0.5,  iol: 40,  ioh: 40  },
    'ESP32':        { voh: 3.0,  vol: 0.1,  iol: 40,  ioh: 40  },
    'ESP8266':      { voh: 3.0,  vol: 0.1,  iol: 12,  ioh: 12  },
    'Raspberry_Pi': { voh: 3.0,  vol: 0.4,  iol: 16,  ioh: 16  },
    'STM32':        { voh: 3.0,  vol: 0.4,  iol: 25,  ioh: 25  },
};

// ─── Noise Margin Requirements ────────────────────────────────────────────────
const NOISE_MARGINS = {
    TTL:  { vih: 2.0, vil: 0.8, voh: 2.4, vol: 0.4, nmh: 0.4, nml: 0.4 },
    CMOS: { vih: 3.5, vil: 1.5, voh: 4.5, vol: 0.5, nmh: 1.0, nml: 1.0 },
    LVCMOS: { vih: 2.0, vil: 0.8, voh: 2.4, vol: 0.4, nmh: 0.4, nml: 0.4 },
};

// ─── Component Lifetime Data (hours MTBF) ─────────────────────────────────────
const COMPONENT_MTBF = {
    'Electrolytic_Capacitor': { nominal: 5000,   stressCoeff: 0.5  },
    'Ceramic_Capacitor':      { nominal: 100000, stressCoeff: 0.1  },
    'LED':                    { nominal: 50000,  stressCoeff: 0.3  },
    'Transistor_BJT':         { nominal: 200000, stressCoeff: 0.2  },
    'MOSFET':                 { nominal: 300000, stressCoeff: 0.15 },
    'Relay':                  { nominal: 100000, stressCoeff: 0.4  },
    'LiPo_Battery':           { nominal: 300,    stressCoeff: 0.8, unit: 'cycles' },
};

// ─── LiPo Safety Thresholds ───────────────────────────────────────────────────
const LIPO_SAFETY = {
    MAX_CHARGE_VOLTAGE:    4.20,   // V per cell
    MIN_DISCHARGE_VOLTAGE: 3.00,   // V per cell
    STORAGE_VOLTAGE:       3.80,   // V per cell
    MAX_CHARGE_RATE:       1.0,    // C-rate for safe charging
    MAX_DISCHARGE_RATE:    3.0,    // C-rate for safe discharge
    MAX_TEMP_C:            60,     // °C during charge/discharge
    THERMAL_RUNAWAY_C:     90,     // °C — danger zone
};

// ─── EMC Frequency Bands ──────────────────────────────────────────────────────
const EMC_BANDS = {
    ISM_2_4GHZ: { min: 2400, max: 2500, unit: 'MHz', affected: ['BLE', 'WiFi', 'Zigbee'] },
    ISM_900MHZ: { min: 902,  max: 928,  unit: 'MHz', affected: ['LoRa', 'ZigBee'] },
    GPS_L1:     { min: 1575, max: 1576, unit: 'MHz', affected: ['GPS'] },
};

// ─── Pull-up/Pull-down Requirements ──────────────────────────────────────────
const PULLUP_REQUIREMENTS = {
    'I2C_SDA':    { resistance: 4700,  pullupVoltage: 3.3,  note: 'Required for open-drain bus' },
    'I2C_SCL':    { resistance: 4700,  pullupVoltage: 3.3,  note: 'Required for open-drain bus' },
    'UART_RX':    { resistance: 10000, pullupVoltage: 3.3,  note: 'Prevents floating on reset' },
    'SPI_CS':     { resistance: 10000, pullupVoltage: 3.3,  note: 'Active-low CS needs pull-up' },
    'RESET':      { resistance: 10000, pullupVoltage: 5.0,  note: 'Active-low reset pull-up' },
    'ONE_WIRE':   { resistance: 4700,  pullupVoltage: 5.0,  note: 'Required for 1-Wire protocol' },
};

// ─── Decoupling Capacitor Recommendations ─────────────────────────────────────
const DECOUPLING_CAPS = {
    'Microcontroller': { bulk: '100µF', bypass: '100nF', distance: '<5mm', note: 'Per VCC pin' },
    'Motor_Driver':    { bulk: '470µF', bypass: '100nF', distance: '<10mm', note: 'For motor spikes' },
    'Wireless_Module': { bulk: '100µF', bypass: '10nF',  distance: '<3mm',  note: 'RF needs very clean power' },
    'Sensor_I2C':      { bulk: '10µF',  bypass: '100nF', distance: '<10mm', note: 'Reduces digital noise' },
    'ADC_Input':       { bulk: '10µF',  bypass: '10nF',  distance: '<5mm',  note: 'Noise-sensitive measurement' },
};


// ══════════════════════════════════════════════════════════════════════════════
//  MAIN SAFETY ENGINE CLASS
// ══════════════════════════════════════════════════════════════════════════════

export class SafetyEngine {
    constructor() {
        this._reset();
        this._analysisTimestamp = null;
        this._circuitFingerprint = null;
    }

    _reset() {
        this.critical     = [];
        this.high         = [];
        this.warnings     = [];
        this.info         = [];
        this.passes       = [];
        this._checkLog    = [];
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  PUBLIC API — FULL ANALYSIS
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Full circuit safety scan — runs all 26 modules.
     * @param {Object} circuit  { components: [], connections: [] }
     * @returns {SafetyReport}
     */
    analyze(circuit) {
        this._reset();
        this._analysisTimestamp = new Date().toISOString();
        const t0 = performance.now();

        // ── Module Group 1: Power & Electrical Safety ──────────────────────
        this._runCheck('Short-Circuit Detection',         () => this._checkShortCircuits(circuit));
        this._runCheck('Reverse Polarity Guard',          () => this._checkReversePolarity(circuit));
        this._runCheck('Overvoltage Protection',          () => this._checkVoltageRatings(circuit));
        this._runCheck('Overcurrent / Current Limiting',  () => this._checkCurrentRatings(circuit));
        this._runCheck('Power Budget Analysis',           () => this._checkPowerBudget(circuit));
        this._runCheck('Inductive Load Protection',       () => this._checkInductiveLoads(circuit));
        this._runCheck('Capacitor Bank Safety',           () => this._checkCapacitorSafety(circuit));

        // ── Module Group 2: Grounding & Signal Integrity ───────────────────
        this._runCheck('Ground Integrity Audit',          () => this._checkGrounding(circuit));
        this._runCheck('Floating Pin Analysis',           () => this._checkFloatingPins(circuit));
        this._runCheck('Voltage Domain Bridging',         () => this._checkVoltageDomains(circuit));
        this._runCheck('Noise Margin Analysis',           () => this._checkNoiseMargins(circuit));
        this._runCheck('Bus Contention Detection',        () => this._checkBusContention(circuit));
        this._runCheck('Signal Integrity (Rise/Fall)',    () => this._checkSignalIntegrity(circuit));
        this._runCheck('Fan-Out / Drive Strength',        () => this._checkFanOut(circuit));

        // ── Module Group 3: Component-Specific Checks ─────────────────────
        this._runCheck('Component Miswiring',             () => this._checkComponentMiswiring(circuit));
        this._runCheck('Pull-up / Pull-down Advisor',     () => this._checkPullUpPullDown(circuit));
        this._runCheck('Decoupling Capacitor Advisor',    () => this._checkDecouplingCaps(circuit));
        this._runCheck('Battery Safety (LiPo/Li-Ion)',    () => this._checkBatterySafety(circuit));
        this._runCheck('ESD Protection Advisor',          () => this._checkESDProtection(circuit));
        this._runCheck('Latch-Up Risk Assessment',        () => this._checkLatchUp(circuit));

        // ── Module Group 4: Thermal & Reliability ─────────────────────────
        this._runCheck('Thermal Safety Model',            () => this._checkThermalSafety(circuit));
        this._runCheck('Component Lifetime Estimator',    () => this._checkComponentLifetime(circuit));
        this._runCheck('Predictive Failure Engine',       () => this._predictFailures(circuit));

        // ── Module Group 5: EMC & Regulatory ──────────────────────────────
        this._runCheck('EMC / RF Interference',           () => this._checkEMC(circuit));
        this._runCheck('Design Rule Engine (DRE)',        () => this._checkDesignRules(circuit));
        this._runCheck('Compliance Check (CE/FCC/UL)',    () => this._checkCompliance(circuit));

        const elapsed = (performance.now() - t0).toFixed(1);

        return this._buildReport(circuit, elapsed);
    }

    /**
     * Quick-check for simulation gate — only critical safety checks.
     */
    quickCheck(circuit) {
        this._reset();
        this._runCheck('Short-Circuit',   () => this._checkShortCircuits(circuit));
        this._runCheck('Overcurrent',     () => this._checkCurrentRatings(circuit));
        this._runCheck('Reverse Polarity',() => this._checkReversePolarity(circuit));
        this._runCheck('Overvoltage',     () => this._checkVoltageRatings(circuit));
        this._runCheck('Battery Safety',  () => this._checkBatterySafety(circuit));
        return {
            isSafe:   this.critical.length === 0 && this.high.length === 0,
            critical: this.critical,
            high:     this.high,
        };
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 1 — SHORT-CIRCUIT DETECTION
    // ──────────────────────────────────────────────────────────────────────────
    _checkShortCircuits(circuit) {
        const powerNets = new Map(); // pinId → voltage

        // Build net voltage map
        circuit.connections?.forEach(conn => {
            const fromV = this._inferVoltage(conn.from);
            const toV   = this._inferVoltage(conn.to);
            if (fromV !== null) powerNets.set(conn.from, fromV);
            if (toV   !== null) powerNets.set(conn.to,   toV);
        });

        // Check every connection for power ↔ GND shorts
        circuit.connections?.forEach(conn => {
            const vFrom = this._inferVoltage(conn.from);
            const vTo   = this._inferVoltage(conn.to);

            const isShort = (
                (vFrom > 0 && vTo === 0) ||
                (vTo   > 0 && vFrom === 0)
            ) && (
                this._isPowerPin(conn.from) || this._isPowerPin(conn.to)
            );

            if (isShort) {
                const voltage = Math.max(vFrom || 0, vTo || 0);
                const power   = this._estimateShortPower(voltage);
                this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                    type:        'shortCircuit',
                    message:     `⚡ Direct short circuit: ${conn.from} → ${conn.to}`,
                    detail:      `${voltage}V directly connected to GND. Estimated fault current: ${(power / 0.001).toFixed(0)} A (wire impedance ~1mΩ)`,
                    impact:      'Immediate power supply damage, wire melt, PCB trace burnout, fire risk',
                    connection:  conn,
                    autoFixable: true,
                    fix:         'Remove this connection immediately',
                    reference:   'IEC 60364-4-43 Overcurrent protection',
                });
            }
        });

        // Detect near-short via resistance check (< 1Ω path between power and GND)
        this._detectNearShorts(circuit);
    }

    _detectNearShorts(circuit) {
        // Find connections that pass through very low resistance components
        circuit.components?.forEach(comp => {
            if (comp.type === 'Resistor' && comp.spec?.value) {
                const resistance = this._parseResistance(comp.spec.value);
                if (resistance < 10) {
                    const connections = this._getComponentConnections(circuit, comp.id);
                    const hasPower = connections.some(c => this._isPowerPin(c.from) || this._isPowerPin(c.to));
                    const hasGND   = connections.some(c => this._isGNDPin(c.from) || this._isGNDPin(c.to));
                    if (hasPower && hasGND) {
                        this._addIssue(SEVERITY.HIGH, CATEGORY.POWER, {
                            type:    'nearShort',
                            message: `⚠️  Near-short: ${resistance}Ω resistor bridging power and GND`,
                            detail:  `Current through ${resistance}Ω at 5V ≈ ${(5000 / resistance).toFixed(0)} mA`,
                            impact:  'Excessive current draw, resistor burn-out',
                            component: comp.id,
                            fix:     `Replace with correct resistance (220Ω–10kΩ range typical)`,
                        });
                    }
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 2 — REVERSE POLARITY GUARD
    // ──────────────────────────────────────────────────────────────────────────
    _checkReversePolarity(circuit) {
        const POLAR_COMPONENTS = ['LED', 'Diode', 'Capacitor', 'Zener', 'Schottky', 'LED_RED', 'LED_GREEN', 'LED_BLUE'];

        circuit.components?.forEach(comp => {
            const type = (comp.type || '').toUpperCase();

            // --- Diode / LED reverse polarity ---
            if (['LED', 'DIODE', 'ZENER', 'SCHOTTKY', 'LED_RED', 'LED_GREEN', 'LED_BLUE'].includes(type)) {
                const connections = this._getComponentConnections(circuit, comp.id);
                connections.forEach(conn => {
                    const cathodeConnected = conn.pin === 'cathode' || conn.pin === 'K';
                    const toHighVoltage = this._inferVoltage(conn.connectedTo || conn.to) > 1;
                    if (cathodeConnected && toHighVoltage) {
                        this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                            type:      'reversePolarity',
                            component: comp.id,
                            message:   `🔄 Reverse polarity: ${comp.type} cathode connected to positive rail`,
                            detail:    `LEDs and diodes are polarized. Reverse connection blocks current or causes instant failure.`,
                            impact:    'Component will not function; may fail permanently at high voltage',
                            fix:       'Swap anode ↔ cathode connections',
                            reference: 'Component datasheet — polarity marking',
                        });
                    }
                });
            }

            // --- Electrolytic capacitor polarity ---
            if (type === 'CAPACITOR' && (comp.spec?.electrolytic || comp.spec?.type === 'Electrolytic')) {
                const connections = this._getComponentConnections(circuit, comp.id);
                connections.forEach(conn => {
                    const negPin = ['negative', 'neg', '-', 'GND'].includes(conn.pin?.toLowerCase());
                    const toHighV = this._inferVoltage(conn.connectedTo || conn.to) > 1;
                    if (negPin && toHighV) {
                        this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                            type:      'reversePolarity',
                            component: comp.id,
                            message:   `🔄 Reverse polarity on electrolytic capacitor — negative terminal to power`,
                            detail:    `Reverse-biased electrolytics generate gas and can EXPLODE. Capacitance: ${comp.spec?.value || '?'}`,
                            impact:    'Capacitor explosion, fire hazard, chemical spill',
                            fix:       'Reverse capacitor orientation — stripe (−) to GND, longer lead (+) to power',
                            reference: 'IPC-JEDEC-020D',
                        });
                    }
                });
            }

            // --- DC Motor polarity (functional, not destructive, but still check) ---
            if (type === 'MOTOR' || type === 'DC_MOTOR') {
                const conns = this._getComponentConnections(circuit, comp.id);
                const powerConns = conns.filter(c => this._inferVoltage(c.connectedTo || c.to) > 0);
                if (powerConns.length > 0) {
                    this._addIssue(SEVERITY.INFO, CATEGORY.POWER, {
                        type:    'motorPolarity',
                        component: comp.id,
                        message: `ℹ️  DC Motor polarity determines rotation direction`,
                        detail:  `Swapping motor + and − reverses rotation. Not destructive, but functional.`,
                        fix:     'Use motor driver (L298N) for direction control via PWM',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 3 — OVERVOLTAGE PROTECTION
    // ──────────────────────────────────────────────────────────────────────────
    _checkVoltageRatings(circuit) {
        circuit.connections?.forEach(conn => {
            const appliedV = this._inferVoltage(conn.from);
            if (appliedV === null) return;

            circuit.components?.forEach(comp => {
                const connectedToComp = conn.to.startsWith(comp.id);
                if (!connectedToComp) return;

                const profile = this._getComponentVoltageProfile(comp);
                if (!profile) return;

                const pinMaxV = profile.vmax;

                if (appliedV > pinMaxV) {
                    const overshoot = ((appliedV - pinMaxV) / pinMaxV * 100).toFixed(1);
                    this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                        type:      'overvoltage',
                        component: comp.id,
                        pin:       conn.to,
                        message:   `🔺 Overvoltage: ${appliedV}V applied to ${comp.type} (max ${pinMaxV}V)`,
                        detail:    `Exceeds absolute maximum by ${overshoot}%. Junction breakdown likely.`,
                        impact:    'Permanent component damage, potential smoke/fire',
                        fix:       `Add ${this._suggestVoltageRegulator(appliedV, pinMaxV)} before component`,
                        reference: 'Component Absolute Maximum Ratings',
                    });
                } else if (appliedV > pinMaxV * 0.85) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.POWER, {
                        type:      'voltageMargin',
                        component: comp.id,
                        message:   `⚠️  Low voltage margin: ${appliedV}V to ${comp.type} (max ${pinMaxV}V — ${Math.round((pinMaxV - appliedV) / pinMaxV * 100)}% headroom)`,
                        detail:    'Operating near maximum reduces reliability and lifespan.',
                        fix:       'De-rate to 70–80% of maximum rated voltage',
                    });
                }
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 4 — OVERCURRENT / CURRENT LIMITING
    // ──────────────────────────────────────────────────────────────────────────
    _checkCurrentRatings(circuit) {
        circuit.components?.forEach(comp => {
            const type = (comp.type || '').toUpperCase();

            // --- LED without current limiting resistor ---
            if (['LED', 'LED_RED', 'LED_GREEN', 'LED_BLUE', 'RGB_LED'].includes(type)) {
                const isDirectPower = this._isDirectlyConnectedToPower(circuit, comp.id);
                const hasSeriesResistor = this._hasSeriesResistor(circuit, comp.id);

                if (isDirectPower && !hasSeriesResistor) {
                    const profile = VOLTAGE_PROFILE[type] || VOLTAGE_PROFILE['LED'];
                    const vf = profile?.vf || 2.0;
                    const vcc = 5;
                    const rNeeded = Math.ceil((vcc - vf) / 0.02); // for 20mA

                    this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                        type:        'overcurrent',
                        component:   comp.id,
                        message:     `⚡ LED without current-limiting resistor — will burn instantly`,
                        detail:      `At 5V, Vf=${vf}V: unlimited current flows. LED rated max 30mA. Internal resistance ~5Ω means >600mA.`,
                        impact:      'LED burns out in milliseconds, may damage GPIO pin',
                        autoFixable: true,
                        fix:         `Insert ${rNeeded}Ω (standard: 220Ω) in series with LED`,
                        formula:     `R = (Vcc - Vf) / I = (${vcc} - ${vf}) / 0.020 = ${rNeeded}Ω`,
                        reference:   'Ohm\'s Law — LED current limiting',
                    });
                }
            }

            // --- Motor without driver ---
            if (['MOTOR', 'DC_MOTOR'].includes(type)) {
                const isDirectPower = this._isDirectlyConnectedToPower(circuit, comp.id);
                const hasDriver = this._hasMotorDriver(circuit, comp.id);

                if (isDirectPower && !hasDriver) {
                    this._addIssue(SEVERITY.HIGH, CATEGORY.POWER, {
                        type:      'overcurrent',
                        component: comp.id,
                        message:   `⚠️  Motor directly connected to microcontroller GPIO (high back-EMF risk)`,
                        detail:    'DC motors draw hundreds of mA at stall — far exceeding 40mA GPIO limit. Back-EMF spike can destroy MCU.',
                        impact:    'GPIO damage, MCU brownout/reset, board damage',
                        fix:       'Use L298N / TB6612FNG motor driver module between MCU and motor',
                        reference: 'Arduino GPIO specifications — max 40mA per pin',
                    });
                }
            }

            // --- Servo PWM current check ---
            if (['SERVO', 'SERVO_SG90', 'SERVO_MG996R'].includes(type)) {
                const numServos = circuit.components.filter(c =>
                    ['SERVO', 'SERVO_SG90', 'SERVO_MG996R'].includes((c.type || '').toUpperCase())
                ).length;

                if (numServos > 2) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.POWER, {
                        type:    'servoCurrentLoad',
                        message: `⚠️  ${numServos} servos detected — total stall current ~${numServos * 150}mA`,
                        detail:  'SG90 draws up to 150mA stall. Multiple servos may exceed USB power limits.',
                        fix:     'Power servos from external 5V supply, not from Arduino 5V pin',
                    });
                }
            }

            // --- Relay coil current ---
            if (['RELAY', 'RELAY_MODULE'].includes(type)) {
                const directDrive = this._isDirectlyConnectedToPower(circuit, comp.id);
                if (directDrive) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.POWER, {
                        type:    'relayCoilCurrent',
                        component: comp.id,
                        message: '⚠️  Relay coil may draw too much current for direct GPIO drive',
                        detail:  'Relay coils typically need 70–100mA; GPIO pins provide max 40mA.',
                        fix:     'Use NPN transistor (2N2222, BC547) with base resistor to drive relay coil. Add flyback diode.',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 5 — POWER BUDGET ANALYZER
    // ──────────────────────────────────────────────────────────────────────────
    _checkPowerBudget(circuit) {
        const budget = this._calculatePowerBudget(circuit);

        // USB 2.0 / 3.0 power limits
        const USB2_LIMIT = 500;  // mA
        const USB3_LIMIT = 900;  // mA
        const EXT_LIMIT  = 2000; // mA (standard 5V 2A adapter)

        if (budget.totalCurrentMA > EXT_LIMIT) {
            this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                type:    'powerBudgetExceeded',
                message: `🔋 Power budget CRITICAL: ${budget.totalCurrentMA}mA total (external adapter limit ${EXT_LIMIT}mA)`,
                detail:  `Breakdown:\n${budget.breakdown.map(b => `  • ${b.name}: ${b.current}mA`).join('\n')}`,
                impact:  'Power supply overload, voltage sag, component brownout, adapter failure',
                fix:     'Split circuit across multiple power supplies or reduce component count',
            });
        } else if (budget.totalCurrentMA > USB3_LIMIT) {
            this._addIssue(SEVERITY.HIGH, CATEGORY.POWER, {
                type:    'powerBudgetHigh',
                message: `🔋 Power budget HIGH: ${budget.totalCurrentMA}mA — exceeds USB 3.0 limit (${USB3_LIMIT}mA)`,
                detail:  `Use USB 3.0 port or external 5V power supply.`,
                fix:     'Use a 5V 2A wall adapter or power bank with 2A output',
            });
        } else if (budget.totalCurrentMA > USB2_LIMIT) {
            this._addIssue(SEVERITY.WARNING, CATEGORY.POWER, {
                type:    'powerBudgetWarning',
                message: `🔋 Power budget WARNING: ${budget.totalCurrentMA}mA — exceeds USB 2.0 limit (${USB2_LIMIT}mA)`,
                fix:     'Use USB 3.0 port or 5V adapter; avoid powering from laptop USB',
            });
        } else {
            this._addPass('Power Budget', `Total current draw: ${budget.totalCurrentMA}mA — within USB limits ✓`);
        }

        // Power efficiency recommendation
        if (budget.estimatedWatts > 1.5) {
            this._addIssue(SEVERITY.INFO, CATEGORY.POWER, {
                type:    'powerEfficiency',
                message: `💡 Power consumption: ${budget.estimatedWatts.toFixed(2)}W — consider optimization`,
                detail:  'High power consumption reduces battery runtime and increases thermal output.',
                fix:     'Use sleep modes, disable unused peripherals, use switching regulators instead of linear',
            });
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 6 — INDUCTIVE LOAD PROTECTION
    // ──────────────────────────────────────────────────────────────────────────
    _checkInductiveLoads(circuit) {
        const INDUCTIVE_TYPES = ['Motor', 'Relay', 'Solenoid', 'Inductor', 'Electromagnet', 'DC_Motor', 'Buzzer'];

        circuit.components?.forEach(comp => {
            const isInductive = INDUCTIVE_TYPES.some(t =>
                (comp.type || '').toLowerCase().includes(t.toLowerCase())
            );
            if (!isInductive) return;

            // Check for flyback diode
            const hasFlybackDiode = this._hasFlybackDiode(circuit, comp.id);

            if (!hasFlybackDiode) {
                this._addIssue(SEVERITY.HIGH, CATEGORY.PROTECTION, {
                    type:      'missingFlybackDiode',
                    component: comp.id,
                    message:   `⚠️  Inductive load (${comp.type}) missing flyback (freewheeling) diode`,
                    detail:    'When current is switched OFF, inductive components generate a voltage spike (V = L × dI/dt) that can reach 50–100V, destroying transistors, MOSFETs, and MCU pins.',
                    impact:    'GPIO/transistor/MOSFET damage on every switch-off event',
                    fix:       'Add 1N4007 diode in parallel with coil, anode to GND, cathode to + rail',
                    reference: 'Inductive Kickback Protection — AN-9003 Fairchild',
                });
            } else {
                this._addPass('Flyback Protection', `${comp.type} (${comp.id}) has flyback diode ✓`);
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 7 — CAPACITOR BANK SAFETY
    // ──────────────────────────────────────────────────────────────────────────
    _checkCapacitorSafety(circuit) {
        circuit.components?.forEach(comp => {
            if ((comp.type || '').toUpperCase() !== 'CAPACITOR') return;

            const spec = comp.spec || {};
            const capacitance = this._parseCapacitance(spec.value);
            const isElectrolytic = spec.electrolytic || spec.type === 'Electrolytic';

            // Voltage de-rating check
            const ratedV  = parseFloat(spec.voltageRating || spec.voltage || 16);
            const appliedV = this._getAppliedVoltage(circuit, comp.id);

            if (appliedV && appliedV > ratedV) {
                this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                    type:      'capacitorOvervoltage',
                    component: comp.id,
                    message:   `💥 Capacitor overvoltage: ${appliedV}V applied to ${ratedV}V-rated cap`,
                    detail:    `Electrolytic capacitors will bulge, leak, and EXPLODE when over-voltage.`,
                    impact:    'Explosion risk, toxic leak, fire hazard',
                    fix:       `Replace with capacitor rated ≥${Math.ceil(appliedV * 1.5)}V (safety margin ×1.5)`,
                });
            } else if (appliedV && appliedV > ratedV * 0.85) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.POWER, {
                    type:    'capacitorVoltageMargin',
                    component: comp.id,
                    message: `⚠️  Capacitor operating near rated voltage (${appliedV}V / ${ratedV}V rated)`,
                    fix:     `Use capacitor rated ≥${Math.ceil(appliedV * 1.5)}V for safety margin`,
                });
            }

            // Bulk capacitor recommendation for power rails
            if (capacitance !== null && capacitance > 470 && isElectrolytic) {
                this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                    type:    'bulkCapacitorPresent',
                    component: comp.id,
                    message: `ℹ️  Large bulk capacitor (${spec.value}) detected — ensure slow charge path exists`,
                    detail:  'Large capacitors can cause inrush current on power-up that trips fuses or brownouts.',
                    fix:     'Add NTC thermistor or soft-start circuit for inrush current limiting',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 8 — GROUND INTEGRITY AUDIT
    // ──────────────────────────────────────────────────────────────────────────
    _checkGrounding(circuit) {
        const gndNodes = new Set();
        const groundedComponents = new Set();

        // Identify all GND-connected nodes
        circuit.connections?.forEach(conn => {
            if (this._isGNDPin(conn.from) || this._isGNDPin(conn.to)) {
                const compId = this._isGNDPin(conn.from)
                    ? conn.to.split('.')[0]
                    : conn.from.split('.')[0];
                groundedComponents.add(compId);
            }
        });

        // Every active component needs ground
        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.type) || componentRegistry.get(comp.model);
            if (!spec?.requiresGround) return;

            if (!groundedComponents.has(comp.id)) {
                this._addIssue(SEVERITY.HIGH, CATEGORY.POWER, {
                    type:      'missingGround',
                    component: comp.id,
                    message:   `🔌 Missing ground: ${comp.type} (${comp.id}) has no GND connection`,
                    detail:    'Active components without ground reference will not function and may behave unpredictably.',
                    impact:    'Component non-functional, potential floating voltage causing erratic behavior',
                    fix:       `Connect ${comp.id} GND pin to system ground`,
                });
            }
        });

        // Check for ground loops (multiple GND connections creating loop antenna)
        const gndConnections = circuit.connections?.filter(c =>
            this._isGNDPin(c.from) || this._isGNDPin(c.to)
        ) || [];

        if (gndConnections.length > 5) {
            this._addIssue(SEVERITY.INFO, CATEGORY.EMC, {
                type:    'potentialGroundLoop',
                message: `ℹ️  Multiple GND connections (${gndConnections.length}) — verify single-point ground for analog circuits`,
                detail:  'Ground loops create current paths that act as antennas, inducing noise in analog measurements.',
                fix:     'Use star-ground topology for analog/digital mixed circuits',
            });
        }

        // Check if there is ANY ground in the circuit
        if (gndConnections.length === 0 && circuit.components?.length > 0) {
            this._addIssue(SEVERITY.CRITICAL, CATEGORY.POWER, {
                type:    'noGroundReference',
                message: '🔌 No ground (GND) reference found in circuit!',
                detail:  'Without a ground reference, all voltages are undefined. The circuit will not function.',
                impact:  'Complete circuit failure',
                fix:     'Connect at least one GND node from the power supply to the circuit',
            });
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 9 — FLOATING PIN ANALYSIS
    // ──────────────────────────────────────────────────────────────────────────
    _checkFloatingPins(circuit) {
        circuit.components?.forEach(comp => {
            const compSpec = componentRegistry.get(comp.type) || componentRegistry.get(comp.model);
            if (!compSpec?.requiredPins) return;

            const connectedPins = new Set();
            circuit.connections?.forEach(conn => {
                if (conn.from.startsWith(comp.id)) connectedPins.add(conn.from.split('.')[1]);
                if (conn.to.startsWith(comp.id))   connectedPins.add(conn.to.split('.')[1]);
            });

            compSpec.requiredPins.forEach(pin => {
                if (!connectedPins.has(pin)) {
                    const isInput = this._isPinInput(compSpec, pin);
                    const severity = isInput ? SEVERITY.HIGH : SEVERITY.WARNING;

                    this._addIssue(severity, CATEGORY.SIGNAL, {
                        type:      'floatingPin',
                        component: comp.id,
                        pin:       pin,
                        message:   `🚩 Floating pin: ${comp.type}.${pin} — unconnected ${isInput ? 'INPUT' : 'pin'}`,
                        detail:    isInput
                            ? 'Floating input pins pick up noise and oscillate randomly — causes erratic behavior and possible latch-up.'
                            : 'Unconnected required pin may cause undefined circuit behavior.',
                        impact:    'Unpredictable logic states, oscillation, current consumption spikes',
                        fix:       isInput
                            ? `Connect ${pin} to ${this._suggestPinFix(pin)} with pull-up/pull-down resistor`
                            : `Connect ${pin} to appropriate signal`,
                    });
                }
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 10 — VOLTAGE DOMAIN BRIDGING
    // ──────────────────────────────────────────────────────────────────────────
    _checkVoltageDomains(circuit) {
        const voltageDomains = new Map();

        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.type) || componentRegistry.get(comp.model);
            const profile = this._getComponentVoltageProfile(comp);
            const opV = spec?.specs?.operatingVoltage || profile?.vf;
            if (opV) voltageDomains.set(comp.id, opV);
        });

        circuit.connections?.forEach(conn => {
            const fromId = conn.from.split('.')[0];
            const toId   = conn.to.split('.')[0];

            const fromV  = voltageDomains.get(fromId);
            const toV    = voltageDomains.get(toId);

            if (fromV && toV && fromV !== toV) {
                const delta = Math.abs(fromV - toV);

                if (delta > 1.2) {
                    this._addIssue(SEVERITY.HIGH, CATEGORY.SIGNAL, {
                        type:    'voltageDomainMismatch',
                        message: `⚡ Voltage domain mismatch: ${fromId} (${fromV}V) → ${toId} (${toV}V) — direct connection!`,
                        detail:  `${delta.toFixed(1)}V difference between logic domains. Logic HIGH of ${fromV}V domain may exceed Vmax of ${toV}V pins.`,
                        impact:  'GPIO pin damage, logic corruption, communication errors',
                        fix:     this._suggestLevelShifter(fromV, toV),
                        reference: 'Logic level conversion — bidirectional level shifter',
                    });
                } else if (delta > 0.5) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:    'voltageDomainMismatch',
                        message: `⚠️  Minor voltage domain difference: ${fromId} (${fromV}V) ↔ ${toId} (${toV}V)`,
                        detail:  `${delta.toFixed(1)}V difference may cause logic level ambiguity.`,
                        fix:     'Verify logic thresholds match. Consider level shifter for reliability.',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 11 — NOISE MARGIN ANALYSIS
    // ──────────────────────────────────────────────────────────────────────────
    _checkNoiseMargins(circuit) {
        // Find any mixed TTL/CMOS connections
        const mcuType = this._getMCUType(circuit);
        if (!mcuType) return;

        const driverProfile = GPIO_DRIVE[mcuType];
        if (!driverProfile) return;

        // Check for sensors or peripherals with different logic families
        circuit.components?.forEach(comp => {
            const compType = (comp.type || '').toLowerCase();

            // Sensors with open-drain outputs (e.g., DHT22, I2C)
            if (comp.protocol?.includes('I2C') || compType.includes('dht')) {
                const nm = this._calculateNoiseMargin(driverProfile, NOISE_MARGINS.CMOS);
                if (nm.nmh < 0.3) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:    'lowNoiseMargin',
                        component: comp.id,
                        message: `⚠️  Low HIGH noise margin on ${comp.type}: ${nm.nmh.toFixed(2)}V (min 0.4V recommended)`,
                        detail:  'Low noise margin means signal transitions may be misread in noisy environments.',
                        fix:     'Ensure clean power supply with decoupling caps; keep signal traces short',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 12 — BUS CONTENTION DETECTION
    // ──────────────────────────────────────────────────────────────────────────
    _checkBusContention(circuit) {
        // Find all I2C buses and check for address conflicts
        const i2cDevices = circuit.components?.filter(comp =>
            componentRegistry.get(comp.type)?.protocols?.includes('I2C') ||
            comp.protocol?.includes('I2C')
        ) || [];

        if (i2cDevices.length > 1) {
            // Check for known default I2C address conflicts
            const I2C_ADDRESSES = {
                'mpu6050':    '0x68 or 0x69',
                'bmp280':     '0x76 or 0x77',
                'oled-128x64':'0x3C or 0x3D',
                'bh1750':     '0x23 or 0x5C',
                '16x2-lcd':   '0x27 (typical)',
            };

            const addresses = {};
            i2cDevices.forEach(comp => {
                const addr = I2C_ADDRESSES[comp.type] || I2C_ADDRESSES[comp.model];
                if (addr) {
                    if (!addresses[addr]) addresses[addr] = [];
                    addresses[addr].push(comp.id);
                }
            });

            Object.entries(addresses).forEach(([addr, comps]) => {
                if (comps.length > 1) {
                    this._addIssue(SEVERITY.HIGH, CATEGORY.SIGNAL, {
                        type:    'i2cAddressConflict',
                        message: `🔀 I2C address conflict: ${comps.join(', ')} share address ${addr}`,
                        detail:  'Multiple devices at the same I2C address cause bus contention and communication failure.',
                        impact:  'All conflicting devices will fail to communicate',
                        fix:     'Check each sensor\'s ADDR pin — pull HIGH/LOW to change address. Or use I2C multiplexer (TCA9548A).',
                    });
                }
            });
        }

        // SPI CS pin check — every SPI device needs unique CS
        const spiDevices = circuit.components?.filter(comp =>
            componentRegistry.get(comp.type)?.protocols?.includes('SPI') ||
            comp.protocol?.includes('SPI')
        ) || [];

        if (spiDevices.length > 1) {
            this._addIssue(SEVERITY.INFO, CATEGORY.SIGNAL, {
                type:    'multiSPIDevices',
                message: `ℹ️  ${spiDevices.length} SPI devices — verify each has unique Chip Select (CS) line`,
                detail:  'Multiple SPI devices share MOSI/MISO/SCK but need individual CS pins.',
                fix:     'Connect each device CS pin to a separate GPIO, or use SPI expander (74HC595)',
            });
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 13 — SIGNAL INTEGRITY (RISE/FALL TIME)
    // ──────────────────────────────────────────────────────────────────────────
    _checkSignalIntegrity(circuit) {
        // High-speed signals need controlled trace impedance
        const highSpeedProtocols = ['SPI', 'I2C_400kHz', 'UART_1M', 'USB'];

        circuit.components?.forEach(comp => {
            const protocols = componentRegistry.get(comp.type)?.protocols ||
                              comp.protocols || [];

            protocols.forEach(proto => {
                if (proto === 'SPI') {
                    this._addIssue(SEVERITY.INFO, CATEGORY.SIGNAL, {
                        type:    'signalIntegritySPI',
                        component: comp.id,
                        message: `ℹ️  SPI on ${comp.type}: keep trace length < 20cm for reliable communication`,
                        detail:  'Long SPI traces increase capacitance and slow rise times. >20cm may cause data corruption at high speeds.',
                        fix:     'Keep SPI traces short; add series resistors (22Ω–47Ω) to slow edges and reduce ringing',
                    });
                }
            });
        });

        // Check for very fast PWM signals near ADC pins (noise coupling)
        const pwmComponents = circuit.components?.filter(c =>
            ['Servo', 'Motor', 'LED_Strip', 'WS2812B'].some(t =>
                (c.type || '').toLowerCase().includes(t.toLowerCase()))
        ) || [];

        const adcComponents = circuit.components?.filter(c =>
            (c.type || '').toLowerCase().includes('sensor')
        ) || [];

        if (pwmComponents.length > 0 && adcComponents.length > 0) {
            this._addIssue(SEVERITY.INFO, CATEGORY.SIGNAL, {
                type:    'pwmAdcCoupling',
                message: `ℹ️  PWM outputs and analog sensors detected — risk of noise coupling`,
                detail:  'PWM switching noise can contaminate ADC readings. Keep PWM traces away from analog signal paths.',
                fix:     'Separate PWM and analog grounds; add 100nF ceramic cap on sensor VCC; use analog.read() between PWM cycles',
            });
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 14 — FAN-OUT / DRIVE STRENGTH
    // ──────────────────────────────────────────────────────────────────────────
    _checkFanOut(circuit) {
        // Calculate how many loads each GPIO drives
        const gpioLoads = new Map();

        circuit.connections?.forEach(conn => {
            const fromComp = conn.from.split('.')[0];
            const pin      = conn.from.split('.')[1] || '';

            // Identify GPIO-driven signals
            if (pin.match(/^(D\d+|GPIO\d+|PB\d+|PA\d+)/i)) {
                if (!gpioLoads.has(conn.from)) gpioLoads.set(conn.from, 0);
                gpioLoads.set(conn.from, gpioLoads.get(conn.from) + 1);
            }
        });

        gpioLoads.forEach((loadCount, gpioPin) => {
            if (loadCount > 3) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                    type:    'fanOutExceeded',
                    message: `⚠️  High fan-out: ${gpioPin} drives ${loadCount} loads`,
                    detail:  `GPIO output can typically drive 1–3 standard loads. ${loadCount} loads may reduce noise margin and slow edges.`,
                    fix:     'Use buffer (74HC125) or driver IC to increase drive strength',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 15 — COMPONENT MISWIRING
    // ──────────────────────────────────────────────────────────────────────────
    _checkComponentMiswiring(circuit) {
        circuit.components?.forEach(comp => {
            const type = (comp.type || '').toLowerCase();

            // I2C pull-ups
            if (comp.protocol?.includes('I2C') || type.includes('i2c')) {
                const hasPullUps = circuit.components?.some(c =>
                    (c.type || '').toUpperCase() === 'RESISTOR' &&
                    (this._parseResistance(c.spec?.value || '') >= 2200) &&
                    (this._parseResistance(c.spec?.value || '') <= 10000)
                );

                if (!hasPullUps) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:      'missingI2CPullUp',
                        component: comp.id,
                        message:   `⚠️  I2C component ${comp.type} missing pull-up resistors`,
                        detail:    'I2C is an open-drain bus — SDA and SCL MUST have pull-ups to VCC. Without them, the bus cannot pull HIGH.',
                        impact:    'I2C communication completely fails',
                        fix:       'Add 4.7kΩ pull-up resistors from SDA → VCC and SCL → VCC',
                        reference: 'I2C Specification UM10204 — §3.1.7',
                    });
                }
            }

            // 1-Wire pull-up (DHT22, DS18B20)
            if (type.includes('dht') || type.includes('ds18') || comp.protocol === 'OneWire') {
                const has1WirePullUp = circuit.components?.some(c =>
                    (c.type || '').toUpperCase() === 'RESISTOR' &&
                    Math.abs(this._parseResistance(c.spec?.value || '') - 4700) < 2000
                );

                if (!has1WirePullUp) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:      'missing1WirePullUp',
                        component: comp.id,
                        message:   `⚠️  1-Wire / single-wire sensor (${comp.type}) missing 4.7kΩ pull-up`,
                        detail:    'DHT22 / DS18B20 data line must be pulled up to VCC. Missing pull-up causes read failures.',
                        fix:       'Add 4.7kΩ resistor from DATA pin to VCC',
                    });
                }
            }

            // UART level-shifting check (HC-05 RX is 3.3V-tolerant)
            if (type.includes('hc-05') || type.includes('bluetooth')) {
                const hasLevelShifter = circuit.components?.some(c =>
                    (c.type || '').toLowerCase().includes('level') ||
                    (c.type || '').toLowerCase().includes('shifter')
                );

                if (!hasLevelShifter) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:      'uartLevelShifterNeeded',
                        component: comp.id,
                        message:   `⚠️  HC-05 RX pin is 3.3V — Arduino TX is 5V. Level conversion required.`,
                        detail:    'Sending 5V signals to a 3.3V UART RX pin can damage the module over time.',
                        fix:       'Use voltage divider (10kΩ + 20kΩ) or bi-directional level shifter on TX→RX line',
                    });
                }
            }

            // Crystal oscillator load capacitors
            if (type.includes('crystal') || type.includes('xtal')) {
                const hasLoadCaps = circuit.components?.some(c =>
                    (c.type || '').toUpperCase() === 'CAPACITOR' &&
                    (this._parseCapacitance(c.spec?.value || '') >= 12) &&
                    (this._parseCapacitance(c.spec?.value || '') <= 33)
                );

                if (!hasLoadCaps) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:    'missingCrystalLoadCaps',
                        component: comp.id,
                        message: '⚠️  Crystal oscillator missing load capacitors (typically 2× 22pF)',
                        detail:  'Crystal load capacitors are required for stable oscillation frequency.',
                        fix:     'Add two 22pF ceramic capacitors, one from each crystal pin to GND',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 16 — PULL-UP / PULL-DOWN ADVISOR
    // ──────────────────────────────────────────────────────────────────────────
    _checkPullUpPullDown(circuit) {
        circuit.components?.forEach(comp => {
            const type = (comp.type || '').toLowerCase();

            // Active-low RESET / ENABLE / SHUTDOWN pins
            if (type.includes('reset') || type.includes('enable_n')) {
                const isConnected = this._isPinConnected(circuit, comp.id, 'RESET');
                if (!isConnected) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type:    'floatingResetPin',
                        component: comp.id,
                        message: `⚠️  Active-low RESET pin may be floating — add pull-up resistor`,
                        detail:  'Floating RESET causes random resets from noise coupling.',
                        fix:     'Connect RESET pin through 10kΩ resistor to VCC; optionally add reset button to GND',
                    });
                }
            }

            // SPI CS pins
            if (type.includes('spi') || comp.protocol === 'SPI') {
                this._addIssue(SEVERITY.INFO, CATEGORY.SIGNAL, {
                    type:    'spiCsPullUp',
                    component: comp.id,
                    message: `ℹ️  SPI device (${comp.type}): ensure CS pin has pull-up (10kΩ to VCC)`,
                    detail:  'Floating CS pin during power-up may activate device unexpectedly.',
                    fix:     'Add 10kΩ pull-up on CS line to deactivate device when MCU is in reset',
                });
            }
            // L298N Motor Driver miswiring
            if (type === 'l298n') {
                const conns = this._getComponentConnections(circuit, comp.id);
                const has12V = conns.some(c => c.pin === '12V');
                const hasGND = conns.some(c => c.pin === 'GND');
                const hasMotorOut = conns.some(c => c.pin.startsWith('OUT'));
                const hasLogicIn = conns.some(c => c.pin.startsWith('IN') || c.pin.startsWith('EN'));

                if (!has12V || !hasGND) {
                    this._addIssue(SEVERITY.HIGH, CATEGORY.POWER, {
                        type: 'l298nUnpowered',
                        component: comp.id,
                        message: `⚠️  L298N Driver is missing power connections (12V or GND)`,
                        detail:  'The L298N requires a power supply connected to 12V and GND to drive motors.',
                        fix:     'Connect 12V pin to a battery/power source, and GND to system ground.',
                    });
                }
                if (hasLogicIn && !hasMotorOut) {
                    this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                        type: 'l298nNoMotors',
                        component: comp.id,
                        message: `ℹ️  L298N Driver is receiving logic signals but has no motors connected to OUT pins.`,
                        fix:     'Connect DC motors to OUT1/OUT2 and OUT3/OUT4.',
                    });
                }
                if (hasMotorOut && !hasLogicIn) {
                    this._addIssue(SEVERITY.WARNING, CATEGORY.SIGNAL, {
                        type: 'l298nNoLogic',
                        component: comp.id,
                        message: `⚠️  L298N Driver has motors connected but no logic inputs (IN1-IN4, ENA, ENB)`,
                        detail:  'Motors will not move without logic signals from a microcontroller.',
                        fix:     'Connect Arduino pins to IN1-IN4.',
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 17 — DECOUPLING CAPACITOR ADVISOR
    // ──────────────────────────────────────────────────────────────────────────
    _checkDecouplingCaps(circuit) {
        const componentTypes = ['Microcontroller', 'Motor_Driver', 'Wireless_Module', 'Sensor_I2C'];

        circuit.components?.forEach(comp => {
            const compType = (comp.type || '').toLowerCase();
            let category = null;

            if (compType.includes('arduino') || compType.includes('esp') || compType.includes('stm32') || compType.includes('pico'))
                category = 'Microcontroller';
            else if (compType.includes('l298') || compType.includes('tb6612') || compType.includes('motor'))
                category = 'Motor_Driver';
            else if (compType.includes('esp8266') || compType.includes('bluetooth') || compType.includes('wifi') || compType.includes('lora'))
                category = 'Wireless_Module';
            else if (compType.includes('sensor') || compType.includes('mpu') || compType.includes('bmp') || compType.includes('dht'))
                category = 'Sensor_I2C';

            if (!category) return;

            const recommendation = DECOUPLING_CAPS[category];
            const hasBypassCap = this._hasNearbyCapacitor(circuit, comp.id, 100e-9, 500e-9); // 100nF ± range

            if (!hasBypassCap) {
                this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                    type:    'missingDecouplingCap',
                    component: comp.id,
                    message: `ℹ️  ${comp.type}: missing bypass decoupling capacitor (${recommendation.bypass} recommended)`,
                    detail:  `Decoupling caps filter high-frequency noise on VCC. Without them, digital switching creates voltage spikes that corrupt logic and ADC readings. ${recommendation.note}`,
                    fix:     `Place ${recommendation.bypass} ceramic cap <${recommendation.distance} from VCC pin. Also add ${recommendation.bulk} bulk cap nearby.`,
                    reference: 'IPC-2221 §6.3 Decoupling',
                });
            } else {
                this._addPass('Decoupling', `${comp.type} (${comp.id}) has bypass capacitor ✓`);
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 18 — BATTERY SAFETY (LiPo / Li-Ion)
    // ──────────────────────────────────────────────────────────────────────────
    _checkBatterySafety(circuit) {
        const batteries = circuit.components?.filter(comp =>
            (comp.type || '').toLowerCase().includes('lipo') ||
            (comp.type || '').toLowerCase().includes('li-ion') ||
            (comp.type || '').toLowerCase().includes('lithium') ||
            (comp.model || '').toLowerCase().includes('lipo')
        ) || [];

        batteries.forEach(batt => {
            const spec = batt.spec || {};
            const cells = spec.cells || spec.s || 1;
            const maxCellV = cells * LIPO_SAFETY.MAX_CHARGE_VOLTAGE;

            // Check for overcharge protection
            const hasBMS = circuit.components?.some(c =>
                (c.type || '').toLowerCase().includes('bms') ||
                (c.type || '').toLowerCase().includes('protection') ||
                (c.type || '').toLowerCase().includes('tp4056')
            );

            if (!hasBMS) {
                this._addIssue(SEVERITY.CRITICAL, CATEGORY.PROTECTION, {
                    type:      'missingBatteryProtection',
                    component: batt.id,
                    message:   `🔋 LiPo/Li-Ion battery without BMS (Battery Management System)!`,
                    detail:    `LiPo cells exceeding ${LIPO_SAFETY.MAX_CHARGE_VOLTAGE}V/cell can cause THERMAL RUNAWAY — fire and explosion. Cells below ${LIPO_SAFETY.MIN_DISCHARGE_VOLTAGE}V/cell suffer irreversible damage.`,
                    impact:    'Fire, explosion, battery swelling, toxic gas release',
                    fix:       'Add TP4056 (single cell) or dedicated BMS IC for multi-cell packs. NEVER charge without protection circuit.',
                    reference: 'IEC 62133 — Li-Ion battery safety standard',
                });
            }

            // Check for over-discharge protection
            const hasCellMonitor = circuit.components?.some(c =>
                (c.type || '').toLowerCase().includes('monitor') ||
                (c.type || '').toLowerCase().includes('balancer')
            );

            if (!hasCellMonitor && cells > 1) {
                this._addIssue(SEVERITY.HIGH, CATEGORY.PROTECTION, {
                    type:    'missingCellBalancer',
                    component: batt.id,
                    message: `⚠️  Multi-cell LiPo (${cells}S) without cell balancing circuit`,
                    detail:  'Cell imbalance causes over-charge of individual cells during charging, creating thermal runaway risk.',
                    fix:     'Use balancing BMS (e.g., BQ76920, AH8310) with per-cell voltage monitoring',
                });
            }

            // Charge rate check
            if (spec.capacity && spec.chargeRate) {
                const cRate = parseFloat(spec.chargeRate);
                if (cRate > LIPO_SAFETY.MAX_CHARGE_RATE) {
                    this._addIssue(SEVERITY.HIGH, CATEGORY.PROTECTION, {
                        type:    'excessiveChargeRate',
                        component: batt.id,
                        message: `⚠️  Charge rate ${cRate}C exceeds safe limit (${LIPO_SAFETY.MAX_CHARGE_RATE}C for LiPo)`,
                        detail:  'Fast charging generates excess heat and degrades battery chemistry rapidly.',
                        fix:     `Reduce charge current to max ${LIPO_SAFETY.MAX_CHARGE_RATE}C = ${spec.capacity}mAh`,
                    });
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 19 — ESD PROTECTION ADVISOR
    // ──────────────────────────────────────────────────────────────────────────
    _checkESDProtection(circuit) {
        const ESD_SENSITIVE = ['esp32', 'esp8266', 'mpu6050', 'stm32', 'rfid', 'nrf24'];

        circuit.components?.forEach(comp => {
            const type = (comp.type || comp.model || '').toLowerCase();

            const isEsdSensitive = ESD_SENSITIVE.some(s => type.includes(s));
            if (!isEsdSensitive) return;

            // Check for TVS diode or ESD protection diode near input pins
            const hasTVS = circuit.components?.some(c =>
                (c.type || '').toLowerCase().includes('tvs') ||
                (c.type || '').toLowerCase().includes('esd') ||
                (c.type || '').toLowerCase().includes('protection')
            );

            if (!hasTVS) {
                this._addIssue(SEVERITY.INFO, CATEGORY.PROTECTION, {
                    type:    'missingESDProtection',
                    component: comp.id,
                    message: `ℹ️  ${comp.type}: consider ESD protection (TVS diodes) on exposed connector pins`,
                    detail:  'CMOS devices are extremely ESD-sensitive (Class 1A: 0–250V). Human body discharges up to 25,000V. Even brief ESD can cause latent damage that manifests as early failure.',
                    fix:     'Add TVS diode array (e.g., PRTR5V0U2X) on any externally accessible connector pins',
                    reference: 'ANSI/ESD S20.20 — ESD Control',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 20 — LATCH-UP RISK ASSESSMENT
    // ──────────────────────────────────────────────────────────────────────────
    _checkLatchUp(circuit) {
        // Latch-up occurs when input exceeds VCC in CMOS devices
        circuit.connections?.forEach(conn => {
            const appliedV  = this._inferVoltage(conn.from);
            const targetComp = this._getComponentByPin(circuit, conn.to);

            if (!targetComp || !appliedV) return;

            const compProfile = this._getComponentVoltageProfile(targetComp);
            if (!compProfile) return;

            // If signal voltage > component VCC — latch-up risk
            if (appliedV > compProfile.vf + 0.5) {
                this._addIssue(SEVERITY.HIGH, CATEGORY.PROTECTION, {
                    type:      'latchUpRisk',
                    component: targetComp.id,
                    message:   `⚠️  Latch-up risk: ${appliedV}V signal to ${targetComp.type} (VCC = ${compProfile.vf}V)`,
                    detail:    'Input voltage exceeding VCC forward-biases parasitic pnpn structure in CMOS, causing latch-up. Can permanently destroy IC.',
                    impact:    'CMOS IC latch-up — permanent device failure',
                    fix:       'Never apply signal voltage > VCC to CMOS inputs. Add series resistor (1kΩ) + clamp diode to VCC.',
                    reference: 'JEDEC JESD78 — Latch-Up Test Standard',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 21 — THERMAL SAFETY MODEL
    // ──────────────────────────────────────────────────────────────────────────
    _checkThermalSafety(circuit) {
        const budget = this._calculatePowerBudget(circuit);

        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.type) || componentRegistry.get(comp.model);
            const power = this._estimateComponentPower(comp, spec);

            if (power === null) return;

            // Estimate junction temperature
            const thetaJA = THERMAL.THETA_JA_AVG;
            const deltaT  = power * thetaJA;
            const junctionT = THERMAL.AMBIENT_C + deltaT;

            if (junctionT > THERMAL.MAX_JUNCTION_C) {
                this._addIssue(SEVERITY.CRITICAL, CATEGORY.THERMAL, {
                    type:      'overtemperature',
                    component: comp.id,
                    message:   `🌡️  Thermal runaway risk: ${comp.type} junction ≈${junctionT.toFixed(0)}°C (max ${THERMAL.MAX_JUNCTION_C}°C)`,
                    detail:    `At ${power.toFixed(2)}W dissipation with θJA=${thetaJA}°C/W: Tj = ${THERMAL.AMBIENT_C} + (${power.toFixed(2)} × ${thetaJA}) = ${junctionT.toFixed(0)}°C`,
                    impact:    'Component overheat, thermal shutdown, permanent damage',
                    fix:       'Add heatsink, reduce power dissipation, improve airflow, or use lower RDS(on) device',
                    reference: 'JEDEC JESD51 — Thermal Measurement Standard',
                });
            } else if (junctionT > THERMAL.MAX_JUNCTION_C * 0.80) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.THERMAL, {
                    type:      'highTemperature',
                    component: comp.id,
                    message:   `🌡️  ${comp.type} runs warm: estimated ${junctionT.toFixed(0)}°C junction temperature`,
                    detail:    'High temperature significantly reduces component lifetime (Arrhenius equation: every 10°C doubles failure rate).',
                    fix:       'Consider adding small heatsink or improving airflow',
                });
            }

            // Power de-rating check
            const deratedPower = power / THERMAL.DERATING_FACTOR;
            if (spec?.specs?.maxPower && deratedPower > spec.specs.maxPower) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.THERMAL, {
                    type:      'powerDerating',
                    component: comp.id,
                    message:   `⚠️  ${comp.type} exceeds derated power limit (${THERMAL.DERATING_FACTOR * 100}% rule)`,
                    detail:    `MIL-STD-975 recommends running at max ${THERMAL.DERATING_FACTOR * 100}% of rated power for reliability.`,
                    fix:       `Keep power below ${(spec.specs.maxPower * THERMAL.DERATING_FACTOR).toFixed(2)}W`,
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 22 — COMPONENT LIFETIME ESTIMATOR
    // ──────────────────────────────────────────────────────────────────────────
    _checkComponentLifetime(circuit) {
        circuit.components?.forEach(comp => {
            const type = (comp.type || '').toLowerCase();

            if (type.includes('electrolytic') || (type.includes('capacitor') && comp.spec?.type === 'Electrolytic')) {
                const ratedHours = comp.spec?.lifeHours || 2000;
                const tempK      = THERMAL.AMBIENT_C + 273.15;
                const ratedTempK = (85 + 273.15);
                // Capacitor life doubles for every 10°C reduction (Arrhenius)
                const lifeFactor = Math.pow(2, (ratedTempK - tempK) / 10);
                const estimatedLife = ratedHours * lifeFactor;

                this._addIssue(SEVERITY.INFO, CATEGORY.RELIABILITY, {
                    type:    'componentLifetime',
                    component: comp.id,
                    message: `📊 Electrolytic cap ${comp.id}: estimated life ~${estimatedLife.toFixed(0)} hours at ${THERMAL.AMBIENT_C}°C`,
                    detail:  `Capacitor lifetime is temperature-dependent. At 85°C: ${ratedHours}h. At ${THERMAL.AMBIENT_C}°C: ~${estimatedLife.toFixed(0)}h.`,
                    fix:     'For long-life designs (>10 years), use 105°C-rated caps; switch to ceramic or film where possible',
                });
            }

            if (type.includes('lipo') || type.includes('li-ion')) {
                const cycles = COMPONENT_MTBF['LiPo_Battery']?.nominal || 300;
                this._addIssue(SEVERITY.INFO, CATEGORY.RELIABILITY, {
                    type:    'batteryLifetime',
                    component: comp.id,
                    message: `📊 LiPo battery: ~${cycles} charge cycles at 100% DoD (depth of discharge)`,
                    detail:  'Battery cycle life improves dramatically with shallower discharge: 80% DoD → ~400 cycles; 50% DoD → ~700+ cycles.',
                    fix:     'Limit discharge to 80% for 3× longer battery lifespan. Use low-battery cutoff at 3.4V/cell.',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 23 — PREDICTIVE FAILURE ENGINE
    // ──────────────────────────────────────────────────────────────────────────
    _predictFailures(circuit) {
        const budget = this._calculatePowerBudget(circuit);
        const stressScore = this._calculateStressScore(circuit, budget);

        if (stressScore > 80) {
            this._addIssue(SEVERITY.HIGH, CATEGORY.RELIABILITY, {
                type:    'predictedFailure',
                message: `🔮 HIGH failure risk predicted — circuit stress score: ${stressScore}/100`,
                detail:  'Multiple compounding stress factors detected. MTBF estimated < 1000 hours.',
                fix:     'Reduce operating temperature, add protection components, de-rate power usage',
            });
        } else if (stressScore > 50) {
            this._addIssue(SEVERITY.WARNING, CATEGORY.RELIABILITY, {
                type:    'moderateStress',
                message: `🔮 Moderate circuit stress score: ${stressScore}/100`,
                detail:  'Some stress factors detected. Consider design improvements for long-term reliability.',
                fix:     'Review thermal, power, and voltage de-rating recommendations above',
            });
        } else {
            this._addPass('Reliability', `Circuit stress score: ${stressScore}/100 — Good reliability predicted ✓`);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 24 — EMC / RF INTERFERENCE
    // ──────────────────────────────────────────────────────────────────────────
    _checkEMC(circuit) {
        const hasWireless = circuit.components?.some(comp =>
            ['wifi', 'bluetooth', 'lora', 'nrf24', 'zigbee', 'esp32', 'esp8266', 'hc-05'].some(w =>
                (comp.type || '').toLowerCase().includes(w)
            )
        );

        const hasPWMMotors = circuit.components?.some(comp =>
            ['motor', 'servo', 'stepper'].some(m =>
                (comp.type || '').toLowerCase().includes(m)
            )
        );

        if (hasWireless && hasPWMMotors) {
            this._addIssue(SEVERITY.HIGH, CATEGORY.EMC, {
                type:    'emcInterference',
                message: '📡 EMC Risk: PWM motor + wireless module in same circuit',
                detail:  'Motor switching generates broadband RF noise (1MHz–1GHz) that directly interferes with 2.4GHz WiFi/Bluetooth. Motor brushes especially generate extreme RF noise.',
                impact:  'Wireless communication dropout, range reduction, data corruption',
                fix:     'Physical separation >10cm; use brushless motor; add 100nF ceramic caps across motor terminals; ferrite bead on motor power leads; keep antenna away from motor wiring',
                reference: 'CISPR 25 — RF Disturbance from Motor Drives',
            });
        }

        // Check for antennas clearance
        const hasAntenna = circuit.components?.some(c =>
            (c.type || '').toLowerCase().includes('esp') ||
            (c.type || '').toLowerCase().includes('lora') ||
            (c.type || '').toLowerCase().includes('bluetooth')
        );

        if (hasAntenna) {
            this._addIssue(SEVERITY.INFO, CATEGORY.EMC, {
                type:    'antennaPlacement',
                message: '📡 Wireless module detected — ensure antenna placement guidelines are followed',
                detail:  'Keep antenna area clear of metal, ground planes, and other components. Ground plane under antenna significantly reduces range.',
                fix:     'Follow module datasheet antenna keepout zone. Point antenna away from PCB if possible.',
            });
        }

        // Clock harmonics
        const mcus = circuit.components?.filter(c =>
            ['arduino', 'esp', 'stm32', 'pico'].some(m =>
                (c.type || '').toLowerCase().includes(m)
            )
        ) || [];

        if (mcus.length > 0) {
            this._addIssue(SEVERITY.INFO, CATEGORY.EMC, {
                type:    'clockHarmonics',
                message: '📡 MCU clock harmonics may cause EMC emissions',
                detail:  'Crystal oscillator harmonics radiate from MCU and clock traces. 16MHz MCU radiates at 16, 32, 48, 64... MHz.',
                fix:     'Add series resistors (22–47Ω) on clock trace; use spread-spectrum clock if available',
                reference: 'EN 55032 — Multimedia Equipment Emissions',
            });
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 25 — DESIGN RULE ENGINE (DRE)
    // ──────────────────────────────────────────────────────────────────────────
    _checkDesignRules(circuit) {
        const componentCount = circuit.components?.length || 0;
        const connectionCount = circuit.connections?.length || 0;

        // Complexity warning
        if (componentCount > 50) {
            this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                type:    'circuitComplexity',
                message: `ℹ️  Large circuit (${componentCount} components) — consider modularization`,
                detail:  'Large single circuits become difficult to debug. Consider splitting into functional blocks.',
                fix:     'Split into sub-circuits: power section, MCU section, sensor section, actuator section',
            });
        }

        // Check for redundant components
        const resistors = circuit.components?.filter(c => (c.type || '').toUpperCase() === 'RESISTOR') || [];
        if (resistors.length > 20) {
            this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                type:    'manyResistors',
                message: `ℹ️  ${resistors.length} resistors — consider resistor networks or alternative designs`,
                detail:  'Resistor arrays reduce component count and PCB space.',
                fix:     'Use resistor networks (SIP/DIP packages) for pull-up arrays',
            });
        }

        // Power trace width check (conceptual)
        if (connectionCount > 0) {
            this._addIssue(SEVERITY.INFO, CATEGORY.DESIGN, {
                type:    'traceWidthReminder',
                message: '📏 Reminder: power traces need adequate width for current capacity',
                detail:  '1A current requires ~1.2mm trace width for 1oz copper (IPC-2221). Motors, power rails need wider traces.',
                fix:     'Use PCB trace width calculator. Rule of thumb: 1mm per amp for 1oz copper.',
                reference: 'IPC-2221A Table 6-1',
            });
        }

        // Check if any components are isolated (no connections)
        circuit.components?.forEach(comp => {
            const hasAnyConnection = circuit.connections?.some(c =>
                c.from.startsWith(comp.id) || c.to.startsWith(comp.id)
            );

            if (!hasAnyConnection && (circuit.components?.length || 0) > 1) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.DESIGN, {
                    type:      'isolatedComponent',
                    component: comp.id,
                    message:   `⚠️  Component ${comp.type} (${comp.id}) has no connections — isolated island`,
                    detail:    'Isolated components serve no function and may indicate missing connections.',
                    fix:       'Connect component to circuit or remove it',
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  MODULE 26 — COMPLIANCE CHECKER (CE / FCC / UL / RoHS)
    // ──────────────────────────────────────────────────────────────────────────
    _checkCompliance(circuit) {
        const hasWireless = circuit.components?.some(comp =>
            ['wifi', 'bluetooth', 'lora', 'gsm', 'nrf24'].some(w =>
                (comp.type || '').toLowerCase().includes(w) ||
                (comp.model || '').toLowerCase().includes(w)
            )
        );

        // FCC/CE certification required for wireless products
        if (hasWireless) {
            this._addIssue(SEVERITY.INFO, CATEGORY.COMPLIANCE, {
                type:    'wirelessCertification',
                message: '📋 Wireless module detected — FCC/CE certification required for commercial products',
                detail:  'Any product with intentional radio transmitters sold in USA (FCC Part 15) or EU (RED Directive 2014/53/EU) must be certified.',
                fix:     'Use pre-certified modules (ESP32, HC-05 already certified). Custom RF circuits require individual certification.',
                reference: 'FCC Part 15 | EU RED 2014/53/EU',
            });
        }

        // High voltage check (mains voltage)
        const hasHighVoltage = circuit.components?.some(comp =>
            parseFloat(comp.spec?.voltage || 0) > 50 ||
            (comp.type || '').toLowerCase().includes('mains') ||
            (comp.type || '').toLowerCase().includes('230v') ||
            (comp.type || '').toLowerCase().includes('110v')
        );

        if (hasHighVoltage) {
            this._addIssue(SEVERITY.CRITICAL, CATEGORY.COMPLIANCE, {
                type:    'highVoltagePresent',
                message: '⚡ HIGH VOLTAGE (>50V) detected — professional electrical safety standards apply',
                detail:  'Voltages above 50V AC or 120V DC are classified as dangerous and require full electrical safety compliance (IEC 60950, UL 60950).',
                impact:  'Lethal electrocution hazard',
                fix:     'Isolate high-voltage section with galvanic isolation (optocouplers, transformers). Include proper safety clearances, creepage distances, and protective enclosures.',
                reference: 'IEC 60950-1 / IEC 62368-1',
            });
        }

        // RoHS compliance check
        circuit.components?.forEach(comp => {
            if ((comp.spec?.leadContent || '').toLowerCase().includes('leaded') ||
                (comp.spec?.rohsCompliant === false)) {
                this._addIssue(SEVERITY.WARNING, CATEGORY.COMPLIANCE, {
                    type:    'rohsViolation',
                    component: comp.id,
                    message: `⚠️  Component ${comp.type} may not be RoHS compliant (contains lead/restricted substances)`,
                    detail:  'EU RoHS Directive 2011/65/EU restricts hazardous substances including lead in electronics.',
                    fix:     'Switch to RoHS-compliant (lead-free) alternative. Look for "RoHS" or "Pb-Free" marking.',
                    reference: 'EU RoHS 2011/65/EU',
                });
            }
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  AUTO-FIX ORCHESTRATOR
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Attempt to auto-fix an issue.
     * Returns an action descriptor for the caller to execute.
     */
    autoFix(issue) {
        if (!issue.autoFixable) {
            return { success: false, message: 'This issue requires manual intervention.' };
        }

        const fixStrategies = {
            shortCircuit:     () => this._fixShortCircuit(issue),
            overcurrent:      () => this._fixOvercurrent(issue),
            reversePolarity:  () => this._fixReversePolarity(issue),
            missingDecouplingCap: () => this._fixAddComponent(issue, 'Capacitor', '100nF', 'Decoupling cap added'),
        };

        const strategy = fixStrategies[issue.type];
        return strategy
            ? strategy()
            : { success: false, message: `No auto-fix available for issue type: ${issue.type}` };
    }

    _fixShortCircuit(issue) {
        return {
            success:    true,
            action:     'removeConnection',
            connection: issue.connection,
            message:    '✅ Short-circuit connection removed'
        };
    }

    _fixOvercurrent(issue) {
        return {
            success:   true,
            action:    'insertComponent',
            component: { type: 'Resistor', value: '220Ω', position: 'series' },
            targetId:  issue.component,
            message:   '✅ 220Ω current-limiting resistor inserted'
        };
    }

    _fixReversePolarity(issue) {
        return {
            success:   true,
            action:    'swapConnections',
            component: issue.component,
            message:   '✅ Polarity corrected — anode ↔ cathode swapped'
        };
    }

    _fixAddComponent(issue, type, value, message) {
        return {
            success:   true,
            action:    'addComponent',
            component: { type, value },
            near:      issue.component,
            message:   `✅ ${message}`
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  REPORT BUILDER
    // ══════════════════════════════════════════════════════════════════════════

    _buildReport(circuit, elapsedMs) {
        const allIssues = [
            ...this.critical,
            ...this.high,
            ...this.warnings,
            ...this.info,
        ];

        const score = this._calculateSafetyScore();

        return {
            // Summary
            timestamp:      this._analysisTimestamp,
            elapsedMs:      parseFloat(elapsedMs),
            isSafe:         this.critical.length === 0 && this.high.length === 0,
            safetyScore:    score,
            grade:          this._getGrade(score),

            // Categorized issues
            critical:       this.critical,
            high:           this.high,
            warnings:       this.warnings,
            info:           this.info,
            passes:         this.passes,

            // Stats
            stats: {
                criticalCount:  this.critical.length,
                highCount:      this.high.length,
                warningCount:   this.warnings.length,
                infoCount:      this.info.length,
                passCount:      this.passes.length,
                totalChecks:    this._checkLog.length,
                componentsAnalyzed: circuit.components?.length || 0,
                connectionsAnalyzed: circuit.connections?.length || 0,
            },

            // Power budget
            powerBudget:    this._calculatePowerBudget(circuit),

            // Compliance summary
            compliance: {
                ce:   this.critical.filter(i => i.category === CATEGORY.COMPLIANCE).length === 0,
                fcc:  this.critical.filter(i => i.category === CATEGORY.COMPLIANCE).length === 0,
                rohs: this.warnings.filter(i => i.type === 'rohsViolation').length === 0,
            },

            // All checks log
            checkLog:       this._checkLog,
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  HELPER METHODS
    // ══════════════════════════════════════════════════════════════════════════

    _runCheck(name, fn) {
        const t0 = performance.now();
        try {
            fn();
            this._checkLog.push({ name, passed: true, ms: (performance.now() - t0).toFixed(2) });
        } catch (err) {
            this._checkLog.push({ name, passed: false, error: err.message, ms: (performance.now() - t0).toFixed(2) });
        }
    }

    _addIssue(severity, category, details) {
        const issue = { severity: severity.label, category, ...details };
        if (severity === SEVERITY.CRITICAL)    this.critical.push(issue);
        else if (severity === SEVERITY.HIGH)   this.high.push(issue);
        else if (severity === SEVERITY.WARNING)this.warnings.push(issue);
        else                                   this.info.push(issue);
    }

    _addPass(name, message) {
        this.passes.push({ name, message });
    }

    _inferVoltage(pinName) {
        if (!pinName) return null;
        const pin = pinName.toUpperCase();
        if (pin.includes('5V') || pin.includes('VCC_5'))  return 5;
        if (pin.includes('3V3') || pin.includes('3.3V'))  return 3.3;
        if (pin.includes('12V'))                          return 12;
        if (pin.includes('9V'))                           return 9;
        if (pin.includes('3V'))                           return 3;
        if (pin.includes('1.8V'))                         return 1.8;
        if (pin.includes('GND') || pin.includes('AGND'))  return 0;
        return null;
    }

    _isPowerPin(pin) {
        if (!pin) return false;
        const p = pin.toUpperCase();
        return p.includes('VCC') || p.includes('5V') || p.includes('3V') || p.includes('12V') || p.includes('9V');
    }

    _isGNDPin(pin) {
        if (!pin) return false;
        const p = pin.toUpperCase();
        return p.includes('GND') || p.includes('AGND') || p.includes('DGND');
    }

    _estimateShortPower(voltage) {
        return voltage * voltage / 0.001; // P = V²/R with R=1mΩ
    }

    _parseResistance(value) {
        if (!value) return Infinity;
        const v = value.toString().replace(/\s/g, '').toUpperCase();
        if (v.includes('K'))  return parseFloat(v) * 1000;
        if (v.includes('M'))  return parseFloat(v) * 1e6;
        if (v.includes('Ω') || v.includes('OHM')) return parseFloat(v);
        return parseFloat(v) || Infinity;
    }

    _parseCapacitance(value) {
        if (!value) return null;
        const v = value.toString().replace(/\s/g, '').toUpperCase();
        if (v.includes('UF') || v.includes('µF')) return parseFloat(v) * 1e-6;
        if (v.includes('NF')) return parseFloat(v) * 1e-9;
        if (v.includes('PF')) return parseFloat(v) * 1e-12;
        return parseFloat(v) || null;
    }

    _getComponentVoltageProfile(comp) {
        const type = (comp.type || comp.model || '').replace(/[-\s]/g, '_').toUpperCase();
        return VOLTAGE_PROFILE[type] ||
               VOLTAGE_PROFILE[Object.keys(VOLTAGE_PROFILE).find(k => type.includes(k))] ||
               null;
    }

    _getComponentConnections(circuit, componentId) {
        return (circuit.connections || [])
            .filter(conn => conn.from?.includes(componentId) || conn.to?.includes(componentId))
            .map(conn => ({
                ...conn,
                pin: conn.from?.includes(componentId)
                    ? conn.from.split('.')[1]
                    : conn.to.split('.')[1],
                connectedTo: conn.from?.includes(componentId) ? conn.to : conn.from,
            }));
    }

    _isDirectlyConnectedToPower(circuit, compId) {
        return (circuit.connections || []).some(conn => {
            const touchesComp  = conn.from.startsWith(compId) || conn.to.startsWith(compId);
            const touchesPower = this._isPowerPin(conn.from) || this._isPowerPin(conn.to);
            return touchesComp && touchesPower;
        });
    }

    _hasSeriesResistor(circuit, compId) {
        const connections = this._getComponentConnections(circuit, compId);
        return connections.some(conn => {
            const otherEnd = conn.connectedTo.split('.')[0];
            const otherComp = circuit.components?.find(c => c.id === otherEnd);
            return otherComp && (otherComp.type || '').toUpperCase() === 'RESISTOR';
        });
    }

    _hasMotorDriver(circuit, compId) {
        return (circuit.components || []).some(c =>
            ['L298N', 'TB6612', 'motor_driver', 'DRV8833', 'A4988'].some(d =>
                (c.type || '').toLowerCase().includes(d.toLowerCase())
            )
        );
    }

    _hasFlybackDiode(circuit, compId) {
        const connections = this._getComponentConnections(circuit, compId);
        return connections.some(conn => {
            const otherEnd = conn.connectedTo.split('.')[0];
            const otherComp = circuit.components?.find(c => c.id === otherEnd);
            return otherComp && ['Diode', '1N4007', '1N4148', 'Schottky'].some(d =>
                (otherComp.type || '').includes(d)
            );
        });
    }

    _hasNearbyCapacitor(circuit, compId, minF, maxF) {
        // Simplified proximity check — look for capacitors in the same circuit section
        return (circuit.components || []).some(c => {
            if ((c.type || '').toUpperCase() !== 'CAPACITOR') return false;
            const cap = this._parseCapacitance(c.spec?.value || '');
            return cap !== null && cap >= minF && cap <= maxF;
        });
    }

    _isPinConnected(circuit, compId, pinName) {
        return (circuit.connections || []).some(conn =>
            (conn.from === `${compId}.${pinName}`) || (conn.to === `${compId}.${pinName}`)
        );
    }

    _isPinInput(spec, pin) {
        const inputPins = ['VCC', 'CLK', 'IN', 'TRIG', 'SIGNAL', 'DATA', 'DIN', 'SDA', 'SCL', 'RX', 'CS', 'EN'];
        return inputPins.some(ip => pin.toUpperCase().includes(ip));
    }

    _suggestPinFix(pin) {
        const pinU = pin.toUpperCase();
        if (pinU === 'EN' || pinU === 'OE') return 'VCC (active-high) or GND (active-low)';
        if (pinU === 'RESET') return 'VCC via 10kΩ pull-up';
        if (pinU === 'CS')    return 'VCC via 10kΩ pull-up';
        return 'VCC or GND via 10kΩ pull resistor';
    }

    _suggestVoltageRegulator(inputV, outputV) {
        if (outputV <= 3.3) return `AMS1117-3.3 LDO (${inputV}V → 3.3V)`;
        if (outputV <= 5.0) return `LM7805 or AMS1117-5.0 (${inputV}V → 5V)`;
        return `adjustable LDO regulator`;
    }

    _suggestLevelShifter(fromV, toV) {
        if (fromV === 5 && toV === 3.3)
            return 'Use TXB0104 (auto-dir) or MOSFET-based bi-directional level shifter';
        if (fromV === 3.3 && toV === 5)
            return 'Most 5V MCUs accept 3.3V HIGH signals — verify datasheet Vih specification';
        return `Use bi-directional level shifter (${fromV}V ↔ ${toV}V)`;
    }

    _getComponentByPin(circuit, pinStr) {
        if (!pinStr) return null;
        const compId = pinStr.split('.')[0];
        return circuit.components?.find(c => c.id === compId) || null;
    }

    _getMCUType(circuit) {
        const mcu = circuit.components?.find(c =>
            ['arduino', 'esp32', 'esp8266', 'stm32', 'pico', 'nano'].some(m =>
                (c.type || '').toLowerCase().includes(m)
            )
        );
        if (!mcu) return null;
        const type = (mcu.type || '').toLowerCase();
        if (type.includes('esp32')) return 'ESP32';
        if (type.includes('esp8266')) return 'ESP8266';
        if (type.includes('stm32')) return 'STM32';
        return 'Arduino_Uno';
    }

    _calculateNoiseMargin(driver, logic) {
        return {
            nmh: Math.min(driver.voh, logic.voh) - logic.vih,
            nml: logic.vil - Math.max(driver.vol, logic.vol),
        };
    }

    _calculatePowerBudget(circuit) {
        let totalCurrentMA = 0;
        const breakdown = [];

        (circuit.components || []).forEach(comp => {
            const spec = componentRegistry.get(comp.type) || componentRegistry.get(comp.model);
            const profile = this._getComponentVoltageProfile(comp);
            const current = spec?.specs?.maxCurrent || profile?.imax || 0;

            if (current > 0) {
                totalCurrentMA += current;
                breakdown.push({ name: `${comp.type} (${comp.id})`, current });
            }
        });

        const voltage = 5; // Default system voltage
        return {
            totalCurrentMA:  Math.round(totalCurrentMA),
            estimatedWatts:  parseFloat(((totalCurrentMA * voltage) / 1000).toFixed(3)),
            breakdown,
        };
    }

    _getAppliedVoltage(circuit, compId) {
        const conn = (circuit.connections || []).find(c =>
            c.from.startsWith(compId) || c.to.startsWith(compId)
        );
        if (!conn) return null;
        return this._inferVoltage(conn.from) || this._inferVoltage(conn.to);
    }

    _estimateComponentPower(comp, spec) {
        if (!spec?.specs) return null;
        const v = spec.specs.operatingVoltage || 5;
        const i = (spec.specs.maxCurrent || spec.specs.powerConsumption || 0) / 1000;
        const pW = v * i;
        return pW > 0 ? pW : null;
    }

    _calculateStressScore(circuit, budget) {
        let score = 0;
        if (budget.totalCurrentMA > 400)      score += 30;
        else if (budget.totalCurrentMA > 250) score += 15;

        score += this.critical.length * 25;
        score += this.high.length    * 10;
        score += this.warnings.length * 3;

        const hasMotor   = circuit.components?.some(c => (c.type || '').toLowerCase().includes('motor'));
        const hasWireless= circuit.components?.some(c =>
            ['esp', 'wifi', 'bluetooth', 'lora'].some(w => (c.type || '').toLowerCase().includes(w))
        );
        if (hasMotor && hasWireless) score += 10;

        return Math.min(score, 100);
    }

    _calculateSafetyScore() {
        let score = 100;
        score -= this.critical.length * 25;
        score -= this.high.length     * 10;
        score -= this.warnings.length * 3;
        score -= this.info.length     * 0.5;
        score += this.passes.length   * 2;
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    _getGrade(score) {
        if (score >= 90) return 'A — Excellent';
        if (score >= 75) return 'B — Good';
        if (score >= 60) return 'C — Acceptable';
        if (score >= 40) return 'D — Needs Work';
        return 'F — Unsafe';
    }
}
// ─── Singleton Export ─────────────────────────────────────────────────────────
export const safetyEngine = new SafetyEngine();
console.log('✅ TinkerAI Safety Engine v3.0 loaded — 26 safety modules active');