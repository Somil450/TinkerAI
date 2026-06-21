/**
 * TinkerAI — Hardware Manager v2
 * Arduino IDE-style panel: Board Manager, Library Manager, Board & Port selector.
 * Self-contained module. Does NOT touch simulation code.
 *
 * Improvements v2:
 *  - Board specs (flash, RAM, voltage, pins, CPU speed)
 *  - USB VID/PID auto-detection → auto-matches connected board
 *  - localStorage persistence for board selection
 *  - "Verify" button (compile-only, no flash)
 *  - Connection state survives re-renders
 *  - Protocol warnings for ESP32/RP2040 (need esptool/picotool)
 *  - Better port display with USB info
 *  - Board-specific pin reference sidebar
 *  - Baud rate selector for serial
 */

import { compileCode } from '../engine/compiler.js';
import { connectToBoard, disconnectFromBoard, flashToBoard } from '../engine/flasher.js';
import { getCode, setCode } from './codeEditor.js';

// ─── VID/PID → Board auto-detection ──────────────────────────────────────────
const VID_PID_MAP = [
  { vid: 0x2341, pid: 0x0043, fqbn: 'arduino:avr:uno'      }, // Arduino Uno R3
  { vid: 0x2341, pid: 0x0001, fqbn: 'arduino:avr:uno'      }, // Arduino Uno
  { vid: 0x2341, pid: 0x0243, fqbn: 'arduino:avr:uno'      }, // Arduino Uno R3
  { vid: 0x2341, pid: 0x0045, fqbn: 'arduino:avr:mega'     }, // Arduino Mega 2560
  { vid: 0x2341, pid: 0x0010, fqbn: 'arduino:avr:mega'     }, // Arduino Mega 2560
  { vid: 0x2341, pid: 0x0036, fqbn: 'arduino:avr:leonardo' }, // Arduino Leonardo
  { vid: 0x2341, pid: 0x8036, fqbn: 'arduino:avr:leonardo' }, // Arduino Leonardo (bootloader)
  { vid: 0x1a86, pid: 0x7523, fqbn: 'arduino:avr:nano'     }, // Arduino Nano (CH340)
  { vid: 0x0403, pid: 0x6001, fqbn: 'arduino:avr:nano'     }, // Arduino Nano (FT232RL)
  { vid: 0x10c4, pid: 0xea60, fqbn: 'esp32:esp32:esp32'    }, // ESP32 / ESP8266 (CP210x)
  { vid: 0x0403, pid: 0x6015, fqbn: 'esp32:esp32:esp32'    }, // ESP32 (FT231X)
  { vid: 0x303a, pid: 0x1001, fqbn: 'esp32:esp32:esp32s3'  }, // ESP32-S3 native USB
  { vid: 0x303a, pid: 0x1002, fqbn: 'esp32:esp32:esp32c3'  }, // ESP32-C3 native USB
  { vid: 0x2e8a, pid: 0x0003, fqbn: 'rp2040:rp2040:rpipico'}, // Raspberry Pi Pico
  { vid: 0x2e8a, pid: 0x0005, fqbn: 'rp2040:rp2040:rpipicow'},// Raspberry Pi Pico W
];

