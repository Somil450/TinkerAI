/**
 * High-fidelity Tinkercad-style SVG part builders (shared primitives + parts).
 */

export function svgOpen(w, h, uid = 'p') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="pcb-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1E88E5"/><stop offset="100%" stop-color="#0D47A1"/></linearGradient>
    <linearGradient id="pcbTeal-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00939d"/><stop offset="100%" stop-color="#007982"/></linearGradient>
    <linearGradient id="metal-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eee"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="#999"/></linearGradient>
    <linearGradient id="pin-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5f5f5"/><stop offset="100%" stop-color="#bdbdbd"/></linearGradient>
    <filter id="sh-${uid}" x="-8%" y="-8%" width="116%" height="116%"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.28"/></filter>
    <filter id="glow-${uid}"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`
}

export function svgClose() {
  return '</svg>'
}

export function pinHoles(x0, y, count, spacing = 10, w = 6, h = 10) {
  let s = '<g fill="url(#pin-p)">'
  for (let i = 0; i < count; i++) {
    const x = x0 + i * spacing
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/>`
  }
  return s.replace('url(#pin-p)', 'url(#pin-p)') + '</g>'
}

export function blueBreakout(w, h, label, pinLabels, opts = {}) {
  const uid = opts.uid || 'bb'
  const maxSpacing = 16
  const spacing = Math.min((w - 16) / Math.max(1, pinLabels.length), maxSpacing)
  const headerW = pinLabels.length * spacing
  const hx = (w - headerW) / 2
  
  let body = svgOpen(w, h, uid)
  body += `<rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="4" fill="url(#pcb-${uid})" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh-${uid})"/>`
  
  pinLabels.forEach((lb, i) => {
    const px = hx + (spacing / 2) + i * spacing
    body += `<circle cx="${px}" cy="10" r="4" fill="url(#pin-${uid})"/>`
    body += `<circle cx="${px}" cy="10" r="2.5" fill="#111"/>`
    // Use a slightly smaller font (5px or 5.5px) if there are many pins to avoid squishing
    const fsize = pinLabels.length > 5 ? 5 : 6
    body += `<text x="${px}" y="20" text-anchor="middle" fill="#fff" font-size="${fsize}" font-weight="bold" font-family="Arial,sans-serif">${lb}</text>`
  })
  if (opts.chip) {
    body += `<rect x="${w * 0.25}" y="${h * 0.4}" width="${w * 0.5}" height="${h * 0.35}" rx="2" fill="#111" stroke="#333"/>`
    body += `<text x="${w / 2}" y="${h * 0.58}" text-anchor="middle" fill="#666" font-size="7" font-family="monospace">${opts.chip}</text>`
  }
  body += `<text x="${w / 2}" y="${h - 4}" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold" font-family="Arial,sans-serif" opacity="0.9">${label}</text>`
  body += svgClose()
  return body
}

