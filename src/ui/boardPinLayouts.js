/**
 * Physically accurate pin coordinates aligned to SVG artwork.
 * Every coordinate here is derived from the SVG generation code in
 * scripts/svgPartsLibrary.mjs and scripts/generate-component-svgs.mjs.
 */

// ═══════════════════════════════════════════════════════════════════
// MICROCONTROLLERS
// ═══════════════════════════════════════════════════════════════════

export const ARDUINO_UNO = {
  width: 320, height: 220,
  pins: (() => {
    const list = [
      { id: 'AREF', x: 79, y: 17, labelSide: 'top' },
      { id: 'GND', x: 93, y: 17, labelSide: 'top' },
    ]
    for (let n = 13; n >= 0; n--)
      list.push({ id: `D${n}`, x: 107 + (13 - n) * 14, y: 17, labelSide: 'top' })
    list.push(
      { id: '3V3', x: 107, y: 203, labelSide: 'bottom' },
      { id: '5V', x: 121, y: 203, labelSide: 'bottom' },
      { id: 'GND', x: 135, y: 203, labelSide: 'bottom' },
      { id: 'VIN', x: 163, y: 203, labelSide: 'bottom' },
    )
    for (let i = 0; i <= 5; i++)
      list.push({ id: `A${i}`, x: 199 + i * 14, y: 203, labelSide: 'bottom' })
    return list
  })(),
}

// Nano SVG: 200×80, pin rects at x=18+i*11, y=7(top)/67(bottom), 15 pins per row
export const ARDUINO_NANO = {
  width: 200, height: 80,
  pins: (() => {
    const top = ['5V', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'AREF']
    const bot = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', '3V3', 'GND', 'VIN', 'D0', 'D1', 'RST', 'GND', 'RAW', 'A6']
    const pins = []
    top.forEach((id, i) => pins.push({ id, x: 20.5 + i * 11, y: 10, labelSide: 'top' }))
    bot.forEach((id, i) => pins.push({ id, x: 20.5 + i * 11, y: 70, labelSide: 'bottom' }))
    return pins
  })(),
}

// Mega SVG: 360×220, 28 pins top at x=68+i*9.5, 16 pins bottom
export const ARDUINO_MEGA = {
  width: 360, height: 220,
  pins: (() => {
    const pins = []
    const topLabels = [
      'AREF', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8',
      'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0',
      'SCL', 'SDA', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19',
      'D20', 'D21', 'D22', 'D23',
    ]
    topLabels.forEach((id, i) =>
      pins.push({ id, x: 70.5 + i * 9.5, y: 14, labelSide: 'top' }),
    )
    const botLabels = [
      '3V3', '5V', 'GND', 'VIN',
      'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
      'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15',
    ]
    botLabels.forEach((id, i) =>
      pins.push({ id, x: 70.5 + i * 9.5, y: 206, labelSide: 'bottom' }),
    )
    return pins
  })(),
}

// ESP32 DevKit SVG: 280×100, 19 pins per row at x=14.5+i*13.5
export const ESP32_DEVKIT = {
  width: 280, height: 100,
  pins: (() => {
    const pins = []
    const topPins = [
      '3V3', 'EN', 'GPIO36', 'GPIO39', 'GPIO34', 'GPIO35', 'GPIO32', 'GPIO33',
      'GPIO25', 'GPIO26', 'GPIO27', 'GPIO14', 'GPIO12', 'GPIO13', 'GND', 'VIN',
      '5V', 'GPIO22', 'GPIO23',
    ]
    const botPins = [
      'GND', 'GPIO21', 'GPIO1', 'GPIO3', 'GPIO19', 'GPIO18', 'GPIO5',
      'GPIO17', 'GPIO16', 'GPIO4', 'GPIO0', 'GPIO2', 'GPIO15',
      'GPIO8', 'GPIO7', 'GPIO6', 'GPIO11', 'GPIO10', 'GPIO9',
    ]
    topPins.forEach((id, i) =>
      pins.push({ id, x: 14.5 + i * 13.5, y: 6, labelSide: 'top' }),
    )
    botPins.forEach((id, i) =>
      pins.push({ id, x: 14.5 + i * 13.5, y: 94, labelSide: 'bottom' }),
    )
    return pins
  })(),
}

// ESP8266 SVG: 130×65, 8 pins per row at x=12+i*14
export const ESP8266 = {
  width: 130, height: 65,
  pins: (() => {
    const pins = []
    const topPins = ['3V3', 'RST', 'EN', 'GPIO16', 'GPIO14', 'GPIO12', 'GPIO13', 'VCC']
    const botPins = ['TX', 'RX', 'GPIO5', 'GPIO4', 'GPIO0', 'GPIO2', 'GPIO15', 'GND']
    topPins.forEach((id, i) => pins.push({ id, x: 12 + i * 14, y: 4, labelSide: 'top' }))
    botPins.forEach((id, i) => pins.push({ id, x: 12 + i * 14, y: 61, labelSide: 'bottom' }))
    return pins
  })(),
}

// RPi Pico SVG: 220×95, 20 pins per row at x=14+i*10
export const RPI_PICO = {
  width: 220, height: 95,
  pins: (() => {
    const pins = []
    const topPins = [
      'GP0', 'GP1', 'GND', 'GP2', 'GP3', 'GND', 'GP4', 'GP5', 'GND', 'GP6',
      'GP7', 'GND', 'GP8', 'GP9', 'GND', 'GP10', 'GP11', 'GND', 'GP12', 'GP13',
    ]
    const botPins = [
      'VBUS', 'VSYS', 'GND', '3V3_EN', '3V3', 'ADC_VREF', 'GP28', 'AGND',
      'GP27', 'GP26', 'RUN', 'GP22', 'GND', 'GP21', 'GP20', 'GP19', 'GP18',
      'GND', 'GP17', 'GP16',
    ]
    topPins.forEach((id, i) => pins.push({ id, x: 14 + i * 10, y: 8, labelSide: 'top' }))
    botPins.forEach((id, i) => pins.push({ id, x: 14 + i * 10, y: 87, labelSide: 'bottom' }))
    // Add aliases for GP14, GP15, GP23, GP24, GP25 that aren't on headers
    ;['GP14', 'GP15', 'GP23', 'GP24', 'GP25'].forEach((id, i) =>
      pins.push({ id, x: 14 + (i + 15) * 10, y: 89, labelSide: 'bottom' }),
    )
    return pins
  })(),
}

