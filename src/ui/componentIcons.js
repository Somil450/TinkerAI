/**
 * COMPONENT ICON GENERATOR
 * Generates inline SVG icons for every component category.
 * No external files needed — icons render directly in the sidebar.
 */

const ICON_SIZE = 40;

const ICONS = {
  // === MICROCONTROLLERS ===
  'arduino-uno':    () => mcuIcon('#00979D', 'UNO'),
  'arduino-nano':   () => mcuIcon('#00979D', 'NANO'),
  'arduino-mega':   () => mcuIcon('#00979D', 'MEGA'),
  'arduino-leonardo': () => mcuIcon('#00979D', 'LEO'),
  'arduino-due':    () => mcuIcon('#00979D', 'DUE'),
  'esp32':          () => mcuIcon('#E7352C', 'ESP32'),
  'esp32-s3':       () => mcuIcon('#E7352C', 'S3'),
  'esp32-c3':       () => mcuIcon('#E7352C', 'C3'),
  'wifi-esp8266':   () => mcuIcon('#E7352C', '8266'),
  'raspberry-pi-pico':  () => mcuIcon('#C51A4A', 'PICO'),
  'raspberry-pi-pico-w': () => mcuIcon('#C51A4A', 'PicoW'),
  'stm32-bluepill': () => mcuIcon('#03234B', 'STM32'),
  'attiny85':       () => mcuIcon('#00979D', 'T85'),
  'teensy-4':       () => mcuIcon('#4B0082', 'T4.0'),
  'bbc-microbit':   () => mcuIcon('#00ED00', 'µBit'),

  // === LEDS ===
  'led-red':    () => ledIcon('#FF1744'),
  'led-green':  () => ledIcon('#00E676'),
  'led-blue':   () => ledIcon('#2979FF'),
  'led-yellow': () => ledIcon('#FFD600'),
  'led-white':  () => ledIcon('#E0E0E0'),
  'led-ir':     () => ledIcon('#880E4F'),
  'rgb-led':    () => rgbLedIcon(),

  // === SENSORS ===
  'hc-sr04':    () => sensorIcon('#2196F3', ')))'),
  'dht22':      () => sensorIcon('#4CAF50', '°C'),
  'dht11':      () => sensorIcon('#8BC34A', '°C'),
  'mpu6050':    () => sensorIcon('#9C27B0', 'IMU'),
  'ldr':        () => sensorIcon('#FFC107', '☀'),
  'pir-sensor': () => sensorIcon('#FF5722', 'PIR'),
  'ir-sensor':  () => sensorIcon('#F44336', 'IR'),
  'ir-receiver': () => sensorIcon('#D32F2F', 'IR⬇'),
  'soil-moisture': () => sensorIcon('#795548', '💧'),
  'mq2-gas':    () => sensorIcon('#FF9800', 'GAS'),
  'mq135-air':  () => sensorIcon('#FF9800', 'AIR'),
  'water-level': () => sensorIcon('#03A9F4', 'H₂O'),
  'flame-sensor': () => sensorIcon('#FF5722', '🔥'),
  'sound-sensor': () => sensorIcon('#E91E63', '🎤'),
  'bmp280':     () => sensorIcon('#00BCD4', 'hPa'),
  'bme280':     () => sensorIcon('#00ACC1', 'BME'),
  'adxl345':    () => sensorIcon('#7C4DFF', 'ACC'),
  'acs712':     () => sensorIcon('#FF6D00', 'ACS'),
  'hx711':      () => sensorIcon('#8D6E63', 'WT'),
  'max30102':   () => sensorIcon('#E91E63', '❤'),
  'ds18b20':    () => sensorIcon('#00E5FF', '🌡'),
  'tcs3200':    () => sensorIcon('#AB47BC', 'CLR'),
  'rain-sensor': () => sensorIcon('#42A5F5', '🌧'),
  'touch-sensor': () => sensorIcon('#7C4DFF', '👆'),
  'rotary-encoder': () => sensorIcon('#78909C', '↻'),
  'hall-effect': () => sensorIcon('#546E7A', 'MAG'),
  'vibration-sensor': () => sensorIcon('#FF7043', '〰'),
  'uv-sensor':  () => sensorIcon('#7B1FA2', 'UV'),
  'flex-sensor': () => sensorIcon('#A1887F', '↝'),
  'force-sensor': () => sensorIcon('#8D6E63', 'FSR'),
  'tilt-sensor': () => sensorIcon('#90A4AE', '⟋'),
  'fingerprint-sensor': () => sensorIcon('#5C6BC0', '🖐'),
  'voltage-sensor': () => sensorIcon('#FFC107', 'V'),

  // === DISPLAYS ===
  'lcd-16x2':   () => displayIcon('#1565C0', '16×2'),
  'lcd-20x4':   () => displayIcon('#0D47A1', '20×4'),
  'oled-096':   () => displayIcon('#263238', 'OLED'),
  'oled-130':   () => displayIcon('#37474F', 'OLED'),
  'tft-18':     () => displayIcon('#00796B', 'TFT'),
  'tft-28':     () => displayIcon('#004D40', 'TFT'),
  '7seg-display': () => sevenSegIcon(),
  '4digit-7seg': () => sevenSegIcon(),
  'led-matrix-8x8': () => displayIcon('#F57F17', '8×8'),
  'epaper':     () => displayIcon('#ECEFF1', 'E-Ink'),
  'neopixel-ring': () => neopixelIcon('ring'),
  'neopixel-strip': () => neopixelIcon('strip'),

  // === RESISTORS ===
  'resistor-220ohm': () => resistorIcon('#B71C1C', '220Ω'),
  'resistor-10kohm': () => resistorIcon('#E65100', '10kΩ'),
  'resistor-4.7kohm': () => resistorIcon('#F57F17', '4.7k'),
  'resistor-100ohm': () => resistorIcon('#880E4F', '100Ω'),
  'resistor-330ohm': () => resistorIcon('#4A148C', '330Ω'),
  'resistor-1kohm': () => resistorIcon('#1A237E', '1kΩ'),
  'resistor-100kohm': () => resistorIcon('#004D40', '100k'),

  // === PASSIVE ===
  'potentiometer-10k': () => potIcon('10k'),
  'potentiometer-100k': () => potIcon('100k'),
  'trimmer-10k': () => potIcon('TRM'),
  'cap-ceramic-100nf': () => capIcon('#FF9800', '100n'),
  'cap-ceramic-10uf': () => capIcon('#FF9800', '10µ'),
  'cap-electrolytic-100uf': () => eCapIcon('100µ'),
  'cap-electrolytic-470uf': () => eCapIcon('470µ'),
  'cap-electrolytic-1000uf': () => eCapIcon('1000'),
  'inductor-10uh': () => inductorIcon('10µH'),
  'inductor-100uh': () => inductorIcon('100µ'),
  'thermistor-ntc': () => sensorIcon('#FF5722', 'NTC'),
  'fuse-1a': () => fuseIcon(),
  'crystal-16mhz': () => crystalIcon(),

  // === SEMICONDUCTORS ===
  'diode-1n4007': () => diodeIcon('#212121'),
  'diode-1n4148': () => diodeIcon('#424242'),
  'zener-5v1':    () => zenerIcon(),
  'schottky-1n5819': () => diodeIcon('#1B5E20'),
  'npn-2n2222':   () => transistorIcon('NPN'),
  'pnp-2n2907':   () => transistorIcon('PNP'),
  'npn-tip120':   () => transistorIcon('TIP'),
  'mosfet-irf540n': () => mosfetIcon('N'),
  'mosfet-irf9540n': () => mosfetIcon('P'),
  'mosfet-irlz44n': () => mosfetIcon('LL'),
  'optocoupler-817': () => icIcon('#546E7A', 'OPT'),
  'bridge-rectifier': () => icIcon('#37474F', 'BR'),

  // === ICs ===
  '555-timer':    () => icIcon('#311B92', '555'),
  'lm741-opamp':  () => opampIcon(),
  'lm358-opamp':  () => opampIcon(),
  '74hc595':      () => icIcon('#1A237E', '595'),
  'pcf8574':      () => icIcon('#0D47A1', 'I/O'),
  'ads1115':      () => icIcon('#00695C', 'ADC'),
  'mcp4725':      () => icIcon('#004D40', 'DAC'),
  'at24c256':     () => icIcon('#3E2723', 'ROM'),
  'ds3231':       () => icIcon('#1565C0', 'RTC'),
  'ds1307':       () => icIcon('#1976D2', 'RTC'),
  'sd-card-module': () => icIcon('#455A64', 'SD'),
  'dfplayer-mini': () => icIcon('#C62828', 'MP3'),
  'pam8403':      () => icIcon('#B71C1C', 'AMP'),

  // === MOTOR DRIVERS ===
  'l298n':        () => driverIcon('#D84315', 'L298N'),
  'l293d':        () => driverIcon('#E65100', 'L293D'),
  'a4988':        () => driverIcon('#558B2F', 'A4988'),
  'drv8825':      () => driverIcon('#33691E', 'DRV'),
  'tb6612fng':    () => driverIcon('#827717', 'TB66'),
  'uln2003':      () => driverIcon('#4E342E', 'ULN'),

  // === ACTUATORS ===
  'dc-motor-3v':  () => motorIcon('3V'),
  'dc-motor-6v':  () => motorIcon('6V'),
  'dc-motor-12v': () => motorIcon('12V'),
  'servo-sg90':   () => servoIcon('SG90'),
  'servo-mg996r': () => servoIcon('MG99'),
  'stepper-28byj48': () => stepperIcon('28BYJ'),
  'stepper-nema17': () => stepperIcon('N17'),
  'linear-actuator': () => motorIcon('LIN'),
  'solenoid-5v':  () => solenoidIcon('5V'),
  'solenoid-12v': () => solenoidIcon('12V'),
  'relay-module': () => relayIcon('1CH'),
  'relay-4ch':    () => relayIcon('4CH'),
  'relay-8ch':    () => relayIcon('8CH'),
  'buzzer-active': () => buzzerIcon('ACT'),
  'buzzer-passive': () => buzzerIcon('PAS'),
  'speaker-8ohm': () => speakerIcon(),
  'vibration-motor': () => motorIcon('VIB'),
  'water-pump':   () => pumpIcon(),
  'fan-5v':       () => fanIcon(),

  // === COMMUNICATION ===
  'bluetooth-hc05': () => commIcon('#1565C0', 'BT'),
  'bluetooth-hc06': () => commIcon('#1976D2', 'BT'),
  'nrf24l01':     () => commIcon('#00796B', 'NRF'),
  'lora-sx1278':  () => commIcon('#4A148C', 'LoRa'),
  'gps-neo6m':    () => commIcon('#2E7D32', 'GPS'),
  'gsm-sim800l':  () => commIcon('#AD1457', 'GSM'),
  'rfid-rc522':   () => commIcon('#0277BD', 'RFID'),
  'rs485-module': () => commIcon('#37474F', 'R485'),
  'can-mcp2515':  () => commIcon('#263238', 'CAN'),
  'ethernet-w5500': () => commIcon('#01579B', 'ETH'),
  'ir-transmitter': () => commIcon('#B71C1C', 'IR↑'),

  // === POWER ===
  'usb-cable':    () => powerIcon('#616161', 'USB'),
  'battery-9v':   () => batteryIcon('9V'),
  'battery-aa':   () => batteryIcon('AA'),
  'battery-lipo-3.7v': () => batteryIcon('LiPo'),
  'battery-18650': () => batteryIcon('18650'),
  'power-bank-5v': () => powerIcon('#1B5E20', 'PWR'),
  'lm7805':       () => regIcon('7805'),
  'lm7812':       () => regIcon('7812'),
  'lm317':        () => regIcon('317'),
  'ams1117-3.3':  () => regIcon('1117'),
  'buck-converter': () => powerIcon('#E65100', 'BUCK'),
  'boost-converter': () => powerIcon('#BF360C', 'BST'),
  'solar-panel-6v': () => solarIcon(),
  'tp4056':       () => powerIcon('#2E7D32', 'CHG'),

  // === CONNECTORS ===
  'breadboard-830': () => connIcon('#FAFAFA', 'BB'),
  'breadboard-400': () => connIcon('#FAFAFA', 'BB'),
  'jumper-mm':    () => wireIcon('#F44336'),
  'jumper-mf':    () => wireIcon('#2196F3'),
  'jumper-ff':    () => wireIcon('#4CAF50'),
  'push-button':  () => buttonIcon(),
  'toggle-switch': () => switchIcon('TOG'),
  'slide-switch': () => switchIcon('SLD'),
  'dip-switch-4': () => switchIcon('DIP'),
  'rocker-switch': () => switchIcon('RCK'),
  'keypad-4x4':   () => keypadIcon('4×4'),
  'keypad-4x3':   () => keypadIcon('4×3'),
  'joystick':     () => joystickIcon(),
  'terminal-block-2': () => connIcon('#4CAF50', 'TB'),
  'header-male-40': () => connIcon('#FFC107', 'M'),
  'header-female-40': () => connIcon('#FF9800', 'F'),
  'level-shifter-4ch': () => connIcon('#7B1FA2', 'LS'),
};

