/**
 * AI CIRCUIT GENERATION ENGINE
 * 
 * Converts natural language descriptions to circuit designs
 * 
 * Example:
 * Input: "Blink an LED using Arduino"
 * Output: Complete circuit with components, connections, and code
 */

import { componentRegistry } from './componentRegistry.js';
import { safetyEngine } from './safetyEngine.js';

export class CircuitGenerator {
    constructor() {
        this.templates = this._initializeTemplates();
        this.patterns = this._initializePatterns();
    }

    /**
     * Generate circuit from natural language description
     */
    generateFromDescription(description) {
        // Step 1: Parse intent and extract entities
        const intent = this._parseIntent(description);
        const entities = this._extractEntities(description);

        console.log('Intent:', intent);
        console.log('Entities:', entities);

        // Step 2: Look for matching template
        const template = this._findBestTemplate(intent, entities);
        if (!template) {
            return { error: 'Could not generate circuit from description' };
        }

        // Step 3: Generate circuit from template
        let circuit = JSON.parse(JSON.stringify(template.circuit)); // Deep copy

        // Step 4: Customize based on entities
        circuit = this._customizeCircuit(circuit, entities);

        // Step 5: Validate circuit
        const validation = safetyEngine.analyze(circuit);

        // Step 6: Generate code
        const code = this._generateCode(circuit, intent);

        return {
            success: true,
            circuit,
            code,
            validation,
            description: template.description,
            modifications: entities
        };
    }

    /**
     * Parse user intent from description
     */
    _parseIntent(description) {
        const desc = description.toLowerCase();

        if (desc.includes('blink') && desc.includes('led')) {
            return 'blink_led';
        }
        if (desc.includes('connect') && desc.includes('led')) {
            return 'simple_led';
        }
        if (desc.includes('motor')) {
            return 'motor_control';
        }
        if (desc.includes('distance') || desc.includes('sensor')) {
            return 'distance_sensor';
        }
        if (desc.includes('temperature') || desc.includes('humidity')) {
            return 'temperature_sensor';
        }
        if (desc.includes('servo')) {
            return 'servo_control';
        }
        if (desc.includes('robot')) {
            return 'robot';
        }
        if (desc.includes('iot') || desc.includes('internet')) {
            return 'iot_device';
        }

        return 'unknown';
    }

    /**
     * Extract entities from description
     */
    _extractEntities(description) {
        const entities = {
            components: [],
            microcontroller: this._extractMicrocontroller(description),
            voltage: this._extractVoltage(description),
            purpose: description
        };

        // Extract component mentions
        const componentMatches = [
            { keyword: 'led', component: 'led-red' },
            { keyword: 'resistor', component: 'resistor-220ohm' },
            { keyword: 'motor', component: 'dc-motor-3v' },
            { keyword: 'servo', component: 'servo-sg90' },
            { keyword: 'bluetooth', component: 'bluetooth-hc05' },
            { keyword: 'sensor', component: 'dht22' },
        ];

        componentMatches.forEach(match => {
            if (description.toLowerCase().includes(match.keyword)) {
                entities.components.push(match.component);
            }
        });

        return entities;
    }

    /**
     * Extract microcontroller preference
     */
    _extractMicrocontroller(description) {
        if (description.toLowerCase().includes('esp32')) return 'esp32';
        if (description.toLowerCase().includes('esp8266')) return 'wifi-esp8266';
        if (description.toLowerCase().includes('nano')) return 'arduino-nano';
        return 'arduino-uno'; // Default
    }

    /**
     * Extract voltage preference
     */
    _extractVoltage(description) {
        if (description.includes('3.3')) return 3.3;
        if (description.includes('5')) return 5;
        if (description.includes('12')) return 12;
        return 5; // Default
    }

    /**
     * Find best matching template for intent
     */
    _findBestTemplate(intent, entities) {
        const template = this.templates[intent];
        return template || null;
    }

    /**
     * Customize circuit based on extracted entities
     */
    _customizeCircuit(circuit, entities) {
        // Replace microcontroller if different from template
        if (entities.microcontroller) {
            circuit.components = circuit.components.map(comp => {
                if (comp.type === 'Microcontroller') {
                    return {
                        ...comp,
                        specificModel: entities.microcontroller
                    };
                }
                return comp;
            });
        }

        // Add extra components from entities
        entities.components.forEach(componentId => {
            const comp = componentRegistry.get(componentId);
            if (comp && !circuit.components.find(c => c.id === componentId)) {
                circuit.components.push({
                    id: componentId,
                    type: comp.category,
                    model: componentId,
                    specs: comp.specs
                });
            }
        });

        return circuit;
    }