// ═══════════════════════════════════════════════════════════════════
// SENSORS (dedicated SVGs)
// ═══════════════════════════════════════════════════════════════════

// HC-SR04 SVG: 130×88, 4 pins at px=28+i*22, y=8..18, center y≈13
export const HC_SR04 = {
  width: 130, height: 88,
  pinPositions: {
    VCC:  { x: 28, y: 13, labelSide: 'top' },
    TRIG: { x: 50, y: 13, labelSide: 'top' },
    ECHO: { x: 72, y: 13, labelSide: 'top' },
    GND:  { x: 94, y: 13, labelSide: 'top' },
  },
}

// DHT module SVG: 80×110, pins at x=18.5,32.5,46.5,60.5 y≈10
export const DHT_MODULE = {
  width: 80, height: 110,
  pinPositions: {
    VCC: { x: 18.5, y: 10, labelSide: 'top' },
    DAT: { x: 32.5, y: 10, labelSide: 'top' },
    OUT: { x: 32.5, y: 10, labelSide: 'top' },  // alias for DAT
    NC:  { x: 46.5, y: 10, labelSide: 'top' },
    GND: { x: 60.5, y: 10, labelSide: 'top' },
  },
}

// PIR sensor SVG: 120×100, pins at px=38+i*22, y=52..60
export const PIR_SENSOR = {
  width: 120, height: 100,
  pinPositions: {
    VCC: { x: 41, y: 56, labelSide: 'top' },
    OUT: { x: 63, y: 56, labelSide: 'top' },
    GND: { x: 85, y: 56, labelSide: 'top' },
  },
}

// MQ2 SVG: 130×95, pins at px=38+i*18, y=48..56
export const MQ2_GAS = {
  width: 130, height: 95,
  pinPositions: {
    VCC: { x: 41, y: 52, labelSide: 'top' },
    GND: { x: 59, y: 52, labelSide: 'top' },
    AO:  { x: 77, y: 52, labelSide: 'top' },
    DO:  { x: 95, y: 52, labelSide: 'top' },
  },
}

// LDR SVG: 100×90, pins at px=28+i*22, y=52..60
export const LDR_MODULE = {
  width: 100, height: 90,
  pinPositions: {
    VCC:  { x: 31, y: 56, labelSide: 'top' },
    GND:  { x: 53, y: 56, labelSide: 'top' },
    OUT:  { x: 75, y: 56, labelSide: 'top' },
    pin1: { x: 31, y: 56, labelSide: 'top' },  // alias
    pin2: { x: 75, y: 56, labelSide: 'top' },  // alias
  },
}

// Soil moisture SVG: 90×120, pins at px=28+i*16, y=10..18
export const SOIL_MOISTURE = {
  width: 90, height: 120,
  pinPositions: {
    VCC: { x: 30.5, y: 14, labelSide: 'bottom' },
    GND: { x: 46.5, y: 14, labelSide: 'bottom' },
    SIG: { x: 62.5, y: 14, labelSide: 'bottom' },
    AO:  { x: 62.5, y: 14, labelSide: 'bottom' },  // alias
    DO:  { x: 62.5, y: 14, labelSide: 'bottom' },  // alias
  },
}

// ═══════════════════════════════════════════════════════════════════
// DISPLAYS
// ═══════════════════════════════════════════════════════════════════

// LCD 16x2 SVG: 200×90, 16 pins at x=14+i*11, y≈10
export const LCD_16X2 = {
  width: 200, height: 90,
  pins: ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'A', 'K']
    .map((id, i) => ({ id, x: 16 + i * 11, y: 10, labelSide: 'bottom' }))
    .concat([
      { id: 'SDA', x: 181, y: 45, labelSide: 'bottom' },
      { id: 'SCL', x: 181, y: 55, labelSide: 'bottom' },
    ]),
}

// OLED SVG: 110×75, 4 pins at x=16,36,56,76, y≈8
export const OLED_MODULE = {
  width: 110, height: 75,
  pinPositions: {
    VCC: { x: 16, y: 8, labelSide: 'top' },
    GND: { x: 36, y: 8, labelSide: 'top' },
    SCL: { x: 56, y: 8, labelSide: 'top' },
    SDA: { x: 76, y: 8, labelSide: 'top' },
    // aliases for LED matrix / e-paper that also use oled-module archetype
    DIN:  { x: 56, y: 8, labelSide: 'top' },
    CS:   { x: 76, y: 8, labelSide: 'top' },
    CLK:  { x: 56, y: 8, labelSide: 'top' },
    DC:   { x: 16, y: 8, labelSide: 'top' },
    RST:  { x: 36, y: 8, labelSide: 'top' },
    BUSY: { x: 76, y: 8, labelSide: 'top' },
  },
}

// TFT module SVG: 130×110, connector at bottom x=45 y=94
export const TFT_MODULE = {
  width: 130, height: 110,
  pinPositions: {
    VCC:  { x: 30, y: 100, labelSide: 'bottom' },
    GND:  { x: 42, y: 100, labelSide: 'bottom' },
    CS:   { x: 54, y: 100, labelSide: 'bottom' },
    RST:  { x: 66, y: 100, labelSide: 'bottom' },
    DC:   { x: 78, y: 100, labelSide: 'bottom' },
    MOSI: { x: 90, y: 100, labelSide: 'bottom' },
    CLK:  { x: 102, y: 100, labelSide: 'bottom' },
    T_CS: { x: 114, y: 100, labelSide: 'bottom' },
  },
}

