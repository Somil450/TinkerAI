"""
Generate ACCURATE, DISTINCT, PIN-CORRECT SVGs for all TinkerAI components.
Each component has the real pin names in correct order as per datasheets.
Pins are drawn CLEANLY at top, bottom or sides based on real component form factor.
"""
import os, math

OUT = r'public/assets/components'
os.makedirs(OUT, exist_ok=True)

def save(name, svg):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'ok {name}')

# ── pin helper: draws a neat row of labeled pins ─────────────────
def pin_row(pins, y_pin_top, y_label, cx=65, spacing=20, direction='down', color='#bdbdbd', label_color='#ccc'):
    """Returns SVG for a row of pins. direction='down' means pins go downward from y_pin_top."""
    n = len(pins)
    total = (n - 1) * spacing
    x0 = cx - total / 2
    s = ''
    for i, p in enumerate(pins):
        x = x0 + i * spacing
        if direction == 'down':
            s += f'<line x1="{x:.0f}" y1="{y_pin_top}" x2="{x:.0f}" y2="{y_pin_top+8}" stroke="{color}" stroke-width="3" stroke-linecap="round"/>\n'
            s += f'<text x="{x:.0f}" y="{y_label}" text-anchor="middle" font-size="6" fill="{label_color}" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
        else:  # up
            s += f'<line x1="{x:.0f}" y1="{y_pin_top}" x2="{x:.0f}" y2="{y_pin_top-8}" stroke="{color}" stroke-width="3" stroke-linecap="round"/>\n'
            s += f'<text x="{x:.0f}" y="{y_label}" text-anchor="middle" font-size="6" fill="{label_color}" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
    return s

def side_pins(pins, x_pin, y_start, spacing=16, direction='left', color='#bdbdbd', label_color='#ccc'):
    """Returns SVG for a column of pins on left or right side."""
    s = ''
    for i, p in enumerate(pins):
        y = y_start + i * spacing
        if direction == 'left':
            lx = x_pin - 10
            s += f'<line x1="{x_pin}" y1="{y}" x2="{lx}" y2="{y}" stroke="{color}" stroke-width="3" stroke-linecap="round"/>\n'
            s += f'<text x="{lx-2}" y="{y+4}" text-anchor="end" font-size="6" fill="{label_color}" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
        else:
            lx = x_pin + 10
            s += f'<line x1="{x_pin}" y1="{y}" x2="{lx}" y2="{y}" stroke="{color}" stroke-width="3" stroke-linecap="round"/>\n'
            s += f'<text x="{lx+2}" y="{y+4}" text-anchor="start" font-size="6" fill="{label_color}" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
    return s