// ─── SVG Helpers ───────────────────────────────────────────────────────────────

function mcuIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="6" width="32" height="28" rx="3" fill="${color}" stroke="#222" stroke-width="1"/>
    <rect x="8" y="2" width="3" height="6" rx="1" fill="#888"/><rect x="14" y="2" width="3" height="6" rx="1" fill="#888"/>
    <rect x="20" y="2" width="3" height="6" rx="1" fill="#888"/><rect x="26" y="2" width="3" height="6" rx="1" fill="#888"/>
    <rect x="8" y="32" width="3" height="6" rx="1" fill="#888"/><rect x="14" y="32" width="3" height="6" rx="1" fill="#888"/>
    <rect x="20" y="32" width="3" height="6" rx="1" fill="#888"/><rect x="26" y="32" width="3" height="6" rx="1" fill="#888"/>
    <text x="20" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="white">${label}</text>
  </svg>`;
}

function ledIcon(color) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <defs><radialGradient id="lg${color.slice(1)}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.6"/><stop offset="100%" stop-color="${color}"/></radialGradient></defs>
    <ellipse cx="20" cy="16" rx="10" ry="12" fill="url(#lg${color.slice(1)})" stroke="#333" stroke-width="0.8"/>
    <line x1="16" y1="28" x2="16" y2="38" stroke="#888" stroke-width="1.5"/>
    <line x1="24" y1="28" x2="24" y2="38" stroke="#888" stroke-width="1.5"/>
    <line x1="24" y1="30" x2="24" y2="34" stroke="#888" stroke-width="2.5"/>
  </svg>`;
}

function rgbLedIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="14" cy="14" r="8" fill="#FF1744" opacity="0.7"/><circle cx="26" cy="14" r="8" fill="#2979FF" opacity="0.7"/>
    <circle cx="20" cy="24" r="8" fill="#00E676" opacity="0.7"/>
    <line x1="14" y1="34" x2="14" y2="40" stroke="#888" stroke-width="1"/><line x1="20" y1="34" x2="20" y2="40" stroke="#888" stroke-width="1"/>
    <line x1="26" y1="34" x2="26" y2="40" stroke="#888" stroke-width="1"/>
  </svg>`;
}

function sensorIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="3" y="3" width="34" height="34" rx="5" fill="white" stroke="${color}" stroke-width="2"/>
    <circle cx="20" cy="16" r="7" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1"/>
    <text x="20" y="19" text-anchor="middle" font-size="7" font-weight="bold" fill="${color}">${label}</text>
    <text x="20" y="33" text-anchor="middle" font-size="5" fill="#666">SENSOR</text>
  </svg>`;
}

function displayIcon(bgColor, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="2" y="4" width="36" height="32" rx="3" fill="#333" stroke="#222" stroke-width="1"/>
    <rect x="5" y="7" width="30" height="20" rx="1" fill="${bgColor === '#ECEFF1' ? '#ECEFF1' : '#0A0A2A'}"/>
    <text x="20" y="20" text-anchor="middle" font-size="7" font-weight="bold" fill="${bgColor === '#ECEFF1' ? '#333' : '#0f0'}">${label}</text>
    <rect x="13" y="30" width="14" height="3" rx="1" fill="#555"/>
  </svg>`;
}

function sevenSegIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="4" width="32" height="32" rx="3" fill="#111"/>
    <path d="M12 10 h8 M12 20 h8 M12 30 h8 M10 12 v6 M10 22 v6 M22 12 v6 M22 22 v6" stroke="#F44336" stroke-width="2" stroke-linecap="round" fill="none"/>
    <circle cx="30" cy="30" r="1.5" fill="#F44336"/>
  </svg>`;
}