    /**
     * Generate Arduino code from circuit
     */
    _generateCode(circuit, intent) {
        switch (intent) {
            case 'blink_led':
                return this._generateBlinkCode(circuit);
            case 'motor_control':
                return this._generateMotorCode(circuit);
            case 'distance_sensor':
                return this._generateDistanceSensorCode(circuit);
            case 'temperature_sensor':
                return this._generateTemperatureSensorCode(circuit);
            case 'servo_control':
                return this._generateServoCode(circuit);
            default:
                return this._generateGenericCode(circuit);
        }
    }

    /**
     * Generate blink LED code
     */
    _generateBlinkCode(circuit) {
        return `
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);   // Turn LED on
  delay(1000);                    // Wait 1 second
  digitalWrite(LED_PIN, LOW);    // Turn LED off
  delay(1000);                    // Wait 1 second
}
    `;
    }

    /**
     * Generate motor control code
     */
    _generateMotorCode(circuit) {
        return `
#define MOTOR_PIN_1 5
#define MOTOR_PIN_2 6

void setup() {
  pinMode(MOTOR_PIN_1, OUTPUT);
  pinMode(MOTOR_PIN_2, OUTPUT);
}

void loop() {
  // Forward
  digitalWrite(MOTOR_PIN_1, HIGH);
  digitalWrite(MOTOR_PIN_2, LOW);
  delay(2000);
  
  // Stop
  digitalWrite(MOTOR_PIN_1, LOW);
  digitalWrite(MOTOR_PIN_2, LOW);
  delay(1000);
  
  // Reverse
  digitalWrite(MOTOR_PIN_1, LOW);
  digitalWrite(MOTOR_PIN_2, HIGH);
  delay(2000);
}
    `;
    }

    /**
     * Generate distance sensor code
     */
    _generateDistanceSensorCode(circuit) {
        return `
#define TRIG_PIN 7
#define ECHO_PIN 8

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Send 10us pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Measure pulse duration
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  
  // Calculate distance (speed of sound = 340 m/s)
  int distance_cm = duration * 0.0343 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance_cm);
  Serial.println(" cm");
  
  delay(500);
}
    `;
    }

    /**
     * Generate temperature sensor code
     */
    _generateTemperatureSensorCode(circuit) {
        return `
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000); // DHT22 needs 2s between readings
  
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
}
    `;
    }

    /**
     * Generate servo control code
     */
    _generateServoCode(circuit) {
        return `
#include <Servo.h>

Servo myservo;
int servoPin = 9;

void setup() {
  myservo.attach(servoPin);
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle += 5) {
    myservo.write(angle);
    delay(100);
  }
  
  // Sweep back to 0
  for (int angle = 180; angle >= 0; angle -= 5) {
    myservo.write(angle);
    delay(100);
  }
}
    `;
    }

    /**
     * Generate generic code
     */
    _generateGenericCode(circuit) {
        return `
void setup() {
  Serial.begin(9600);
  // Initialize your pins here
}

void loop() {
  // Add your code here
  Serial.println("Hello from Arduino!");
  delay(1000);
}
    `;
    }

