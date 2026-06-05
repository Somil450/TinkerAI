"""
Generate highly realistic, component-specific SVGs for all TinkerAI components.
Each component gets a unique illustration that looks like the real part.
"""
import os

OUT_DIR = r'public/assets/components'
os.makedirs(OUT_DIR, exist_ok=True)

def w(filename, content):
    path = os.path.join(OUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ok {filename}")


# ─────────────────────────────────────────────────────────────
# HELPER: standard PCB module with custom chip area
# ─────────────────────────────────────────────────────────────
def pcb_module(id, fill, stroke, pin_labels, chip_body, label_text, label_color='#fff', w_=130, h_=90):
    """Render a standard breakout-board module SVG."""
    n = len(pin_labels)
    pin_step = min(18, (w_ - 20) // max(n, 1))
    total_pin_w = n * pin_step
    px = (w_ // 2) - (total_pin_w // 2)

    pins_svg = ''
    for i, p in enumerate(pin_labels):
        x = px + i * pin_step
        pins_svg += f'<rect x="{x}" y="2" width="10" height="12" fill="#ccc" stroke="#999" stroke-width="0.5" rx="1"/>\n'
        pins_svg += f'<text x="{x+5}" y="1" text-anchor="middle" font-size="5" fill="#eee" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w_} {h_}" width="{w_}" height="{h_}">
  <defs>
    <filter id="sh" x="-8%" y="-8%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="pcbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{fill}" stop-opacity="1"/>
      <stop offset="100%" stop-color="{stroke}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <!-- PCB Body -->
  <rect x="4" y="14" width="{w_-8}" height="{h_-18}" rx="4" fill="url(#pcbg)" stroke="{stroke}" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Mounting holes -->
  <circle cx="12" cy="22" r="3" fill="none" stroke="{stroke}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="{w_-12}" cy="22" r="3" fill="none" stroke="{stroke}" stroke-width="1.5" opacity="0.5"/>
  <!-- Pin header base -->
  <rect x="{px-2}" y="12" width="{total_pin_w+4}" height="4" rx="1" fill="#1a1a1a"/>
  <!-- Pins -->
  {pins_svg}
  <!-- Chip / custom body -->
  {chip_body}
  <!-- Label -->
  <text x="{w_//2}" y="{h_-4}" text-anchor="middle" font-size="9" font-weight="bold" font-family="Arial,sans-serif" fill="{label_color}">{label_text}</text>
</svg>'''


# ─────────────────────────────────────────────────────────────
# SVGs
# ─────────────────────────────────────────────────────────────

# --- Arduino UNO ---
w('arduino-uno.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120">
  <defs>
    <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
  </defs>
  <!-- Board -->
  <path d="M10,20 L130,20 L130,110 L40,110 L10,85 Z" fill="url(#bg)" stroke="#0a3060" stroke-width="2" filter="url(#sh)"/>
  <!-- USB Port -->
  <rect x="8" y="55" width="18" height="22" rx="2" fill="#888" stroke="#555" stroke-width="1"/>
  <rect x="11" y="58" width="12" height="16" rx="1" fill="#444"/>
  <!-- DC Jack -->
  <rect x="8" y="32" width="16" height="14" rx="3" fill="#222" stroke="#555" stroke-width="1"/>
  <circle cx="16" cy="39" r="5" fill="#333"/><circle cx="16" cy="39" r="2" fill="#888"/>
  <!-- ATmega328 chip -->
  <rect x="55" y="50" width="40" height="40" rx="3" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
  <text x="75" y="68" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">ATmega</text>
  <text x="75" y="76" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">328P-PU</text>
  <!-- Digital pins top -->
  <rect x="55" y="14" width="72" height="8" rx="1" fill="#1a1a1a"/>
  <text x="91" y="11" text-anchor="middle" font-size="6" fill="#aaa" font-family="Arial,sans-serif">D0-D13</text>
  <!-- Analog pins bottom -->
  <rect x="28" y="103" width="60" height="8" rx="1" fill="#1a1a1a"/>
  <text x="58" y="116" text-anchor="middle" font-size="6" fill="#aaa" font-family="Arial,sans-serif">A0-A5 / GND / VCC</text>
  <!-- Reset button -->
  <rect x="105" y="26" width="10" height="10" rx="2" fill="#e53935"/>
  <!-- Label -->
  <text x="80" y="45" text-anchor="middle" font-size="10" font-weight="bold" font-family="Arial,sans-serif" fill="white">Arduino UNO</text>
</svg>''')

# --- Arduino NANO ---
w('arduino-nano.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 65" width="150" height="65">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0D47A1"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="142" height="57" rx="3" fill="url(#bg)" stroke="#0a3060" stroke-width="1.5"/>
  <!-- Mini USB -->
  <rect x="60" y="0" width="24" height="10" rx="2" fill="#888" stroke="#555" stroke-width="1"/>
  <rect x="63" y="2" width="18" height="6" rx="1" fill="#444"/>
  <!-- ATmega chip -->
  <rect x="53" y="22" width="40" height="28" rx="2" fill="#111" stroke="#333"/>
  <text x="73" y="36" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">ATmega328</text>
  <!-- Left pins -->
  <rect x="0" y="10" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <!-- Right pins -->
  <rect x="142" y="10" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <text x="75" y="58" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial,sans-serif" fill="white">Arduino Nano</text>
</svg>''')

# --- Arduino MEGA ---
w('arduino-mega.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110" width="200" height="110">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0D47A1"/>
  </linearGradient></defs>
  <path d="M10,15 L175,15 L175,100 L50,100 L10,75 Z" fill="url(#bg)" stroke="#0a3060" stroke-width="2"/>
  <!-- USB Port -->
  <rect x="8" y="45" width="18" height="22" rx="2" fill="#888" stroke="#555"/>
  <rect x="11" y="48" width="12" height="16" rx="1" fill="#444"/>
  <!-- ATmega2560 chip (larger) -->
  <rect x="60" y="35" width="55" height="45" rx="3" fill="#111" stroke="#333"/>
  <text x="87" y="56" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">ATmega</text>
  <text x="87" y="64" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">2560</text>
  <!-- Pin rows -->
  <rect x="30" y="8" width="140" height="8" rx="1" fill="#1a1a1a"/>
  <rect x="30" y="95" width="140" height="8" rx="1" fill="#1a1a1a"/>
  <rect x="155" y="20" width="8" height="70" rx="1" fill="#1a1a1a"/>
  <text x="110" y="30" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Arduino MEGA 2560</text>
</svg>''')

# --- ESP32 DevKit ---
w('esp32-devkit.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 75" width="160" height="75">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474F"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="152" height="67" rx="4" fill="url(#bg)" stroke="#1a2027" stroke-width="2"/>
  <!-- ESP32 module (metal shielded) -->
  <rect x="45" y="12" width="70" height="40" rx="3" fill="#444" stroke="#666" stroke-width="1.5"/>
  <rect x="48" y="15" width="64" height="34" rx="2" fill="#555" stroke="#777"/>
  <text x="80" y="30" text-anchor="middle" font-size="7" fill="#aaa" font-family="monospace" font-weight="bold">ESP32</text>
  <text x="80" y="40" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">Espressif</text>
  <!-- Antenna cutout -->
  <rect x="110" y="15" width="8" height="34" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="2,2"/>
  <!-- USB port -->
  <rect x="68" y="63" width="24" height="8" rx="2" fill="#888" stroke="#555"/>
  <!-- Boot/EN buttons -->
  <rect x="14" y="25" width="12" height="8" rx="1" fill="#e53935"/>
  <rect x="14" y="40" width="12" height="8" rx="1" fill="#1976d2"/>
  <!-- Left pins -->
  <rect x="0" y="8" width="8" height="59" rx="1" fill="#1a1a1a"/>
  <!-- Right pins -->
  <rect x="152" y="8" width="8" height="59" rx="1" fill="#1a1a1a"/>
  <text x="80" y="72" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="white">ESP32 DevKit</text>
</svg>''')

# --- ESP8266 ---
w('esp8266.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 65" width="140" height="65">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474F"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="132" height="57" rx="4" fill="url(#bg)" stroke="#1a2027" stroke-width="2"/>
  <!-- ESP8266 module -->
  <rect x="40" y="10" width="62" height="35" rx="3" fill="#444" stroke="#666" stroke-width="1.5"/>
  <text x="71" y="26" text-anchor="middle" font-size="7" fill="#aaa" font-family="monospace" font-weight="bold">ESP8266</text>
  <text x="71" y="35" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">NodeMCU</text>
  <!-- USB -->
  <rect x="55" y="55" width="24" height="7" rx="2" fill="#888" stroke="#555"/>
  <!-- Left/Right pins -->
  <rect x="0" y="8" width="8" height="49" rx="1" fill="#1a1a1a"/>
  <rect x="132" y="8" width="8" height="49" rx="1" fill="#1a1a1a"/>
  <text x="70" y="61" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="white">ESP8266 NodeMCU</text>
</svg>''')

# --- Raspberry Pi Pico ---
w('rpi-pico.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="160" height="65">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#006622"/><stop offset="100%" stop-color="#004d19"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="152" height="57" rx="5" fill="url(#bg)" stroke="#003311" stroke-width="2"/>
  <!-- RP2040 chip -->
  <rect x="58" y="18" width="44" height="30" rx="2" fill="#111" stroke="#333"/>
  <text x="80" y="32" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">RP2040</text>
  <text x="80" y="41" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Raspberry Pi</text>
  <!-- Flash chip -->
  <rect x="110" y="24" width="20" height="16" rx="1" fill="#222" stroke="#444"/>
  <!-- USB-Micro port -->
  <rect x="65" y="0" width="24" height="10" rx="2" fill="#aaa" stroke="#666"/>
  <rect x="68" y="2" width="18" height="6" rx="1" fill="#444"/>
  <!-- Left/Right pins -->
  <rect x="0" y="8" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <rect x="152" y="8" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <text x="80" y="60" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="white">Raspberry Pi Pico</text>
</svg>''')

# --- STM32 Bluepill ---
w('stm32-bluepill.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="160" height="65">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0D47A1"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="152" height="57" rx="3" fill="url(#bg)" stroke="#0a3060" stroke-width="2"/>
  <!-- STM32F103 chip -->
  <rect x="53" y="14" width="52" height="37" rx="2" fill="#111" stroke="#333"/>
  <text x="79" y="31" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">STM32F103</text>
  <text x="79" y="40" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">C8T6</text>
  <!-- Crystal -->
  <rect x="113" y="22" width="18" height="9" rx="2" fill="#c0c0c0" stroke="#777"/>
  <!-- Boot/reset buttons -->
  <rect x="128" y="40" width="12" height="7" rx="1" fill="#e53935"/>
  <!-- USB -->
  <rect x="63" y="0" width="24" height="10" rx="2" fill="#888" stroke="#555"/>
  <!-- Left/Right pins -->
  <rect x="0" y="8" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <rect x="152" y="8" width="8" height="50" rx="1" fill="#1a1a1a"/>
  <text x="80" y="60" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="white">STM32 Blue Pill</text>
</svg>''')

# --- HC-SR04 Ultrasonic ---
w('hc-sr04.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1E88E5"/><stop offset="100%" stop-color="#0D47A1"/>
  </linearGradient></defs>
  <rect x="4" y="14" width="122" height="72" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5"/>
  <!-- Left transducer (TX) -->
  <circle cx="32" cy="55" r="22" fill="#e0e0e0" stroke="#bbb" stroke-width="2"/>
  <circle cx="32" cy="55" r="17" fill="#c8c8c8"/>
  <circle cx="32" cy="55" r="11" fill="#b0b0b0" stroke="#999"/>
  <circle cx="32" cy="55" r="5" fill="#888"/>
  <text x="32" y="82" text-anchor="middle" font-size="6" fill="#fff" font-family="Arial">TX</text>
  <!-- Right transducer (RX) -->
  <circle cx="98" cy="55" r="22" fill="#e0e0e0" stroke="#bbb" stroke-width="2"/>
  <circle cx="98" cy="55" r="17" fill="#c8c8c8"/>
  <circle cx="98" cy="55" r="11" fill="#b0b0b0" stroke="#999"/>
  <circle cx="98" cy="55" r="5" fill="#888"/>
  <text x="98" y="82" text-anchor="middle" font-size="6" fill="#fff" font-family="Arial">RX</text>
  <!-- 4 pin header -->
  <rect x="44" y="4" width="42" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="47" y="6" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="57" y="6" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="67" y="6" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="77" y="6" width="8" height="8" fill="#bbb" rx="1"/>
  <text x="51" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="61" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">TRG</text>
  <text x="71" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">ECH</text>
  <text x="81" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">GND</text>
  <text x="65" y="26" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">HC-SR04</text>
</svg>''')

# --- DHT22 / DHT11 ---
w('dht-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="80" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Main body -->
  <rect x="8" y="20" width="64" height="70" rx="5" fill="#1565C0" stroke="#0D47A1" stroke-width="2" filter="url(#sh)"/>
  <!-- Sensor mesh at top -->
  <rect x="8" y="20" width="64" height="28" rx="5" fill="none" stroke="#90CAF9" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="8" y1="30" x2="72" y2="30" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="8" y1="36" x2="72" y2="36" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="8" y1="42" x2="72" y2="42" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="20" y1="20" x2="20" y2="48" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="32" y1="20" x2="32" y2="48" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="44" y1="20" x2="44" y2="48" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <line x1="56" y1="20" x2="56" y2="48" stroke="#90CAF9" stroke-width="0.8" stroke-dasharray="3,2"/>
  <text x="40" y="68" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="Arial">DHT22</text>
  <text x="40" y="80" text-anchor="middle" font-size="7" fill="#90CAF9" font-family="Arial">Temp/Humidity</text>
  <!-- 4 pins at bottom -->
  <rect x="16" y="88" width="8" height="15" fill="#bbb" rx="1"/>
  <rect x="28" y="88" width="8" height="15" fill="#bbb" rx="1"/>
  <rect x="40" y="88" width="8" height="15" fill="#bbb" rx="1"/>
  <rect x="52" y="88" width="8" height="15" fill="#bbb" rx="1"/>
</svg>''')

# --- MPU6050 ---
w('mpu6050.svg', pcb_module('mpu6050','#006064','#00363a',
    ['VCC','GND','SCL','SDA','XDA','XCL','AD0','INT'],
    '''<rect x="40" y="30" width="50" height="35" rx="2" fill="#111" stroke="#333"/>
    <text x="65" y="44" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">MPU-6050</text>
    <text x="65" y="54" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">6-axis IMU</text>''',
    'MPU6050 6DOF IMU'))

# --- MPU9250 ---
w('mpu9250.svg', pcb_module('mpu9250','#006064','#00363a',
    ['VCC','GND','SCL','SDA','EDA','ECL','AD0','INT'],
    '''<rect x="40" y="30" width="50" height="35" rx="2" fill="#111" stroke="#333"/>
    <text x="65" y="44" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">MPU-9250</text>
    <text x="65" y="54" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">9-axis IMU</text>''',
    'MPU9250 9DOF IMU'))

# --- LDR ---
w('ldr.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <!-- LDR body (round disc shape) -->
  <circle cx="40" cy="40" r="28" fill="#e8c060" stroke="#b8903a" stroke-width="3"/>
  <circle cx="40" cy="40" r="22" fill="none" stroke="#b8903a" stroke-width="2"/>
  <!-- Zigzag pattern on disc -->
  <path d="M24,40 L30,32 L36,40 L42,32 L48,40 L54,32 L56,40" stroke="#6b4700" stroke-width="2" fill="none"/>
  <!-- Two leads -->
  <line x1="24" y1="62" x2="24" y2="78" stroke="#999" stroke-width="3"/>
  <line x1="56" y1="62" x2="56" y2="78" stroke="#999" stroke-width="3"/>
  <text x="40" y="12" text-anchor="middle" font-size="9" font-weight="bold" fill="#333" font-family="Arial">LDR</text>
</svg>''')

# --- PIR Sensor ---
w('pir-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 100" width="90" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="40" width="82" height="55" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- White dome -->
  <ellipse cx="45" cy="50" rx="35" ry="35" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>
  <ellipse cx="45" cy="50" rx="30" ry="30" fill="#fafafa" opacity="0.7"/>
  <!-- Sensitivity and delay trimmers -->
  <circle cx="20" cy="75" r="7" fill="#f5f5f5" stroke="#999" stroke-width="1.5"/>
  <line x1="20" y1="68" x2="20" y2="72" stroke="#333" stroke-width="2"/>
  <circle cx="70" cy="75" r="7" fill="#f5f5f5" stroke="#999" stroke-width="1.5"/>
  <line x1="70" y1="68" x2="70" y2="72" stroke="#333" stroke-width="2"/>
  <!-- 3 pins -->
  <rect x="30" y="90" width="8" height="14" fill="#bbb" rx="1"/>
  <rect x="41" y="90" width="8" height="14" fill="#bbb" rx="1"/>
  <rect x="52" y="90" width="8" height="14" fill="#bbb" rx="1"/>
  <text x="34" y="89" text-anchor="middle" font-size="5" fill="#eee">VCC</text>
  <text x="45" y="89" text-anchor="middle" font-size="5" fill="#eee">OUT</text>
  <text x="56" y="89" text-anchor="middle" font-size="5" fill="#eee">GND</text>
  <text x="45" y="98" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">PIR HC-SR501</text>
</svg>''')

# --- MQ-2 Gas ---
w('mq2-gas.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 95" width="110" height="95">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="18" width="102" height="73" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- MQ sensor element (cylindrical metal dome) -->
  <ellipse cx="40" cy="55" rx="22" ry="22" fill="#bbb" stroke="#999" stroke-width="2"/>
  <ellipse cx="40" cy="55" rx="17" ry="17" fill="#888" stroke="#777" stroke-width="1"/>
  <ellipse cx="40" cy="55" rx="12" ry="12" fill="#666"/>
  <!-- Mesh lines -->
  <line x1="28" y1="55" x2="52" y2="55" stroke="#aaa" stroke-width="1"/>
  <line x1="40" y1="43" x2="40" y2="67" stroke="#aaa" stroke-width="1"/>
  <!-- LM393 comparator chip -->
  <rect x="68" y="40" width="28" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="82" y="52" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- Pins -->
  <rect x="18" y="4" width="74" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="24" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="39" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="54" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="69" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="44" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">DO</text>
  <text x="74" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">AO</text>
  <text x="55" y="83" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">MQ-2 Gas</text>
</svg>''')

# --- MQ135 ---
w('mq135-air.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 95" width="110" height="95">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="18" width="102" height="73" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <ellipse cx="40" cy="55" rx="22" ry="22" fill="#bbb" stroke="#999" stroke-width="2"/>
  <ellipse cx="40" cy="55" rx="17" ry="17" fill="#888" stroke="#777" stroke-width="1"/>
  <ellipse cx="40" cy="55" rx="12" ry="12" fill="#666"/>
  <line x1="28" y1="55" x2="52" y2="55" stroke="#aaa" stroke-width="1"/>
  <line x1="40" y1="43" x2="40" y2="67" stroke="#aaa" stroke-width="1"/>
  <rect x="68" y="40" width="28" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="82" y="52" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <rect x="18" y="4" width="74" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="24" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="39" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="54" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="69" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="44" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">DO</text>
  <text x="74" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">AO</text>
  <text x="55" y="83" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">MQ-135 Air</text>
</svg>''')

# --- MQ3 / MQ7 / MQ8 gas sensors (same style, different label) ---
for gid, glabel in [('mq3-gas','MQ-3 Alcohol'),('mq7-gas','MQ-7 CO'),('mq8-gas','MQ-8 H2')]:
    w(f'{gid}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 95" width="110" height="95">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="18" width="102" height="73" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <ellipse cx="40" cy="55" rx="22" ry="22" fill="#bbb" stroke="#999" stroke-width="2"/>
  <ellipse cx="40" cy="55" rx="17" ry="17" fill="#888" stroke="#777" stroke-width="1"/>
  <ellipse cx="40" cy="55" rx="12" ry="12" fill="#666"/>
  <line x1="28" y1="55" x2="52" y2="55" stroke="#aaa" stroke-width="1"/>
  <line x1="40" y1="43" x2="40" y2="67" stroke="#aaa" stroke-width="1"/>
  <rect x="68" y="40" width="28" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="82" y="52" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <rect x="18" y="4" width="74" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="24" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="39" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="54" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <rect x="69" y="6" width="10" height="12" fill="#bbb" rx="1"/>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="44" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">DO</text>
  <text x="74" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">AO</text>
  <text x="55" y="83" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">{glabel}</text>
</svg>''')

# --- Soil Moisture ---
w('soil-moisture.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 100" width="130" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Control board -->
  <rect x="55" y="4" width="70" height="55" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- LM393 chip -->
  <rect x="68" y="18" width="32" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="84" y="30" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED indicator -->
  <circle cx="113" cy="18" r="4" fill="#f44336"/>
  <!-- Pot trimmer -->
  <circle cx="113" cy="45" r="6" fill="#e0e0e0" stroke="#999" stroke-width="1.5"/>
  <!-- Sensor probe (forked) -->
  <rect x="4" y="10" width="40" height="60" rx="3" fill="#4caf50" stroke="#1b5e20" stroke-width="2"/>
  <line x1="15" y1="70" x2="15" y2="100" stroke="#c0c0c0" stroke-width="4"/>
  <line x1="29" y1="70" x2="29" y2="100" stroke="#c0c0c0" stroke-width="4"/>
  <text x="22" y="45" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial" transform="rotate(-90 22 45)">PROBE</text>
  <!-- Connector -->
  <rect x="60" y="54" width="42" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="63" y="56" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="74" y="56" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="85" y="56" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="96" y="56" width="8" height="8" fill="#bbb" rx="1"/>
  <text x="90" y="78" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">Soil Moisture</text>
</svg>''')

# --- Flame Sensor ---
w('flame-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90" width="110" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="14" width="102" height="72" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- IR phototransistor (black LED shape) -->
  <rect x="15" y="30" width="18" height="28" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <ellipse cx="24" cy="30" rx="9" ry="5" fill="#111" stroke="#333"/>
  <circle cx="24" cy="35" r="4" fill="#1a1a1a"/>
  <!-- LED indicator -->
  <circle cx="75" cy="30" r="5" fill="#f44336"/>
  <text x="75" y="43" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">LED</text>
  <!-- LM393 -->
  <rect x="55" y="40" width="32" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="71" y="52" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- Trimmer -->
  <circle cx="95" cy="55" r="6" fill="#e0e0e0" stroke="#999" stroke-width="1.5"/>
  <!-- Pins -->
  <rect x="20" y="4" width="70" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="24" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="38" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="52" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="66" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="43" y="3" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="57" y="3" text-anchor="middle" font-size="5" fill="#ddd">DO</text>
  <text x="71" y="3" text-anchor="middle" font-size="5" fill="#ddd">AO</text>
  <text x="55" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Flame Sensor</text>
</svg>''')

# --- Sound Sensor ---
w('sound-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90" width="110" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="14" width="102" height="72" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Microphone capsule -->
  <ellipse cx="28" cy="51" rx="16" ry="22" fill="#c8a800" stroke="#a07800" stroke-width="2"/>
  <ellipse cx="28" cy="51" rx="11" ry="16" fill="#b09800" stroke="#908000" stroke-width="1"/>
  <circle cx="28" cy="51" r="5" fill="#888"/>
  <!-- LM393 -->
  <rect x="55" y="35" width="32" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="71" y="47" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED -->
  <circle cx="92" cy="30" r="5" fill="#f44336"/>
  <!-- Trimmer -->
  <circle cx="92" cy="60" r="6" fill="#e0e0e0" stroke="#999" stroke-width="1.5"/>
  <!-- Pins -->
  <rect x="20" y="4" width="70" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="24" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="38" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="52" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="66" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd">AO</text>
  <text x="43" y="3" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="57" y="3" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="71" y="3" text-anchor="middle" font-size="5" fill="#ddd">DO</text>
  <text x="55" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Sound Sensor</text>
</svg>''')

# --- Water Level ---
w('water-level.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Control board -->
  <rect x="70" y="10" width="55" height="70" rx="4" fill="#e53935" stroke="#b71c1c" stroke-width="2" filter="url(#sh)"/>
  <!-- Connector -->
  <rect x="73" y="15" width="50" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="76" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="87" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="98" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <text x="80" y="13" text-anchor="middle" font-size="5" fill="#ddd">SIG</text>
  <text x="91" y="13" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="102" y="13" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <!-- Sensor board (flat PCB with traces) -->
  <rect x="4" y="15" width="55" height="65" rx="3" fill="#e53935" stroke="#b71c1c" stroke-width="2" filter="url(#sh)"/>
  <line x1="14" y1="20" x2="14" y2="80" stroke="#ffd700" stroke-width="2"/>
  <line x1="22" y1="20" x2="22" y2="80" stroke="#ffd700" stroke-width="2"/>
  <line x1="30" y1="20" x2="30" y2="80" stroke="#ffd700" stroke-width="2"/>
  <line x1="38" y1="20" x2="38" y2="80" stroke="#ffd700" stroke-width="2"/>
  <line x1="46" y1="20" x2="46" y2="80" stroke="#ffd700" stroke-width="2"/>
  <line x1="18" y1="25" x2="18" y2="75" stroke="#e53935" stroke-width="3"/>
  <line x1="26" y1="25" x2="26" y2="75" stroke="#e53935" stroke-width="3"/>
  <line x1="34" y1="25" x2="34" y2="75" stroke="#e53935" stroke-width="3"/>
  <line x1="42" y1="25" x2="42" y2="75" stroke="#e53935" stroke-width="3"/>
  <text x="97" y="82" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Water Level</text>
</svg>''')

# --- Rain Sensor ---
w('rain-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="70" y="10" width="55" height="70" rx="4" fill="#1976d2" stroke="#0d47a1" stroke-width="2" filter="url(#sh)"/>
  <rect x="73" y="15" width="50" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="76" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="87" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="98" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="109" y="17" width="8" height="8" fill="#bbb" rx="1"/>
  <text x="80" y="13" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="91" y="13" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="102" y="13" text-anchor="middle" font-size="5" fill="#ddd">AO</text>
  <text x="113" y="13" text-anchor="middle" font-size="5" fill="#ddd">DO</text>
  <!-- Rain sensor board -->
  <rect x="4" y="15" width="55" height="65" rx="3" fill="#1976d2" stroke="#0d47a1" stroke-width="2" filter="url(#sh)"/>
  <line x1="12" y1="20" x2="12" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="20" y1="20" x2="20" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="28" y1="20" x2="28" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="36" y1="20" x2="36" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="44" y1="20" x2="44" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="52" y1="20" x2="52" y2="80" stroke="#90CAF9" stroke-width="2"/>
  <line x1="16" y1="25" x2="16" y2="75" stroke="#1976d2" stroke-width="3"/>
  <line x1="24" y1="25" x2="24" y2="75" stroke="#1976d2" stroke-width="3"/>
  <line x1="32" y1="25" x2="32" y2="75" stroke="#1976d2" stroke-width="3"/>
  <line x1="40" y1="25" x2="40" y2="75" stroke="#1976d2" stroke-width="3"/>
  <line x1="48" y1="25" x2="48" y2="75" stroke="#1976d2" stroke-width="3"/>
  <text x="97" y="82" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Rain Sensor</text>
</svg>''')

# --- BME280 ---
w('bme280.svg', pcb_module('bme280','#6a1b9a','#4a148c',
    ['VCC','GND','SCL','SDA'],
    '''<rect x="42" y="32" width="46" height="32" rx="2" fill="#111" stroke="#333"/>
    <rect x="55" y="40" width="20" height="15" rx="1" fill="silver" stroke="#777"/>
    <circle cx="60" cy="45" r="2" fill="#333"/>
    <text x="65" y="55" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">BME280</text>''',
    'BME280 T/H/P'))

# --- BMP280 ---
w('bmp280.svg', pcb_module('bmp280','#6a1b9a','#4a148c',
    ['VCC','GND','SCL','SDA'],
    '''<rect x="42" y="32" width="46" height="32" rx="2" fill="#111" stroke="#333"/>
    <rect x="55" y="40" width="20" height="15" rx="1" fill="silver" stroke="#777"/>
    <text x="65" y="55" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">BMP280</text>''',
    'BMP280 Baro'))

# --- ADXL345 ---
w('adxl345.svg', pcb_module('adxl345','#006064','#004d40',
    ['VCC','GND','SCL','SDA','SDO','CS'],
    '''<rect x="30" y="32" width="70" height="32" rx="2" fill="#111" stroke="#333"/>
    <rect x="48" y="38" width="34" height="20" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="50" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">ADXL345</text>''',
    'ADXL345 Accel'))

# --- MAX30102 ---
w('max30102.svg', pcb_module('max30102','#6a1b9a','#4a148c',
    ['VIN','SCL','SDA','INT','IRD','RD','GND'],
    '''<rect x="38" y="32" width="54" height="34" rx="2" fill="#111" stroke="#333"/>
    <circle cx="65" cy="49" r="10" fill="#111" stroke="#333"/>
    <circle cx="65" cy="49" r="6" fill="#0d0d0d"/>
    <circle cx="62" cy="47" r="2" fill="#e53935" opacity="0.9"/>
    <circle cx="68" cy="51" r="2" fill="#e53935" opacity="0.9"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">MAX30102</text>''',
    'MAX30102 SpO2'))

# --- ACS712 ---
w('acs712.svg', pcb_module('acs712','#1b5e20','#0d4e14',
    ['VCC','OUT','GND'],
    '''<rect x="38" y="30" width="54" height="36" rx="2" fill="#111" stroke="#333"/>
    <rect x="46" y="36" width="38" height="24" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">ACS712</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">30A</text>''',
    'ACS712 Current'))

# --- HX711 ---
w('hx711.svg', pcb_module('hx711','#1b5e20','#0d4e14',
    ['VCC','DT','SCK','GND'],
    '''<rect x="38" y="30" width="54" height="36" rx="2" fill="#111" stroke="#333"/>
    <rect x="46" y="36" width="38" height="24" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">HX711</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">24-bit ADC</text>''',
    'HX711 Load Cell'))

# --- DS18B20 ---
w('ds18b20.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 80" width="90" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- TO-92 body -->
  <rect x="25" y="10" width="40" height="38" rx="3" fill="#111" stroke="#333" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Flat side -->
  <rect x="25" y="36" width="40" height="12" rx="0" fill="#1a1a1a"/>
  <!-- Three leads -->
  <line x1="35" y1="48" x2="35" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="45" y1="48" x2="45" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="55" y1="48" x2="55" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="35" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">GND</text>
  <text x="45" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">DQ</text>
  <text x="55" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">VCC</text>
  <!-- Marking -->
  <text x="45" y="28" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">DS18B20</text>
  <text x="45" y="38" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">1-Wire</text>
</svg>''')

# --- DS18B20 Waterproof ---
w('ds18b20-waterproof.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 80" width="130" height="80">
  <!-- Stainless probe -->
  <rect x="4" y="25" width="90" height="30" rx="2" fill="#c0c0c0" stroke="#999" stroke-width="2"/>
  <ellipse cx="94" cy="40" rx="8" ry="15" fill="#b0b0b0" stroke="#999" stroke-width="1.5"/>
  <line x1="4" y1="35" x2="94" y2="35" stroke="#aaa" stroke-width="1"/>
  <line x1="4" y1="45" x2="94" y2="45" stroke="#aaa" stroke-width="1"/>
  <!-- Cable -->
  <rect x="4" y="35" width="4" height="10" rx="2" fill="#222"/>
  <!-- Wires -->
  <line x1="0" y1="36" x2="15" y2="36" stroke="#e53935" stroke-width="3"/>
  <line x1="0" y1="40" x2="15" y2="40" stroke="#ffff00" stroke-width="3"/>
  <line x1="0" y1="44" x2="15" y2="44" stroke="#333" stroke-width="3"/>
  <text x="3" y="25" font-size="5" fill="#555" font-family="Arial">VCC</text>
  <text x="3" y="52" font-size="5" fill="#555" font-family="Arial">DQ</text>
  <text x="3" y="60" font-size="5" fill="#555" font-family="Arial">GND</text>
  <text x="48" y="43" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">DS18B20 Probe</text>
</svg>''')

# --- VL53L0X ---
w('vl53l0x.svg', pcb_module('vl53l0x','#7b1fa2','#4a148c',
    ['VCC','GND','SCL','SDA','XSHUT','GPIO1'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="50" y="35" width="30" height="24" rx="1" fill="silver" stroke="#777"/>
    <circle cx="65" cy="47" r="8" fill="#111" stroke="#555"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">VL53L0X</text>''',
    'VL53L0X ToF'))

# --- MLX90614 ---
w('mlx90614.svg', pcb_module('mlx90614','#7b1fa2','#4a148c',
    ['VIN','GND','SCL','SDA'],
    '''<rect x="38" y="28" width="54" height="38" rx="2" fill="#111" stroke="#333"/>
    <ellipse cx="65" cy="47" rx="16" ry="14" fill="#1a1a1a" stroke="#444"/>
    <circle cx="65" cy="47" r="8" fill="#0d0d0d"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">MLX90614</text>''',
    'MLX90614 IR Temp'))

# --- INA219 ---
w('ina219.svg', pcb_module('ina219','#e65100','#bf360c',
    ['VCC','GND','SCL','SDA'],
    '''<rect x="38" y="28" width="54" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="46" y="35" width="38" height="24" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">INA219</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">I/V Monitor</text>''',
    'INA219 Power'))

# --- BH1750 ---
w('bh1750.svg', pcb_module('bh1750','#e65100','#bf360c',
    ['VCC','GND','SCL','SDA','ADDR'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="50" y="35" width="30" height="24" rx="1" fill="#1a1a1a" stroke="#444"/>
    <rect x="55" y="38" width="20" height="15" rx="1" fill="silver" stroke="#888"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">BH1750</text>''',
    'BH1750 Lux'))

# --- TSL2561 ---
w('tsl2561.svg', pcb_module('tsl2561','#e65100','#bf360c',
    ['VCC','GND','SCL','SDA','INT'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="48" y="35" width="34" height="24" rx="1" fill="#1a1a1a" stroke="#444"/>
    <rect x="52" y="38" width="26" height="14" rx="1" fill="#222" stroke="#888"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">TSL2561</text>''',
    'TSL2561 Lux'))

# --- HMC5883L ---
w('hmc5883l.svg', pcb_module('hmc5883l','#006064','#004d40',
    ['VCC','GND','SCL','SDA','DRDY'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="48" y="35" width="34" height="24" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">HMC5883L</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Compass</text>''',
    'HMC5883L Compass'))

# --- MAX6675 ---
w('max6675.svg', pcb_module('max6675','#e65100','#bf360c',
    ['VCC','GND','SCK','CS','SO'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="46" y="35" width="38" height="24" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">MAX6675</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Thermocouple</text>''',
    'MAX6675 K-Type'))

# --- PZEM-004T ---
w('pzem-004t.svg', pcb_module('pzem-004t','#e65100','#bf360c',
    ['5V','RX','TX','GND'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="40" y="32" width="50" height="30" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="47" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">PZEM-004T</text>
    <text x="65" y="56" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">AC Power Monitor</text>''',
    'PZEM-004T'))

# --- Rotary Encoder ---
w('rotary-encoder.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="10" y="35" width="80" height="55" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Encoder body -->
  <rect x="30" y="20" width="40" height="40" rx="3" fill="#555" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Rotating shaft -->
  <circle cx="50" cy="40" r="14" fill="#888" stroke="#666" stroke-width="2"/>
  <circle cx="50" cy="40" r="8" fill="#777" stroke="#555" stroke-width="1"/>
  <rect x="47" y="28" width="6" height="26" rx="2" fill="#999" stroke="#777"/>
  <!-- Pins 5 -->
  <rect x="15" y="82" width="72" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="18" y="84" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="29" y="84" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="40" y="84" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="51" y="84" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="62" y="84" width="9" height="8" fill="#bbb" rx="1"/>
  <text x="22" y="80" text-anchor="middle" font-size="5" fill="#ddd">CLK</text>
  <text x="33" y="80" text-anchor="middle" font-size="5" fill="#ddd">DT</text>
  <text x="44" y="80" text-anchor="middle" font-size="5" fill="#ddd">SW</text>
  <text x="55" y="80" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="66" y="80" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="50" y="98" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">KY-040 Encoder</text>
</svg>''')

# --- Hall Effect ---
w('hall-effect.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- TO-92 body -->
  <rect x="20" y="10" width="40" height="38" rx="3" fill="#111" stroke="#333" stroke-width="1.5" filter="url(#sh)"/>
  <rect x="20" y="36" width="40" height="12" rx="0" fill="#1a1a1a"/>
  <!-- Three leads -->
  <line x1="30" y1="48" x2="30" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="40" y1="48" x2="40" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="50" y1="48" x2="50" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">VCC</text>
  <text x="40" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">GND</text>
  <text x="50" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">OUT</text>
  <text x="40" y="28" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">A3144</text>
  <text x="40" y="38" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Hall</text>
</svg>''')

# --- Vibration Sensor ---
w('vibration-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90" width="110" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="14" width="102" height="72" rx="4" fill="#0097a7" stroke="#006064" stroke-width="2" filter="url(#sh)"/>
  <!-- SW-420 sensor (cylindrical) -->
  <rect x="15" y="28" width="30" height="44" rx="15" fill="#c0c0c0" stroke="#999" stroke-width="2" filter="url(#sh)"/>
  <rect x="20" y="35" width="20" height="30" rx="10" fill="#aaa"/>
  <text x="30" y="53" text-anchor="middle" font-size="5" fill="#555" font-family="monospace">SW-420</text>
  <!-- LM393 -->
  <rect x="58" y="32" width="36" height="25" rx="1" fill="#111" stroke="#333"/>
  <text x="76" y="46" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED -->
  <circle cx="85" cy="65" r="5" fill="#f44336"/>
  <!-- Trimmer -->
  <circle cx="65" cy="65" r="6" fill="#e0e0e0" stroke="#999" stroke-width="1.5"/>
  <!-- Pins -->
  <rect x="22" y="4" width="68" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="26" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="40" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="54" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <text x="31" y="3" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="45" y="3" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5" fill="#ddd">DO</text>
  <text x="55" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">SW-420</text>
</svg>''')

# --- UV Sensor ---
w('uv-sensor.svg', pcb_module('uv-sensor','#6a1b9a','#4a148c',
    ['VCC','GND','OUT'],
    '''<rect x="38" y="28" width="54" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="50" y="35" width="30" height="24" rx="1" fill="silver" stroke="#777"/>
    <circle cx="65" cy="47" r="7" fill="#ce93d8" opacity="0.8"/>
    <text x="65" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">GUVA-S12SD</text>''',
    'UV Sensor'))

# --- Tilt Sensor ---
w('tilt-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Metal tube body -->
  <rect x="28" y="15" width="24" height="42" rx="12" fill="#c0c0c0" stroke="#999" stroke-width="2" filter="url(#sh)"/>
  <!-- Metal ball inside -->
  <circle cx="40" cy="45" r="8" fill="#888" stroke="#666" stroke-width="1.5"/>
  <!-- Two leads -->
  <line x1="35" y1="57" x2="35" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="45" y1="57" x2="45" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="35" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">A</text>
  <text x="45" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">B</text>
  <text x="40" y="12" text-anchor="middle" font-size="8" font-weight="bold" fill="#333" font-family="Arial">TILT</text>
</svg>''')

# --- Touch Sensor ---
w('touch-sensor.svg', pcb_module('touch-sensor','#b71c1c','#7f0000',
    ['VCC','GND','SIG'],
    '''<rect x="38" y="28" width="54" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="48" y="33" width="34" height="28" rx="3" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
    <circle cx="65" cy="47" r="10" fill="#fff" stroke="#ddd" stroke-width="1.5"/>
    <text x="65" y="51" text-anchor="middle" font-size="7" fill="#e53935" font-family="Arial">TTP223</text>''',
    'Capacitive Touch'))

# --- Flex Sensor ---
w('flex-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120" width="60" height="120">
  <!-- Flexible strip -->
  <rect x="15" y="5" width="30" height="90" rx="4" fill="#f5f5dc" stroke="#c0a060" stroke-width="2"/>
  <!-- Carbon lines -->
  <line x1="22" y1="12" x2="22" y2="88" stroke="#555" stroke-width="2"/>
  <line x1="29" y1="12" x2="29" y2="88" stroke="#555" stroke-width="2"/>
  <line x1="36" y1="12" x2="36" y2="88" stroke="#555" stroke-width="2"/>
  <line x1="43" y1="12" x2="43" y2="88" stroke="#555" stroke-width="2"/>
  <!-- Connector at top -->
  <rect x="14" y="4" width="32" height="12" rx="2" fill="#c0a060" stroke="#a08040" stroke-width="1.5"/>
  <!-- Leads -->
  <line x1="25" y1="95" x2="25" y2="120" stroke="#bbb" stroke-width="3"/>
  <line x1="35" y1="95" x2="35" y2="120" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="9" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">FLEX</text>
</svg>''')

# --- Force Sensor (FSR) ---
w('force-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" width="80" height="110">
  <!-- Sensing pad (circle) -->
  <circle cx="40" cy="38" r="33" fill="#f5f5dc" stroke="#c0a060" stroke-width="2"/>
  <circle cx="40" cy="38" r="26" fill="none" stroke="#a08040" stroke-width="1"/>
  <circle cx="40" cy="38" r="18" fill="none" stroke="#a08040" stroke-width="1"/>
  <circle cx="40" cy="38" r="10" fill="none" stroke="#a08040" stroke-width="1"/>
  <!-- Tail -->
  <rect x="34" y="64" width="12" height="30" rx="2" fill="#f5f5dc" stroke="#c0a060" stroke-width="1.5"/>
  <!-- Leads -->
  <line x1="37" y1="94" x2="37" y2="110" stroke="#bbb" stroke-width="3"/>
  <line x1="43" y1="94" x2="43" y2="110" stroke="#bbb" stroke-width="3"/>
  <text x="40" y="42" text-anchor="middle" font-size="7" fill="#555" font-family="Arial" font-weight="bold">FSR</text>
</svg>''')

# --- Fingerprint Sensor ---
w('fingerprint-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="100" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Module body -->
  <rect x="10" y="4" width="80" height="90" rx="6" fill="#212121" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- Sensing window -->
  <rect x="20" y="14" width="60" height="60" rx="4" fill="#1a237e" stroke="#3949ab" stroke-width="2"/>
  <!-- Fingerprint lines -->
  <path d="M40,30 A10,10 0 1,1 60,30" stroke="#5c6bc0" stroke-width="2" fill="none"/>
  <path d="M36,35 A14,14 0 1,1 64,35" stroke="#5c6bc0" stroke-width="1.5" fill="none"/>
  <path d="M32,40 A18,18 0 1,1 68,40" stroke="#5c6bc0" stroke-width="1.5" fill="none"/>
  <path d="M28,45 A22,22 0 1,1 72,45" stroke="#3f51b5" stroke-width="1" fill="none"/>
  <path d="M25,52 A25,25 0 1,1 75,52" stroke="#3f51b5" stroke-width="1" fill="none"/>
  <!-- 4 pin connector -->
  <rect x="25" y="88" width="50" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="29" y="90" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="41" y="90" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="53" y="90" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="65" y="90" width="9" height="8" fill="#bbb" rx="1"/>
  <text x="33" y="88" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="45" y="88" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="57" y="88" text-anchor="middle" font-size="5" fill="#ddd">TX</text>
  <text x="69" y="88" text-anchor="middle" font-size="5" fill="#ddd">RX</text>
  <text x="50" y="105" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Fingerprint R307</text>
</svg>''')

# --- IR Sensor ---
w('ir-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90" width="110" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="14" width="102" height="72" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- IR emitter (clear) -->
  <rect x="14" y="26" width="14" height="22" rx="2" fill="#cce8ff" stroke="#90CAF9" stroke-width="1.5"/>
  <ellipse cx="21" cy="26" rx="7" ry="4" fill="#cce8ff" stroke="#90CAF9" stroke-width="1"/>
  <!-- IR detector (darker) -->
  <rect x="36" y="26" width="14" height="22" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <ellipse cx="43" cy="26" rx="7" ry="4" fill="#111" stroke="#333" stroke-width="1"/>
  <!-- LM393 -->
  <rect x="60" y="30" width="34" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="77" y="42" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED + Trimmer -->
  <circle cx="90" cy="60" r="5" fill="#f44336"/>
  <circle cx="70" cy="60" r="6" fill="#e0e0e0" stroke="#999" stroke-width="1.5"/>
  <!-- Pins -->
  <rect x="24" y="4" width="62" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="27" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="42" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <rect x="57" y="6" width="10" height="8" fill="#bbb" rx="1"/>
  <text x="32" y="3" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="47" y="3" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="62" y="3" text-anchor="middle" font-size="5" fill="#ddd">OUT</text>
  <text x="55" y="81" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">IR Obstacle</text>
</svg>''')

# --- IR Receiver ---
w('ir-receiver.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- TSOP1838 body (TO-92 like) -->
  <rect x="18" y="20" width="44" height="44" rx="4" fill="#111" stroke="#333" stroke-width="1.5" filter="url(#sh)"/>
  <rect x="18" y="48" width="44" height="16" rx="0" fill="#1a1a1a"/>
  <!-- Dome window -->
  <ellipse cx="40" cy="34" rx="16" ry="14" fill="#111" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="40" cy="34" rx="10" ry="9" fill="#0d0d0d"/>
  <!-- Three leads -->
  <line x1="30" y1="64" x2="30" y2="88" stroke="#bbb" stroke-width="3"/>
  <line x1="40" y1="64" x2="40" y2="88" stroke="#bbb" stroke-width="3"/>
  <line x1="50" y1="64" x2="50" y2="88" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">OUT</text>
  <text x="40" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">GND</text>
  <text x="50" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">VCC</text>
  <text x="40" y="14" text-anchor="middle" font-size="7" font-weight="bold" fill="#777" font-family="Arial">TSOP1838</text>
</svg>''')

# --- IR Transmitter ---
w('ir-transmitter.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 80" width="70" height="80">
  <!-- LED body -->
  <rect x="22" y="20" width="26" height="36" rx="3" fill="#cce8ff" stroke="#90CAF9" stroke-width="2"/>
  <ellipse cx="35" cy="20" rx="13" ry="7" fill="#cce8ff" stroke="#90CAF9" stroke-width="2"/>
  <!-- Leads -->
  <line x1="30" y1="56" x2="30" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="40" y1="56" x2="40" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">A</text>
  <text x="40" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">K</text>
  <!-- IR rays -->
  <line x1="35" y1="10" x2="25" y2="2" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="35" y1="8" x2="35" y2="0" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="35" y1="10" x2="45" y2="2" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <text x="35" y="70" text-anchor="middle" font-size="6" fill="#555" font-family="Arial">IR LED</text>
</svg>''')

# --- TCS3200 Color Sensor ---
w('tcs3200.svg', pcb_module('tcs3200','#1b5e20','#0d4e14',
    ['VCC','GND','S0','S1','S2','S3','OUT','OE'],
    '''<rect x="15" y="28" width="100" height="38" rx="2" fill="#111" stroke="#333"/>
    <!-- 4 white LEDs -->
    <circle cx="30" cy="40" r="6" fill="white" stroke="#ccc"/>
    <circle cx="50" cy="40" r="6" fill="white" stroke="#ccc"/>
    <circle cx="70" cy="40" r="6" fill="white" stroke="#ccc"/>
    <circle cx="90" cy="40" r="6" fill="white" stroke="#ccc"/>
    <!-- Color sensor chip in center -->
    <rect x="50" y="50" width="30" height="12" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="57" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">TCS3200</text>''',
    'TCS3200 Color', w_=140))

# --- Voltage Sensor ---
w('voltage-sensor.svg', pcb_module('voltage-sensor','#1b5e20','#0d4e14',
    ['SIG','VCC','GND'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <!-- Voltage divider resistors drawn on top -->
    <rect x="40" y="34" width="12" height="26" rx="1" fill="#8B6914"/>
    <text x="46" y="48" text-anchor="middle" font-size="4" fill="#ddd" transform="rotate(-90 46 48)">30K</text>
    <rect x="65" y="34" width="12" height="26" rx="1" fill="#8B6914"/>
    <text x="71" y="48" text-anchor="middle" font-size="4" fill="#ddd" transform="rotate(-90 71 48)">7.5K</text>''',
    'Voltage Sensor 0-25V'))

# --- TMP sensor (KY-038 sound) ---
w('ky-038.svg', pcb_module('ky-038','#1b5e20','#0d4e14',
    ['AO','GND','VCC','DO'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <!-- Microphone -->
    <ellipse cx="55" cy="47" rx="14" ry="18" fill="#c8a800" stroke="#a07800" stroke-width="2"/>
    <ellipse cx="55" cy="47" rx="9" ry="12" fill="#b09800"/>
    <circle cx="55" cy="47" r="5" fill="#888"/>
    <text x="88" y="47" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">LM393</text>''',
    'KY-038 Sound'))

# --- CNY70 ---
w('cny70.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 70" width="80" height="70">
  <!-- CNY70 body (DIP package) -->
  <rect x="15" y="12" width="50" height="36" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <!-- Marking dot -->
  <circle cx="20" cy="17" r="3" fill="#555"/>
  <!-- Window/lens area -->
  <rect x="22" y="18" width="36" height="24" rx="1" fill="#1a1a1a" stroke="#444"/>
  <circle cx="34" cy="30" r="7" fill="#222" stroke="#555"/>
  <circle cx="46" cy="30" r="7" fill="#222" stroke="#555"/>
  <!-- 4 leads -->
  <line x1="23" y1="48" x2="23" y2="68" stroke="#bbb" stroke-width="2"/>
  <line x1="33" y1="48" x2="33" y2="68" stroke="#bbb" stroke-width="2"/>
  <line x1="47" y1="48" x2="47" y2="68" stroke="#bbb" stroke-width="2"/>
  <line x1="57" y1="48" x2="57" y2="68" stroke="#bbb" stroke-width="2"/>
  <text x="23" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">A</text>
  <text x="33" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">K</text>
  <text x="47" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">C</text>
  <text x="57" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">E</text>
  <text x="40" y="10" text-anchor="middle" font-size="7" font-weight="bold" fill="#777" font-family="Arial">CNY70</text>
</svg>''')

# --- pH Sensor ---
w('ph-sensor.svg', pcb_module('ph-sensor','#01579b','#003d6b',
    ['V+','G','G','Po','Do','To'],
    '''<rect x="20" y="28" width="90" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="28" y="34" width="74" height="26" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">pH 0-14</text>''',
    'pH Sensor Module'))

# --- Turbidity Sensor ---
w('turbidity-sensor.svg', pcb_module('turbidity-sensor','#01579b','#003d6b',
    ['VCC','GND','AOUT','DOUT'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <!-- Probe icon -->
    <rect x="40" y="32" width="14" height="30" rx="7" fill="#555" stroke="#333" stroke-width="1.5"/>
    <text x="80" y="47" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">Turbidity</text>''',
    'Turbidity'))

# --- LCD 16x2 ---
w('lcd-16x2.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 85" width="190" height="85">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="4" width="186" height="77" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- LCD screen -->
  <rect x="12" y="14" width="164" height="52" rx="3" fill="#4db6ac" stroke="#004d40" stroke-width="2"/>
  <!-- Character cells - Row 1 -->
  <text x="18" y="34" font-family="Courier New" font-size="11" fill="#004d40">HELLO WORLD!</text>
  <!-- Character cells - Row 2 -->
  <text x="18" y="54" font-family="Courier New" font-size="11" fill="#004d40">TinkerAI...</text>
  <!-- 16-pin header -->
  <rect x="4" y="70" width="178" height="12" rx="1" fill="#1a1a1a"/>
  <text x="96" y="82" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">16x2 LCD I2C / Parallel</text>
</svg>''')

# --- OLED ---
w('oled-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 80" width="90" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="4" width="86" height="72" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Display area -->
  <rect x="8" y="14" width="74" height="42" rx="2" fill="#001f3f" stroke="#1565C0" stroke-width="1.5"/>
  <!-- Display content -->
  <text x="45" y="32" text-anchor="middle" font-family="Courier New" font-size="8" fill="#1565C0">Hello</text>
  <text x="45" y="46" text-anchor="middle" font-family="Courier New" font-size="7" fill="#0d47a1">TinkerAI</text>
  <!-- 4 pin header -->
  <rect x="25" y="60" width="40" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="28" y="62" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="38" y="62" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="48" y="62" width="8" height="8" fill="#bbb" rx="1"/>
  <rect x="58" y="62" width="8" height="8" fill="#bbb" rx="1"/>
  <text x="32" y="60" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="42" y="60" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="52" y="60" text-anchor="middle" font-size="5" fill="#ddd">SCL</text>
  <text x="62" y="60" text-anchor="middle" font-size="5" fill="#ddd">SDA</text>
  <text x="45" y="76" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">OLED 0.96"</text>
</svg>''')

# --- LED Red/Green/Blue/Yellow/White/IR ---
for led_id, fill, rim, glow in [
    ('led-red','#f44336','#b71c1c','#ef9a9a'),
    ('led-green','#4caf50','#1b5e20','#a5d6a7'),
    ('led-blue','#2196f3','#0d47a1','#90caf9'),
    ('led-yellow','#ffeb3b','#f57f17','#fff176'),
    ('led-white','#f5f5f5','#bdbdbd','#ffffff'),
    ('led-ir','#6a1b9a','#4a148c','#ce93d8'),
]:
    w(f'{led_id}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" width="60" height="80">
  <!-- LED body -->
  <rect x="18" y="28" width="24" height="30" rx="3" fill="{fill}" stroke="{rim}" stroke-width="2"/>
  <!-- LED dome -->
  <ellipse cx="30" cy="28" rx="12" ry="8" fill="{glow}" stroke="{rim}" stroke-width="2"/>
  <!-- glow -->
  <ellipse cx="30" cy="28" rx="8" ry="5" fill="{glow}" opacity="0.6"/>
  <!-- Leads -->
  <line x1="25" y1="58" x2="25" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="35" y1="58" x2="35" y2="78" stroke="#bbb" stroke-width="3"/>
  <!-- Flat edge mark on anode -->
  <line x1="18" y1="52" x2="18" y2="58" stroke="{rim}" stroke-width="2"/>
  <text x="25" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">A</text>
  <text x="35" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">K</text>
</svg>''')

# --- RGB LED ---
w('rgb-led.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="70" height="90">
  <!-- LED body -->
  <rect x="15" y="30" width="40" height="36" rx="3"
    fill="url(#rg)" stroke="#555" stroke-width="2"/>
  <defs>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f44336"/>
      <stop offset="50%" stop-color="#4caf50"/>
      <stop offset="100%" stop-color="#2196f3"/>
    </linearGradient>
  </defs>
  <!-- Dome -->
  <ellipse cx="35" cy="30" rx="20" ry="10" fill="#fff" opacity="0.6" stroke="#aaa" stroke-width="1.5"/>
  <!-- 4 leads -->
  <line x1="22" y1="66" x2="22" y2="88" stroke="#bbb" stroke-width="2"/>
  <line x1="30" y1="66" x2="30" y2="88" stroke="#bbb" stroke-width="2"/>
  <line x1="40" y1="66" x2="40" y2="88" stroke="#bbb" stroke-width="2"/>
  <line x1="48" y1="66" x2="48" y2="88" stroke="#bbb" stroke-width="2"/>
  <text x="22" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">R</text>
  <text x="30" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">K</text>
  <text x="40" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">G</text>
  <text x="48" y="90" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">B</text>
  <text x="35" y="20" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">RGB LED</text>
</svg>''')

# --- Resistor ---
w('resistor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
  <!-- Leads -->
  <line x1="0" y1="25" x2="25" y2="25" stroke="#bbb" stroke-width="3"/>
  <line x1="95" y1="25" x2="120" y2="25" stroke="#bbb" stroke-width="3"/>
  <!-- Body -->
  <rect x="24" y="14" width="72" height="22" rx="5" fill="#c8a800" stroke="#a07800" stroke-width="2"/>
  <!-- Color bands (220Ω = red red black black brown) -->
  <rect x="34" y="14" width="6" height="22" fill="#e53935"/>
  <rect x="44" y="14" width="6" height="22" fill="#e53935"/>
  <rect x="54" y="14" width="6" height="22" fill="#111"/>
  <rect x="64" y="14" width="6" height="22" fill="#111"/>
  <rect x="80" y="14" width="6" height="22" fill="#795548"/>
  <text x="60" y="45" text-anchor="middle" font-size="8" fill="#555" font-family="Arial">Resistor</text>
</svg>''')

# --- Capacitor ceramic ---
w('cap-ceramic.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <!-- Disc body -->
  <ellipse cx="40" cy="30" rx="22" ry="20" fill="#f5c542" stroke="#d4a017" stroke-width="2"/>
  <text x="40" y="33" text-anchor="middle" font-size="8" fill="#6b4700" font-family="Arial">100nF</text>
  <!-- Leads -->
  <line x1="32" y1="50" x2="32" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="48" y1="50" x2="48" y2="78" stroke="#bbb" stroke-width="3"/>
</svg>''')

# --- Electrolytic Capacitor ---
w('cap-electrolytic.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="70" height="90">
  <!-- Cylinder body -->
  <rect x="18" y="15" width="34" height="52" rx="4" fill="#111" stroke="#333" stroke-width="2"/>
  <ellipse cx="35" cy="15" rx="17" ry="6" fill="#333" stroke="#444"/>
  <!-- Stripe (negative mark) -->
  <rect x="18" y="15" width="12" height="52" rx="4" fill="#1a1a1a"/>
  <text x="14" y="44" font-size="7" fill="#fff" font-family="Arial">-</text>
  <text x="28" y="44" font-size="7" fill="#fff" font-family="Arial">+</text>
  <!-- Leads -->
  <line x1="28" y1="67" x2="28" y2="88" stroke="#bbb" stroke-width="3"/>
  <line x1="42" y1="67" x2="42" y2="88" stroke="#bbb" stroke-width="3"/>
  <text x="35" y="12" text-anchor="middle" font-size="6" fill="#aaa" font-family="Arial">100µF</text>
</svg>''')

# --- Potentiometer ---
w('potentiometer.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 80" width="90" height="80">
  <!-- Body -->
  <rect x="15" y="15" width="60" height="50" rx="4" fill="#444" stroke="#222" stroke-width="2"/>
  <!-- Knob shaft -->
  <circle cx="45" cy="40" r="18" fill="#666" stroke="#444" stroke-width="2"/>
  <circle cx="45" cy="40" r="12" fill="#555" stroke="#333" stroke-width="1.5"/>
  <line x1="45" y1="28" x2="45" y2="38" stroke="#bbb" stroke-width="2"/>
  <!-- 3 leads at bottom -->
  <line x1="28" y1="65" x2="28" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="45" y1="65" x2="45" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="62" y1="65" x2="62" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="28" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">1</text>
  <text x="45" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">W</text>
  <text x="62" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">2</text>
  <text x="45" y="10" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">Pot 10kΩ</text>
</svg>''')

# --- Inductor ---
w('inductor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
  <line x1="0" y1="25" x2="20" y2="25" stroke="#bbb" stroke-width="3"/>
  <line x1="100" y1="25" x2="120" y2="25" stroke="#bbb" stroke-width="3"/>
  <!-- Coil loops -->
  <path d="M20,25 A8,10 0 0,1 36,25 A8,10 0 0,1 52,25 A8,10 0 0,1 68,25 A8,10 0 0,1 84,25 A8,10 0 0,1 100,25" stroke="#c8a800" stroke-width="3" fill="none"/>
  <text x="60" y="45" text-anchor="middle" font-size="8" fill="#555" font-family="Arial">Inductor 10µH</text>
</svg>''')

# --- Diode ---
w('diode.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="100" height="50">
  <!-- Leads -->
  <line x1="0" y1="25" x2="32" y2="25" stroke="#bbb" stroke-width="3"/>
  <line x1="68" y1="25" x2="100" y2="25" stroke="#bbb" stroke-width="3"/>
  <!-- Glass body -->
  <rect x="28" y="12" width="44" height="26" rx="5" fill="#e8e8e8" stroke="#aaa" stroke-width="2"/>
  <!-- Cathode band -->
  <rect x="58" y="12" width="10" height="26" rx="3" fill="#555"/>
  <!-- Triangle -->
  <polygon points="35,14 35,36 58,25" fill="#888" stroke="#666" stroke-width="1"/>
  <line x1="58" y1="14" x2="58" y2="36" stroke="#333" stroke-width="2.5"/>
  <text x="50" y="48" text-anchor="middle" font-size="7" fill="#555" font-family="Arial">1N4007</text>
</svg>''')

# --- Transistor ---
w('transistor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
  <!-- TO-92 body -->
  <rect x="20" y="12" width="40" height="40" rx="4" fill="#111" stroke="#333" stroke-width="1.5"/>
  <rect x="20" y="38" width="40" height="14" rx="0" fill="#1a1a1a"/>
  <!-- Leads -->
  <line x1="30" y1="52" x2="30" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="40" y1="52" x2="40" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="50" y1="52" x2="50" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">B</text>
  <text x="40" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">C</text>
  <text x="50" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">E</text>
  <text x="40" y="30" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">2N2222</text>
  <text x="40" y="40" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">NPN</text>
  <text x="40" y="8" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">Transistor</text>
</svg>''')

# --- L298N ---
w('l298n.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="4" width="152" height="112" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- L298N chip -->
  <rect x="45" y="24" width="70" height="55" rx="2" fill="#111" stroke="#333" stroke-width="2"/>
  <text x="80" y="50" text-anchor="middle" font-size="9" fill="#888" font-family="monospace">L298N</text>
  <text x="80" y="62" text-anchor="middle" font-size="6" fill="#666" font-family="monospace">H-Bridge</text>
  <!-- Heatsink -->
  <rect x="55" y="15" width="50" height="12" rx="1" fill="#888" stroke="#666"/>
  <line x1="65" y1="15" x2="65" y2="27" stroke="#aaa" stroke-width="1.5"/>
  <line x1="75" y1="15" x2="75" y2="27" stroke="#aaa" stroke-width="1.5"/>
  <line x1="85" y1="15" x2="85" y2="27" stroke="#aaa" stroke-width="1.5"/>
  <line x1="95" y1="15" x2="95" y2="27" stroke="#aaa" stroke-width="1.5"/>
  <!-- Terminal blocks -->
  <rect x="8" y="30" width="28" height="60" rx="2" fill="#333" stroke="#222"/>
  <rect x="124" y="30" width="28" height="60" rx="2" fill="#333" stroke="#222"/>
  <!-- Screw heads -->
  <circle cx="22" cy="42" r="5" fill="#888" stroke="#666"/><line x1="18" y1="42" x2="26" y2="42" stroke="#555" stroke-width="1"/>
  <circle cx="22" cy="56" r="5" fill="#888" stroke="#666"/><line x1="18" y1="56" x2="26" y2="56" stroke="#555" stroke-width="1"/>
  <circle cx="22" cy="70" r="5" fill="#888" stroke="#666"/><line x1="18" y1="70" x2="26" y2="70" stroke="#555" stroke-width="1"/>
  <circle cx="138" cy="42" r="5" fill="#888" stroke="#666"/><line x1="134" y1="42" x2="142" y2="42" stroke="#555" stroke-width="1"/>
  <circle cx="138" cy="56" r="5" fill="#888" stroke="#666"/><line x1="134" y1="56" x2="142" y2="56" stroke="#555" stroke-width="1"/>
  <circle cx="138" cy="70" r="5" fill="#888" stroke="#666"/><line x1="134" y1="70" x2="142" y2="70" stroke="#555" stroke-width="1"/>
  <!-- Enable jumpers / 5V regulator -->
  <rect x="58" y="88" width="20" height="14" rx="1" fill="#e53935"/>
  <rect x="85" y="88" width="20" height="14" rx="1" fill="#e53935"/>
  <!-- Pin header -->
  <rect x="44" y="96" width="72" height="12" rx="1" fill="#1a1a1a"/>
  <text x="80" y="115" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">L298N Motor Driver</text>
</svg>''')

# --- Motor Driver (generic) ---
w('motor-driver.svg', pcb_module('motor-driver','#1b5e20','#0d4e14',
    ['VCC','GND','IN1','IN2','IN3','IN4'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="38" y="34" width="54" height="26" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="49" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">Motor Driver</text>''',
    'Motor Driver'))

# --- Servo ---
w('servo.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Servo body -->
  <rect x="4" y="20" width="92" height="56" rx="5" fill="#555" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Output gear -->
  <circle cx="30" cy="24" r="12" fill="#888" stroke="#666" stroke-width="2"/>
  <circle cx="30" cy="24" r="6" fill="#666"/>
  <!-- Mounting tabs -->
  <rect x="0" y="28" width="8" height="24" rx="2" fill="#444" stroke="#333"/>
  <circle cx="4" cy="40" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <rect x="92" y="28" width="8" height="24" rx="2" fill="#444" stroke="#333"/>
  <circle cx="96" cy="40" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <!-- 3-wire connector -->
  <rect x="58" y="10" width="30" height="12" rx="2" fill="#1a1a1a"/>
  <rect x="61" y="12" width="7" height="8" fill="#f44336" rx="1"/>
  <rect x="71" y="12" width="7" height="8" fill="#e53935" rx="1"/>
  <rect x="81" y="12" width="7" height="8" fill="#111" rx="1"/>
  <text x="64" y="8" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="74" y="8" text-anchor="middle" font-size="5" fill="#ddd">SIG</text>
  <text x="84" y="8" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="65" y="60" font-size="7" font-weight="bold" fill="white" font-family="Arial">SG90 Servo</text>
</svg>''')

# --- Stepper Motor ---
w('stepper.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Motor body -->
  <rect x="10" y="15" width="80" height="70" rx="5" fill="#444" stroke="#222" stroke-width="3" filter="url(#sh)"/>
  <!-- Shaft -->
  <rect x="45" y="4" width="10" height="18" rx="3" fill="#888" stroke="#666" stroke-width="2"/>
  <!-- Wires -->
  <rect x="12" y="72" width="76" height="10" rx="2" fill="#222"/>
  <line x1="20" y1="82" x2="20" y2="98" stroke="#f44336" stroke-width="3"/>
  <line x1="31" y1="82" x2="31" y2="98" stroke="#ff9800" stroke-width="3"/>
  <line x1="42" y1="82" x2="42" y2="98" stroke="#ffd700" stroke-width="3"/>
  <line x1="53" y1="82" x2="53" y2="98" stroke="#111" stroke-width="3"/>
  <text x="50" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#aaa" font-family="Arial">STEP</text>
  <text x="50" y="63" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">28BYJ-48</text>
</svg>''')

# --- Relay Module ---
w('relay-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="4" y="4" width="112" height="82" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Relay coil body -->
  <rect x="14" y="18" width="45" height="42" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <text x="37" y="42" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">RELAY</text>
  <text x="37" y="52" text-anchor="middle" font-size="6" fill="#666" font-family="monospace">5V</text>
  <!-- LED indicator -->
  <circle cx="75" cy="30" r="6" fill="#f44336"/>
  <!-- Screw terminal (AC side) -->
  <rect x="68" y="42" width="42" height="36" rx="3" fill="#222" stroke="#444"/>
  <circle cx="80" cy="54" r="5" fill="#888" stroke="#666"/>
  <line x1="76" y1="54" x2="84" y2="54" stroke="#555" stroke-width="1"/>
  <circle cx="95" cy="54" r="5" fill="#888" stroke="#666"/>
  <line x1="91" y1="54" x2="99" y2="54" stroke="#555" stroke-width="1"/>
  <circle cx="80" cy="68" r="5" fill="#888" stroke="#666"/>
  <line x1="76" y1="68" x2="84" y2="68" stroke="#555" stroke-width="1"/>
  <text x="88" y="78" text-anchor="middle" font-size="5" fill="#aaa">COM/NO/NC</text>
  <!-- Control pins -->
  <rect x="14" y="62" width="48" height="18" rx="1" fill="#1a1a1a"/>
  <rect x="17" y="64" width="10" height="14" fill="#bbb" rx="1"/>
  <rect x="30" y="64" width="10" height="14" fill="#bbb" rx="1"/>
  <rect x="43" y="64" width="10" height="14" fill="#bbb" rx="1"/>
  <text x="22" y="62" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="35" y="62" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="48" y="62" text-anchor="middle" font-size="5" fill="#ddd">IN</text>
  <text x="60" y="85" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">Relay Module</text>
</svg>''')

# --- Buzzer ---
w('buzzer.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB base -->
  <rect x="8" y="45" width="64" height="25" rx="3" fill="#111" stroke="#333" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Buzzer dome -->
  <ellipse cx="40" cy="45" rx="30" ry="20" fill="#111" stroke="#333" stroke-width="2"/>
  <ellipse cx="40" cy="42" rx="25" ry="16" fill="#222" stroke="#444"/>
  <circle cx="40" cy="42" r="8" fill="#333"/>
  <!-- Hole on top -->
  <circle cx="40" cy="30" r="3" fill="#000"/>
  <!-- Leads -->
  <line x1="30" y1="70" x2="30" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="50" y1="70" x2="50" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="30" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">+</text>
  <text x="50" y="80" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">-</text>
  <text x="40" y="78" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Buzzer</text>
</svg>''')

# --- DC Motor ---
w('dc-motor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90" width="110" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Motor cylinder -->
  <rect x="20" y="18" width="70" height="54" rx="8" fill="#555" stroke="#333" stroke-width="3" filter="url(#sh)"/>
  <ellipse cx="90" cy="45" rx="10" ry="27" fill="#444" stroke="#333" stroke-width="2"/>
  <ellipse cx="20" cy="45" rx="10" ry="27" fill="#444" stroke="#333" stroke-width="2"/>
  <!-- Shaft -->
  <rect x="2" y="40" width="20" height="10" rx="3" fill="#888" stroke="#666" stroke-width="2"/>
  <!-- Terminals -->
  <circle cx="60" cy="22" r="5" fill="#f44336" stroke="#c62828"/>
  <circle cx="73" cy="22" r="5" fill="#111" stroke="#333"/>
  <text x="60" y="22" text-anchor="middle" font-size="6" fill="white" font-family="Arial" dominant-baseline="middle">+</text>
  <text x="73" y="22" text-anchor="middle" font-size="6" fill="white" font-family="Arial" dominant-baseline="middle">-</text>
  <text x="65" y="62" text-anchor="middle" font-size="8" font-weight="bold" fill="#aaa" font-family="Arial">DC MOTOR</text>
</svg>''')

# --- NeoPixel Ring ---
w('neopixel-ring.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Ring PCB -->
  <circle cx="50" cy="50" r="44" fill="#111" stroke="#333" stroke-width="3"/>
  <circle cx="50" cy="50" r="30" fill="#000"/>
  <!-- WS2812 LEDs around ring -->
  <circle cx="50" cy="8" r="5" fill="#f44336"/>
  <circle cx="75" cy="16" r="5" fill="#ff9800"/>
  <circle cx="90" cy="38" r="5" fill="#ffeb3b"/>
  <circle cx="90" cy="62" r="5" fill="#4caf50"/>
  <circle cx="75" cy="84" r="5" fill="#00bcd4"/>
  <circle cx="50" cy="92" r="5" fill="#2196f3"/>
  <circle cx="25" cy="84" r="5" fill="#9c27b0"/>
  <circle cx="10" cy="62" r="5" fill="#e91e63"/>
  <circle cx="10" cy="38" r="5" fill="#f44336"/>
  <circle cx="25" cy="16" r="5" fill="#ff9800"/>
  <!-- Connector pads -->
  <rect x="40" y="42" width="20" height="16" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="50" y="52" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">DIN 5V GND</text>
  <text x="50" y="62" text-anchor="middle" font-size="7" font-weight="bold" fill="#aaa" font-family="Arial">NeoPixel</text>
</svg>''')

# --- NeoPixel Strip ---
w('neopixel-strip.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="160" height="40">
  <!-- Strip base -->
  <rect x="2" y="10" width="156" height="20" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <!-- WS2812 LEDs -->
  <rect x="8" y="13" width="12" height="14" rx="1" fill="#f44336" stroke="#c62828"/>
  <rect x="24" y="13" width="12" height="14" rx="1" fill="#ff9800" stroke="#e65100"/>
  <rect x="40" y="13" width="12" height="14" rx="1" fill="#ffeb3b" stroke="#f57f17"/>
  <rect x="56" y="13" width="12" height="14" rx="1" fill="#4caf50" stroke="#1b5e20"/>
  <rect x="72" y="13" width="12" height="14" rx="1" fill="#00bcd4" stroke="#006064"/>
  <rect x="88" y="13" width="12" height="14" rx="1" fill="#2196f3" stroke="#0d47a1"/>
  <rect x="104" y="13" width="12" height="14" rx="1" fill="#9c27b0" stroke="#4a148c"/>
  <rect x="120" y="13" width="12" height="14" rx="1" fill="#e91e63" stroke="#880e4f"/>
  <rect x="136" y="13" width="12" height="14" rx="1" fill="#f44336" stroke="#c62828"/>
  <!-- Connector -->
  <rect x="2" y="6" width="20" height="28" rx="2" fill="#222" stroke="#444"/>
  <text x="80" y="8" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">WS2812B LED Strip</text>
</svg>''')

# --- Bluetooth HC-05 ---
w('bluetooth-hc05.svg', pcb_module('bluetooth-hc05','#1565C0','#0a3d7a',
    ['STATE','RXD','TXD','GND','VCC','EN'],
    '''<rect x="25" y="26" width="80" height="40" rx="2" fill="#111" stroke="#333"/>
    <!-- BT module (metal shielded) -->
    <rect x="28" y="28" width="74" height="36" rx="2" fill="#444" stroke="#666"/>
    <text x="65" y="44" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">HC-05</text>
    <text x="65" y="54" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">Bluetooth</text>''',
    'Bluetooth HC-05', w_=140))

# --- NRF24L01 ---
w('nrf24l01-pa-lna.svg', pcb_module('nrf24l01','#006064','#004d40',
    ['GND','VCC','CE','CSN','SCK','MOSI','MISO','IRQ'],
    '''<rect x="10" y="26" width="110" height="40" rx="2" fill="#111" stroke="#333"/>
    <!-- Module with PA+LNA chips -->
    <rect x="14" y="28" width="70" height="36" rx="1" fill="#444" stroke="#666"/>
    <rect x="88" y="30" width="22" height="14" rx="1" fill="#333" stroke="#555"/>
    <rect x="88" y="46" width="22" height="14" rx="1" fill="#333" stroke="#555"/>
    <!-- Antenna -->
    <line x1="115" y1="26" x2="128" y2="14" stroke="#888" stroke-width="3"/>
    <line x1="128" y1="14" x2="128" y2="42" stroke="#888" stroke-width="1"/>
    <text x="65" y="48" text-anchor="middle" font-size="6" fill="#aaa" font-family="monospace">NRF24L01+PA+LNA</text>''',
    'NRF24L01+', w_=140))

# --- GPS NEO-6M ---
w('comm-module.svg', pcb_module('comm-module','#1565C0','#0a3d7a',
    ['VCC','GND','TX','RX'],
    '''<rect x="25" y="26" width="80" height="40" rx="2" fill="#111" stroke="#333"/>
    <rect x="30" y="28" width="70" height="36" rx="2" fill="#444" stroke="#666"/>
    <text x="65" y="44" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">MODULE</text>''',
    'Comm Module'))

# --- LCD 12864 ---
w('lcd-12864.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 100" width="170" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="4" width="166" height="92" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <rect x="12" y="12" width="146" height="64" rx="3" fill="#8BC34A" stroke="#558B2F" stroke-width="2"/>
  <!-- Grid dots suggest pixel display -->
  <text x="85" y="38" text-anchor="middle" font-family="Courier New" font-size="10" fill="#1b5e20">128 x 64</text>
  <text x="85" y="55" text-anchor="middle" font-family="Courier New" font-size="8" fill="#2e7d32">Graphic LCD</text>
  <!-- Pin row -->
  <rect x="15" y="76" width="76" height="16" rx="1" fill="#1a1a1a"/>
  <text x="85" y="94" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">12864 LCD</text>
</svg>''')

# --- TFT module ---
w('tft-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110" width="120" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="4" width="116" height="102" rx="4" fill="#222" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Display -->
  <rect x="8" y="8" width="104" height="78" rx="2">
    <animate attributeName="fill" values="#001f3f;#003d7a;#001f3f" dur="3s" repeatCount="indefinite"/>
  </rect>
  <rect x="8" y="8" width="104" height="78" rx="2" fill="#1565C0"/>
  <text x="60" y="44" text-anchor="middle" font-family="Arial" font-size="10" fill="white">TFT Color</text>
  <text x="60" y="58" text-anchor="middle" font-family="Arial" font-size="8" fill="#90CAF9">1.8" ST7735</text>
  <!-- SD card slot -->
  <rect x="80" y="88" width="30" height="12" rx="2" fill="#444" stroke="#333"/>
  <text x="95" y="98" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">SD</text>
  <!-- Pin header -->
  <rect x="4" y="88" width="72" height="14" rx="1" fill="#1a1a1a"/>
  <text x="60" y="108" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">TFT 1.8" Display</text>
</svg>''')

# --- 7-segment ---
w('display-7seg.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
  <rect x="4" y="4" width="82" height="82" rx="4" fill="#222" stroke="#333" stroke-width="2"/>
  <!-- 7-segment display (digit "8") -->
  <!-- Top horizontal -->
  <rect x="22" y="14" width="46" height="8" rx="3" fill="#f44336"/>
  <!-- Top-left vertical -->
  <rect x="14" y="16" width="8" height="28" rx="3" fill="#f44336"/>
  <!-- Top-right vertical -->
  <rect x="68" y="16" width="8" height="28" rx="3" fill="#f44336"/>
  <!-- Middle horizontal -->
  <rect x="22" y="44" width="46" height="8" rx="3" fill="#f44336"/>
  <!-- Bottom-left vertical -->
  <rect x="14" y="46" width="8" height="28" rx="3" fill="#f44336"/>
  <!-- Bottom-right vertical -->
  <rect x="68" y="46" width="8" height="28" rx="3" fill="#f44336"/>
  <!-- Bottom horizontal -->
  <rect x="22" y="74" width="46" height="8" rx="3" fill="#f44336"/>
  <!-- Decimal point -->
  <circle cx="78" cy="78" r="4" fill="#f44336"/>
  <text x="45" y="88" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">7-Segment</text>
</svg>''')

# --- MAX7219 LED matrix ---
w('max7219-matrix.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="4" width="116" height="92" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- 8x8 LED matrix -->
  <!-- Row 1 -->
  <circle cx="18" cy="20" r="4" fill="#f44336"/><circle cx="30" cy="20" r="4" fill="#333"/>
  <circle cx="42" cy="20" r="4" fill="#f44336"/><circle cx="54" cy="20" r="4" fill="#f44336"/>
  <circle cx="66" cy="20" r="4" fill="#333"/><circle cx="78" cy="20" r="4" fill="#f44336"/>
  <circle cx="90" cy="20" r="4" fill="#333"/><circle cx="102" cy="20" r="4" fill="#f44336"/>
  <!-- Row 2 -->
  <circle cx="18" cy="32" r="4" fill="#333"/><circle cx="30" cy="32" r="4" fill="#f44336"/>
  <circle cx="42" cy="32" r="4" fill="#333"/><circle cx="54" cy="32" r="4" fill="#333"/>
  <circle cx="66" cy="32" r="4" fill="#f44336"/><circle cx="78" cy="32" r="4" fill="#333"/>
  <circle cx="90" cy="32" r="4" fill="#f44336"/><circle cx="102" cy="32" r="4" fill="#333"/>
  <!-- Row 3 -->
  <circle cx="18" cy="44" r="4" fill="#f44336"/><circle cx="30" cy="44" r="4" fill="#f44336"/>
  <circle cx="42" cy="44" r="4" fill="#333"/><circle cx="54" cy="44" r="4" fill="#f44336"/>
  <circle cx="66" cy="44" r="4" fill="#333"/><circle cx="78" cy="44" r="4" fill="#f44336"/>
  <circle cx="90" cy="44" r="4" fill="#f44336"/><circle cx="102" cy="44" r="4" fill="#f44336"/>
  <!-- Pin connector -->
  <rect x="14" y="78" width="92" height="14" rx="1" fill="#1a1a1a"/>
  <rect x="18" y="80" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="31" y="80" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="44" y="80" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="57" y="80" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="70" y="80" width="9" height="10" fill="#bbb" rx="1"/>
  <text x="22" y="78" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="35" y="78" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="48" y="78" text-anchor="middle" font-size="5" fill="#ddd">DIN</text>
  <text x="61" y="78" text-anchor="middle" font-size="5" fill="#ddd">CS</text>
  <text x="74" y="78" text-anchor="middle" font-size="5" fill="#ddd">CLK</text>
  <text x="60" y="96" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">MAX7219 Matrix</text>
</svg>''')

# --- TM1637 4-digit ---
w('tm1637.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 70" width="150" height="70">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="4" width="146" height="62" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- 4 digit display segments (simple boxes) -->
  <rect x="10" y="12" width="28" height="36" rx="2" fill="#c62828" opacity="0.9"/>
  <rect x="42" y="12" width="28" height="36" rx="2" fill="#c62828" opacity="0.9"/>
  <circle cx="74" cy="30" r="3" fill="#f44336"/>
  <rect x="78" y="12" width="28" height="36" rx="2" fill="#c62828" opacity="0.9"/>
  <rect x="110" y="12" width="28" height="36" rx="2" fill="#c62828" opacity="0.9"/>
  <!-- Digits text -->
  <text x="24" y="35" text-anchor="middle" font-family="Courier New" font-size="18" fill="#ff1744">1</text>
  <text x="56" y="35" text-anchor="middle" font-family="Courier New" font-size="18" fill="#ff1744">2</text>
  <text x="92" y="35" text-anchor="middle" font-family="Courier New" font-size="18" fill="#ff1744">3</text>
  <text x="124" y="35" text-anchor="middle" font-family="Courier New" font-size="18" fill="#ff1744">4</text>
  <!-- 4-pin connector -->
  <rect x="10" y="50" width="48" height="14" rx="1" fill="#1a1a1a"/>
  <rect x="13" y="52" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="25" y="52" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="37" y="52" width="9" height="10" fill="#bbb" rx="1"/>
  <rect x="49" y="52" width="9" height="10" fill="#bbb" rx="1"/>
  <text x="17" y="50" text-anchor="middle" font-size="5" fill="#ddd">CLK</text>
  <text x="29" y="50" text-anchor="middle" font-size="5" fill="#ddd">DIO</text>
  <text x="41" y="50" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="53" y="50" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="75" y="65" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">TM1637 4-Digit</text>
</svg>''')

# --- Push Button ---
w('push-button.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 80" width="70" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Base -->
  <rect x="10" y="40" width="50" height="30" rx="3" fill="#444" stroke="#222" stroke-width="2" filter="url(#sh)"/>
  <!-- Button cap -->
  <ellipse cx="35" cy="38" rx="16" ry="10" fill="#e53935" stroke="#b71c1c" stroke-width="2"/>
  <!-- Leads -->
  <line x1="18" y1="70" x2="18" y2="80" stroke="#bbb" stroke-width="3"/>
  <line x1="28" y1="70" x2="28" y2="80" stroke="#bbb" stroke-width="3"/>
  <line x1="42" y1="70" x2="42" y2="80" stroke="#bbb" stroke-width="3"/>
  <line x1="52" y1="70" x2="52" y2="80" stroke="#bbb" stroke-width="3"/>
  <text x="35" y="60" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">PUSH</text>
</svg>''')

# --- Switch ---
w('switch.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 70" width="80" height="70">
  <!-- Body -->
  <rect x="10" y="18" width="60" height="34" rx="4" fill="#333" stroke="#111" stroke-width="2"/>
  <!-- Toggle lever (ON position) -->
  <rect x="36" y="8" width="12" height="24" rx="4" fill="#e53935" stroke="#b71c1c" stroke-width="2"/>
  <!-- Terminal pins -->
  <line x1="20" y1="52" x2="20" y2="68" stroke="#bbb" stroke-width="3"/>
  <line x1="40" y1="52" x2="40" y2="68" stroke="#bbb" stroke-width="3"/>
  <line x1="60" y1="52" x2="60" y2="68" stroke="#bbb" stroke-width="3"/>
  <text x="20" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">1</text>
  <text x="40" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">C</text>
  <text x="60" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">2</text>
  <text x="40" y="16" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">Toggle</text>
</svg>''')

# --- Joystick ---
w('joystick.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 100" width="90" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="5" y="45" width="80" height="50" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Joystick base -->
  <circle cx="45" cy="55" r="28" fill="#555" stroke="#333" stroke-width="2"/>
  <circle cx="45" cy="55" r="20" fill="#444" stroke="#333" stroke-width="1.5"/>
  <!-- Stick -->
  <line x1="45" y1="55" x2="52" y2="38" stroke="#888" stroke-width="5"/>
  <circle cx="52" cy="35" r="8" fill="#222" stroke="#444" stroke-width="2"/>
  <!-- 5 pins -->
  <rect x="8" y="85" width="74" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="11" y="87" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="23" y="87" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="35" y="87" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="47" y="87" width="9" height="8" fill="#bbb" rx="1"/>
  <rect x="59" y="87" width="9" height="8" fill="#bbb" rx="1"/>
  <text x="15" y="85" text-anchor="middle" font-size="5" fill="#ddd">VCC</text>
  <text x="27" y="85" text-anchor="middle" font-size="5" fill="#ddd">VRX</text>
  <text x="39" y="85" text-anchor="middle" font-size="5" fill="#ddd">VRY</text>
  <text x="51" y="85" text-anchor="middle" font-size="5" fill="#ddd">SW</text>
  <text x="63" y="85" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="45" y="98" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Joystick</text>
</svg>''')

# --- Battery 9V ---
w('battery-9v.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" width="80" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Battery body -->
  <rect x="8" y="20" width="64" height="82" rx="5" fill="#222" stroke="#111" stroke-width="3" filter="url(#sh)"/>
  <!-- Label -->
  <rect x="14" y="30" width="52" height="62" rx="3" fill="#1565C0"/>
  <text x="40" y="58" text-anchor="middle" font-size="12" font-weight="bold" fill="white" font-family="Arial">9V</text>
  <text x="40" y="74" text-anchor="middle" font-size="7" fill="#90CAF9" font-family="Arial">Battery</text>
  <!-- Terminals at top -->
  <rect x="25" y="8" width="14" height="14" rx="3" fill="#f44336"/>
  <rect x="41" y="10" width="14" height="12" rx="3" fill="#111"/>
  <text x="32" y="18" text-anchor="middle" font-size="7" fill="white" font-family="Arial">+</text>
  <text x="48" y="18" text-anchor="middle" font-size="7" fill="white" font-family="Arial">-</text>
</svg>''')

# --- Battery holder ---
w('battery-holder-2cell.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="120" height="70">
  <!-- Holder body -->
  <rect x="4" y="10" width="112" height="50" rx="4" fill="#333" stroke="#111" stroke-width="2"/>
  <!-- Cell 1 -->
  <rect x="12" y="15" width="44" height="40" rx="5" fill="#555" stroke="#444"/>
  <rect x="14" y="17" width="40" height="36" rx="4" fill="#1565C0"/>
  <text x="34" y="38" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">AA</text>
  <!-- Cell 2 -->
  <rect x="64" y="15" width="44" height="40" rx="5" fill="#555" stroke="#444"/>
  <rect x="66" y="17" width="40" height="36" rx="4" fill="#1565C0"/>
  <text x="86" y="38" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">AA</text>
  <!-- Wire leads -->
  <line x1="4" y1="30" x2="0" y2="30" stroke="#f44336" stroke-width="3"/>
  <line x1="4" y1="40" x2="0" y2="40" stroke="#111" stroke-width="3"/>
  <text x="0" y="26" font-size="6" fill="#f44336" font-family="Arial">+</text>
  <text x="0" y="52" font-size="6" fill="#888" font-family="Arial">-</text>
</svg>''')

# --- Power Module ---
w('power-module.svg', pcb_module('power-module','#b71c1c','#7f0000',
    ['IN+','IN-','OUT+','OUT-'],
    '''<rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
    <rect x="40" y="34" width="50" height="26" rx="1" fill="#222" stroke="#444"/>
    <!-- Voltage regulator chip -->
    <rect x="52" y="38" width="26" height="18" rx="1" fill="#333" stroke="#555"/>
    <text x="65" y="49" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">LM7805</text>''',
    'Power Regulator'))

# --- Solar Panel ---
w('solar-panel.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Frame -->
  <rect x="4" y="4" width="112" height="82" rx="4" fill="#444" stroke="#222" stroke-width="3" filter="url(#sh)"/>
  <!-- Solar cells grid -->
  <rect x="8" y="8" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="36" y="8" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="64" y="8" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="92" y="8" width="20" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="8" y="46" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="36" y="46" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="64" y="46" width="26" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="92" y="46" width="20" height="36" rx="1" fill="#1565C0" stroke="#0d47a1"/>
  <!-- Cell lines -->
  <line x1="8" y1="26" x2="34" y2="26" stroke="#90CAF9" stroke-width="0.5"/>
  <line x1="36" y1="26" x2="62" y2="26" stroke="#90CAF9" stroke-width="0.5"/>
  <line x1="64" y1="26" x2="90" y2="26" stroke="#90CAF9" stroke-width="0.5"/>
  <!-- Wires -->
  <line x1="50" y1="86" x2="40" y2="100" stroke="#f44336" stroke-width="3"/>
  <line x1="70" y1="86" x2="80" y2="100" stroke="#111" stroke-width="3"/>
  <text x="60" y="96" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">Solar Panel 6V</text>
</svg>''')

# --- Breadboard ---
w('breadboard.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" width="200" height="90">
  <!-- Body -->
  <rect x="2" y="2" width="196" height="86" rx="4" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="2"/>
  <!-- Power rails (top) -->
  <rect x="6" y="8" width="188" height="10" rx="2" fill="#fff" stroke="#ddd"/>
  <!-- Red power line -->
  <line x1="10" y1="13" x2="190" y2="13" stroke="#f44336" stroke-width="1.5"/>
  <!-- Blue power line -->
  <line x1="10" y1="16" x2="190" y2="16" stroke="#1565C0" stroke-width="1.5"/>
  <!-- Power rails (bottom) -->
  <rect x="6" y="72" width="188" height="10" rx="2" fill="#fff" stroke="#ddd"/>
  <line x1="10" y1="77" x2="190" y2="77" stroke="#f44336" stroke-width="1.5"/>
  <line x1="10" y1="80" x2="190" y2="80" stroke="#1565C0" stroke-width="1.5"/>
  <!-- Center hole rows -->
  <rect x="6" y="22" width="188" height="48" rx="2" fill="#eeeeee" stroke="#ddd"/>
  <!-- Center gap -->
  <rect x="6" y="44" width="188" height="4" rx="0" fill="#bdbdbd"/>
  <!-- Holes grid (simplified) -->
  <!-- Row of dots -->
  <text x="100" y="40" text-anchor="middle" font-size="8" fill="#aaa" font-family="Arial">· · · · · · · · · · · · · · · · ·</text>
  <text x="100" y="55" text-anchor="middle" font-size="8" fill="#aaa" font-family="Arial">· · · · · · · · · · · · · · · · ·</text>
  <!-- Label -->
  <text x="100" y="90" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">Breadboard 830</text>
</svg>''')

# --- Jumper Wire ---
w('jumper-wire.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
  <!-- Wire body -->
  <path d="M10,25 Q40,10 80,25 Q100,32 110,25" stroke="#f44336" stroke-width="4" fill="none"/>
  <!-- Connectors at ends -->
  <rect x="0" y="18" width="14" height="14" rx="2" fill="#111" stroke="#333"/>
  <rect x="106" y="18" width="14" height="14" rx="2" fill="#111" stroke="#333"/>
  <circle cx="7" cy="25" r="4" fill="#bbb"/>
  <circle cx="113" cy="25" r="4" fill="#bbb"/>
  <text x="60" y="46" text-anchor="middle" font-size="8" fill="#555" font-family="Arial">Jumper Wire M-M</text>
</svg>''')

# --- L298N Mini ---
w('l298n-mini.svg', pcb_module('l298n-mini','#1b5e20','#0d4e14',
    ['VCC','GND','IN1','IN2','IN3','IN4','MOTA','MOTB'],
    '''<rect x="10" y="26" width="110" height="40" rx="2" fill="#111" stroke="#333"/>
    <rect x="18" y="30" width="74" height="32" rx="1" fill="#222" stroke="#444"/>
    <text x="55" y="48" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">Mini L298N</text>''',
    'Mini L298N', w_=140))

# --- BTS7960 ---
w('bts7960.svg', pcb_module('bts7960','#b71c1c','#7f0000',
    ['VCC','GND','R_EN','L_EN','RPWM','LPWM'],
    '''<rect x="20" y="26" width="90" height="40" rx="2" fill="#111" stroke="#333"/>
    <rect x="28" y="30" width="40" height="32" rx="1" fill="#222" stroke="#444"/>
    <text x="48" y="48" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">BTS7960</text>
    <rect x="72" y="30" width="34" height="32" rx="1" fill="#333" stroke="#555"/>
    <text x="89" y="48" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">43A</text>''',
    'BTS7960 Driver'))

# --- PCA9685 ---
w('pca9685.svg', pcb_module('pca9685','#37474f','#263238',
    ['VCC','GND','SDA','SCL','OE'],
    '''<rect x="20" y="26" width="90" height="40" rx="2" fill="#111" stroke="#333"/>
    <rect x="30" y="30" width="70" height="32" rx="1" fill="#222" stroke="#444"/>
    <text x="65" y="48" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">PCA9685</text>
    <text x="65" y="58" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">16-Ch PWM</text>''',
    'PCA9685 PWM'))

# --- IC DIP (generic) ---
w('ic-dip.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70" width="100" height="70">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- IC Body -->
  <rect x="20" y="14" width="60" height="42" rx="3" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Notch at top -->
  <ellipse cx="50" cy="14" rx="8" ry="5" fill="#222" stroke="#444"/>
  <!-- Pin 1 dot -->
  <circle cx="25" cy="20" r="2" fill="#555"/>
  <!-- Pins left side -->
  <line x1="8" y1="22" x2="20" y2="22" stroke="#bbb" stroke-width="3"/>
  <line x1="8" y1="30" x2="20" y2="30" stroke="#bbb" stroke-width="3"/>
  <line x1="8" y1="38" x2="20" y2="38" stroke="#bbb" stroke-width="3"/>
  <line x1="8" y1="46" x2="20" y2="46" stroke="#bbb" stroke-width="3"/>
  <!-- Pins right side -->
  <line x1="80" y1="22" x2="92" y2="22" stroke="#bbb" stroke-width="3"/>
  <line x1="80" y1="30" x2="92" y2="30" stroke="#bbb" stroke-width="3"/>
  <line x1="80" y1="38" x2="92" y2="38" stroke="#bbb" stroke-width="3"/>
  <line x1="80" y1="46" x2="92" y2="46" stroke="#bbb" stroke-width="3"/>
  <text x="50" y="38" text-anchor="middle" font-size="8" fill="#888" font-family="monospace">IC DIP</text>
</svg>''')

# --- Thermistor NTC ---
w('thermistor-ntc.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <!-- Disc body -->
  <circle cx="40" cy="35" r="22" fill="#1a237e" stroke="#0d47a1" stroke-width="2"/>
  <text x="40" y="39" text-anchor="middle" font-size="8" font-weight="bold" fill="#fff" font-family="Arial">NTC</text>
  <!-- Leads -->
  <line x1="32" y1="57" x2="32" y2="78" stroke="#bbb" stroke-width="3"/>
  <line x1="48" y1="57" x2="48" y2="78" stroke="#bbb" stroke-width="3"/>
  <text x="40" y="10" text-anchor="middle" font-size="8" fill="#555" font-family="Arial">10kΩ NTC</text>
</svg>''')

# --- ESP32-CAM ---
w('esp32-cam.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 110" width="130" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="4" width="122" height="102" rx="4" fill="#1b1b1b" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- ESP32 module area -->
  <rect x="10" y="10" width="80" height="50" rx="3" fill="#444" stroke="#666" stroke-width="1.5"/>
  <text x="50" y="32" text-anchor="middle" font-size="9" fill="#aaa" font-family="monospace">ESP32-CAM</text>
  <!-- Camera module -->
  <rect x="14" y="56" width="38" height="36" rx="2" fill="#222" stroke="#444"/>
  <circle cx="33" cy="74" r="13" fill="#1a1a1a" stroke="#555" stroke-width="1.5"/>
  <circle cx="33" cy="74" r="8" fill="#111"/>
  <circle cx="33" cy="74" r="4" fill="#0d0d0d" stroke="#1565C0" stroke-width="1"/>
  <text x="33" y="98" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">OV2640</text>
  <!-- SD card slot -->
  <rect x="95" y="56" width="26" height="18" rx="2" fill="#555" stroke="#333"/>
  <text x="108" y="68" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">SD</text>
  <!-- Pins -->
  <rect x="56" y="60" width="34" height="36" rx="1" fill="#1a1a1a"/>
  <text x="73" y="70" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">IO pins</text>
  <text x="65" y="107" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">ESP32-CAM</text>
</svg>''')

# --- SIM900A / GSM ---
w('sim900a.svg', pcb_module('sim900a','#1565C0','#0a3d7a',
    ['5V','GND','TXD','RXD'],
    '''<rect x="20" y="22" width="90" height="50" rx="2" fill="#333" stroke="#555"/>
    <rect x="24" y="26" width="82" height="42" rx="2" fill="#444" stroke="#666"/>
    <text x="65" y="46" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">SIM900A</text>
    <text x="65" y="56" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">GSM/GPRS</text>
    <!-- SIM card slot -->
    <rect x="88" y="26" width="22" height="18" rx="1" fill="#555" stroke="#333"/>
    <text x="99" y="37" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">SIM</text>''',
    'SIM900A GSM', w_=150))

# --- HC-12 RF ---
w('hc-12.svg', pcb_module('hc-12','#37474f','#263238',
    ['VCC','GND','RXD','TXD','SET'],
    '''<rect x="20" y="22" width="90" height="46" rx="2" fill="#444" stroke="#666"/>
    <rect x="26" y="26" width="80" height="38" rx="1" fill="#555" stroke="#777"/>
    <text x="66" y="45" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">HC-12</text>
    <!-- Antenna -->
    <line x1="105" y1="22" x2="105" y2="6" stroke="#c0c0c0" stroke-width="2.5"/>
    <circle cx="105" cy="6" r="3" fill="#c0c0c0"/>''',
    'HC-12 433MHz'))

# --- Nextion HMI ---
w('nextion-24.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="2" width="156" height="116" rx="4" fill="#222" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Display -->
  <rect x="8" y="8" width="140" height="88" rx="2" fill="#001f3f" stroke="#1565C0" stroke-width="1.5"/>
  <!-- UI elements -->
  <rect x="14" y="14" width="50" height="24" rx="3" fill="#2196f3"/>
  <text x="39" y="30" text-anchor="middle" font-size="8" fill="white" font-family="Arial">Button</text>
  <rect x="72" y="14" width="70" height="24" rx="3" fill="#4caf50"/>
  <text x="107" y="30" text-anchor="middle" font-size="8" fill="white" font-family="Arial">Slider</text>
  <rect x="14" y="44" width="128" height="44" rx="3" fill="#0a3d7a"/>
  <text x="78" y="65" text-anchor="middle" font-size="9" fill="white" font-family="Arial">Nextion HMI</text>
  <text x="78" y="78" text-anchor="middle" font-size="7" fill="#90CAF9" font-family="Arial">Touch Display</text>
  <!-- Connector -->
  <rect x="50" y="98" width="60" height="14" rx="1" fill="#1a1a1a"/>
  <rect x="54" y="100" width="10" height="10" fill="#bbb" rx="1"/>
  <rect x="67" y="100" width="10" height="10" fill="#bbb" rx="1"/>
  <rect x="80" y="100" width="10" height="10" fill="#bbb" rx="1"/>
  <rect x="93" y="100" width="10" height="10" fill="#bbb" rx="1"/>
  <text x="59" y="98" text-anchor="middle" font-size="5" fill="#ddd">5V</text>
  <text x="72" y="98" text-anchor="middle" font-size="5" fill="#ddd">TX</text>
  <text x="85" y="98" text-anchor="middle" font-size="5" fill="#ddd">RX</text>
  <text x="98" y="98" text-anchor="middle" font-size="5" fill="#ddd">GND</text>
  <text x="80" y="114" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">Nextion 2.4" HMI</text>
</svg>''')

# --- Jetson Nano ---
w('jetson-nano.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 130" width="170" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="4" width="162" height="122" rx="4" fill="#1b5e20" stroke="#0d4e14" stroke-width="2" filter="url(#sh)"/>
  <!-- Tegra X1 SoC + heatsink -->
  <rect x="45" y="20" width="80" height="60" rx="3" fill="#888" stroke="#666" stroke-width="2"/>
  <line x1="55" y1="20" x2="55" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="65" y1="20" x2="65" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="75" y1="20" x2="75" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="85" y1="20" x2="85" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="95" y1="20" x2="95" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="105" y1="20" x2="105" y2="80" stroke="#999" stroke-width="1.5"/>
  <line x1="115" y1="20" x2="115" y2="80" stroke="#999" stroke-width="1.5"/>
  <text x="85" y="55" text-anchor="middle" font-size="9" fill="#222" font-family="Arial" font-weight="bold">JETSON</text>
  <text x="85" y="67" text-anchor="middle" font-size="8" fill="#333" font-family="Arial">NANO</text>
  <!-- GPIO header -->
  <rect x="8" y="20" width="32" height="80" rx="2" fill="#1a1a1a"/>
  <text x="24" y="62" text-anchor="middle" font-size="6" fill="#888" font-family="Arial" transform="rotate(-90 24 62)">40-pin GPIO</text>
  <!-- USB ports -->
  <rect x="8" y="104" width="22" height="14" rx="2" fill="#555" stroke="#333"/>
  <rect x="32" y="104" width="22" height="14" rx="2" fill="#555" stroke="#333"/>
  <rect x="56" y="104" width="22" height="14" rx="2" fill="#555" stroke="#333"/>
  <rect x="80" y="104" width="22" height="14" rx="2" fill="#555" stroke="#333"/>
  <!-- HDMI -->
  <rect x="108" y="104" width="28" height="14" rx="2" fill="#111" stroke="#333"/>
  <text x="122" y="113" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">HDMI</text>
  <!-- Ethernet -->
  <rect x="140" y="104" width="22" height="14" rx="2" fill="#1565C0" stroke="#0a3d7a"/>
  <text x="151" y="113" text-anchor="middle" font-size="5" fill="#fff" font-family="Arial">ETH</text>
  <!-- Camera connector -->
  <rect x="130" y="20" width="34" height="10" rx="1" fill="#333"/>
  <text x="147" y="27" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">CSI</text>
  <text x="85" y="126" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">NVIDIA Jetson Nano</text>
</svg>''')

# --- Google Coral ---
w('google-coral.svg', pcb_module('google-coral','#1565C0','#0a3d7a',
    ['USB'],
    '''<rect x="20" y="22" width="90" height="46" rx="2" fill="#333" stroke="#555"/>
    <rect x="26" y="26" width="78" height="38" rx="2" fill="#444" stroke="#666"/>
    <!-- Edge TPU chip -->
    <rect x="40" y="30" width="50" height="30" rx="2" fill="#222" stroke="#444"/>
    <text x="65" y="44" text-anchor="middle" font-size="7" fill="#aaa" font-family="monospace">Edge TPU</text>
    <text x="65" y="54" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">4TOPS</text>''',
    'Google Coral USB', w_=140))

# --- OV7670 Camera ---
w('ov7670.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="4" width="92" height="92" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Lens barrel -->
  <circle cx="50" cy="45" r="28" fill="#333" stroke="#222" stroke-width="3"/>
  <circle cx="50" cy="45" r="22" fill="#222" stroke="#333" stroke-width="2"/>
  <circle cx="50" cy="45" r="15" fill="#111"/>
  <circle cx="50" cy="45" r="8" fill="#0d0d0d" stroke="#1565C0" stroke-width="1.5"/>
  <circle cx="50" cy="45" r="3" fill="#1565C0"/>
  <!-- Connector -->
  <rect x="10" y="78" width="80" height="16" rx="1" fill="#1a1a1a"/>
  <text x="50" y="96" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">OV7670 Camera</text>
</svg>''')

# --- Pi Camera ---
w('pi-camera-v2.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="14" width="92" height="72" rx="4" fill="#1b5e20" stroke="#0d4e14" stroke-width="2" filter="url(#sh)"/>
  <!-- Camera module -->
  <circle cx="50" cy="48" r="24" fill="#222" stroke="#333" stroke-width="2"/>
  <circle cx="50" cy="48" r="17" fill="#111"/>
  <circle cx="50" cy="48" r="10" fill="#0d0d0d" stroke="#2196f3" stroke-width="2"/>
  <circle cx="50" cy="48" r="4" fill="#2196f3"/>
  <!-- CSI ribbon -->
  <rect x="35" y="76" width="30" height="8" rx="1" fill="#fff" stroke="#ddd"/>
  <text x="50" y="82" text-anchor="middle" font-size="5" fill="#555" font-family="Arial">CSI Ribbon</text>
  <!-- Mounting holes -->
  <circle cx="14" cy="24" r="3" fill="none" stroke="#1b5e20" stroke-width="1.5"/>
  <circle cx="86" cy="24" r="3" fill="none" stroke="#1b5e20" stroke-width="1.5"/>
  <circle cx="14" cy="76" r="3" fill="none" stroke="#1b5e20" stroke-width="1.5"/>
  <circle cx="86" cy="76" r="3" fill="none" stroke="#1b5e20" stroke-width="1.5"/>
  <text x="50" y="11" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">Pi Camera V2</text>
</svg>''')

# --- Various remaining sensors/modules ---
for sid, slabel, sfill, scolor in [
    ('mpu9250','MPU9250','#006064','#00363a'),
    ('lm2596','LM2596 Buck','#b71c1c','#7f0000'),
    ('mt3608','MT3608 Boost','#b71c1c','#7f0000'),
    ('xl4015','XL4015 Buck','#b71c1c','#7f0000'),
    ('bms-3s','3S BMS 12V','#b71c1c','#7f0000'),
    ('xt60-connector','XT60 Connector','#f57f17','#e65100'),
    ('barrel-jack','DC Barrel Jack','#333','#111'),
    ('cc2530','CC2530 Zigbee','#006064','#004d40'),
    ('ch340g','CH340G USB-TTL','#1565C0','#0a3d7a'),
    ('cp2102','CP2102 USB-UART','#1565C0','#0a3d7a'),
    ('max232','MAX232 RS232-TTL','#1565C0','#0a3d7a'),
    ('tca9548a','TCA9548A I2C Mux','#006064','#004d40'),
    ('logic-analyzer-8ch','Logic Analyzer 8Ch','#333','#111'),
    ('mg90s','MG90S Metal Servo','#333','#111'),
    ('sg90s-360','SG90s 360° Servo','#333','#111'),
    ('ws2812-matrix','WS2812 8x8 Matrix','#111','#000'),
    ('rx470','433MHz RF Receiver','#1b5e20','#0d4e14'),
    ('tx118sa','433MHz RF Transmitter','#1b5e20','#0d4e14'),
    ('sipeed-maix-duino','Sipeed Maixduino','#311b92','#1a0060'),
    ('nrf24l01-pa-lna','NRF24L01+PA+LNA','#006064','#004d40'),
    ('pca9685','PCA9685 PWM','#37474f','#263238'),
]:
    n = slabel.split()
    short = slabel[:12]
    w(f'{sid}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs>
    <filter id="sh" x="-8%" y="-8%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="pcbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{sfill}"/>
      <stop offset="100%" stop-color="{scolor}"/>
    </linearGradient>
  </defs>
  <rect x="4" y="14" width="122" height="72" rx="4" fill="url(#pcbg)" stroke="{scolor}" stroke-width="1.5" filter="url(#sh)"/>
  <circle cx="12" cy="22" r="3" fill="none" stroke="{scolor}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="118" cy="22" r="3" fill="none" stroke="{scolor}" stroke-width="1.5" opacity="0.5"/>
  <rect x="30" y="28" width="70" height="38" rx="2" fill="#111" stroke="#333"/>
  <rect x="38" y="34" width="54" height="26" rx="1" fill="#1a1a1a" stroke="#444"/>
  <text x="65" y="49" text-anchor="middle" font-size="8" fill="#888" font-family="monospace">{short}</text>
  <text x="65" y="80" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial,sans-serif" fill="#fff">{slabel}</text>
</svg>''')

print("\nAll SVGs written to:", OUT_DIR)