function neopixelIcon(type) {
  const colors = ['#FF1744','#2979FF','#00E676','#FFD600','#E040FB','#00E5FF'];
  if (type === 'ring') {
    let circles = '';
    for(let i=0;i<8;i++){const a=i*Math.PI/4; circles+=`<circle cx="${20+10*Math.cos(a)}" cy="${20+10*Math.sin(a)}" r="3" fill="${colors[i%6]}" opacity="0.85"/>`;}
    return `<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" fill="none" stroke="#333" stroke-width="1.5"/>${circles}</svg>`;
  }
  return `<svg viewBox="0 0 40 40" width="40" height="40"><rect x="2" y="14" width="36" height="12" rx="2" fill="#222"/>${colors.map((c,i)=>`<circle cx="${5+i*6}" cy="20" r="3" fill="${c}" opacity="0.85"/>`).join('')}</svg>`;
}

function resistorIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="0" y1="20" x2="8" y2="20" stroke="#888" stroke-width="1.5"/>
    <rect x="8" y="12" width="24" height="16" rx="2" fill="#E8D5B7" stroke="#8D6E63" stroke-width="1"/>
    <rect x="12" y="12" width="3" height="16" fill="${color}"/><rect x="17" y="12" width="3" height="16" fill="#000"/>
    <rect x="22" y="12" width="3" height="16" fill="${color}"/><rect x="27" y="12" width="1.5" height="16" fill="#D4AF37"/>
    <line x1="32" y1="20" x2="40" y2="20" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function potIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="22" r="13" fill="#E8E8E8" stroke="#888" stroke-width="1.5"/>
    <circle cx="20" cy="22" r="4" fill="#555"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="#333" stroke-width="2"/>
    <text x="20" y="36" text-anchor="middle" font-size="6" fill="#555">${label}</text>
  </svg>`;
}

function capIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="20" y1="2" x2="20" y2="14" stroke="#888" stroke-width="1.5"/>
    <line x1="8" y1="14" x2="32" y2="14" stroke="${color}" stroke-width="3"/>
    <line x1="8" y1="22" x2="32" y2="22" stroke="${color}" stroke-width="3"/>
    <line x1="20" y1="22" x2="20" y2="34" stroke="#888" stroke-width="1.5"/>
    <text x="20" y="38" text-anchor="middle" font-size="6" fill="#555">${label}</text>
  </svg>`;
}

function eCapIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="20" y1="2" x2="20" y2="10" stroke="#888" stroke-width="1.5"/>
    <rect x="10" y="10" width="20" height="20" rx="10" fill="#1A237E" stroke="#333" stroke-width="1"/>
    <text x="20" y="23" text-anchor="middle" font-size="6" font-weight="bold" fill="white">${label}</text>
    <text x="14" y="11" font-size="7" fill="#888">+</text>
    <line x1="20" y1="30" x2="20" y2="38" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function inductorIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="2" y1="20" x2="8" y2="20" stroke="#888" stroke-width="1.5"/>
    <path d="M8 20 Q12 8,16 20 Q20 32,24 20 Q28 8,32 20" fill="none" stroke="#4CAF50" stroke-width="2"/>
    <line x1="32" y1="20" x2="38" y2="20" stroke="#888" stroke-width="1.5"/>
    <text x="20" y="38" text-anchor="middle" font-size="6" fill="#555">${label}</text>
  </svg>`;
}

function fuseIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="2" y1="20" x2="8" y2="20" stroke="#888" stroke-width="1.5"/>
    <rect x="8" y="14" width="24" height="12" rx="6" fill="none" stroke="#999" stroke-width="1.5"/>
    <line x1="12" y1="20" x2="28" y2="20" stroke="#333" stroke-width="0.8" stroke-dasharray="2,1"/>
    <line x1="32" y1="20" x2="38" y2="20" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function crystalIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="10" y1="20" x2="2" y2="20" stroke="#888" stroke-width="1.5"/>
    <rect x="12" y="10" width="16" height="20" rx="2" fill="#C5CAE9" stroke="#5C6BC0" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" font-size="6" fill="#283593">16M</text>
    <line x1="28" y1="20" x2="38" y2="20" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function diodeIcon(color) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="2" y1="20" x2="14" y2="20" stroke="#888" stroke-width="1.5"/>
    <polygon points="14,10 14,30 28,20" fill="${color}" stroke="#333" stroke-width="1"/>
    <line x1="28" y1="10" x2="28" y2="30" stroke="#333" stroke-width="2"/>
    <line x1="28" y1="20" x2="38" y2="20" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function zenerIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <line x1="2" y1="20" x2="14" y2="20" stroke="#888" stroke-width="1.5"/>
    <polygon points="14,10 14,30 28,20" fill="#7B1FA2" stroke="#333" stroke-width="1"/>
    <path d="M25 10 L28 10 L28 30 L31 30" fill="none" stroke="#333" stroke-width="2"/>
    <line x1="28" y1="20" x2="38" y2="20" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function transistorIcon(type) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="2" y1="20" x2="14" y2="20" stroke="#888" stroke-width="1.5"/>
    <line x1="14" y1="12" x2="14" y2="28" stroke="#333" stroke-width="2"/>
    <line x1="14" y1="14" x2="28" y2="6" stroke="#333" stroke-width="1.5"/>
    <line x1="14" y1="26" x2="28" y2="34" stroke="#333" stroke-width="1.5"/>
    <text x="24" y="22" font-size="6" font-weight="bold" fill="#333">${type}</text>
  </svg>`;
}

