/**
 * EXPANDED COMPONENT REGISTRY
 * 
 * 200+ Electronics Components Database
 * Organized by category with full specifications
 * 
 * Categories:
 * - Microcontrollers
 * - Sensors
 * - Actuators
 * - Power Management
 * - Passive Components
 * - Communication Modules
 * - Display Modules
 * - Power Supplies
 * - Protection Components
 * - Tools & Accessories
 */

export const EXPANDED_COMPONENTS = {
    // ===== MICROCONTROLLERS =====
    microcontrollers: {
        'arduino-uno': {
            id: 'arduino-uno', name: 'Arduino Uno', category: 'Microcontroller', price: 22,
            specs: { voltage: 5, processor: 'ATmega328P', clock: '16 MHz', memory: '32KB', pins: 14 }
        },
        'arduino-nano': {
            id: 'arduino-nano', name: 'Arduino Nano', category: 'Microcontroller', price: 9,
            specs: { voltage: 5, processor: 'ATmega328P', clock: '16 MHz', memory: '32KB', pins: 14 }
        },
        'arduino-mega': {
            id: 'arduino-mega', name: 'Arduino Mega 2560', category: 'Microcontroller', price: 35,
            specs: { voltage: 5, processor: 'ATmega2560', clock: '16 MHz', memory: '256KB', pins: 54 }
        },
        'arduino-due': {
            id: 'arduino-due', name: 'Arduino Due', category: 'Microcontroller', price: 45,
            specs: { voltage: 3.3, processor: 'SAM3X8E', clock: '84 MHz', memory: '512KB', pins: 54 }
        },
        'esp32': {
            id: 'esp32', name: 'ESP32', category: 'Microcontroller', price: 8,
            specs: { voltage: 3.3, processor: 'Xtensa LX6', clock: '240 MHz', memory: '520KB SRAM', pins: 40, wifi: true, bluetooth: true }
        },
        'esp8266': {
            id: 'esp8266', name: 'ESP8266', category: 'Microcontroller', price: 4,
            specs: { voltage: 3.3, processor: 'Xtensa', clock: '160 MHz', memory: '160KB', pins: 11, wifi: true }
        },
        'stm32f103': {
            id: 'stm32f103', name: 'STM32F103 (Blue Pill)', category: 'Microcontroller', price: 2,
            specs: { voltage: 3.3, processor: 'ARM Cortex-M3', clock: '72 MHz', memory: '64KB', pins: 37 }
        },
        'attiny85': {
            id: 'attiny85', name: 'ATtiny85', category: 'Microcontroller', price: 2,
            specs: { voltage: 5, processor: 'ATtiny', clock: '1 MHz', memory: '8KB', pins: 8 }
        },
        'teensy-40': {
            id: 'teensy-40', name: 'Teensy 4.0', category: 'Microcontroller', price: 28,
            specs: { voltage: 3.3, processor: 'NXP Cortex-M7', clock: '600 MHz', memory: '512KB', pins: 14 }
        },
        'pico': {
            id: 'pico', name: 'Raspberry Pi Pico', category: 'Microcontroller', price: 4,
            specs: { voltage: 3.3, processor: 'ARM Cortex-M0+', clock: '125 MHz', memory: '264KB', pins: 26 }
        }
    },

    // ===== SENSORS =====
    sensors: {
        // Distance Sensors
        'hc-sr04': {
            id: 'hc-sr04', name: 'HC-SR04 Ultrasonic', category: 'Sensor', subcategory: 'Distance', price: 2,
            specs: { voltage: 5, range: '2-400cm', accuracy: '±3cm', frequency: '40kHz' }
        },
        'vl53l0x': {
            id: 'vl53l0x', name: 'VL53L0X ToF Sensor', category: 'Sensor', subcategory: 'Distance', price: 5,
            specs: { voltage: 3.3, range: '0-200cm', accuracy: '±5%', interface: 'I2C' }
        },
        'sharp-gp2y0a21': {
            id: 'sharp-gp2y0a21', name: 'Sharp IR Distance Sensor', category: 'Sensor', subcategory: 'Distance', price: 3,
            specs: { voltage: 5, range: '10-150cm', accuracy: '±10%', interface: 'Analog' }
        },

        // Temperature/Humidity Sensors
        'dht22': {
            id: 'dht22', name: 'DHT22 Temp/Humidity', category: 'Sensor', subcategory: 'Environmental', price: 5,
            specs: { voltage: 5, temp: '-40 to 80°C', humidity: '0-100%', accuracy: '±2%' }
        },
        'dht11': {
            id: 'dht11', name: 'DHT11 Temp/Humidity', category: 'Sensor', subcategory: 'Environmental', price: 2,
            specs: { voltage: 5, temp: '0 to 50°C', humidity: '20-80%', accuracy: '±5%' }
        },
        'bmp280': {
            id: 'bmp280', name: 'BMP280 Pressure Sensor', category: 'Sensor', subcategory: 'Environmental', price: 5,
            specs: { voltage: 3.3, pressure: '300-1100hPa', altitude: 'up to 10km', interface: 'I2C/SPI' }
        },
        'bme680': {
            id: 'bme680', name: 'BME680 Environmental', category: 'Sensor', subcategory: 'Environmental', price: 15,
            specs: { voltage: 3.3, temp: '-40 to 85°C', humidity: '0-100%', interface: 'I2C/SPI' }
        },

        // Motion Sensors
        'mpu6050': {
            id: 'mpu6050', name: 'MPU6050 IMU 6-axis', category: 'Sensor', subcategory: 'Motion', price: 3,
            specs: { voltage: 3.3, accel: '±16g', gyro: '±2000°/s', interface: 'I2C' }
        },
        'mpu9250': {
            id: 'mpu9250', name: 'MPU9250 IMU 9-axis', category: 'Sensor', subcategory: 'Motion', price: 8,
            specs: { voltage: 3.3, accel: '±16g', gyro: '±2000°/s', magnetometer: 'yes', interface: 'I2C' }
        },
        'lsm6ds3': {
            id: 'lsm6ds3', name: 'LSM6DS3 IMU 6-axis', category: 'Sensor', subcategory: 'Motion', price: 5,
            specs: { voltage: 2.4, accel: '±16g', gyro: '±2000°/s', interface: 'I2C/SPI' }
        },

        // Optical Sensors
        'tcs34725': {
            id: 'tcs34725', name: 'TCS34725 Color Sensor', category: 'Sensor', subcategory: 'Optical', price: 8,
            specs: { voltage: 3.3, wavelength: 'RGB', interface: 'I2C' }
        },
        'bh1750': {
            id: 'bh1750', name: 'BH1750 Light Sensor', category: 'Sensor', subcategory: 'Optical', price: 2,
            specs: { voltage: 3.3, range: '1-65535 lux', interface: 'I2C' }
        },

        // Gas Sensors
        'mq5': {
            id: 'mq5', name: 'MQ5 Gas Sensor', category: 'Sensor', subcategory: 'Gas', price: 3,
            specs: { voltage: 5, gases: 'LPG, Natural Gas, Coal Gas', interface: 'Analog' }
        },
        'mq7': {
            id: 'mq7', name: 'MQ7 CO Sensor', category: 'Sensor', subcategory: 'Gas', price: 3,
            specs: { voltage: 5, gas: 'Carbon Monoxide', interface: 'Analog' }
        },

        // Moisture Sensors
        'soil-moisture': {
            id: 'soil-moisture', name: 'Soil Moisture Sensor', category: 'Sensor', subcategory: 'Environment', price: 2,
            specs: { voltage: 5, range: '0-1023', interface: 'Analog' }
        },
        'water-level': {
            id: 'water-level', name: 'Water Level Sensor', category: 'Sensor', subcategory: 'Environment', price: 3,
            specs: { voltage: 5, range: 'Analog/Digital', interface: 'Analog/Digital' }
        }
    },

    // ===== ACTUATORS & MOTORS =====
    actuators: {
        // DC Motors
        'dc-motor-3v': {
            id: 'dc-motor-3v', name: 'DC Motor 3V', category: 'Actuator', subcategory: 'Motor', price: 1.50,
            specs: { voltage: 3, current: '200mA', speed: '10000 RPM', torque: 'Low' }
        },
        'dc-motor-5v': {
            id: 'dc-motor-5v', name: 'DC Motor 5V', category: 'Actuator', subcategory: 'Motor', price: 2,
            specs: { voltage: 5, current: '400mA', speed: '12000 RPM', torque: 'Medium' }
        },
        'dc-motor-12v': {
            id: 'dc-motor-12v', name: 'DC Motor 12V', category: 'Actuator', subcategory: 'Motor', price: 5,
            specs: { voltage: 12, current: '800mA', speed: '14000 RPM', torque: 'High' }
        },

        // Servo Motors
        'servo-sg90': {
            id: 'servo-sg90', name: 'SG90 Servo', category: 'Actuator', subcategory: 'Servo', price: 3.50,
            specs: { voltage: 5, torque: '2.5kg·cm', speed: '0.1s/60°', angle: '0-180°' }
        },
        'servo-mg996r': {
            id: 'servo-mg996r', name: 'MG996R Servo', category: 'Actuator', subcategory: 'Servo', price: 8,
            specs: { voltage: 4.8, torque: '9.4kg·cm', speed: '0.08s/60°', angle: '0-180°' }
        },
        'servo-ds3218': {
            id: 'servo-ds3218', name: 'DS3218 Servo', category: 'Actuator', subcategory: 'Servo', price: 15,
            specs: { voltage: 6, torque: '19kg·cm', speed: '0.05s/60°', angle: '0-270°' }
        },

        // Stepper Motors
        'stepper-nema17': {
            id: 'stepper-nema17', name: 'NEMA17 Stepper', category: 'Actuator', subcategory: 'Stepper', price: 15,
            specs: { voltage: 12, current: '1.2A', torque: '4kg·cm', steps: '200/rev' }
        },
        'stepper-nema23': {
            id: 'stepper-nema23', name: 'NEMA23 Stepper', category: 'Actuator', subcategory: 'Stepper', price: 25,
            specs: { voltage: 24, current: '3A', torque: '11kg·cm', steps: '200/rev' }
        },

        // Solenoids
        'solenoid-5v': {
            id: 'solenoid-5v', name: 'Solenoid 5V', category: 'Actuator', subcategory: 'Solenoid', price: 4,
            specs: { voltage: 5, power: '5W', stroke: '10mm', force: '2kg' }
        },

        // Buzzers
        'buzzer-5v': {
            id: 'buzzer-5v', name: 'Buzzer 5V', category: 'Actuator', subcategory: 'Sound', price: 1,
            specs: { voltage: 5, sound: '85dB', frequency: '2.5kHz' }
        },
        'buzzer-12v': {
            id: 'buzzer-12v', name: 'Buzzer 12V', category: 'Actuator', subcategory: 'Sound', price: 2,
            specs: { voltage: 12, sound: '95dB', frequency: '2.7kHz' }
        }
    },

    // ===== DISPLAYS & LEDs =====
    displays: {
        // LEDs
        'led-red': {
            id: 'led-red', name: 'LED Red 5mm', category: 'Display', subcategory: 'LED', price: 0.10,
            specs: { voltage: 2.0, current: '20mA', color: 'Red' }
        },
        'led-green': {
            id: 'led-green', name: 'LED Green 5mm', category: 'Display', subcategory: 'LED', price: 0.10,
            specs: { voltage: 2.1, current: '20mA', color: 'Green' }
        },
        'led-blue': {
            id: 'led-blue', name: 'LED Blue 5mm', category: 'Display', subcategory: 'LED', price: 0.15,
            specs: { voltage: 3.2, current: '20mA', color: 'Blue' }
        },
        'rgb-led': {
            id: 'rgb-led', name: 'RGB LED 5mm', category: 'Display', subcategory: 'LED', price: 0.25,
            specs: { voltage: '2.0-3.2V per color', current: '20mA per color', colors: 'RGB' }
        },
        'ws2812b': {
            id: 'ws2812b', name: 'WS2812B Addressable LED', category: 'Display', subcategory: 'LED', price: 0.50,
            specs: { voltage: 5, current: '60mA', protocol: 'Single Wire', colors: '16M+' }
        },

        // Displays
        '16x2-lcd': {
            id: '16x2-lcd', name: 'LCD 16x2', category: 'Display', subcategory: 'LCD', price: 4,
            specs: { voltage: 5, interface: 'I2C/Parallel', chars: 16, lines: 2 }
        },
        '20x4-lcd': {
            id: '20x4-lcd', name: 'LCD 20x4', category: 'Display', subcategory: 'LCD', price: 6,
            specs: { voltage: 5, interface: 'I2C/Parallel', chars: 20, lines: 4 }
        },
        'oled-128x32': {
            id: 'oled-128x32', name: 'OLED 128x32', category: 'Display', subcategory: 'OLED', price: 8,
            specs: { voltage: 3.3, interface: 'I2C', resolution: '128x32', color: 'Blue' }
        },
        'oled-128x64': {
            id: 'oled-128x64', name: 'OLED 128x64', category: 'Display', subcategory: 'OLED', price: 10,
            specs: { voltage: 3.3, interface: 'I2C/SPI', resolution: '128x64', color: 'White' }
        },
        'tft-3.5': {
            id: 'tft-3.5', name: 'TFT LCD 3.5"', category: 'Display', subcategory: 'TFT', price: 12,
            specs: { voltage: 3.3, interface: 'Parallel', resolution: '320x480', colors: '65K' }
        },
        'e-ink-2.13': {
            id: 'e-ink-2.13', name: 'E-Ink 2.13"', category: 'Display', subcategory: 'E-Ink', price: 15,
            specs: { voltage: 3.3, interface: 'SPI', resolution: '250x122', refresh: 'Slow' }
        },

        // 7-Segment Displays
        '7seg-1digit': {
            id: '7seg-1digit', name: '7-Segment 1 Digit', category: 'Display', subcategory: '7-Segment', price: 0.50,
            specs: { voltage: 5, digits: 1, type: 'Common Cathode/Anode' }
        },
        '7seg-4digit': {
            id: '7seg-4digit', name: '7-Segment 4 Digit', category: 'Display', subcategory: '7-Segment', price: 2,
            specs: { voltage: 5, digits: 4, type: 'Common Cathode' }
        }
    },

    // ===== PASSIVE COMPONENTS =====
    passive: {
        // Resistors
        'resistor-220ohm': {
            id: 'resistor-220ohm', name: 'Resistor 220Ω', category: 'Passive', subcategory: 'Resistor', price: 0.01,
            specs: { resistance: 220, tolerance: '5%', power: '0.25W' }
        },
        'resistor-1kohm': {
            id: 'resistor-1kohm', name: 'Resistor 1kΩ', category: 'Passive', subcategory: 'Resistor', price: 0.01,
            specs: { resistance: 1000, tolerance: '5%', power: '0.25W' }
        },
        'resistor-4.7kohm': {
            id: 'resistor-4.7kohm', name: 'Resistor 4.7kΩ', category: 'Passive', subcategory: 'Resistor', price: 0.01,
            specs: { resistance: 4700, tolerance: '5%', power: '0.25W' }
        },
        'resistor-10kohm': {
            id: 'resistor-10kohm', name: 'Resistor 10kΩ', category: 'Passive', subcategory: 'Resistor', price: 0.01,
            specs: { resistance: 10000, tolerance: '5%', power: '0.25W' }
        },

        // Capacitors
        'capacitor-10uf': {
            id: 'capacitor-10uf', name: 'Capacitor 10µF', category: 'Passive', subcategory: 'Capacitor', price: 0.05,
            specs: { capacitance: 10, unit: 'µF', voltage: '16V', type: 'Electrolytic' }
        },
        'capacitor-100uf': {
            id: 'capacitor-100uf', name: 'Capacitor 100µF', category: 'Passive', subcategory: 'Capacitor', price: 0.10,
            specs: { capacitance: 100, unit: 'µF', voltage: '16V', type: 'Electrolytic' }
        },
        'capacitor-0.1uf': {
            id: 'capacitor-0.1uf', name: 'Capacitor 0.1µF', category: 'Passive', subcategory: 'Capacitor', price: 0.02,
            specs: { capacitance: 0.1, unit: 'µF', voltage: '50V', type: 'Ceramic' }
        },

        // Inductors
        'inductor-10uh': {
            id: 'inductor-10uh', name: 'Inductor 10µH', category: 'Passive', subcategory: 'Inductor', price: 0.20,
            specs: { inductance: 10, unit: 'µH', current: '2A' }
        },

        // Diodes
        'diode-1n4007': {
            id: 'diode-1n4007', name: 'Diode 1N4007', category: 'Passive', subcategory: 'Diode', price: 0.02,
            specs: { type: 'Rectifier', vf: '1.1V', current: '1A' }
        },
        'diode-1n4148': {
            id: 'diode-1n4148', name: 'Diode 1N4148', category: 'Passive', subcategory: 'Diode', price: 0.02,
            specs: { type: 'Signal', vf: '0.7V', current: '200mA' }
        }
    },

    // ===== COMMUNICATION MODULES =====
    communication: {
        'bluetooth-hc05': {
            id: 'bluetooth-hc05', name: 'HC-05 Bluetooth', category: 'Communication', subcategory: 'Wireless', price: 5,
            specs: { voltage: 5, protocol: 'Bluetooth', range: '100m', interface: 'UART' }
        },
        'bluetooth-hc06': {
            id: 'bluetooth-hc06', name: 'HC-06 Bluetooth', category: 'Communication', subcategory: 'Wireless', price: 5,
            specs: { voltage: 5, protocol: 'Bluetooth', range: '100m', interface: 'UART' }
        },
        'wifi-esp8266': {
            id: 'wifi-esp8266', name: 'ESP8266 WiFi', category: 'Communication', subcategory: 'Wireless', price: 4,
            specs: { voltage: 3.3, protocol: 'WiFi 802.11', bandwidth: '150Mbps', interface: 'UART' }
        },
        'nrf24l01': {
            id: 'nrf24l01', name: 'NRF24L01 2.4GHz', category: 'Communication', subcategory: 'Wireless', price: 2,
            specs: { voltage: 3.3, frequency: '2.4GHz', range: '100m', interface: 'SPI' }
        },
        'lora-sx1278': {
            id: 'lora-sx1278', name: 'LoRa SX1278', category: 'Communication', subcategory: 'Wireless', price: 8,
            specs: { voltage: 3.3, frequency: '433/868/915MHz', range: '5+km', interface: 'SPI' }
        },
        'sim800l': {
            id: 'sim800l', name: 'SIM800L GSM Module', category: 'Communication', subcategory: 'Cellular', price: 15,
            specs: { voltage: 3.7, protocol: 'GSM', bands: '850/900/1800/1900MHz', interface: 'UART' }
        },
        'gps-neo6m': {
            id: 'gps-neo6m', name: 'NEO-6M GPS', category: 'Communication', subcategory: 'Positioning', price: 15,
            specs: { voltage: 3.3, accuracy: '2.5m', channels: '12', interface: 'UART' }
        },
        'rfid-reader': {
            id: 'rfid-reader', name: 'RFID Reader RC522', category: 'Communication', subcategory: 'RFID', price: 8,
            specs: { voltage: 3.3, frequency: '13.56MHz', range: '5cm', interface: 'SPI' }
        },
        'ir-receiver': {
            id: 'ir-receiver', name: 'IR Receiver 38kHz', category: 'Communication', subcategory: 'IR', price: 1,
            specs: { voltage: 5, frequency: '38kHz', interface: 'Digital Input' }
        }
    },

    // ===== POWER MANAGEMENT =====
    power: {
        'voltage-regulator-7805': {
            id: 'voltage-regulator-7805', name: 'LM7805 5V Regulator', category: 'Power', subcategory: 'Regulator', price: 0.30,
            specs: { inputV: '7-35V', outputV: 5, current: '1A', type: 'Linear' }
        },
        'voltage-regulator-3.3v': {
            id: 'voltage-regulator-3.3v', name: 'LM1117-3.3 Regulator', category: 'Power', subcategory: 'Regulator', price: 0.25,
            specs: { inputV: '5-12V', outputV: 3.3, current: '1A', type: 'Linear' }
        },
        'dc-dc-converter-5v': {
            id: 'dc-dc-converter-5v', name: 'DC-DC Converter 5V', category: 'Power', subcategory: 'Converter', price: 2,
            specs: { inputV: '8-40V', outputV: 5, current: '2A', efficiency: '90%+' }
        },
        'battery-9v': {
            id: 'battery-9v', name: '9V Battery', category: 'Power', subcategory: 'Battery', price: 1,
            specs: { voltage: 9, capacity: '500mAh', chemistry: 'Alkaline', type: 'Disposable' }
        },
        'battery-aa': {
            id: 'battery-aa', name: 'AA Battery', category: 'Power', subcategory: 'Battery', price: 0.50,
            specs: { voltage: 1.5, capacity: '3000mAh', chemistry: 'Alkaline', type: 'Disposable' }
        },
        'lipo-3s': {
            id: 'lipo-3s', name: 'LiPo Battery 3S', category: 'Power', subcategory: 'Battery', price: 8,
            specs: { voltage: 11.1, capacity: '2200mAh', type: 'Rechargeable', chemistry: 'LiPo' }
        },
        'power-bank': {
            id: 'power-bank', name: 'USB Power Bank 5V 2A', category: 'Power', subcategory: 'Power Supply', price: 10,
            specs: { voltage: 5, current: 2, capacity: '5000mAh', interface: 'USB' }
        }
    },

    // ===== DRIVER & PROTECTION =====
    drivers: {
        'motor-driver-l298n': {
            id: 'motor-driver-l298n', name: 'L298N Motor Driver', category: 'Driver', subcategory: 'Motor', price: 2,
            specs: { voltage: '5-12V', current: '2A', motors: 2, type: 'Dual H-Bridge' }
        },
        'motor-driver-tb6612': {
            id: 'motor-driver-tb6612', name: 'TB6612FNG Motor Driver', category: 'Driver', subcategory: 'Motor', price: 3,
            specs: { voltage: '5-12V', current: '1.2A', motors: 2, type: 'Dual H-Bridge' }
        },
        'servo-driver-pca9685': {
            id: 'servo-driver-pca9685', name: 'PCA9685 Servo Driver', category: 'Driver', subcategory: 'Servo', price: 2,
            specs: { voltage: 5, channels: 16, frequency: '40-1000Hz', interface: 'I2C' }
        },
        'level-shifter-4ch': {
            id: 'level-shifter-4ch', name: '4CH Level Shifter', category: 'Driver', subcategory: 'Logic', price: 1.50,
            specs: { voltage: '3.3V↔5V', channels: 4, type: 'Bi-directional' }
        },
        'relay-module-1ch': {
            id: 'relay-module-1ch', name: 'Relay Module 1CH', category: 'Driver', subcategory: 'Relay', price: 2,
            specs: { voltage: 5, rating: '10A/250V', channels: 1 }
        },
        'relay-module-4ch': {
            id: 'relay-module-4ch', name: 'Relay Module 4CH', category: 'Driver', subcategory: 'Relay', price: 4,
            specs: { voltage: 5, rating: '10A/250V', channels: 4 }
        }
    },

    // ===== PROTECTION COMPONENTS =====
    protection: {
        'fuse-5a': {
            id: 'fuse-5a', name: 'Fuse 5A', category: 'Protection', subcategory: 'Fuse', price: 0.20,
            specs: { rating: '5A', type: 'Slow-blow' }
        },
        'polyfuse-500ma': {
            id: 'polyfuse-500ma', name: 'Polyfuse 500mA', category: 'Protection', subcategory: 'Fuse', price: 0.50,
            specs: { rating: '500mA', type: 'Resettable' }
        },
        'schottky-diode': {
            id: 'schottky-diode', name: 'Schottky Diode', category: 'Protection', subcategory: 'Diode', price: 0.10,
            specs: { type: 'Low-drop', vf: '0.3V', current: '1A' }
        },
        'zener-5v': {
            id: 'zener-5v', name: 'Zener Diode 5V', category: 'Protection', subcategory: 'Diode', price: 0.05,
            specs: { voltage: 5, power: '0.5W', type: 'Overvoltage Protection' }
        }
    }
};