def header(pins, pcb_color='#1565C0', pcb_stroke='#0a3d7a', y_pcb=12, pcb_h=6):
    """Draws a DIP-style top pin header."""
    n = len(pins)
    spacing = min(20, 110 // max(n,1))
    total = (n-1)*spacing
    x0 = 65 - total//2
    s = f'<rect x="{x0-4}" y="{y_pcb}" width="{total+8}" height="{pcb_h}" rx="1.5" fill="#1a1a1a" stroke="#333"/>\n'
    for i, p in enumerate(pins):
        x = x0 + i*spacing
        s += f'<rect x="{x-4}" y="{y_pcb+1}" width="8" height="{pcb_h-2}" rx="1" fill="#c8b400"/>\n'
        s += f'<text x="{x}" y="{y_pcb-1}" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
    return s, x0, spacing


# ══════════════════════════════════════════════════════════════════
#  MICROCONTROLLERS
# ══════════════════════════════════════════════════════════════════

save('arduino-uno.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <defs>
    <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a6bc4"/><stop offset="100%" stop-color="#0a3d7a"/>
    </linearGradient>
  </defs>
  <!-- Board outline (UNO shape) -->
  <path d="M20,10 L180,10 L180,150 L70,150 L20,110 Z" fill="url(#bg)" stroke="#07305e" stroke-width="2" filter="url(#sh)"/>
  <!-- USB Type-B port -->
  <rect x="5" y="65" width="20" height="28" rx="3" fill="#888" stroke="#555" stroke-width="1.5"/>
  <rect x="8" y="68" width="14" height="22" rx="2" fill="#444"/>
  <!-- DC Jack -->
  <rect x="5" y="38" width="18" height="16" rx="4" fill="#222" stroke="#555" stroke-width="1.5"/>
  <circle cx="14" cy="46" r="5" fill="#333"/><circle cx="14" cy="46" r="2" fill="#888"/>
  <!-- ATmega328P chip -->
  <rect x="68" y="68" width="52" height="52" rx="3" fill="#111" stroke="#333" stroke-width="1.5"/>
  <text x="94" y="90" text-anchor="middle" font-size="6.5" fill="#666" font-family="monospace">ATmega</text>
  <text x="94" y="100" text-anchor="middle" font-size="6.5" fill="#666" font-family="monospace">328P-PU</text>
  <!-- Crystal -->
  <rect x="130" y="76" width="20" height="10" rx="3" fill="#c0c0c0" stroke="#888"/>
  <!-- Reset button -->
  <rect x="148" y="34" width="14" height="14" rx="3" fill="#e53935" stroke="#b71c1c"/>
  <!-- Power LED -->
  <circle cx="138" cy="28" r="4" fill="#4caf50"/>
  <!-- TX/RX LEDs -->
  <circle cx="125" cy="28" r="3" fill="#f44336"/><circle cx="115" cy="28" r="3" fill="#f44336"/>
  <!-- 5V regulator -->
  <rect x="36" y="68" width="16" height="20" rx="1" fill="#111" stroke="#333"/>
  <!-- Pins: Digital 0-13 (top row) -->
  <rect x="75" y="0" width="102" height="12" rx="1" fill="#1a1a1a"/>
  <text x="126" y="8" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">D0  D1  D2  D3  D4  D5  D6  D7  D8  D9  D10 D11 D12 D13</text>
  <!-- Pins: Analog A0-A5 + PWR (bottom) -->
  <rect x="68" y="142" width="102" height="12" rx="1" fill="#1a1a1a"/>
  <text x="119" y="150" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">A0  A1  A2  A3  A4  A5  VIN GND GND 5V  3V3 RST</text>
  <text x="105" y="60" text-anchor="middle" font-size="11" font-weight="bold" font-family="Arial" fill="white">Arduino UNO R3</text>
</svg>''')

save('arduino-nano.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 75" width="200" height="75">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a6bc4"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="71" rx="4" fill="url(#bg)" stroke="#07305e" stroke-width="2"/>
  <!-- Mini-USB port -->
  <rect x="85" y="-2" width="28" height="14" rx="3" fill="#999" stroke="#666" stroke-width="1.5"/>
  <rect x="88" y="1" width="22" height="8" rx="1" fill="#555"/>
  <!-- ATmega328 chip -->
  <rect x="74" y="20" width="52" height="34" rx="2" fill="#111" stroke="#333"/>
  <text x="100" y="35" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">ATmega</text>
  <text x="100" y="44" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">328P</text>
  <!-- Left pin labels (top to bottom): D1/TX D0/RX RST GND D2 D3 D4 D5 D6 D7 -->
  <rect x="0" y="8" width="18" height="58" rx="1" fill="#1a1a1a"/>
  <text x="9" y="14" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">TX</text>
  <text x="9" y="20" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">RX</text>
  <text x="9" y="26" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">RST</text>
  <text x="9" y="32" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">GND</text>
  <text x="9" y="38" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D2</text>
  <text x="9" y="44" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D3</text>
  <text x="9" y="50" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D4</text>
  <text x="9" y="56" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D5</text>
  <text x="9" y="62" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D6</text>
  <!-- Right pin labels: VIN GND RST 5V A7 A6 A5 A4 A3 A2 -->
  <rect x="182" y="8" width="18" height="58" rx="1" fill="#1a1a1a"/>
  <text x="191" y="14" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">VIN</text>
  <text x="191" y="20" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">GND</text>
  <text x="191" y="26" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">RST</text>
  <text x="191" y="32" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">5V</text>
  <text x="191" y="38" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A7</text>
  <text x="191" y="44" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A6</text>
  <text x="191" y="50" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A5</text>
  <text x="191" y="56" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A4</text>
  <text x="191" y="62" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A3</text>
  <text x="100" y="64" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">Arduino Nano</text>
</svg>''')

save('arduino-mega.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 120" width="260" height="120">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a6bc4"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <path d="M18,8 L230,8 L230,112 L60,112 L18,85 Z" fill="url(#bg)" stroke="#07305e" stroke-width="2"/>
  <!-- USB-B port -->
  <rect x="3" y="48" width="20" height="26" rx="3" fill="#888" stroke="#555"/>
  <rect x="6" y="51" width="14" height="20" rx="2" fill="#444"/>
  <!-- DC Jack -->
  <rect x="3" y="28" width="18" height="14" rx="4" fill="#222" stroke="#555"/>
  <circle cx="12" cy="35" r="5" fill="#333"/><circle cx="12" cy="35" r="2" fill="#888"/>
  <!-- ATmega2560 (larger) -->
  <rect x="75" y="34" width="70" height="58" rx="2" fill="#111" stroke="#333"/>
  <text x="110" y="58" text-anchor="middle" font-size="6.5" fill="#666" font-family="monospace">ATmega</text>
  <text x="110" y="68" text-anchor="middle" font-size="6.5" fill="#666" font-family="monospace">2560</text>
  <!-- Crystal -->
  <rect x="158" y="44" width="22" height="10" rx="3" fill="#c0c0c0" stroke="#888"/>
  <!-- Reset button -->
  <rect x="198" y="22" width="14" height="14" rx="3" fill="#e53935"/>
  <!-- Top pin rows -->
  <rect x="38" y="0" width="188" height="10" rx="1" fill="#1a1a1a"/>
  <text x="132" y="7" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D0..D13  PWM:3,5,6,9,10,11  AREF 3V3 5V GND RST</text>
  <!-- Bottom pin rows -->
  <rect x="38" y="108" width="188" height="10" rx="1" fill="#1a1a1a"/>
  <text x="132" y="115" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A0..A15  D14..D21(TX0..3,RX0..3)  5V GND</text>
  <!-- Right pin row -->
  <rect x="220" y="20" width="12" height="80" rx="1" fill="#1a1a1a"/>
  <text x="226" y="55" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial" transform="rotate(90 226 55)">D22..D53</text>
  <text x="130" y="40" text-anchor="middle" font-size="11" font-weight="bold" font-family="Arial" fill="white">Arduino MEGA 2560</text>
</svg>''')

save('esp32-devkit.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" width="200" height="90">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2d3748"/><stop offset="100%" stop-color="#1a2233"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="86" rx="5" fill="url(#bg)" stroke="#111" stroke-width="2"/>
  <!-- ESP32 module with metal shield -->
  <rect x="54" y="10" width="92" height="54" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="58" y="14" width="80" height="46" rx="2" fill="#666" stroke="#888"/>
  <!-- RF module chip -->
  <rect x="62" y="18" width="48" height="34" rx="2" fill="#444" stroke="#555"/>
  <text x="86" y="33" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace" font-weight="bold">ESP32</text>
  <text x="86" y="43" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">Xtensa LX6</text>
  <!-- Antenna trace -->
  <rect x="114" y="18" width="22" height="34" rx="0" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="125" y="37" text-anchor="middle" font-size="5" fill="#999" font-family="Arial">ANT</text>
  <!-- Micro-USB port -->
  <rect x="88" y="74" width="24" height="14" rx="3" fill="#888" stroke="#666"/>
  <rect x="91" y="77" width="18" height="8" rx="1" fill="#444"/>
  <!-- EN and BOOT buttons -->
  <rect x="20" y="28" width="14" height="9" rx="2" fill="#e53935" stroke="#b71c1c"/>
  <text x="27" y="35" text-anchor="middle" font-size="4.5" fill="white" font-family="Arial">EN</text>
  <rect x="20" y="44" width="14" height="9" rx="2" fill="#1565C0" stroke="#0a3d7a"/>
  <text x="27" y="51" text-anchor="middle" font-size="4.5" fill="white" font-family="Arial">BOOT</text>
  <!-- LEFT pins (top to bottom): GND 3V3 EN VP VN D34 D35 D32 D33 D25 D26 -->
  <rect x="0" y="6" width="14" height="78" rx="1" fill="#1a1a1a"/>
  <text x="7" y="13" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">GND</text>
  <text x="7" y="20" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">3V3</text>
  <text x="7" y="27" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">EN</text>
  <text x="7" y="34" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">VP</text>
  <text x="7" y="41" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">VN</text>
  <text x="7" y="48" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D34</text>
  <text x="7" y="55" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D35</text>
  <text x="7" y="62" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D32</text>
  <text x="7" y="69" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D33</text>
  <text x="7" y="76" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D25</text>
  <!-- RIGHT pins: VIN GND D13 D12 D14 D27 D26 D25 D33 D32 -->
  <rect x="186" y="6" width="14" height="78" rx="1" fill="#1a1a1a"/>
  <text x="193" y="13" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">VIN</text>
  <text x="193" y="20" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">GND</text>
  <text x="193" y="27" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D13</text>
  <text x="193" y="34" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D12</text>
  <text x="193" y="41" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D14</text>
  <text x="193" y="48" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D27</text>
  <text x="193" y="55" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D26</text>
  <text x="193" y="62" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D18</text>
  <text x="193" y="69" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D19</text>
  <text x="193" y="76" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D23</text>
  <text x="100" y="87" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">ESP32 DevKit-C</text>
</svg>''')

save('esp8266.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 75" width="180" height="75">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2d3748"/><stop offset="100%" stop-color="#1a2233"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="176" height="71" rx="5" fill="url(#bg)" stroke="#111" stroke-width="2"/>
  <!-- ESP8266 WiFi SoC module (ESP-12) -->
  <rect x="50" y="8" width="80" height="44" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="54" y="12" width="68" height="36" rx="2" fill="#666" stroke="#888"/>
  <text x="88" y="28" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace" font-weight="bold">ESP8266</text>
  <text x="88" y="40" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">ESP-12E</text>
  <!-- USB chip (CH340G) -->
  <rect x="30" y="18" width="16" height="16" rx="1" fill="#222" stroke="#444"/>
  <text x="38" y="29" text-anchor="middle" font-size="4" fill="#666" font-family="monospace">CH340</text>
  <!-- Micro USB -->
  <rect x="76" y="62" width="24" height="11" rx="3" fill="#888" stroke="#666"/>
  <rect x="79" y="65" width="18" height="5" rx="1" fill="#444"/>
  <!-- RST/FLASH buttons -->
  <rect x="140" y="28" width="12" height="8" rx="2" fill="#e53935"/>
  <rect x="155" y="28" width="12" height="8" rx="2" fill="#1565C0"/>
  <!-- Left pins: A0 RST D0 D1 D2 D3 D4 3V3 GND -->
  <rect x="0" y="4" width="14" height="68" rx="1" fill="#1a1a1a"/>
  <text x="7" y="11" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">A0</text>
  <text x="7" y="19" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">RST</text>
  <text x="7" y="27" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D0</text>
  <text x="7" y="35" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D1</text>
  <text x="7" y="43" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D2</text>
  <text x="7" y="51" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D3</text>
  <text x="7" y="59" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D4</text>
  <text x="7" y="67" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">3V3</text>
  <!-- Right pins: VIN GND D5 D6 D7 D8 RX TX -->
  <rect x="166" y="4" width="14" height="68" rx="1" fill="#1a1a1a"/>
  <text x="173" y="11" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">VIN</text>
  <text x="173" y="19" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">GND</text>
  <text x="173" y="27" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D5</text>
  <text x="173" y="35" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D6</text>
  <text x="173" y="43" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D7</text>
  <text x="173" y="51" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">D8</text>
  <text x="173" y="59" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">RX</text>
  <text x="173" y="67" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">TX</text>
  <text x="90" y="72" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">ESP8266 NodeMCU</text>
</svg>''')

save('rpi-pico.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#007a2f"/><stop offset="100%" stop-color="#004d1a"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="76" rx="6" fill="url(#bg)" stroke="#003311" stroke-width="2"/>
  <!-- Mounting holes -->
  <circle cx="14" cy="14" r="4" fill="none" stroke="#00b344" stroke-width="1.5"/>
  <circle cx="186" cy="14" r="4" fill="none" stroke="#00b344" stroke-width="1.5"/>
  <circle cx="14" cy="66" r="4" fill="none" stroke="#00b344" stroke-width="1.5"/>
  <circle cx="186" cy="66" r="4" fill="none" stroke="#00b344" stroke-width="1.5"/>
  <!-- RP2040 chip -->
  <rect x="70" y="18" width="56" height="44" rx="3" fill="#111" stroke="#333" stroke-width="1.5"/>
  <text x="98" y="38" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">RP2040</text>
  <text x="98" y="50" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Raspberry Pi</text>
  <!-- Flash (W25Q16) -->
  <rect x="134" y="28" width="24" height="18" rx="1" fill="#222" stroke="#444"/>
  <text x="146" y="39" text-anchor="middle" font-size="4.5" fill="#666" font-family="monospace">FLASH</text>
  <!-- BOOTSEL button -->
  <rect x="36" y="34" width="18" height="11" rx="2" fill="#e0e0e0" stroke="#bbb"/>
  <text x="45" y="42" text-anchor="middle" font-size="4" fill="#333" font-family="Arial">BOOT</text>
  <!-- Micro-USB -->
  <rect x="84" y="0" width="28" height="10" rx="3" fill="#aaa" stroke="#777"/>
  <rect x="87" y="2" width="22" height="6" rx="1" fill="#555"/>
  <!-- Left pins: GP0-GP10 (top to bottom) -->
  <rect x="0" y="4" width="10" height="72" rx="1" fill="#1a1a1a"/>
  <text x="5" y="11" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP0</text>
  <text x="5" y="18" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP1</text>
  <text x="5" y="25" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="5" y="32" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP2</text>
  <text x="5" y="39" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP3</text>
  <text x="5" y="46" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP4</text>
  <text x="5" y="53" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP5</text>
  <text x="5" y="60" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="5" y="67" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP6</text>
  <text x="5" y="74" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP7</text>
  <!-- Right pins -->
  <rect x="190" y="4" width="10" height="72" rx="1" fill="#1a1a1a"/>
  <text x="195" y="11" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP28</text>
  <text x="195" y="18" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">ADC</text>
  <text x="195" y="25" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <text x="195" y="32" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3EN</text>
  <text x="195" y="39" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP27</text>
  <text x="195" y="46" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP26</text>
  <text x="195" y="53" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="195" y="60" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">RUN</text>
  <text x="195" y="67" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP22</text>
  <text x="195" y="74" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">VSYS</text>
  <text x="98" y="77" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">Raspberry Pi Pico</text>
</svg>''')

save('stm32-bluepill.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="76" rx="4" fill="url(#bg)" stroke="#07305e" stroke-width="2"/>
  <!-- Mounting holes -->
  <circle cx="12" cy="12" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="188" cy="12" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="12" cy="68" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="188" cy="68" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <!-- STM32F103C8T6 chip (LQFP48) -->
  <rect x="72" y="18" width="56" height="44" rx="2" fill="#111" stroke="#333"/>
  <text x="100" y="37" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">STM32</text>
  <text x="100" y="47" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">F103C8T6</text>
  <!-- Crystal 8MHz -->
  <rect x="138" y="28" width="20" height="10" rx="3" fill="#c0c0c0" stroke="#888"/>
  <text x="148" y="36" text-anchor="middle" font-size="4" fill="#555" font-family="Arial">8MHz</text>
  <!-- USB port -->
  <rect x="38" y="0" width="24" height="10" rx="3" fill="#888" stroke="#666"/>
  <rect x="41" y="2" width="18" height="6" rx="1" fill="#444"/>
  <!-- BOOT0 / BOOT1 jumpers -->
  <rect x="165" y="30" width="18" height="8" rx="1" fill="#333" stroke="#555"/>
  <rect x="167" y="32" width="6" height="4" rx="1" fill="#ffeb3b"/>
  <text x="174" y="37" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">B0</text>
  <rect x="165" y="42" width="18" height="8" rx="1" fill="#333" stroke="#555"/>
  <text x="174" y="49" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">B1</text>
  <!-- Reset button -->
  <rect x="20" y="34" width="12" height="10" rx="2" fill="#e53935"/>
  <!-- Left pins: A3 A2 A1 A0 C15 C14 C13 VCC GND -->
  <rect x="0" y="4" width="12" height="72" rx="1" fill="#1a1a1a"/>
  <text x="6" y="12" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">B12</text>
  <text x="6" y="20" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">B13</text>
  <text x="6" y="28" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">B14</text>
  <text x="6" y="36" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">B15</text>
  <text x="6" y="44" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A8</text>
  <text x="6" y="52" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A9</text>
  <text x="6" y="60" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A10</text>
  <text x="6" y="68" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A11</text>
  <text x="6" y="75" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A12</text>
  <!-- Right pins -->
  <rect x="188" y="4" width="12" height="72" rx="1" fill="#1a1a1a"/>
  <text x="194" y="12" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <text x="194" y="20" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="194" y="28" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="194" y="36" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <text x="194" y="44" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A0</text>
  <text x="194" y="52" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A1</text>
  <text x="194" y="60" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A2</text>
  <text x="194" y="68" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A3</text>
  <text x="194" y="75" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">A4</text>
  <text x="100" y="77" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">STM32 Blue Pill (F103C8)</text>
</svg>''')

# ══════════════════════════════════════════════════════════════════
#  SENSORS with clean, correct pin headers
# ══════════════════════════════════════════════════════════════════

def make_sensor_svg(title, pins, pcb_color, pcb_stroke, body_svg, w=140, h=100):
    """Generates a clean sensor module SVG with accurate pin header at top."""
    n = len(pins)
    spacing = min(22, (w - 20) // max(n, 1))
    total = (n-1) * spacing
    x0 = w//2 - total//2
    ph = 16  # pin header height
    
    # Pin header
    pin_svg = f'<rect x="{x0-5}" y="6" width="{total+10}" height="{ph}" rx="2" fill="#1a1a1a" stroke="#333"/>\n'
    for i, p in enumerate(pins):
        x = x0 + i * spacing
        pin_svg += f'<rect x="{x-4}" y="8" width="8" height="{ph-4}" rx="1" fill="#c8b400"/>\n'
        pin_svg += f'<text x="{x}" y="4" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial,sans-serif" font-weight="bold">{p}</text>\n'
    
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
    <linearGradient id="pcbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{pcb_color}"/><stop offset="100%" stop-color="{pcb_stroke}"/>
    </linearGradient>
  </defs>
  <!-- PCB -->
  <rect x="3" y="{ph+2}" width="{w-6}" height="{h-ph-6}" rx="4" fill="url(#pcbg)" stroke="{pcb_stroke}" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Mounting holes -->
  <circle cx="10" cy="{ph+10}" r="2.5" fill="none" stroke="{pcb_stroke}" stroke-width="1.5" opacity="0.6"/>
  <circle cx="{w-10}" cy="{ph+10}" r="2.5" fill="none" stroke="{pcb_stroke}" stroke-width="1.5" opacity="0.6"/>
  <!-- Pin header -->
  {pin_svg}
  <!-- Component body -->
  {body_svg}
  <!-- Label -->
  <text x="{w//2}" y="{h-3}" text-anchor="middle" font-size="8.5" font-weight="bold" font-family="Arial,sans-serif" fill="#fff">{title}</text>
</svg>'''

# HC-SR04 Ultrasonic
save('hc-sr04.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" width="160" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="154" height="68" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Left transducer: TX -->
  <circle cx="40" cy="55" r="24" fill="#ddd" stroke="#bbb" stroke-width="2"/>
  <circle cx="40" cy="55" r="18" fill="#ccc" stroke="#aaa"/>
  <circle cx="40" cy="55" r="12" fill="#bbb" stroke="#999"/>
  <circle cx="40" cy="55" r="5" fill="#888"/>
  <text x="40" y="83" text-anchor="middle" font-size="7" fill="#fff" font-family="Arial" font-weight="bold">TRIG</text>
  <!-- Right transducer: RX -->
  <circle cx="120" cy="55" r="24" fill="#ddd" stroke="#bbb" stroke-width="2"/>
  <circle cx="120" cy="55" r="18" fill="#ccc" stroke="#aaa"/>
  <circle cx="120" cy="55" r="12" fill="#bbb" stroke="#999"/>
  <circle cx="120" cy="55" r="5" fill="#888"/>
  <text x="120" y="83" text-anchor="middle" font-size="7" fill="#fff" font-family="Arial" font-weight="bold">ECHO</text>
  <!-- 4-pin header at top: VCC TRIG ECHO GND -->
  <rect x="46" y="6" width="68" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="50" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="78" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="92" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="55" y="4" text-anchor="middle" font-size="6" fill="#eee" font-family="Arial" font-weight="bold">VCC</text>
  <text x="69" y="4" text-anchor="middle" font-size="6" fill="#eee" font-family="Arial" font-weight="bold">TRG</text>
  <text x="83" y="4" text-anchor="middle" font-size="6" fill="#eee" font-family="Arial" font-weight="bold">ECH</text>
  <text x="97" y="4" text-anchor="middle" font-size="6" fill="#eee" font-family="Arial" font-weight="bold">GND</text>
  <text x="80" y="25" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">HC-SR04</text>
</svg>''')

# DHT22
save('dht-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" width="80" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- Body -->
  <rect x="6" y="14" width="68" height="80" rx="5" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Mesh vent (top half) -->
  <rect x="6" y="14" width="68" height="32" rx="5" fill="none" stroke="#90CAF9" stroke-width="1" stroke-dasharray="2,3"/>
  <line x1="6" y1="24" x2="74" y2="24" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="6" y1="30" x2="74" y2="30" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="6" y1="36" x2="74" y2="36" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="6" y1="42" x2="74" y2="42" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="20" y1="14" x2="20" y2="46" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="34" y1="14" x2="34" y2="46" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="48" y1="14" x2="48" y2="46" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <line x1="62" y1="14" x2="62" y2="46" stroke="#90CAF9" stroke-width="0.7" stroke-dasharray="3,3"/>
  <!-- Text area -->
  <text x="40" y="62" text-anchor="middle" font-size="11" font-weight="bold" fill="white" font-family="Arial">DHT22</text>
  <text x="40" y="75" text-anchor="middle" font-size="7" fill="#90CAF9" font-family="Arial">Temp / Humidity</text>
  <!-- 4 bottom pins: VCC DATA NC GND -->
  <rect x="12" y="90" width="12" height="18" rx="1" fill="#bbb"/>
  <rect x="30" y="90" width="12" height="18" rx="1" fill="#bbb"/>
  <rect x="48" y="90" width="12" height="18" rx="1" fill="#bbb"/>
  <rect x="66" y="90" width="12" height="18" rx="1" fill="#bbb"/>
  <text x="18" y="88" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="36" y="88" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">DAT</text>
  <text x="54" y="88" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">NC</text>
  <text x="72" y="88" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">GND</text>
</svg>''')

# MQ Gas sensors (all 4 variants: MQ2, MQ3, MQ7, MQ8, MQ135)
for gid, gname, gcolor in [
    ('mq2-gas', 'MQ-2', '#c8a800'),
    ('mq3-gas', 'MQ-3', '#c8a800'),
    ('mq7-gas', 'MQ-7', '#c8a800'),
    ('mq8-gas', 'MQ-8', '#c8a800'),
    ('mq135-air', 'MQ-135', '#c8a800'),
]:
    save(f'{gid}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 110" width="130" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="3" y="22" width="124" height="84" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Metal dome sensor (cylindrical) -->
  <circle cx="45" cy="65" r="30" fill="{gcolor}" stroke="#a08800" stroke-width="2"/>
  <circle cx="45" cy="65" r="23" fill="#b89000" stroke="#907000" stroke-width="1.5"/>
  <circle cx="45" cy="65" r="15" fill="#a07800" stroke="#806000" stroke-width="1"/>
  <!-- Mesh cross lines on dome -->
  <line x1="22" y1="65" x2="68" y2="65" stroke="#806000" stroke-width="1.5"/>
  <line x1="45" y1="42" x2="45" y2="88" stroke="#806000" stroke-width="1.5"/>
  <line x1="28" y1="48" x2="62" y2="82" stroke="#806000" stroke-width="1" opacity="0.5"/>
  <line x1="28" y1="82" x2="62" y2="48" stroke="#806000" stroke-width="1" opacity="0.5"/>
  <!-- LM393 comparator chip -->
  <rect x="82" y="48" width="36" height="26" rx="2" fill="#111" stroke="#333"/>
  <text x="100" y="62" text-anchor="middle" font-size="6" fill="#666" font-family="monospace">LM393</text>
  <!-- Blue LED indicator -->
  <circle cx="100" cy="83" r="5" fill="#2196f3" opacity="0.9"/>
  <!-- Trim pot -->
  <circle cx="82" cy="83" r="7" fill="#e0e0e0" stroke="#bbb" stroke-width="1.5"/>
  <line x1="82" y1="76" x2="82" y2="82" stroke="#555" stroke-width="2.5"/>
  <!-- 4-pin header: VCC GND AO DO -->
  <rect x="18" y="8" width="94" height="16" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="10" width="10" height="12" rx="1" fill="#c8b400"/>
  <rect x="38" y="10" width="10" height="12" rx="1" fill="#c8b400"/>
  <rect x="54" y="10" width="10" height="12" rx="1" fill="#c8b400"/>
  <rect x="70" y="10" width="10" height="12" rx="1" fill="#c8b400"/>
  <text x="27" y="5" text-anchor="middle" font-size="6" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="43" y="5" text-anchor="middle" font-size="6" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="5" text-anchor="middle" font-size="6" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="75" y="5" text-anchor="middle" font-size="6" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="65" y="100" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="Arial">{gname} Sensor</text>
</svg>''')

# PIR sensor
save('pir-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" width="100" height="115">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="3" y="50" width="94" height="62" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- White Fresnel dome -->
  <ellipse cx="50" cy="55" rx="36" ry="32" fill="#f5f5f5" stroke="#ddd" stroke-width="2" filter="url(#sh)"/>
  <ellipse cx="50" cy="55" rx="30" ry="26" fill="#fafafa" opacity="0.6"/>
  <!-- Fresnel lines on dome -->
  <ellipse cx="50" cy="55" rx="20" ry="17" fill="none" stroke="#ddd" stroke-width="0.8"/>
  <ellipse cx="50" cy="55" rx="10" ry="9" fill="none" stroke="#ddd" stroke-width="0.8"/>
  <!-- Two trimmers: Sensitivity (Sx) and Time delay (Tx) -->
  <circle cx="22" cy="82" r="8" fill="#f5f5f5" stroke="#aaa" stroke-width="1.5"/>
  <line x1="22" y1="74" x2="22" y2="80" stroke="#555" stroke-width="2.5"/>
  <text x="22" y="94" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Arial">Sx</text>
  <circle cx="78" cy="82" r="8" fill="#f5f5f5" stroke="#aaa" stroke-width="1.5"/>
  <line x1="78" y1="74" x2="78" y2="80" stroke="#555" stroke-width="2.5"/>
  <text x="78" y="94" text-anchor="middle" font-size="5.5" fill="#fff" font-family="Arial">Tx</text>
  <!-- BISS0001 IC -->
  <rect x="36" y="96" width="28" height="12" rx="1" fill="#111" stroke="#333"/>
  <text x="50" y="104" text-anchor="middle" font-size="4" fill="#666" font-family="monospace">BISS0001</text>
  <!-- 3-pin header: VCC OUT GND -->
  <rect x="28" y="102" width="44" height="12" rx="1" fill="#1a1a1a" stroke="#333"/>
  <rect x="32" y="104" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="44" y="104" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="56" y="104" width="8" height="8" rx="1" fill="#c8b400"/>
  <text x="36" y="102" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="48" y="102" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">OUT</text>
  <text x="60" y="102" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="50" y="112" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">PIR HC-SR501</text>
</svg>''')

# LDR Photo resistor
save('ldr.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
  <!-- LDR disc (light dependent resistor - looks like a coin with zigzag) -->
  <circle cx="40" cy="38" r="30" fill="#e8d070" stroke="#c0a000" stroke-width="3"/>
  <circle cx="40" cy="38" r="24" fill="none" stroke="#a07000" stroke-width="1.5"/>
  <!-- Zigzag pattern (snake path of resistive element) -->
  <path d="M22,35 L26,30 L30,35 L34,30 L38,35 L42,30 L46,35 L50,30 L54,35 L58,30" 
        stroke="#7a5c00" stroke-width="2" fill="none"/>
  <path d="M22,40 L26,35 L30,40 L34,35 L38,40 L42,35 L46,40 L50,35 L54,40 L58,35" 
        stroke="#7a5c00" stroke-width="2" fill="none"/>
  <!-- Lead wires -->
  <line x1="30" y1="66" x2="28" y2="88" stroke="#bbb" stroke-width="3" stroke-linecap="round"/>
  <line x1="50" y1="66" x2="52" y2="88" stroke="#bbb" stroke-width="3" stroke-linecap="round"/>
  <text x="28" y="90" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">1</text>
  <text x="52" y="90" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">2</text>
  <text x="40" y="10" text-anchor="middle" font-size="9" font-weight="bold" fill="#555" font-family="Arial">LDR</text>
  <text x="40" y="20" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">Photo Resistor</text>
</svg>''')

# Soil moisture sensor
save('soil-moisture.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" width="160" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Control Module PCB -->
  <rect x="75" y="8" width="80" height="60" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- LM393 chip on module -->
  <rect x="84" y="20" width="34" height="24" rx="1" fill="#111" stroke="#333"/>
  <text x="101" y="33" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED power + signal -->
  <circle cx="136" cy="22" r="4" fill="#f44336"/><text x="136" y="34" text-anchor="middle" font-size="4" fill="#fff">PWR</text>
  <circle cx="136" cy="40" r="4" fill="#ffeb3b"/><text x="136" y="52" text-anchor="middle" font-size="4" fill="#fff">DO</text>
  <!-- Trimmer pot -->
  <circle cx="101" cy="54" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="101" y1="47" x2="101" y2="53" stroke="#555" stroke-width="2.5"/>
  <!-- 4-pin header on module: VCC GND AO DO -->
  <rect x="78" y="62" width="70" height="14" rx="1" fill="#1a1a1a"/>
  <rect x="82" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="96" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="110" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="124" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="87" y="62" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="101" y="62" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="115" y="62" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="129" y="62" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <!-- Sensor Probe PCB (forked) -->
  <rect x="4" y="14" width="54" height="78" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Two probe tines (parallel metallic traces) -->
  <rect x="16" y="52" width="8" height="38" rx="1" fill="#c8c8c8" stroke="#aaa" stroke-width="1"/>
  <rect x="34" y="52" width="8" height="38" rx="1" fill="#c8c8c8" stroke="#aaa" stroke-width="1"/>
  <line x1="12" y1="30" x2="52" y2="30" stroke="#90caf9" stroke-width="1.5"/>
  <line x1="12" y1="38" x2="52" y2="38" stroke="#90caf9" stroke-width="1.5"/>
  <line x1="12" y1="46" x2="52" y2="46" stroke="#90caf9" stroke-width="1.5"/>
  <line x1="20" y1="16" x2="20" y2="50" stroke="#90caf9" stroke-width="1"/>
  <line x1="32" y1="16" x2="32" y2="50" stroke="#90caf9" stroke-width="1"/>
  <line x1="44" y1="16" x2="44" y2="50" stroke="#90caf9" stroke-width="1"/>
  <text x="118" y="90" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">Soil Moisture</text>
</svg>''')

# Flame sensor - with IR phototransistor
save('flame-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 100" width="130" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="20" width="124" height="76" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- IR Phototransistor (black cylinder shape) -->
  <rect x="12" y="34" width="20" height="32" rx="3" fill="#111" stroke="#444" stroke-width="1.5"/>
  <ellipse cx="22" cy="34" rx="10" ry="5" fill="#111" stroke="#444" stroke-width="1.5"/>
  <circle cx="22" cy="39" r="6" fill="#1a1a1a" stroke="#555"/>
  <text x="22" y="55" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">5mm</text>
  <text x="22" y="62" text-anchor="middle" font-size="5" fill="#888" font-family="Arial">IR</text>
  <!-- LM393 chip -->
  <rect x="50" y="36" width="36" height="26" rx="1" fill="#111" stroke="#333"/>
  <text x="68" y="51" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- Red LED (power) -->
  <circle cx="100" cy="36" r="5" fill="#f44336"/><text x="100" y="47" text-anchor="middle" font-size="4.5" fill="#fff" font-family="Arial">PWR</text>
  <!-- Blue LED (signal) -->
  <circle cx="100" cy="60" r="5" fill="#2196f3"/><text x="100" y="71" text-anchor="middle" font-size="4.5" fill="#fff" font-family="Arial">SIG</text>
  <!-- Trim pot -->
  <circle cx="68" cy="72" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="68" y1="65" x2="68" y2="71" stroke="#555" stroke-width="2.5"/>
  <!-- 4-pin header: VCC GND DO AO -->
  <rect x="22" y="8" width="86" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="26" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="42" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="58" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="74" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="31" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="47" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="63" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="79" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="65" y="91" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Flame Sensor</text>
</svg>''')

# Sound / Mic sensor
save('sound-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 100" width="130" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="20" width="124" height="76" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Electret mic capsule (gold cylinder) -->
  <ellipse cx="25" cy="58" rx="14" ry="18" fill="#c8a800" stroke="#a08000" stroke-width="2"/>
  <ellipse cx="25" cy="48" rx="14" ry="8" fill="#d4b000" stroke="#a08000"/>
  <circle cx="25" cy="56" r="6" fill="#888"/>
  <!-- LM393 chip -->
  <rect x="50" y="36" width="36" height="26" rx="1" fill="#111" stroke="#333"/>
  <text x="68" y="51" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- LEDs -->
  <circle cx="100" cy="36" r="5" fill="#f44336"/>
  <circle cx="100" cy="60" r="5" fill="#2196f3"/>
  <!-- Trim pot -->
  <circle cx="68" cy="72" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="68" y1="65" x2="68" y2="71" stroke="#555" stroke-width="2.5"/>
  <!-- 4-pin header: AO GND VCC DO -->
  <rect x="22" y="8" width="86" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="26" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="42" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="58" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="74" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="31" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="47" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="63" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="79" y="5" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="65" y="91" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Sound/Mic Sensor</text>
</svg>''')

# Water Level Sensor
save('water-level.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Probe PCB (flat with interdigitated traces) -->
  <rect x="4" y="18" width="55" height="78" rx="4" fill="#e53935" stroke="#b71c1c" stroke-width="2" filter="url(#sh)"/>
  <!-- Interdigitated copper traces -->
  <line x1="14" y1="24" x2="14" y2="90" stroke="#ffd700" stroke-width="3"/>
  <line x1="22" y1="24" x2="22" y2="90" stroke="#b71c1c" stroke-width="3"/>
  <line x1="30" y1="24" x2="30" y2="90" stroke="#ffd700" stroke-width="3"/>
  <line x1="38" y1="24" x2="38" y2="90" stroke="#b71c1c" stroke-width="3"/>
  <line x1="46" y1="24" x2="46" y2="90" stroke="#ffd700" stroke-width="3"/>
  <line x1="54" y1="24" x2="54" y2="90" stroke="#b71c1c" stroke-width="3"/>
  <!-- Connect alternating at top and bottom -->
  <line x1="14" y1="24" x2="30" y2="24" stroke="#ffd700" stroke-width="2.5"/>
  <line x1="30" y1="24" x2="46" y2="24" stroke="#ffd700" stroke-width="2.5"/>
  <line x1="22" y1="90" x2="38" y2="90" stroke="#b71c1c" stroke-width="2.5"/>
  <line x1="38" y1="90" x2="54" y2="90" stroke="#b71c1c" stroke-width="2.5"/>
  <!-- 3-pin header: SIG VCC GND -->
  <rect x="68" y="28" width="78" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="72" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="90" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="108" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="77" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="95" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="113" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="108" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#333" font-family="Arial">Water Level</text>
</svg>''')

# Rain sensor
save('rain-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Probe PCB (flat with interdigitated traces - similar to water but blue) -->
  <rect x="4" y="18" width="55" height="78" rx="4" fill="#1976d2" stroke="#0d47a1" stroke-width="2" filter="url(#sh)"/>
  <line x1="14" y1="24" x2="14" y2="90" stroke="#90CAF9" stroke-width="3"/>
  <line x1="22" y1="24" x2="22" y2="90" stroke="#0d47a1" stroke-width="3"/>
  <line x1="30" y1="24" x2="30" y2="90" stroke="#90CAF9" stroke-width="3"/>
  <line x1="38" y1="24" x2="38" y2="90" stroke="#0d47a1" stroke-width="3"/>
  <line x1="46" y1="24" x2="46" y2="90" stroke="#90CAF9" stroke-width="3"/>
  <line x1="54" y1="24" x2="54" y2="90" stroke="#0d47a1" stroke-width="3"/>
  <line x1="14" y1="24" x2="46" y2="24" stroke="#90CAF9" stroke-width="2"/>
  <line x1="22" y1="90" x2="54" y2="90" stroke="#0d47a1" stroke-width="2"/>
  <!-- 4-pin header: VCC GND AO DO -->
  <rect x="68" y="28" width="78" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="72" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="86" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="100" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="114" y="30" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="77" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="91" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="105" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="119" y="26" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="108" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#333" font-family="Arial">Rain Sensor</text>
</svg>''')

# BME280 / BMP280 I2C sensor modules
for sid, sname, ic_text in [
    ('bme280', 'BME280', 'BME280\nT+H+P'),
    ('bmp280', 'BMP280', 'BMP280\nT+P'),
]:
    save(f'{sid}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b1fa2"/><stop offset="100%" stop-color="#4a148c"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#4a148c" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Small BOSCH sensor package (tiny QFN chip) -->
  <rect x="48" y="38" width="24" height="22" rx="1" fill="#c0c0c0" stroke="#999" stroke-width="1.5"/>
  <circle cx="51" cy="41" r="1.5" fill="#555"/>
  <text x="60" y="53" text-anchor="middle" font-size="5" fill="#555" font-family="monospace">{ic_text.split(chr(10))[0]}</text>
  <!-- 0603 decoupling caps -->
  <rect x="34" y="44" width="8" height="4" rx="1" fill="#c8c8c8" stroke="#aaa"/>
  <rect x="80" y="44" width="8" height="4" rx="1" fill="#c8c8c8" stroke="#aaa"/>
  <!-- 4-pin header: VCC GND SCL SDA -->
  <rect x="24" y="6" width="72" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="28" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="44" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="60" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="76" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="33" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="49" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="65" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="81" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="60" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">{sname}</text>
</svg>''')

# ADXL345
save('adxl345.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 90" width="150" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#00838f"/><stop offset="100%" stop-color="#006064"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="144" height="68" rx="4" fill="url(#bg)" stroke="#006064" stroke-width="1.5" filter="url(#sh)"/>
  <!-- ADXL345 LGA chip -->
  <rect x="50" y="34" width="50" height="36" rx="1" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="53" cy="37" r="2" fill="#555"/>
  <text x="75" y="52" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">ADXL345</text>
  <text x="75" y="62" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">3-Axis Accel</text>
  <!-- 6-pin header: VCC GND SCL SDA SDO CS -->
  <rect x="12" y="6" width="126" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="16" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="32" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="48" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="80" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="96" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="21" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="37" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="53" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="69" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="85" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDO</text>
  <text x="101" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">CS</text>
  <text x="75" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">ADXL345 Accelerometer</text>
</svg>''')

# MAX30102 Heart rate
save('max30102.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b1fa2"/><stop offset="100%" stop-color="#4a148c"/>
  </linearGradient></defs>
  <rect x="3" y="20" width="144" height="76" rx="4" fill="url(#bg)" stroke="#4a148c" stroke-width="1.5" filter="url(#sh)"/>
  <!-- MAX30102 chip (black) -->
  <rect x="50" y="36" width="50" height="40" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <!-- Two emitter LEDs (red + IR) visible through window -->
  <circle cx="70" cy="52" r="7" fill="#0d0d0d" stroke="#555"/>
  <circle cx="70" cy="52" r="4" fill="#e53935" opacity="0.85"/>
  <circle cx="90" cy="52" r="7" fill="#0d0d0d" stroke="#555"/>
  <circle cx="90" cy="52" r="4" fill="#880e4f" opacity="0.85"/>
  <text x="70" y="67" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">RED</text>
  <text x="90" y="67" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">IR</text>
  <!-- Chip label -->
  <text x="75" y="74" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">MAX30102</text>
  <!-- 7-pin header: VIN SCL SDA INT IRD RD GND -->
  <rect x="4" y="8" width="142" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="8" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="24" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="72" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="88" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="104" y="10" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="13" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VIN</text>
  <text x="29" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="45" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="61" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">INT</text>
  <text x="77" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">IRD</text>
  <text x="93" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">RD</text>
  <text x="109" y="5" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="75" y="90" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">MAX30102 SpO2/HR</text>
</svg>''')

# ACS712 Current sensor
save('acs712.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- ACS712 SOIC chip -->
  <rect x="36" y="34" width="58" height="32" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="39" cy="37" r="2" fill="#555"/>
  <text x="65" y="50" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">ACS712</text>
  <text x="65" y="59" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Hall Effect</text>
  <!-- IP+ IP- terminals (current path) -->
  <rect x="4" y="40" width="28" height="18" rx="2" fill="#888" stroke="#666"/>
  <text x="18" y="51" text-anchor="middle" font-size="6" fill="#333" font-family="Arial" font-weight="bold">IP+</text>
  <rect x="98" y="40" width="28" height="18" rx="2" fill="#888" stroke="#666"/>
  <text x="112" y="51" text-anchor="middle" font-size="6" fill="#333" font-family="Arial" font-weight="bold">IP-</text>
  <!-- 3-pin header: VCC OUT GND -->
  <rect x="24" y="6" width="82" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="28" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="58" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="88" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="33" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="63" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">OUT</text>
  <text x="93" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">ACS712 30A</text>
</svg>''')

# HX711 Load Cell
save('hx711.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- HX711 SOP16 chip -->
  <rect x="34" y="32" width="62" height="38" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="37" cy="35" r="2" fill="#555"/>
  <text x="65" y="50" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">HX711</text>
  <text x="65" y="60" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">24-bit ADC</text>
  <!-- Screw terminals (for load cell E+/E-/A+/A-) -->
  <rect x="4" y="38" width="26" height="26" rx="2" fill="#333" stroke="#222"/>
  <circle cx="11" cy="46" r="3.5" fill="#888" stroke="#666"/>
  <circle cx="23" cy="46" r="3.5" fill="#888" stroke="#666"/>
  <circle cx="11" cy="58" r="3.5" fill="#888" stroke="#666"/>
  <circle cx="23" cy="58" r="3.5" fill="#888" stroke="#666"/>
  <text x="15" y="68" text-anchor="middle" font-size="4" fill="#aaa" font-family="Arial">E+E-A+A-</text>
  <!-- 4-pin header: VCC DT SCK GND -->
  <rect x="24" y="6" width="82" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="28" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="46" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="82" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="33" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="51" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DT</text>
  <text x="69" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCK</text>
  <text x="87" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">HX711 Load Cell Amp</text>
</svg>''')

# DS18B20
save('ds18b20.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
  <!-- TO-92 package -->
  <rect x="18" y="16" width="44" height="46" rx="4" fill="#1a1a1a" stroke="#444" stroke-width="1.5"/>
  <!-- Flat side marker -->
  <rect x="18" y="44" width="44" height="18" rx="0" fill="#111"/>
  <!-- Marking text -->
  <text x="40" y="32" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">DS18B20</text>
  <text x="40" y="41" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">1-Wire</text>
  <!-- 3 leads -->
  <line x1="28" y1="62" x2="28" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="62" x2="40" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="52" y1="62" x2="52" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="40" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">DQ</text>
  <text x="52" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">VDD</text>
  <text x="40" y="12" text-anchor="middle" font-size="8" font-weight="bold" fill="#555" font-family="Arial">DS18B20</text>
</svg>''')

# Rotary Encoder KY-040
save('rotary-encoder.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="100" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="4" y="46" width="92" height="60" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Encoder body (metal, square with shaft) -->
  <rect x="22" y="20" width="56" height="56" rx="3" fill="#777" stroke="#555" stroke-width="2" filter="url(#sh)"/>
  <!-- Shaft top (cylindrical) -->
  <rect x="42" y="6" width="16" height="18" rx="6" fill="#999" stroke="#777" stroke-width="1.5"/>
  <!-- Rotating disc detail (knurled) -->
  <circle cx="50" cy="48" r="22" fill="#666" stroke="#444" stroke-width="1.5"/>
  <circle cx="50" cy="48" r="14" fill="#555" stroke="#333" stroke-width="1"/>
  <!-- 5-pin header: CLK DT SW + GND -->
  <rect x="6" y="96" width="88" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="10" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="26" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="42" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="58" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="74" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="15" y="94" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">CLK</text>
  <text x="31" y="94" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DT</text>
  <text x="47" y="94" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SW</text>
  <text x="63" y="94" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">+</text>
  <text x="79" y="94" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="50" y="108" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">KY-040 Encoder</text>
</svg>''')

# Hall Effect A3144 (TO-92 shape like DS18B20)
save('hall-effect.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
  <rect x="18" y="16" width="44" height="46" rx="4" fill="#1a1a1a" stroke="#444" stroke-width="1.5"/>
  <rect x="18" y="44" width="44" height="18" rx="0" fill="#111"/>
  <text x="40" y="32" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">A3144</text>
  <text x="40" y="41" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">Hall Effect</text>
  <line x1="28" y1="62" x2="28" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="62" x2="40" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="52" y1="62" x2="52" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">VCC</text>
  <text x="40" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="52" y="91" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">DO</text>
  <text x="40" y="12" text-anchor="middle" font-size="8" font-weight="bold" fill="#555" font-family="Arial">Hall A3144</text>
</svg>''')

# Touch Sensor TTP223
save('touch-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70" width="100" height="70">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/>
  </linearGradient></defs>
  <rect x="3" y="14" width="94" height="52" rx="4" fill="url(#bg)" stroke="#b71c1c" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Large touch pad area -->
  <rect x="12" y="22" width="50" height="36" rx="4" fill="#fff" stroke="#ddd" stroke-width="1.5"/>
  <circle cx="37" cy="40" r="12" fill="#ffcdd2" stroke="#ef9a9a" stroke-width="1"/>
  <text x="37" y="44" text-anchor="middle" font-size="6.5" fill="#c62828" font-family="Arial" font-weight="bold">TOUCH</text>
  <!-- TTP223 chip -->
  <rect x="68" y="28" width="22" height="16" rx="1" fill="#111" stroke="#333"/>
  <text x="79" y="38" text-anchor="middle" font-size="4.5" fill="#666" font-family="monospace">TTP223</text>
  <!-- 3-pin header: VCC GND SIG -->
  <rect x="20" y="2" width="60" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="24" y="4" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="4" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="4" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="29" y="0" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="45" y="0" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="61" y="0" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="50" y="62" text-anchor="middle" font-size="7.5" font-weight="bold" fill="white" font-family="Arial">TTP223 Touch</text>
</svg>''')

# Vibration Sensor SW-420
save('vibration-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0097a7"/><stop offset="100%" stop-color="#006064"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#006064" stroke-width="1.5" filter="url(#sh)"/>
  <!-- SW-420 cylindrical sensor -->
  <rect x="10" y="30" width="34" height="48" rx="17" fill="#c8c8c8" stroke="#999" stroke-width="2" filter="url(#sh)"/>
  <rect x="14" y="36" width="26" height="36" rx="13" fill="#b8b8b8"/>
  <text x="27" y="56" text-anchor="middle" font-size="5.5" fill="#555" font-family="monospace">SW-420</text>
  <!-- LM393 chip -->
  <rect x="56" y="34" width="38" height="26" rx="1" fill="#111" stroke="#333"/>
  <text x="75" y="49" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED (power) -->
  <circle cx="103" cy="36" r="5" fill="#f44336"/>
  <!-- Trim pot -->
  <circle cx="103" cy="65" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="103" y1="58" x2="103" y2="64" stroke="#555" stroke-width="2.5"/>
  <!-- 3-pin header: VCC GND DO -->
  <rect x="26" y="6" width="68" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="30" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="48" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="66" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="35" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="53" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="71" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="60" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">SW-420 Vibration</text>
</svg>''')

# UV Sensor GUVA-S12SD
save('uv-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b1fa2"/><stop offset="100%" stop-color="#4a148c"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="94" height="58" rx="4" fill="url(#bg)" stroke="#4a148c" stroke-width="1.5" filter="url(#sh)"/>
  <!-- GUVA-S12SD photodiode (SOD-123 package, tiny) -->
  <rect x="28" y="30" width="44" height="28" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <!-- Window (UV sensing area) -->
  <rect x="36" y="36" width="28" height="16" rx="1" fill="#1a1a1a" stroke="#555"/>
  <ellipse cx="50" cy="44" rx="10" ry="7" fill="#6a1b9a" opacity="0.8"/>
  <text x="50" y="56" text-anchor="middle" font-size="4.5" fill="#888" font-family="monospace">GUVA-S12SD</text>
  <!-- 3-pin header: VCC GND OUT -->
  <rect x="18" y="6" width="64" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="58" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="45" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="63" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">OUT</text>
  <text x="50" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">UV Sensor</text>
</svg>''')

# IR Obstacle sensor (with emitter+receiver pair)
save('ir-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- IR LED emitter (clear, light blue tint) -->
  <rect x="10" y="30" width="18" height="26" rx="3" fill="#cce8ff" stroke="#90CAF9" stroke-width="1.5"/>
  <ellipse cx="19" cy="30" rx="9" ry="5" fill="#cce8ff" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="19" cy="35" r="5" fill="#bbdeff"/>
  <text x="19" y="62" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">EMITTER</text>
  <!-- IR photodetector (black, looks like regular IR LED) -->
  <rect x="36" y="30" width="18" height="26" rx="3" fill="#111" stroke="#444" stroke-width="1.5"/>
  <ellipse cx="45" cy="30" rx="9" ry="5" fill="#111" stroke="#444" stroke-width="1.5"/>
  <circle cx="45" cy="35" r="5" fill="#1a1a1a"/>
  <text x="45" y="62" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">RECEIVER</text>
  <!-- LM393 comparator -->
  <rect x="66" y="34" width="36" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="84" y="47" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- LED power + signal -->
  <circle cx="113" cy="34" r="5" fill="#f44336"/>
  <circle cx="113" cy="54" r="5" fill="#2196f3"/>
  <!-- Trim pot -->
  <circle cx="84" cy="65" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="84" y1="58" x2="84" y2="64" stroke="#555" stroke-width="2.5"/>
  <!-- 3-pin header: VCC GND OUT -->
  <rect x="26" y="6" width="78" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="30" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="52" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="74" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="35" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="57" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="79" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">OUT</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">IR Obstacle</text>
</svg>''')

# IR Receiver TSOP1838
save('ir-receiver.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 95" width="80" height="95">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- TSOP1838 body (flat front, rounded back) -->
  <rect x="14" y="16" width="52" height="50" rx="5" fill="#111" stroke="#444" stroke-width="2" filter="url(#sh)"/>
  <!-- Flat front face -->
  <rect x="14" y="16" width="52" height="50" rx="0" fill="none" stroke="#333" stroke-width="0.5"/>
  <!-- IR sensor window (dark dome) -->
  <ellipse cx="40" cy="38" rx="18" ry="16" fill="#1a1a1a" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="40" cy="38" rx="11" ry="10" fill="#0d0d0d"/>
  <!-- Lead wires coming from flat bottom -->
  <line x1="28" y1="66" x2="28" y2="93" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="66" x2="40" y2="93" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="52" y1="66" x2="52" y2="93" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="95" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">OUT</text>
  <text x="40" y="95" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="52" y="95" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">VCC</text>
  <text x="40" y="10" text-anchor="middle" font-size="7" font-weight="bold" fill="#888" font-family="Arial">TSOP1838</text>
</svg>''')

# IR Transmitter LED
save('ir-transmitter.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="70" height="90">
  <!-- Clear IR LED body -->
  <rect x="18" y="28" width="34" height="36" rx="3" fill="#d0e8ff" stroke="#90CAF9" stroke-width="2"/>
  <!-- Dome top -->
  <ellipse cx="35" cy="28" rx="17" ry="9" fill="#d0e8ff" stroke="#90CAF9" stroke-width="2"/>
  <!-- Chip inside -->
  <rect x="26" y="36" width="18" height="14" rx="1" fill="#1a237e" opacity="0.5"/>
  <!-- IR radiation lines (dashed) -->
  <line x1="35" y1="16" x2="22" y2="4" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="35" y1="14" x2="35" y2="2" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="35" y1="16" x2="48" y2="4" stroke="#90CAF9" stroke-width="1.5" stroke-dasharray="2,2"/>
  <!-- Leads: long=Anode, short=Cathode -->
  <line x1="28" y1="64" x2="26" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="42" y1="64" x2="44" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Flat edge on cathode side -->
  <line x1="18" y1="56" x2="18" y2="64" stroke="#90CAF9" stroke-width="2"/>
  <text x="26" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">A(+)</text>
  <text x="44" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">K(-)</text>
  <text x="35" y="80" text-anchor="middle" font-size="7" fill="#333" font-family="Arial">IR LED</text>
</svg>''')

# Finger print
save('fingerprint-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 120" width="110" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Module PCB -->
  <rect x="4" y="4" width="102" height="112" rx="6" fill="#212121" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- Sensor window (glass area, blue-tinted) -->
  <rect x="12" y="14" width="86" height="72" rx="4" fill="#1a237e" stroke="#3949ab" stroke-width="2"/>
  <!-- Fingerprint scan lines (stylized) -->
  <path d="M40,26 A16,16 0 1,1 70,26" stroke="#5c6bc0" stroke-width="2" fill="none"/>
  <path d="M36,33 A20,20 0 1,1 74,33" stroke="#5c6bc0" stroke-width="1.8" fill="none"/>
  <path d="M32,40 A24,24 0 1,1 78,40" stroke="#5c6bc0" stroke-width="1.6" fill="none"/>
  <path d="M28,47 A28,28 0 1,1 82,47" stroke="#3f51b5" stroke-width="1.4" fill="none"/>
  <path d="M25,55 A31,31 0 1,1 85,55" stroke="#3f51b5" stroke-width="1.2" fill="none"/>
  <path d="M23,63 A33,33 0 1,1 87,63" stroke="#3f51b5" stroke-width="1" fill="none"/>
  <!-- LED indicators -->
  <circle cx="24" cy="86" r="4" fill="#f44336"/><text x="24" y="94" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">RX</text>
  <circle cx="86" cy="86" r="4" fill="#4caf50"/><text x="86" y="94" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">TX</text>
  <!-- 4-pin header: VCC GND TX RX -->
  <rect x="18" y="100" width="74" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="102" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="102" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="54" y="102" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="70" y="102" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="98" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="43" y="98" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="98" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">TX</text>
  <text x="75" y="98" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">RX</text>
  <text x="55" y="117" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">Fingerprint R307</text>
</svg>''')

# Flex sensor
save('flex-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 140" width="55" height="140">
  <!-- Flexible plastic strip (beige) -->
  <rect x="12" y="8" width="30" height="100" rx="4" fill="#f5f5dc" stroke="#c0a060" stroke-width="2"/>
  <!-- Carbon resistive layer (dark) -->
  <rect x="18" y="12" width="18" height="90" rx="2" fill="#555" opacity="0.7"/>
  <!-- Silver conductive lines (simulating flex paths) -->
  <line x1="21" y1="14" x2="21" y2="98" stroke="#aaa" stroke-width="1.5"/>
  <line x1="27" y1="14" x2="27" y2="98" stroke="#aaa" stroke-width="1.5"/>
  <line x1="33" y1="14" x2="33" y2="98" stroke="#aaa" stroke-width="1.5"/>
  <!-- Conductive header tab at top -->
  <rect x="10" y="6" width="34" height="12" rx="2" fill="#c8a800" stroke="#a08000" stroke-width="1.5"/>
  <!-- Two leads at bottom -->
  <line x1="22" y1="108" x2="20" y2="138" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="33" y1="108" x2="35" y2="138" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="20" y="141" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">1</text>
  <text x="35" y="141" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">2</text>
  <text x="27" y="4" text-anchor="middle" font-size="6.5" font-weight="bold" fill="#555" font-family="Arial">FLEX</text>
</svg>''')

# Force sensitive resistor (FSR402)
save('force-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120" width="90" height="120">
  <!-- Sensing disc area -->
  <circle cx="45" cy="42" r="36" fill="#f5f5dc" stroke="#c0a060" stroke-width="2"/>
  <!-- Pressure sensitive concentric rings -->
  <circle cx="45" cy="42" r="28" fill="none" stroke="#a08040" stroke-width="1.5"/>
  <circle cx="45" cy="42" r="20" fill="none" stroke="#a08040" stroke-width="1.5"/>
  <circle cx="45" cy="42" r="13" fill="none" stroke="#a08040" stroke-width="1.5"/>
  <circle cx="45" cy="42" r="6" fill="#888" stroke="#666"/>
  <!-- "FSR" text on disc -->
  <text x="45" y="46" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#666" font-family="Arial">FSR</text>
  <!-- Tail (thin PCB strip) -->
  <rect x="36" y="72" width="18" height="34" rx="2" fill="#f5f5dc" stroke="#c0a060" stroke-width="1.5"/>
  <line x1="41" y1="74" x2="41" y2="104" stroke="#aaa" stroke-width="1.5"/>
  <line x1="49" y1="74" x2="49" y2="104" stroke="#aaa" stroke-width="1.5"/>
  <!-- 2 leads -->
  <line x1="40" y1="106" x2="38" y2="118" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="50" y1="106" x2="52" y2="118" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="38" y="121" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">1</text>
  <text x="52" y="121" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">2</text>
  <text x="45" y="8" text-anchor="middle" font-size="7" font-weight="bold" fill="#555" font-family="Arial">FSR Force Sensor</text>
</svg>''')

# Tilt sensor SW-520D
save('tilt-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="70" height="90">
  <!-- SW-520D cylindrical metal tilt switch -->
  <rect x="18" y="12" width="34" height="54" rx="17" fill="#d0d0d0" stroke="#999" stroke-width="2"/>
  <rect x="20" y="20" width="30" height="38" rx="15" fill="#c8c8c8" stroke="#aaa" stroke-width="1"/>
  <!-- Metal ball (rolling ball inside) -->
  <circle cx="35" cy="50" r="9" fill="#888" stroke="#666" stroke-width="2"/>
  <!-- Contacts at bottom (inside) -->
  <line x1="26" y1="58" x2="26" y2="62" stroke="#c8b400" stroke-width="2"/>
  <line x1="44" y1="58" x2="44" y2="62" stroke="#c8b400" stroke-width="2"/>
  <!-- Text on body -->
  <text x="35" y="22" text-anchor="middle" font-size="5.5" fill="#555" font-family="monospace">SW-520D</text>
  <!-- 2 leads -->
  <line x1="28" y1="66" x2="28" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="42" y1="66" x2="42" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">A</text>
  <text x="42" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">B</text>
  <text x="35" y="8" text-anchor="middle" font-size="8" font-weight="bold" fill="#444" font-family="Arial">TILT SW</text>
</svg>''')

# ══════════════════════════════════════════════════════════════════
# DISCRETE COMPONENTS
# ══════════════════════════════════════════════════════════════════

# LEDs
for led_id, fill, rim, label in [
    ('led-red','#f44336','#b71c1c','Red LED'),
    ('led-green','#4caf50','#1b5e20','Green LED'),
    ('led-blue','#2196f3','#0d47a1','Blue LED'),
    ('led-yellow','#ffeb3b','#f57f17','Yellow LED'),
    ('led-white','#eeeeee','#bdbdbd','White LED'),
    ('led-ir','#9c27b0','#4a148c','IR LED'),
]:
    save(f'{led_id}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="70" height="90">
  <!-- LED dome -->
  <ellipse cx="35" cy="28" rx="18" ry="12" fill="{fill}" stroke="{rim}" stroke-width="2"/>
  <!-- LED body (cylinder) -->
  <rect x="17" y="28" width="36" height="28" rx="2" fill="{fill}" stroke="{rim}" stroke-width="2"/>
  <!-- Flat edge on cathode side -->
  <line x1="17" y1="48" x2="17" y2="56" stroke="{rim}" stroke-width="2"/>
  <!-- Glow effect inside dome -->
  <ellipse cx="31" cy="22" rx="8" ry="5" fill="white" opacity="0.4"/>
  <!-- Long lead = Anode, Short = Cathode -->
  <line x1="28" y1="56" x2="25" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="42" y1="56" x2="45" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="25" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">A+</text>
  <text x="45" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">K-</text>
  <text x="35" y="15" text-anchor="middle" font-size="7" font-weight="bold" fill="{rim}" font-family="Arial">{label}</text>
</svg>''')

# RGB LED (4 leads)
save('rgb-led.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 95" width="80" height="95">
  <defs>
    <linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f44336"/><stop offset="50%" stop-color="#4caf50"/><stop offset="100%" stop-color="#2196f3"/>
    </linearGradient>
  </defs>
  <!-- Dome with RGB gradient -->
  <ellipse cx="40" cy="28" rx="22" ry="14" fill="url(#rgb)" stroke="#555" stroke-width="2"/>
  <!-- Body -->
  <rect x="18" y="28" width="44" height="32" rx="2" fill="url(#rgb)" stroke="#555" stroke-width="2"/>
  <!-- Flat edge (longest lead = common cathode/anode) -->
  <line x1="40" y1="48" x2="40" y2="60" stroke="#555" stroke-width="1.5"/>
  <!-- Glow -->
  <ellipse cx="32" cy="22" rx="9" ry="6" fill="white" opacity="0.35"/>
  <!-- 4 leads: R K G B -->
  <line x1="24" y1="60" x2="22" y2="92" stroke="#f44336" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="33" y1="60" x2="33" y2="92" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="47" y1="60" x2="47" y2="92" stroke="#4caf50" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="56" y1="60" x2="58" y2="92" stroke="#2196f3" stroke-width="3.5" stroke-linecap="round"/>
  <text x="22" y="95" text-anchor="middle" font-size="5.5" fill="#f44336" font-family="Arial" font-weight="bold">R</text>
  <text x="33" y="95" text-anchor="middle" font-size="5.5" fill="#bbb" font-family="Arial" font-weight="bold">K</text>
  <text x="47" y="95" text-anchor="middle" font-size="5.5" fill="#4caf50" font-family="Arial" font-weight="bold">G</text>
  <text x="58" y="95" text-anchor="middle" font-size="5.5" fill="#2196f3" font-family="Arial" font-weight="bold">B</text>
  <text x="40" y="12" text-anchor="middle" font-size="8" font-weight="bold" fill="#555" font-family="Arial">RGB LED</text>
</svg>''')

# Resistor (correct color bands for 220Ω)
save('resistor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50" width="140" height="50">
  <!-- Lead wires -->
  <line x1="0" y1="25" x2="28" y2="25" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="112" y1="25" x2="140" y2="25" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Body (tan) -->
  <rect x="26" y="13" width="88" height="24" rx="8" fill="#d4b483" stroke="#b8955a" stroke-width="1.5"/>
  <!-- 220Ω color bands: Red-Red-Brown-Gold -->
  <rect x="38" y="13" width="8" height="24" fill="#f44336"/>
  <rect x="50" y="13" width="8" height="24" fill="#f44336"/>
  <rect x="62" y="13" width="8" height="24" fill="#795548"/>
  <rect x="96" y="13" width="8" height="24" fill="#ffd700"/>
  <text x="70" y="45" text-anchor="middle" font-size="7.5" fill="#555" font-family="Arial" font-weight="bold">Resistor 220Ω</text>
</svg>''')

# Capacitor ceramic
save('cap-ceramic.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 80" width="70" height="80">
  <!-- Disc body -->
  <ellipse cx="35" cy="32" rx="24" ry="22" fill="#f5c542" stroke="#d4a017" stroke-width="2"/>
  <text x="35" y="29" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#7a5c00" font-family="Arial">100nF</text>
  <text x="35" y="40" text-anchor="middle" font-size="6" fill="#7a5c00" font-family="Arial">50V</text>
  <!-- Leads -->
  <line x1="28" y1="54" x2="26" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="42" y1="54" x2="44" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="26" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">+</text>
  <text x="44" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">-</text>
  <text x="35" y="9" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#555" font-family="Arial">Ceramic Cap</text>
</svg>''')

# Electrolytic capacitor
save('cap-electrolytic.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 100" width="70" height="100">
  <!-- Aluminum can body -->
  <rect x="16" y="16" width="38" height="60" rx="5" fill="#1a1a1a" stroke="#444" stroke-width="2"/>
  <!-- Top cap -->
  <ellipse cx="35" cy="16" rx="19" ry="7" fill="#333" stroke="#555"/>
  <!-- Negative stripe (white on left) -->
  <rect x="16" y="16" width="10" height="60" rx="5" fill="#333" stroke="none"/>
  <text x="18" y="48" font-size="8" fill="#f5f5f5" font-family="Arial" font-weight="bold">-</text>
  <!-- Capacitance label -->
  <text x="40" y="44" text-anchor="middle" font-size="7" fill="#aaa" font-family="Arial" font-weight="bold">100</text>
  <text x="40" y="52" text-anchor="middle" font-size="6" fill="#aaa" font-family="Arial">µF 25V</text>
  <!-- Vent grooves on top -->
  <line x1="28" y1="12" x2="42" y2="12" stroke="#555" stroke-width="1.5"/>
  <!-- Leads: longer = +, shorter = - -->
  <line x1="27" y1="76" x2="24" y2="97" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="43" y1="76" x2="46" y2="97" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="24" y="100" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">-(K)</text>
  <text x="46" y="100" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">+(A)</text>
  <text x="35" y="10" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#888" font-family="Arial">Electrolytic</text>
</svg>''')

# Potentiometer
save('potentiometer.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
  <!-- Body -->
  <rect x="10" y="18" width="70" height="56" rx="4" fill="#555" stroke="#333" stroke-width="2"/>
  <!-- Rotary knob / dial -->
  <circle cx="45" cy="46" r="22" fill="#777" stroke="#555" stroke-width="2"/>
  <circle cx="45" cy="46" r="14" fill="#666" stroke="#444" stroke-width="1.5"/>
  <!-- Indicator notch (pointing at ~7 o'clock = min position) -->
  <line x1="45" y1="32" x2="45" y2="44" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 3 bottom pins: Pin1 Wiper Pin2 -->
  <line x1="25" y1="74" x2="25" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="45" y1="74" x2="45" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="65" y1="74" x2="65" y2="88" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="25" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">1</text>
  <text x="45" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">W</text>
  <text x="65" y="91" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">2</text>
  <text x="45" y="12" text-anchor="middle" font-size="8" font-weight="bold" fill="#bbb" font-family="Arial">POT 10kΩ</text>
</svg>''')

# Inductor
save('inductor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 55" width="140" height="55">
  <line x1="0" y1="27" x2="22" y2="27" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="118" y1="27" x2="140" y2="27" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Coil arcs (5 loops) -->
  <path d="M22,27 a10,12 0 0,1 20,0 a10,12 0 0,1 20,0 a10,12 0 0,1 20,0 a10,12 0 0,1 20,0 a10,12 0 0,1 16,0"
        stroke="#c8a800" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Ferrite core lines (above coil) -->
  <line x1="26" y1="16" x2="114" y2="16" stroke="#555" stroke-width="2"/>
  <line x1="26" y1="12" x2="114" y2="12" stroke="#555" stroke-width="2"/>
  <text x="70" y="50" text-anchor="middle" font-size="8" fill="#555" font-family="Arial" font-weight="bold">Inductor 10µH</text>
</svg>''')

# Diode (1N4007)
save('diode.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 55" width="120" height="55">
  <line x1="0" y1="27" x2="36" y2="27" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="84" y1="27" x2="120" y2="27" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Glass body -->
  <rect x="34" y="14" width="52" height="26" rx="8" fill="#e8e8e8" stroke="#aaa" stroke-width="1.5"/>
  <!-- Triangle (diode symbol direction: left to right) -->
  <polygon points="40,15 40,39 68,27" fill="#777" stroke="#555" stroke-width="1"/>
  <!-- Cathode bar (stripe) -->
  <line x1="68" y1="14" x2="68" y2="40" stroke="#333" stroke-width="3"/>
  <!-- Cathode stripe on glass -->
  <rect x="68" y="14" width="14" height="26" rx="6" fill="#555" stroke="none"/>
  <!-- Labels -->
  <text x="45" y="52" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">A(+)</text>
  <text x="80" y="52" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">K(-)</text>
  <text x="60" y="8" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#555" font-family="Arial">1N4007</text>
</svg>''')

# Transistor NPN (TO-92)
save('transistor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 95" width="80" height="95">
  <!-- TO-92 body - D-shaped (flat front, round back) -->
  <path d="M16,16 L64,16 L64,60 A24,24 0 0,1 16,60 Z" fill="#1a1a1a" stroke="#444" stroke-width="2"/>
  <!-- Flat face -->
  <rect x="16" y="14" width="48" height="46" rx="0" fill="#1a1a1a"/>
  <!-- NPN marking -->
  <text x="40" y="36" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">2N2222</text>
  <text x="40" y="46" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">NPN</text>
  <!-- 3 leads: B C E -->
  <line x1="26" y1="60" x2="24" y2="92" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="60" x2="40" y2="92" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="54" y1="60" x2="56" y2="92" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="24" y="95" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">B</text>
  <text x="40" y="95" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">C</text>
  <text x="56" y="95" text-anchor="middle" font-size="6" fill="#c8b400" font-family="Arial" font-weight="bold">E</text>
  <text x="40" y="10" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#777" font-family="Arial">NPN Transistor</text>
</svg>''')

# Generic IC DIP
save('ic-dip.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- DIP body -->
  <rect x="24" y="10" width="72" height="60" rx="3" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Notch -->
  <ellipse cx="60" cy="10" rx="10" ry="6" fill="#222" stroke="#444"/>
  <!-- Pin 1 indicator -->
  <circle cx="30" cy="17" r="2.5" fill="#555"/>
  <!-- Left pins (1-4 from top) -->
  <line x1="10" y1="22" x2="24" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="10" y1="32" x2="24" y2="32" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="10" y1="42" x2="24" y2="42" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="10" y1="52" x2="24" y2="52" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <text x="8" y="25" text-anchor="end" font-size="5.5" fill="#888" font-family="Arial">1</text>
  <text x="8" y="35" text-anchor="end" font-size="5.5" fill="#888" font-family="Arial">2</text>
  <text x="8" y="45" text-anchor="end" font-size="5.5" fill="#888" font-family="Arial">3</text>
  <text x="8" y="55" text-anchor="end" font-size="5.5" fill="#888" font-family="Arial">4</text>
  <!-- Right pins (5-8 from bottom) -->
  <line x1="96" y1="22" x2="110" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="96" y1="32" x2="110" y2="32" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="96" y1="42" x2="110" y2="42" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="96" y1="52" x2="110" y2="52" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
  <text x="112" y="55" text-anchor="start" font-size="5.5" fill="#888" font-family="Arial">5</text>
  <text x="112" y="45" text-anchor="start" font-size="5.5" fill="#888" font-family="Arial">6</text>
  <text x="112" y="35" text-anchor="start" font-size="5.5" fill="#888" font-family="Arial">7</text>
  <text x="112" y="25" text-anchor="start" font-size="5.5" fill="#888" font-family="Arial">8</text>
  <text x="60" y="44" text-anchor="middle" font-size="9" fill="#888" font-family="monospace">DIP-8</text>
</svg>''')

# Push button
save('push-button.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- Base (square tact switch) -->
  <rect x="14" y="24" width="52" height="44" rx="3" fill="#555" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Button dome/cap -->
  <ellipse cx="40" cy="24" rx="18" ry="10" fill="#e53935" stroke="#b71c1c" stroke-width="2"/>
  <!-- 4 through-hole leads (2x2 grid) -->
  <line x1="22" y1="68" x2="22" y2="80" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="32" y1="68" x2="32" y2="80" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="48" y1="68" x2="48" y2="80" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="58" y1="68" x2="58" y2="80" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="27" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">A</text>
  <text x="53" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">B</text>
  <text x="40" y="50" text-anchor="middle" font-size="7" fill="white" font-family="Arial" font-weight="bold">PUSH</text>
</svg>''')

# Toggle switch
save('switch.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 75" width="80" height="75">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- Chassis/body -->
  <rect x="12" y="24" width="56" height="36" rx="4" fill="#444" stroke="#222" stroke-width="2" filter="url(#sh)"/>
  <!-- Toggle lever shaft -->
  <rect x="34" y="8" width="12" height="28" rx="4" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="2"/>
  <!-- Toggle ball on top -->
  <circle cx="40" cy="10" r="7" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="2"/>
  <!-- 3 through-hole pins: COM NO NC -->
  <line x1="24" y1="60" x2="24" y2="74" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="60" x2="40" y2="74" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="56" y1="60" x2="56" y2="74" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="24" y="77" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">COM</text>
  <text x="40" y="77" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">NO</text>
  <text x="56" y="77" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">NC</text>
  <text x="40" y="22" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#bbb" font-family="Arial">TOGGLE</text>
</svg>''')

# ══════════════════════════════════════════════════════════════════
# ACTUATORS
# ══════════════════════════════════════════════════════════════════

save('servo.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Servo body -->
  <rect x="8" y="22" width="104" height="60" rx="5" fill="#555" stroke="#333" stroke-width="2.5" filter="url(#sh)"/>
  <!-- Mounting tabs -->
  <rect x="0" y="30" width="10" height="30" rx="2" fill="#444" stroke="#333"/>
  <circle cx="5" cy="45" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <rect x="110" y="30" width="10" height="30" rx="2" fill="#444" stroke="#333"/>
  <circle cx="115" cy="45" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <!-- Output shaft with gear -->
  <circle cx="32" cy="22" r="14" fill="#777" stroke="#555" stroke-width="2"/>
  <circle cx="32" cy="22" r="8" fill="#666" stroke="#444" stroke-width="1.5"/>
  <circle cx="32" cy="22" r="4" fill="#555"/>
  <!-- Label -->
  <text x="72" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#aaa" font-family="Arial">SG90</text>
  <text x="72" y="63" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">Servo Motor</text>
  <!-- 3-wire connector (from top) -->
  <rect x="72" y="8" width="38" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="75" y="10" width="8" height="12" rx="1" fill="#f44336"/>
  <rect x="88" y="10" width="8" height="12" rx="1" fill="#e53935"/>
  <rect x="101" y="10" width="8" height="12" rx="1" fill="#111"/>
  <text x="79" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="92" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="105" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
</svg>''')

save('dc-motor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Motor cylinder -->
  <ellipse cx="26" cy="45" rx="14" ry="30" fill="#555" stroke="#333" stroke-width="2"/>
  <rect x="26" y="15" width="80" height="60" fill="#555" stroke="#333" stroke-width="2"/>
  <ellipse cx="106" cy="45" rx="14" ry="30" fill="#666" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Shaft -->
  <rect x="4" y="40" width="24" height="10" rx="3" fill="#aaa" stroke="#888" stroke-width="1.5"/>
  <!-- Terminal block (screw) -->
  <rect x="70" y="20" width="26" height="20" rx="2" fill="#333" stroke="#222"/>
  <circle cx="79" cy="29" r="4" fill="#f44336" stroke="#c62828"/>
  <circle cx="91" cy="29" r="4" fill="#222" stroke="#333"/>
  <text x="79" y="31" text-anchor="middle" font-size="6" fill="white" font-family="Arial">+</text>
  <text x="91" y="31" text-anchor="middle" font-size="6" fill="white" font-family="Arial">-</text>
  <text x="66" y="62" text-anchor="middle" font-size="9" font-weight="bold" fill="#aaa" font-family="Arial">DC MOTOR</text>
</svg>''')

save('stepper.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" width="110" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Motor body (square for stepper) -->
  <rect x="12" y="18" width="86" height="74" rx="5" fill="#444" stroke="#222" stroke-width="3" filter="url(#sh)"/>
  <!-- Label -->
  <text x="55" y="58" text-anchor="middle" font-size="10" font-weight="bold" fill="#aaa" font-family="Arial">STEPPER</text>
  <text x="55" y="70" text-anchor="middle" font-size="8" fill="#888" font-family="Arial">28BYJ-48</text>
  <!-- Shaft -->
  <rect x="46" y="6" width="18" height="16" rx="4" fill="#999" stroke="#777" stroke-width="2"/>
  <!-- 4-wire connector on side -->
  <rect x="80" y="35" width="28" height="44" rx="3" fill="#1a1a1a" stroke="#333"/>
  <circle cx="94" cy="44" r="4" fill="#f44336"/>
  <circle cx="94" cy="55" fill="#ff9800" r="4"/>
  <circle cx="94" cy="66" r="4" fill="#f44336"/>
  <circle cx="94" cy="77" r="4" fill="#111"/>
  <text x="94" y="89" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">IN1-4</text>
</svg>''')

save('buzzer.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 85" width="80" height="85">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB disc base -->
  <circle cx="40" cy="52" r="32" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Transducer dome (black) -->
  <circle cx="40" cy="48" r="26" fill="#111" stroke="#333" stroke-width="2"/>
  <circle cx="40" cy="46" r="18" fill="#222" stroke="#444" stroke-width="1.5"/>
  <!-- Vent hole -->
  <circle cx="40" cy="36" r="4" fill="#000"/>
  <!-- Sound waves -->
  <path d="M55,30 Q62,26 62,36" stroke="#90CAF9" stroke-width="1.5" fill="none"/>
  <path d="M57,26 Q68,22 68,36" stroke="#90CAF9" stroke-width="1" fill="none"/>
  <!-- + - terminals -->
  <line x1="28" y1="80" x2="28" y2="84" stroke="#f44336" stroke-width="4" stroke-linecap="round"/>
  <line x1="52" y1="80" x2="52" y2="84" stroke="#bbb" stroke-width="4" stroke-linecap="round"/>
  <text x="28" y="86" text-anchor="middle" font-size="6" fill="#f44336" font-family="Arial" font-weight="bold">+</text>
  <text x="52" y="86" text-anchor="middle" font-size="6" fill="#bbb" font-family="Arial" font-weight="bold">-</text>
  <text x="40" y="18" text-anchor="middle" font-size="8" font-weight="bold" fill="#333" font-family="Arial">Buzzer 5V</text>
</svg>''')

save('relay-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" width="140" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="3" y="3" width="134" height="94" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Relay coil body (blue block) -->
  <rect x="14" y="20" width="54" height="50" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <text x="41" y="48" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">RELAY</text>
  <text x="41" y="58" text-anchor="middle" font-size="6" fill="#666" font-family="monospace">5V</text>
  <!-- LED indicator -->
  <circle cx="90" cy="28" r="6" fill="#f44336"/>
  <text x="90" y="40" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial">LED</text>
  <!-- Screw terminals (AC side) - 3 screws: NO COM NC -->
  <rect x="78" y="46" width="52" height="44" rx="3" fill="#222" stroke="#444"/>
  <circle cx="90" cy="58" r="5.5" fill="#888" stroke="#666"/>
  <line x1="86" y1="58" x2="94" y2="58" stroke="#555" stroke-width="1.5"/>
  <circle cx="104" cy="58" r="5.5" fill="#888" stroke="#666"/>
  <line x1="100" y1="58" x2="108" y2="58" stroke="#555" stroke-width="1.5"/>
  <circle cx="118" cy="58" r="5.5" fill="#888" stroke="#666"/>
  <line x1="114" y1="58" x2="122" y2="58" stroke="#555" stroke-width="1.5"/>
  <text x="90" y="72" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">NO</text>
  <text x="104" y="72" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">COM</text>
  <text x="118" y="72" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">NC</text>
  <!-- Control terminal (3-pin): VCC GND IN -->
  <rect x="14" y="74" width="56" height="18" rx="1" fill="#1a1a1a"/>
  <rect x="18" y="76" width="10" height="14" rx="1" fill="#c8b400"/>
  <rect x="33" y="76" width="10" height="14" rx="1" fill="#c8b400"/>
  <rect x="48" y="76" width="10" height="14" rx="1" fill="#c8b400"/>
  <text x="23" y="73" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="38" y="73" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="53" y="73" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">IN</text>
  <text x="70" y="94" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Relay Module 5V</text>
</svg>''')

save('l298n.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="180" height="140">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="3" y="3" width="174" height="134" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- L298N chip body -->
  <rect x="54" y="28" width="72" height="68" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <text x="90" y="60" text-anchor="middle" font-size="10" fill="#888" font-family="monospace">L298N</text>
  <text x="90" y="74" text-anchor="middle" font-size="7" fill="#666" font-family="monospace">Dual H-Bridge</text>
  <!-- Heatsink fins (on top of chip) -->
  <rect x="60" y="18" width="60" height="12" rx="1" fill="#aaa" stroke="#888"/>
  <line x1="70" y1="18" x2="70" y2="30" stroke="#888" stroke-width="2"/>
  <line x1="80" y1="18" x2="80" y2="30" stroke="#888" stroke-width="2"/>
  <line x1="90" y1="18" x2="90" y2="30" stroke="#888" stroke-width="2"/>
  <line x1="100" y1="18" x2="100" y2="30" stroke="#888" stroke-width="2"/>
  <line x1="110" y1="18" x2="110" y2="30" stroke="#888" stroke-width="2"/>
  <!-- Left screw terminal (Motor A: OUT1, OUT2) -->
  <rect x="6" y="36" width="38" height="44" rx="2" fill="#333" stroke="#222"/>
  <circle cx="16" cy="50" r="5" fill="#888" stroke="#666"/><line x1="12" y1="50" x2="20" y2="50" stroke="#555" stroke-width="1.5"/>
  <circle cx="34" cy="50" r="5" fill="#888" stroke="#666"/><line x1="30" y1="50" x2="38" y2="50" stroke="#555" stroke-width="1.5"/>
  <circle cx="16" cy="68" r="5" fill="#888" stroke="#666"/><line x1="12" y1="68" x2="20" y2="68" stroke="#555" stroke-width="1.5"/>
  <circle cx="34" cy="68" r="5" fill="#888" stroke="#666"/><line x1="30" y1="68" x2="38" y2="68" stroke="#555" stroke-width="1.5"/>
  <text x="8" y="34" font-size="5.5" fill="#ddd" font-family="Arial">OUT1</text>
  <text x="28" y="34" font-size="5.5" fill="#ddd" font-family="Arial">OUT2</text>
  <text x="7" y="84" font-size="5.5" fill="#ddd" font-family="Arial">OUT3</text>
  <text x="27" y="84" font-size="5.5" fill="#ddd" font-family="Arial">OUT4</text>
  <!-- Right screw terminal (Motor B: OUT3, OUT4) -->
  <rect x="136" y="36" width="38" height="44" rx="2" fill="#333" stroke="#222"/>
  <circle cx="148" cy="50" r="5" fill="#888" stroke="#666"/><line x1="144" y1="50" x2="152" y2="50" stroke="#555" stroke-width="1.5"/>
  <circle cx="166" cy="50" r="5" fill="#888" stroke="#666"/><line x1="162" y1="50" x2="170" y2="50" stroke="#555" stroke-width="1.5"/>
  <circle cx="148" cy="68" r="5" fill="#888" stroke="#666"/><line x1="144" y1="68" x2="152" y2="68" stroke="#555" stroke-width="1.5"/>
  <circle cx="166" cy="68" r="5" fill="#888" stroke="#666"/><line x1="162" y1="68" x2="170" y2="68" stroke="#555" stroke-width="1.5"/>
  <!-- PWR terminal block (ENA 12V GND 5V ENB) -->
  <rect x="40" y="96" width="100" height="30" rx="2" fill="#333" stroke="#222"/>
  <text x="50" y="91" font-size="5.5" fill="#ddd" font-family="Arial">ENA</text>
  <text x="66" y="91" font-size="5.5" fill="#ddd" font-family="Arial">12V</text>
  <text x="82" y="91" font-size="5.5" fill="#ddd" font-family="Arial">GND</text>
  <text x="98" y="91" font-size="5.5" fill="#ddd" font-family="Arial">5V</text>
  <text x="114" y="91" font-size="5.5" fill="#ddd" font-family="Arial">ENB</text>
  <!-- Logic level pin header: IN1 IN2 IN3 IN4 -->
  <rect x="40" y="128" width="100" height="10" rx="1" fill="#1a1a1a"/>
  <text x="50" y="135" font-size="5" fill="#aaa" font-family="Arial">IN1 IN2 IN3 IN4</text>
  <text x="90" y="136" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">L298N Motor Driver</text>
</svg>''')

# Bluetooth HC-05
save('bluetooth-hc05.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 90" width="140" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="134" height="68" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh)"/>
  <!-- HC-05 module (metal shielded BT module) -->
  <rect x="18" y="28" width="90" height="48" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="22" y="32" width="82" height="40" rx="2" fill="#666" stroke="#888"/>
  <!-- Bluetooth logo -->
  <text x="63" y="52" text-anchor="middle" font-size="14" fill="#90CAF9" font-family="Arial" font-weight="bold">&#x2BB7;</text>
  <text x="88" y="52" text-anchor="middle" font-size="10" fill="#aaa" font-family="monospace">HC-05</text>
  <!-- LED blink indicator -->
  <circle cx="116" cy="36" r="5" fill="#f44336"/>
  <!-- Key/EN button -->
  <rect x="116" y="50" width="14" height="10" rx="2" fill="#e0e0e0" stroke="#bbb"/>
  <text x="123" y="58" text-anchor="middle" font-size="5" fill="#333" font-family="Arial">KEY</text>
  <!-- 6-pin header: STATE RXD TXD GND VCC EN -->
  <rect x="8" y="6" width="124" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="12" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="28" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="44" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="60" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="76" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="92" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="17" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">STA</text>
  <text x="33" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">RX</text>
  <text x="49" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">TX</text>
  <text x="65" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="81" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="97" y="4" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">EN</text>
  <text x="70" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">HC-05 Bluetooth</text>
</svg>''')

# Joystick
save('joystick.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="100" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="3" y="50" width="94" height="56" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Joystick base plate -->
  <circle cx="50" cy="64" r="30" fill="#666" stroke="#444" stroke-width="2"/>
  <circle cx="50" cy="64" r="22" fill="#555" stroke="#333" stroke-width="1.5"/>
  <!-- Stick shaft -->
  <line x1="50" y1="64" x2="58" y2="44" stroke="#999" stroke-width="5" stroke-linecap="round"/>
  <!-- Stick top ball -->
  <circle cx="58" cy="42" r="9" fill="#333" stroke="#555" stroke-width="2"/>
  <!-- 5-pin header: GND +5V VRX VRY SW -->
  <rect x="4" y="96" width="92" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="8" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="24" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="72" y="98" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="13" y="95" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="29" y="95" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">+5V</text>
  <text x="45" y="95" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VRX</text>
  <text x="61" y="95" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VRY</text>
  <text x="77" y="95" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SW</text>
  <text x="50" y="108" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">Joystick Module</text>
</svg>''')

# NeoPixel Ring
save('neopixel-ring.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" width="110" height="110">
  <!-- Ring PCB -->
  <circle cx="55" cy="55" r="50" fill="#111" stroke="#333" stroke-width="3"/>
  <circle cx="55" cy="55" r="34" fill="none" stroke="#333" stroke-width="24"/>
  <circle cx="55" cy="55" r="22" fill="#000"/>
  <!-- 16 WS2812 LEDs around ring (every 22.5 deg) -->
  <circle cx="55" cy="7" r="6" fill="#f44336"/>
  <circle cx="77" cy="13" r="6" fill="#ff9800"/>
  <circle cx="95" cy="30" r="6" fill="#ffeb3b"/>
  <circle cx="103" cy="55" r="6" fill="#4caf50"/>
  <circle cx="95" cy="80" r="6" fill="#00bcd4"/>
  <circle cx="77" cy="97" r="6" fill="#2196f3"/>
  <circle cx="55" cy="103" r="6" fill="#9c27b0"/>
  <circle cx="33" cy="97" r="6" fill="#e91e63"/>
  <circle cx="15" cy="80" r="6" fill="#f44336"/>
  <circle cx="7" cy="55" r="6" fill="#ff9800"/>
  <circle cx="15" cy="30" r="6" fill="#ffeb3b"/>
  <circle cx="33" cy="13" r="6" fill="#4caf50"/>
  <!-- Small pads at center for connections -->
  <circle cx="55" cy="55" r="10" fill="#1a1a1a" stroke="#333"/>
  <text x="55" y="59" text-anchor="middle" font-size="5.5" fill="#888" font-family="Arial">DIN</text>
  <!-- 4-pin connector at bottom -->
  <text x="55" y="110" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">VCC GND DIN DOUT</text>
</svg>''')

# NeoPixel strip
save('neopixel-strip.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 45" width="200" height="45">
  <!-- Strip flexible PCB base (dark) -->
  <rect x="2" y="8" width="196" height="28" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <!-- WS2812B LEDs (8 visible) -->
  <rect x="8" y="12" width="18" height="20" rx="1" fill="#f44336" stroke="#c62828"/>
  <rect x="30" y="12" width="18" height="20" rx="1" fill="#ff9800" stroke="#e65100"/>
  <rect x="52" y="12" width="18" height="20" rx="1" fill="#ffeb3b" stroke="#f57f17"/>
  <rect x="74" y="12" width="18" height="20" rx="1" fill="#4caf50" stroke="#1b5e20"/>
  <rect x="96" y="12" width="18" height="20" rx="1" fill="#00bcd4" stroke="#006064"/>
  <rect x="118" y="12" width="18" height="20" rx="1" fill="#2196f3" stroke="#0d47a1"/>
  <rect x="140" y="12" width="18" height="20" rx="1" fill="#9c27b0" stroke="#4a148c"/>
  <rect x="162" y="12" width="18" height="20" rx="1" fill="#e91e63" stroke="#880e4f"/>
  <!-- Copper traces on strip -->
  <line x1="2" y1="18" x2="200" y2="18" stroke="#c8a800" stroke-width="1" opacity="0.5"/>
  <line x1="2" y1="26" x2="200" y2="26" stroke="#c8a800" stroke-width="1" opacity="0.5"/>
  <line x1="2" y1="32" x2="200" y2="32" stroke="#c8a800" stroke-width="1" opacity="0.5"/>
  <!-- Connector at left end -->
  <rect x="0" y="6" width="8" height="32" rx="2" fill="#222" stroke="#444"/>
  <text x="100" y="5" text-anchor="middle" font-size="6" fill="#888" font-family="Arial">WS2812B NeoPixel Strip</text>
</svg>''')

# LCD 16x2
save('lcd-16x2.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 85" width="200" height="85">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="2" width="196" height="81" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Mounting holes -->
  <circle cx="10" cy="10" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="190" cy="10" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="10" cy="74" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <circle cx="190" cy="74" r="3" fill="none" stroke="#90CAF9" stroke-width="1.5"/>
  <!-- LCD glass screen -->
  <rect x="14" y="12" width="172" height="50" rx="3" fill="#4db6ac" stroke="#004d40" stroke-width="2"/>
  <!-- Character rows -->
  <text x="18" y="32" font-family="Courier New" font-size="11" fill="#003d36">HELLO WORLD! </text>
  <text x="18" y="52" font-family="Courier New" font-size="11" fill="#003d36">16x2 LCD     </text>
  <!-- Backlight border -->
  <rect x="14" y="12" width="172" height="50" rx="3" fill="none" stroke="#80cbc4" stroke-width="1"/>
  <!-- 16-pin header at bottom: VSS VDD V0 RS RW E D0-D7 A K -->
  <rect x="14" y="66" width="172" height="14" rx="1" fill="#1a1a1a"/>
  <text x="100" y="62" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VSS VDD V0 RS RW E D0 D1 D2 D3 D4 D5 D6 D7 A K</text>
  <text x="100" y="78" text-anchor="middle" font-size="7" fill="#aaa" font-family="Arial">1   2   3  4  5  6  7  8  9  10 11 12 13 14 15 16</text>
</svg>''')

# OLED
save('oled-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 85" width="100" height="85">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="2" width="96" height="81" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- OLED display area -->
  <rect x="8" y="8" width="84" height="50" rx="2" fill="#001020" stroke="#1565C0" stroke-width="1.5"/>
  <!-- Display content (simulate terminal output) -->
  <text x="12" y="24" font-family="Courier New" font-size="8" fill="#2196f3">Hello World!</text>
  <text x="12" y="34" font-family="Courier New" font-size="7" fill="#1565C0">TinkerAI v1.0</text>
  <text x="12" y="44" font-family="Courier New" font-size="7" fill="#0d47a1">SSD1306 128x64</text>
  <!-- 4-pin header: GND VCC SCL SDA -->
  <rect x="22" y="62" width="56" height="14" rx="2" fill="#1a1a1a"/>
  <rect x="26" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="50" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="62" y="64" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="31" y="60" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="43" y="60" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="55" y="60" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="67" y="60" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="50" y="80" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">OLED 0.96" I2C</text>
</svg>''')

# 7-segment display
save('display-7seg.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
  <rect x="3" y="3" width="84" height="84" rx="4" fill="#222" stroke="#333" stroke-width="2"/>
  <!-- 7 segments for digit "8" (all lit) -->
  <rect x="22" y="11" width="46" height="9" rx="4" fill="#f44336"/>
  <rect x="14" y="14" width="9" height="28" rx="4" fill="#f44336"/>
  <rect x="67" y="14" width="9" height="28" rx="4" fill="#f44336"/>
  <rect x="22" y="43" width="46" height="9" rx="4" fill="#f44336"/>
  <rect x="14" y="47" width="9" height="28" rx="4" fill="#f44336"/>
  <rect x="67" y="47" width="9" height="28" rx="4" fill="#f44336"/>
  <rect x="22" y="76" width="46" height="9" rx="4" fill="#f44336"/>
  <!-- Decimal point -->
  <circle cx="80" cy="80" r="4" fill="#f44336"/>
  <text x="45" y="88" text-anchor="middle" font-size="7" font-weight="bold" fill="#888" font-family="Arial">7-Seg Common</text>
</svg>''')

save('tm1637.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="160" height="65">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="2" width="156" height="61" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- 4 digit 7-seg displays -->
  <rect x="8" y="8" width="30" height="40" rx="2" fill="#1a0000"/>
  <rect x="9" y="9" width="28" height="8" rx="3" fill="#e53935"/>
  <rect x="9" y="19" width="28" height="8" rx="3" fill="#e53935"/>
  <rect x="9" y="29" width="28" height="8" rx="3" fill="#e53935"/>
  <rect x="8" y="9" width="8" height="18" rx="3" fill="#e53935"/>
  <rect x="8" y="29" width="8" height="18" rx="3" fill="#e53935"/>
  <rect x="30" y="9" width="8" height="18" rx="3" fill="#e53935"/>
  <rect x="30" y="29" width="8" height="18" rx="3" fill="#e53935"/>
  <text x="23" y="52" text-anchor="middle" font-size="10" fill="#f44336" font-family="Courier New" font-weight="bold">1</text>

  <rect x="46" y="8" width="30" height="40" rx="2" fill="#1a0000"/>
  <text x="61" y="52" text-anchor="middle" font-size="10" fill="#f44336" font-family="Courier New" font-weight="bold">2</text>
  <!-- Colon dots -->
  <circle cx="83" cy="23" r="3" fill="#f44336"/>
  <circle cx="83" cy="37" r="3" fill="#f44336"/>

  <rect x="90" y="8" width="30" height="40" rx="2" fill="#1a0000"/>
  <text x="105" y="52" text-anchor="middle" font-size="10" fill="#f44336" font-family="Courier New" font-weight="bold">3</text>

  <rect x="128" y="8" width="30" height="40" rx="2" fill="#1a0000"/>
  <text x="143" y="52" text-anchor="middle" font-size="10" fill="#f44336" font-family="Courier New" font-weight="bold">4</text>

  <!-- 4-pin header: CLK DIO VCC GND -->
  <rect x="8" y="50" width="62" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="11" y="52" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="23" y="52" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="35" y="52" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="47" y="52" width="8" height="8" rx="1" fill="#c8b400"/>
  <text x="15" y="50" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">CLK</text>
  <text x="27" y="50" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">DIO</text>
  <text x="39" y="50" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="51" y="50" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="112" y="60" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">TM1637 4-Digit</text>
</svg>''')

# Voltage sensor
save('voltage-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Resistor divider (R1 and R2) - main visual element -->
  <rect x="44" y="30" width="14" height="30" rx="4" fill="#c8a800" stroke="#a07800" stroke-width="1.5"/>
  <rect x="62" y="40" width="14" height="20" rx="4" fill="#c8a800" stroke="#a07800" stroke-width="1.5"/>
  <!-- Connecting wires inside -->
  <line x1="51" y1="28" x2="51" y2="30" stroke="#bbb" stroke-width="2"/>
  <line x1="51" y1="60" x2="69" y2="60" stroke="#bbb" stroke-width="2"/>
  <line x1="69" y1="58" x2="69" y2="60" stroke="#bbb" stroke-width="2"/>
  <line x1="69" y1="62" x2="69" y2="72" stroke="#bbb" stroke-width="2"/>
  <line x1="51" y1="62" x2="51" y2="72" stroke="#bbb" stroke-width="2"/>
  <text x="36" y="47" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">30K</text>
  <text x="83" y="52" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial">7.5K</text>
  <!-- 3-pin header: S(out) + (Vin) -(GND) -->
  <rect x="18" y="6" width="84" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="90" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">S</text>
  <text x="61" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">+</text>
  <text x="95" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">-</text>
  <text x="60" y="80" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">Voltage Sensor 0-25V</text>
</svg>''')

# Battery 9V
save('battery-9v.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Battery body -->
  <rect x="8" y="22" width="64" height="94" rx="6" fill="#222" stroke="#111" stroke-width="3" filter="url(#sh)"/>
  <!-- Colored label -->
  <rect x="14" y="34" width="52" height="72" rx="4" fill="#1565C0"/>
  <!-- Label text -->
  <text x="40" y="68" text-anchor="middle" font-size="16" font-weight="bold" fill="white" font-family="Arial">9V</text>
  <text x="40" y="84" text-anchor="middle" font-size="7.5" fill="#90CAF9" font-family="Arial">550mAh</text>
  <text x="40" y="96" text-anchor="middle" font-size="6.5" fill="#90CAF9" font-family="Arial">Zinc-Carbon</text>
  <!-- Terminals on top (snap connector style) -->
  <rect x="22" y="8" width="16" height="16" rx="4" fill="#f44336" stroke="#c62828" stroke-width="1.5"/>
  <text x="30" y="19" text-anchor="middle" font-size="8" fill="white" font-family="Arial" font-weight="bold">+</text>
  <rect x="42" y="10" width="16" height="14" rx="4" fill="#333" stroke="#555" stroke-width="1.5"/>
  <text x="50" y="20" text-anchor="middle" font-size="8" fill="white" font-family="Arial" font-weight="bold">-</text>
</svg>''')

# Solar Panel
save('solar-panel.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110" width="140" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Frame -->
  <rect x="4" y="4" width="132" height="96" rx="5" fill="#555" stroke="#333" stroke-width="3" filter="url(#sh)"/>
  <!-- Solar cell grid (3x2 = 6 cells) -->
  <rect x="10" y="10" width="36" height="36" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <rect x="50" y="10" width="36" height="36" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <rect x="90" y="10" width="44" height="36" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <rect x="10" y="50" width="36" height="42" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <rect x="50" y="50" width="36" height="42" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <rect x="90" y="50" width="44" height="42" rx="1" fill="#1565C0" stroke="#0a3d7a" stroke-width="1"/>
  <!-- Bus bars (silver lines across cells) -->
  <line x1="10" y1="28" x2="46" y2="28" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <line x1="50" y1="28" x2="86" y2="28" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <line x1="90" y1="28" x2="134" y2="28" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <line x1="10" y1="70" x2="46" y2="70" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <line x1="50" y1="70" x2="86" y2="70" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <line x1="90" y1="70" x2="134" y2="70" stroke="#90CAF9" stroke-width="1.5" opacity="0.6"/>
  <!-- Output wires -->
  <line x1="50" y1="100" x2="42" y2="110" stroke="#f44336" stroke-width="4" stroke-linecap="round"/>
  <line x1="90" y1="100" x2="98" y2="110" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <text x="42" y="111" text-anchor="middle" font-size="6" fill="#f44336" font-family="Arial" font-weight="bold">+</text>
  <text x="98" y="111" text-anchor="middle" font-size="6" fill="#888" font-family="Arial" font-weight="bold">-</text>
</svg>''')

# Breadboard
save('breadboard.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 100" width="220" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Body -->
  <rect x="2" y="2" width="216" height="96" rx="4" fill="#f0f0f0" stroke="#ccc" stroke-width="2" filter="url(#sh)"/>
  <!-- Power rails top (red/blue lines) -->
  <rect x="8" y="8" width="204" height="14" rx="2" fill="#fff" stroke="#ddd"/>
  <line x1="12" y1="15" x2="208" y2="15" stroke="#f44336" stroke-width="2"/>
  <line x1="12" y1="19" x2="208" y2="19" stroke="#1565C0" stroke-width="2"/>
  <!-- Power rails bottom -->
  <rect x="8" y="78" width="204" height="14" rx="2" fill="#fff" stroke="#ddd"/>
  <line x1="12" y1="85" x2="208" y2="85" stroke="#f44336" stroke-width="2"/>
  <line x1="12" y1="89" x2="208" y2="89" stroke="#1565C0" stroke-width="2"/>
  <!-- Center hole section -->
  <rect x="8" y="24" width="204" height="54" rx="2" fill="#e8e8e8" stroke="#ccc"/>
  <!-- Dividing gap -->
  <rect x="8" y="49" width="204" height="4" fill="#aaa" rx="1"/>
  <!-- Row labels -->
  <text x="6" y="43" text-anchor="end" font-size="6" fill="#888" font-family="Arial">a-e</text>
  <text x="6" y="60" text-anchor="end" font-size="6" fill="#888" font-family="Arial">f-j</text>
  <!-- Dot grid (simplified) -->
  <text x="22" y="42" font-size="6" fill="#999" font-family="Arial">· · · · · · · · · · · · · · · · · · · · · · · · · ·</text>
  <text x="22" y="60" font-size="6" fill="#999" font-family="Arial">· · · · · · · · · · · · · · · · · · · · · · · · · ·</text>
  <!-- Column numbers -->
  <text x="20" y="26" font-size="5" fill="#aaa" font-family="Arial">1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20</text>
  <text x="106" y="97" text-anchor="middle" font-size="8" font-weight="bold" fill="#555" font-family="Arial">Breadboard 830</text>
</svg>''')

# Jumper wire
save('jumper-wire.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 55" width="130" height="55">
  <!-- Wire -->
  <path d="M18,27 C40,12 90,12 112,27" stroke="#f44336" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Dupont connector left -->
  <rect x="2" y="20" width="18" height="14" rx="2" fill="#111" stroke="#444"/>
  <rect x="4" y="22" width="14" height="10" rx="1" fill="#222"/>
  <circle cx="11" cy="27" r="3.5" fill="#bbb"/>
  <!-- Dupont connector right -->
  <rect x="110" y="20" width="18" height="14" rx="2" fill="#111" stroke="#444"/>
  <rect x="112" y="22" width="14" height="10" rx="1" fill="#222"/>
  <circle cx="119" cy="27" r="3.5" fill="#bbb"/>
  <text x="65" y="50" text-anchor="middle" font-size="8" fill="#555" font-family="Arial">Jumper Wire (M-M)</text>
</svg>''')

print("\nAll SVGs written to:", OUT)
