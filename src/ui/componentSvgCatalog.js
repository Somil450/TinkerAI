/**
 * Maps every component ID to a real SVG archetype + canvas dimensions and pin positions.
 */
import componentVisuals from '../data/componentVisuals.json'
import { resolveArchetype } from './componentArchetypes.js'

export { resolveArchetype, resolveSvgAsset } from './componentArchetypes.js'

const ARCHETYPES = {
  'arduino-uno': {
    width: 300,
    height: 220,
    pins: (() => {
      const list = [{ id: 'GND', x: 93, y: 17 }]
      for (let n = 13; n >= 2; n--) list.push({ id: `D${n}`, x: 107 + (13 - n) * 14, y: 17 })
      list.push(
        { id: '3V3', x: 107, y: 203 },
        { id: '5V', x: 121, y: 203 },
        { id: 'GND', x: 135, y: 203 },
        { id: 'VIN', x: 163, y: 203 },
      )
      for (let i = 0; i <= 5; i++) list.push({ id: `A${i}`, x: 199 + i * 14, y: 203 })
      return list
    })(),
  },
  'arduino-nano': {
    width: 180,
    height: 70,
    pins: modulePins(180, 70, ['5V', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5']),
  },
  'arduino-mega': {
    width: 360,
    height: 220,
    pins: modulePins(360, 220, ['5V', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5']),
  },
  'esp32-devkit': {
    width: 200,
    height: 80,
    pinPositions: {
      '3V3': { x: 20, y: 10, labelSide: 'top' },
      GND: { x: 40, y: 10, labelSide: 'top' },
      GPIO2: { x: 60, y: 10, labelSide: 'top' },
      GPIO4: { x: 80, y: 10, labelSide: 'top' },
      GPIO5: { x: 100, y: 10, labelSide: 'top' },
      GPIO12: { x: 120, y: 10, labelSide: 'top' },
      GPIO13: { x: 140, y: 10, labelSide: 'top' },
      GPIO14: { x: 160, y: 10, labelSide: 'top' },
      GPIO15: { x: 180, y: 10, labelSide: 'top' },
    },
  },
  'esp8266': { width: 120, height: 60, pins: headerPins(120, 60, ['VCC', 'GND', 'TX', 'RX', 'GPIO0', 'GPIO2', 'CH_PD']) },
  'rpi-pico': { width: 200, height: 90, pins: modulePins(200, 90, ['3V3', 'GND', 'GP0', 'GP1', 'GP2', 'GP3', 'GP4', 'GP5']) },
  'stm32-bluepill': { width: 140, height: 50, pins: modulePins(140, 50, ['3V3', 'GND', 'PA0', 'PA1', 'PA2', 'PA3']) },
  'microbit': { width: 100, height: 110, pins: modulePins(100, 110, ['3V', 'GND', 'P0', 'P1', 'P2']) },
  'hc-sr04': {
    width: 130,
    height: 88,
    pinPositions: {
      VCC: { x: 28, y: 13, labelSide: 'top' },
      TRIG: { x: 48, y: 13, labelSide: 'top' },
      ECHO: { x: 68, y: 13, labelSide: 'top' },
      GND: { x: 88, y: 13, labelSide: 'top' },
    },
  },
  'dht-module': {
    width: 80,
    height: 100,
    pinPositions: {
      VCC: { x: 19, y: 10, labelSide: 'top' },
      DATA: { x: 33, y: 10, labelSide: 'top' },
      NC: { x: 47, y: 10, labelSide: 'top' },
      GND: { x: 61, y: 10, labelSide: 'top' },
    },
  },
  'sensor-module': {
    width: 130,
    height: 78,
    pinPositions: {
      VCC: { x: 26, y: 13, labelSide: 'top' },
      GND: { x: 48, y: 13, labelSide: 'top' },
      OUT: { x: 70, y: 13, labelSide: 'top' },
      AO: { x: 92, y: 13, labelSide: 'top' },
      SIG: { x: 70, y: 13, labelSide: 'top' },
      DO: { x: 70, y: 13, labelSide: 'top' },
      SCL: { x: 48, y: 13, labelSide: 'top' },
      SDA: { x: 70, y: 13, labelSide: 'top' },
      DQ: { x: 70, y: 13, labelSide: 'top' },
    },
  },
  'lcd-16x2': {
    width: 160,
    height: 80,
    pinPositions: {
      VSS: { x: 20, y: 12, labelSide: 'top' },
      VDD: { x: 36, y: 12, labelSide: 'top' },
      V0: { x: 52, y: 12, labelSide: 'top' },
      RS: { x: 68, y: 12, labelSide: 'top' },
      E: { x: 100, y: 12, labelSide: 'top' },
      D4: { x: 116, y: 12, labelSide: 'top' },
      D5: { x: 132, y: 12, labelSide: 'top' },
      D6: { x: 148, y: 12, labelSide: 'top' },
    },
  },
  'oled-module': {
    width: 100,
    height: 70,
    pinPositions: {
      VCC: { x: 18, y: 12, labelSide: 'top' },
      GND: { x: 38, y: 12, labelSide: 'top' },
      SCL: { x: 58, y: 12, labelSide: 'top' },
      SDA: { x: 78, y: 12, labelSide: 'top' },
    },
  },
  'tft-module': { width: 120, height: 100, pins: headerPins(120, 100, ['VCC', 'GND', 'CS', 'RST', 'DC', 'MOSI', 'SCK']) },
  'display-7seg': { width: 100, height: 60, pins: headerPins(100, 60, ['VCC', 'GND', 'CLK', 'DIO']) },
  'led-red': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'led-green': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'led-blue': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'led-yellow': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'led-white': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'led-ir': {
    width: 60,
    height: 120,
    pinPositions: {
      anode: { x: 16, y: 50, labelSide: 'left' },
      cathode: { x: 36, y: 110, labelSide: 'bottom' },
    },
  },
  'rgb-led': {
    width: 70,
    height: 110,
    pins: [
      { id: 'R', x: 18, y: 48 },
      { id: 'COM', x: 38, y: 48 },
      { id: 'G', x: 28, y: 48 },
      { id: 'B', x: 48, y: 48 },
    ],
  },
  'resistor': {
    width: 120,
    height: 40,
    pinPositions: {
      pin1: { x: 0, y: 20, labelSide: 'left' },
      pin2: { x: 120, y: 20, labelSide: 'right' },
    },
  },
  'potentiometer': { width: 80, height: 80, pins: [{ id: 'pin1', x: 6, y: 44 }, { id: 'wiper', x: 40, y: 8 }, { id: 'pin2', x: 74, y: 44 }] },
  'cap-ceramic': { width: 80, height: 40, pins: [{ id: 'pin1', x: 0, y: 20 }, { id: 'pin2', x: 80, y: 20 }] },
  'cap-electrolytic': { width: 60, height: 80, pins: [{ id: '+', x: 30, y: 0 }, { id: '-', x: 30, y: 80 }] },
  'inductor': { width: 100, height: 40, pins: [{ id: 'pin1', x: 0, y: 20 }, { id: 'pin2', x: 100, y: 20 }] },
  'diode': { width: 100, height: 40, pins: [{ id: 'anode', x: 0, y: 20 }, { id: 'cathode', x: 100, y: 20 }] },
  'transistor': { width: 80, height: 80, pins: [{ id: 'E', x: 0, y: 40 }, { id: 'B', x: 22, y: 25 }, { id: 'C', x: 58, y: 12 }] },
  'ic-dip': { width: 100, height: 60, pins: dipPins(100, 60, 8) },
  'dc-motor': { width: 90, height: 70, pins: [{ id: '+', x: 82, y: 35 }, { id: '-', x: 82, y: 45 }] },
  'servo': {
    width: 110,
    height: 80,
    pinPositions: {
      SIG: { x: 8, y: 28, labelSide: 'left' },
      VCC: { x: 8, y: 40, labelSide: 'left' },
      GND: { x: 8, y: 52, labelSide: 'left' },
      '5V': { x: 8, y: 40, labelSide: 'left' },
    },
  },
  'stepper': { width: 90, height: 90, pins: headerPins(90, 90, ['IN1', 'IN2', 'IN3', 'IN4', 'VCC', 'GND']) },
  'l298n': { width: 130, height: 90, pins: headerPins(130, 90, ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB', '5V', 'GND']) },
  'motor-driver': { width: 110, height: 75, pins: headerPins(110, 75, ['VCC', 'GND', 'IN1', 'IN2', 'OUT1', 'OUT2']) },
  'relay-module': { width: 100, height: 80, pins: headerPins(100, 80, ['VCC', 'GND', 'IN']) },
  'breadboard': { width: 200, height: 140, pins: [] },
  'push-button': { width: 80, height: 60, pins: [{ id: 'pin1', x: 5, y: 30 }, { id: 'pin2', x: 75, y: 30 }] },
  'battery-9v': { width: 70, height: 100, pins: [{ id: '+', x: 35, y: 8 }, { id: '-', x: 35, y: 92 }] },
  'bluetooth-hc05': { width: 90, height: 70, pins: headerPins(90, 70, ['VCC', 'GND', 'TX', 'RX', 'STATE']) },
  'comm-module': { width: 110, height: 75, pins: headerPins(110, 75, ['VCC', 'GND', 'MOSI', 'MISO', 'SCK', 'CS']) },
  'power-module': { width: 110, height: 70, pins: headerPins(110, 70, ['VIN', 'GND', 'VOUT']) },
  'buzzer': { width: 70, height: 70, pins: [{ id: '+', x: 35, y: 4 }, { id: '-', x: 35, y: 66 }] },
  'neopixel-ring': { width: 90, height: 90, pins: [{ id: 'VCC', x: 45, y: 4 }, { id: 'DIN', x: 55, y: 4 }, { id: 'GND', x: 65, y: 4 }] },
  'neopixel-strip': { width: 140, height: 40, pins: [{ id: 'VCC', x: 10, y: 8 }, { id: 'DIN', x: 20, y: 8 }, { id: 'GND', x: 30, y: 8 }] },
  'jumper-wire': { width: 100, height: 30, pins: [{ id: 'end1', x: 5, y: 15 }, { id: 'end2', x: 95, y: 15 }] },
  'switch': { width: 80, height: 50, pins: [{ id: 'pin1', x: 4, y: 25 }, { id: 'pin2', x: 76, y: 25 }] },
  'joystick': { width: 90, height: 90, pins: headerPins(90, 90, ['VCC', 'GND', 'VX', 'VY', 'SW']) },
  'solar-panel': { width: 120, height: 80, pins: [{ id: '+', x: 10, y: 40 }, { id: '-', x: 110, y: 40 }] },
}

function headerPins(w, h, ids) {
  const margin = Math.max(20, w * 0.12)
  const step = (w - 2 * margin) / Math.max(ids.length - 1, 1)
  return ids.map((id, i) => ({
    id,
    x: Math.round(margin + i * step),
    y: 14,
    labelSide: 'top',
  }))
}

function modulePins(w, h, ids) {
  const top = headerPins(w, h, ids.slice(0, Math.ceil(ids.length / 2)))
  const bottom = ids.slice(Math.ceil(ids.length / 2)).map((id, i) => ({
    id,
    x: Math.round(w * 0.15 + i * ((w * 0.7) / Math.max(ids.length / 2 - 1, 1))),
    y: h - 6,
  }))
  return [...top, ...bottom]
}

function dipPins(w, h, count) {
  const pins = []
  const left = Math.floor(count / 2)
  for (let i = 0; i < left; i++) pins.push({ id: `${i + 1}`, x: 8, y: 14 + i * 8 })
  for (let i = 0; i < count - left; i++) pins.push({ id: `${left + i + 1}`, x: w - 8, y: 14 + i * 8 })
  return pins
}

export function getComponentVisual(componentId) {
  const generated = componentVisuals[componentId]
  const archetype = resolveArchetype(componentId)
  const def = ARCHETYPES[archetype] || ARCHETYPES['sensor-module']

  if (generated) {
    return {
      archetype: generated.archetype || archetype,
      width: generated.width,
      height: generated.height,
      pins: generated.pins,
    }
  }

  return { archetype, ...def }
}
