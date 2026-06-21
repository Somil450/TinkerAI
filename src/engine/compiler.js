/**
 * Wokwi Arduino Compiler API integration
 */

const LIBRARY_MAP = {
    'AFMotor.h': 'Adafruit Motor Shield library',
    'DHT.h': 'DHT sensor library',
    'Adafruit_Sensor.h': 'Adafruit Unified Sensor',
    'LiquidCrystal_I2C.h': 'LiquidCrystal I2C',
    'IRremote.h': 'IRremote',
    'NewPing.h': 'NewPing',
    'Keypad.h': 'Keypad',
    'MPU6050.h': 'MPU6050',
    'Adafruit_GFX.h': 'Adafruit GFX Library',
    'Adafruit_SSD1306.h': 'Adafruit SSD1306',
    'FastLED.h': 'FastLED',
    'DallasTemperature.h': 'DallasTemperature',
    'OneWire.h': 'OneWire',
    'RTClib.h': 'RTClib',
    'Servo.h': 'Servo',
    'Stepper.h': 'Stepper',
    'Adafruit_NeoPixel.h': 'Adafruit NeoPixel',
    'PubSubClient.h': 'PubSubClient',
    'ArduinoJson.h': 'ArduinoJson',
    'Bounce2.h': 'Bounce2',
    'U8g2lib.h': 'U8g2',
    'PID_v1.h': 'PID',
    'TinyGPS++.h': 'TinyGPSPlus',
    'TimerOne.h': 'TimerOne',
    'HX711.h': 'HX711 Arduino Library'
};

export async function compileCode(code, fqbn = 'arduino:avr:uno') {
    const files = [];
    
    // Automatically detect required libraries based on includes
    const includeRegex = /^\s*#include\s*[<"]([^>"]+)[>"]/gm;
    let match;
    const requiredLibs = new Set();
    
    while ((match = includeRegex.exec(code)) !== null) {
        const header = match[1];
        const libName = LIBRARY_MAP[header];
        if (libName) {
            requiredLibs.add(libName);
        }
    }
    
    if (requiredLibs.size > 0) {
        files.push({
            name: 'libraries.txt',
            content: Array.from(requiredLibs).join('\n')
        });
    }

    const data = {
        sketch: `${code}`,
        files: files,
        board: fqbn   // Pass selected board FQBN to Wokwi compiler
    };

    try {
        const response = await fetch('https://hexi.wokwi.com/build', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result; // contains { hex: "...", stderr: "...", stdout: "..." }
    } catch (e) {
        return { compilerError: e.message };
    }
}