// ─── Board catalog with full specs ───────────────────────────────────────────
export const BOARDS = [
  // Arduino AVR
  {
    name: 'Arduino Uno', fqbn: 'arduino:avr:uno', pkg: 'Arduino AVR', icon: '🟦',
    baud: 115200, protocol: 'stk500v1', voltage: '5V',
    flash: '32KB', ram: '2KB', cpu: 'ATmega328P @ 16MHz', pins: 14,
    analogPins: 6, color: '#2563eb', webSupported: true,
    pinRef: { '13': 'LED_BUILTIN / SCK', '12': 'MISO', '11': 'MOSI / PWM', '10': 'SS / PWM', '9': 'PWM', '6': 'PWM', '5': 'PWM', '3': 'PWM / INT1', '2': 'INT0', 'A4': 'SDA', 'A5': 'SCL', '0': 'RX', '1': 'TX' }
  },
  {
    name: 'Arduino Nano', fqbn: 'arduino:avr:nano', pkg: 'Arduino AVR', icon: '🟦',
    baud: 115200, protocol: 'stk500v1', voltage: '5V',
    flash: '32KB', ram: '2KB', cpu: 'ATmega328P @ 16MHz', pins: 22,
    analogPins: 8, color: '#2563eb', webSupported: true,
    pinRef: { 'D13': 'LED_BUILTIN / SCK', 'D12': 'MISO', 'D11': 'MOSI / PWM', 'D10': 'SS / PWM', 'D9': 'PWM', 'D6': 'PWM', 'D5': 'PWM', 'D3': 'PWM / INT1', 'D2': 'INT0', 'A4': 'SDA', 'A5': 'SCL', 'D0': 'RX', 'D1': 'TX' }
  },
  {
    name: 'Arduino Mega 2560', fqbn: 'arduino:avr:mega', pkg: 'Arduino AVR', icon: '🟦',
    baud: 115200, protocol: 'stk500v2', voltage: '5V',
    flash: '256KB', ram: '8KB', cpu: 'ATmega2560 @ 16MHz', pins: 54,
    analogPins: 16, color: '#1d4ed8', webSupported: true,
    pinRef: { '13': 'LED_BUILTIN / SCK', '52': 'SCK', '51': 'MOSI', '50': 'MISO', '53': 'SS', '20': 'SDA', '21': 'SCL', '2–13,44–46': 'PWM', '18': 'TX1', '19': 'RX1' }
  },
  {
    name: 'Arduino Leonardo', fqbn: 'arduino:avr:leonardo', pkg: 'Arduino AVR', icon: '🟦',
    baud: 57600, protocol: 'avr109', voltage: '5V',
    flash: '32KB', ram: '2.5KB', cpu: 'ATmega32u4 @ 16MHz', pins: 20,
    analogPins: 12, color: '#3b82f6', webSupported: true,
    pinRef: { '13': 'LED_BUILTIN', '11': 'MOSI', '12': 'MISO', '15': 'SCK', '2': 'SDA / INT1', '3': 'SCL / INT0 / PWM', 'TXLED': 'TX LED', 'RXLED': 'RX LED' }
  },
  {
    name: 'Arduino Pro Mini', fqbn: 'arduino:avr:pro', pkg: 'Arduino AVR', icon: '🟦',
    baud: 57600, protocol: 'stk500v1', voltage: '3.3V/5V',
    flash: '32KB', ram: '2KB', cpu: 'ATmega328P @ 8/16MHz', pins: 14,
    analogPins: 6, color: '#60a5fa', webSupported: true,
    pinRef: { '13': 'LED_BUILTIN / SCK', '12': 'MISO', '11': 'MOSI / PWM', '10': 'SS / PWM', 'A4': 'SDA', 'A5': 'SCL' }
  },
  // ESP
  {
    name: 'ESP32 Dev Module', fqbn: 'esp32:esp32:esp32', pkg: 'ESP32', icon: '🟥',
    baud: 921600, protocol: 'esptool', voltage: '3.3V',
    flash: '4MB', ram: '520KB', cpu: 'Xtensa LX6 Dual-Core @ 240MHz', pins: 38,
    analogPins: 18, color: '#dc2626', webSupported: false,
    pinRef: { '2': 'LED_BUILTIN', '21': 'SDA', '22': 'SCL', '23': 'MOSI', '19': 'MISO', '18': 'SCK', '5': 'SS', '1': 'TX0', '3': 'RX0', '4/12-15/25-27/32-39': 'GPIO' }
  },
  {
    name: 'ESP8266 NodeMCU', fqbn: 'esp8266:esp8266:nodemcuwifidevi1mhz', pkg: 'ESP8266', icon: '🟧',
    baud: 115200, protocol: 'esptool', voltage: '3.3V',
    flash: '4MB', ram: '80KB', cpu: 'Xtensa L106 @ 80/160MHz', pins: 17,
    analogPins: 1, color: '#ea580c', webSupported: false,
    pinRef: { 'D4': 'LED_BUILTIN', 'D1': 'SCL', 'D2': 'SDA', 'D5': 'SCK', 'D6': 'MISO', 'D7': 'MOSI', 'TX': 'TX', 'RX': 'RX', 'A0': 'ADC (0-3.3V, max 1V)' }
  },
  {
    name: 'ESP32-S3', fqbn: 'esp32:esp32:esp32s3', pkg: 'ESP32', icon: '🟥',
    baud: 921600, protocol: 'esptool', voltage: '3.3V',
    flash: '8MB', ram: '512KB', cpu: 'Xtensa LX7 Dual-Core @ 240MHz', pins: 45,
    analogPins: 20, color: '#b91c1c', webSupported: false,
    pinRef: { '48': 'LED_BUILTIN (Neo)', '8': 'SDA', '9': 'SCL', 'USB': 'Native USB' }
  },
  {
    name: 'ESP32-C3', fqbn: 'esp32:esp32:esp32c3', pkg: 'ESP32', icon: '🟥',
    baud: 921600, protocol: 'esptool', voltage: '3.3V',
    flash: '4MB', ram: '400KB', cpu: 'RISC-V @ 160MHz', pins: 22,
    analogPins: 6, color: '#ef4444', webSupported: false,
    pinRef: { '8': 'LED_BUILTIN', '8': 'SDA', '9': 'SCL' }
  },
  // RP2040
  {
    name: 'Raspberry Pi Pico', fqbn: 'rp2040:rp2040:rpipico', pkg: 'RP2040', icon: '🟩',
    baud: 115200, protocol: 'picotool', voltage: '3.3V',
    flash: '2MB', ram: '264KB', cpu: 'Cortex-M0+ Dual-Core @ 133MHz', pins: 26,
    analogPins: 4, color: '#16a34a', webSupported: false,
    pinRef: { '25': 'LED_BUILTIN', 'GP4': 'SDA (I2C0)', 'GP5': 'SCL (I2C0)', 'GP16': 'MISO', 'GP19': 'MOSI', 'GP18': 'SCK', 'GP17': 'CS', 'GP0/1': 'TX/RX' }
  },
  {
    name: 'Raspberry Pi Pico W', fqbn: 'rp2040:rp2040:rpipicow', pkg: 'RP2040', icon: '🟩',
    baud: 115200, protocol: 'picotool', voltage: '3.3V',
    flash: '2MB', ram: '264KB', cpu: 'Cortex-M0+ Dual-Core @ 133MHz + CYW43439 WiFi', pins: 26,
    analogPins: 4, color: '#15803d', webSupported: false,
    pinRef: { 'LED': 'via CYW43439', 'GP4': 'SDA', 'GP5': 'SCL', 'GP0/1': 'TX/RX' }
  },
  // STM32
  {
    name: 'STM32 Blue Pill', fqbn: 'STMicroelectronics:stm32:GenF1', pkg: 'STM32', icon: '⬛',
    baud: 115200, protocol: 'stm32', voltage: '3.3V',
    flash: '64KB', ram: '20KB', cpu: 'Cortex-M3 @ 72MHz', pins: 32,
    analogPins: 10, color: '#374151', webSupported: false,
    pinRef: { 'PC13': 'LED_BUILTIN', 'PB6': 'SCL', 'PB7': 'SDA', 'PA9': 'TX1', 'PA10': 'RX1' }
  },
];

