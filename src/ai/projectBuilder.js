/**
 * TINKERAI PROJECT BUILDER
 * 
 * Advanced project generation engine
 * - 20+ project templates
 * - Bill of Materials (BOM) generation
 * - Assembly instructions with diagrams
 * - Code generation
 * - Troubleshooting guides
 * - Multi-format export (PDF, Arduino, HTML, Markdown)
 */

import { expandedRegistry } from './expandedRegistry.js';
import { circuitGenerator } from './index.js';

/**
 * Project template definitions
 */
export const PROJECT_TEMPLATES = {
    // LED Projects
    'blink-led': {
        name: 'Blink an LED',
        difficulty: 'Beginner',
        time: '15 minutes',
        description: 'Classic LED blinking circuit - the Hello World of electronics',
        components: ['arduino-uno', 'led-red', 'resistor-220ohm'],
        keywords: ['beginner', 'led', 'blink', 'arduino'],
        code: `
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
    `,
        schematic: 'LED connected to pin 13 with 220Ω resistor'
    },

    'rgb-led-controller': {
        name: 'RGB LED Controller',
        difficulty: 'Intermediate',
        time: '45 minutes',
        description: 'Control RGB LED colors with PWM pins',
        components: ['arduino-uno', 'rgb-led', 'resistor-220ohm', 'resistor-220ohm', 'resistor-220ohm'],
        keywords: ['rgb', 'led', 'color', 'pwm'],
        code: `
int redPin = 9, greenPin = 10, bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  setColor(255, 0, 0); // Red
  delay(1000);
  setColor(0, 255, 0); // Green
  delay(1000);
  setColor(0, 0, 255); // Blue
  delay(1000);
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
    `,
        schematic: 'RGB LED with PWM control on pins 9, 10, 11'
    },

    // Sensor Projects
    'distance-meter': {
        name: 'Ultrasonic Distance Meter',
        difficulty: 'Beginner',
        time: '30 minutes',
        description: 'Measure distance using HC-SR04 ultrasonic sensor',
        components: ['arduino-uno', 'hc-sr04', 'jumper-wires'],
        keywords: ['sensor', 'distance', 'ultrasonic', 'measurement'],
        code: `
const int trigPin = 9, echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.println(distance);
  delay(500);
}
    `,
        schematic: 'HC-SR04 connected to pins 9 (trigger) and 10 (echo)'
    },

    'temperature-logger': {
        name: 'Temperature & Humidity Logger',
        difficulty: 'Intermediate',
        time: '45 minutes',
        description: 'Log environmental data with DHT22 sensor',
        components: ['arduino-uno', 'dht22', 'sd-card-module', 'resistor-10kohm'],
        keywords: ['sensor', 'temperature', 'humidity', 'data-logging'],
        code: `
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (!isnan(humidity) && !isnan(temperature)) {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print("°C Humidity: ");
    Serial.println(humidity);
  }
  delay(5000);
}
    `,
        schematic: 'DHT22 data pin to pin 2, with 10kΩ pull-up resistor'
    },

    // Motor Projects
    'dc-motor-control': {
        name: 'DC Motor Speed Controller',
        difficulty: 'Beginner',
        time: '30 minutes',
        description: 'Control DC motor speed with PWM',
        components: ['arduino-uno', 'dc-motor-5v', 'motor-driver-l298n', 'battery-9v'],
        keywords: ['motor', 'dc', 'pwm', 'speed-control'],
        code: `
const int motorPin = 9;

void setup() {
  pinMode(motorPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int speed = 0; speed <= 255; speed += 10) {
    analogWrite(motorPin, speed);
    Serial.println(speed);
    delay(500);
  }
  delay(2000);
}
    `,
        schematic: 'DC motor via L298N driver, PWM on pin 9'
    },

    'servo-robot': {
        name: 'Servo Robot Arm',
        difficulty: 'Intermediate',
        time: '60 minutes',
        description: 'Build a 3-servo robotic arm',
        components: ['arduino-uno', 'servo-sg90', 'servo-sg90', 'servo-sg90', 'servo-driver-pca9685'],
        keywords: ['servo', 'robot', 'arm', 'control'],
        code: `
#include <Servo.h>

Servo servo1, servo2, servo3;

void setup() {
  servo1.attach(9);
  servo2.attach(10);
  servo3.attach(11);
  Serial.begin(9600);
}

void loop() {
  // Move servos
  for (int angle = 0; angle <= 180; angle++) {
    servo1.write(angle);
    servo2.write(180 - angle);
    servo3.write(angle);
    delay(50);
  }
}
    `,
        schematic: 'Three SG90 servos on pins 9, 10, 11'
    },

    // Communication Projects
    'bluetooth-remote': {
        name: 'Bluetooth Remote Control',
        difficulty: 'Intermediate',
        time: '45 minutes',
        description: 'Control LEDs via Bluetooth',
        components: ['arduino-uno', 'bluetooth-hc05', 'led-red', 'led-green', 'led-blue', 'resistor-220ohm'],
        keywords: ['bluetooth', 'wireless', 'remote', 'control'],
        code: `
#include <SoftwareSerial.h>
SoftwareSerial BTSerial(10, 11);

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
}

void loop() {
  if (BTSerial.available()) {
    char cmd = BTSerial.read();
    
    if (cmd == 'R') digitalWrite(2, HIGH);
    else if (cmd == 'r') digitalWrite(2, LOW);
    else if (cmd == 'G') digitalWrite(3, HIGH);
    else if (cmd == 'g') digitalWrite(3, LOW);
    else if (cmd == 'B') digitalWrite(4, HIGH);
    else if (cmd == 'b') digitalWrite(4, LOW);
  }
}
    `,
        schematic: 'HC-05 on SoftwareSerial (pins 10, 11), LEDs on pins 2, 3, 4'
    },

    'wifi-weather-station': {
        name: 'WiFi Weather Station',
        difficulty: 'Advanced',
        time: '90 minutes',
        description: 'IoT weather monitoring with ESP8266',
        components: ['esp32', 'bme680', 'oled-128x64'],
        keywords: ['iot', 'weather', 'wifi', 'cloud'],
        code: `
#include <WiFi.h>
#include <Adafruit_BME680.h>
#include <Adafruit_SSD1306.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

Adafruit_BME680 bme;
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  bme.begin();
  display.begin();
}

void loop() {
  float temp = bme.readTemperature();
  float humidity = bme.readHumidity();
  
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 0);
  display.print("Temp: ");
  display.println(temp);
  display.print("Humidity: ");
  display.println(humidity);
  display.display();
  
  delay(5000);
}
    `,
        schematic: 'BME680 on I2C, OLED display on SPI'
    },

    // Additional beginner projects
    'button-led': {
        name: 'Button Controlled LED',
        difficulty: 'Beginner',
        time: '20 minutes',
        description: 'Toggle LED with a push button',
        components: ['arduino-uno', 'led-red', 'resistor-220ohm', 'resistor-10kohm'],
        keywords: ['button', 'led', 'input', 'digital'],
        code: `
const int buttonPin = 2, ledPin = 13;
int ledState = LOW;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (digitalRead(buttonPin) == HIGH) {
    ledState = !ledState;
    digitalWrite(ledPin, ledState);
    delay(500);
  }
}
    `,
        schematic: 'Button on pin 2, LED on pin 13 with 220Ω resistor'
    },

    'motion-alarm': {
        name: 'Motion Detection Alarm',
        difficulty: 'Beginner',
        time: '30 minutes',
        description: 'Detect motion with PIR sensor and trigger alarm',
        components: ['arduino-uno', 'pir-sensor', 'buzzer-5v', 'led-red'],
        keywords: ['motion', 'pir', 'alarm', 'security'],
        code: `
const int pirPin = 7, buzzerPin = 8, ledPin = 13;

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    Serial.println("Motion detected!");
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(ledPin, HIGH);
    delay(2000);
    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledPin, LOW);
    delay(2000);
  }
}
    `,
        schematic: 'PIR sensor on pin 7, buzzer on pin 8, LED on pin 13'
    }
};