// 7-segment display SVG: 110×65
export const DISPLAY_7SEG = {
  width: 110, height: 65,
  pinPositions: {
    // Single 7-seg: a,b,c,d,e,f,g,dp,CC across bottom
    a:   { x: 12, y: 58, labelSide: 'bottom' },
    b:   { x: 24, y: 58, labelSide: 'bottom' },
    c:   { x: 36, y: 58, labelSide: 'bottom' },
    d:   { x: 48, y: 58, labelSide: 'bottom' },
    e:   { x: 60, y: 58, labelSide: 'bottom' },
    f:   { x: 72, y: 58, labelSide: 'bottom' },
    g:   { x: 84, y: 58, labelSide: 'bottom' },
    dp:  { x: 96, y: 58, labelSide: 'bottom' },
    CC:  { x: 55, y: 8, labelSide: 'top' },
    // 4-digit TM1637 aliases
    VCC: { x: 12, y: 58, labelSide: 'bottom' },
    GND: { x: 36, y: 58, labelSide: 'bottom' },
    CLK: { x: 60, y: 58, labelSide: 'bottom' },
    DIO: { x: 84, y: 58, labelSide: 'bottom' },
  },
}

// NeoPixel ring SVG: 95×95
export const NEOPIXEL_RING = {
  width: 95, height: 95,
  pinPositions: {
    VCC: { x: 47, y: 8,  labelSide: 'top' },
    GND: { x: 20, y: 85, labelSide: 'bottom' },
    DIN: { x: 74, y: 85, labelSide: 'bottom' },
  },
}

// NeoPixel strip SVG: 150×45
export const NEOPIXEL_STRIP = {
  width: 150, height: 45,
  pinPositions: {
    VCC: { x: 8,   y: 23, labelSide: 'left' },
    GND: { x: 8,   y: 35, labelSide: 'left' },
    DIN: { x: 142, y: 23, labelSide: 'right' },
  },
}

// ═══════════════════════════════════════════════════════════════════
// LEDS
// ═══════════════════════════════════════════════════════════════════

// LED SVG: 60×120, two leads at bottom — anode(longer) at x=36, cathode at x=22
const LED_LAYOUT = {
  width: 60, height: 120,
  pinPositions: {
    anode:   { x: 36, y: 110, labelSide: 'bottom' },
    cathode: { x: 22, y: 110, labelSide: 'bottom' },
  },
}

// RGB LED SVG: 70×110, 4 leads at bottom
export const RGB_LED = {
  width: 70, height: 110,
  pinPositions: {
    R:   { x: 18,   y: 100, labelSide: 'bottom' },
    GND: { x: 29.5, y: 100, labelSide: 'bottom' },
    G:   { x: 39.5, y: 100, labelSide: 'bottom' },
    B:   { x: 49.5, y: 100, labelSide: 'bottom' },
  },
}

// ═══════════════════════════════════════════════════════════════════
// PASSIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Resistor: 120×40, leads at x=0 and x=120
const RESISTOR_LAYOUT = {
  width: 120, height: 40,
  pinPositions: {
    pin1: { x: 0,   y: 20, labelSide: 'left' },
    pin2: { x: 120, y: 20, labelSide: 'right' },
  },
}

// Potentiometer SVG: 90×90, left lead at (6,48), right at (84,48), wiper/shaft at top (45,19)
export const POTENTIOMETER = {
  width: 90, height: 90,
  pinPositions: {
    '1':    { x: 6,  y: 48, labelSide: 'left' },
    '2':    { x: 45, y: 19, labelSide: 'top' },
    '3':    { x: 84, y: 48, labelSide: 'right' },
    VCC:    { x: 6,  y: 48, labelSide: 'left' },   // alias
    WIPER:  { x: 45, y: 19, labelSide: 'top' },     // alias
    GND:    { x: 84, y: 48, labelSide: 'right' },   // alias
    pin1:   { x: 6,  y: 48, labelSide: 'left' },    // trimmer alias
    pin2:   { x: 84, y: 48, labelSide: 'right' },   // trimmer alias
    wiper:  { x: 45, y: 19, labelSide: 'top' },     // trimmer alias
  },
}

// Ceramic capacitor SVG: 90×40, leads at x=0 and x=90
const CAP_CERAMIC_LAYOUT = {
  width: 90, height: 40,
  pinPositions: {
    pin1: { x: 0,  y: 20, labelSide: 'left' },
    pin2: { x: 90, y: 20, labelSide: 'right' },
  },
}

// Electrolytic capacitor SVG: 55×95, top lead at (27,7), bottom at (27,86)
const CAP_ELECTROLYTIC_LAYOUT = {
  width: 55, height: 95,
  pinPositions: {
    '+':  { x: 27, y: 7,  labelSide: 'top' },
    '-':  { x: 27, y: 86, labelSide: 'bottom' },
    pin1: { x: 27, y: 7,  labelSide: 'top' },    // alias
    pin2: { x: 27, y: 86, labelSide: 'bottom' },  // alias
  },
}

// Inductor SVG: 110×40, leads at x=0 and x=110
const INDUCTOR_LAYOUT = {
  width: 110, height: 40,
  pinPositions: {
    pin1: { x: 0,   y: 20, labelSide: 'left' },
    pin2: { x: 110, y: 20, labelSide: 'right' },
  },
}

// Diode SVG: 110×40, anode at x=0, cathode at x=110
const DIODE_LAYOUT = {
  width: 110, height: 40,
  pinPositions: {
    anode:   { x: 0,   y: 20, labelSide: 'left' },
    cathode: { x: 110, y: 20, labelSide: 'right' },
    pin1:    { x: 0,   y: 20, labelSide: 'left' },   // alias
    pin2:    { x: 110, y: 20, labelSide: 'right' },   // alias
  },
}

// Transistor SVG: 85×95, Base at left (12,48), Collector top-right (62,14), Emitter bottom-right (62,82)
export const TRANSISTOR = {
  width: 85, height: 95,
  pinPositions: {
    B: { x: 12, y: 48, labelSide: 'left' },
    C: { x: 62, y: 14, labelSide: 'right' },
    E: { x: 62, y: 82, labelSide: 'right' },
    G: { x: 12, y: 48, labelSide: 'left' },   // MOSFET alias → Gate
    D: { x: 62, y: 14, labelSide: 'right' },   // MOSFET alias → Drain
    S: { x: 62, y: 82, labelSide: 'right' },   // MOSFET alias → Source
  },
}

// ═══════════════════════════════════════════════════════════════════
// ACTUATORS
// ═══════════════════════════════════════════════════════════════════