export function arduinoNano() {
  const w = 200, h = 80
  let s = svgOpen(w, h, 'nano')
  s += `<rect x="6" y="2" width="188" height="76" rx="4" fill="url(#pcbTeal-nano)" stroke="#00a8b0" filter="url(#sh-nano)"/>`
  s += `<rect x="0" y="28" width="10" height="24" fill="url(#metal-nano)" rx="1"/>`
  s += `<rect x="190" y="28" width="10" height="24" fill="url(#metal-nano)" rx="1"/>`
  s += `<rect x="14" y="6" width="172" height="8" fill="#111"/>`
  s += `<rect x="14" y="66" width="172" height="8" fill="#111"/>`
  
  const topPins = ['TX1', 'RX0', 'RST', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12']
  const botPins = ['VIN', 'GND', 'RST', '5V', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'REF', '3V3', 'D13']

  for (let i = 0; i < 15; i++) {
    const x = 18 + i * 11
    s += `<rect x="${x}" y="7" width="5" height="6" fill="url(#pin-nano)"/>`
    s += `<text x="${x + 2.5}" y="22" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" font-family="Arial">${topPins[i]}</text>`

    s += `<rect x="${x}" y="67" width="5" height="6" fill="url(#pin-nano)"/>`
    s += `<text x="${x + 2.5}" y="61" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" font-family="Arial">${botPins[i]}</text>`
  }
  
  s += `<rect x="72" y="28" width="56" height="24" rx="2" fill="#111"/>`
  s += `<text x="100" y="44" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">ATmega328</text>`
  s += `<text x="100" y="56" text-anchor="middle" fill="#fff" font-size="8">NANO</text>`
  s += `<circle cx="175" cy="20" r="3" fill="#F44336"/>`
  return s + svgClose()
}

export function arduinoMega() {
  const w = 360, h = 220
  let s = svgOpen(w, h, 'mega')
  s += `<path d="M 10 2 L 330 2 A 15 15 0 0 1 345 17 L 345 203 A 15 15 0 0 1 330 218 L 25 218 A 15 15 0 0 1 10 203 L 10 17 A 15 15 0 0 1 10 2 Z" fill="url(#pcbTeal-mega)" stroke="#00a8b0" stroke-width="2" filter="url(#sh-mega)"/>`
  s += `<text x="180" y="100" text-anchor="middle" fill="#fff" font-size="22" font-weight="bold">ARDUINO MEGA</text>`
  s += `<rect x="60" y="8" width="280" height="12" fill="#111"/><rect x="60" y="200" width="280" height="12" fill="#111"/>`
  
  const topPins = ['AREF', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0', 'TX1', 'RX1', 'TX2', 'RX2', 'TX3', 'RX3', 'SDA', 'SCL', 'GND', '5V', '3V3', 'VIN'];
  for (let i = 0; i < 28; i++) {
    const x = 68 + i * 9.5
    s += `<rect x="${x}" y="9" width="5" height="10" fill="url(#pin-mega)"/>`
    s += `<text x="${x + 2.5}" y="28" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" font-family="Arial">${topPins[i]}</text>`
  }
  for (let i = 0; i < 16; i++) {
    const x = 68 + i * 9.5
    s += `<rect x="${x}" y="201" width="5" height="10" fill="url(#pin-mega)"/>`
    s += `<text x="${x + 2.5}" y="196" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold" font-family="Arial">A${i}</text>`
  }
  
  s += `<rect x="0" y="28" width="48" height="40" fill="url(#metal-mega)" rx="2"/>`
  return s + svgClose()
}

export function esp32Devkit() {
  const w = 280, h = 100
  let s = svgOpen(w, h, 'esp')
  s += `<rect x="4" y="2" width="272" height="96" rx="4" fill="#111" stroke="#333" filter="url(#sh-esp)"/>`
  s += `<rect x="95" y="22" width="90" height="46" rx="3" fill="#2a2a2a" stroke="#444"/>`
  s += `<rect x="103" y="30" width="74" height="30" rx="2" fill="#8B4513" opacity="0.35" stroke="#5D4037"/>`
  s += `<text x="140" y="50" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">ESP32</text>`
  s += `<text x="140" y="62" text-anchor="middle" fill="#aaa" font-size="7">WROOM-32</text>`
  s += `<rect x="8" y="4" width="264" height="8" fill="#0a0a0a"/><rect x="8" y="88" width="264" height="8" fill="#0a0a0a"/>`
  
  const espTop = ['3V3', 'EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND', 'VIN', 'D21', 'RX0', 'TX0']
  const espBot = ['CMD', 'D3', 'D1', 'D22', 'D23', 'GND', 'D5', 'D18', 'D19', 'D21', 'RX2', 'TX2', 'D4', 'D2', 'D15', 'GND', '3V3', 'EN', 'GND']

  for (let i = 0; i < 19; i++) {
    const x = 12 + i * 13.5
    s += `<rect x="${x}" y="2" width="5" height="8" fill="url(#pin-esp)"/>`
    s += `<text x="${x + 2.5}" y="20" text-anchor="middle" fill="#fff" font-size="4" font-weight="bold" font-family="Arial">${espTop[i]}</text>`

    s += `<rect x="${x}" y="90" width="5" height="8" fill="url(#pin-esp)"/>`
    s += `<text x="${x + 2.5}" y="85" text-anchor="middle" fill="#fff" font-size="4" font-weight="bold" font-family="Arial">${espBot[i]}</text>`
  }
  s += `<rect x="6" y="38" width="14" height="24" fill="url(#metal-esp)" rx="1"/>`
  s += `<circle cx="258" cy="50" r="5" fill="#333" stroke="#4CAF50" stroke-width="2"/><circle cx="258" cy="50" r="2" fill="#4CAF50"/>`
  return s + svgClose()
}

export function hcSr04() {
  const w = 130, h = 88
  let s = svgOpen(w, h, 'sr04')
  s += `<rect x="4" y="4" width="122" height="76" rx="4" fill="url(#pcb-sr04)" stroke="#0a3d7a" filter="url(#sh-sr04)"/>`
  const eye = (cx) => `
    <circle cx="${cx}" cy="52" r="19" fill="#B3E5FC" stroke="#1976D2" stroke-width="2"/>
    <circle cx="${cx}" cy="52" r="12" fill="#E1F5FE"/>
    <circle cx="${cx}" cy="52" r="5" fill="#fff" opacity="0.9"/>
    <rect x="${cx - 2}" y="33" width="4" height="8" fill="#90A4AE"/>`
  s += eye(38) + eye(92)
  ;['VCC', 'TRIG', 'ECHO', 'GND'].forEach((lb, i) => {
    const px = 28 + i * 22
    s += `<circle cx="${px}" cy="12" r="4" fill="url(#pin-sr04)"/>`
    s += `<circle cx="${px}" cy="12" r="2.5" fill="#111"/>`
    s += `<text x="${px}" y="26" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">${lb}</text>`
  })
  s += `<text x="65" y="76" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">HC-SR04</text>`
  return s + svgClose()
}

export function dht22Module() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" width="80" height="110">
  <defs><linearGradient id="dhtPcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1E88E5"/><stop offset="100%" stop-color="#1565C0"/></linearGradient></defs>
  <rect x="10" y="2" width="60" height="40" rx="3" fill="url(#dhtPcb)" stroke="#0D47A1"/>
  <text x="18.5" y="18" font-size="5" fill="#fff" font-weight="bold" text-anchor="middle">VCC</text><text x="32.5" y="18" font-size="5" fill="#fff" font-weight="bold" text-anchor="middle">DAT</text><text x="46.5" y="18" font-size="5" fill="#fff" font-weight="bold" text-anchor="middle">NC</text><text x="60.5" y="18" font-size="5" fill="#fff" font-weight="bold" text-anchor="middle">GND</text>
  <g fill="#ddd"><circle cx="18.5" cy="10" r="3"/><circle cx="32.5" cy="10" r="3"/><circle cx="46.5" cy="10" r="3"/><circle cx="60.5" cy="10" r="3"/></g>
  <g fill="#111"><circle cx="18.5" cy="10" r="1.5"/><circle cx="32.5" cy="10" r="1.5"/><circle cx="46.5" cy="10" r="1.5"/><circle cx="60.5" cy="10" r="1.5"/></g>
  <rect x="24" y="44" width="32" height="56" rx="16" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="1.5"/>
  <rect x="28" y="48" width="24" height="48" rx="12" fill="#eee"/>
  <rect x="30" y="50" width="20" height="8" rx="2" fill="#1565C0" opacity="0.3"/>
  <text x="40" y="106" text-anchor="middle" fill="#555" font-size="8" font-weight="bold">DHT22</text>
</svg>`
}

export function mpu6050() {
  return blueBreakout(130, 78, 'MPU-6050', ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'], { chip: 'MPU6050', uid: 'mpu' })
}

export function pirSensor() {
  const w = 120, h = 100
  let s = svgOpen(w, h, 'pir')
  s += `<rect x="20" y="45" width="80" height="48" rx="4" fill="url(#pcb-pir)" stroke="#0a3d7a" filter="url(#sh-pir)"/>`
  s += `<ellipse cx="60" cy="42" rx="32" ry="30" fill="#fff" stroke="#e0e0e0" stroke-width="2"/>`
  s += `<ellipse cx="60" cy="42" rx="24" ry="22" fill="#f5f5f5" stroke="#bdbdbd"/>`
  s += `<circle cx="60" cy="42" r="14" fill="#fff" stroke="#9e9e9e" stroke-width="1.5"/>`
  s += `<rect x="35" y="48" width="50" height="10" rx="2" fill="#333" opacity="0.15"/>`
  ;['VCC', 'OUT', 'GND'].forEach((lb, i) => {
    const px = 38 + i * 22
    s += `<circle cx="${px + 3}" cy="52" r="3" fill="url(#pin-pir)"/>`
    s += `<circle cx="${px + 3}" cy="52" r="1.5" fill="#111"/>`
    s += `<text x="${px + 3}" y="62" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">${lb}</text>`
  })
  s += `<text x="60" y="88" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">PIR HC-SR501</text>`
  return s + svgClose()
}

