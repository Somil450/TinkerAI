/**
 * Expand component registry pin definitions into individual connectable pin IDs.
 */

const PIN_OVERRIDES = {
  'arduino-uno': [
    'AREF', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0',
    '3V3', '5V', 'GND', 'GND', 'VIN',
    'A0', 'A1', 'A2', 'A3', 'A4', 'A5',
  ],
  'arduino-nano': [
    '5V', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13',
    'A0', 'A1', 'A2', 'A3', 'A4', 'A5', '3V3', 'GND', 'VIN',
  ],
  'arduino-mega': [
    '5V', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2',
    '3V3', '5V', 'GND', 'VIN',
    'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15',
  ],
  'lcd-16x2': ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'A', 'K'],
  'lcd-20x4': ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'A', 'K'],
  '74hc595': ['Q0', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'VCC', 'SER', 'SRCLK', 'RCLK', 'OE', 'SRCLR'],
  'l298n': ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB', '5V', 'GND', '12V', 'OUT1', 'OUT2', 'OUT3', 'OUT4'],
  'mpu6050': ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'],
}

function expandRangeKey(key) {
  // GPIO0-GPIO39, D0-D13, A0-A5, Q0-Q7, LV1-LV4, GP0-GP28
  const m = key.match(/^([A-Za-z_]+)(\d+)\s*-\s*\1(\d+)$/)
  if (m) {
    const prefix = m[1]
    const start = Number(m[2])
    const end = Number(m[3])
    const ids = []
    for (let i = start; i <= end; i++) ids.push(`${prefix}${i}`)
    return ids
  }

  // D0-D53 style where prefix repeats
  const m2 = key.match(/^([A-Za-z]+)(\d+)-([A-Za-z]+)(\d+)$/)
  if (m2 && m2[1] === m2[3]) {
    const prefix = m2[1]
    const start = Number(m2[2])
    const end = Number(m2[4])
    const ids = []
    for (let i = start; i <= end; i++) ids.push(`${prefix}${i}`)
    return ids
  }

  return null
}

export function expandRegistryPins(pinsObject, componentId) {
  if (PIN_OVERRIDES[componentId]) return [...PIN_OVERRIDES[componentId]]

  if (!pinsObject || typeof pinsObject !== 'object') return []

  const out = []
  for (const [key, def] of Object.entries(pinsObject)) {
    const ranged = expandRangeKey(key)
    if (ranged) {
      out.push(...ranged)
      continue
    }

    if (key.includes('-') && def?.count) {
      const base = key.split('-')[0].replace(/\d+$/, '')
      for (let i = 0; i < def.count; i++) out.push(`${base}${i}`)
      continue
    }

    out.push(key)
  }

  return out
}