// Servo SVG: 120×95, 3 wires on left at x=4..10, y=38+i*14
export const SERVO = {
  width: 120, height: 95,
  pinPositions: {
    SIG:    { x: 7, y: 42, labelSide: 'right' },
    SIGNAL: { x: 7, y: 42, labelSide: 'right' },  // alias
    '5V':   { x: 7, y: 56, labelSide: 'right' },
    VCC:    { x: 7, y: 56, labelSide: 'right' },   // alias
    GND:    { x: 7, y: 70, labelSide: 'right' },
  },
}

// DC motor SVG: 100×80, two terminal leads
const DC_MOTOR = {
  width: 100, height: 80,
  pinPositions: {
    '+': { x: 96, y: 37, labelSide: 'right' },
    '-': { x: 96, y: 47, labelSide: 'right' },
  },
}

// L298N SVG: 300x300, better pin spacing
export const L298N = {
  width: 200, height: 200,
  pinPositions: {
    OUT1: { x: 27, y: 93, labelSide: 'left' },
    OUT2: { x: 27, y: 120, labelSide: 'left' },
    OUT3: { x: 173, y: 93, labelSide: 'right' },
    OUT4: { x: 173, y: 120, labelSide: 'right' },
    '12V': { x: 73, y: 173, labelSide: 'bottom' },
    GND:  { x: 100, y: 173, labelSide: 'bottom' },
    '5V': { x: 127, y: 173, labelSide: 'bottom' },
    ENA:  { x: 75, y: 123, labelSide: 'top' },
    IN1:  { x: 85, y: 123, labelSide: 'bottom' },
    IN2:  { x: 96, y: 123, labelSide: 'top' },
    IN3:  { x: 107, y: 123, labelSide: 'bottom' },
    IN4:  { x: 117, y: 123, labelSide: 'top' },
    ENB:  { x: 128, y: 123, labelSide: 'bottom' },
  },
}

// Stepper SVG: 95×95, connector at top (rect at x=41 y=0 w=13 h=12)
const STEPPER = {
  width: 95, height: 95,
  pinPositions: {
    // 28BYJ-48 connector (5 wires)
    IN1: { x: 36, y: 6, labelSide: 'top' },
    IN2: { x: 42, y: 6, labelSide: 'top' },
    IN3: { x: 48, y: 6, labelSide: 'top' },
    IN4: { x: 54, y: 6, labelSide: 'top' },
    VCC: { x: 60, y: 6, labelSide: 'top' },
    // NEMA 17 aliases (4 wires)
    'A+': { x: 36, y: 6, labelSide: 'top' },
    'A-': { x: 42, y: 6, labelSide: 'top' },
    'B+': { x: 48, y: 6, labelSide: 'top' },
    'B-': { x: 54, y: 6, labelSide: 'top' },
  },
}

// Buzzer SVG: 75×75, connector at top (x=32 y=4 w=10 h=12)
const BUZZER = {
  width: 75, height: 75,
  pinPositions: {
    '+': { x: 34, y: 10, labelSide: 'top' },
    '-': { x: 42, y: 10, labelSide: 'top' },
  },
}

// Relay module SVG: 110×85
const RELAY_MODULE = {
  width: 110, height: 85,
  pinPositions: {
    VCC: { x: 12, y: 10, labelSide: 'top' },
    GND: { x: 28, y: 10, labelSide: 'top' },
    IN:  { x: 44, y: 10, labelSide: 'top' },
    IN1: { x: 44, y: 10, labelSide: 'top' },
    IN2: { x: 56, y: 10, labelSide: 'top' },
    IN3: { x: 68, y: 10, labelSide: 'top' },
    IN4: { x: 80, y: 10, labelSide: 'top' },
    IN5: { x: 12, y: 75, labelSide: 'bottom' },
    IN6: { x: 24, y: 75, labelSide: 'bottom' },
    IN7: { x: 36, y: 75, labelSide: 'bottom' },
    IN8: { x: 48, y: 75, labelSide: 'bottom' },
    COM: { x: 72, y: 75, labelSide: 'bottom' },
    NO:  { x: 84, y: 75, labelSide: 'bottom' },
    NC:  { x: 96, y: 75, labelSide: 'bottom' },
  },
}


// 4WD Car Chassis SVG: 200x250, mechanical chassis
export const WD4_CAR_CHASSIS = {
  width: 200, height: 250,
  pinPositions: {
    'M1+':  { x: 30, y: 35, labelSide: 'right' },
    'M1-':  { x: 30, y: 55, labelSide: 'right' },
    'M2+':  { x: 170, y: 35, labelSide: 'left' },
    'M2-':  { x: 170, y: 55, labelSide: 'left' },
    'M3+':  { x: 30, y: 165, labelSide: 'right' },
    'M3-':  { x: 30, y: 185, labelSide: 'right' },
    'M4+':  { x: 170, y: 165, labelSide: 'left' },
    'M4-':  { x: 170, y: 185, labelSide: 'left' },
  },
}

// Motor driver SVG: 120×80, header at top (x=8 y=4 w=104 h=6)
const MOTOR_DRIVER = {
  width: 120, height: 80,
  pinPositions: (() => {
    // Distribute up to 14 pins along the top header
    const allPins = [
      'VCC', 'VCC1', 'VCC2', 'VM', 'VMOT', 'GND', 'STBY',
      'EN', 'STEP', 'DIR',
      'MS1', 'MS2', 'MS3', 'M0', 'M1', 'M2',
      'AIN1', 'AIN2', 'BIN1', 'BIN2', 'PWMA', 'PWMB',
      '1A', '2A', '3A', '4A', '1Y', '2Y', '3Y', '4Y', 'EN12', 'EN34',
      'AO1', 'AO2', 'BO1', 'BO2',
      'IN1', 'IN2', 'IN3', 'IN4',
      'A1', 'A2', 'B1', 'B2',
      '1A', '1B', '2A', '2B',
    ]
    const pos = {}
    allPins.forEach((id, i) => {
      if (!pos[id]) {
        const row = i < 20 ? 8 : 72
        const col = (i % 14) * 7.5 + 10
        pos[id] = { x: col, y: row, labelSide: row === 8 ? 'top' : 'bottom' }
      }
    })
    return pos
  })(),
}

// ═══════════════════════════════════════════════════════════════════
// COMMUNICATION MODULES
// ═══════════════════════════════════════════════════════════════════



