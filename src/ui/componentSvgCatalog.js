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
  'breadboard-400': {
  width: 264,
  height: 396,
  pins: [
  {
    "id": "pL_neg_0",
    "x": 24,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_0",
    "x": 36,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_1",
    "x": 24,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_1",
    "x": 36,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_2",
    "x": 24,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_2",
    "x": 36,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_3",
    "x": 24,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_3",
    "x": 36,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_4",
    "x": 24,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_4",
    "x": 36,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_5",
    "x": 24,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_5",
    "x": 36,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_6",
    "x": 24,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_6",
    "x": 36,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_7",
    "x": 24,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_7",
    "x": 36,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_8",
    "x": 24,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_8",
    "x": 36,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_9",
    "x": 24,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_9",
    "x": 36,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_10",
    "x": 24,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_10",
    "x": 36,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_11",
    "x": 24,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_11",
    "x": 36,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_12",
    "x": 24,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_12",
    "x": 36,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_13",
    "x": 24,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_13",
    "x": 36,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_14",
    "x": 24,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_14",
    "x": 36,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_15",
    "x": 24,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_15",
    "x": 36,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_16",
    "x": 24,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_16",
    "x": 36,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_17",
    "x": 24,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_17",
    "x": 36,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_18",
    "x": 24,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_18",
    "x": 36,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_19",
    "x": 24,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_19",
    "x": 36,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_20",
    "x": 24,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_20",
    "x": 36,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_21",
    "x": 24,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_21",
    "x": 36,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_22",
    "x": 24,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_22",
    "x": 36,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_23",
    "x": 24,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_23",
    "x": 36,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_24",
    "x": 24,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_24",
    "x": 36,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_0",
    "x": 228,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_0",
    "x": 240,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_1",
    "x": 228,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_1",
    "x": 240,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_2",
    "x": 228,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_2",
    "x": 240,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_3",
    "x": 228,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_3",
    "x": 240,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_4",
    "x": 228,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_4",
    "x": 240,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_5",
    "x": 228,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_5",
    "x": 240,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_6",
    "x": 228,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_6",
    "x": 240,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_7",
    "x": 228,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_7",
    "x": 240,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_8",
    "x": 228,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_8",
    "x": 240,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_9",
    "x": 228,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_9",
    "x": 240,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_10",
    "x": 228,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_10",
    "x": 240,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_11",
    "x": 228,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_11",
    "x": 240,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_12",
    "x": 228,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_12",
    "x": 240,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_13",
    "x": 228,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_13",
    "x": 240,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_14",
    "x": 228,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_14",
    "x": 240,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_15",
    "x": 228,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_15",
    "x": 240,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_16",
    "x": 228,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_16",
    "x": 240,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_17",
    "x": 228,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_17",
    "x": 240,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_18",
    "x": 228,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_18",
    "x": 240,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_19",
    "x": 228,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_19",
    "x": 240,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_20",
    "x": 228,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_20",
    "x": 240,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_21",
    "x": 228,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_21",
    "x": 240,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_22",
    "x": 228,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_22",
    "x": 240,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_23",
    "x": 228,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_23",
    "x": 240,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_24",
    "x": 228,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_24",
    "x": 240,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "1a",
    "x": 60,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1f",
    "x": 156,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1b",
    "x": 72,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1g",
    "x": 168,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1c",
    "x": 84,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1h",
    "x": 180,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1d",
    "x": 96,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1i",
    "x": 192,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1e",
    "x": 108,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1j",
    "x": 204,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "2a",
    "x": 60,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2f",
    "x": 156,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2b",
    "x": 72,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2g",
    "x": 168,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2c",
    "x": 84,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2h",
    "x": 180,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2d",
    "x": 96,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2i",
    "x": 192,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2e",
    "x": 108,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2j",
    "x": 204,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "3a",
    "x": 60,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3f",
    "x": 156,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3b",
    "x": 72,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3g",
    "x": 168,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3c",
    "x": 84,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3h",
    "x": 180,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3d",
    "x": 96,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3i",
    "x": 192,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3e",
    "x": 108,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3j",
    "x": 204,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "4a",
    "x": 60,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4f",
    "x": 156,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4b",
    "x": 72,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4g",
    "x": 168,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4c",
    "x": 84,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4h",
    "x": 180,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4d",
    "x": 96,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4i",
    "x": 192,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4e",
    "x": 108,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4j",
    "x": 204,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "5a",
    "x": 60,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5f",
    "x": 156,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5b",
    "x": 72,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5g",
    "x": 168,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5c",
    "x": 84,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5h",
    "x": 180,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5d",
    "x": 96,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5i",
    "x": 192,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5e",
    "x": 108,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5j",
    "x": 204,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "6a",
    "x": 60,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6f",
    "x": 156,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6b",
    "x": 72,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6g",
    "x": 168,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6c",
    "x": 84,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6h",
    "x": 180,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6d",
    "x": 96,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6i",
    "x": 192,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6e",
    "x": 108,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6j",
    "x": 204,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "7a",
    "x": 60,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7f",
    "x": 156,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7b",
    "x": 72,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7g",
    "x": 168,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7c",
    "x": 84,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7h",
    "x": 180,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7d",
    "x": 96,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7i",
    "x": 192,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7e",
    "x": 108,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7j",
    "x": 204,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "8a",
    "x": 60,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8f",
    "x": 156,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8b",
    "x": 72,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8g",
    "x": 168,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8c",
    "x": 84,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8h",
    "x": 180,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8d",
    "x": 96,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8i",
    "x": 192,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8e",
    "x": 108,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8j",
    "x": 204,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "9a",
    "x": 60,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9f",
    "x": 156,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9b",
    "x": 72,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9g",
    "x": 168,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9c",
    "x": 84,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9h",
    "x": 180,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9d",
    "x": 96,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9i",
    "x": 192,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9e",
    "x": 108,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9j",
    "x": 204,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "10a",
    "x": 60,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10f",
    "x": 156,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10b",
    "x": 72,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10g",
    "x": 168,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10c",
    "x": 84,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10h",
    "x": 180,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10d",
    "x": 96,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10i",
    "x": 192,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10e",
    "x": 108,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10j",
    "x": 204,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "11a",
    "x": 60,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11f",
    "x": 156,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11b",
    "x": 72,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11g",
    "x": 168,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11c",
    "x": 84,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11h",
    "x": 180,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11d",
    "x": 96,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11i",
    "x": 192,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11e",
    "x": 108,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11j",
    "x": 204,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "12a",
    "x": 60,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12f",
    "x": 156,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12b",
    "x": 72,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12g",
    "x": 168,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12c",
    "x": 84,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12h",
    "x": 180,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12d",
    "x": 96,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12i",
    "x": 192,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12e",
    "x": 108,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12j",
    "x": 204,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "13a",
    "x": 60,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13f",
    "x": 156,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13b",
    "x": 72,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13g",
    "x": 168,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13c",
    "x": 84,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13h",
    "x": 180,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13d",
    "x": 96,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13i",
    "x": 192,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13e",
    "x": 108,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13j",
    "x": 204,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "14a",
    "x": 60,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14f",
    "x": 156,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14b",
    "x": 72,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14g",
    "x": 168,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14c",
    "x": 84,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14h",
    "x": 180,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14d",
    "x": 96,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14i",
    "x": 192,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14e",
    "x": 108,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14j",
    "x": 204,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "15a",
    "x": 60,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15f",
    "x": 156,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15b",
    "x": 72,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15g",
    "x": 168,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15c",
    "x": 84,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15h",
    "x": 180,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15d",
    "x": 96,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15i",
    "x": 192,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15e",
    "x": 108,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15j",
    "x": 204,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "16a",
    "x": 60,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16f",
    "x": 156,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16b",
    "x": 72,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16g",
    "x": 168,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16c",
    "x": 84,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16h",
    "x": 180,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16d",
    "x": 96,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16i",
    "x": 192,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16e",
    "x": 108,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16j",
    "x": 204,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "17a",
    "x": 60,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17f",
    "x": 156,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17b",
    "x": 72,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17g",
    "x": 168,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17c",
    "x": 84,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17h",
    "x": 180,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17d",
    "x": 96,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17i",
    "x": 192,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17e",
    "x": 108,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17j",
    "x": 204,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "18a",
    "x": 60,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18f",
    "x": 156,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18b",
    "x": 72,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18g",
    "x": 168,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18c",
    "x": 84,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18h",
    "x": 180,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18d",
    "x": 96,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18i",
    "x": 192,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18e",
    "x": 108,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18j",
    "x": 204,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "19a",
    "x": 60,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19f",
    "x": 156,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19b",
    "x": 72,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19g",
    "x": 168,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19c",
    "x": 84,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19h",
    "x": 180,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19d",
    "x": 96,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19i",
    "x": 192,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19e",
    "x": 108,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19j",
    "x": 204,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "20a",
    "x": 60,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20f",
    "x": 156,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20b",
    "x": 72,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20g",
    "x": 168,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20c",
    "x": 84,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20h",
    "x": 180,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20d",
    "x": 96,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20i",
    "x": 192,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20e",
    "x": 108,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20j",
    "x": 204,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "21a",
    "x": 60,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21f",
    "x": 156,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21b",
    "x": 72,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21g",
    "x": 168,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21c",
    "x": 84,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21h",
    "x": 180,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21d",
    "x": 96,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21i",
    "x": 192,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21e",
    "x": 108,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21j",
    "x": 204,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "22a",
    "x": 60,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22f",
    "x": 156,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22b",
    "x": 72,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22g",
    "x": 168,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22c",
    "x": 84,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22h",
    "x": 180,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22d",
    "x": 96,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22i",
    "x": 192,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22e",
    "x": 108,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22j",
    "x": 204,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "23a",
    "x": 60,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23f",
    "x": 156,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23b",
    "x": 72,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23g",
    "x": 168,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23c",
    "x": 84,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23h",
    "x": 180,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23d",
    "x": 96,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23i",
    "x": 192,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23e",
    "x": 108,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23j",
    "x": 204,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "24a",
    "x": 60,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24f",
    "x": 156,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24b",
    "x": 72,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24g",
    "x": 168,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24c",
    "x": 84,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24h",
    "x": 180,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24d",
    "x": 96,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24i",
    "x": 192,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24e",
    "x": 108,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24j",
    "x": 204,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "25a",
    "x": 60,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25f",
    "x": 156,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25b",
    "x": 72,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25g",
    "x": 168,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25c",
    "x": 84,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25h",
    "x": 180,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25d",
    "x": 96,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25i",
    "x": 192,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25e",
    "x": 108,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25j",
    "x": 204,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "26a",
    "x": 60,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26f",
    "x": 156,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26b",
    "x": 72,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26g",
    "x": 168,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26c",
    "x": 84,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26h",
    "x": 180,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26d",
    "x": 96,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26i",
    "x": 192,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26e",
    "x": 108,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26j",
    "x": 204,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "27a",
    "x": 60,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27f",
    "x": 156,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27b",
    "x": 72,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27g",
    "x": 168,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27c",
    "x": 84,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27h",
    "x": 180,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27d",
    "x": 96,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27i",
    "x": 192,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27e",
    "x": 108,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27j",
    "x": 204,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "28a",
    "x": 60,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28f",
    "x": 156,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28b",
    "x": 72,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28g",
    "x": 168,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28c",
    "x": 84,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28h",
    "x": 180,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28d",
    "x": 96,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28i",
    "x": 192,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28e",
    "x": 108,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28j",
    "x": 204,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "29a",
    "x": 60,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29f",
    "x": 156,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29b",
    "x": 72,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29g",
    "x": 168,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29c",
    "x": 84,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29h",
    "x": 180,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29d",
    "x": 96,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29i",
    "x": 192,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29e",
    "x": 108,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29j",
    "x": 204,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "30a",
    "x": 60,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30f",
    "x": 156,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30b",
    "x": 72,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30g",
    "x": 168,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30c",
    "x": 84,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30h",
    "x": 180,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30d",
    "x": 96,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30i",
    "x": 192,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30e",
    "x": 108,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30j",
    "x": 204,
    "y": 372,
    "labelSide": "none"
  }
]
},
  'breadboard-830': {
  width: 264,
  height: 792,
  pins: [
  {
    "id": "pL_neg_0",
    "x": 24,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_0",
    "x": 36,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_1",
    "x": 24,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_1",
    "x": 36,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_2",
    "x": 24,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_2",
    "x": 36,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_3",
    "x": 24,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_3",
    "x": 36,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_4",
    "x": 24,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_4",
    "x": 36,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_5",
    "x": 24,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_5",
    "x": 36,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_6",
    "x": 24,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_6",
    "x": 36,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_7",
    "x": 24,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_7",
    "x": 36,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_8",
    "x": 24,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_8",
    "x": 36,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_9",
    "x": 24,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_9",
    "x": 36,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_10",
    "x": 24,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_10",
    "x": 36,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_11",
    "x": 24,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_11",
    "x": 36,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_12",
    "x": 24,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_12",
    "x": 36,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_13",
    "x": 24,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_13",
    "x": 36,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_14",
    "x": 24,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_14",
    "x": 36,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_15",
    "x": 24,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_15",
    "x": 36,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_16",
    "x": 24,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_16",
    "x": 36,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_17",
    "x": 24,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_17",
    "x": 36,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_18",
    "x": 24,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_18",
    "x": 36,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_19",
    "x": 24,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_19",
    "x": 36,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_20",
    "x": 24,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_20",
    "x": 36,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_21",
    "x": 24,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_21",
    "x": 36,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_22",
    "x": 24,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_22",
    "x": 36,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_23",
    "x": 24,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_23",
    "x": 36,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_24",
    "x": 24,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_24",
    "x": 36,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_25",
    "x": 24,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_25",
    "x": 36,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_26",
    "x": 24,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_26",
    "x": 36,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_27",
    "x": 24,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_27",
    "x": 36,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_28",
    "x": 24,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_28",
    "x": 36,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_29",
    "x": 24,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_29",
    "x": 36,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_30",
    "x": 24,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_30",
    "x": 36,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_31",
    "x": 24,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_31",
    "x": 36,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_32",
    "x": 24,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_32",
    "x": 36,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_33",
    "x": 24,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_33",
    "x": 36,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_34",
    "x": 24,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_34",
    "x": 36,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_35",
    "x": 24,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_35",
    "x": 36,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_36",
    "x": 24,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_36",
    "x": 36,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_37",
    "x": 24,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_37",
    "x": 36,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_38",
    "x": 24,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_38",
    "x": 36,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_39",
    "x": 24,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_39",
    "x": 36,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_40",
    "x": 24,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_40",
    "x": 36,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_41",
    "x": 24,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_41",
    "x": 36,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_42",
    "x": 24,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_42",
    "x": 36,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_43",
    "x": 24,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_43",
    "x": 36,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_44",
    "x": 24,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_44",
    "x": 36,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_45",
    "x": 24,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_45",
    "x": 36,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_46",
    "x": 24,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_46",
    "x": 36,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_47",
    "x": 24,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_47",
    "x": 36,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_48",
    "x": 24,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_48",
    "x": 36,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "pL_neg_49",
    "x": 24,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "pL_pos_49",
    "x": 36,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_0",
    "x": 228,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_0",
    "x": 240,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_1",
    "x": 228,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_1",
    "x": 240,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_2",
    "x": 228,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_2",
    "x": 240,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_3",
    "x": 228,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_3",
    "x": 240,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_4",
    "x": 228,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_4",
    "x": 240,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_5",
    "x": 228,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_5",
    "x": 240,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_6",
    "x": 228,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_6",
    "x": 240,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_7",
    "x": 228,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_7",
    "x": 240,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_8",
    "x": 228,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_8",
    "x": 240,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_9",
    "x": 228,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_9",
    "x": 240,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_10",
    "x": 228,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_10",
    "x": 240,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_11",
    "x": 228,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_11",
    "x": 240,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_12",
    "x": 228,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_12",
    "x": 240,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_13",
    "x": 228,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_13",
    "x": 240,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_14",
    "x": 228,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_14",
    "x": 240,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_15",
    "x": 228,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_15",
    "x": 240,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_16",
    "x": 228,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_16",
    "x": 240,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_17",
    "x": 228,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_17",
    "x": 240,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_18",
    "x": 228,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_18",
    "x": 240,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_19",
    "x": 228,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_19",
    "x": 240,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_20",
    "x": 228,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_20",
    "x": 240,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_21",
    "x": 228,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_21",
    "x": 240,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_22",
    "x": 228,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_22",
    "x": 240,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_23",
    "x": 228,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_23",
    "x": 240,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_24",
    "x": 228,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_24",
    "x": 240,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_25",
    "x": 228,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_25",
    "x": 240,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_26",
    "x": 228,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_26",
    "x": 240,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_27",
    "x": 228,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_27",
    "x": 240,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_28",
    "x": 228,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_28",
    "x": 240,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_29",
    "x": 228,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_29",
    "x": 240,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_30",
    "x": 228,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_30",
    "x": 240,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_31",
    "x": 228,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_31",
    "x": 240,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_32",
    "x": 228,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_32",
    "x": 240,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_33",
    "x": 228,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_33",
    "x": 240,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_34",
    "x": 228,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_34",
    "x": 240,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_35",
    "x": 228,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_35",
    "x": 240,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_36",
    "x": 228,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_36",
    "x": 240,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_37",
    "x": 228,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_37",
    "x": 240,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_38",
    "x": 228,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_38",
    "x": 240,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_39",
    "x": 228,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_39",
    "x": 240,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_40",
    "x": 228,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_40",
    "x": 240,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_41",
    "x": 228,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_41",
    "x": 240,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_42",
    "x": 228,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_42",
    "x": 240,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_43",
    "x": 228,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_43",
    "x": 240,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_44",
    "x": 228,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_44",
    "x": 240,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_45",
    "x": 228,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_45",
    "x": 240,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_46",
    "x": 228,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_46",
    "x": 240,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_47",
    "x": 228,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_47",
    "x": 240,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_48",
    "x": 228,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_48",
    "x": 240,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "pR_pos_49",
    "x": 228,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "pR_neg_49",
    "x": 240,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "1a",
    "x": 60,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1f",
    "x": 156,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1b",
    "x": 72,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1g",
    "x": 168,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1c",
    "x": 84,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1h",
    "x": 180,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1d",
    "x": 96,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1i",
    "x": 192,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1e",
    "x": 108,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "1j",
    "x": 204,
    "y": 24,
    "labelSide": "none"
  },
  {
    "id": "2a",
    "x": 60,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2f",
    "x": 156,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2b",
    "x": 72,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2g",
    "x": 168,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2c",
    "x": 84,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2h",
    "x": 180,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2d",
    "x": 96,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2i",
    "x": 192,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2e",
    "x": 108,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "2j",
    "x": 204,
    "y": 36,
    "labelSide": "none"
  },
  {
    "id": "3a",
    "x": 60,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3f",
    "x": 156,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3b",
    "x": 72,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3g",
    "x": 168,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3c",
    "x": 84,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3h",
    "x": 180,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3d",
    "x": 96,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3i",
    "x": 192,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3e",
    "x": 108,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "3j",
    "x": 204,
    "y": 48,
    "labelSide": "none"
  },
  {
    "id": "4a",
    "x": 60,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4f",
    "x": 156,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4b",
    "x": 72,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4g",
    "x": 168,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4c",
    "x": 84,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4h",
    "x": 180,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4d",
    "x": 96,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4i",
    "x": 192,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4e",
    "x": 108,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "4j",
    "x": 204,
    "y": 60,
    "labelSide": "none"
  },
  {
    "id": "5a",
    "x": 60,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5f",
    "x": 156,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5b",
    "x": 72,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5g",
    "x": 168,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5c",
    "x": 84,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5h",
    "x": 180,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5d",
    "x": 96,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5i",
    "x": 192,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5e",
    "x": 108,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "5j",
    "x": 204,
    "y": 72,
    "labelSide": "none"
  },
  {
    "id": "6a",
    "x": 60,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6f",
    "x": 156,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6b",
    "x": 72,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6g",
    "x": 168,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6c",
    "x": 84,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6h",
    "x": 180,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6d",
    "x": 96,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6i",
    "x": 192,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6e",
    "x": 108,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "6j",
    "x": 204,
    "y": 84,
    "labelSide": "none"
  },
  {
    "id": "7a",
    "x": 60,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7f",
    "x": 156,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7b",
    "x": 72,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7g",
    "x": 168,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7c",
    "x": 84,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7h",
    "x": 180,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7d",
    "x": 96,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7i",
    "x": 192,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7e",
    "x": 108,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "7j",
    "x": 204,
    "y": 96,
    "labelSide": "none"
  },
  {
    "id": "8a",
    "x": 60,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8f",
    "x": 156,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8b",
    "x": 72,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8g",
    "x": 168,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8c",
    "x": 84,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8h",
    "x": 180,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8d",
    "x": 96,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8i",
    "x": 192,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8e",
    "x": 108,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "8j",
    "x": 204,
    "y": 108,
    "labelSide": "none"
  },
  {
    "id": "9a",
    "x": 60,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9f",
    "x": 156,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9b",
    "x": 72,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9g",
    "x": 168,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9c",
    "x": 84,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9h",
    "x": 180,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9d",
    "x": 96,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9i",
    "x": 192,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9e",
    "x": 108,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "9j",
    "x": 204,
    "y": 120,
    "labelSide": "none"
  },
  {
    "id": "10a",
    "x": 60,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10f",
    "x": 156,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10b",
    "x": 72,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10g",
    "x": 168,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10c",
    "x": 84,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10h",
    "x": 180,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10d",
    "x": 96,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10i",
    "x": 192,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10e",
    "x": 108,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "10j",
    "x": 204,
    "y": 132,
    "labelSide": "none"
  },
  {
    "id": "11a",
    "x": 60,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11f",
    "x": 156,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11b",
    "x": 72,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11g",
    "x": 168,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11c",
    "x": 84,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11h",
    "x": 180,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11d",
    "x": 96,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11i",
    "x": 192,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11e",
    "x": 108,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "11j",
    "x": 204,
    "y": 144,
    "labelSide": "none"
  },
  {
    "id": "12a",
    "x": 60,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12f",
    "x": 156,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12b",
    "x": 72,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12g",
    "x": 168,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12c",
    "x": 84,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12h",
    "x": 180,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12d",
    "x": 96,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12i",
    "x": 192,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12e",
    "x": 108,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "12j",
    "x": 204,
    "y": 156,
    "labelSide": "none"
  },
  {
    "id": "13a",
    "x": 60,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13f",
    "x": 156,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13b",
    "x": 72,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13g",
    "x": 168,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13c",
    "x": 84,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13h",
    "x": 180,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13d",
    "x": 96,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13i",
    "x": 192,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13e",
    "x": 108,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "13j",
    "x": 204,
    "y": 168,
    "labelSide": "none"
  },
  {
    "id": "14a",
    "x": 60,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14f",
    "x": 156,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14b",
    "x": 72,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14g",
    "x": 168,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14c",
    "x": 84,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14h",
    "x": 180,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14d",
    "x": 96,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14i",
    "x": 192,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14e",
    "x": 108,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "14j",
    "x": 204,
    "y": 180,
    "labelSide": "none"
  },
  {
    "id": "15a",
    "x": 60,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15f",
    "x": 156,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15b",
    "x": 72,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15g",
    "x": 168,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15c",
    "x": 84,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15h",
    "x": 180,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15d",
    "x": 96,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15i",
    "x": 192,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15e",
    "x": 108,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "15j",
    "x": 204,
    "y": 192,
    "labelSide": "none"
  },
  {
    "id": "16a",
    "x": 60,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16f",
    "x": 156,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16b",
    "x": 72,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16g",
    "x": 168,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16c",
    "x": 84,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16h",
    "x": 180,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16d",
    "x": 96,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16i",
    "x": 192,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16e",
    "x": 108,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "16j",
    "x": 204,
    "y": 204,
    "labelSide": "none"
  },
  {
    "id": "17a",
    "x": 60,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17f",
    "x": 156,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17b",
    "x": 72,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17g",
    "x": 168,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17c",
    "x": 84,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17h",
    "x": 180,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17d",
    "x": 96,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17i",
    "x": 192,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17e",
    "x": 108,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "17j",
    "x": 204,
    "y": 216,
    "labelSide": "none"
  },
  {
    "id": "18a",
    "x": 60,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18f",
    "x": 156,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18b",
    "x": 72,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18g",
    "x": 168,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18c",
    "x": 84,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18h",
    "x": 180,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18d",
    "x": 96,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18i",
    "x": 192,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18e",
    "x": 108,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "18j",
    "x": 204,
    "y": 228,
    "labelSide": "none"
  },
  {
    "id": "19a",
    "x": 60,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19f",
    "x": 156,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19b",
    "x": 72,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19g",
    "x": 168,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19c",
    "x": 84,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19h",
    "x": 180,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19d",
    "x": 96,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19i",
    "x": 192,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19e",
    "x": 108,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "19j",
    "x": 204,
    "y": 240,
    "labelSide": "none"
  },
  {
    "id": "20a",
    "x": 60,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20f",
    "x": 156,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20b",
    "x": 72,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20g",
    "x": 168,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20c",
    "x": 84,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20h",
    "x": 180,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20d",
    "x": 96,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20i",
    "x": 192,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20e",
    "x": 108,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "20j",
    "x": 204,
    "y": 252,
    "labelSide": "none"
  },
  {
    "id": "21a",
    "x": 60,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21f",
    "x": 156,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21b",
    "x": 72,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21g",
    "x": 168,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21c",
    "x": 84,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21h",
    "x": 180,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21d",
    "x": 96,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21i",
    "x": 192,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21e",
    "x": 108,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "21j",
    "x": 204,
    "y": 264,
    "labelSide": "none"
  },
  {
    "id": "22a",
    "x": 60,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22f",
    "x": 156,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22b",
    "x": 72,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22g",
    "x": 168,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22c",
    "x": 84,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22h",
    "x": 180,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22d",
    "x": 96,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22i",
    "x": 192,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22e",
    "x": 108,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "22j",
    "x": 204,
    "y": 276,
    "labelSide": "none"
  },
  {
    "id": "23a",
    "x": 60,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23f",
    "x": 156,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23b",
    "x": 72,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23g",
    "x": 168,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23c",
    "x": 84,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23h",
    "x": 180,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23d",
    "x": 96,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23i",
    "x": 192,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23e",
    "x": 108,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "23j",
    "x": 204,
    "y": 288,
    "labelSide": "none"
  },
  {
    "id": "24a",
    "x": 60,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24f",
    "x": 156,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24b",
    "x": 72,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24g",
    "x": 168,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24c",
    "x": 84,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24h",
    "x": 180,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24d",
    "x": 96,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24i",
    "x": 192,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24e",
    "x": 108,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "24j",
    "x": 204,
    "y": 300,
    "labelSide": "none"
  },
  {
    "id": "25a",
    "x": 60,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25f",
    "x": 156,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25b",
    "x": 72,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25g",
    "x": 168,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25c",
    "x": 84,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25h",
    "x": 180,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25d",
    "x": 96,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25i",
    "x": 192,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25e",
    "x": 108,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "25j",
    "x": 204,
    "y": 312,
    "labelSide": "none"
  },
  {
    "id": "26a",
    "x": 60,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26f",
    "x": 156,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26b",
    "x": 72,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26g",
    "x": 168,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26c",
    "x": 84,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26h",
    "x": 180,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26d",
    "x": 96,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26i",
    "x": 192,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26e",
    "x": 108,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "26j",
    "x": 204,
    "y": 324,
    "labelSide": "none"
  },
  {
    "id": "27a",
    "x": 60,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27f",
    "x": 156,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27b",
    "x": 72,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27g",
    "x": 168,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27c",
    "x": 84,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27h",
    "x": 180,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27d",
    "x": 96,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27i",
    "x": 192,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27e",
    "x": 108,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "27j",
    "x": 204,
    "y": 336,
    "labelSide": "none"
  },
  {
    "id": "28a",
    "x": 60,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28f",
    "x": 156,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28b",
    "x": 72,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28g",
    "x": 168,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28c",
    "x": 84,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28h",
    "x": 180,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28d",
    "x": 96,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28i",
    "x": 192,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28e",
    "x": 108,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "28j",
    "x": 204,
    "y": 348,
    "labelSide": "none"
  },
  {
    "id": "29a",
    "x": 60,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29f",
    "x": 156,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29b",
    "x": 72,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29g",
    "x": 168,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29c",
    "x": 84,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29h",
    "x": 180,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29d",
    "x": 96,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29i",
    "x": 192,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29e",
    "x": 108,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "29j",
    "x": 204,
    "y": 360,
    "labelSide": "none"
  },
  {
    "id": "30a",
    "x": 60,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30f",
    "x": 156,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30b",
    "x": 72,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30g",
    "x": 168,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30c",
    "x": 84,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30h",
    "x": 180,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30d",
    "x": 96,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30i",
    "x": 192,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30e",
    "x": 108,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "30j",
    "x": 204,
    "y": 372,
    "labelSide": "none"
  },
  {
    "id": "31a",
    "x": 60,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31f",
    "x": 156,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31b",
    "x": 72,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31g",
    "x": 168,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31c",
    "x": 84,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31h",
    "x": 180,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31d",
    "x": 96,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31i",
    "x": 192,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31e",
    "x": 108,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "31j",
    "x": 204,
    "y": 384,
    "labelSide": "none"
  },
  {
    "id": "32a",
    "x": 60,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32f",
    "x": 156,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32b",
    "x": 72,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32g",
    "x": 168,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32c",
    "x": 84,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32h",
    "x": 180,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32d",
    "x": 96,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32i",
    "x": 192,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32e",
    "x": 108,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "32j",
    "x": 204,
    "y": 396,
    "labelSide": "none"
  },
  {
    "id": "33a",
    "x": 60,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33f",
    "x": 156,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33b",
    "x": 72,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33g",
    "x": 168,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33c",
    "x": 84,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33h",
    "x": 180,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33d",
    "x": 96,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33i",
    "x": 192,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33e",
    "x": 108,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "33j",
    "x": 204,
    "y": 408,
    "labelSide": "none"
  },
  {
    "id": "34a",
    "x": 60,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34f",
    "x": 156,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34b",
    "x": 72,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34g",
    "x": 168,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34c",
    "x": 84,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34h",
    "x": 180,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34d",
    "x": 96,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34i",
    "x": 192,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34e",
    "x": 108,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "34j",
    "x": 204,
    "y": 420,
    "labelSide": "none"
  },
  {
    "id": "35a",
    "x": 60,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35f",
    "x": 156,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35b",
    "x": 72,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35g",
    "x": 168,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35c",
    "x": 84,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35h",
    "x": 180,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35d",
    "x": 96,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35i",
    "x": 192,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35e",
    "x": 108,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "35j",
    "x": 204,
    "y": 432,
    "labelSide": "none"
  },
  {
    "id": "36a",
    "x": 60,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36f",
    "x": 156,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36b",
    "x": 72,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36g",
    "x": 168,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36c",
    "x": 84,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36h",
    "x": 180,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36d",
    "x": 96,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36i",
    "x": 192,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36e",
    "x": 108,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "36j",
    "x": 204,
    "y": 444,
    "labelSide": "none"
  },
  {
    "id": "37a",
    "x": 60,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37f",
    "x": 156,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37b",
    "x": 72,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37g",
    "x": 168,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37c",
    "x": 84,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37h",
    "x": 180,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37d",
    "x": 96,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37i",
    "x": 192,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37e",
    "x": 108,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "37j",
    "x": 204,
    "y": 456,
    "labelSide": "none"
  },
  {
    "id": "38a",
    "x": 60,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38f",
    "x": 156,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38b",
    "x": 72,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38g",
    "x": 168,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38c",
    "x": 84,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38h",
    "x": 180,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38d",
    "x": 96,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38i",
    "x": 192,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38e",
    "x": 108,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "38j",
    "x": 204,
    "y": 468,
    "labelSide": "none"
  },
  {
    "id": "39a",
    "x": 60,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39f",
    "x": 156,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39b",
    "x": 72,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39g",
    "x": 168,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39c",
    "x": 84,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39h",
    "x": 180,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39d",
    "x": 96,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39i",
    "x": 192,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39e",
    "x": 108,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "39j",
    "x": 204,
    "y": 480,
    "labelSide": "none"
  },
  {
    "id": "40a",
    "x": 60,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40f",
    "x": 156,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40b",
    "x": 72,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40g",
    "x": 168,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40c",
    "x": 84,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40h",
    "x": 180,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40d",
    "x": 96,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40i",
    "x": 192,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40e",
    "x": 108,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "40j",
    "x": 204,
    "y": 492,
    "labelSide": "none"
  },
  {
    "id": "41a",
    "x": 60,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41f",
    "x": 156,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41b",
    "x": 72,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41g",
    "x": 168,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41c",
    "x": 84,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41h",
    "x": 180,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41d",
    "x": 96,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41i",
    "x": 192,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41e",
    "x": 108,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "41j",
    "x": 204,
    "y": 504,
    "labelSide": "none"
  },
  {
    "id": "42a",
    "x": 60,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42f",
    "x": 156,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42b",
    "x": 72,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42g",
    "x": 168,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42c",
    "x": 84,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42h",
    "x": 180,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42d",
    "x": 96,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42i",
    "x": 192,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42e",
    "x": 108,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "42j",
    "x": 204,
    "y": 516,
    "labelSide": "none"
  },
  {
    "id": "43a",
    "x": 60,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43f",
    "x": 156,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43b",
    "x": 72,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43g",
    "x": 168,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43c",
    "x": 84,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43h",
    "x": 180,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43d",
    "x": 96,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43i",
    "x": 192,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43e",
    "x": 108,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "43j",
    "x": 204,
    "y": 528,
    "labelSide": "none"
  },
  {
    "id": "44a",
    "x": 60,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44f",
    "x": 156,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44b",
    "x": 72,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44g",
    "x": 168,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44c",
    "x": 84,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44h",
    "x": 180,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44d",
    "x": 96,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44i",
    "x": 192,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44e",
    "x": 108,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "44j",
    "x": 204,
    "y": 540,
    "labelSide": "none"
  },
  {
    "id": "45a",
    "x": 60,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45f",
    "x": 156,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45b",
    "x": 72,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45g",
    "x": 168,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45c",
    "x": 84,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45h",
    "x": 180,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45d",
    "x": 96,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45i",
    "x": 192,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45e",
    "x": 108,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "45j",
    "x": 204,
    "y": 552,
    "labelSide": "none"
  },
  {
    "id": "46a",
    "x": 60,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46f",
    "x": 156,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46b",
    "x": 72,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46g",
    "x": 168,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46c",
    "x": 84,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46h",
    "x": 180,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46d",
    "x": 96,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46i",
    "x": 192,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46e",
    "x": 108,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "46j",
    "x": 204,
    "y": 564,
    "labelSide": "none"
  },
  {
    "id": "47a",
    "x": 60,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47f",
    "x": 156,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47b",
    "x": 72,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47g",
    "x": 168,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47c",
    "x": 84,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47h",
    "x": 180,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47d",
    "x": 96,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47i",
    "x": 192,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47e",
    "x": 108,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "47j",
    "x": 204,
    "y": 576,
    "labelSide": "none"
  },
  {
    "id": "48a",
    "x": 60,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48f",
    "x": 156,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48b",
    "x": 72,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48g",
    "x": 168,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48c",
    "x": 84,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48h",
    "x": 180,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48d",
    "x": 96,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48i",
    "x": 192,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48e",
    "x": 108,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "48j",
    "x": 204,
    "y": 588,
    "labelSide": "none"
  },
  {
    "id": "49a",
    "x": 60,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49f",
    "x": 156,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49b",
    "x": 72,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49g",
    "x": 168,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49c",
    "x": 84,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49h",
    "x": 180,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49d",
    "x": 96,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49i",
    "x": 192,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49e",
    "x": 108,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "49j",
    "x": 204,
    "y": 600,
    "labelSide": "none"
  },
  {
    "id": "50a",
    "x": 60,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50f",
    "x": 156,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50b",
    "x": 72,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50g",
    "x": 168,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50c",
    "x": 84,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50h",
    "x": 180,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50d",
    "x": 96,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50i",
    "x": 192,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50e",
    "x": 108,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "50j",
    "x": 204,
    "y": 612,
    "labelSide": "none"
  },
  {
    "id": "51a",
    "x": 60,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51f",
    "x": 156,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51b",
    "x": 72,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51g",
    "x": 168,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51c",
    "x": 84,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51h",
    "x": 180,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51d",
    "x": 96,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51i",
    "x": 192,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51e",
    "x": 108,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "51j",
    "x": 204,
    "y": 624,
    "labelSide": "none"
  },
  {
    "id": "52a",
    "x": 60,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52f",
    "x": 156,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52b",
    "x": 72,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52g",
    "x": 168,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52c",
    "x": 84,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52h",
    "x": 180,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52d",
    "x": 96,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52i",
    "x": 192,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52e",
    "x": 108,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "52j",
    "x": 204,
    "y": 636,
    "labelSide": "none"
  },
  {
    "id": "53a",
    "x": 60,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53f",
    "x": 156,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53b",
    "x": 72,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53g",
    "x": 168,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53c",
    "x": 84,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53h",
    "x": 180,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53d",
    "x": 96,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53i",
    "x": 192,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53e",
    "x": 108,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "53j",
    "x": 204,
    "y": 648,
    "labelSide": "none"
  },
  {
    "id": "54a",
    "x": 60,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54f",
    "x": 156,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54b",
    "x": 72,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54g",
    "x": 168,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54c",
    "x": 84,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54h",
    "x": 180,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54d",
    "x": 96,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54i",
    "x": 192,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54e",
    "x": 108,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "54j",
    "x": 204,
    "y": 660,
    "labelSide": "none"
  },
  {
    "id": "55a",
    "x": 60,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55f",
    "x": 156,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55b",
    "x": 72,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55g",
    "x": 168,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55c",
    "x": 84,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55h",
    "x": 180,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55d",
    "x": 96,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55i",
    "x": 192,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55e",
    "x": 108,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "55j",
    "x": 204,
    "y": 672,
    "labelSide": "none"
  },
  {
    "id": "56a",
    "x": 60,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56f",
    "x": 156,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56b",
    "x": 72,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56g",
    "x": 168,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56c",
    "x": 84,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56h",
    "x": 180,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56d",
    "x": 96,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56i",
    "x": 192,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56e",
    "x": 108,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "56j",
    "x": 204,
    "y": 684,
    "labelSide": "none"
  },
  {
    "id": "57a",
    "x": 60,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57f",
    "x": 156,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57b",
    "x": 72,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57g",
    "x": 168,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57c",
    "x": 84,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57h",
    "x": 180,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57d",
    "x": 96,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57i",
    "x": 192,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57e",
    "x": 108,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "57j",
    "x": 204,
    "y": 696,
    "labelSide": "none"
  },
  {
    "id": "58a",
    "x": 60,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58f",
    "x": 156,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58b",
    "x": 72,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58g",
    "x": 168,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58c",
    "x": 84,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58h",
    "x": 180,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58d",
    "x": 96,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58i",
    "x": 192,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58e",
    "x": 108,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "58j",
    "x": 204,
    "y": 708,
    "labelSide": "none"
  },
  {
    "id": "59a",
    "x": 60,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59f",
    "x": 156,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59b",
    "x": 72,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59g",
    "x": 168,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59c",
    "x": 84,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59h",
    "x": 180,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59d",
    "x": 96,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59i",
    "x": 192,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59e",
    "x": 108,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "59j",
    "x": 204,
    "y": 720,
    "labelSide": "none"
  },
  {
    "id": "60a",
    "x": 60,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60f",
    "x": 156,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60b",
    "x": 72,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60g",
    "x": 168,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60c",
    "x": 84,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60h",
    "x": 180,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60d",
    "x": 96,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60i",
    "x": 192,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60e",
    "x": 108,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "60j",
    "x": 204,
    "y": 732,
    "labelSide": "none"
  },
  {
    "id": "61a",
    "x": 60,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61f",
    "x": 156,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61b",
    "x": 72,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61g",
    "x": 168,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61c",
    "x": 84,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61h",
    "x": 180,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61d",
    "x": 96,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61i",
    "x": 192,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61e",
    "x": 108,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "61j",
    "x": 204,
    "y": 744,
    "labelSide": "none"
  },
  {
    "id": "62a",
    "x": 60,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62f",
    "x": 156,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62b",
    "x": 72,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62g",
    "x": 168,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62c",
    "x": 84,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62h",
    "x": 180,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62d",
    "x": 96,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62i",
    "x": 192,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62e",
    "x": 108,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "62j",
    "x": 204,
    "y": 756,
    "labelSide": "none"
  },
  {
    "id": "63a",
    "x": 60,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63f",
    "x": 156,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63b",
    "x": 72,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63g",
    "x": 168,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63c",
    "x": 84,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63h",
    "x": 180,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63d",
    "x": 96,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63i",
    "x": 192,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63e",
    "x": 108,
    "y": 768,
    "labelSide": "none"
  },
  {
    "id": "63j",
    "x": 204,
    "y": 768,
    "labelSide": "none"
  }
]
},
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
