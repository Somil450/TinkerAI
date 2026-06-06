import { componentRegistry } from './componentRegistry.js';

// ─── TinkerAI — Self-Trained Generative Expert System ─────────────────────────
// Knows exactly how to wire any combination of components. No external APIs.

// ── MCU helpers ──────────────────────────────────────────────────────────────
function mcuType(id = '') {
  if (id.includes('esp32-s3'))  return 'esp32s3';
  if (id.includes('esp32-c3'))  return 'esp32c3';
  if (id.includes('esp32-cam')) return 'esp32cam';
  if (id.includes('esp32'))     return 'esp32';
  if (id.includes('pico-w'))    return 'picow';
  if (id.includes('pico'))      return 'pico';
  if (id.includes('mega'))      return 'mega';
  if (id.includes('nano'))      return 'nano';
  if (id.includes('leonardo'))  return 'leonardo';
  if (id.includes('due'))       return 'due';
  if (id.includes('stm32'))     return 'stm32';
  if (id.includes('attiny'))    return 'attiny';
  if (id.includes('teensy'))    return 'teensy';
  if (id.includes('microbit'))  return 'microbit';
  return 'uno';
}

function mcuLabel(id = '') {
  return ({
    esp32s3:'ESP32-S3',      esp32c3:'ESP32-C3',   esp32cam:'ESP32-CAM',
    esp32:'ESP32',           picow:'Pi Pico W',    pico:'Raspberry Pi Pico',
    mega:'Arduino Mega',     nano:'Arduino Nano',  leonardo:'Arduino Leonardo',
    due:'Arduino Due',       stm32:'STM32 BluePill',attiny:'ATtiny85',
    teensy:'Teensy 4.0',     microbit:'BBC micro:bit', uno:'Arduino Uno',
  })[mcuType(id)] || 'Arduino Uno';
}

// ── Real MCU Pin Tables ───────────────────────────────────────────────────────
const MCU_PINS = {
  uno:     { i2c:{sda:'A4', scl:'A5'}, spi:{mosi:'D11', miso:'D12', sck:'D13'},
             pwm:['D3','D5','D6','D9','D10','D11'],
             digital:['D2','D4','D7','D8','D12','D13'],
             analog:['A0','A1','A2','A3'],
             rx:'D0(RX)', tx:'D1(TX)', power5:'5V', power33:'3.3V' },
  nano:    { i2c:{sda:'A4', scl:'A5'}, spi:{mosi:'D11', miso:'D12', sck:'D13'},
             pwm:['D3','D5','D6','D9','D10','D11'],
             digital:['D2','D4','D7','D8','D12'],
             analog:['A0','A1','A2','A3','A6','A7'],
             rx:'D0(RX)', tx:'D1(TX)', power5:'5V', power33:'3.3V' },
  mega:    { i2c:{sda:'Pin 20 (SDA)', scl:'Pin 21 (SCL)'}, spi:{mosi:'D51', miso:'D50', sck:'D52'},
             pwm:['D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D44','D45','D46'],
             digital:['D22','D23','D24','D25','D26','D27','D28','D29','D30','D31','D32','D33','D34','D35','D36','D37','D38','D39','D40','D41','D42','D43'],
             analog:['A0','A1','A2','A3','A4','A5','A6','A7','A8','A9'],
             rx:'RX1(Pin19)', tx:'TX1(Pin18)', power5:'5V', power33:'3.3V' },
  esp32:   { i2c:{sda:'GPIO21', scl:'GPIO22'}, spi:{mosi:'GPIO23', miso:'GPIO19', sck:'GPIO18'},
             pwm:['GPIO25','GPIO26','GPIO27','GPIO14','GPIO12','GPIO13','GPIO15','GPIO2','GPIO4','GPIO16','GPIO17'],
             digital:['GPIO5','GPIO32','GPIO33','GPIO34','GPIO35','GPIO36','GPIO39'],
             analog:['GPIO34','GPIO35','GPIO36','GPIO39','GPIO32','GPIO33'],
             rx:'GPIO16(RX2)', tx:'GPIO17(TX2)', power5:'VIN/5V', power33:'3.3V' },
  esp32s3: { i2c:{sda:'GPIO8', scl:'GPIO9'}, spi:{mosi:'GPIO11', miso:'GPIO13', sck:'GPIO12'},
             pwm:['GPIO1','GPIO2','GPIO3','GPIO4','GPIO5','GPIO6','GPIO7','GPIO15','GPIO16','GPIO17','GPIO18'],
             digital:['GPIO10','GPIO14','GPIO21','GPIO47','GPIO48'],
             analog:['GPIO1','GPIO2','GPIO3','GPIO4','GPIO5','GPIO6','GPIO7','GPIO8','GPIO9','GPIO10'],
             rx:'GPIO44(RX0)', tx:'GPIO43(TX0)', power5:'5V', power33:'3.3V' },
  esp32cam:{ i2c:{sda:'GPIO14', scl:'GPIO15'}, spi:{mosi:'GPIO13', miso:'GPIO12', sck:'GPIO14'},
             pwm:['IO12','IO13','IO16','IO0'],
             digital:['IO0','IO1','IO2','IO3','IO4','IO16'],
             analog:['IO34','IO35'],
             rx:'U0R(RX)', tx:'U0T(TX)', power5:'5V', power33:'3.3V' },
  pico:    { i2c:{sda:'GP4', scl:'GP5'}, spi:{mosi:'GP19', miso:'GP16', sck:'GP18'},
             pwm:['GP0','GP1','GP2','GP3','GP10','GP11','GP12','GP13','GP14','GP15'],
             digital:['GP6','GP7','GP8','GP9','GP20','GP21','GP22'],
             analog:['GP26','GP27','GP28'],
             rx:'GP1(UART0 RX)', tx:'GP0(UART0 TX)', power5:'VSYS', power33:'3.3V' },
  stm32:   { i2c:{sda:'PB7', scl:'PB6'}, spi:{mosi:'PA7', miso:'PA6', sck:'PA5'},
             pwm:['PA0','PA1','PA2','PA3','PA8','PA9','PA10'],
             digital:['PB0','PB1','PB9','PB10','PB11','PB12','PB13','PB14','PB15'],
             analog:['PA0','PA1','PA2','PA3','PA4','PA5','PA6','PA7'],
             rx:'PA10(RX1)', tx:'PA9(TX1)', power5:'5V', power33:'3.3V' },
};

function getPins(mcuId) { return MCU_PINS[mcuType(mcuId)] || MCU_PINS.uno; }

// ── Pin Allocator ─────────────────────────────────────────────────────────────
class PinAllocator {
  constructor(mcuId) {
    this.mcuId = mcuId;
    this.pins = getPins(mcuId);
    this.used = new Set();
    this.i2cAllocated = false;
    this.spiAllocated = false;
  }
  i2c()     { this.i2cAllocated = true; Object.values(this.pins.i2c).forEach(p=>this.used.add(p)); return this.pins.i2c; }
  spi()     { this.spiAllocated = true; Object.values(this.pins.spi).forEach(p=>this.used.add(p)); return this.pins.spi; }
  pwm()     { for(const p of this.pins.pwm) { if(!this.used.has(p)){this.used.add(p);return p;} } return 'No free PWM'; }
  digital() { for(const p of [...this.pins.pwm,...this.pins.digital]) { if(!this.used.has(p)){this.used.add(p);return p;} } return 'No free GPIO'; }
  analog()  { for(const p of this.pins.analog) { if(!this.used.has(p)){this.used.add(p);return p;} } return 'No free ADC'; }
  rx()      { this.used.add(this.pins.rx); return this.pins.rx; }
  tx()      { this.used.add(this.pins.tx); return this.pins.tx; }
  power(v)  { return (v && v <= 3.3) ? this.pins.power33 : this.pins.power5; }
  gnd()     { return 'GND'; }
}

// ── Component Wiring Knowledge Base ──────────────────────────────────────────
// Every component type has a wiring() function that returns [['Pin','Target'], ...]
// alloc = PinAllocator, ctx = { sensors, mcuLabel, mcuId }