// Comm module SVG: 115×80 (purple PCB)
const COMM_MODULE = {
  width: 115, height: 80,
  pinPositions: (() => {
    // Generic comm module: distribute pins along top edge
    const allPins = [
      'VCC', 'GND', 'CE', 'CSN', 'SCK', 'MOSI', 'MISO', 'IRQ',
      'NSS', 'RST', 'DIO0', 'TX', 'RX', 'SDA',
      'DE', 'RE', 'DI', 'RO', 'A', 'B',
      'CS', 'INT',
    ]
    const pos = {}
    allPins.forEach((id, i) => {
      if (!pos[id]) {
        pos[id] = { x: 10 + (i % 11) * 9.5, y: i < 11 ? 10 : 72, labelSide: i < 11 ? 'top' : 'bottom' }
      }
    })
    return pos
  })(),
}

// ═══════════════════════════════════════════════════════════════════
// POWER
// ═══════════════════════════════════════════════════════════════════

// Power module SVG: 115×75
const POWER_MODULE = {
  width: 115, height: 75,
  pinPositions: {
    IN:    { x: 10, y: 37, labelSide: 'left' },
    'IN+': { x: 10, y: 30, labelSide: 'left' },
    'IN-': { x: 10, y: 44, labelSide: 'left' },
    GND:   { x: 57, y: 65, labelSide: 'bottom' },
    ADJ:   { x: 57, y: 65, labelSide: 'bottom' },
    OUT:   { x: 105, y: 37, labelSide: 'right' },
    'OUT+': { x: 105, y: 30, labelSide: 'right' },
    'OUT-': { x: 105, y: 44, labelSide: 'right' },
    'B+':  { x: 57, y: 10, labelSide: 'top' },
    'B-':  { x: 75, y: 10, labelSide: 'top' },
  },
}

// Battery 9V SVG: 75×110, terminals at top
const BATTERY_9V = {
  width: 75, height: 110,
  pinPositions: {
    '+': { x: 30, y: 9, labelSide: 'top' },
    '-': { x: 45, y: 9, labelSide: 'top' },
  },
}

const BATTERY_HOLDER_2CELL = {
  width: 100, height: 80,
  pinPositions: {
    '+': { x: 90, y: 30, labelSide: 'right' },
    '-': { x: 90, y: 50, labelSide: 'right' },
  },
};

// Solar panel SVG: 125×85
const SOLAR_PANEL = {
  width: 125, height: 85,
  pinPositions: {
    '+': { x: 50, y: 77, labelSide: 'bottom' },
    '-': { x: 75, y: 77, labelSide: 'bottom' },
  },
}

// ═══════════════════════════════════════════════════════════════════
// INPUT / SWITCHES
// ═══════════════════════════════════════════════════════════════════

// Push button SVG: 85×65, two leads left(5,32) and right(80,32)
const PUSH_BUTTON = {
  width: 85, height: 65,
  pinPositions: {
    '1':   { x: 5,  y: 32, labelSide: 'left' },
    '2':   { x: 80, y: 32, labelSide: 'right' },
    pin1:  { x: 5,  y: 32, labelSide: 'left' },
    pin2:  { x: 80, y: 32, labelSide: 'right' },
  },
}

// Switch SVG: 85×55, leads at left(5,29) and right(80,29)
const SWITCH_LAYOUT = {
  width: 85, height: 55,
  pinPositions: {
    pin1: { x: 5,  y: 29, labelSide: 'left' },
    pin2: { x: 80, y: 29, labelSide: 'right' },
    pin3: { x: 42, y: 44, labelSide: 'bottom' },  // center for slide switch
    COM:  { x: 5,  y: 29, labelSide: 'left' },
    NO:   { x: 80, y: 29, labelSide: 'right' },
    NC:   { x: 42, y: 44, labelSide: 'bottom' },
    SW1:  { x: 20, y: 29, labelSide: 'top' },
    SW2:  { x: 35, y: 29, labelSide: 'top' },
    SW3:  { x: 50, y: 29, labelSide: 'top' },
    SW4:  { x: 65, y: 29, labelSide: 'top' },
  },
}

// Joystick SVG: 95×100
const JOYSTICK = {
  width: 95, height: 100,
  pinPositions: {
    VCC: { x: 20, y: 90, labelSide: 'bottom' },
    GND: { x: 35, y: 90, labelSide: 'bottom' },
    VRx: { x: 50, y: 90, labelSide: 'bottom' },
    VRy: { x: 65, y: 90, labelSide: 'bottom' },
    SW:  { x: 80, y: 90, labelSide: 'bottom' },
  },
}

// Jumper wire SVG: 110×35
const JUMPER_WIRE = {
  width: 110, height: 35,
  pinPositions: {
    '1':   { x: 6,   y: 18, labelSide: 'left' },
    '2':   { x: 104, y: 18, labelSide: 'right' },
    pin1:  { x: 6,   y: 18, labelSide: 'left' },
    pin2:  { x: 104, y: 18, labelSide: 'right' },
  },
}

// ═══════════════════════════════════════════════════════════════════
// ICs (DIP packages)
// ═══════════════════════════════════════════════════════════════════

// IC DIP SVG: 100×(20+pins*4), pins on left (x=26) and right (x=74) at y=15+i*8
function icDipLayout(pinLabels) {
  const half = Math.ceil(pinLabels.length / 2)
  const h = 20 + half * 8 * 2
  const pos = {}
  pinLabels.forEach((id, i) => {
    if (i < half) {
      pos[id] = { x: 26, y: 15 + i * 8, labelSide: 'left' }
    } else {
      pos[id] = { x: 74, y: 15 + (pinLabels.length - 1 - i) * 8, labelSide: 'right' }
    }
  })
  return { width: 100, height: Math.max(h, 60), pinPositions: pos }
}

// ═══════════════════════════════════════════════════════════════════
// Blue breakout helper (matches blueBreakout() in svgPartsLibrary)
// ═══════════════════════════════════════════════════════════════════

function blueBreakoutLayout(width, height, pinIds) {
  const headerW = pinIds.length * 12 + 16
  const hx = (width - headerW) / 2
  return {
    width, height,
    pinPositions: pinIds.reduce((acc, id, i) => {
      acc[id] = { x: hx + 8 + i * 12, y: 12, labelSide: 'bottom' }
      return acc
    }, {}),
  }
}