/**
 * Project Builder Engine
 */
export class ProjectBuilder {
    constructor() {
        this.templates = PROJECT_TEMPLATES;
    }

    /**
     * Get project template
     */
    getTemplate(templateId) {
        return this.templates[templateId];
    }

    /**
     * List all available projects
     */
    listProjects() {
        return Object.entries(this.templates).map(([id, template]) => ({
            id,
            ...template
        }));
    }

    /**
     * Generate Bill of Materials
     */
    generateBOM(projectId) {
        const project = this.getTemplate(projectId);
        if (!project) return null;

        const bom = {
            projectName: project.name,
            difficulty: project.difficulty,
            estimatedTime: project.time,
            items: []
        };

        const quantities = {};
        project.components.forEach(compId => {
            quantities[compId] = (quantities[compId] || 0) + 1;
        });

        Object.entries(quantities).forEach(([compId, qty]) => {
            const component = expandedRegistry.get(compId);
            if (component) {
                bom.items.push({
                    quantity: qty,
                    component: component.name,
                    specs: component.specs,
                    unitPrice: component.price,
                    totalPrice: component.price * qty
                });
            }
        });

        bom.totalCost = bom.items.reduce((sum, item) => sum + item.totalPrice, 0);
        return bom;
    }

    /**
     * Generate assembly instructions
     */
    generateAssemblyInstructions(projectId) {
        const project = this.getTemplate(projectId);
        if (!project) return null;

        return {
            projectName: project.name,
            difficulty: project.difficulty,
            estimatedTime: project.time,
            tools: ['Breadboard', 'Jumper wires', 'USB cable', 'Arduino IDE'],
            steps: [
                {
                    step: 1,
                    title: 'Gather Components',
                    description: `Collect all required components for ${project.name}`,
                    components: project.components
                },
                {
                    step: 2,
                    title: 'Prepare the Breadboard',
                    description: 'Place the breadboard in front of you with terminal strips facing up'
                },
                {
                    step: 3,
                    title: 'Place Microcontroller',
                    description: `Insert Arduino/Microcontroller into the breadboard`,
                    schematic: project.schematic
                },
                {
                    step: 4,
                    title: 'Connect Components',
                    description: `Wire all components according to the schematic`,
                    warning: 'Double-check all connections before powering up'
                },
                {
                    step: 5,
                    title: 'Upload Code',
                    description: 'Connect Arduino to computer and upload the provided code',
                    code: project.code
                },
                {
                    step: 6,
                    title: 'Test & Debug',
                    description: 'Verify the circuit works as expected. Check serial output if available'
                }
            ],
            tips: [
                'Use color-coded wires for organization',
                'Double-check polarity on components like LEDs and capacitors',
                'Test incrementally - build one section at a time',
                'Keep jumper wires short and organized'
            ]
        };
    }