const WIRING_KB = {

  // ── Power / supply pins (common rule used by many) ──
  _power(pinName, pinDef, alloc) {
    const v = pinDef.voltage;
    const n = pinName.toUpperCase();
    if (n === '12V' || n === 'VMOT' || n === '12.6V') return 'External 12V Battery (+)';
    if (n === 'VIN'  || n === 'IN+' || n === 'VIN+')  return 'External Battery / VIN (+)';
    if (n === '5V'   || n === 'V+')                    return alloc.power(5);
    if (n === '3.3V' || n === '3V3')                   return alloc.power(3.3);
    return alloc.power(v);
  },

  // ── Smart universal pin router — understands every pin name in the registry ──
  generic(compData, alloc, ctx) {
    const rows = [];
    const pins = compData.pins || {};
    let i2cPins = null;
    let spiPins = null;

    // First pass: detect shared bus needs
    for (const [name] of Object.entries(pins)) {
      const n = name.toUpperCase();
      if (n === 'SDA' || n === 'EDA')               { if (!i2cPins) i2cPins = alloc.i2c(); }
      if (n === 'MOSI' || n === 'DIN' || n === 'SDI'){ if (!spiPins) spiPins = alloc.spi(); }
      if (n === 'SCK'  || n === 'CLK' || n === 'SCLK' || n === 'SHCP') { if (!spiPins) spiPins = alloc.spi(); }
    }

    // Second pass: smart semantic allocation per pin name
    for (const [name, def] of Object.entries(pins)) {
      const n = name.toUpperCase();
      const t = def.type || '';
      let target = '';

      // ── Ground ────────────────────────────────────────────────────────────
      if (t === 'ground' || ['GND','VSS','CATHODE','AGND','PGND','K','E','IN-','VIN-','VOUT-','OUT-','P-','B-','0V'].includes(n)) {
        target = alloc.gnd();

      // ── Power ─────────────────────────────────────────────────────────────
      } else if (t === 'power' || ['VCC','VDD','5V','3.3V','3V3','VIN','V+','VCC1','VCC2','VOUT+','OUT+','P+','B+','VSYS','VREF','VMOT','12V','VIN+','IN+','8.4V','4.2V','12.6V'].includes(n)) {
        target = WIRING_KB._power(name, def, alloc);

      // ── I2C ───────────────────────────────────────────────────────────────
      } else if (n === 'SDA' || n === 'EDA' || t === 'i2c_sda') {
        target = i2cPins ? i2cPins.sda : alloc.digital();
      } else if (n === 'SCL' || n === 'ECL' || t === 'i2c_scl') {
        target = i2cPins ? i2cPins.scl : alloc.digital();

      // ── SPI ───────────────────────────────────────────────────────────────
      } else if (n === 'MOSI' || n === 'DIN' || n === 'SDI' || n === 'DS' || n === 'SDA_SPI' || t === 'spi_mosi') {
        target = spiPins ? spiPins.mosi : alloc.digital();
      } else if (n === 'MISO' || n === 'DOUT' || n === 'SDO' || n === 'SO' || t === 'spi_miso') {
        target = spiPins ? spiPins.miso : alloc.digital();
      } else if (['SCK','CLK','SCLK','SHCP','STCP_CLK'].includes(n) || t === 'spi_sck') {
        target = spiPins ? spiPins.sck : alloc.digital();
      } else if (['CS','CSN','CE','SS','NSS','STCP','LATCH','CS_N','SDA_CS'].includes(n) || t === 'spi_cs') {
        target = alloc.digital();

      // ── UART ──────────────────────────────────────────────────────────────
      } else if (t === 'rx' || ['RX','RXD','U0R','R1IN','RXI'].includes(n)) {
        target = alloc.tx() + ' (cross-connect RX←TX)';
      } else if (t === 'tx' || ['TX','TXD','U0T','T1OUT','TXO'].includes(n)) {
        target = alloc.rx() + ' (cross-connect TX→RX)';

      // ── PWM / Enable ──────────────────────────────────────────────────────
      } else if (t === 'pwm' || ['ENA','ENB','EN','PWM','RPWM','LPWM','R_EN','L_EN','SIGNAL','SIG','IN1','IN2','IN3','IN4'].includes(n)) {
        if (['IN1','IN2','IN3','IN4'].includes(n)) target = alloc.digital();
        else target = alloc.pwm();

      // ── Analog inputs ─────────────────────────────────────────────────────
      } else if (t === 'analog_input' || t === 'analog_output' || ['AO','AOUT','A0','VRX','VRY','OUT','PO','SIGNAL_A','ANALOG'].includes(n)) {
        target = alloc.analog();

      // ── Digital I/O by common names ───────────────────────────────────────
      } else if (['DO','DOUT','DIGITAL','TRIG','ECHO','DATA','DT','IO','INT','IRQ','BUSY','RST','RESET','XSHUT','SET','OE','MR',
                  'S0','S1','S2','S3','SW','CLK_KEY','DIO','STBY','A','C',
                  'DRDY','ADDR','AD0','IO0','IO16','GPIO0','GPIO1'].includes(n)
                 || n.startsWith('IN') || n.startsWith('D') && /^D\d+$/.test(n)) {
        target = alloc.digital();

      // ── Motor outputs (go to actuator) ────────────────────────────────────
      } else if (t === 'motor' || ['OUT1','OUT2','OUT3','OUT4','MOTA','MOTB','A01','A02','B01','B02','M+','M-','1Y','2Y','3Y','4Y'].includes(n)) {
        target = 'Connect to Motor/Actuator';

      // ── Power connector passthrough ────────────────────────────────────────
      } else if (['+','-'].includes(n)) {
        target = n === '+' ? 'Power Rail (+)' : 'GND';

      // ── Misc / Unknown → digital ──────────────────────────────────────────
      } else {
        target = alloc.digital();
      }
      rows.push([name, target]);
    }
    return rows;
  },
};


// ── Specialized overrides for tricky components ───────────────────────────────
// Returns null to fall back to generic routing, or an array of [pin, target] rows