// ─── Board packages ───────────────────────────────────────────────────────────
const PACKAGES = [
  { name: 'Arduino AVR Boards', id: 'arduino:avr',    version: '1.8.6',  status: 'built-in',    boards: ['Uno', 'Nano', 'Mega', 'Leonardo', 'Pro Mini'], color: '#2563eb',
    url: 'https://www.arduino.cc/en/software' },
  { name: 'ESP32 by Espressif', id: 'esp32:esp32',    version: '2.0.17', status: 'installable', boards: ['ESP32', 'ESP32-S3', 'ESP32-C3', 'ESP32-CAM'], color: '#dc2626',
    url: 'https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json' },
  { name: 'ESP8266 Community',  id: 'esp8266:esp8266',version: '3.1.2',  status: 'installable', boards: ['NodeMCU', 'Wemos D1 Mini', 'ESP-01'], color: '#ea580c',
    url: 'https://arduino.esp8266.com/stable/package_esp8266com_index.json' },
  { name: 'RP2040 by Earle F.', id: 'rp2040:rp2040',  version: '3.9.3',  status: 'installable', boards: ['Pico', 'Pico W', 'Feather RP2040'], color: '#16a34a',
    url: 'https://github.com/earlephilhower/arduino-pico/releases/download/global/package_rp2040_index.json' },
  { name: 'STM32duino',         id: 'STMicroelectronics:stm32', version: '2.7.1', status: 'installable', boards: ['Blue Pill', 'Black Pill', 'Nucleo'], color: '#6b7280',
    url: 'https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json' },
];