export function mq2Gas() {
  const w = 130, h = 95
  let s = svgOpen(w, h, 'mq2')
  s += `<rect x="25" y="45" width="80" height="45" rx="4" fill="url(#pcb-mq2)" stroke="#0a3d7a" filter="url(#sh-mq2)"/>`
  s += `<circle cx="65" cy="38" r="28" fill="#fff" stroke="#bdbdbd" stroke-width="2"/>`
  s += `<circle cx="65" cy="38" r="22" fill="#f5f5f5" stroke="#9e9e9e"/>`
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    s += `<line x1="${65 + 8 * Math.cos(a)}" y1="${38 + 8 * Math.sin(a)}" x2="${65 + 20 * Math.cos(a)}" y2="${38 + 20 * Math.sin(a)}" stroke="#bbb" stroke-width="1"/>`
  }
  s += `<circle cx="65" cy="38" r="6" fill="#e0e0e0" stroke="#999"/>`
  ;['VCC', 'GND', 'AO', 'DO'].forEach((lb, i) => {
    const px = 38 + i * 18
    s += `<circle cx="${px + 3}" cy="52" r="3" fill="url(#pin-mq2)"/>`
    s += `<circle cx="${px + 3}" cy="52" r="1.5" fill="#111"/>`
    s += `<text x="${px + 3}" y="62" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">${lb}</text>`
  })
  s += `<text x="65" y="84" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">MQ-2</text>`
  return s + svgClose()
}