function specializedWiring(compData, alloc, ctx) {
  const id = compData.id || '';
  const cat = compData.category || '';

  // ── MCUs used as PERIPHERALS (secondary MCU in a multi-MCU build) ─────────
  if (cat === 'Microcontroller' && id !== ctx.mcuId) {
    if (id.includes('esp32-cam')) {
      return [
        ['5V',         alloc.power(5)],
        ['GND',        'GND'],
        ['U0R (RX)',   alloc.tx() + ' (Cam RX ← Master TX — cross-connect)'],
        ['U0T (TX)',   alloc.rx() + ' (Cam TX → Master RX — cross-connect)'],
        ['IO0',        'GND to flash / Float or 3.3V for run'],
      ];
    }
    if (id.includes('esp8266')) {
      return [
        ['VCC',   alloc.power(3.3)],
        ['GND',   'GND'],
        ['TX',    alloc.rx() + ' (ESP TX → Master RX)'],
        ['RX',    alloc.tx() + ' (ESP RX ← Master TX, via voltage divider if 5V MCU)'],
        ['CH_PD', alloc.power(3.3) + ' (must be HIGH to enable chip)'],
        ['GPIO0', '3.3V (normal boot) / GND (flash mode)'],
      ];
    }
    // Generic MCU-to-MCU: UART communication
    return [
      [mcuLabel(id) + ' TX',   alloc.rx() + ' → Master RX (cross-connect)'],
      [mcuLabel(id) + ' RX',   alloc.tx() + ' → Master TX (cross-connect)'],
      [mcuLabel(id) + ' GND',  'GND (common ground)'],
      [mcuLabel(id) + ' VCC',  alloc.power(5)],
    ];
  }

  // ── LEDS ──────────────────────────────────────────────────────────────────
  if (id.startsWith('led-') || id === 'rgb-led') {
    if (id === 'rgb-led') {
      const r = alloc.pwm(), g = alloc.pwm(), b = alloc.pwm();
      return [['Red (R)', r], ['Green (G)', g], ['Blue (B)', b], ['Common (GND)', 'GND (with 3x 220Ω resistors)']];
    }
    const pin = alloc.digital();
    return [
      ['Anode (+)', `${pin} (via 220Ω resistor)`],
      ['Cathode (−)', 'GND'],
    ];
  }

  // ── RESISTORS ────────────────────────────────────────────────────────────
  if (cat === 'Passive' && id.startsWith('resistor')) {
    return [['Lead 1', 'Component pin (e.g. LED Anode)'], ['Lead 2', 'MCU GPIO pin']];
  }

  // ── BUTTONS & SWITCHES ───────────────────────────────────────────────────
  if (id === 'push-button' || id === 'toggle-switch' || id.includes('switch')) {
    const pin = alloc.digital();
    return [['Pin 1', `${pin} (via 10kΩ pull-up to 3.3V / 5V)`], ['Pin 2', 'GND']];
  }

  // ── RELAY MODULE ─────────────────────────────────────────────────────────
  if (id.includes('relay')) {
    const sig = alloc.digital();
    return [
      ['VCC',  alloc.power(5)],
      ['GND',  'GND'],
      ['IN',   sig + ' (LOW = ON)'],
      ['COM',  'Load positive wire'],
      ['NO',   'Load positive terminal (Normally Open)'],
      ['NC',   'Load positive terminal (Normally Closed)'],
    ];
  }

  // ── MOTORS (DC / Chassis) need motor driver ──────────────────────────────
  if ((cat === 'Actuator' && !id.includes('servo')) || id.includes('dc-motor') || id.includes('chassis')) {
    const driver = ctx.sensors.find(s => componentRegistry.components.get(s)?.category === 'Motor Driver');
    const driverData = driver ? componentRegistry.components.get(driver) : null;
    const dname = driverData ? driverData.name : 'Motor Driver';
    const pins = compData.pins || {};
    const rows = [];
    const pinNames = Object.keys(pins);
    const motorPairs = [];
    for (let i = 0; i < pinNames.length; i += 2) {
      motorPairs.push([pinNames[i], pinNames[i+1]]);
    }
    motorPairs.forEach((pair, idx) => {
      const isLeft = idx < motorPairs.length / 2;
      const side = isLeft ? 'A' : 'B';
      if (pair[0]) rows.push([pair[0], `${dname} OUT${isLeft ? '1' : '3'}`]);
      if (pair[1]) rows.push([pair[1], `${dname} OUT${isLeft ? '2' : '4'}`]);
    });
    return rows;
  }

  // ── MOTOR DRIVER (L298N etc.) ────────────────────────────────────────────
  if (cat === 'Motor Driver') {
    const d = alloc.digital, p = alloc.pwm.bind(alloc);
    if (id === 'l298n') {
      const in1=alloc.digital(), in2=alloc.digital(), in3=alloc.digital(), in4=alloc.digital();
      const ena=alloc.pwm(), enb=alloc.pwm();
      return [
        ['12V',  'External 12V Battery (+)'],
        ['GND',  'GND (common with MCU)'],
        ['5V',   alloc.power(5) + ' (if using onboard regulator)'],
        ['IN1',  in1 + ' — Motor A direction'],
        ['IN2',  in2 + ' — Motor A direction'],
        ['IN3',  in3 + ' — Motor B direction'],
        ['IN4',  in4 + ' — Motor B direction'],
        ['ENA',  ena + ' (PWM — Motor A speed)'],
        ['ENB',  enb + ' (PWM — Motor B speed)'],
        ['OUT1', 'Motor A (+)'],
        ['OUT2', 'Motor A (−)'],
        ['OUT3', 'Motor B (+)'],
        ['OUT4', 'Motor B (−)'],
      ];
    }
    if (id === 'l298n-mini') {
      const in1=alloc.digital(), in2=alloc.digital(), in3=alloc.digital(), in4=alloc.digital();
      return [
        ['VCC',  alloc.power(5)],
        ['GND',  'GND'],
        ['IN1',  in1], ['IN2', in2],
        ['IN3',  in3], ['IN4', in4],
        ['MOTA', 'Motor A'],
        ['MOTB', 'Motor B'],
      ];
    }
    if (id === 'l293d') {
      const a1=alloc.digital(), a2=alloc.digital(), a3=alloc.digital(), a4=alloc.digital();
      return [
        ['VCC1', alloc.power(5) + ' (logic)'],
        ['VCC2', 'External Motor Voltage (+)'],
        ['GND',  'GND'],
        ['1A',   a1], ['2A', a2], ['3A', a3], ['4A', a4],
        ['EN12', alloc.pwm() + ' (Motor A enable)'],
        ['EN34', alloc.pwm() + ' (Motor B enable)'],
        ['1Y',   'Motor A (+)'], ['2Y', 'Motor A (−)'],
        ['3Y',   'Motor B (+)'], ['4Y', 'Motor B (−)'],
      ];
    }
    if (id === 'tb6612fng') {
      return [
        ['VM',    'External Motor Voltage (max 15V)'],
        ['VCC',   alloc.power(3.3)],
        ['GND',   'GND'],
        ['STBY',  alloc.digital() + ' (HIGH = active)'],
        ['AIN1',  alloc.digital()], ['AIN2', alloc.digital()],
        ['PWMA',  alloc.pwm()],
        ['BIN1',  alloc.digital()], ['BIN2', alloc.digital()],
        ['PWMB',  alloc.pwm()],
        ['A01',   'Motor A (+)'], ['A02', 'Motor A (−)'],
        ['B01',   'Motor B (+)'], ['B02', 'Motor B (−)'],
      ];
    }
    if (id === 'a4988' || id === 'drv8825') {
      return [
        ['VMOT',  'External Motor Voltage (8-35V)'],
        ['GND',   'GND'],
        ['VDD',   alloc.power(3.3)],
        ['STEP',  alloc.digital()],
        ['DIR',   alloc.digital()],
        ['EN',    alloc.digital() + ' (LOW = enabled)'],
        ['MS1',   alloc.digital() + ' (microstepping)'],
        ['MS2',   alloc.digital()],
        ['MS3',   alloc.digital()],
        ['1A/1B', 'Stepper coil 1'],
        ['2A/2B', 'Stepper coil 2'],
      ];
    }
    if (id === 'pca9685') {
      const i2c = alloc.i2c();
      return [
        ['VCC',  alloc.power(5)],
        ['GND',  'GND'],
        ['SDA',  i2c.sda],
        ['SCL',  i2c.scl],
        ['OE',   'GND (always active)'],
        ['V+',   'Servo power 5-6V (separate supply recommended)'],
        ['PWM0-15','Servo signal wires (yellow/white)'],
      ];
    }
    if (id === 'uln2003') {
      const in1=alloc.digital(), in2=alloc.digital(), in3=alloc.digital(), in4=alloc.digital();
      return [
        ['IN1', in1], ['IN2', in2], ['IN3', in3], ['IN4', in4],
        ['OUT1','Stepper coil 1 (Blue)'], ['OUT2','Stepper coil 2 (Pink)'],
        ['OUT3','Stepper coil 3 (Yellow)'], ['OUT4','Stepper coil 4 (Orange)'],
        ['VCC', alloc.power(5)], ['GND','GND'],
      ];
    }
    if (id === 'bts7960') {
      return [
        ['B+',  'External Battery (+)'],
        ['B-',  'GND'],
        ['RPWM', alloc.pwm() + ' (forward speed)'],
        ['LPWM', alloc.pwm() + ' (reverse speed)'],
        ['REN',  alloc.digital()], ['LEN', alloc.digital()],
        ['VCC',  alloc.power(5)], ['GND', 'GND'],
        ['M+',  'Motor (+)'], ['M−', 'Motor (−)'],
      ];
    }
  }

  // ── SERVOS ────────────────────────────────────────────────────────────────
  if (id.includes('servo')) {
    const pwmPin = alloc.pwm();
    return [
      ['Signal (Orange/Yellow)', pwmPin + ' (PWM)'],
      ['VCC (Red)',               alloc.power(5)],
      ['GND (Brown/Black)',       'GND'],
    ];
  }

  // ── STEPPER (28BYJ-48) ────────────────────────────────────────────────────
  if (id === 'stepper-28byj48') {
    const d1=alloc.digital(), d2=alloc.digital(), d3=alloc.digital(), d4=alloc.digital();
    return [
      ['IN1 (Blue)',   d1 + ' → ULN2003 IN1'],
      ['IN2 (Pink)',   d2 + ' → ULN2003 IN2'],
      ['IN3 (Yellow)', d3 + ' → ULN2003 IN3'],
      ['IN4 (Orange)', d4 + ' → ULN2003 IN4'],
      ['VCC (Red)',    alloc.power(5)],
    ];
  }

  // ── BUZZER ────────────────────────────────────────────────────────────────
  if (id === 'active-buzzer' || id === 'passive-buzzer') {
    const p = id === 'passive-buzzer' ? alloc.pwm() : alloc.digital();
    return [
      ['+ (VCC)', p + (id === 'passive-buzzer' ? ' (PWM)' : ' (HIGH = ON)')],
      ['- (GND)', 'GND'],
    ];
  }

  // ── DISPLAYS ──────────────────────────────────────────────────────────────
  if (id.includes('lcd-16x2') || id.includes('lcd-20x4')) {
    const i2c = alloc.i2c();
    return [
      ['VCC',  alloc.power(5)],
      ['GND',  'GND'],
      ['SDA',  i2c.sda + ' (via I2C backpack — use I2C adapter!)'],
      ['SCL',  i2c.scl],
    ];
  }
  if (id.includes('oled') || id.includes('ssd1306') || id.includes('sh1106')) {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SDA', i2c.sda],
      ['SCL', i2c.scl],
    ];
  }
  if (id.includes('tft') || id.includes('st7735') || id.includes('ili9341')) {
    const spi = alloc.spi();
    return [
      ['VCC',  alloc.power(3.3)],
      ['GND',  'GND'],
      ['MOSI', spi.mosi],
      ['SCK',  spi.sck],
      ['CS',   alloc.digital()],
      ['RST',  alloc.digital()],
      ['DC',   alloc.digital()],
      ['MISO', spi.miso + ' (optional, for read-back)'],
      ['LED',  alloc.power(3.3) + ' (or PWM for brightness)'],
    ];
  }
  if (id === 'seg7-4digit' || id === 'tm1637-display') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['CLK', alloc.digital()],
      ['DIO', alloc.digital()],
    ];
  }
  if (id === 'led-matrix-max7219' || id === 'max7219-matrix') {
    const spi = alloc.spi();
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['DIN', spi.mosi],
      ['CS',  alloc.digital()],
      ['CLK', spi.sck],
    ];
  }
  if (id === 'neopixel-ring' || id === 'neopixel-strip' || id.includes('ws2812')) {
    return [
      ['VCC / 5V', alloc.power(5) + ' (use external 5V for >8 LEDs)'],
      ['GND',      'GND'],
      ['DATA IN',  alloc.digital() + ' (via 300Ω resistor in series)'],
    ];
  }
  if (id === 'epaper-display') {
    const spi = alloc.spi();
    return [
      ['VCC', alloc.power(3.3)], ['GND', 'GND'],
      ['MOSI', spi.mosi], ['SCK', spi.sck],
      ['CS',  alloc.digital()], ['DC', alloc.digital()], ['RST', alloc.digital()], ['BUSY', alloc.digital()],
    ];
  }

  // ── SENSORS ───────────────────────────────────────────────────────────────
  if (id === 'hc-sr04') {
    return [
      ['VCC',  alloc.power(5)],
      ['GND',  'GND'],
      ['TRIG', alloc.digital() + ' (send 10µs pulse)'],
      ['ECHO', alloc.digital() + ' (receive reflection)'],
    ];
  }
  if (id === 'dht22' || id === 'dht11') {
    const pin = alloc.digital();
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['DATA', pin + ' (via 10kΩ pull-up to VCC)'],
      ['NC', 'Not connected'],
    ];
  }
  if (id === 'mpu6050' || id === 'mpu9250') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['INT', alloc.digital() + ' (optional — interrupt)'],
      ['AD0', 'GND (I2C addr 0x68) or 3.3V (addr 0x69)'],
    ];
  }
  if (id === 'bme280' || id === 'bmp280') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['CSB', alloc.power(3.3) + ' (I2C mode)'],
      ['SDO', 'GND (addr 0x76) or 3.3V (addr 0x77)'],
    ];
  }
  if (id === 'hc-05' || id === 'hc-06') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['TXD', alloc.rx() + ' (cross-connect: BT TX → MCU RX)'],
      ['RXD', alloc.tx() + ' (cross-connect: BT RX → MCU TX, via 1kΩ voltage divider if 5V MCU)'],
      ['STATE', 'Leave floating (optional LED indicator)'],
      ['EN/KEY', 'Leave floating (or 3.3V for AT mode)'],
    ];
  }
  if (id === 'esp8266') {
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['TX',  alloc.rx() + ' (cross-connect)'],
      ['RX',  alloc.tx() + ' (cross-connect, via 3.3V divider)'],
      ['CH_PD', alloc.power(3.3) + ' (must be HIGH to enable)'],
      ['GPIO0', 'Pull HIGH (3.3V) for normal boot, GND for flash mode'],
    ];
  }
  if (id === 'nrf24l01') {
    const spi = alloc.spi();
    return [
      ['VCC',  alloc.power(3.3) + ' ⚠️ 3.3V only! (Use 100µF cap across VCC-GND)'],
      ['GND',  'GND'],
      ['MOSI', spi.mosi],
      ['SCK',  spi.sck],
      ['MISO', spi.miso],
      ['CSN',  alloc.digital()],
      ['CE',   alloc.digital()],
      ['IRQ',  alloc.digital() + ' (optional interrupt)'],
    ];
  }
  if (id === 'rc522' || id === 'rfid-rc522') {
    const spi = alloc.spi();
    return [
      ['3.3V', alloc.power(3.3) + ' ⚠️ 3.3V only!'],
      ['GND',  'GND'],
      ['MOSI', spi.mosi],
      ['MISO', spi.miso],
      ['SCK',  spi.sck],
      ['SDA/SS', alloc.digital()],
      ['RST',  alloc.digital()],
      ['IRQ',  'Leave floating (optional)'],
    ];
  }
  if (id === 'neo-6m' || id === 'gps-neo6m') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['TXD', alloc.rx() + ' (GPS TX → MCU RX)'],
      ['RXD', alloc.tx() + ' (GPS RX ← MCU TX)'],
    ];
  }
  if (id === 'sim800l' || id === 'sim900a') {
    return [
      ['VCC', 'External 4V (lithium cell — ⚠️ NOT 5V from MCU)'],
      ['GND', 'GND (common)'],
      ['TXD', alloc.rx() + ' (cross-connect)'],
      ['RXD', alloc.tx() + ' (cross-connect)'],
      ['RST', alloc.digital() + ' (optional reset)'],
    ];
  }
  if (id === 'lora-sx1278') {
    const spi = alloc.spi();
    return [
      ['VCC',  alloc.power(3.3)],
      ['GND',  'GND'],
      ['MOSI', spi.mosi],
      ['MISO', spi.miso],
      ['SCK',  spi.sck],
      ['NSS',  alloc.digital() + ' (Chip Select)'],
      ['RST',  alloc.digital()],
      ['DIO0', alloc.digital() + ' (interrupt)'],
    ];
  }
  if (id === 'pir-sensor') {
    return [
      ['VCC',  alloc.power(5)],
      ['GND',  'GND'],
      ['OUT',  alloc.digital() + ' (HIGH when motion detected)'],
    ];
  }
  if (id === 'ldr') {
    return [
      ['One Lead', alloc.power(5)],
      ['Other Lead', alloc.analog() + ' and GND via 10kΩ (voltage divider)'],
    ];
  }
  if (id === 'ir-sensor') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['DO',  alloc.digital() + ' (digital output — obstacle detected)'],
      ['AO',  alloc.analog() + ' (optional analog distance value)'],
    ];
  }
  if (id === 'ir-receiver') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['OUT', alloc.digital() + ' (connect via 10Ω resistor recommended)'],
    ];
  }
  if (id === 'mq2-gas' || id === 'mq135-air' || id === 'mq3-alcohol' || id === 'mq7-co' || id === 'mq8-h2') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['AO',  alloc.analog() + ' (analog gas concentration)'],
      ['DO',  alloc.digital() + ' (digital threshold output)'],
    ];
  }
  if (id === 'soil-moisture') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['A0',  alloc.analog() + ' (moisture level)'],
      ['D0',  alloc.digital() + ' (digital dry/wet output)'],
    ];
  }
  if (id === 'water-level') {
    return [
      ['VCC',  alloc.power(5)],
      ['GND',  'GND'],
      ['Signal', alloc.analog() + ' (water level reading)'],
    ];
  }
  if (id === 'ds18b20') {
    return [
      ['VCC (Red)',   alloc.power(5)],
      ['GND (Black)', 'GND'],
      ['DATA (Yellow)', alloc.digital() + ' (via 4.7kΩ pull-up to VCC)'],
    ];
  }
  if (id === 'acs712') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['OUT', alloc.analog() + ' (2.5V = 0A, sensitivity 66-185mV/A)'],
      ['IP+', 'Load current input (+)'],
      ['IP-', 'Load current output (−)'],
    ];
  }
  if (id === 'hx711') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['SCK', alloc.digital() + ' (clock)'],
      ['DT',  alloc.digital() + ' (data)'],
    ];
  }
  if (id === 'max30102') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['INT', alloc.digital() + ' (optional interrupt)'],
    ];
  }
  if (id === 'adxl345') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['INT1', alloc.digital() + ' (optional)'],
      ['CS',  alloc.power(3.3) + ' (I2C mode)'],
      ['SDO', 'GND (addr 0x53) or 3.3V (addr 0x1D)'],
    ];
  }
  if (id === 'tcs3200') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['S0',  alloc.digital()], ['S1', alloc.digital()],
      ['S2',  alloc.digital()], ['S3', alloc.digital()],
      ['OUT', alloc.digital() + ' (PWM output — frequency ∝ color)'],
      ['OE',  'GND (always on)'],
    ];
  }
  if (id === 'fingerprint-r307') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['TXD', alloc.rx() + ' (cross-connect)'],
      ['RXD', alloc.tx() + ' (cross-connect)'],
    ];
  }
  if (id === 'mlx90614') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl + ' (via 4.7kΩ pull-up)'],
      ['SDA', i2c.sda + ' (via 4.7kΩ pull-up)'],
    ];
  }
  if (id === 'vl53l0x') {
    const i2c = alloc.i2c();
    return [
      ['VCC',  alloc.power(2.8)],
      ['GND',  'GND'],
      ['SCL',  i2c.scl],
      ['SDA',  i2c.sda],
      ['XSHUT', alloc.digital() + ' (optional — power off)'],
      ['GPIO1', alloc.digital() + ' (optional — interrupt)'],
    ];
  }

  // ── ICs ───────────────────────────────────────────────────────────────────
  if (id === 'ne555') {
    return [
      ['Pin 1 (GND)',    'GND'],
      ['Pin 2 (TRIG)',   'Trigger input (< 1/3 VCC activates)'],
      ['Pin 3 (OUT)',    'Output to load'],
      ['Pin 4 (RST)',    alloc.power(5) + ' (keep HIGH for normal operation)'],
      ['Pin 5 (CTRL)',   '0.1µF capacitor to GND (noise filter)'],
      ['Pin 6 (THR)',    'Connected to capacitor for timing'],
      ['Pin 7 (DIS)',    'Discharge capacitor via resistor'],
      ['Pin 8 (VCC)',    alloc.power(5)],
    ];
  }
  if (id === 'shift-reg-595' || id === 'hc595') {
    const spi = alloc.spi();
    return [
      ['VCC (Pin 16)', alloc.power(5)],
      ['GND (Pin 8)',  'GND'],
      ['DS (Pin 14)',  spi.mosi + ' (Serial Data)'],
      ['SH_CP (Pin 11)', spi.sck + ' (Shift Clock)'],
      ['ST_CP (Pin 12)', alloc.digital() + ' (Latch)'],
      ['OE (Pin 13)',  'GND (output always on)'],
      ['MR (Pin 10)',  alloc.power(5) + ' (no reset)'],
      ['Qa-Qh',       'Output pins (connect to LEDs/devices via resistors)'],
    ];
  }
  if (id === 'rtc-ds3231' || id === 'rtc-ds1307') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['SQW', alloc.digital() + ' (optional 1Hz square wave)'],
      ['32K', alloc.digital() + ' (optional 32kHz output)'],
    ];
  }
  if (id === 'sd-card-module') {
    const spi = alloc.spi();
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['MOSI', spi.mosi],
      ['MISO', spi.miso],
      ['SCK',  spi.sck],
      ['CS',   alloc.digital()],
    ];
  }
  if (id === 'ads1115') {
    const i2c = alloc.i2c();
    return [
      ['VDD', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['ADDR', 'GND (addr 0x48)'],
      ['ALRT', alloc.digital() + ' (optional alert)'],
      ['A0-A3', 'Analog sensors / voltage dividers'],
    ];
  }
  if (id === 'dfplayer-mini') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['TX',  alloc.rx() + ' (cross-connect, via 1kΩ)'],
      ['RX',  alloc.tx() + ' (cross-connect)'],
      ['BUSY', alloc.digital() + ' (LOW when playing)'],
      ['SPK1/SPK2', '8Ω speaker (connect across these two pins)'],
    ];
  }
  if (id === 'pam8403') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['IN-L', alloc.pwm() + ' (left audio)'],
      ['IN-R', alloc.pwm() + ' (right audio)'],
      ['OUT-L+/OUT-L-', 'Left speaker'],
      ['OUT-R+/OUT-R-', 'Right speaker'],
    ];
  }
  if (id === 'tca9548a') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['A0/A1/A2', 'GND (I2C addr 0x70)'],
      ['SC0-SC7 / SD0-SD7', 'Downstream I2C device channels'],
      ['RST', alloc.digital() + ' (optional, pull HIGH)'],
    ];
  }
  if (id === 'pcf8574') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['A0/A1/A2', 'Set I2C address (GND or VCC)'],
      ['P0-P7', 'Expandable digital I/O pins'],
    ];
  }
  if (id === 'level-shifter') {
    return [
      ['LV',  alloc.power(3.3) + ' (3.3V side)'],
      ['HV',  alloc.power(5)   + ' (5V side)'],
      ['GND', 'GND'],
      ['LVn', '3.3V device signal pins'],
      ['HVn', '5V device signal pins'],
    ];
  }
  if (id === 'ch340g' || id === 'cp2102') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['TXD', alloc.rx() + ' (USB-UART TX → MCU RX)'],
      ['RXD', alloc.tx() + ' (USB-UART RX ← MCU TX)'],
    ];
  }

  // ── POWER COMPONENTS ──────────────────────────────────────────────────────
  if (id === 'lm7805') {
    return [
      ['IN',  'Input voltage 7-35V (+)'],
      ['GND', 'GND'],
      ['OUT', alloc.power(5) + ' → MCU VIN / 5V rail'],
    ];
  }
  if (id === 'lm2596-buck' || id === 'buck-converter') {
    return [
      ['IN+',  'Battery (+) (up to 40V)'],
      ['IN-',  'Battery (−) / GND'],
      ['OUT+', 'Adjusted 5V/12V output (+)'],
      ['OUT-', 'GND'],
    ];
  }
  if (id === 'tp4056') {
    return [
      ['IN+ / USB', 'USB 5V charging input'],
      ['IN-',  'GND'],
      ['B+',  'Li-Ion battery (+)'],
      ['B-',  'Battery (−)'],
      ['OUT+', 'Protected output (+) to load'],
      ['OUT-', 'GND'],
    ];
  }

  // ── SEMICONDUCTORS ────────────────────────────────────────────────────────
  if (id === 'transistor-2n2222' || id === 'npn-2n2222') {
    return [
      ['Base (B)',      alloc.digital() + ' (via 1kΩ resistor from MCU)'],
      ['Collector (C)', 'Load (+) → to VCC/motor'],
      ['Emitter (E)',   'GND'],
    ];
  }
  if (id === 'mosfet-irf540n' || id === 'mosfet-irlz44n') {
    return [
      ['Gate (G)',   alloc.digital() + ' (via 220Ω resistor — PWM for motor control)'],
      ['Drain (D)',  'Load (Motor / LED strip, etc.)'],
      ['Source (S)', 'GND'],
    ];
  }

  // ── SENSORS (misc) ─────────────────────────────────────────────────────────
  if (id === 'sound-sensor' || id === 'ky038') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['AO',  alloc.analog() + ' (audio amplitude)'],
      ['DO',  alloc.digital() + ' (clap/loud threshold)'],
    ];
  }
  if (id === 'flame-sensor') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['DO',  alloc.digital() + ' (LOW when flame detected)'],
      ['AO',  alloc.analog() + ' (analog intensity)'],
    ];
  }
  if (id === 'rotary-encoder') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['CLK', alloc.digital() + ' (A channel)'],
      ['DT',  alloc.digital() + ' (B channel)'],
      ['SW',  alloc.digital() + ' (Push button — pull-up to VCC)'],
    ];
  }
  if (id === 'joystick-module') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['VRX', alloc.analog() + ' (X axis)'],
      ['VRY', alloc.analog() + ' (Y axis)'],
      ['SW',  alloc.digital() + ' (Click button — pull-up)'],
    ];
  }
  if (id === 'keypad-4x4' || id === 'keypad-4x3') {
    const size = id === 'keypad-4x4' ? 8 : 7;
    const rows = [];
    for (let i = 0; i < size; i++) rows.push([`Row/Col ${i+1}`, alloc.digital()]);
    return rows;
  }
  if (id === 'touch-sensor' || id === 'ttp223') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['IO',  alloc.digital() + ' (HIGH when touched)'],
    ];
  }
  if (id === 'hall-effect') {
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['OUT', alloc.digital() + ' (LOW when magnet near)'],
    ];
  }
  if (id === 'voltage-sensor') {
    return [
      ['VCC / +', 'Voltage to measure (+) — max 25V'],
      ['GND / -', 'GND (common)'],
      ['S',       alloc.analog() + ' (scaled output: Vmeasured / 5)'],
    ];
  }
  if (id === 'esp32-cam') {
    const mcu = ctx.primaryMCU;
    return [
      ['5V',  alloc.power(5)],
      ['GND', 'GND'],
      ['U0R (RX)', alloc.tx() + ' (cross-connect: Cam RX ← MCU TX)'],
      ['U0T (TX)', alloc.rx() + ' (cross-connect: Cam TX → MCU RX)'],
      ['IO0', 'GND (to flash firmware) / 3.3V (normal run)'],
      ['IO16', alloc.digital() + ' (optional extra GPIO)'],
    ];
  }
  if (id === 'ina219') {
    const i2c = alloc.i2c();
    return [
      ['VCC', alloc.power(3.3)],
      ['GND', 'GND'],
      ['SCL', i2c.scl],
      ['SDA', i2c.sda],
      ['IN+ / VIN+', 'Shunt resistor high side (load +)'],
      ['IN- / VIN-', 'Shunt resistor low side'],
    ];
  }
  if (id === 'max6675') {
    const spi = alloc.spi();
    return [
      ['VCC', alloc.power(5)],
      ['GND', 'GND'],
      ['SCK', spi.sck],
      ['CS',  alloc.digital()],
      ['SO',  spi.miso],
      ['T+',  'Thermocouple (+)'],
      ['T-',  'Thermocouple (−)'],
    ];
  }
  if (id === 'logic-analyzer') {
    return [
      ['CH0-CH7', 'Signal pins to probe (match to GND)'],
      ['GND', 'GND (common with circuit)'],
      ['USB', 'PC USB port (connects to Sigrok/PulseView)'],
    ];
  }

  return null; // fall back to generic
}