// ─── Library catalog ──────────────────────────────────────────────────────────
const LIBRARIES = [
  { name: 'DHT sensor library',      header: 'DHT.h',              category: 'Sensors',       author: 'Adafruit',          stars: 1400, desc: 'DHT11/DHT22 temperature & humidity sensor' },
  { name: 'NewPing',                  header: 'NewPing.h',          category: 'Sensors',       author: 'Tim Eckel',          stars: 820,  desc: 'Ultrasonic distance sensor (HC-SR04)' },
  { name: 'Adafruit Unified Sensor',  header: 'Adafruit_Sensor.h',  category: 'Sensors',       author: 'Adafruit',          stars: 940,  desc: 'Unified sensor abstraction layer' },
  { name: 'MPU6050',                  header: 'MPU6050.h',          category: 'Sensors',       author: 'Electronic Cats',    stars: 680,  desc: 'MPU-6050 gyroscope / accelerometer (I2C)' },
  { name: 'DallasTemperature',        header: 'DallasTemperature.h',category: 'Sensors',       author: 'Miles Burton',       stars: 920,  desc: 'DS18B20 1-Wire temperature sensors' },
  { name: 'OneWire',                  header: 'OneWire.h',          category: 'Sensors',       author: 'Paul Stoffregen',    stars: 1100, desc: '1-Wire protocol — required for DS18B20' },
  { name: 'Adafruit BMP280',          header: 'Adafruit_BMP280.h',  category: 'Sensors',       author: 'Adafruit',          stars: 530,  desc: 'BMP280 barometric pressure & temperature' },
  { name: 'MAX30102 Heartrate',       header: 'MAX30105.h',         category: 'Sensors',       author: 'SparkFun',          stars: 440,  desc: 'MAX30102 pulse oximeter & heart rate' },
  { name: 'ADXL345 Accelerometer',   header: 'Adafruit_ADXL345_U.h',category:'Sensors',       author: 'Adafruit',          stars: 360,  desc: '3-axis accelerometer via SPI/I2C' },
  { name: 'HX711 Load Cell',         header: 'HX711.h',            category: 'Sensors',       author: 'Bogdan Necula',     stars: 990,  desc: 'HX711 24-bit load cell amplifier' },
  { name: 'LiquidCrystal I2C',        header: 'LiquidCrystal_I2C.h',category: 'Displays',     author: 'Frank de Brabander',stars: 1800, desc: 'LCD 16x2 / 20x4 via I2C backpack (PCF8574)' },
  { name: 'Adafruit SSD1306',         header: 'Adafruit_SSD1306.h', category: 'Displays',      author: 'Adafruit',          stars: 2100, desc: 'OLED display driver — 128x64 / 128x32' },
  { name: 'Adafruit GFX Library',     header: 'Adafruit_GFX.h',    category: 'Displays',      author: 'Adafruit',          stars: 2300, desc: 'Core 2D graphics primitives for Adafruit displays' },
  { name: 'U8g2',                     header: 'U8g2lib.h',          category: 'Displays',      author: 'olikraus',          stars: 3200, desc: 'Universal 8bit library — OLED/LCD monochrome' },
  { name: 'TFT_eSPI',                 header: 'TFT_eSPI.h',         category: 'Displays',      author: 'Bodmer',            stars: 3900, desc: 'High-performance TFT driver (ST7789/ILI9341)' },
  { name: 'Servo',                    header: 'Servo.h',            category: 'Motors',        author: 'Arduino',           stars: 2500, desc: 'Standard servo motor control (SG90, MG996R)' },
  { name: 'Stepper',                  header: 'Stepper.h',          category: 'Motors',        author: 'Arduino',           stars: 1200, desc: 'Unipolar & bipolar stepper motor' },
  { name: 'Adafruit Motor Shield',    header: 'AFMotor.h',          category: 'Motors',        author: 'Adafruit',          stars: 880,  desc: 'L293D motor shield — DC & stepper motors' },
  { name: 'FastLED',                  header: 'FastLED.h',          category: 'LEDs',          author: 'Daniel Garcia',     stars: 5800, desc: 'WS2812B / NeoPixel / APA102 RGB LED library' },
  { name: 'Adafruit NeoPixel',        header: 'Adafruit_NeoPixel.h',category: 'LEDs',          author: 'Adafruit',          stars: 3100, desc: 'WS2812 RGB LED strips and rings' },
  { name: 'IRremote',                 header: 'IRremote.h',         category: 'Communication', author: 'Armin Joachimsmeyer',stars: 2800, desc: 'IR remote control send & receive (38kHz)' },
  { name: 'PubSubClient (MQTT)',       header: 'PubSubClient.h',     category: 'Communication', author: "Nick O'Leary",      stars: 3400, desc: 'MQTT client for ESP8266/ESP32 IoT projects' },
  { name: 'ArduinoJson',              header: 'ArduinoJson.h',      category: 'Communication', author: 'Benoit Blanchon',   stars: 6200, desc: 'JSON serialization & deserialization' },
  { name: 'Keypad',                   header: 'Keypad.h',           category: 'Input',         author: 'Mark Stanley',      stars: 1100, desc: '4x4 / 4x3 matrix keypad scanning' },
  { name: 'Bounce2',                  header: 'Bounce2.h',          category: 'Input',         author: "Thomas O'Leary",    stars: 1400, desc: 'Robust button & switch debouncing' },
  { name: 'RTClib',                   header: 'RTClib.h',           category: 'Time',          author: 'Adafruit',          stars: 1600, desc: 'Real-Time Clock for DS1307, DS3231, PCF8523' },
  { name: 'NTPClient',                header: 'NTPClient.h',         category: 'Time',          author: 'Arduino',           stars: 1200, desc: 'Network Time Protocol via WiFi (ESP32/ESP8266)' },
  { name: 'PID',                      header: 'PID_v1.h',           category: 'Control',       author: 'Brett Beauregard',  stars: 1900, desc: 'PID controller — proportional/integral/derivative' },
  { name: 'TinyGPS++',                header: 'TinyGPS++.h',        category: 'Communication', author: 'Mikal Hart',        stars: 1700, desc: 'GPS NMEA sentence parsing (NEO-6M etc.)' },
  { name: 'TimerOne',                 header: 'TimerOne.h',         category: 'Timing',        author: 'Paul Stoffregen',   stars: 890,  desc: 'Hardware Timer1 — PWM & interrupt callbacks' },
  { name: 'WiFi (ESP32/Arduino)',      header: 'WiFi.h',             category: 'Communication', author: 'Arduino',           stars: 3100, desc: 'WiFi station & AP mode (ESP32, MKR, Nano 33)' },
  { name: 'WiFiManager',              header: 'WiFiManager.h',       category: 'Communication', author: 'tzapu',             stars: 6400, desc: 'Auto WiFi config portal — no hardcoded SSID' },
  { name: 'BluetoothSerial',          header: 'BluetoothSerial.h',  category: 'Communication', author: 'Espressif',         stars: 1200, desc: 'Classic BT Serial for ESP32' },
  { name: 'Wire (I2C)',                header: 'Wire.h',             category: 'Communication', author: 'Arduino',           stars: 4200, desc: 'I2C master/slave — SDA/SCL communication' },
  { name: 'SPI',                      header: 'SPI.h',              category: 'Communication', author: 'Arduino',           stars: 2800, desc: 'SPI bus protocol — MOSI/MISO/SCK/CS' },
  { name: 'EEPROM',                   header: 'EEPROM.h',           category: 'Storage',       author: 'Arduino',           stars: 1600, desc: 'Read/write internal EEPROM non-volatile memory' },
  { name: 'Preferences (ESP32)',      header: 'Preferences.h',       category: 'Storage',       author: 'Espressif',         stars: 980,  desc: 'NVS key-value store for ESP32' },
  { name: 'SD Library',               header: 'SD.h',               category: 'Storage',       author: 'Arduino',           stars: 1400, desc: 'SD/microSD card read/write via SPI' },
];

const CATEGORIES = ['All', 'Sensors', 'Displays', 'Motors', 'LEDs', 'Communication', 'Input', 'Time', 'Control', 'Timing', 'Storage'];