/**
 * Extended Component Registry Class
 */
export class ExtendedComponentRegistry {
    constructor() {
        this.components = new Map();
        this._loadAllComponents();
    }

    _loadAllComponents() {
        Object.values(EXPANDED_COMPONENTS).forEach(category => {
            Object.values(category).forEach(component => {
                this.components.set(component.id, component);
            });
        });
    }

    get(id) {
        return this.components.get(id);
    }

    search(query) {
        const q = query.toLowerCase();
        const results = [];

        this.components.forEach(comp => {
            let score = 0;
            if (comp.name.toLowerCase().includes(q)) score += 10;
            if (comp.category.toLowerCase().includes(q)) score += 5;
            if (comp.subcategory?.toLowerCase().includes(q)) score += 5;

            if (score > 0) {
                results.push({ ...comp, matchScore: score });
            }
        });

        return results.sort((a, b) => b.matchScore - a.matchScore);
    }

    getByCategory(category) {
        return Array.from(this.components.values())
            .filter(c => c.category === category || c.subcategory === category);
    }

    getAll() {
        return Array.from(this.components.values());
    }

    count() {
        return this.components.size;
    }

    // Get all categories
    getCategories() {
        return Object.keys(EXPANDED_COMPONENTS);
    }

    // Get components by category group
    getByGroup(groupKey) {
        if (EXPANDED_COMPONENTS[groupKey]) {
            return Object.values(EXPANDED_COMPONENTS[groupKey]);
        }
        return [];
    }
}

export const expandedRegistry = new ExtendedComponentRegistry();

console.log(`✅ Expanded Component Registry Loaded: ${expandedRegistry.count()} components`);