function mosfetIcon(type) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="2" y1="20" x2="12" y2="20" stroke="#888" stroke-width="1.5"/>
    <line x1="14" y1="10" x2="14" y2="30" stroke="#333" stroke-width="2.5"/>
    <line x1="17" y1="10" x2="17" y2="30" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="26" y="23" font-size="7" font-weight="bold" fill="#1565C0">${type}</text>
  </svg>`;
}

function icIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="6" y="8" width="28" height="24" rx="2" fill="${color}" stroke="#222" stroke-width="1"/>
    <circle cx="12" cy="14" r="2" fill="#888"/>
    <rect x="2" y="13" width="6" height="2" fill="#888"/><rect x="2" y="19" width="6" height="2" fill="#888"/><rect x="2" y="25" width="6" height="2" fill="#888"/>
    <rect x="32" y="13" width="6" height="2" fill="#888"/><rect x="32" y="19" width="6" height="2" fill="#888"/><rect x="32" y="25" width="6" height="2" fill="#888"/>
    <text x="20" y="24" text-anchor="middle" font-size="7" font-weight="bold" fill="white">${label}</text>
  </svg>`;
}

function opampIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <polygon points="6,6 6,34 34,20" fill="white" stroke="#333" stroke-width="1.5"/>
    <text x="10" y="16" font-size="8" fill="#333">−</text>
    <text x="10" y="28" font-size="8" fill="#333">+</text>
    <line x1="34" y1="20" x2="40" y2="20" stroke="#888" stroke-width="1.5"/>
    <line x1="0" y1="12" x2="6" y2="12" stroke="#888" stroke-width="1.5"/>
    <line x1="0" y1="28" x2="6" y2="28" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function driverIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="4" width="32" height="32" rx="3" fill="${color}" stroke="#222" stroke-width="1"/>
    <rect x="8" y="8" width="10" height="6" rx="1" fill="rgba(255,255,255,0.2)"/>
    <rect x="22" y="8" width="10" height="6" rx="1" fill="rgba(255,255,255,0.2)"/>
    <text x="20" y="28" text-anchor="middle" font-size="6" font-weight="bold" fill="white">${label}</text>
  </svg>`;
}

function motorIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="20" r="14" fill="#E0E0E0" stroke="#555" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="4" fill="#888"/>
    <text x="20" y="23" text-anchor="middle" font-size="6" font-weight="bold" fill="#333">M</text>
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#888">${label}</text>
    <rect x="33" y="17" width="7" height="6" rx="1" fill="#888"/>
  </svg>`;
}

function servoIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="10" width="28" height="22" rx="3" fill="#1565C0" stroke="#222" stroke-width="1"/>
    <circle cx="26" cy="14" r="5" fill="#E0E0E0" stroke="#888" stroke-width="1"/>
    <rect x="26" y="5" width="12" height="4" rx="1" fill="#888"/>
    <text x="14" y="28" text-anchor="middle" font-size="5" fill="white">${label}</text>
  </svg>`;
}

function stepperIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="6" y="6" width="28" height="28" rx="2" fill="#78909C" stroke="#333" stroke-width="1"/>
    <circle cx="20" cy="20" r="8" fill="#546E7A" stroke="#37474F" stroke-width="1"/>
    <circle cx="20" cy="20" r="3" fill="#CFD8DC"/>
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function solenoidIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="8" y="8" width="24" height="24" rx="2" fill="#78909C" stroke="#333" stroke-width="1"/>
    <path d="M14 15 Q18 10,22 15 Q26 20,30 15" fill="none" stroke="#FFD600" stroke-width="1.5"/>
    <path d="M14 22 Q18 17,22 22 Q26 27,30 22" fill="none" stroke="#FFD600" stroke-width="1.5"/>
    <rect x="18" y="2" width="4" height="8" rx="1" fill="#888"/>
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function relayIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="6" width="32" height="28" rx="3" fill="#1565C0" stroke="#222" stroke-width="1"/>
    <rect x="8" y="10" width="12" height="8" rx="1" fill="rgba(255,255,255,0.15)"/>
    <circle cx="28" cy="14" r="3" fill="#F44336"/>
    <text x="20" y="28" text-anchor="middle" font-size="6" font-weight="bold" fill="white">${label}</text>
  </svg>`;
}

function buzzerIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="18" r="12" fill="#333" stroke="#222" stroke-width="1"/>
    <circle cx="20" cy="18" r="5" fill="#555"/>
    <circle cx="20" cy="18" r="2" fill="#888"/>
    <text x="20" y="37" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function speakerIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <polygon points="8,14 8,26 14,26 24,34 24,6 14,14" fill="#555" stroke="#333" stroke-width="1"/>
    <path d="M28 12 Q34 20,28 28" fill="none" stroke="#999" stroke-width="1.5"/>
    <path d="M31 8 Q40 20,31 32" fill="none" stroke="#BBB" stroke-width="1"/>
  </svg>`;
}

function pumpIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="20" r="12" fill="#0288D1" stroke="#01579B" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="4" fill="#B3E5FC"/>
    <rect x="30" y="17" width="8" height="6" rx="2" fill="#0277BD"/>
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#555">PUMP</text>
  </svg>`;
}

function fanIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#888" stroke-width="1"/>
    <circle cx="20" cy="20" r="3" fill="#555"/>
    <path d="M20 17 Q14 6,20 8 Q26 10,20 17" fill="#78909C"/><path d="M23 20 Q34 14,32 20 Q30 26,23 20" fill="#78909C"/>
    <path d="M20 23 Q26 34,20 32 Q14 30,20 23" fill="#78909C"/><path d="M17 20 Q6 26,8 20 Q10 14,17 20" fill="#78909C"/>
  </svg>`;
}

function commIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="6" width="32" height="28" rx="5" fill="${color}" stroke="#222" stroke-width="1"/>
    <path d="M14 14 L20 10 L26 14" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    <path d="M12 18 L20 12 L28 18" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    <text x="20" y="28" text-anchor="middle" font-size="7" font-weight="bold" fill="white">${label}</text>
  </svg>`;
}

function batteryIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="8" y="8" width="22" height="28" rx="2" fill="#4CAF50" stroke="#333" stroke-width="1"/>
    <rect x="14" y="4" width="10" height="5" rx="1" fill="#333"/>
    <rect x="12" y="14" width="14" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
    <rect x="12" y="20" width="14" height="4" rx="1" fill="rgba(255,255,255,0.2)"/>
    <rect x="12" y="26" width="14" height="4" rx="1" fill="rgba(255,255,255,0.1)"/>
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function powerIcon(color, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="8" width="32" height="24" rx="3" fill="${color}" stroke="#222" stroke-width="1"/>
    <text x="20" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="white">${label}</text>
    <line x1="4" y1="20" x2="0" y2="20" stroke="#F44336" stroke-width="2"/><line x1="36" y1="20" x2="40" y2="20" stroke="#333" stroke-width="2"/>
  </svg>`;
}

function regIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="8" y="4" width="24" height="24" rx="2" fill="#212121" stroke="#333" stroke-width="1"/>
    <rect x="4" y="4" width="6" height="24" rx="1" fill="#37474F"/>
    <text x="22" y="20" text-anchor="middle" font-size="6" font-weight="bold" fill="white">${label}</text>
    <line x1="14" y1="28" x2="14" y2="38" stroke="#888" stroke-width="1.5"/><line x1="20" y1="28" x2="20" y2="38" stroke="#888" stroke-width="1.5"/><line x1="26" y1="28" x2="26" y2="38" stroke="#888" stroke-width="1.5"/>
  </svg>`;
}

function solarIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="8" width="32" height="24" rx="2" fill="#1565C0" stroke="#0D47A1" stroke-width="1"/>
    <line x1="4" y1="16" x2="36" y2="16" stroke="#0D47A1" stroke-width="0.5"/><line x1="4" y1="24" x2="36" y2="24" stroke="#0D47A1" stroke-width="0.5"/>
    <line x1="15" y1="8" x2="15" y2="32" stroke="#0D47A1" stroke-width="0.5"/><line x1="25" y1="8" x2="25" y2="32" stroke="#0D47A1" stroke-width="0.5"/>
    <circle cx="32" cy="6" r="4" fill="#FFD600" opacity="0.8"/>
  </svg>`;
}

function connIcon(bgColor, label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="8" width="32" height="24" rx="4" fill="${bgColor}" stroke="#888" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" font-size="9" font-weight="bold" fill="#555">${label}</text>
  </svg>`;
}

function wireIcon(color) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <path d="M4 20 Q10 10,16 20 Q22 30,28 20 Q34 10,36 20" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="4" cy="20" r="2" fill="#888"/><circle cx="36" cy="20" r="2" fill="#888"/>
  </svg>`;
}

function buttonIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="8" y="12" width="24" height="16" rx="2" fill="#E0E0E0" stroke="#888" stroke-width="1"/>
    <circle cx="20" cy="20" r="6" fill="#F44336" stroke="#C62828" stroke-width="1"/>
    <rect x="2" y="17" width="8" height="2" rx="1" fill="#888"/><rect x="2" y="21" width="8" height="2" rx="1" fill="#888"/>
    <rect x="30" y="17" width="8" height="2" rx="1" fill="#888"/><rect x="30" y="21" width="8" height="2" rx="1" fill="#888"/>
  </svg>`;
}

function switchIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="6" y="12" width="28" height="16" rx="8" fill="#BDBDBD" stroke="#888" stroke-width="1"/>
    <circle cx="26" cy="20" r="6" fill="#4CAF50"/>
    <text x="20" y="36" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function keypadIcon(label) {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="4" y="4" width="32" height="32" rx="3" fill="#E0E0E0" stroke="#888" stroke-width="1"/>
    ${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect x="${8+c*9}" y="${8+r*7}" width="7" height="5" rx="1" fill="#9E9E9E"/>`).join('')).join('')}
    <text x="20" y="38" text-anchor="middle" font-size="5" fill="#555">${label}</text>
  </svg>`;
}

function joystickIcon() {
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="6" y="16" width="28" height="20" rx="3" fill="#424242" stroke="#222" stroke-width="1"/>
    <circle cx="20" cy="14" r="8" fill="#616161" stroke="#333" stroke-width="1"/>
    <circle cx="20" cy="14" r="4" fill="#9E9E9E"/>
    <circle cx="20" cy="14" r="2" fill="#E0E0E0"/>
  </svg>`;
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function getComponentIcon(componentId) {
  const iconFn = ICONS[componentId];
  if (iconFn) return iconFn();
  
  // Fallback: generate a generic icon from the first 3 chars
  const label = componentId.replace(/-/g, ' ').substring(0, 4).toUpperCase();
  return `<svg viewBox="0 0 40 40" width="40" height="40">
    <rect x="3" y="3" width="34" height="34" rx="6" fill="#E8F0FE" stroke="#1a73e8" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="#1a73e8">${label}</text>
  </svg>`;
}
