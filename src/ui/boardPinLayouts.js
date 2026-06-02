/**
 * Physically accurate pin coordinates aligned to board SVG artwork.
 */

export const ARDUINO_UNO = {
  width: 300,
  height: 220,
  pins: (() => {
    const list = [{ id: 'AREF', x: 79, y: 17, labelSide: 'top' }]
    list.push({ id: 'GND', x: 93, y: 17, labelSide: 'top' })
    for (let n = 13; n >= 0; n--) {
      list.push({ id: `D${n}`, x: 107 + (13 - n) * 14, y: 17, labelSide: 'top' })
    }
    list.push(
      { id: '3V3', x: 107, y: 203, labelSide: 'bottom' },
      { id: '5V', x: 121, y: 203, labelSide: 'bottom' },
      { id: 'GND', x: 135, y: 203, labelSide: 'bottom' },
      { id: 'VIN', x: 163, y: 203, labelSide: 'bottom' },
    )
    for (let i = 0; i <= 5; i++) {
      list.push({ id: `A${i}`, x: 199 + i * 14, y: 203, labelSide: 'bottom' })
    }
    return list
  })(),
}

export const ARDUINO_NANO = {
  width: 200,
  height: 80,
  pins: (() => {
    const top = ['5V', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13']
    const bottom = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', '3V3', 'GND', 'VIN']
    const pins = []
    top.forEach((id, i) => pins.push({ id, x: 14 + i * 12, y: 8, labelSide: 'top' }))
    bottom.forEach((id, i) => pins.push({ id, x: 14 + i * 12, y: 72, labelSide: 'bottom' }))
    return pins
  })(),
}

export const ARDUINO_MEGA = {
  width: 360,
  height: 220,
  pins: (() => {
    const pins = []
    pins.push({ id: 'GND', x: 75, y: 17, labelSide: 'top' })
    for (let n = 13; n >= 0; n--) {
      pins.push({ id: `D${n}`, x: 89 + (13 - n) * 9, y: 17, labelSide: 'top' })
    }
    pins.push(
      { id: '3V3', x: 75, y: 203, labelSide: 'bottom' },
      { id: '5V', x: 89, y: 203, labelSide: 'bottom' },
      { id: 'GND', x: 103, y: 203, labelSide: 'bottom' },
      { id: 'VIN', x: 131, y: 203, labelSide: 'bottom' },
    )
    for (let i = 0; i <= 15; i++) {
      pins.push({ id: `A${i}`, x: 175 + i * 9, y: 203, labelSide: 'bottom' })
    }
    return pins
  })(),
}

export const HC_SR04 = {
  width: 130,
  height: 88,
  pinPositions: {
    VCC: { x: 28, y: 13, labelSide: 'top' },
    TRIG: { x: 48, y: 13, labelSide: 'top' },
    ECHO: { x: 68, y: 13, labelSide: 'top' },
    GND: { x: 88, y: 13, labelSide: 'top' },
  },
}

export const BOARD_LAYOUTS = {
  'arduino-uno': ARDUINO_UNO,
  'arduino-nano': ARDUINO_NANO,
  'arduino-mega': ARDUINO_MEGA,
  'arduino-leonardo': ARDUINO_NANO,
  'arduino-due': ARDUINO_MEGA,
  'hc-sr04': HC_SR04,
}