// ── Master plan builder ───────────────────────────────────────────────────────
function buildPlan(comps, mcuId) {
  const mcuName = mcuLabel(mcuId);
  let mcuRemoved = false;
  const sensors = comps.filter(id => {
    const isMCU = ['arduino','esp32','esp8266','pico','stm32','attiny','teensy','microbit'].some(k => id.includes(k));
    if (id === mcuId && !mcuRemoved) { mcuRemoved = true; return false; }
    if (id !== mcuId && isMCU) return true; // keep OTHER MCUs as peripherals
    return true;
  });

  if (!sensors.length) {
    return `No peripheral components detected! Please mention components like sensors, displays, motors, etc.`;
  }

  const alloc = new PinAllocator(mcuId);
  const ctx = { sensors, mcuId, mcuName };

  let out = `## 🛠️ Step-by-Step Build Plan — ${mcuName}\n*(${sensors.length} component${sensors.length>1?'s':''})*\n\n`;

  let codeIncludes = new Set();
  let codeSetup = [];
  
  const payload = {
    mcu: mcuId,
    components: sensors,
    wiring: []
  };

  sensors.forEach((id, idx) => {
    const compData = componentRegistry.components.get(id);
    if (!compData) {
      out += `---\n### ${id}\n> ⚠️ Component not in registry. Please check spelling.\n\n`;
      return;
    }

    const totalCount = sensors.filter(s => s === id).length;
    let title = compData.name;
    if (totalCount > 1) {
      const occ = sensors.slice(0, idx).filter(s => s === id).length + 1;
      title += ` (#${occ})`;
    }

    // Get wiring
    const specialized = specializedWiring(compData, alloc, ctx);
    const routes = specialized || WIRING_KB.generic(compData, alloc, ctx);

    out += `---\n### ${title}\n| Pin | Connect To |\n|---|---|\n`;
    routes.forEach(([pin, target]) => {
      out += `| **${pin}** | ${target} |\n`;
      payload.wiring.push({ component: id, compIndex: idx, pin: pin, target: target });
    });

    // Tips
    const tips = [];
    if (compData.requiresResistor) tips.push('⚠️ Needs current-limiting resistor (220Ω typical)');
    if (id.includes('nrf24')) tips.push('⚠️ 3.3V ONLY — 5V will destroy it!');
    if (id.includes('rc522')) tips.push('⚠️ 3.3V ONLY');
    if (id.includes('esp8266')) tips.push('⚠️ Max 3.3V logic');
    if (id.includes('relay')) tips.push('ℹ️ Use a flyback diode for inductive loads');
    if (compData.tips && compData.tips.length) tips.push(...compData.tips);
    if (tips.length) out += `\n*Tips:* ${tips.join(' · ')}\n`;

    out += '\n';

    // Code hints
    if (compData.protocols?.includes('I2C')) { codeIncludes.add('#include <Wire.h>'); codeSetup.push(`  Wire.begin(); // ${compData.name}`); }
    if (compData.protocols?.includes('SPI')) { codeIncludes.add('#include <SPI.h>'); codeSetup.push(`  SPI.begin(); // ${compData.name}`); }
    if (compData.protocols?.includes('UART')) { codeSetup.push(`  Serial.begin(9600); // ${compData.name}`); }
  });

  out += `---\n### ⚡ Power Summary\n- All **GND** → ${mcuName} **GND** (common ground)\n- **5V components** → ${alloc.pins.power5}\n- **3.3V components** → ${alloc.pins.power33}\n`;

  let codeStr = "";
  if (codeIncludes.size > 0 || codeSetup.length > 0) {
    codeStr += `\n`;
    codeIncludes.forEach(inc => codeStr += inc + '\n');
    codeStr += `\nvoid setup() {\n  Serial.begin(115200);\n`;
    codeSetup.forEach(s => codeStr += s + '\n');
    codeStr += `}\n\nvoid loop() {\n  // Your logic here\n}\n`;
    
    out += `\n### 📝 Code Template\n\`\`\`cpp\n${codeStr}\`\`\`\n`;
    
    // Add code to payload
    payload.code = codeStr;
  }
  
  // Inject payload
  out += `\n<!-- ACTION: ${JSON.stringify(payload)} -->\n`;
  out += `<button class="ai-action-btn" onclick="window.executeAIAction(this.parentElement)">🚀 Generate Circuit</button>\n`;

  return out;
}