// ═══════════════════════════════════════════════════════════════════
// MASTER MAP — every component ID → layout
// ═══════════════════════════════════════════════════════════════════

export const BOARD_LAYOUTS = {
  // ── Microcontrollers ──────────────────────────────────────
  'arduino-uno': ARDUINO_UNO,
  'arduino-nano': ARDUINO_NANO,
  'arduino-mega': ARDUINO_MEGA,
  'arduino-leonardo': ARDUINO_NANO,
  'arduino-due': ARDUINO_MEGA,
  'esp32-devkit': ESP32_DEVKIT,
  'esp32': ESP32_DEVKIT,
  'esp32-s3': ESP32_DEVKIT,
  'esp32-c3': ESP32_DEVKIT,
  'esp8266': ESP8266,
  'wifi-esp8266': ESP8266,
  'rpi-pico': RPI_PICO,
  'raspberry-pi-pico': RPI_PICO,
  'raspberry-pi-pico-w': RPI_PICO,

  // ── Sensors (dedicated SVGs) ──────────────────────────────
  'hc-sr04': HC_SR04,
  'dht-module': DHT_MODULE,
  'dht22': DHT_MODULE,
  'dht11': DHT_MODULE,
  'pir-sensor': PIR_SENSOR,
  'mq2-gas': MQ2_GAS,
  'ldr': LDR_MODULE,
  'soil-moisture': SOIL_MOISTURE,

  // ── Sensors (blue breakout boards) ────────────────────────
  'mpu6050': blueBreakoutLayout(130, 78, ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT']),
  'bmp280': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'SCL', 'SDA']),
  'bme280': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'SCL', 'SDA']),
  'adxl345': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'SCL', 'SDA', 'SDO', 'CS']),
  'max30102': blueBreakoutLayout(120, 78, ['VCC', 'GND', 'SCL', 'SDA']),
  'ds18b20': blueBreakoutLayout(110, 70, ['VCC', 'DQ', 'GND']),
  'rotary-encoder': blueBreakoutLayout(130, 80, ['CLK', 'DT', 'SW', 'VCC', 'GND']),
  'ir-sensor': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'OUT']),
  'ir-receiver': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'OUT']),
  'ir-transmitter': (() => {
    const l = blueBreakoutLayout(110, 70, ['VCC', 'GND', 'IN'])
    l.pinPositions.anode = l.pinPositions.VCC
    l.pinPositions.cathode = l.pinPositions.GND
    return l
  })(),
  'sound-sensor': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'AO', 'DO']),
  'water-level': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'S']),
  'flame-sensor': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'DO', 'AO']),
  'mq135-air': blueBreakoutLayout(130, 95, ['VCC', 'GND', 'AO', 'DO']),
  'hx711': blueBreakoutLayout(140, 78, ['VCC', 'GND', 'DT', 'SCK', 'E+', 'E-', 'A+', 'A-']),
  'acs712': blueBreakoutLayout(130, 78, ['VCC', 'GND', 'OUT', 'IP+', 'IP-']),
  'tcs3200': blueBreakoutLayout(130, 78, ['VCC', 'GND', 'S0', 'S1', 'S2', 'S3', 'OUT']),
  'rain-sensor': blueBreakoutLayout(120, 72, ['VCC', 'GND', 'AO', 'DO']),
  'touch-sensor': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'SIG']),
  'hall-effect': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'OUT']),
  'vibration-sensor': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'DO']),
  'uv-sensor': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'OUT']),
  'flex-sensor': (() => {
    const l = blueBreakoutLayout(110, 70, ['VCC', 'GND', 'SIG'])
    l.pinPositions.pin1 = l.pinPositions.VCC
    l.pinPositions.pin2 = l.pinPositions.GND
    return l
  })(),
  'force-sensor': (() => {
    const l = blueBreakoutLayout(110, 70, ['VCC', 'GND', 'SIG'])
    l.pinPositions.pin1 = l.pinPositions.VCC
    l.pinPositions.pin2 = l.pinPositions.GND
    return l
  })(),
  'tilt-sensor': (() => {
    const l = blueBreakoutLayout(110, 70, ['VCC', 'GND', 'SIG'])
    l.pinPositions.pin1 = l.pinPositions.VCC
    l.pinPositions.pin2 = l.pinPositions.GND
    return l
  })(),
  'fingerprint-sensor': blueBreakoutLayout(130, 85, ['VCC', 'GND', 'TX', 'RX']),
  'voltage-sensor': blueBreakoutLayout(110, 70, ['VCC', 'GND', 'S']),
  'thermistor-ntc': (() => {
    const l = blueBreakoutLayout(110, 70, ['VCC', 'GND', 'SIG'])
    l.pinPositions.pin1 = l.pinPositions.VCC
    l.pinPositions.pin2 = l.pinPositions.GND
    return l
  })(),
  'sensor-module': blueBreakoutLayout(130, 78, ['VCC', 'GND', 'OUT', 'AO']),

  // ── Displays ──────────────────────────────────────────────
  'lcd-16x2': LCD_16X2,
  'oled-module': OLED_MODULE,
  'oled-096': OLED_MODULE,
  'oled-130': OLED_MODULE,
  'tft-module': TFT_MODULE,
  'tft-18': TFT_MODULE,
  'tft-28': TFT_MODULE,
  'display-7seg': DISPLAY_7SEG,
  '7seg-display': DISPLAY_7SEG,
  '4digit-7seg': DISPLAY_7SEG,
  'led-matrix-8x8': OLED_MODULE,
  'epaper': OLED_MODULE,
  'neopixel-ring': NEOPIXEL_RING,
  'neopixel-strip': NEOPIXEL_STRIP,

  // ── LEDs ──────────────────────────────────────────────────
  'led-red': LED_LAYOUT,
  'led-green': LED_LAYOUT,
  'led-blue': LED_LAYOUT,
  'led-yellow': LED_LAYOUT,
  'led-white': LED_LAYOUT,
  'led-ir': LED_LAYOUT,
  'rgb-led': RGB_LED,

  // ── Passives ──────────────────────────────────────────────
  'resistor': RESISTOR_LAYOUT,
  'resistor-220ohm': RESISTOR_LAYOUT,
  'resistor-100ohm': RESISTOR_LAYOUT,
  'resistor-330ohm': RESISTOR_LAYOUT,
  'resistor-1kohm': RESISTOR_LAYOUT,
  'resistor-10kohm': RESISTOR_LAYOUT,
  'resistor-4.7kohm': RESISTOR_LAYOUT,
  'resistor-100kohm': RESISTOR_LAYOUT,
  'fuse-1a': RESISTOR_LAYOUT,
  'potentiometer': POTENTIOMETER,
  'potentiometer-10k': POTENTIOMETER,
  'potentiometer-100k': POTENTIOMETER,
  'trimmer-10k': POTENTIOMETER,
  'cap-ceramic': CAP_CERAMIC_LAYOUT,
  'cap-ceramic-100nf': CAP_CERAMIC_LAYOUT,
  'cap-ceramic-10uf': CAP_CERAMIC_LAYOUT,
  'cap-electrolytic': CAP_ELECTROLYTIC_LAYOUT,
  'cap-electrolytic-100uf': CAP_ELECTROLYTIC_LAYOUT,
  'cap-electrolytic-470uf': CAP_ELECTROLYTIC_LAYOUT,
  'cap-electrolytic-1000uf': CAP_ELECTROLYTIC_LAYOUT,
  'inductor': INDUCTOR_LAYOUT,
  'inductor-10uh': INDUCTOR_LAYOUT,
  'inductor-100uh': INDUCTOR_LAYOUT,
  'diode': DIODE_LAYOUT,
  'diode-1n4007': DIODE_LAYOUT,
  'diode-1n4148': DIODE_LAYOUT,
  'zener-5v1': DIODE_LAYOUT,
  'schottky-1n5819': DIODE_LAYOUT,
  'transistor': TRANSISTOR,
  'npn-2n2222': TRANSISTOR,
  'pnp-2n2907': TRANSISTOR,
  'npn-tip120': TRANSISTOR,
  'mosfet-irf540n': TRANSISTOR,
  'mosfet-irf9540n': TRANSISTOR,
  'mosfet-irlz44n': TRANSISTOR,
  'crystal-16mhz': CAP_CERAMIC_LAYOUT,  // 2-pin, same shape

  // ── Actuators ─────────────────────────────────────────────
  'servo': SERVO,
  'servo-sg90': SERVO,
  'servo-mg996r': SERVO,
  'dc-motor': DC_MOTOR,
  'dc-motor-3v': DC_MOTOR,
  'dc-motor-6v': DC_MOTOR,
  'dc-motor-12v': DC_MOTOR,
  'stepper': STEPPER,
  'stepper-28byj48': STEPPER,
  'stepper-nema17': STEPPER,
  'linear-actuator': DC_MOTOR,
  'solenoid-5v': DC_MOTOR,
  'solenoid-12v': DC_MOTOR,
  'vibration-motor': DC_MOTOR,
  'water-pump': DC_MOTOR,
  'fan-5v': DC_MOTOR,
  'buzzer': BUZZER,
  'buzzer-active': BUZZER,
  'buzzer-passive': BUZZER,
  'speaker-8ohm': BUZZER,
  'relay-module': RELAY_MODULE,
  'relay-4ch': { width: 160, height: 90 },
  'relay-8ch': { width: 220, height: 90 },
  'l298n': L298N,
  '4wd-car-chassis': WD4_CAR_CHASSIS,
  'motor-driver': MOTOR_DRIVER,
  'l293d': {
    width: 120, height: 100,
    pinPositions: {
      '1Y': { x: 10, y: 22, labelSide: 'right' },
      '2Y': { x: 10, y: 38, labelSide: 'right' },
      '3Y': { x: 10, y: 57, labelSide: 'right' },
      '4Y': { x: 10, y: 73, labelSide: 'right' },
      'VCC1': { x: 110, y: 32, labelSide: 'left' },
      'GND': { x: 110, y: 47, labelSide: 'left' },
      'VCC2': { x: 110, y: 62, labelSide: 'left' },
      'EN12': { x: 35, y: 90, labelSide: 'top' },
      '1A': { x: 45, y: 90, labelSide: 'top' },
      '2A': { x: 55, y: 90, labelSide: 'top' },
      '3A': { x: 65, y: 90, labelSide: 'top' },
      '4A': { x: 75, y: 90, labelSide: 'top' },
      'EN34': { x: 85, y: 90, labelSide: 'top' }
    }
  },
  'a4988': {
    width: 120, height: 126,
    pinPositions: {
      'EN': { x: 15, y: 20, labelSide: 'left' },
      'MS1': { x: 15, y: 32, labelSide: 'left' },
      'MS2': { x: 15, y: 44, labelSide: 'left' },
      'MS3': { x: 15, y: 56, labelSide: 'left' },
      'STEP': { x: 15, y: 92, labelSide: 'left' },
      'DIR': { x: 15, y: 104, labelSide: 'left' },
      'VMOT': { x: 105, y: 20, labelSide: 'right' },
      'GND': { x: 105, y: 32, labelSide: 'right' },
      '2B': { x: 105, y: 44, labelSide: 'right' },
      '2A': { x: 105, y: 56, labelSide: 'right' },
      '1A': { x: 105, y: 68, labelSide: 'right' },
      '1B': { x: 105, y: 80, labelSide: 'right' },
      'VCC': { x: 105, y: 92, labelSide: 'right' }
    }
  },
  'drv8825': {
    width: 120, height: 126,
    pinPositions: {
      'EN': { x: 15, y: 20, labelSide: 'left' },
      'M0': { x: 15, y: 32, labelSide: 'left' },
      'M1': { x: 15, y: 44, labelSide: 'left' },
      'M2': { x: 15, y: 56, labelSide: 'left' },
      'STEP': { x: 15, y: 92, labelSide: 'left' },
      'DIR': { x: 15, y: 104, labelSide: 'left' },
      'VMOT': { x: 105, y: 20, labelSide: 'right' },
      'GND': { x: 105, y: 32, labelSide: 'right' },
      'B2': { x: 105, y: 44, labelSide: 'right' },
      'B1': { x: 105, y: 56, labelSide: 'right' },
      'A1': { x: 105, y: 68, labelSide: 'right' },
      'A2': { x: 105, y: 80, labelSide: 'right' },
      'VCC': { x: 105, y: 92, labelSide: 'right' }
    }
  },
  'tb6612fng': {
    width: 120, height: 126,
    pinPositions: {
      'VM': { x: 15, y: 20, labelSide: 'left' },
      'VCC': { x: 15, y: 32, labelSide: 'left' },
      'GND': { x: 15, y: 44, labelSide: 'left' },
      'AO1': { x: 15, y: 56, labelSide: 'left' },
      'AO2': { x: 15, y: 68, labelSide: 'left' },
      'BO2': { x: 15, y: 80, labelSide: 'left' },
      'BO1': { x: 15, y: 92, labelSide: 'left' },
      'PWMA': { x: 105, y: 20, labelSide: 'right' },
      'AIN2': { x: 105, y: 32, labelSide: 'right' },
      'AIN1': { x: 105, y: 44, labelSide: 'right' },
      'STBY': { x: 105, y: 56, labelSide: 'right' },
      'BIN1': { x: 105, y: 68, labelSide: 'right' },
      'BIN2': { x: 105, y: 80, labelSide: 'right' },
      'PWMB': { x: 105, y: 92, labelSide: 'right' }
    }
  },
  'uln2003': { width: 140, height: 85 },

  // ── Communication ─────────────────────────────────────────

  'comm-module': COMM_MODULE,
  'nrf24l01': COMM_MODULE,
  'lora-sx1278': COMM_MODULE,
  'gps-neo6m': COMM_MODULE,
  'gsm-sim800l': COMM_MODULE,
  'rfid-rc522': COMM_MODULE,
  'rs485-module': COMM_MODULE,
  'can-mcp2515': COMM_MODULE,
  'ethernet-w5500': COMM_MODULE,

  // ── Power ─────────────────────────────────────────────────
  'power-module': POWER_MODULE,
  'lm7805': POWER_MODULE,
  'lm7812': POWER_MODULE,
  'lm317': POWER_MODULE,
  'ams1117-3.3': POWER_MODULE,
  'buck-converter': POWER_MODULE,
  'boost-converter': POWER_MODULE,
  'tp4056': POWER_MODULE,
  'battery-9v': BATTERY_9V,
  'battery-holder-2cell': BATTERY_HOLDER_2CELL,
  'battery-aa': BATTERY_9V,
  'battery-lipo-3.7v': BATTERY_9V,
  'battery-18650': BATTERY_9V,
  'solar-panel': SOLAR_PANEL,
  'solar-panel-6v': SOLAR_PANEL,

  // ── Input / Switches ──────────────────────────────────────
  'push-button': PUSH_BUTTON,
  'switch': SWITCH_LAYOUT,
  'toggle-switch': SWITCH_LAYOUT,
  'slide-switch': SWITCH_LAYOUT,
  'dip-switch-4': SWITCH_LAYOUT,
  'rocker-switch': SWITCH_LAYOUT,
  'joystick': JOYSTICK,
  'jumper-wire': JUMPER_WIRE,
  'jumper-mm': JUMPER_WIRE,
  'jumper-mf': JUMPER_WIRE,
  'jumper-ff': JUMPER_WIRE,
  'terminal-block-2': PUSH_BUTTON,
  'header-male-40': JUMPER_WIRE,
  'header-female-40': JUMPER_WIRE,

  // ── ICs (DIP packages) ───────────────────────────────────
  'ic-dip': icDipLayout(['GND', 'TRIG', 'OUT', 'RST', 'VCC', 'DIS', 'THR', 'CTRL']),
  '555-timer': icDipLayout(['GND', 'TRIG', 'OUT', 'RST', 'CTRL', 'THR', 'DIS', 'VCC']),
  'lm741-opamp': icDipLayout(['IN-', 'IN+', 'V-', 'OFFSET1', 'VCC', 'OUT', 'V+', 'OFFSET2', 'NC']),
  'lm358-opamp': icDipLayout(['OUT1', 'IN1-', 'IN1+', 'GND', 'IN2+', 'IN2-', 'OUT2', 'VCC']),
  '74hc595': icDipLayout(['Q0', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'VCC', 'SER', 'SRCLK', 'RCLK', 'OE', 'SRCLR']),
  'pcf8574': icDipLayout(['VCC', 'GND', 'SDA', 'SCL', 'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']),
  'ads1115': icDipLayout(['VCC', 'GND', 'SDA', 'SCL', 'A0', 'A1', 'A2', 'A3']),
  'mcp4725': icDipLayout(['VCC', 'GND', 'SDA', 'SCL', 'OUT']),
  'at24c256': icDipLayout(['VCC', 'GND', 'SDA', 'SCL']),
  'ds3231': icDipLayout(['VCC', 'GND', 'SDA', 'SCL']),
  'ds1307': icDipLayout(['VCC', 'GND', 'SDA', 'SCL']),
  'sd-card-module': icDipLayout(['VCC', 'GND', 'MISO', 'MOSI', 'SCK', 'CS']),
  'dfplayer-mini': icDipLayout(['VCC', 'GND', 'TX', 'RX', 'SPK+', 'SPK-']),
  'pam8403': icDipLayout(['VCC', 'GND', 'L-IN', 'R-IN', 'L+', 'L-', 'R+', 'R-']),
  'optocoupler-817': icDipLayout(['A', 'K', 'E', 'C']),
  'bridge-rectifier': icDipLayout(['AC1', 'AC2', '+', '-']),
  'level-shifter-4ch': icDipLayout(['LV', 'HV', 'GND', 'LV1', 'LV2', 'LV3', 'LV4', 'HV1', 'HV2', 'HV3', 'HV4']),

  // ── Keypads (use sensor-module archetype) ─────────────────
  'keypad-4x4': blueBreakoutLayout(130, 78, ['R1', 'R2', 'R3', 'R4', 'C1', 'C2', 'C3', 'C4']),
  'keypad-4x3': blueBreakoutLayout(130, 78, ['R1', 'R2', 'R3', 'R4', 'C1', 'C2', 'C3']),
}