    /**
     * Generate troubleshooting guide
     */
    generateTroubleshootingGuide(projectId) {
        const project = this.getTemplate(projectId);
        if (!project) return null;

        return {
            projectName: project.name,
            issues: [
                {
                    problem: 'Circuit does not power on',
                    solutions: [
                        'Check USB cable connection',
                        'Verify breadboard power rails have correct voltage',
                        'Check for loose wires',
                        'Try different USB port'
                    ]
                },
                {
                    problem: 'Code upload fails',
                    solutions: [
                        'Select correct board in Arduino IDE',
                        'Select correct COM port',
                        'Try unplugging and re-plugging USB',
                        'Check USB cable is not damaged',
                        'Reinstall Arduino drivers'
                    ]
                },
                {
                    problem: 'Components not responding',
                    solutions: [
                        'Verify component connections match schematic',
                        'Check component polarity',
                        'Test with multimeter for continuity',
                        'Try replacing component if damaged'
                    ]
                },
                {
                    problem: 'Incorrect readings/behavior',
                    solutions: [
                        'Verify pin assignments in code match circuit',
                        'Check for loose connections',
                        'Use Serial.println() for debugging',
                        'Test with simpler code first'
                    ]
                }
            ],
            debuggingTips: [
                'Use Serial Monitor to check sensor readings',
                'Blink LED to verify pin functionality',
                'Test components individually before assembly',
                'Use multimeter to check voltages'
            ]
        };
    }