export function ldrSensor() {
  const w = 100, h = 90
  let s = svgOpen(w, h, 'ldr')
  s += `<rect x="15" y="42" width="70" height="40" rx="3" fill="url(#pcb-ldr)" stroke="#0a3d7a"/>`
  s += `<circle cx="50" cy="32" r="22" fill="#fff" stroke="#bdbdbd" stroke-width="2"/>`
  s += `<path d="M50 14 L58 28 L72 30 L62 40 L64 54 L50 46 L36 54 L38 40 L28 30 L42 28 Z" fill="#FFD54F" stroke="#FFA000" stroke-width="1"/>`
  ;['VCC', 'GND', 'OUT'].forEach((lb, i) => {
    const px = 28 + i * 22
    s += `<circle cx="${px + 3}" cy="48" r="3" fill="url(#pin-ldr)"/>`
    s += `<circle cx="${px + 3}" cy="48" r="1.5" fill="#111"/>`
    s += `<text x="${px + 3}" y="58" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">${lb}</text>`
  })
  return s + svgClose()
}

export function soilMoisture() {
  const w = 90, h = 120
  let s = svgOpen(w, h, 'soil')
  s += `<rect x="20" y="2" width="50" height="34" rx="3" fill="url(#pcb-soil)" stroke="#0a3d7a"/>`
  ;['VCC', 'GND', 'AO', 'DO'].forEach((lb, i) => {
    const px = 24 + i * 11
    s += `<circle cx="${px + 2.5}" cy="8" r="2.5" fill="#ddd"/>`
    s += `<circle cx="${px + 2.5}" cy="8" r="1.5" fill="#111"/>`
    s += `<text x="${px + 2.5}" y="18" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">${lb}</text>`
  })
  s += `<rect x="28" y="38" width="4" height="75" fill="#888"/>`
  s += `<rect x="58" y="38" width="4" height="75" fill="#888"/>`
  s += `<path d="M30 112 L26 95 L32 80 L28 65 L30 50" fill="none" stroke="#A1887F" stroke-width="3"/>`
  s += `<path d="M60 112 L64 95 L58 80 L62 65 L60 50" fill="none" stroke="#A1887F" stroke-width="3"/>`
  return s + svgClose()
}

export function lcd1602() {
  const w = 200, h = 90
  let s = svgOpen(w, h, 'lcd')
  s += `<rect x="4" y="4" width="192" height="80" rx="4" fill="#2E7D32" stroke="#1B5E20" filter="url(#sh-lcd)"/>`
  s += `<rect x="14" y="22" width="172" height="44" rx="2" fill="#1B5E20" stroke="#33691E"/>`
  s += `<rect x="18" y="26" width="164" height="18" fill="#A5D6A7" opacity="0.95"/>`
  s += `<rect x="18" y="46" width="164" height="18" fill="#A5D6A7" opacity="0.95"/>`
  s += `<text x="100" y="39" text-anchor="middle" fill="#1B5E20" font-family="monospace" font-size="11">Hello World!</text>`
  s += `<text x="100" y="59" text-anchor="middle" fill="#1B5E20" font-family="monospace" font-size="11">TinkerAI</text>`
  for (let i = 0; i < 16; i++) {
    const px = 16 + i * 11
    s += `<circle cx="${px}" cy="10" r="3" fill="#ddd"/>`
    s += `<circle cx="${px}" cy="10" r="1.5" fill="#111"/>`
    s += `<text x="${px}" y="18" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">${i + 1}</text>`
  }
  s += `<text x="100" y="86" text-anchor="middle" fill="#fff" font-size="8">LCD 16x2</text>`
  return s + svgClose()
}

