/**
 * Generates high-fidelity SVG assets. Run: node scripts/generate-component-svgs.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PART_BUILDERS, ledFromTemplate, blueBreakout, dipBreakout, icDip } from './svgPartsLibrary.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_SRC = path.join(__dirname, '../src/assets/components')
const OUT_PUBLIC = path.join(__dirname, '../public/assets/components')
const LEGACY = path.join(__dirname, '../src/assets')

for (const dir of [OUT_SRC, OUT_PUBLIC]) fs.mkdirSync(dir, { recursive: true })

function write(name, body) {
  const content = (typeof body === 'function' ? body() : body).trim() + '\n'
  for (const dir of [OUT_SRC, OUT_PUBLIC]) {
    fs.writeFileSync(path.join(dir, `${name}.svg`), content, 'utf8')
  }
  console.log('wrote', name)
}

// Premium legacy artwork
for (const [src, dest] of [
  ['arduino.svg', 'arduino-uno.svg'],
  ['resistor.svg', 'resistor.svg'],
  ['led.svg', 'led-red.svg'],
]) {
  for (const dir of [OUT_SRC, OUT_PUBLIC]) {
    fs.copyFileSync(path.join(LEGACY, src), path.join(dir, dest))
  }
}

const LED_COLORS = [
  ['led-green', '#4CAF50', '#2E7D32'],
  ['led-blue', '#2196F3', '#1565C0'],
  ['led-yellow', '#FFEB3B', '#F9A825'],
  ['led-white', '#FAFAFA', '#E0E0E0'],
  ['led-ir', '#4A148C', '#311B92'],
]
for (const [name, hex, dark] of LED_COLORS) write(name, ledFromTemplate(hex, dark))

// Library-built high-detail parts
for (const [name, builder] of Object.entries(PART_BUILDERS)) {
  write(name, builder)
}

// Dedicated sensor / module artwork (per real board shape)
write('bmp280', () => blueBreakout(120, 72, 'BMP280', ['VCC', 'GND', 'SCL', 'SDA'], { chip: 'BOSCH', uid: 'bmp' }))
write('bme280', () => blueBreakout(120, 72, 'BME280', ['VCC', 'GND', 'SCL', 'SDA'], { chip: 'BME280', uid: 'bme' }))
write('adxl345', () => blueBreakout(120, 72, 'ADXL345', ['VCC', 'GND', 'SCL', 'SDA', 'SDO', 'CS'], { chip: 'ADXL345', uid: 'adxl' }))
write('max30102', () => blueBreakout(120, 78, 'MAX30102', ['VCC', 'GND', 'SCL', 'SDA'], { chip: 'MAX30102', uid: 'max' }))
write('ds18b20', () => blueBreakout(110, 70, 'DS18B20', ['VCC', 'DQ', 'GND'], { chip: '18B20', uid: 'ds18' }))
write('rotary-encoder', () => blueBreakout(130, 80, 'ENCODER', ['CLK', 'DT', 'SW', 'VCC', 'GND'], { uid: 'enc' }))
write('ir-sensor', () => blueBreakout(120, 72, 'IR SENSOR', ['VCC', 'GND', 'OUT'], { uid: 'ir' }))
write('sound-sensor', () => blueBreakout(120, 72, 'SOUND', ['VCC', 'GND', 'AO', 'DO'], { uid: 'snd' }))
write('water-level', () => blueBreakout(120, 72, 'WATER', ['VCC', 'GND', 'S'], { uid: 'h2o' }))
write('flame-sensor', () => blueBreakout(120, 72, 'FLAME', ['VCC', 'GND', 'DO', 'AO'], { uid: 'flame' }))
write('mq135-air', () => blueBreakout(130, 95, 'MQ-135', ['VCC', 'GND', 'AO', 'DO'], { uid: 'mq135' }))
write('hx711', () => blueBreakout(140, 78, 'HX711', ['VCC', 'GND', 'DT', 'SCK', 'E+', 'E-', 'A+', 'A-'], { chip: 'HX711', uid: 'hx' }))
write('acs712', () => blueBreakout(130, 78, 'ACS712', ['VCC', 'GND', 'OUT', 'IP+', 'IP-'], { uid: 'acs' }))
write('tcs3200', () => blueBreakout(130, 78, 'TCS3200', ['VCC', 'GND', 'S0', 'S1', 'S2', 'S3', 'OUT'], { uid: 'tcs' }))
write('rain-sensor', () => blueBreakout(120, 72, 'RAIN', ['VCC', 'GND', 'AO', 'DO'], { uid: 'rain' }))
write('touch-sensor', () => blueBreakout(110, 70, 'TOUCH', ['VCC', 'GND', 'SIG'], { uid: 'touch' }))
write('hall-effect', () => blueBreakout(110, 70, 'HALL', ['VCC', 'GND', 'OUT'], { uid: 'hall' }))
write('vibration-sensor', () => blueBreakout(110, 70, 'VIB', ['VCC', 'GND', 'DO'], { uid: 'vib' }))
write('uv-sensor', () => blueBreakout(110, 70, 'UV', ['VCC', 'GND', 'OUT'], { uid: 'uv' }))
write('flex-sensor', () => blueBreakout(110, 70, 'FLEX', ['VCC', 'GND', 'SIG'], { uid: 'flex' }))
write('force-sensor', () => blueBreakout(110, 70, 'FSR', ['VCC', 'GND', 'SIG'], { uid: 'fsr' }))
write('tilt-sensor', () => blueBreakout(110, 70, 'TILT', ['VCC', 'GND', 'SIG'], { uid: 'tilt' }))
write('fingerprint-sensor', () => blueBreakout(130, 85, 'FINGER', ['VCC', 'GND', 'TX', 'RX'], { uid: 'finger' }))
write('voltage-sensor', () => blueBreakout(110, 70, 'VOLT', ['VCC', 'GND', 'S'], { uid: 'volt' }))
write('ir-receiver', () => blueBreakout(110, 70, 'IR RX', ['VCC', 'GND', 'OUT'], { uid: 'irrx' }))
write('ir-transmitter', () => blueBreakout(110, 70, 'IR TX', ['VCC', 'GND', 'IN'], { uid: 'irtx' }))
write('thermistor-ntc', () => blueBreakout(110, 70, 'NTC', ['VCC', 'GND', 'SIG'], { uid: 'ntc' }))

write('oled-module', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 75" width="110" height="75">
<defs><filter id="osh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
<rect x="3" y="2" width="104" height="66" rx="3" fill="#111" stroke="#333" filter="url(#osh)"/>
<rect x="10" y="16" width="90" height="42" rx="1" fill="#000"/>
<rect x="12" y="18" width="86" height="38" fill="#0a0a0a"/>
<text x="55" y="42" text-anchor="middle" fill="#0f0" font-family="monospace" font-size="10">0.96" OLED</text>
<g fill="#ddd"><circle cx="16" cy="8" r="3"/><circle cx="36" cy="8" r="3"/><circle cx="56" cy="8" r="3"/><circle cx="76" cy="8" r="3"/></g>
<g fill="#111"><circle cx="16" cy="8" r="1.5"/><circle cx="36" cy="8" r="1.5"/><circle cx="56" cy="8" r="1.5"/><circle cx="76" cy="8" r="1.5"/></g>
<text x="16" y="15" text-anchor="middle" font-size="4" fill="#fff">VCC</text><text x="36" y="15" text-anchor="middle" font-size="4" fill="#fff">GND</text><text x="56" y="15" text-anchor="middle" font-size="4" fill="#fff">SCL</text><text x="76" y="15" text-anchor="middle" font-size="4" fill="#fff">SDA</text>
</svg>`)

write('tft-module', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 110" width="130" height="110">
<rect x="8" y="6" width="114" height="88" rx="5" fill="#263238" stroke="#111" filter="url(#sh)"/>
<defs><filter id="sh"><feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity="0.35"/></filter></defs>
<rect x="14" y="12" width="102" height="72" fill="#1565C0"/>
<rect x="18" y="16" width="94" height="64" fill="#42A5F5" opacity="0.4"/>
<rect x="45" y="94" width="40" height="12" rx="2" fill="#455A64"/>
<text x="65" y="55" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">TFT</text>
</svg>`)

write('esp8266', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 65" width="130" height="65">
<rect x="2" y="2" width="126" height="60" rx="2" fill="#1a1a1a" stroke="#333"/>
<rect x="42" y="14" width="46" height="32" fill="#111" stroke="#444"/>
<text x="65" y="34" text-anchor="middle" fill="#fff" font-size="8" font-family="monospace">ESP-12E</text>
<g fill="#ccc">${Array.from({ length: 8 }, (_, i) => `<circle cx="${12 + i * 14}" cy="6" r="3"/><circle cx="${12 + i * 14}" cy="58" r="3"/>`).join('')}</g>
<g fill="#111">${Array.from({ length: 8 }, (_, i) => `<circle cx="${12 + i * 14}" cy="6" r="1.5"/><circle cx="${12 + i * 14}" cy="58" r="1.5"/>`).join('')}</g>
</svg>`)

write('rpi-pico', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 95" width="220" height="95">
<rect x="4" y="4" width="212" height="87" rx="3" fill="#059669" stroke="#047857"/>
<rect x="78" y="28" width="64" height="40" rx="2" fill="#111"/>
<text x="110" y="54" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">Raspberry Pi Pico</text>
<g fill="#D4AF37"><circle cx="14" cy="18" r="4"/><circle cx="206" cy="18" r="4"/><circle cx="14" cy="77" r="4"/><circle cx="206" cy="77" r="4"/></g>
<g fill="#ddd">${Array.from({ length: 20 }, (_, i) => `<circle cx="${14 + i * 10}" cy="8" r="3"/><circle cx="${14 + i * 10}" cy="87" r="3"/>`).join('')}
<circle cx="120" cy="80" r="3"/><circle cx="130" cy="80" r="3"/><circle cx="140" cy="80" r="3"/></g>
<g fill="#111">${Array.from({ length: 20 }, (_, i) => `<circle cx="${14 + i * 10}" cy="8" r="1.5"/><circle cx="${14 + i * 10}" cy="87" r="1.5"/>`).join('')}
<circle cx="120" cy="80" r="1.5"/><circle cx="130" cy="80" r="1.5"/><circle cx="140" cy="80" r="1.5"/></g>
</svg>`)

write('stm32-bluepill', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 55" width="150" height="55">
<rect x="3" y="2" width="144" height="50" rx="2" fill="#1565C0" stroke="#0D47A1"/>
<rect x="55" y="14" width="40" height="26" fill="#111"/>
<text x="75" y="31" text-anchor="middle" fill="#fff" font-size="8">STM32F103</text>
<g fill="#ddd">${Array.from({ length: 20 }, (_, i) => `<circle cx="${9.5 + i * 7}" cy="6" r="2.5"/><circle cx="${9.5 + i * 7}" cy="48" r="2.5"/>`).join('')}</g>
<g fill="#111">${Array.from({ length: 20 }, (_, i) => `<circle cx="${9.5 + i * 7}" cy="6" r="1.5"/><circle cx="${9.5 + i * 7}" cy="48" r="1.5"/>`).join('')}</g>
</svg>`)

write('microbit', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 125" width="110" height="125">
<rect x="12" y="10" width="86" height="105" rx="12" fill="#4CAF50" stroke="#388E3C"/>
<rect x="24" y="24" width="62" height="48" rx="3" fill="#111"/>
<g fill="#555">${Array.from({ length: 25 }, (_, i) => `<circle cx="${30 + (i % 5) * 12}" cy="${32 + Math.floor(i / 5) * 10}" r="2.5"/>`).join('')}</g>
<text x="55" y="95" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">micro:bit</text>
<circle cx="20" cy="110" r="3" fill="#E0E0E0"/><text x="20" y="120" text-anchor="middle" fill="#111" font-size="6">0</text>
<circle cx="37" cy="110" r="3" fill="#E0E0E0"/><text x="37" y="120" text-anchor="middle" fill="#111" font-size="6">1</text>
<circle cx="55" cy="110" r="3" fill="#E0E0E0"/><text x="55" y="120" text-anchor="middle" fill="#111" font-size="6">2</text>
<circle cx="72" cy="110" r="3" fill="#E0E0E0"/><text x="72" y="120" text-anchor="middle" fill="#111" font-size="6">3V</text>
<circle cx="90" cy="110" r="3" fill="#E0E0E0"/><text x="90" y="120" text-anchor="middle" fill="#111" font-size="6">GND</text>
</svg>`)

write('rgb-led', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 110" width="70" height="110">
  <path d="M18 100 L18 70 L14 62 L14 48" stroke="#C8C8C8" stroke-width="3" fill="none"/>
  <rect x="28" y="48" width="3" height="52" fill="#C8C8C8"/><rect x="38" y="48" width="3" height="52" fill="#C8C8C8"/><rect x="48" y="48" width="3" height="52" fill="#C8C8C8"/>
  <path d="M8 46 h54 v6 a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#333"/>
  <circle cx="22" cy="28" r="14" fill="#F44336" opacity="0.9"/><circle cx="48" cy="28" r="14" fill="#2196F3" opacity="0.9"/><circle cx="35" cy="14" r="14" fill="#4CAF50" opacity="0.9"/>
</svg>`)

// Passives & semiconductors (schematic-realistic 3D)
write('potentiometer', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
<rect x="12" y="28" width="66" height="44" rx="4" fill="#E0E0E0" stroke="#9E9E9E"/>
<circle cx="45" cy="50" r="22" fill="url(#pg)" stroke="#757575"/>
<defs><radialGradient id="pg"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#9e9e9e"/></radialGradient></defs>
<circle cx="45" cy="50" r="7" fill="#424242"/>
<line x1="45" y1="8" x2="45" y2="30" stroke="#333" stroke-width="4" stroke-linecap="round"/>
<rect x="0" y="46" width="12" height="4" fill="#999"/><rect x="78" y="46" width="12" height="4" fill="#999"/>
</svg>`)

write('cap-ceramic', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 40" width="90" height="40">
<line x1="0" y1="20" x2="28" y2="20" stroke="#999" stroke-width="2"/>
<line x1="28" y1="6" x2="28" y2="34" stroke="#FF9800" stroke-width="5"/>
<line x1="38" y1="6" x2="38" y2="34" stroke="#FF9800" stroke-width="5"/>
<line x1="38" y1="20" x2="90" y2="20" stroke="#999" stroke-width="2"/>
</svg>`)

write('cap-electrolytic', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 95" width="55" height="95">
<line x1="27" y1="0" x2="27" y2="14" stroke="#999" stroke-width="2"/>
<rect x="8" y="14" width="38" height="62" rx="19" fill="#1A237E" stroke="#0D0D0D"/>
<rect x="8" y="14" width="38" height="20" rx="19" fill="#283593" opacity="0.5"/>
<text x="14" y="26" fill="#fff" font-size="11" font-weight="bold">+</text>
<line x1="27" y1="76" x2="27" y2="95" stroke="#999" stroke-width="2"/>
</svg>`)

write('inductor', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 40" width="110" height="40">
<line x1="0" y1="20" x2="12" y2="20" stroke="#999" stroke-width="2"/>
<path d="M12 20 Q17 5,22 20 Q27 35,32 20 Q37 5,42 20 Q47 35,52 20 Q57 5,62 20 Q67 35,72 20 Q77 5,82 20" fill="none" stroke="#43A047" stroke-width="3"/>
<line x1="82" y1="20" x2="110" y2="20" stroke="#999" stroke-width="2"/>
</svg>`)

write('diode', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 40" width="110" height="40">
<line x1="0" y1="20" x2="38" y2="20" stroke="#999" stroke-width="2"/>
<polygon points="38,8 38,32 62,20" fill="#212121"/>
<line x1="62" y1="8" x2="62" y2="32" stroke="#212121" stroke-width="4"/>
<line x1="62" y1="20" x2="110" y2="20" stroke="#999" stroke-width="2"/>
</svg>`)

write('transistor', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 95" width="85" height="95">
<circle cx="42" cy="48" r="32" fill="#111" stroke="#333" stroke-width="2"/>
<line x1="0" y1="48" x2="24" y2="48" stroke="#999" stroke-width="2"/>
<line x1="24" y1="30" x2="24" y2="66" stroke="#333" stroke-width="3"/>
<line x1="24" y1="34" x2="62" y2="14" stroke="#333" stroke-width="2.5"/>
<line x1="24" y1="62" x2="62" y2="82" stroke="#333" stroke-width="2.5"/>
<polygon points="62,14 72,10 72,18" fill="#333"/>
<rect x="36" y="4" width="12" height="10" fill="#222" rx="1"/>
</svg>`)

write('dc-motor', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
<circle cx="38" cy="40" r="30" fill="#9E9E9E" stroke="#616161" stroke-width="2"/>
<circle cx="38" cy="40" r="10" fill="#424242"/>
<rect x="66" y="32" width="32" height="16" fill="#757575" rx="2"/>
<rect x="92" y="35" width="8" height="10" fill="#BDBDBD"/>
<circle cx="30" cy="70" r="2" fill="#ddd"/><text x="30" y="78" text-anchor="middle" fill="#111" font-size="6">M+</text>
<circle cx="46" cy="70" r="2" fill="#ddd"/><text x="46" y="78" text-anchor="middle" fill="#111" font-size="6">M-</text>
</svg>`)

write('stepper', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" width="95" height="95">
<rect x="8" y="8" width="79" height="79" rx="4" fill="#78909C" stroke="#455A64"/>
<circle cx="47" cy="47" r="30" fill="#546E7A"/>
<circle cx="47" cy="47" r="12" fill="#CFD8DC"/>
<rect x="41" y="0" width="13" height="12" fill="#9E9E9E"/>
<circle cx="20" cy="85" r="2" fill="#ddd"/><text x="20" y="93" text-anchor="middle" fill="#fff" font-size="6">A+</text>
<circle cx="38" cy="85" r="2" fill="#ddd"/><text x="38" y="93" text-anchor="middle" fill="#fff" font-size="6">A-</text>
<circle cx="56" cy="85" r="2" fill="#ddd"/><text x="56" y="93" text-anchor="middle" fill="#fff" font-size="6">B+</text>
<circle cx="74" cy="85" r="2" fill="#ddd"/><text x="74" y="93" text-anchor="middle" fill="#fff" font-size="6">B-</text>
</svg>`)

  const relayBase = (w, h, label, pins) => {
    let base = blueBreakout(w, h, label, pins, { uid: 'relay' })
    return base.replace('</svg>', '') + 
    `<rect x="12" y="30" width="40" height="30" rx="2" fill="#111"/>
    <rect x="68" y="30" width="40" height="44" fill="#E0E0E0" stroke="#9E9E9E"/>
    <circle cx="88" cy="45" r="8" fill="#F44336" opacity="0.8"/>
    </svg>`
  }

  write('relay-module', () => relayBase(120, 85, 'Relay Module', ['VCC', 'GND', 'IN', 'COM', 'NO', 'NC']))
  write('relay-4ch', () => blueBreakout(160, 90, '4-Channel Relay', ['VCC', 'GND', 'IN1', 'IN2', 'IN3', 'IN4'], { uid: 'relay4' }).replace('</svg>', `<rect x="10" y="30" width="140" height="40" fill="#E0E0E0" stroke="#9E9E9E"/><circle cx="30" cy="50" r="8" fill="#F44336" opacity="0.8"/><circle cx="65" cy="50" r="8" fill="#F44336" opacity="0.8"/><circle cx="100" cy="50" r="8" fill="#F44336" opacity="0.8"/><circle cx="135" cy="50" r="8" fill="#F44336" opacity="0.8"/></svg>`))
  write('relay-8ch', () => blueBreakout(220, 90, '8-Channel Relay', ['VCC', 'GND', 'IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'IN8'], { uid: 'relay8' }).replace('</svg>', `<rect x="10" y="30" width="200" height="40" fill="#E0E0E0" stroke="#9E9E9E"/><rect x="20" y="45" width="180" height="10" fill="#F44336" opacity="0.8"/></svg>`))

write('motor-driver', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80">
<rect x="4" y="8" width="112" height="64" rx="3" fill="#E65100" stroke="#BF360C"/>
<rect x="12" y="16" width="96" height="44" fill="#111" rx="2"/>
<rect x="8" y="4" width="104" height="6" fill="#1a1a1a"/>
</svg>`)

  write('l293d', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
    <rect x="4" y="4" width="112" height="92" rx="4" fill="#D32F2F" stroke="#B71C1C" stroke-width="2"/>
    <!-- L293D IC -->
    <rect x="40" y="20" width="40" height="60" fill="#212121" rx="2"/>
    <circle cx="45" cy="25" r="2" fill="#555"/>
    <text x="60" y="55" fill="#E0E0E0" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(90 60 55)">L293D</text>
    <rect x="36" y="25" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="25" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="32" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="32" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="39" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="39" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="46" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="46" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="53" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="53" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="60" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="60" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="67" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="67" width="4" height="4" fill="#9E9E9E"/>
    <rect x="36" y="74" width="4" height="4" fill="#9E9E9E"/><rect x="80" y="74" width="4" height="4" fill="#9E9E9E"/>
    <!-- Screw Terminal Left Top (Motor A) -->
    <rect x="4" y="15" width="20" height="30" fill="#1565C0" stroke="#0D47A1"/>
    <circle cx="10" cy="22" r="3" fill="#E0E0E0"/>
    <circle cx="10" cy="38" r="3" fill="#E0E0E0"/>
    <text x="28" y="25" fill="#E0E0E0" font-family="monospace" font-size="8">M1</text>
    <!-- Screw Terminal Left Bottom (Motor B) -->
    <rect x="4" y="50" width="20" height="30" fill="#1565C0" stroke="#0D47A1"/>
    <circle cx="10" cy="57" r="3" fill="#E0E0E0"/>
    <circle cx="10" cy="73" r="3" fill="#E0E0E0"/>
    <text x="28" y="60" fill="#E0E0E0" font-family="monospace" font-size="8">M2</text>
    <!-- Screw Terminal Right (Power) -->
    <rect x="96" y="25" width="20" height="45" fill="#1565C0" stroke="#0D47A1"/>
    <circle cx="110" cy="32" r="3" fill="#E0E0E0"/>
    <circle cx="110" cy="47" r="3" fill="#E0E0E0"/>
    <circle cx="110" cy="62" r="3" fill="#E0E0E0"/>
    <text x="92" y="35" fill="#E0E0E0" font-family="monospace" font-size="7" text-anchor="end">5V</text>
    <text x="92" y="50" fill="#E0E0E0" font-family="monospace" font-size="7" text-anchor="end">GND</text>
    <text x="92" y="65" fill="#E0E0E0" font-family="monospace" font-size="7" text-anchor="end">VCC</text>
    <!-- Bottom Header Pins -->
    <rect x="32" y="86" width="56" height="8" fill="#424242"/>
    <circle cx="35" cy="90" r="2" fill="#FFC107"/>
    <circle cx="45" cy="90" r="2" fill="#FFC107"/>
    <circle cx="55" cy="90" r="2" fill="#FFC107"/>
    <circle cx="65" cy="90" r="2" fill="#FFC107"/>
    <circle cx="75" cy="90" r="2" fill="#FFC107"/>
    <circle cx="85" cy="90" r="2" fill="#FFC107"/>
    <text x="35" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 35 82)">EN1</text>
    <text x="45" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 45 82)">IN1</text>
    <text x="55" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 55 82)">IN2</text>
    <text x="65" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 65 82)">IN3</text>
    <text x="75" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 75 82)">IN4</text>
    <text x="85" y="82" fill="#E0E0E0" font-family="monospace" font-size="6" text-anchor="middle" transform="rotate(-90 85 82)">EN2</text>
  </svg>`)
write('a4988', () => dipBreakout(16, 'A4988', '#F44336'))
write('drv8825', () => dipBreakout(16, 'DRV8825', '#9C27B0'))
write('tb6612fng', () => dipBreakout(16, 'TB6612', '#E65100'))
write('uln2003', () => blueBreakout(140, 85, 'ULN2003', ['IN1', 'IN2', 'IN3', 'IN4', 'VCC', 'GND'], { uid: 'uln' }))
write('bts7960', () => blueBreakout(140, 85, 'BTS7960', ['VCC', 'GND', 'R_EN', 'L_EN', 'RPWM', 'LPWM'], { uid: 'bts' }))
write('pca9685', () => blueBreakout(140, 85, 'PCA9685', ['VCC', 'GND', 'SDA', 'SCL', 'OE'], { uid: 'pca' }))
write('l298n-mini', () => blueBreakout(160, 85, 'MINI L298N', ['VCC', 'GND', 'IN1', 'IN2', 'IN3', 'IN4', 'MOTA', 'MOTB'], { uid: 'l298m' }))

write('buzzer', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75" width="75" height="75">
<circle cx="37" cy="42" r="28" fill="#222"/>
<circle cx="37" cy="42" r="12" fill="#444"/>
<circle cx="37" cy="42" r="4" fill="#666"/>
<rect x="32" y="4" width="10" height="12" fill="#999"/>
<circle cx="25" cy="15" r="2" fill="#ddd"/><text x="25" y="25" text-anchor="middle" fill="#fff" font-size="6">+</text>
<circle cx="50" cy="15" r="2" fill="#ddd"/><text x="50" y="25" text-anchor="middle" fill="#fff" font-size="6">-</text>
</svg>`)

write('bluetooth-hc05', () => blueBreakout(120, 85, 'HC-05', ['VCC', 'GND', 'TXD', 'RXD', 'STATE', 'EN'], { uid: 'hc05' }))

write('comm-module', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 80" width="115" height="80">
<rect x="4" y="8" width="107" height="64" rx="3" fill="#4A148C"/>
<path d="M25 45 L35 30 L45 45 L55 30 L65 45 L75 30 L85 45" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/>
<text x="57" y="70" text-anchor="middle" fill="#fff" font-size="8">RF MODULE</text>
</svg>`)

write('power-module', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 75" width="115" height="75">
<rect x="4" y="10" width="107" height="55" rx="3" fill="#37474F"/>
<rect x="12" y="18" width="44" height="38" fill="#111"/>
<circle cx="82" cy="37" r="16" fill="none" stroke="#4CAF50" stroke-width="3"/>
<text x="82" y="41" text-anchor="middle" fill="#4CAF50" font-size="12">+</text>
</svg>`)

write('battery-9v', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 110" width="75" height="110">
<rect x="14" y="12" width="47" height="88" rx="5" fill="#4CAF50" stroke="#2E7D32"/>
<rect x="24" y="4" width="27" height="10" rx="3" fill="#333"/>
<rect x="18" y="28" width="39" height="10" fill="rgba(255,255,255,0.2)"/>
<text x="37" y="62" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">9V</text>
</svg>`)

write('battery-holder-2cell', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
  <rect x="5" y="5" width="80" height="70" rx="3" fill="#222" stroke="#444"/>
  <rect x="10" y="10" width="70" height="25" rx="3" fill="#4CAF50"/>
  <text x="45" y="27" text-anchor="middle" fill="#111" font-size="10" font-family="sans-serif">18650 3.7V</text>
  <rect x="10" y="45" width="70" height="25" rx="3" fill="#4CAF50"/>
  <text x="45" y="62" text-anchor="middle" fill="#111" font-size="10" font-family="sans-serif">18650 3.7V</text>
  <rect x="85" y="27" width="5" height="6" fill="#cc0000"/>
  <rect x="85" y="47" width="5" height="6" fill="#111111"/>
</svg>`)

write('push-button', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 65" width="85" height="65">
<rect x="10" y="14" width="65" height="38" rx="4" fill="#E0E0E0" stroke="#9E9E9E"/>
<circle cx="42" cy="33" r="14" fill="#F44336" stroke="#C62828"/>
<rect x="0" y="30" width="10" height="4" fill="#999"/><rect x="75" y="30" width="10" height="4" fill="#999"/>
</svg>`)

write('switch', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 55" width="85" height="55">
<rect x="8" y="16" width="69" height="28" rx="14" fill="#BDBDBD" stroke="#9E9E9E"/>
<circle cx="58" cy="30" r="11" fill="#4CAF50"/>
<rect x="0" y="27" width="10" height="4" fill="#999"/><rect x="75" y="27" width="10" height="4" fill="#999"/>
</svg>`)

write('joystick', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 100" width="95" height="100">
<rect x="10" y="48" width="75" height="45" rx="5" fill="#424242"/>
<circle cx="47" cy="38" r="24" fill="#616161" stroke="#333"/>
<circle cx="47" cy="38" r="10" fill="#9E9E9E"/>
<circle cx="47" cy="38" r="4" fill="#E0E0E0"/>
</svg>`)

write('neopixel-ring', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" width="95" height="95">
<circle cx="47" cy="47" r="42" fill="none" stroke="#333" stroke-width="4"/>
${['#F44336','#FF9800','#FFEB3B','#4CAF50','#2196F3','#9C27B0','#E91E63','#00BCD4'].map((c,i)=>{const a=i*Math.PI/4;return `<circle cx="${47+30*Math.cos(a)}" cy="${47+30*Math.sin(a)}" r="6" fill="${c}"/>`}).join('')}
</svg>`)

write('neopixel-strip', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 45" width="150" height="45">
<rect x="12" y="14" width="136" height="18" rx="2" fill="#222"/>
<rect x="0" y="10" width="16" height="26" rx="1" fill="#333"/>
${['#F44336','#FF9800','#FFEB3B','#4CAF50','#2196F3','#9C27B0','#E91E63','#00BCD4'].map((c,i)=>`<circle cx="${30+i*15}" cy="23" r="5" fill="${c}"/>`).join('')}
<circle cx="6" cy="14" r="2" fill="#ddd"/><text x="6" y="10" text-anchor="middle" fill="#fff" font-size="5">VCC</text>
<circle cx="6" cy="23" r="2" fill="#ddd"/><text x="6" y="32" text-anchor="middle" fill="#fff" font-size="5">DIN</text>
<circle cx="6" cy="32" r="2" fill="#ddd"/><text x="6" y="42" text-anchor="middle" fill="#fff" font-size="5">GND</text>
</svg>`)

write('jumper-wire', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 35" width="110" height="35">
<path d="M6 18 Q30 6,55 18 Q80 30,104 18" fill="none" stroke="#F44336" stroke-width="4" stroke-linecap="round"/>
<circle cx="6" cy="18" r="4" fill="#888"/><circle cx="104" cy="18" r="4" fill="#888"/>
</svg>`)

write('solar-panel', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 85" width="125" height="85">
<rect x="4" y="12" width="117" height="65" fill="#1565C0" stroke="#0D47A1"/>
<line x1="4" y1="32" x2="121" y2="32" stroke="#0D47A1"/><line x1="4" y1="52" x2="121" y2="52" stroke="#0D47A1"/>
<line x1="44" y1="12" x2="44" y2="77" stroke="#0D47A1"/><line x1="84" y1="12" x2="84" y2="77" stroke="#0D47A1"/>
<circle cx="105" cy="10" r="10" fill="#FFD600"/>
</svg>`)

write('display-7seg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 65" width="110" height="65">
  <rect x="4" y="8" width="102" height="50" rx="3" fill="#111"/>
  <text x="32" y="45" fill="#F44336" font-family="monospace" font-size="32" font-weight="bold">8</text>
  <text x="72" y="45" fill="#F44336" font-family="monospace" font-size="32" font-weight="bold">8</text>
  <circle cx="35" cy="5" r="2" fill="#ddd"/><text x="35" y="15" text-anchor="middle" fill="#fff" font-size="5">VCC</text>
  <circle cx="48" cy="5" r="2" fill="#ddd"/><text x="48" y="15" text-anchor="middle" fill="#fff" font-size="5">GND</text>
  <circle cx="61" cy="5" r="2" fill="#ddd"/><text x="61" y="15" text-anchor="middle" fill="#fff" font-size="5">DIO</text>
  <circle cx="74" cy="5" r="2" fill="#ddd"/><text x="74" y="15" text-anchor="middle" fill="#fff" font-size="5">CLK</text>
  </svg>`)

write('sensor-module', () => blueBreakout(130, 78, 'SENSOR', ['VCC', 'GND', 'OUT', 'AO'], { uid: 'sns' }))

write('l298n', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <!-- PCB -->
  <rect x="10" y="10" width="280" height="280" rx="10" fill="#D32F2F" stroke="#B71C1C" stroke-width="4"/>
  <!-- Heat Sink -->
  <rect x="30" y="20" width="240" height="80" fill="#212121" stroke="#000" stroke-width="2"/>
  <path d="M50 20 v80 M90 20 v80 M130 20 v80 M170 20 v80 M210 20 v80 M250 20 v80" stroke="#424242" stroke-width="6"/>
  <!-- L298N Chip -->
  <rect x="110" y="90" width="80" height="50" fill="#111" rx="4"/>
  <text x="150" y="120" fill="#ddd" font-size="12" text-anchor="middle" font-family="monospace">L298N</text>
  <!-- Output A Terminal Block (Left) -->
  <rect x="20" y="120" width="40" height="80" fill="#1565C0" stroke="#0D47A1"/>
  <circle cx="40" cy="140" r="8" fill="#90CAF9"/> <!-- OUT1 -->
  <circle cx="40" cy="180" r="8" fill="#90CAF9"/> <!-- OUT2 -->
  <!-- Output B Terminal Block (Right) -->
  <rect x="240" y="120" width="40" height="80" fill="#1565C0" stroke="#0D47A1"/>
  <circle cx="260" cy="140" r="8" fill="#90CAF9"/> <!-- OUT3 -->
  <circle cx="260" cy="180" r="8" fill="#90CAF9"/> <!-- OUT4 -->
  <!-- Power Terminal Block (Bottom) -->
  <rect x="90" y="240" width="120" height="40" fill="#1565C0" stroke="#0D47A1"/>
  <circle cx="110" cy="260" r="8" fill="#90CAF9"/> <!-- 12V -->
  <circle cx="150" cy="260" r="8" fill="#90CAF9"/> <!-- GND -->
  <circle cx="190" cy="260" r="8" fill="#90CAF9"/> <!-- 5V -->
  <text x="110" y="230" fill="#fff" font-size="12" text-anchor="middle">12V</text>
  <text x="150" y="230" fill="#fff" font-size="12" text-anchor="middle">GND</text>
  <text x="190" y="230" fill="#fff" font-size="12" text-anchor="middle">5V</text>
  <!-- Logic Pins (Center Bottom) -->
  <rect x="100" y="170" width="100" height="30" fill="#111"/>
  <!-- ENA IN1 IN2 IN3 IN4 ENB -->
  <g fill="#ddd">
    <rect x="108" y="180" width="8" height="8"/>
    <rect x="124" y="180" width="8" height="8"/>
    <rect x="140" y="180" width="8" height="8"/>
    <rect x="156" y="180" width="8" height="8"/>
    <rect x="172" y="180" width="8" height="8"/>
    <rect x="188" y="180" width="8" height="8"/>
  </g>
    <text x="112" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 112 165)">ENA</text>
    <text x="128" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 128 165)">IN1</text>
    <text x="144" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 144 165)">IN2</text>
    <text x="160" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 160 165)">IN3</text>
    <text x="176" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 176 165)">IN4</text>
    <text x="192" y="165" fill="#fff" font-size="8" text-anchor="start" transform="rotate(-90 192 165)">ENB</text>
  <!-- Capacitors -->
  <circle cx="70" cy="260" r="12" fill="#111"/>
  <circle cx="230" cy="260" r="12" fill="#111"/>
  </svg>`)

write('4wd-car-chassis', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" width="200" height="250">
<!-- Chassis Acrylic Base -->
<rect x="30" y="10" width="140" height="230" rx="15" fill="#4fc3f7" fill-opacity="0.3" stroke="#0288d1" stroke-width="2"/>
<!-- Front Left Wheel -->
<rect class="wheel m1" x="5" y="30" width="25" height="60" rx="5" fill="#212121" stroke="#444" stroke-width="3" stroke-dasharray="8 6"/>
<rect x="30" y="45" width="20" height="30" fill="#ffb300"/> <!-- Motor -->
<!-- Front Right Wheel -->
<rect class="wheel m2" x="170" y="30" width="25" height="60" rx="5" fill="#212121" stroke="#444" stroke-width="3" stroke-dasharray="8 6"/>
<rect x="150" y="45" width="20" height="30" fill="#ffb300"/>
<!-- Rear Left Wheel -->
<rect class="wheel m3" x="5" y="160" width="25" height="60" rx="5" fill="#212121" stroke="#444" stroke-width="3" stroke-dasharray="8 6"/>
<rect x="30" y="175" width="20" height="30" fill="#ffb300"/>
<!-- Rear Right Wheel -->
<rect class="wheel m4" x="170" y="160" width="25" height="60" rx="5" fill="#212121" stroke="#444" stroke-width="3" stroke-dasharray="8 6"/>
<rect x="150" y="175" width="20" height="30" fill="#ffb300"/>
<!-- Cutouts to make it look mechanical -->
<rect x="70" y="25" width="60" height="40" rx="5" fill="none" stroke="#0288d1" stroke-width="2"/>
<rect x="70" y="185" width="60" height="40" rx="5" fill="none" stroke="#0288d1" stroke-width="2"/>
</svg>`)

console.log('\nDone — high-fidelity SVG library written.')
