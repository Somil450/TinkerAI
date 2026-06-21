# -*- coding: utf-8 -*-
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/ai/circuitChatAI.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Extend system prompt with code-only instructions ─────────────────────
old_end = "Provide the complete accurate wiring IN A TABULAR FORMAT, and the actual C++ code snippet in the code field. Only use components and pins from the available registry.`;"
new_end = """Provide the complete accurate wiring IN A TABULAR FORMAT, and the actual C++ code snippet in the code field. Only use components and pins from the available registry.

If the user asks you to ONLY write/give/generate/edit/change/modify code (without building a circuit), respond with a complete Arduino sketch in a \\`\\`\\`cpp code block. At the END of your response, include this special HTML comment so the Apply Code button appears:
<!-- CODE: {"code": "FULL CODE WITH \\\\n FOR NEWLINES"} -->

For code-only requests:
- Write COMPLETE, FUNCTIONAL Arduino C++ code.
- Match pin numbers to components on canvas.
- Include all #define, variables, setup(), and loop().
- For HC-SR04: use pulseIn, distance = duration/58.2.
- For buzzer: use tone(pin, freq) and noTone(pin).
- Always make code immediately runnable.`;"""

if old_end in content:
    content = content.replace(old_end, new_end, 1)
    print("✓ System prompt extended")
else:
    print("✗ Could not find old_end")

# ── 2. Add code-only offline handler ────────────────────────────────────────
old_faq = "    // FAQ / Troubleshoot\r\n    else if (/not work|doesn"
if old_faq not in content:
    old_faq = "    // FAQ / Troubleshoot\n    else if (/not work|doesn"

code_handler = r"""    // ── Code-only request ──────────────────────────────────────────────────
    else if (/\b(give|write|generate|make|create|edit|change|modify|update|show)\s+(me\s+)?(the\s+)?(arduino\s+)?code\b/i.test(low) || /\bcode for\b/i.test(low) || /\bsketch\b/i.test(low)) {
      const placedTypes = placed.map(id => id.replace(/_\d+$/, ''));
      const hasHCSR04 = placedTypes.some(t => t.includes('hc-sr04') || t.includes('ultrasonic'));
      const hasBuzzer = placedTypes.some(t => t.includes('buzzer'));
      const hasDHT    = placedTypes.some(t => t.includes('dht'));
      const hasLED    = placedTypes.some(t => t.includes('led'));
      const hasServo  = placedTypes.some(t => t.includes('servo'));
      const distMatch = msg.match(/(\d+)\s*cm/i);
      const threshold = distMatch ? parseInt(distMatch[1]) : 20;

      let lines = [];
      if (hasHCSR04 && hasBuzzer) {
        lines = [
          '#define trigPin 9',
          '#define echoPin 10',
          '#define buzzerPin 8',
          '',
          'void setup() {',
          '  Serial.begin(9600);',
          '  pinMode(trigPin, OUTPUT);',
          '  pinMode(echoPin, INPUT);',
          '  pinMode(buzzerPin, OUTPUT);',
          '  digitalWrite(buzzerPin, LOW);',
          '}',
          '',
          'void loop() {',
          '  digitalWrite(trigPin, LOW);',
          '  delayMicroseconds(2);',
          '  digitalWrite(trigPin, HIGH);',
          '  delayMicroseconds(10);',
          '  digitalWrite(trigPin, LOW);',
          '',
          '  long duration = pulseIn(echoPin, HIGH);',
          '  float distance = duration / 58.2;',
          '',
          '  Serial.print("Distance: ");',
          '  Serial.print(distance);',
          '  Serial.println(" cm");',
          '',
          '  if (distance <= ' + String(threshold) + ') {',
          '    tone(buzzerPin, 1000);',
          '  } else {',
          '    noTone(buzzerPin);',
          '  }',
          '  delay(100);',
          '}'
        ];
      } else if (hasHCSR04) {
        lines = [
          '#define trigPin 9',
          '#define echoPin 10',
          '',
          'void setup() {',
          '  Serial.begin(9600);',
          '  pinMode(trigPin, OUTPUT);',
          '  pinMode(echoPin, INPUT);',
          '}',
          '',
          'void loop() {',
          '  digitalWrite(trigPin, LOW);',
          '  delayMicroseconds(2);',
          '  digitalWrite(trigPin, HIGH);',
          '  delayMicroseconds(10);',
          '  digitalWrite(trigPin, LOW);',
          '  long duration = pulseIn(echoPin, HIGH);',
          '  float distance = duration / 58.2;',
          '  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");',
          '  delay(100);',
          '}'
        ];
      } else if (hasDHT) {
        lines = [
          '#include <DHT.h>',
          '#define DHTPIN 4',
          '#define DHTTYPE DHT11',
          'DHT dht(DHTPIN, DHTTYPE);',
          'void setup() { Serial.begin(9600); dht.begin(); }',
          'void loop() {',
          '  float h = dht.readHumidity();',
          '  float t = dht.readTemperature();',
          '  if (!isnan(h) && !isnan(t)) {',
          '    Serial.print("Temp: "); Serial.print(t); Serial.print("C  Hum: "); Serial.println(h);',
          '  }',
          '  delay(2000);',
          '}'
        ];
      } else if (hasServo) {
        lines = [
          '#include <Servo.h>',
          'Servo myServo;',
          'void setup() { myServo.attach(9); }',
          'void loop() {',
          '  for (int p = 0; p <= 180; p++) { myServo.write(p); delay(15); }',
          '  for (int p = 180; p >= 0; p--) { myServo.write(p); delay(15); }',
          '}'
        ];
      } else if (hasLED) {
        lines = [
          '#define LED 13',
          'void setup() { pinMode(LED, OUTPUT); }',
          'void loop() { digitalWrite(LED, HIGH); delay(500); digitalWrite(LED, LOW); delay(500); }'
        ];
      } else {
        lines = [
          'void setup() { Serial.begin(9600); Serial.println("TinkerAI Ready!"); }',
          'void loop() { delay(1000); }'
        ];
      }

      const generatedCode = lines.join('\n');
      const escapedCode   = generatedCode.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const codeComment   = '<!-- CODE: {"code": "' + escapedCode + '"} -->';
      res = prefix + 'Here is the Arduino code for your circuit:\n\n```cpp\n' + generatedCode + '\n```\n\n' + codeComment;
    }

    // FAQ / Troubleshoot
    else if (/not work|doesn"""

if old_faq in content:
    content = content.replace(old_faq, code_handler, 1)
    print("✓ Code handler added")
else:
    print("✗ Could not find FAQ marker, trying LF version")
    old_faq2 = "    // FAQ / Troubleshoot\n    else if (/not work|doesn"
    if old_faq2 in content:
        content = content.replace(old_faq2, code_handler, 1)
        print("✓ Code handler added (LF)")
    else:
        print("✗ Could not find FAQ marker at all")

with open('src/ai/circuitChatAI.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("File written, lines:", len(content.split('\n')))