export function servoSg90() {
  const w = 120, h = 95
  let s = svgOpen(w, h, 'srv')
  s += `<rect x="2" y="35" width="78" height="48" rx="6" fill="#1565C0" stroke="#0D47A1" filter="url(#sh-srv)"/>`
  s += `<text x="44" y="65" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">SG90</text>`
  s += `<circle cx="92" cy="42" r="22" fill="#E0E0E0" stroke="#9E9E9E" stroke-width="2"/>`
  s += `<circle cx="92" cy="42" r="8" fill="#757575"/>`
  s += `<rect x="88" y="12" width="24" height="14" rx="2" fill="#9E9E9E" stroke="#616161"/>`
  s += `<rect x="92" y="8" width="16" height="8" rx="1" fill="#BDBDBD"/>`
  ;['SIG', '5V', 'GND'].forEach((lb, i) => {
    s += `<circle cx="6" cy="${42 + i * 14}" r="3" fill="#ddd"/>`
    s += `<circle cx="6" cy="${42 + i * 14}" r="1.5" fill="#111"/>`
    s += `<text x="16" y="${44 + i * 14}" text-anchor="start" fill="#fff" font-size="6" font-weight="bold">${lb}</text>`
  })
  return s + svgClose()
}

export function l298nDriver() {
  const w = 150, h = 100
  let s = svgOpen(w, h, 'l298')
  s += `<rect x="4" y="4" width="142" height="92" rx="4" fill="#1565C0" stroke="#0D47A1" filter="url(#sh-l298)"/>`
  s += `<rect x="12" y="18" width="52" height="48" fill="#111" rx="2"/>`
  s += `<rect x="72" y="18" width="62" height="22" fill="#B71C1C" opacity="0.85" rx="1" stroke="#7f0000"/>`
  s += `<rect x="72" y="44" width="62" height="22" fill="#B71C1C" opacity="0.85" rx="1" stroke="#7f0000"/>`
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      s += `<rect x="${74 + c * 11}" y="${20 + r * 4}" width="8" height="2" fill="#5D4037" opacity="0.5"/>`
    }
  }
  const plb = ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB', 'VCC', 'GND', '5V', 'OUT1', 'OUT2', 'OUT3', 'OUT4']
  plb.forEach((lb, i) => {
    let px, cy
    if (i < 6) { px = 14 + i * 12; cy = 8 }
    else if (i < 9) { px = 100 + (i - 6) * 16; cy = 8 }
    else { px = 20 + (i - 9) * 28; cy = 90 }
    
    s += `<circle cx="${px + 2}" cy="${cy}" r="2.5" fill="#ddd"/>`
    s += `<circle cx="${px + 2}" cy="${cy}" r="1.5" fill="#111"/>`
    s += `<text x="${px + 2}" y="${cy > 50 ? cy - 6 : cy + 10}" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">${lb}</text>`
  })
  s += `<text x="75" y="92" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">L298N</text>`
  return s + svgClose()
}

export function breadboardSvg() {
  const w = 200, h = 140
  let s = svgOpen(w, h, 'bb')
  s += `<rect x="4" y="4" width="192" height="132" rx="6" fill="#fafafa" stroke="#e0e0e0" stroke-width="2" filter="url(#sh-bb)"/>`
  s += `<rect x="8" y="8" width="184" height="14" fill="#FFCDD2" opacity="0.55"/>`
  s += `<rect x="8" y="118" width="184" height="14" fill="#BBDEFB" opacity="0.55"/>`
  s += `<rect x="8" y="62" width="184" height="8" fill="#E0E0E0"/>`
  for (let r = 0; r < 30; r++) {
    for (let c = 0; c < 20; c++) {
      const x = 14 + c * 9
      const y = 26 + r * 3.2
      if (r === 14 || r === 15) continue
      s += `<circle cx="${x}" cy="${y}" r="1.1" fill="#bdbdbd"/>`
    }
  }
  return s + svgClose()
}