// ── Main Chat AI class ────────────────────────────────────────────────────────
class CircuitChatAI {
  constructor() { this.history = []; }

  _getPlaced() {
    try {
      if (typeof document === 'undefined') return [];
      const r = [];
      document.querySelectorAll('.placed-component').forEach(el => { if (el.dataset?.componentId) r.push(el.dataset.componentId); });
      return [...new Set(r)];
    } catch(e) { return []; }
  }

  _findComps(msg) {
    const orig = msg.toLowerCase();
    let searchStr = orig;
    const found = [];
    const allComps = Array.from(componentRegistry.components.values())
      .filter(c => !c.id.includes('jumper') && !c.id.includes('breadboard'))
      .sort((a, b) => b.name.length - a.name.length); // longest first

    // ── Comprehensive shorthand alias map (any word a user might say) ──────
    const EXTRA_ALIASES = {
      // Microcontrollers (correct IDs)
      'arduino-uno':          ['uno', 'arduino uno', 'arduino board', 'arduino'],
      'arduino-nano':         ['nano', 'arduino nano'],
      'arduino-mega':         ['mega', 'mega 2560', 'arduino mega'],
      'esp32':                ['esp 32', 'esp-32'],
      'esp32-cam':            ['esp32 cam', 'esp cam', 'camera module', 'cam module'],
      'raspberry-pi-pico':    ['pico', 'pi pico', 'rp2040'],
      'raspberry-pi-pico-w':  ['pico w', 'pi pico w'],
      'stm32-bluepill':       ['stm32', 'bluepill', 'blue pill', 'stm 32'],
      'attiny85':             ['attiny', 'digispark'],
      'teensy-4':             ['teensy'],
      'bbc-microbit':         ['microbit', 'micro bit'],
      'wifi-esp8266':         ['esp8266', 'esp 8266', 'wifi module', 'esp01', 'esp-01'],
      // Sensors
      '4wd-car-chassis':      ['4wd', 'car chassis', 'smart car', 'robot car', 'robot chassis'],
      'hc-sr04':              ['ultrasonic', 'sonar', 'distance sensor'],
      'dht22':                ['dht22', 'dht 22', 'humidity sensor'],
      'dht11':                ['dht11', 'dht 11'],
      'mpu6050':              ['gyroscope', 'imu', 'mpu 6050', '6 axis'],
      'mpu9250':              ['mpu9250', 'mpu 9250', '9dof'],
      'bme280':               ['bme 280'],
      'bmp280':               ['bmp 280', 'barometric pressure'],
      'ds18b20':              ['ds18b20', '18b20', 'waterproof temp', 'temp probe'],
      'ds18b20-waterproof':   ['waterproof probe'],
      'pir-sensor':           ['pir', 'motion sensor', 'motion detector'],
      'ir-sensor':            ['ir obstacle', 'obstacle sensor'],
      'ir-receiver':          ['ir receiver', 'infrared receiver', 'tsop'],
      'soil-moisture':        ['soil sensor', 'moisture sensor'],
      'mq2-gas':              ['gas sensor', 'smoke sensor'],
      'mq135-air':            ['air quality', 'air sensor'],
      'mq3-gas':              ['mq3', 'mq-3', 'alcohol sensor'],
      'mq7-gas':              ['mq7', 'mq-7', 'co sensor'],
      'mq8-gas':              ['mq8', 'mq-8', 'hydrogen sensor'],
      'water-level':          ['water level', 'water sensor'],
      'flame-sensor':         ['flame', 'fire sensor', 'flame detector'],
      'sound-sensor':         ['microphone sensor', 'sound module', 'clap sensor'],
      'ldr':                  ['ldr', 'light sensor', 'photoresistor', 'light dependent'],
      'rain-sensor':          ['rain', 'rain module'],
      'touch-sensor':         ['touch sensor', 'capacitive touch', 'ttp223'],
      'rotary-encoder':       ['encoder', 'rotary', 'ky040'],
      'hall-effect':          ['hall', 'hall sensor', 'magnetic sensor'],
      'vibration-sensor':     ['vibration sensor', 'shake sensor'],
      'force-sensor':         ['force sensor', 'pressure sensor', 'fsr'],
      'tilt-sensor':          ['tilt', 'tilt switch'],
      'fingerprint-sensor':   ['fingerprint', 'fingerprint sensor', 'r307'],
      'voltage-sensor':       ['voltage sensor', 'voltage module'],
      'ov7670':               ['ov7670', 'camera sensor', 'ov camera'],
      'vl53l0x':              ['tof sensor', 'laser ranging', 'time of flight'],
      'mlx90614':             ['mlx90614', 'mlx', 'ir thermometer', 'infrared temp'],
      'max6675':              ['thermocouple', 'k type thermocouple'],
      'hmc5883l':             ['magnetometer', 'compass'],
      'ina219':               ['ina219', 'power sensor'],
      'bh1750':               ['bh1750', 'lux sensor'],
      'tsl2561':              ['tsl2561', 'luminosity'],
      'adxl345':              ['adxl345', 'accelerometer'],
      'acs712':               ['acs712', 'current sensor'],
      'hx711':                ['hx711', 'load cell', 'weight sensor'],
      'max30102':             ['heart rate', 'pulse sensor', 'oximeter', 'spo2'],
      'tcs3200':              ['tcs3200', 'color sensor'],
      'cny70':                ['cny70', 'reflective sensor', 'line sensor'],
      'turbidity-sensor':     ['turbidity', 'water clarity'],
      'ph-sensor':            ['ph sensor', 'ph module'],
      'joystick':             ['joystick'],
      'keypad-4x4':           ['keypad', '4x4 keypad', 'matrix keypad'],
      'keypad-4x3':           ['4x3 keypad', 'numpad'],
      // Displays (correct IDs)
      'led-red':              ['led'],
      'oled-096':             ['oled', 'ssd1306', 'oled display'],
      'oled-130':             ['1.3 oled', 'sh1106'],
      'lcd-16x2':             ['lcd', '16x2', 'lcd 16', 'lcd display', '1602', 'lcd screen'],
      'lcd-20x4':             ['20x4', '2004 lcd'],
      'tft-18':               ['tft', 'st7735', '1.8 tft', 'color display'],
      'tft-28':               ['2.8 tft', 'ili9341', 'touch tft'],
      '4digit-7seg':          ['7 segment', 'seven segment', '7seg', 'tm1637'],
      '7seg-display':         ['single 7seg', '7 segment single'],
      'led-matrix-8x8':       ['led matrix', '8x8 matrix'],
      'max7219-matrix':       ['max7219 matrix'],
      'neopixel-ring':        ['neopixel ring', 'ws2812 ring'],
      'neopixel-strip':       ['neopixel strip', 'neopixel', 'led strip', 'ws2812'],
      'nextion-24':           ['nextion', 'hmi display'],
      'epaper':               ['e-paper', 'eink', 'e-ink'],
      // Communication (CORRECT IDs)
      'bluetooth-hc05':       ['bluetooth', 'hc05', 'hc 05', 'bt module', 'hc-05'],
      'bluetooth-hc06':       ['hc06', 'hc 06', 'hc-06'],
      'nrf24l01':             ['nrf24', 'nrf', '2.4ghz module'],
      'nrf24l01-pa-lna':      ['nrf pa lna', 'nrf24 pa', 'long range nrf'],
      'lora-sx1278':          ['lora', 'sx1278', 'lorawan'],
      'gps-neo6m':            ['gps', 'neo6m', 'gps module', 'neo 6m', 'ublox'],
      'gsm-sim800l':          ['gsm', 'sim800', 'sim 800', 'gsm module', 'gprs'],
      'sim900a':              ['sim900', 'sim 900'],
      'rfid-rc522':           ['rfid', 'rc522', 'rc 522', 'rfid reader'],
      'rs485-module':         ['rs485', 'modbus'],
      'can-mcp2515':          ['can bus', 'mcp2515', 'can module'],
      'ethernet-w5500':       ['ethernet', 'w5500'],
      'hc-12':                ['hc12', '433mhz', '433 mhz'],
      'cc2530':               ['zigbee'],
      'rx470':                ['rf receiver', '433 receiver'],
      'tx118sa':              ['rf transmitter', '433 transmitter'],
      // Actuators (CORRECT IDs)
      'servo-sg90':           ['servo', 'sg90', 'sg 90'],
      'servo-mg996r':         ['mg996r', 'high torque servo', 'mg 996r'],
      'mg90s':                ['mg90s', 'metal gear servo'],
      'sg90s-360':            ['continuous servo', '360 servo'],
      'stepper-28byj48':      ['stepper', '28byj', 'step motor', 'stepper motor'],
      'stepper-nema17':       ['nema 17', 'nema17', 'bipolar stepper'],
      'dc-motor-3v':          ['dc motor', 'small motor', '3v motor', 'mini motor', 'motor'],
      'dc-motor-6v':          ['6v motor'],
      'dc-motor-12v':         ['12v motor'],
      'buzzer-active':        ['buzzer', 'active buzzer', 'beeper'],
      'buzzer-passive':       ['passive buzzer'],
      'speaker-8ohm':         ['speaker'],
      'vibration-motor':      ['vibration motor', 'haptic motor'],
      'water-pump':           ['water pump', 'pump'],
      'solenoid-5v':          ['solenoid', 'solenoid valve'],
      'relay-module':         ['relay', 'single relay', '1ch relay', 'relay module'],
      'relay-4ch':            ['4 channel relay', '4ch relay'],
      'relay-8ch':            ['8 channel relay', '8ch relay'],
      // Motor Drivers (CORRECT IDs)
      'l298n':                ['motor driver', 'l298', '298n'],
      'l298n-mini':           ['mini motor driver', 'mini l298n'],
      'l293d':                ['l293d', 'l293', 'motor driver ic'],
      'a4988':                ['stepper driver', 'a4988 driver'],
      'drv8825':              ['drv 8825'],
      'tb6612fng':            ['tb6612'],
      'uln2003':              ['uln 2003', 'darlington driver'],
      'bts7960':              ['bts 7960', '43a driver', 'high current driver'],
      'pca9685':              ['pca 9685', 'pwm driver', 'servo driver'],
      // ICs (CORRECT IDs)
      '555-timer':            ['555', '555 timer', 'ne555'],
      '74hc595':              ['shift register', '74hc595', '595'],
      'ds3231':               ['rtc', 'ds3231', 'real time clock', 'clock module'],
      'ds1307':               ['ds1307'],
      'sd-card-module':       ['sd card', 'micro sd', 'sd module'],
      'ads1115':              ['adc module', '16 bit adc'],
      'dfplayer-mini':        ['dfplayer', 'mp3 module', 'mp3 player'],
      'pam8403':              ['audio amplifier', 'amp module'],
      'tca9548a':             ['i2c multiplexer', 'i2c mux'],
      'pcf8574':              ['io expander', 'i2c expander'],
      'level-shifter-4ch':    ['level shifter', 'logic level', 'voltage level shifter'],
      'ch340g':               ['ch340', 'usb ttl', 'usb to ttl'],
      'cp2102':               ['usb uart'],
      // Passives (CORRECT IDs)
      'resistor-220ohm':      ['220 ohm', '220r'],
      'resistor-10kohm':      ['10k resistor', '10 kohm'],
      'resistor-4.7kohm':     ['4.7k', '4k7 resistor'],
      'potentiometer-10k':    ['potentiometer', 'pot', 'variable resistor'],
      'push-button':          ['button', 'push button', 'tactile switch'],
      // Power (CORRECT IDs)
      'lm7805':               ['7805', '5v regulator'],
      'buck-converter':       ['buck converter', 'lm2596', 'step down'],
      'boost-converter':      ['boost converter', 'mt3608', 'step up'],
      'tp4056':               ['lipo charger', 'battery charger'],
      'battery-9v':           ['9v battery'],
      'battery-holder-2cell': ['18650 holder', 'battery holder'],
    };

    // First: find explicit "N component" patterns like "3 leds", "two servos"
    // Digit must be a standalone word, not inside a model number like bme280 or l298n
    for (const comp of allComps) {
      const numAliases = [
        comp.name.toLowerCase(), 
        comp.id,
        comp.id.replace(/-/g, ' '),
        ...(EXTRA_ALIASES[comp.id] || [])
      ];
      for (const a of numAliases) {
        if (a.length <= 2) continue;
        const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const numRe  = new RegExp(`(?:^|\\s)(\\d+)\\s+${esc}s?(?![a-z0-9])`, 'i');
        const wordRe = new RegExp(`\\b(two|three|four|five|six|seven|eight|nine|ten)\\s+${esc}s?(?![a-z0-9])`, 'i');
        const mm = searchStr.match(numRe) || searchStr.match(wordRe);
        if (mm) {
          const raw = (mm[1] || '').toLowerCase();
          const cnt = parseInt(raw) || {two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10}[raw] || 1;
          for (let j = 0; j < Math.min(cnt, 10); j++) found.push(comp.id);
          searchStr = searchStr.replace(mm[0], ' ');
          break;
        }
      }
    }

    

    for (const c of allComps) {
      if (found.includes(c.id)) continue;
      const aliases = [
        c.name.toLowerCase(),
        c.id,
        c.id.replace(/-/g, ' '),
        ...(EXTRA_ALIASES[c.id] || [])
      ];
      for (const a of aliases) {
        if (a.length <= 2) continue;
        // Use word-boundary matching to avoid "oled" matching "moled"
        // Also add an optional "s?" at the end to match plurals like "leds" or "servos"
        const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?<![a-z0-9])${escaped}s?(?![a-z0-9])`, 'i');
        if (re.test(searchStr)) {
          found.push(c.id);
          searchStr = searchStr.replace(re, '');
          break;
        }
      }
    }

    return found;
  }

  _isMCU(id) {
    return ['arduino','esp32','esp8266','pico','stm32','attiny','teensy','microbit'].some(k => id.includes(k));
  }

  _getMCU(comps, placed = []) {
    const all = [...comps, ...placed];
    // If we have a full ESP32 AND an ESP32-CAM, the full ESP32 is master
    const hasFullESP32 = all.some(id => id === 'esp32' || (id.includes('esp32') && !id.includes('cam') && !id.includes('s3') && !id.includes('c3')));
    const hasCAM = all.some(id => id.includes('esp32-cam'));
    const skipCam = hasFullESP32 && hasCAM;

    const priority = [
      'esp32-s3', 'esp32-c3', 'esp32',   // full ESP32 family first (cam is skipped here if full ESP32 exists)
      'pico-w', 'pico', 'mega', 'nano', 'leonardo', 'due',
      'stm32', 'attiny', 'teensy', 'microbit', 'arduino-uno', 'arduino',
    ];
    if (!skipCam) priority.splice(2, 0, 'esp32-cam'); // cam is solo MCU only if no full esp32

    for (const k of priority) {
      // Exact match first, then prefix match with dash boundary to avoid 'esp32' matching 'esp32-cam'
      const f = all.find(id => id === k) || all.find(id => id.startsWith(k + '-') && !priority.some(p => p !== k && p.startsWith(k) && id.startsWith(p)));
      if (f) return f;
    }
    // Fallback: any arduino
    const any = all.find(id => id.includes('arduino'));
    return any || 'arduino-uno';
  }

  async respond(msg) {
    if (!msg?.trim()) return 'Ask me anything about your circuit! 😊';
    
    // Check for API key submission
    const trimmedMsg = msg.trim();
    if (trimmedMsg.startsWith('AIza') || (trimmedMsg.length > 35 && !trimmedMsg.includes(' ') && !trimmedMsg.includes('{'))) {
       localStorage.setItem('gemini_api_key', trimmedMsg);
       this.history.push({ role:'user', text:"[API KEY SUBMITTED]" });
       const res = "API Key saved securely! 🚀 I am now connected to the Gemini AI brain and know everything about electronics. What shall we build?";
       this.history.push({ role:'ai', text:res });
       return res;
    }

    // Secure API Key loading: checks local storage first, then falls back to Vercel environment variables
    let apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    
    const low = msg.toLowerCase();
    const placed = this._getPlaced();
    const comps  = this._findComps(msg);
    const mcuId  = this._getMCU(comps, placed);
    this.history.push({ role:'user', text:msg });
    
    if (apiKey) {
      // Gemini mode
      try {
        const availableComps = Array.from(componentRegistry.components.entries()).map(([id, data]) => {
            const pins = data.pins ? Object.keys(data.pins).join(", ") : "none";
            return `${id} (${data.name}) PINS:[${pins}]`;
        }).join(" | ");
        
        const systemPrompt = `You are TinkerAI, an expert electronics engineer.
You are helping the user build circuits.
Available components in our registry: ${availableComps}.
User request: ${msg}

If the user wants to build a circuit, you MUST respond in Markdown, explaining the wiring in a clear Markdown table format (e.g., | Component | Pin | Connects To |), and you MUST include the following JSON payload exactly inside an HTML comment at the end of your response to auto-generate the circuit:
<!-- ACTION: {"mcu": "arduino-uno", "components": ["led-red", "resistor-220ohm", "dht22"], "wiring": [{"fromComp": "mcu", "fromPin": "D4", "toComp": "resistor-220ohm_0", "toPin": "pin1"}, {"fromComp": "resistor-220ohm_0", "fromPin": "pin2", "toComp": "led-red_0", "toPin": "anode"}, {"fromComp": "led-red_0", "fromPin": "cathode", "toComp": "mcu", "toPin": "GND"}], "code": "void setup() {}\\nvoid loop() {}"} -->

CRITICAL WIRING RULES:
1. ALWAYS use the EXACT pin names provided in the registry.
2. If using LEDs, you MUST wire a resistor IN SERIES (e.g. MCU Pin -> Resistor pin1, Resistor pin2 -> LED anode, LED cathode -> GND). DO NOT wire the LED directly to the MCU if you add a resistor!`;
* Note: The "components" array must contain ONLY the base component IDs (e.g. "dht22"). Do NOT append the index.
* Note: For "wiring", "fromComp" and "toComp" must be either "mcu", or the exact component ID appended with its index (e.g., "dht22_0", "l298n_0", "4wd-car-chassis_0"). DO NOT use human readable names.
* Note: DO NOT include "jumper wires", "breadboards", or any physical connectors in the components array. Wiring is handled virtually!

WIRING HINTS:
- If using '4wd-car-chassis', it has 8 pins. Wire left motors (M1, M2) in parallel to a single motor driver OUT1/OUT2. Wire right motors (M3, M4) in parallel to the SAME driver's OUT3/OUT4. Do NOT use two motor drivers for a standard 4WD car.

Provide the complete accurate wiring IN A TABULAR FORMAT, and the actual C++ code snippet in the code field. Only use components and pins from the available registry.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const res = data.candidates[0].content.parts[0].text;
        this.history.push({ role:'ai', text:res });
        return res;
      } catch (err) {
        console.error(err);
        return `⚠️ Gemini API Error: ${err.message}\n*(Check your API Key or internet connection)*`;
      }
    }

    let res = '';
    const prefix = "*(Running in offline mode. Paste your API Key to unlock true omniscience!)*\n\n";

    // Greeting
    if (/^(hi|hello|hey|sup|yo|howdy)/i.test(msg.trim())) {
      res = prefix + `Hey! 👋 I'm **TinkerAI** — your self-trained generative circuit expert.\n\nI have built-in wiring knowledge for **every component in the registry** — no external APIs needed. I can correctly wire any combination of:\n🔌 Sensors, motors, displays, relays, ICs, communication modules...\n\nTry:\n- *"Connect ESP32 to OLED, DHT22, and 2 LEDs"*\n- *"Build a 4WD robot with L298N and ultrasonic sensor"*\n- *"Wire ESP32-CAM to Arduino and LCD"*`;
    }

    // Canvas query
    else if (/canvas|placed|what.?s on|my circuit|what do i have/i.test(low)) {
      if (!placed.length) {
        res = prefix + `Your canvas is empty. Drag some components from the right panel!`;
      } else {
        res = prefix + `**On your canvas (${placed.length} components):**\n`;
        placed.forEach((id,i) => {
          const comp = componentRegistry.components.get(id);
          res += `${i+1}. ${comp ? comp.name : id}\n`;
        });
        res += `\nTry: *"Wire everything"*`;
      }
    }

    // Wire all on canvas
    else if (/wire all|connect all|connect everything|connect them|connect these/i.test(low)) {
      if (placed.length) res = prefix + buildPlan(placed, this._getMCU([], placed));
      else res = prefix + `Your canvas is empty — drag some components first!`;
    }

    // Wiring plan (any combination)
    else if (comps.length >= 1) {
      res = prefix + buildPlan(comps, mcuId);
    }

    // FAQ / Troubleshoot
    else if (/not work|doesn.?t|wrong|broken|problem|issue|error|fix|why|fail/i.test(low)) {
      res = prefix + `**Circuit Troubleshooting Checklist:**\n1. ✅ All components share **GND** (common ground)?\n2. ✅ Correct voltage — **3.3V** for ESP/LoRa/RFID, **5V** for Arduino sensors?\n3. ✅ **RX → TX** and **TX → RX** (crossed serial connections)?\n4. ✅ **I2C pull-up resistors** (4.7kΩ on SDA/SCL for long cables)?\n5. ✅ Motor driver has **external power** (not from Arduino's 5V)?\n6. ✅ Code pin numbers match physical wiring?\n7. 🔍 Try adding \`Serial.println("test");\` to verify MCU is running.`;
    }

    else if (/\b(who are you|what are you|are you ai|your name)\b/i.test(low)) {
      res = prefix + `I am **TinkerAI** — a self-trained, offline AI wiring expert!\n\nI have deep built-in knowledge of 180+ electronic components. I calculate correct, real-world pin connections for ANY combination — no internet, no API needed.`;
    }

    else if (/help|what can you do|commands/i.test(low)) {
      res = prefix + `**I can help you with:**\n\n🔌 **Wiring** — *"Connect ESP32 to OLED and DHT22"*\n🚗 **Full projects** — *"Build a robot car"*\n📷 **Complex systems** — *"ESP32-CAM + Arduino + L298N + 4WD chassis"*\n🛠️ **Troubleshooting** — *"My sensor is not working"*\n📋 **Canvas wiring** — *"Wire all components on my canvas"*\n\nJust describe what you want to build and I'll generate step-by-step wiring tables!`;
    }

    else {
      res = prefix + `I'm not sure what you mean! 😅\n\nTry something like:\n- *"Connect ESP32 to DHT22 and OLED"*\n- *"Build a weather station"*\n- *"Wire L298N to Arduino and 4WD chassis"*\n\nOr type **"help"** to see all my capabilities.`;
    }

    this.history.push({ role:'ai', text:res });
    return res;
  }
}

export const circuitChatAI = new CircuitChatAI();