// ─── State ────────────────────────────────────────────────────────────────────
const _savedFqbn = localStorage.getItem('tinker_selected_board');
export let selectedBoard = BOARDS.find(b => b.fqbn === _savedFqbn) || BOARDS[0];
let activeTab = 'board';
let libSearch = '';
let libCategory = 'All';
let installedLibs = new Set(['Wire', 'SPI', 'Servo', 'Stepper', 'EEPROM', 'Wire (I2C)', 'SPI']);
let portList = [];
let connectedPortObj = null;   // actual Web Serial port object
let isConnected = false;
let isUploading = false;
let lastVerifyResult = null;   // { ok: bool, msg: string }

// ─── Init ─────────────────────────────────────────────────────────────────────
export function initHardwareManager() {
  if (document.getElementById('hardware-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'hardware-panel';
  panel.className = 'hardware-panel hidden';
  document.querySelector('.main-workspace').appendChild(panel);
  _render();
}

export function toggleHardwarePanel() {
  const panel = document.getElementById('hardware-panel');
  if (!panel) { initHardwareManager(); return; }
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) _render();
}

// ─── Main render ──────────────────────────────────────────────────────────────
function _render() {
  const panel = document.getElementById('hardware-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="hw-header">
      <div class="hw-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        Hardware Manager
        ${isConnected ? '<span class="hw-connected-badge">● Connected</span>' : ''}
      </div>
      <button id="hw-close" class="hw-close-btn">✕</button>
    </div>
    <div class="hw-tabs">
      <button class="hw-tab ${activeTab==='board'?'active':''}" data-tab="board">🔌 Board & Port</button>
      <button class="hw-tab ${activeTab==='libs'?'active':''}"  data-tab="libs">📚 Libraries</button>
      <button class="hw-tab ${activeTab==='pkgs'?'active':''}"  data-tab="pkgs">🔧 Boards</button>
    </div>
    <div class="hw-body">
      ${activeTab === 'board' ? _renderBoardTab()  : ''}
      ${activeTab === 'libs'  ? _renderLibsTab()   : ''}
      ${activeTab === 'pkgs'  ? _renderPkgsTab()   : ''}
    </div>`;
  _bindEvents();
}

// ─── Tab: Board & Port ────────────────────────────────────────────────────────
function _renderBoardTab() {
  const portItems = portList.length
    ? portList.map((p, i) => `
        <div class="hw-port-item ${p.selected?'selected':''}" data-port-idx="${i}">
          <span class="hw-port-dot" style="${p.selected?'background:#10b981;box-shadow:0 0 6px #10b981':'background:#475569'}"></span>
          <div style="flex:1">
            <div style="font-size:12px;color:${p.selected?'#e2e8f0':'#94a3b8'}">${p.label}</div>
            ${p.info ? `<div style="font-size:10px;color:#475569">${p.info}</div>` : ''}
          </div>
          ${p.selected ? '<span class="hw-port-badge">Selected</span>' : ''}
          ${p.detectedBoard ? `<span class="hw-detected-badge" title="Auto-detected">${p.detectedBoard}</span>` : ''}
        </div>`).join('')
    : `<div class="hw-no-ports">No ports found.<br><small>Plug in your board then click ↻ Refresh</small></div>`;

  const needsCLI = selectedBoard.protocol === 'esptool' || selectedBoard.protocol === 'picotool' || selectedBoard.protocol === 'stm32';
  const verifyColor = lastVerifyResult ? (lastVerifyResult.ok ? '#10b981' : '#ef4444') : '#64748b';
  const verifyText  = lastVerifyResult ? (lastVerifyResult.ok ? '✓ ' + lastVerifyResult.msg : '✗ ' + lastVerifyResult.msg) : '';

  return `
    <!-- Board Grid -->
    <section class="hw-section">
      <label class="hw-label">Target Board</label>
      <div class="hw-board-grid">
        ${BOARDS.map(b => `
          <div class="hw-board-card ${selectedBoard.fqbn===b.fqbn?'selected':''}" data-fqbn="${b.fqbn}" title="${b.cpu} · ${b.flash} Flash · ${b.ram} RAM">
            <span class="hw-board-icon">${b.icon}</span>
            <div style="flex:1;min-width:0">
              <div class="hw-board-name">${b.name}</div>
              <div style="font-size:9px;color:#475569">${b.voltage} · ${b.flash}</div>
            </div>
            ${selectedBoard.fqbn===b.fqbn ? '<span class="hw-board-check">✓</span>' : ''}
          </div>`).join('')}
      </div>
    </section>

    <!-- Board specs -->
    <section class="hw-section hw-specs-section">
      <label class="hw-label">Board Specs</label>
      <div class="hw-specs-grid">
        <div class="hw-spec"><span class="hw-spec-key">CPU</span><span class="hw-spec-val">${selectedBoard.cpu}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">Flash</span><span class="hw-spec-val">${selectedBoard.flash}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">RAM</span><span class="hw-spec-val">${selectedBoard.ram}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">Voltage</span><span class="hw-spec-val">${selectedBoard.voltage}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">Digital Pins</span><span class="hw-spec-val">${selectedBoard.pins}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">Analog Pins</span><span class="hw-spec-val">${selectedBoard.analogPins}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">FQBN</span><span class="hw-spec-val" style="font-family:monospace;font-size:9px;color:#38bdf8">${selectedBoard.fqbn}</span></div>
        <div class="hw-spec"><span class="hw-spec-key">Protocol</span><span class="hw-spec-val" style="font-family:monospace;color:${needsCLI?'#fbbf24':'#10b981'}">${selectedBoard.protocol}</span></div>
      </div>
      ${needsCLI ? `<div class="hw-warning-banner">⚠️ <strong>${selectedBoard.protocol}</strong> requires Arduino CLI installed locally. Web upload is only available for Arduino AVR boards.</div>` : `<div class="hw-ok-banner">✅ Web Serial upload is supported for this board.</div>`}
    </section>

    <!-- Pin Reference -->
    <section class="hw-section">
      <label class="hw-label">Key Pin Reference</label>
      <div class="hw-pin-grid">
        ${Object.entries(selectedBoard.pinRef||{}).map(([pin, fn]) =>
          `<div class="hw-pin-row"><span class="hw-pin-num">${pin}</span><span class="hw-pin-fn">${fn}</span></div>`
        ).join('')}
      </div>
    </section>

    <!-- Port -->
    <section class="hw-section">
      <div class="hw-section-row">
        <label class="hw-label" style="margin:0">Serial Port</label>
        <button id="hw-refresh-ports" class="hw-btn-sm">↻ Refresh</button>
      </div>
      <div class="hw-port-list" style="margin-top:8px">${portItems}</div>
      <div class="hw-action-row" style="margin-top:8px;flex-wrap:wrap;gap:6px">
        <button id="hw-connect-btn" class="hw-btn ${isConnected?'hw-btn-danger':'hw-btn-success'}" style="min-width:100px">
          ${isConnected ? '⏏ Disconnect' : '🔌 Connect'}
        </button>
        <button id="hw-verify-btn" class="hw-btn hw-btn-secondary">✓ Verify</button>
        <button id="hw-upload-btn" class="hw-btn hw-btn-primary" ${(!isConnected||isUploading)?'disabled':''}>
          ${isUploading ? '⏳ Uploading...' : '⬆ Upload'}
        </button>
      </div>
      ${verifyText ? `<div class="hw-verify-result" style="color:${verifyColor}">${verifyText}</div>` : ''}
      <div id="hw-upload-progress" class="hw-progress ${isUploading?'':'hidden'}">
        <div class="hw-progress-bar"><div id="hw-progress-fill" class="hw-progress-fill" style="width:0%"></div></div>
        <div id="hw-progress-label" class="hw-progress-label">Preparing...</div>
      </div>
    </section>
  `;
}

// ─── Tab: Library Manager ─────────────────────────────────────────────────────
function _renderLibsTab() {
  const filtered = LIBRARIES.filter(l => {
    const q = libSearch.toLowerCase();
    const match = !q || l.name.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q) || l.header.toLowerCase().includes(q) || l.author.toLowerCase().includes(q);
    return match && (libCategory === 'All' || l.category === libCategory);
  });

  return `
    <section class="hw-section">
      <div class="hw-lib-toolbar">
        <div class="hw-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);opacity:0.45"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="hw-lib-search" class="hw-search-input" placeholder="Search ${LIBRARIES.length} libraries..." value="${libSearch}">
        </div>
        <select id="hw-lib-cat" class="hw-select">
          ${CATEGORIES.map(c => `<option value="${c}" ${libCategory===c?'selected':''}>${c} ${c==='All'?`(${LIBRARIES.length})`:''}</option>`).join('')}
        </select>
      </div>
      <div style="font-size:10px;color:#475569;margin-top:4px">${filtered.length} libraries found</div>
    </section>
    <div class="hw-lib-list">
      ${filtered.length ? filtered.map(l => `
        <div class="hw-lib-card">
          <div class="hw-lib-top">
            <div style="flex:1;min-width:0">
              <div class="hw-lib-name">${l.name}</div>
              <div class="hw-lib-meta">by <strong style="color:#94a3b8">${l.author}</strong> · <span class="hw-lib-cat-badge">${l.category}</span></div>
            </div>
            <div class="hw-lib-actions">
              <button class="hw-lib-include hw-btn-sm hw-btn-primary" data-header="${l.header}" title="Insert #include <${l.header}> into code editor">+ Include</button>
              <button class="hw-lib-install ${installedLibs.has(l.name)?'hw-lib-installed hw-btn-sm hw-btn-success':'hw-btn-sm'}" data-lib="${l.name}">
                ${installedLibs.has(l.name) ? '✓' : '+'}
              </button>
            </div>
          </div>
          <div class="hw-lib-desc">${l.desc}</div>
          <div class="hw-lib-footer">
            <code class="hw-lib-header">#include &lt;${l.header}&gt;</code>
            <span class="hw-lib-stars">⭐ ${l.stars >= 1000 ? (l.stars/1000).toFixed(1)+'k' : l.stars}</span>
          </div>
        </div>`).join('')
      : `<div class="hw-no-ports" style="text-align:center;padding:40px">No libraries match "<strong>${libSearch}</strong>"</div>`}
    </div>`;
}

// ─── Tab: Board Manager ───────────────────────────────────────────────────────
function _renderPkgsTab() {
  return `
    <section class="hw-section">
      <div style="font-size:12px;color:#64748b;line-height:1.6;margin-bottom:4px">
        Add these URLs to Arduino IDE → <strong>File → Preferences → Additional Board Manager URLs</strong>, then install via <em>Tools → Board Manager</em>.
      </div>
    </section>
    <div class="hw-pkg-list">
      ${PACKAGES.map(pkg => `
        <div class="hw-pkg-card">
          <div class="hw-pkg-top">
            <div>
              <div class="hw-pkg-name">${pkg.name}</div>
              <div class="hw-pkg-id hw-mono">${pkg.id} · v${pkg.version}</div>
            </div>
            <span class="hw-pkg-badge ${pkg.status==='built-in'?'built-in':'installable'}">${pkg.status==='built-in'?'Built-in':'3rd Party'}</span>
          </div>
          <div class="hw-pkg-boards" style="margin-bottom:8px">
            ${pkg.boards.map(b => `<span class="hw-pkg-board-chip" style="border-color:${pkg.color}40;color:${pkg.color}">${b}</span>`).join('')}
          </div>
          ${pkg.status !== 'built-in' ? `
            <div class="hw-pkg-url">
              <span style="font-size:9px;color:#475569;word-break:break-all;font-family:monospace">${pkg.url}</span>
              <button class="hw-copy-url hw-btn-sm" data-url="${pkg.url}" title="Copy URL">⎘</button>
            </div>` : ''}
        </div>`).join('')}
    </div>
    <div class="hw-section" style="margin-top:4px">
      <div style="color:#475569;font-size:11px;line-height:1.6">
        💡 <strong>TinkerAI</strong> uses these FQBNs for online compilation via Wokwi.<br>
        Full board flashing (ESP32, RP2040) requires <strong>Arduino CLI</strong> installed locally.
      </div>
    </div>`;
}

// ─── Event Binding ────────────────────────────────────────────────────────────
function _bindEvents() {
  document.getElementById('hw-close')?.addEventListener('click', () => document.getElementById('hardware-panel').classList.add('hidden'));
  document.querySelectorAll('.hw-tab').forEach(btn => btn.addEventListener('click', () => { activeTab = btn.dataset.tab; _render(); }));
  if (activeTab === 'board') _bindBoardEvents();
  if (activeTab === 'libs')  _bindLibsEvents();
  if (activeTab === 'pkgs')  _bindPkgsEvents();
}

function _bindBoardEvents() {
  // Board selection
  document.querySelectorAll('.hw-board-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedBoard = BOARDS.find(b => b.fqbn === card.dataset.fqbn) || BOARDS[0];
      localStorage.setItem('tinker_selected_board', selectedBoard.fqbn);
      window._selectedBoardFqbn = selectedBoard.fqbn;
      lastVerifyResult = null;
      _render();
      window.showToast(`Board: ${selectedBoard.name}`, 'success');
    });
  });

  // Refresh ports
  document.getElementById('hw-refresh-ports')?.addEventListener('click', async () => {
    if (!('serial' in navigator)) { window.showToast('Web Serial not supported. Use Chrome or Edge.', 'error'); return; }
    try {
      const ports = await navigator.serial.getPorts();
      portList = ports.map((p, i) => {
        const info = p.getInfo?.() || {};
        const vid = info.usbVendorId, pid = info.usbProductId;
        const match = VID_PID_MAP.find(m => m.vid === vid && m.pid === pid);
        const detectedName = match ? (BOARDS.find(b => b.fqbn === match.fqbn)?.name || '') : '';
        return {
          port: p,
          label: `Port ${i+1}` + (info.usbVendorId ? ` (VID:${vid?.toString(16)?.toUpperCase()} PID:${pid?.toString(16)?.toUpperCase()})` : ''),
          info: detectedName ? `Detected: ${detectedName}` : (info.usbVendorId ? 'Unrecognized USB device' : ''),
          selected: p === connectedPortObj,
          detectedBoard: detectedName,
          fqbn: match?.fqbn,
        };
      });
      if (portList.length === 0) window.showToast('No ports found. Plug in your board first.', 'warn');
      else {
        // Auto-select board if we detect one
        const detected = portList.find(p => p.fqbn);
        if (detected) {
          const autoBoard = BOARDS.find(b => b.fqbn === detected.fqbn);
          if (autoBoard && autoBoard.fqbn !== selectedBoard.fqbn) {
            selectedBoard = autoBoard;
            localStorage.setItem('tinker_selected_board', selectedBoard.fqbn);
            window.showToast(`Auto-detected: ${autoBoard.name}`, 'success');
          }
        }
      }
      _render();
    } catch (e) { window.showToast('Port refresh failed: ' + e.message, 'error'); }
  });

  // Port click to select
  document.querySelectorAll('.hw-port-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.portIdx);
      portList.forEach((p, i) => p.selected = i === idx);
      _render();
    });
  });

  // Connect / Disconnect
  document.getElementById('hw-connect-btn')?.addEventListener('click', async () => {
    if (isConnected) {
      try { await disconnectFromBoard(); } catch(e) {}
      isConnected = false; connectedPortObj = null;
      portList.forEach(p => p.selected = false);
      _render();
      window.showToast('Disconnected.', 'info');
      return;
    }
    if (!('serial' in navigator)) { window.showToast('Web Serial not supported. Use Chrome/Edge.', 'error'); return; }
    try {
      const port = await connectToBoard(selectedBoard.baud);
      connectedPortObj = port;
      isConnected = true;
      // Refresh port list and mark connected
      const ports = await navigator.serial.getPorts();
      portList = ports.map((p, i) => ({
        port: p,
        label: `Port ${i+1}`,
        selected: p === connectedPortObj,
        info: p === connectedPortObj ? `Connected at ${selectedBoard.baud} baud` : '',
      }));
      _render();
      window.showToast(`Connected to ${selectedBoard.name}!`, 'success');
    } catch (e) { window.showToast('Connection failed: ' + e.message, 'error'); }
  });

  // Verify (compile only)
  document.getElementById('hw-verify-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('hw-verify-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Verifying...'; }
    try {
      const result = await compileCode(getCode(), selectedBoard.fqbn);
      if (result.compilerError || (result.stderr && result.stderr.trim())) {
        const err = (result.compilerError || result.stderr).split('\n').find(l => l.includes('error:')) || (result.compilerError || result.stderr).slice(0, 120);
        lastVerifyResult = { ok: false, msg: err.replace(/^.*error:\s*/,'').slice(0,120) };
        window.showToast('Compilation failed — check code.', 'error');
      } else {
        const kb = result.hex ? (result.hex.length / 1024).toFixed(1) : '?';
        lastVerifyResult = { ok: true, msg: `Compiled OK · ${kb}KB` };
        window.showToast('Sketch compiled successfully!', 'success');
      }
    } catch(e) {
      lastVerifyResult = { ok: false, msg: e.message };
      window.showToast('Verify error: ' + e.message, 'error');
    }
    _render();
  });

  // Upload
  document.getElementById('hw-upload-btn')?.addEventListener('click', async () => {
    if (!isConnected) { window.showToast('Connect to a board first.', 'warn'); return; }
    if (selectedBoard.protocol !== 'stk500v1' && selectedBoard.protocol !== 'stk500v2' && selectedBoard.protocol !== 'avr109') {
      window.showToast(`${selectedBoard.name} requires ${selectedBoard.protocol} — install Arduino CLI for full upload support.`, 'warn');
    }
    isUploading = true; _render();
    const progressEl = document.getElementById('hw-upload-progress');
    const fillEl     = document.getElementById('hw-progress-fill');
    const labelEl    = document.getElementById('hw-progress-label');
    progressEl?.classList.remove('hidden');
    if (labelEl) labelEl.textContent = `⚙ Compiling for ${selectedBoard.name}...`;
    if (fillEl)  fillEl.style.width = '5%';
    try {
      const result = await compileCode(getCode(), selectedBoard.fqbn);
      if (result.compilerError || (result.stderr && result.stderr.trim())) {
        const err = (result.compilerError || result.stderr).slice(0, 200);
        if (labelEl) labelEl.textContent = '❌ Compile error: ' + err;
        if (fillEl)  fillEl.style.background = '#ef4444';
        window.showToast('Compile error!', 'error');
        lastVerifyResult = { ok: false, msg: err.slice(0,100) };
        isUploading = false; _render(); return;
      }
      lastVerifyResult = { ok: true, msg: `Compiled OK · ${(result.hex?.length/1024).toFixed(1)}KB` };
      if (labelEl) labelEl.textContent = '✅ Compiled! Uploading...';
      if (fillEl)  fillEl.style.width = '40%';
      await flashToBoard(result.hex, (msg) => {
        if (labelEl) labelEl.textContent = '📡 ' + msg;
        const pct = msg.match(/(\d+)%/)?.[1];
        if (pct && fillEl) fillEl.style.width = (40 + parseInt(pct) * 0.6) + '%';
      });
      if (fillEl)  fillEl.style.width = '100%';
      if (labelEl) labelEl.textContent = '🎉 Upload complete! Board is running your sketch.';
      window.showToast('Upload complete!', 'success');
    } catch (e) {
      if (labelEl) labelEl.textContent = '❌ Upload failed: ' + e.message;
      if (fillEl)  fillEl.style.background = '#ef4444';
      window.showToast('Upload failed: ' + e.message, 'error');
    }
    isUploading = false;
  });
}

function _bindLibsEvents() {
  document.getElementById('hw-lib-search')?.addEventListener('input', e => { libSearch = e.target.value; _render(); });
  document.getElementById('hw-lib-cat')?.addEventListener('change', e => { libCategory = e.target.value; _render(); });
  document.querySelectorAll('.hw-lib-include').forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.dataset.header;
      const line   = `#include <${header}>\n`;
      const current = getCode();
      if (!current.includes(`#include <${header}>`)) {
        setCode(line + current);
        window.showToast(`Added: #include <${header}>`, 'success');
      } else {
        window.showToast(`${header} already included.`, 'info');
      }
    });
  });
  document.querySelectorAll('.hw-lib-install').forEach(btn => {
    btn.addEventListener('click', () => {
      installedLibs.add(btn.dataset.lib); _render();
      window.showToast(`"${btn.dataset.lib}" marked.`, 'success');
    });
  });
}

function _bindPkgsEvents() {
  document.querySelectorAll('.hw-copy-url').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(btn.dataset.url).then(() => window.showToast('URL copied!', 'success')).catch(() => window.showToast('Copy failed.', 'error'));
    });
  });
}