export function icDip(pins = 8, label = 'IC') {
  const w = 100, h = 20 + pins * 4
  let s = svgOpen(w, h, 'dip')
  s += `<rect x="20" y="10" width="60" height="${h - 20}" rx="2" fill="#1a1a1a" stroke="#000"/>`
  s += `<path d="M40 10 a10 10 0 0 0 20 0" fill="#1a1a1a" stroke="#000"/>`
  const half = Math.floor(pins / 2)
  for (let i = 0; i < half; i++) {
    s += `<rect x="24" y="${12 + i * 8}" width="4" height="6" fill="#bbb"/>`
    s += `<rect x="72" y="${12 + i * 8}" width="4" height="6" fill="#bbb"/>`
    // Add invisible pin holes so extractSvgPins can align perfectly!
    s += `<circle cx="20" cy="${15 + i * 8}" r="2" fill="none" opacity="0"/>`
    s += `<circle cx="80" cy="${15 + i * 8}" r="2" fill="none" opacity="0"/>`
  }
  s += `<text x="50" y="${h/2}" text-anchor="middle" fill="#ccc" font-size="8" font-family="monospace" transform="rotate(90, 50, ${h/2})">${label}</text>`
  return s + svgClose()
}

export function dipBreakout(pins = 16, label = 'Module', color = '#E65100') {
  const w = 120, h = 30 + (pins/2) * 12
  let s = svgOpen(w, h, label.toLowerCase().replace(/[^a-z]/g,''))
  s += `<rect x="10" y="10" width="100" height="${h-20}" rx="4" fill="${color}" stroke="#333"/>`
  s += `<rect x="30" y="30" width="60" height="${h-60}" rx="2" fill="#111" stroke="#000"/>`
  s += `<circle cx="60" cy="${h-20}" r="6" fill="#ccc" stroke="#888"/>`
  s += `<circle cx="60" cy="${h-20}" r="4" fill="#aaa"/>`
  const half = Math.floor(pins / 2)
  for (let i = 0; i < half; i++) {
    const py = 20 + i * 12
    s += `<circle cx="15" cy="${py}" r="4" fill="#e0e0e0"/>`
    s += `<circle cx="15" cy="${py}" r="2.5" fill="#111"/>`
    s += `<circle cx="105" cy="${py}" r="4" fill="#e0e0e0"/>`
    s += `<circle cx="105" cy="${py}" r="2.5" fill="#111"/>`
  }
  s += `<text x="60" y="${h/2}" text-anchor="middle" fill="#ccc" font-size="8" font-family="Arial,sans-serif" transform="rotate(90, 60, ${h/2})">${label}</text>`
  return s + svgClose()
}

export function ledFromTemplate(hex, darkHex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120" width="60" height="120">
  <path d="M 22 110 L 22 75 L 16 65 L 16 50" stroke="#C8C8C8" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <rect x="34" y="50" width="4" height="60" fill="#C8C8C8"/>
  <path d="M 11 48 h 38 v 8 a 2 2 0 0 1 -2 2 h -34 a 2 2 0 0 1 -2 -2 z" fill="${darkHex}"/>
  <rect x="15" y="32" width="2" height="16" fill="#A0A0A0"/>
  <path d="M 35 48 L 35 28 L 22 28 L 22 34 L 28 34 L 28 48 Z" fill="#909090"/>
  <path d="M 13 48 v -20 a 17 17 0 0 1 34 0 v 20 z" fill="${hex}" opacity="0.88"/>
  <path d="M 16 35 a 12 12 0 0 1 11 -18" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.75" stroke-linecap="round"/>
</svg>`
}

export const PART_BUILDERS = {
  'arduino-nano': arduinoNano,
  'arduino-mega': arduinoMega,
  'esp32-devkit': esp32Devkit,
  'hc-sr04': hcSr04,
  'dht-module': () => dht22Module(),
  'mpu6050': () => mpu6050(),
  'pir-sensor': pirSensor,
  'mq2-gas': mq2Gas,
  'ldr': ldrSensor,
  'soil-moisture': soilMoisture,
  'lcd-16x2': lcd1602,
  'servo': servoSg90,
  'l298n': l298nDriver,
  'breadboard': breadboardSvg,
  'ic-dip': () => icDip(8),
}