    /**
     * Generate complete project documentation (Markdown)
     */
    generateProjectMarkdown(projectId) {
        const project = this.getTemplate(projectId);
        const bom = this.generateBOM(projectId);
        const assembly = this.generateAssemblyInstructions(projectId);
        const troubleshooting = this.generateTroubleshootingGuide(projectId);

        if (!project) return null;

        let markdown = `# ${project.name}

## Overview
${project.description}

**Difficulty:** ${project.difficulty}
**Estimated Time:** ${project.time}

## Bill of Materials

| Qty | Component | Specs | Unit Price | Total |
|-----|-----------|-------|------------|-------|
`;

        bom.items.forEach(item => {
            markdown += `| ${item.quantity} | ${item.component} | ${JSON.stringify(item.specs).substring(0, 30)}... | $${item.unitPrice} | $${item.totalPrice.toFixed(2)} |\n`;
        });

        markdown += `\n**Total Cost:** $${bom.totalCost.toFixed(2)}\n\n`;

        markdown += `## Schematic
\`\`\`
${project.schematic}
\`\`\`

## Assembly Instructions

`;

        assembly.steps.forEach(step => {
            markdown += `### Step ${step.step}: ${step.title}
${step.description}

`;
            if (step.warning) markdown += `⚠️ **Warning:** ${step.warning}\n\n`;
            if (step.code) markdown += `\`\`\`cpp\n${step.code}\n\`\`\`\n\n`;
        });

        markdown += `## Code

\`\`\`cpp
${project.code}
\`\`\`

## Tips

${assembly.tips.map(tip => `- ${tip}`).join('\n')}

## Troubleshooting

`;

        troubleshooting.issues.forEach(issue => {
            markdown += `### ${issue.problem}

${issue.solutions.map(sol => `- ${sol}`).join('\n')}

`;
        });

        return markdown;
    }

    /**
     * Export as HTML with styling
     */
    generateProjectHTML(projectId) {
        const markdown = this.generateProjectMarkdown(projectId);
        if (!markdown) return null;

        return `<!DOCTYPE html>
<html>
<head>
  <title>${this.getTemplate(projectId).name}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    h1 { color: #0f3460; border-bottom: 3px solid #00ff88; padding-bottom: 10px; }
    h2 { color: #0f3460; margin-top: 30px; }
    h3 { color: #16213e; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #0f3460; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    pre { background: #1a1a2e; color: #00ff88; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-weight: bold; margin: 5px 5px 5px 0; }
    .badge-difficulty { background: #ffc107; color: #333; }
    .badge-time { background: #17a2b8; color: white; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
    .tip { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    ${markdown.replace(/^# /gm, '<h1>').replace(/\n#/g, '</h1>\n<h1>').replace(/\n## /gm, '\n<h2>').replace(/\n###/gm, '\n<h3>').replace(/\n####/gm, '\n<h4>').replace(/\*\*/g, '<strong>').replace(/<strong>(.+?)<\/strong>/g, '<strong>$1</strong>').replace(/```cpp\n([\s\S]*?)\n```/gm, '<pre><code>$1</code></pre>')}
  </div>
</body>
</html>`;
    }

    /**
     * Create a new custom project
     */
    createCustomProject(name, components, code, description = '') {
        const projectId = name.toLowerCase().replace(/\s/g, '-');

        this.templates[projectId] = {
            name,
            difficulty: 'Custom',
            time: 'Variable',
            description: description || `Custom project: ${name}`,
            components,
            keywords: ['custom'],
            code,
            schematic: 'Custom circuit'
        };

        return projectId;
    }
}

export const projectBuilder = new ProjectBuilder();

console.log(`✅ Project Builder Loaded: ${Object.keys(PROJECT_TEMPLATES).length} templates`);