    /**
     * Initialize circuit templates
     */
    _initializeTemplates() {
        return {
            blink_led: {
                description: 'Simple LED blinking circuit',
                circuit: {
                    components: [
                        {
                            id: 'arduino_1',
                            type: 'Arduino Uno',
                            pin: 13,
                            label: 'Arduino Uno'
                        },
                        {
                            id: 'led_1',
                            type: 'LED',
                            model: 'led-red',
                            label: 'LED'
                        },
                        {
                            id: 'resistor_1',
                            type: 'Resistor',
                            value: 220,
                            unit: 'ohm',
                            label: '220Ω Resistor'
                        }
                    ],
                    connections: [
                        {
                            from: 'arduino_1.D13',
                            to: 'resistor_1.pin1',
                            label: 'Signal'
                        },
                        {
                            from: 'resistor_1.pin2',
                            to: 'led_1.anode',
                            label: 'Current path'
                        },
                        {
                            from: 'led_1.cathode',
                            to: 'arduino_1.GND',
                            label: 'Return to ground'
                        }
                    ],
                    placemen: {
                        arduino: { x: 50, y: 50 },
                        led: { x: 300, y: 100 },
                        resistor: { x: 200, y: 80 }
                    },
                    billOfMaterials: [
                        { component: 'arduino-uno', quantity: 1, cost: 22 },
                        { component: 'led-red', quantity: 1, cost: 0.10 },
                        { component: 'resistor-220ohm', quantity: 1, cost: 0.01 }
                    ]
                }
            },

            simple_led: {
                description: 'Simple LED connected to Arduino',
                circuit: {
                    components: [
                        { id: 'arduino_1', type: 'Arduino Uno', label: 'Arduino Uno' },
                        { id: 'led_1', type: 'LED', model: 'led-red', label: 'LED' },
                        { id: 'resistor_1', type: 'Resistor', value: 220, unit: 'ohm', label: '220Ω' }
                    ],
                    connections: [
                        { from: 'arduino_1.D13', to: 'resistor_1.pin1' },
                        { from: 'resistor_1.pin2', to: 'led_1.anode' },
                        { from: 'led_1.cathode', to: 'arduino_1.GND' }
                    ]
                }
            },

            motor_control: {
                description: 'DC Motor controlled by Arduino',
                circuit: {
                    components: [
                        { id: 'arduino_1', type: 'Arduino Uno', label: 'Arduino Uno' },
                        { id: 'motor_1', type: 'DC Motor', model: 'dc-motor-3v', label: 'Motor' },
                        { id: 'driver_1', type: 'Motor Driver', model: 'l298n', label: 'L298N Driver' }
                    ],
                    connections: [
                        { from: 'arduino_1.D5', to: 'driver_1.IN1' },
                        { from: 'arduino_1.D6', to: 'driver_1.IN2' },
                        { from: 'driver_1.OUT1', to: 'motor_1.+' },
                        { from: 'driver_1.OUT2', to: 'motor_1.-' }
                    ]
                }
            },

            distance_sensor: {
                description: 'HC-SR04 Ultrasonic Distance Sensor',
                circuit: {
                    components: [
                        { id: 'arduino_1', type: 'Arduino Uno', label: 'Arduino Uno' },
                        { id: 'sensor_1', type: 'Distance Sensor', model: 'hc-sr04', label: 'HC-SR04' }
                    ],
                    connections: [
                        { from: 'arduino_1.5V', to: 'sensor_1.VCC' },
                        { from: 'arduino_1.GND', to: 'sensor_1.GND' },
                        { from: 'arduino_1.D7', to: 'sensor_1.TRIG' },
                        { from: 'sensor_1.ECHO', to: 'arduino_1.D8' }
                    ]
                }
            },

            temperature_sensor: {
                description: 'DHT22 Temperature & Humidity Sensor',
                circuit: {
                    components: [
                        { id: 'arduino_1', type: 'Arduino Uno', label: 'Arduino Uno' },
                        { id: 'sensor_1', type: 'Environmental Sensor', model: 'dht22', label: 'DHT22' },
                        { id: 'resistor_1', type: 'Resistor', value: '4.7', unit: 'kohm', label: 'Pull-up 4.7kΩ' }
                    ],
                    connections: [
                        { from: 'arduino_1.5V', to: 'sensor_1.VCC' },
                        { from: 'arduino_1.GND', to: 'sensor_1.GND' },
                        { from: 'arduino_1.D2', to: 'sensor_1.OUT' },
                        { from: 'sensor_1.OUT', to: 'resistor_1.pin1' },
                        { from: 'resistor_1.pin2', to: 'arduino_1.5V' }
                    ]
                }
            }
        };
    }

    /**
     * Initialize pattern recognition
     */
    _initializePatterns() {
        return {
            sensor_patterns: [
                { type: 'i2c', pullUp: true, resistance: 4700, components: ['mpu6050', 'dht22'] },
                { type: 'uart', components: ['bluetooth-hc05', 'gps'] }
            ]
        };
    }
}

export const circuitGenerator = new CircuitGenerator();
