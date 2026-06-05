"""
Part 2: Remaining accurate SVGs - communication, power, display, specialty modules
"""
import os

OUT = r'public/assets/components'
os.makedirs(OUT, exist_ok=True)

def save(name, svg):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'ok {name}')

# ── MPU6050/MPU9250
for sid, sname, extra in [
    ('mpu6050','MPU-6050','6-DoF IMU\nGyro+Accel'),
    ('mpu9250','MPU-9250','9-DoF IMU\nGyro+Accel+Mag'),
]:
    save(f'{sid}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 90" width="150" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="144" height="68" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh)"/>
  <!-- MPU chip (QFN) -->
  <rect x="46" y="30" width="58" height="44" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="49" cy="33" r="2" fill="#555"/>
  <text x="75" y="52" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">{sname}</text>
  <text x="75" y="63" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">{extra.split(chr(10))[1]}</text>
  <!-- 8-pin header: INT AD0 XDA XCL SDA SCL GND VCC -->
  <rect x="4" y="6" width="142" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="8" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="24" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="72" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="88" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="104" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="120" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="13" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">INT</text>
  <text x="29" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">AD0</text>
  <text x="45" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">XDA</text>
  <text x="61" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">XCL</text>
  <text x="77" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="93" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="109" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="125" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="75" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">{sname} {extra.split(chr(10))[0].split("-")[1]} IMU</text>
</svg>''')

# HMC5883L Magnetometer
save('hmc5883l.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c62828"/><stop offset="100%" stop-color="#7f0000"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#7f0000" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Compass needle icon -->
  <circle cx="35" cy="55" r="22" fill="none" stroke="#ff8a80" stroke-width="1.5"/>
  <polygon points="35,34 30,55 35,50 40,55" fill="#ff5252"/>
  <polygon points="35,76 30,55 35,60 40,55" fill="#fff"/>
  <circle cx="35" cy="55" r="4" fill="#fff"/>
  <!-- HMC5883L chip (LCC-16) -->
  <rect x="66" y="34" width="54" height="34" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="69" cy="37" r="2" fill="#555"/>
  <text x="93" y="51" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">HMC5883L</text>
  <text x="93" y="61" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">3-Axis Compass</text>
  <!-- 5-pin header: VCC SCL SDA DRDY GND -->
  <rect x="12" y="6" width="106" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="16" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="32" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="48" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="80" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="21" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="37" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="53" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="69" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">DRY</text>
  <text x="85" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">HMC5883L Compass</text>
</svg>''')

# VL53L0X ToF distance sensor
save('vl53l0x.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#283593"/><stop offset="100%" stop-color="#1a237e"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#1a237e" stroke-width="1.5" filter="url(#sh)"/>
  <!-- VL53L0X chip with two optical windows -->
  <rect x="28" y="34" width="64" height="34" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <!-- VCSEL emitter window -->
  <circle cx="45" cy="51" r="10" fill="#1a1a1a" stroke="#555"/>
  <circle cx="45" cy="51" r="6" fill="#f44336" opacity="0.7"/>
  <!-- SPAD detector window -->
  <circle cx="75" cy="51" r="10" fill="#1a1a1a" stroke="#555"/>
  <circle cx="75" cy="51" r="6" fill="#9c27b0" opacity="0.7"/>
  <!-- ToF laser lines -->
  <line x1="36" y1="30" x2="20" y2="20" stroke="#f44336" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="45" y1="28" x2="45" y2="18" stroke="#f44336" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="54" y1="30" x2="70" y2="20" stroke="#f44336" stroke-width="1" stroke-dasharray="2,2"/>
  <!-- 6-pin header: VIN GND SCL SDA XSHUT GPIO1 -->
  <rect x="4" y="6" width="112" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="8" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="36" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="50" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="78" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="13" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">VIN</text>
  <text x="27" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="41" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="55" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="69" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">XSH</text>
  <text x="83" y="3" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial" font-weight="bold">GP1</text>
  <text x="60" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">VL53L0X ToF Sensor</text>
</svg>''')

# TSL2561 Light sensor
save('tsl2561.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f57f17"/><stop offset="100%" stop-color="#e65100"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#e65100" stroke-width="1.5" filter="url(#sh)"/>
  <!-- TSL2561 chip with clear lid (photodiode array) -->
  <rect x="28" y="30" width="64" height="40" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <rect x="36" y="36" width="48" height="28" rx="1" fill="#1a1a1a" stroke="#555"/>
  <!-- Light sensor array inside (visible die) -->
  <circle cx="60" cy="50" r="14" fill="#222" stroke="#444"/>
  <circle cx="60" cy="50" r="8" fill="#333" stroke="#555"/>
  <!-- Sun icon (ambient light) -->
  <circle cx="60" cy="50" r="5" fill="#ffeb3b" opacity="0.8"/>
  <text x="60" y="80" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">TSL2561</text>
  <!-- 4-pin header: VDD GND SCL SDA -->
  <rect x="18" y="6" width="84" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="54" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="70" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VDD</text>
  <text x="43" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="75" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="60" y="82" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">TSL2561 Light</text>
</svg>''')

# MLX90614 Infrared Temperature
save('mlx90614.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- TO-39 metal can package -->
  <circle cx="50" cy="55" r="36" fill="#888" stroke="#666" stroke-width="3" filter="url(#sh)"/>
  <circle cx="50" cy="55" r="30" fill="#777" stroke="#555" stroke-width="1.5"/>
  <!-- Optical window on top of can -->
  <circle cx="50" cy="50" r="18" fill="#333" stroke="#222" stroke-width="2"/>
  <circle cx="50" cy="50" r="13" fill="#1a1a1a"/>
  <circle cx="50" cy="50" r="8" fill="#0d0d0d" stroke="#444"/>
  <!-- Lens reflection -->
  <ellipse cx="44" cy="44" rx="5" ry="4" fill="white" opacity="0.15"/>
  <!-- Marking text -->
  <text x="50" y="72" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">MLX90614</text>
  <!-- 3 leads -->
  <line x1="32" y1="88" x2="28" y2="100" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="50" y1="91" x2="50" y2="100" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="68" y1="88" x2="72" y2="100" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="102" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">VCC</text>
  <text x="50" y="102" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">SDA</text>
  <text x="72" y="102" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="50" y="10" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#555" font-family="Arial">MLX90614 IR Temp</text>
</svg>''')

# CNY70 Reflective Optical Sensor
save('cny70.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 80" width="90" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- CNY70 plastic body (rectangular) -->
  <rect x="18" y="14" width="54" height="40" rx="3" fill="#111" stroke="#444" stroke-width="2" filter="url(#sh)"/>
  <!-- Two optical windows (IR emitter + detector) -->
  <rect x="24" y="18" width="18" height="22" rx="2" fill="#1a237e" stroke="#3f51b5" stroke-width="1.5"/>
  <circle cx="33" cy="29" r="7" fill="#3f51b5" opacity="0.7"/>
  <rect x="48" y="18" width="18" height="22" rx="2" fill="#1a1a1a" stroke="#333" stroke-width="1.5"/>
  <circle cx="57" cy="29" r="7" fill="#2196f3" opacity="0.5"/>
  <text x="33" y="46" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">EMIT</text>
  <text x="57" y="46" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">RECV</text>
  <!-- 4 leads: E(Anode) K(Cathode) C(Collector) E(Emitter) -->
  <line x1="28" y1="54" x2="26" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="38" y1="54" x2="38" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="52" y1="54" x2="52" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="62" y1="54" x2="64" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="26" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">A</text>
  <text x="38" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">K</text>
  <text x="52" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">C</text>
  <text x="64" y="80" text-anchor="middle" font-size="5" fill="#c8b400" font-family="Arial" font-weight="bold">E</text>
  <text x="45" y="8" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#555" font-family="Arial">CNY70</text>
</svg>''')

# KY-038 Sound module
save('ky-038.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="94" height="68" rx="4" fill="url(#bg)" stroke="#1b5e20" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Electret microphone (gold cylinder) -->
  <ellipse cx="28" cy="52" rx="17" ry="21" fill="#c8a800" stroke="#a08000" stroke-width="2"/>
  <ellipse cx="28" cy="36" rx="17" ry="9" fill="#d4b000" stroke="#a08000"/>
  <circle cx="28" cy="50" r="8" fill="#888"/>
  <!-- LM393 chip -->
  <rect x="52" y="38" width="34" height="22" rx="1" fill="#111" stroke="#333"/>
  <text x="69" y="51" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM393</text>
  <!-- Power + signal LEDs -->
  <circle cx="89" cy="34" r="4" fill="#f44336"/>
  <circle cx="89" cy="56" r="4" fill="#2196f3"/>
  <!-- Trim pot -->
  <circle cx="69" cy="68" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="69" y1="61" x2="69" y2="67" stroke="#555" stroke-width="2.5"/>
  <!-- 4-pin header: AO GND VCC DO -->
  <rect x="10" y="6" width="80" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="14" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="30" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="46" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="62" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="19" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="35" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="51" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="67" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="50" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">KY-038 Mic</text>
</svg>''')

# DS18B20 waterproof
save('ds18b20-waterproof.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 55" width="160" height="55">
  <!-- Cable -->
  <rect x="2" y="22" width="120" height="10" rx="4" fill="#333" stroke="#222" stroke-width="1.5"/>
  <!-- Stainless steel probe tube -->
  <rect x="118" y="14" width="40" height="26" rx="13" fill="#c0c0c0" stroke="#999" stroke-width="2"/>
  <!-- Probe tip (rounded) -->
  <ellipse cx="155" cy="27" rx="8" ry="13" fill="#aaa" stroke="#888" stroke-width="1.5"/>
  <!-- Wire colors at end: Red=VDD, Yellow=DQ, Black=GND -->
  <rect x="2" y="18" width="4" height="4" rx="1" fill="#f44336"/>
  <rect x="2" y="24" width="4" height="4" rx="1" fill="#ffeb3b"/>
  <rect x="2" y="30" width="4" height="4" rx="1" fill="#111"/>
  <text x="0" y="15" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">VDD</text>
  <text x="0" y="23" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">DQ</text>
  <text x="0" y="31" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="80" y="50" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#555" font-family="Arial">DS18B20 Waterproof</text>
</svg>''')

# Thermistor NTC
save('thermistor-ntc.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <!-- Disc body (blue for NTC) -->
  <circle cx="40" cy="32" r="24" fill="#1565C0" stroke="#0a3d7a" stroke-width="2"/>
  <circle cx="40" cy="32" r="17" fill="#1976d2" stroke="#1565C0" stroke-width="1"/>
  <!-- NTC marking -->
  <text x="40" y="29" text-anchor="middle" font-size="7.5" font-weight="bold" fill="white" font-family="Arial">NTC</text>
  <text x="40" y="40" text-anchor="middle" font-size="6" fill="#90CAF9" font-family="Arial">10kΩ</text>
  <!-- 2 leads -->
  <line x1="30" y1="56" x2="28" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="50" y1="56" x2="52" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="28" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">1</text>
  <text x="52" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">2</text>
  <text x="40" y="10" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#444" font-family="Arial">Thermistor</text>
</svg>''')

# Turbidity sensor
save('turbidity-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" width="140" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Control module PCB (blue) -->
  <rect x="3" y="3" width="90" height="60" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Op-amp chip -->
  <rect x="12" y="14" width="36" height="28" rx="1" fill="#111" stroke="#333"/>
  <text x="30" y="30" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LM358</text>
  <!-- LED power indicator -->
  <circle cx="58" cy="20" r="4" fill="#f44336"/>
  <!-- Trim pot -->
  <circle cx="70" cy="38" r="8" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="70" y1="30" x2="70" y2="36" stroke="#555" stroke-width="2.5"/>
  <!-- 5-pin header: GND VCC AO DO -->
  <rect x="6" y="54" width="80" height="12" rx="1" fill="#1a1a1a"/>
  <rect x="10" y="56" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="24" y="56" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="38" y="56" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="52" y="56" width="8" height="8" rx="1" fill="#c8b400"/>
  <text x="14" y="54" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="28" y="54" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="42" y="54" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">AO</text>
  <text x="56" y="54" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <!-- Sensor probe (Y-fork shape) -->
  <rect x="100" y="10" width="36" height="78" rx="4" fill="#e0e0e0" stroke="#bbb" stroke-width="2" filter="url(#sh)"/>
  <!-- LED window + photoreceiver -->
  <rect x="105" y="22" width="12" height="16" rx="2" fill="#1a237e" stroke="#3f51b5"/>
  <circle cx="111" cy="30" r="5" fill="#3f51b5" opacity="0.8"/>
  <rect x="119" y="22" width="12" height="16" rx="2" fill="#111" stroke="#444"/>
  <circle cx="125" cy="30" r="5" fill="#2196f3" opacity="0.5"/>
  <text x="111" y="50" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">EMIT</text>
  <text x="125" y="50" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">RECV</text>
  <text x="118" y="82" text-anchor="middle" font-size="6" fill="#555" font-family="Arial">Probe</text>
  <text x="70" y="90" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#333" font-family="Arial">Turbidity Sensor</text>
</svg>''')

# pH sensor
save('ph-sensor.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 105" width="160" height="105">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Control module PCB -->
  <rect x="2" y="2" width="100" height="60" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- Op-amp -->
  <rect x="10" y="12" width="40" height="28" rx="1" fill="#111" stroke="#333"/>
  <text x="30" y="28" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">LMV358</text>
  <!-- BNC connector for probe -->
  <circle cx="80" cy="30" r="10" fill="#888" stroke="#666" stroke-width="2"/>
  <circle cx="80" cy="30" r="5" fill="#444"/>
  <text x="80" y="48" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial">BNC</text>
  <!-- Trim pot -->
  <circle cx="56" cy="50" r="7" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <!-- 5-pin header: G V AO TO DO -->
  <rect x="6" y="52" width="88" height="12" rx="1" fill="#1a1a1a"/>
  <text x="12" y="50" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">G V AO TO DO</text>
  <!-- pH electrode probe (cylindrical glass) -->
  <rect x="115" y="6" width="20" height="68" rx="7" fill="#cce8ff" stroke="#90CAF9" stroke-width="2" filter="url(#sh)"/>
  <!-- Tip (pointed) -->
  <path d="M115,68 L125,84 L135,68 Z" fill="#cce8ff" stroke="#90CAF9" stroke-width="2"/>
  <!-- Internal glass bulb at tip -->
  <ellipse cx="125" cy="70" rx="7" ry="9" fill="#fff" stroke="#aaa" stroke-width="1.5" opacity="0.8"/>
  <!-- Reference solution (darker inside) -->
  <rect x="117" y="14" width="16" height="50" rx="6" fill="#90CAF9" opacity="0.3"/>
  <!-- Wire to BNC -->
  <line x1="115" y1="20" x2="95" y2="30" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <text x="80" y="98" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#333" font-family="Arial">pH Sensor Probe</text>
</svg>''')

# NRF24L01 PA+LNA module
save('nrf24l01-pa-lna.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#263238"/><stop offset="100%" stop-color="#102027"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="126" height="86" rx="4" fill="url(#bg)" stroke="#102027" stroke-width="2" filter="url(#sh)"/>
  <!-- External antenna (SMA) -->
  <rect x="2" y="30" width="16" height="30" rx="3" fill="#aaa" stroke="#888" stroke-width="1.5"/>
  <circle cx="10" cy="45" r="5" fill="#888" stroke="#777"/>
  <!-- Metal shielded module (NRF24L01+PA+LNA chip) -->
  <rect x="22" y="10" width="68" height="58" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="26" y="14" width="60" height="50" rx="2" fill="#666" stroke="#888"/>
  <!-- NRF24L01+ chip label -->
  <text x="56" y="38" text-anchor="middle" font-size="6" fill="#aaa" font-family="monospace">nRF24L01+</text>
  <text x="56" y="48" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">PA+LNA</text>
  <text x="56" y="57" text-anchor="middle" font-size="5" fill="#777" font-family="monospace">2.4GHz</text>
  <!-- Power LED -->
  <circle cx="106" cy="20" r="4" fill="#f44336"/>
  <!-- 8-pin header (2x4 arrangement): CE CSN SCK MOSI MISO IRQ VCC GND -->
  <rect x="96" y="30" width="30" height="56" rx="1" fill="#1a1a1a" stroke="#333"/>
  <rect x="100" y="34" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="114" y="34" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="100" y="46" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="114" y="46" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="100" y="58" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="114" y="58" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="100" y="70" width="8" height="8" rx="1" fill="#c8b400"/>
  <rect x="114" y="70" width="8" height="8" rx="1" fill="#c8b400"/>
  <text x="104" y="32" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">GND</text>
  <text x="118" y="32" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">VCC</text>
  <text x="104" y="44" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">CE</text>
  <text x="118" y="44" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">CSN</text>
  <text x="104" y="56" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">SCK</text>
  <text x="118" y="56" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">MOS</text>
  <text x="104" y="68" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">MIS</text>
  <text x="118" y="68" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">IRQ</text>
  <text x="65" y="82" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">nRF24L01 PA+LNA</text>
</svg>''')

# HC-12 long range module
save('hc-12.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474f"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="126" height="86" rx="4" fill="url(#bg)" stroke="#263238" stroke-width="2" filter="url(#sh)"/>
  <!-- Antenna wire (spring) -->
  <path d="M116,6 L116,50" stroke="#aaa" stroke-width="2" stroke-dasharray="4,2"/>
  <line x1="113" y1="6" x2="119" y2="6" stroke="#aaa" stroke-width="2"/>
  <!-- Module PCB with shielded section -->
  <rect x="14" y="10" width="96" height="60" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="18" y="14" width="84" height="52" rx="2" fill="#666" stroke="#888"/>
  <!-- SiLabs chip (Si4463) -->
  <rect x="30" y="24" width="50" height="34" rx="1" fill="#111" stroke="#333"/>
  <text x="55" y="40" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">HC-12</text>
  <text x="55" y="50" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">433MHz</text>
  <!-- Power LED -->
  <circle cx="90" cy="20" r="4" fill="#4caf50"/>
  <!-- 5-pin header: VCC GND RXD TXD SET -->
  <rect x="18" y="72" width="90" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="74" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="74" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="54" y="74" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="70" y="74" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="86" y="74" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="72" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="43" y="72" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="72" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">RXD</text>
  <text x="75" y="72" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">TXD</text>
  <text x="91" y="72" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SET</text>
  <text x="65" y="88" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">HC-12 RF Module</text>
</svg>''')

# LM2596 DC-DC Buck
save('lm2596.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="146" height="96" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- LM2596 SOT-263 chip (with big heatsink) -->
  <rect x="50" y="20" width="50" height="40" rx="2" fill="#333" stroke="#555"/>
  <rect x="56" y="14" width="38" height="14" rx="1" fill="#888" stroke="#666"/>
  <text x="75" y="42" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">LM2596</text>
  <text x="75" y="52" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Buck 3A</text>
  <!-- Schottky diode -->
  <rect x="14" y="32" width="24" height="16" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="26" y="43" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">1N5822</text>
  <!-- Inductor (ferrite core) -->
  <rect x="106" y="32" width="30" height="16" rx="2" fill="#888" stroke="#666"/>
  <path d="M110,40 a4,4 0 0,1 8,0 a4,4 0 0,1 8,0 a4,4 0 0,1 8,0" stroke="#c8a800" stroke-width="2" fill="none"/>
  <text x="121" y="55" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">100µH</text>
  <!-- Capacitors (electrolytic) -->
  <rect x="20" y="66" width="12" height="20" rx="3" fill="#111" stroke="#333"/>
  <text x="26" y="60" text-anchor="middle" font-size="4.5" fill="#888" font-family="Arial">100µF</text>
  <rect x="38" y="66" width="12" height="20" rx="3" fill="#111" stroke="#333"/>
  <!-- Multi-turn trim pot -->
  <circle cx="120" cy="74" r="10" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <circle cx="120" cy="74" r="6" fill="#ccc"/>
  <line x1="120" y1="64" x2="120" y2="70" stroke="#555" stroke-width="2"/>
  <text x="120" y="90" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">ADJ</text>
  <!-- IN/OUT screw terminals -->
  <rect x="4" y="62" width="36" height="32" rx="2" fill="#333" stroke="#555"/>
  <circle cx="14" cy="72" r="5" fill="#f44336" stroke="#c62828"/>
  <circle cx="32" cy="72" r="5" fill="#111" stroke="#333"/>
  <text x="14" y="84" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN+</text>
  <text x="32" y="84" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN-</text>
  <circle cx="14" cy="87" r="5" fill="#4caf50" stroke="#1b5e20"/>
  <circle cx="32" cy="87" r="5" fill="#111" stroke="#333"/>
  <text x="75" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">LM2596 Buck Converter</text>
</svg>''')

# Barrel jack
save('barrel-jack.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- Body (black plastic/metal) -->
  <rect x="10" y="20" width="60" height="40" rx="5" fill="#333" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- Barrel opening (circular hole) -->
  <circle cx="70" cy="40" r="15" fill="#555" stroke="#333" stroke-width="2"/>
  <circle cx="70" cy="40" r="10" fill="#222"/>
  <circle cx="70" cy="40" r="5" fill="#111"/>
  <!-- Pin contacts inside -->
  <circle cx="70" cy="40" r="2.5" fill="#888"/>
  <!-- Mounting tabs -->
  <rect x="14" y="14" width="10" height="8" rx="1" fill="#444" stroke="#222"/>
  <circle cx="19" cy="14" r="2.5" fill="none" stroke="#666" stroke-width="1"/>
  <rect x="56" y="14" width="10" height="8" rx="1" fill="#444" stroke="#222"/>
  <circle cx="61" cy="14" r="2.5" fill="none" stroke="#666" stroke-width="1"/>
  <!-- 3 solder pins: center(+) outer(-) -->
  <line x1="30" y1="60" x2="22" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="40" y1="60" x2="40" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="50" y1="60" x2="58" y2="78" stroke="#bbb" stroke-width="3.5" stroke-linecap="round"/>
  <text x="22" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">+</text>
  <text x="40" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">GND</text>
  <text x="58" y="81" text-anchor="middle" font-size="5.5" fill="#c8b400" font-family="Arial" font-weight="bold">-</text>
  <text x="40" y="15" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#888" font-family="Arial">DC Barrel Jack</text>
</svg>''')

# Battery holder (2xAA)
save('battery-holder-2cell.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 70" width="150" height="70">
  <!-- Outer housing -->
  <rect x="2" y="8" width="146" height="52" rx="5" fill="#555" stroke="#333" stroke-width="2"/>
  <!-- Individual cell compartments -->
  <rect x="6" y="12" width="62" height="44" rx="3" fill="#444" stroke="#333"/>
  <rect x="72" y="12" width="62" height="44" rx="3" fill="#444" stroke="#333"/>
  <!-- Positive terminal (+) AA placeholder -->
  <rect x="10" y="16" width="54" height="36" rx="2" fill="#333" stroke="#222"/>
  <text x="37" y="37" text-anchor="middle" font-size="11" fill="#888" font-family="Arial">AA</text>
  <rect x="76" y="16" width="54" height="36" rx="2" fill="#333" stroke="#222"/>
  <text x="103" y="37" text-anchor="middle" font-size="11" fill="#888" font-family="Arial">AA</text>
  <!-- Springs (- terminal) -->
  <text x="12" y="38" font-size="12" fill="#c8b400" font-family="Arial">~</text>
  <text x="78" y="38" font-size="12" fill="#c8b400" font-family="Arial">~</text>
  <!-- Leads: Red + Black - -->
  <line x1="40" y1="60" x2="38" y2="68" stroke="#f44336" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="110" y1="60" x2="112" y2="68" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
  <text x="38" y="71" text-anchor="middle" font-size="6" fill="#f44336" font-family="Arial" font-weight="bold">+</text>
  <text x="112" y="71" text-anchor="middle" font-size="6" fill="#888" font-family="Arial" font-weight="bold">-</text>
  <text x="75" y="6" text-anchor="middle" font-size="7" font-weight="bold" fill="#aaa" font-family="Arial">2xAA Battery Holder</text>
</svg>''')

# SIM900A GSM
save('sim900a.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474f"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="176" height="116" rx="4" fill="url(#bg)" stroke="#263238" stroke-width="2" filter="url(#sh)"/>
  <!-- SIM900A module (large metal can) -->
  <rect x="14" y="14" width="100" height="72" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="18" y="18" width="92" height="64" rx="2" fill="#666" stroke="#888"/>
  <text x="64" y="46" text-anchor="middle" font-size="9" fill="#aaa" font-family="monospace">SIM900A</text>
  <text x="64" y="58" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">GSM/GPRS</text>
  <text x="64" y="68" text-anchor="middle" font-size="6" fill="#777" font-family="monospace">900/1800MHz</text>
  <!-- SIM card slot -->
  <rect x="126" y="30" width="44" height="30" rx="2" fill="#888" stroke="#666"/>
  <rect x="130" y="34" width="36" height="22" rx="1" fill="#444"/>
  <text x="148" y="48" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">SIM CARD</text>
  <!-- Status LED -->
  <circle cx="130" cy="20" r="5" fill="#4caf50"/>
  <text x="130" y="28" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">NET</text>
  <!-- Antenna pad -->
  <rect x="148" y="72" width="20" height="12" rx="2" fill="#c0c0c0" stroke="#888"/>
  <text x="158" y="81" text-anchor="middle" font-size="5.5" fill="#555" font-family="Arial">ANT</text>
  <!-- Pin headers: UART + power -->
  <rect x="14" y="90" width="100" height="14" rx="1" fill="#1a1a1a"/>
  <text x="64" y="99" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">GND VCC RXD TXD DTR CTS RTS RI</text>
  <text x="90" y="113" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">SIM900A GSM Module</text>
</svg>''')

# ESP32-CAM
save('esp32-cam.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" width="140" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2d3748"/><stop offset="100%" stop-color="#1a2233"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="136" height="96" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- Camera module (OV2640 lens) -->
  <rect x="12" y="8" width="52" height="52" rx="4" fill="#222" stroke="#555" stroke-width="2"/>
  <!-- Lens barrel -->
  <circle cx="38" cy="34" r="22" fill="#111" stroke="#444" stroke-width="2"/>
  <circle cx="38" cy="34" r="16" fill="#0d0d0d" stroke="#333" stroke-width="1.5"/>
  <circle cx="38" cy="34" r="10" fill="#1a1a1a"/>
  <!-- Lens glass reflection -->
  <ellipse cx="32" cy="28" rx="6" ry="5" fill="white" opacity="0.12"/>
  <!-- ESP32 metal module -->
  <rect x="70" y="8" width="64" height="54" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="74" y="12" width="56" height="46" rx="2" fill="#666" stroke="#888"/>
  <text x="102" y="34" text-anchor="middle" font-size="7.5" fill="#aaa" font-family="monospace">ESP32-S</text>
  <text x="102" y="45" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">240MHz</text>
  <!-- SD card slot (micro) -->
  <rect x="12" y="64" width="44" height="16" rx="2" fill="#333" stroke="#555"/>
  <rect x="15" y="66" width="38" height="12" rx="1" fill="#222"/>
  <text x="34" y="75" text-anchor="middle" font-size="5.5" fill="#888" font-family="Arial">µSD</text>
  <!-- Flash LED (white high power) -->
  <rect x="60" y="64" width="16" height="16" rx="2" fill="#fffde7" stroke="#f5f5dc" stroke-width="1.5"/>
  <text x="68" y="75" text-anchor="middle" font-size="5" fill="#999" font-family="Arial">FLASH</text>
  <!-- Left side pins: 5V GND U0R U0T GPIO0 -->
  <rect x="0" y="8" width="12" height="60" rx="1" fill="#1a1a1a"/>
  <text x="6" y="16" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">5V</text>
  <text x="6" y="24" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="6" y="32" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">U0R</text>
  <text x="6" y="40" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">U0T</text>
  <text x="6" y="48" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP0</text>
  <text x="6" y="56" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP16</text>
  <!-- Right side pins -->
  <rect x="128" y="8" width="12" height="60" rx="1" fill="#1a1a1a"/>
  <text x="134" y="16" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <text x="134" y="24" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP1</text>
  <text x="134" y="32" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP3</text>
  <text x="134" y="40" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP14</text>
  <text x="134" y="48" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GP15</text>
  <text x="134" y="56" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="70" y="92" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">ESP32-CAM</text>
</svg>''')

# INA219 Current/Voltage
save('ina219.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b1fa2"/><stop offset="100%" stop-color="#4a148c"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#4a148c" stroke-width="1.5" filter="url(#sh)"/>
  <!-- INA219 SOIC chip -->
  <rect x="32" y="30" width="66" height="40" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="35" cy="33" r="2" fill="#555"/>
  <text x="65" y="50" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">INA219</text>
  <text x="65" y="60" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">I+V Monitor</text>
  <!-- Shunt resistor (R100 = 0.1 ohm) visible on PCB -->
  <rect x="4" y="40" width="24" height="12" rx="3" fill="#c8a800" stroke="#a07800" stroke-width="1.5"/>
  <text x="16" y="49" text-anchor="middle" font-size="5" fill="#7a5c00" font-family="Arial">R100</text>
  <!-- VIN+/VIN- screw terminals -->
  <rect x="4" y="36" width="10" height="10" rx="2" fill="#333" stroke="#555"/>
  <circle cx="9" cy="41" r="3.5" fill="#888" stroke="#666"/>
  <rect x="4" y="50" width="10" height="10" rx="2" fill="#333" stroke="#555"/>
  <circle cx="9" cy="55" r="3.5" fill="#888" stroke="#666"/>
  <text x="9" y="34" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">IN+</text>
  <text x="9" y="64" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">IN-</text>
  <!-- 4-pin header: VCC GND SDA SCL -->
  <rect x="24" y="6" width="82" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="28" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="44" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="60" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="76" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="33" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="49" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="65" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="81" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">INA219 Power Monitor</text>
</svg>''')

# BH1750 Light sensor
save('bh1750.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f57f17"/><stop offset="100%" stop-color="#e65100"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#e65100" stroke-width="1.5" filter="url(#sh)"/>
  <!-- BH1750 chip (WSOF6I tiny package) -->
  <rect x="34" y="32" width="52" height="36" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="37" cy="35" r="2" fill="#555"/>
  <!-- Light sensing window (shows through clear package) -->
  <rect x="42" y="38" width="36" height="24" rx="1" fill="#1a1a1a" stroke="#555"/>
  <circle cx="60" cy="50" r="10" fill="#222" stroke="#444"/>
  <!-- Sunlight rays (visible light spectrum) -->
  <circle cx="60" cy="50" r="5" fill="#ffeb3b" opacity="0.9"/>
  <!-- Label -->
  <text x="60" y="76" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">BH1750FVI</text>
  <!-- 5-pin header: VCC GND SCL SDA ADDR -->
  <rect x="12" y="6" width="96" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="16" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="32" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="48" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="64" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="80" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="21" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="37" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="53" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="69" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="85" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">ADR</text>
  <text x="60" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">BH1750 Lux Sensor</text>
</svg>''')

# PCA9685 PWM driver
save('pca9685.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#880e4f"/><stop offset="100%" stop-color="#560027"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="96" rx="4" fill="url(#bg)" stroke="#560027" stroke-width="2" filter="url(#sh)"/>
  <!-- PCA9685 SSOP28 chip -->
  <rect x="66" y="20" width="68" height="54" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="69" cy="23" r="2" fill="#555"/>
  <text x="100" y="44" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">PCA9685</text>
  <text x="100" y="56" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">16CH PWM</text>
  <text x="100" y="65" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">I2C</text>
  <!-- Oscillator crystal -->
  <rect x="146" y="36" width="22" height="10" rx="3" fill="#c0c0c0" stroke="#888"/>
  <text x="157" y="44" text-anchor="middle" font-size="4" fill="#555" font-family="Arial">25MHz</text>
  <!-- 16 PWM output pins (top row) as small squares (each is a servo connector) -->
  <rect x="4" y="6" width="192" height="14" rx="1" fill="#1a1a1a"/>
  <text x="100" y="14" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">CH0 CH1 CH2 CH3 CH4 CH5 CH6 CH7 CH8 CH9 CH10 CH11 CH12 CH13 CH14 CH15</text>
  <!-- I2C + VCC header on bottom -->
  <rect x="4" y="80" width="140" height="14" rx="1" fill="#1a1a1a"/>
  <rect x="8" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="24" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="40" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="56" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="72" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="88" y="82" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="13" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="29" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">OE</text>
  <text x="45" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCL</text>
  <text x="61" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SDA</text>
  <text x="77" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="93" y="79" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">V+</text>
  <text x="100" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">PCA9685 16-CH PWM Driver</text>
</svg>''')

# MG90S servo (metal gear variant, different from SG90)
save('mg90s.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Servo body (blue/black metal gear) -->
  <rect x="8" y="22" width="104" height="60" rx="5" fill="#444" stroke="#222" stroke-width="2.5" filter="url(#sh)"/>
  <!-- Mounting tabs -->
  <rect x="0" y="30" width="10" height="30" rx="2" fill="#333" stroke="#222"/>
  <circle cx="5" cy="45" r="3" fill="none" stroke="#555" stroke-width="1.5"/>
  <rect x="110" y="30" width="10" height="30" rx="2" fill="#333" stroke="#222"/>
  <circle cx="115" cy="45" r="3" fill="none" stroke="#555" stroke-width="1.5"/>
  <!-- Output shaft gear hub (metal/silver) -->
  <circle cx="32" cy="22" r="14" fill="#999" stroke="#777" stroke-width="2"/>
  <!-- Gear teeth -->
  <circle cx="32" cy="22" r="10" fill="#888" stroke="#666" stroke-width="1.5"/>
  <circle cx="32" cy="22" r="5" fill="#777"/>
  <!-- Cross-shaped horn mount slots -->
  <line x1="28" y1="22" x2="36" y2="22" stroke="#555" stroke-width="2"/>
  <line x1="32" y1="18" x2="32" y2="26" stroke="#555" stroke-width="2"/>
  <!-- Motor label -->
  <text x="72" y="50" text-anchor="middle" font-size="9" font-weight="bold" fill="#aaa" font-family="Arial">MG90S</text>
  <text x="72" y="63" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">Metal Gear Servo</text>
  <!-- 3-wire connector -->
  <rect x="62" y="8" width="44" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="66" y="10" width="8" height="12" rx="1" fill="#f44336"/>
  <rect x="80" y="10" width="8" height="12" rx="1" fill="#c8b400"/>
  <rect x="94" y="10" width="8" height="12" rx="1" fill="#333"/>
  <text x="70" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="84" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="98" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
</svg>''')

# SG90-360 continuous rotation servo
save('sg90s-360.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <rect x="8" y="22" width="104" height="60" rx="5" fill="#555" stroke="#333" stroke-width="2.5" filter="url(#sh)"/>
  <rect x="0" y="30" width="10" height="30" rx="2" fill="#444" stroke="#333"/>
  <circle cx="5" cy="45" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <rect x="110" y="30" width="10" height="30" rx="2" fill="#444" stroke="#333"/>
  <circle cx="115" cy="45" r="3" fill="none" stroke="#666" stroke-width="1.5"/>
  <!-- Continuous rotation symbol (double arrow circle) -->
  <circle cx="32" cy="22" r="14" fill="#777" stroke="#555" stroke-width="2"/>
  <circle cx="32" cy="22" r="8" fill="#666" stroke="#444" stroke-width="1.5"/>
  <!-- Rotation arrows -->
  <path d="M24,22 A8,8 0 1,1 40,22" stroke="#ffeb3b" stroke-width="2" fill="none" marker-end="url(#arr)"/>
  <text x="72" y="50" text-anchor="middle" font-size="8" font-weight="bold" fill="#aaa" font-family="Arial">SG90 360°</text>
  <text x="72" y="62" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">Continuous Servo</text>
  <!-- Wire connector -->
  <rect x="60" y="8" width="44" height="16" rx="2" fill="#1a1a1a"/>
  <rect x="64" y="10" width="8" height="12" rx="1" fill="#f44336"/>
  <rect x="78" y="10" width="8" height="12" rx="1" fill="#c8b400"/>
  <rect x="92" y="10" width="8" height="12" rx="1" fill="#333"/>
  <text x="68" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="82" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="96" y="6" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
</svg>''')

# Motor driver (generic L293D style - DIFFERENT from L298N)
save('motor-driver.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#263238"/><stop offset="100%" stop-color="#102027"/>
  </linearGradient></defs>
  <rect x="3" y="3" width="124" height="84" rx="4" fill="url(#bg)" stroke="#102027" stroke-width="2" filter="url(#sh)"/>
  <!-- L293D DIP-16 chip -->
  <rect x="32" y="14" width="66" height="58" rx="3" fill="#111" stroke="#333" stroke-width="2"/>
  <!-- Notch -->
  <ellipse cx="65" cy="14" rx="10" ry="6" fill="#222" stroke="#444"/>
  <circle cx="38" cy="21" r="2.5" fill="#555"/>
  <text x="65" y="42" text-anchor="middle" font-size="8" fill="#888" font-family="monospace">L293D</text>
  <text x="65" y="54" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">H-Bridge</text>
  <!-- Left DIP pins -->
  <line x1="10" y1="22" x2="32" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="25" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">EN1</text>
  <line x1="10" y1="32" x2="32" y2="32" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="35" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">IN1</text>
  <line x1="10" y1="42" x2="32" y2="42" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="45" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">OUT1</text>
  <line x1="10" y1="52" x2="32" y2="52" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="55" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">GND</text>
  <line x1="10" y1="62" x2="32" y2="62" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="65" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">GND</text>
  <line x1="10" y1="72" x2="32" y2="72" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="75" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">IN2</text>
  <line x1="10" y1="82" x2="32" y2="82" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="8" y="85" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">OUT2</text>
  <!-- Right DIP pins -->
  <line x1="98" y1="22" x2="120" y2="22" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="25" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">VCC</text>
  <line x1="98" y1="32" x2="120" y2="32" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="35" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">IN4</text>
  <line x1="98" y1="42" x2="120" y2="42" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="45" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">OUT4</text>
  <line x1="98" y1="52" x2="120" y2="52" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="55" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">GND</text>
  <line x1="98" y1="62" x2="120" y2="62" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="65" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">GND</text>
  <line x1="98" y1="72" x2="120" y2="72" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="75" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">IN3</text>
  <line x1="98" y1="82" x2="120" y2="82" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/><text x="122" y="85" text-anchor="start" font-size="4.5" fill="#888" font-family="Arial">EN2</text>
  <text x="65" y="12" text-anchor="middle" font-size="6.5" font-weight="bold" fill="#888" font-family="Arial">L293D Motor Driver</text>
</svg>''')

# MAX7219 LED matrix
save('max7219-matrix.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="130" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="2" width="126" height="126" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- 8x8 LED matrix grid (64 dots) -->
  <g fill="#f44336" opacity="0.85">
    <!-- Row 1 pattern: 01111110 -->
    <circle cx="14" cy="14" r="4.5" opacity="0.2"/>
    <circle cx="28" cy="14" r="4.5"/>
    <circle cx="42" cy="14" r="4.5"/>
    <circle cx="56" cy="14" r="4.5"/>
    <circle cx="70" cy="14" r="4.5"/>
    <circle cx="84" cy="14" r="4.5"/>
    <circle cx="98" cy="14" r="4.5"/>
    <circle cx="112" cy="14" r="4.5" opacity="0.2"/>
    <!-- Row 2: 10000001 -->
    <circle cx="14" cy="28" r="4.5"/>
    <circle cx="28" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="42" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="56" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="70" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="84" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="98" cy="28" r="4.5" opacity="0.2"/>
    <circle cx="112" cy="28" r="4.5"/>
    <!-- Row 3 full -->
    <circle cx="14" cy="42" r="4.5"/>
    <circle cx="28" cy="42" r="4.5"/>
    <circle cx="42" cy="42" r="4.5"/>
    <circle cx="56" cy="42" r="4.5"/>
    <circle cx="70" cy="42" r="4.5"/>
    <circle cx="84" cy="42" r="4.5"/>
    <circle cx="98" cy="42" r="4.5"/>
    <circle cx="112" cy="42" r="4.5"/>
    <!-- Row 4 alternating -->
    <circle cx="14" cy="56" r="4.5" opacity="0.2"/>
    <circle cx="28" cy="56" r="4.5"/>
    <circle cx="42" cy="56" r="4.5" opacity="0.2"/>
    <circle cx="56" cy="56" r="4.5"/>
    <circle cx="70" cy="56" r="4.5" opacity="0.2"/>
    <circle cx="84" cy="56" r="4.5"/>
    <circle cx="98" cy="56" r="4.5" opacity="0.2"/>
    <circle cx="112" cy="56" r="4.5"/>
    <!-- Row 5-8 similar patterns -->
    <circle cx="14" cy="70" r="4.5"/>
    <circle cx="28" cy="70" r="4.5" opacity="0.2"/>
    <circle cx="56" cy="70" r="4.5"/>
    <circle cx="84" cy="70" r="4.5" opacity="0.2"/>
    <circle cx="112" cy="70" r="4.5"/>
    <circle cx="14" cy="84" r="4.5"/>
    <circle cx="42" cy="84" r="4.5"/>
    <circle cx="70" cy="84" r="4.5"/>
    <circle cx="98" cy="84" r="4.5"/>
    <circle cx="14" cy="98" r="4.5"/>
    <circle cx="56" cy="98" r="4.5"/>
    <circle cx="70" cy="98" r="4.5"/>
    <circle cx="112" cy="98" r="4.5"/>
    <circle cx="28" cy="112" r="4.5"/>
    <circle cx="42" cy="112" r="4.5"/>
    <circle cx="70" cy="112" r="4.5"/>
    <circle cx="84" cy="112" r="4.5"/>
    <circle cx="112" cy="112" r="4.5"/>
  </g>
  <!-- 5-pin header: VCC GND DIN CS CLK -->
  <rect x="14" y="116" width="100" height="12" rx="1" fill="#1a1a1a"/>
  <text x="64" y="124" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VCC GND DIN CS CLK</text>
  <text x="64" y="128" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="Arial">MAX7219 8x8</text>
</svg>''')

# WS2812 matrix
save('ws2812-matrix.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="130" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="2" width="126" height="126" rx="4" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- 4x4 WS2812 matrix (larger LEDs than MAX7219) -->
  <rect x="10" y="10" width="25" height="25" rx="2" fill="#f44336" opacity="0.9"/>
  <rect x="40" y="10" width="25" height="25" rx="2" fill="#ff9800" opacity="0.9"/>
  <rect x="70" y="10" width="25" height="25" rx="2" fill="#ffeb3b" opacity="0.9"/>
  <rect x="100" y="10" width="25" height="25" rx="2" fill="#4caf50" opacity="0.9"/>
  <rect x="10" y="40" width="25" height="25" rx="2" fill="#00bcd4" opacity="0.9"/>
  <rect x="40" y="40" width="25" height="25" rx="2" fill="#2196f3" opacity="0.9"/>
  <rect x="70" y="40" width="25" height="25" rx="2" fill="#9c27b0" opacity="0.9"/>
  <rect x="100" y="40" width="25" height="25" rx="2" fill="#e91e63" opacity="0.9"/>
  <rect x="10" y="70" width="25" height="25" rx="2" fill="#ff5722" opacity="0.9"/>
  <rect x="40" y="70" width="25" height="25" rx="2" fill="#8bc34a" opacity="0.9"/>
  <rect x="70" y="70" width="25" height="25" rx="2" fill="#00e5ff" opacity="0.9"/>
  <rect x="100" y="70" width="25" height="25" rx="2" fill="#651fff" opacity="0.9"/>
  <rect x="10" y="100" width="25" height="25" rx="2" fill="#ff1744" opacity="0.9"/>
  <rect x="40" y="100" width="25" height="25" rx="2" fill="#00e676" opacity="0.9"/>
  <rect x="70" y="100" width="25" height="25" rx="2" fill="#ffc400" opacity="0.9"/>
  <rect x="100" y="100" width="25" height="25" rx="2" fill="#2979ff" opacity="0.9"/>
  <!-- Signal pads -->
  <rect x="10" y="118" width="60" height="10" rx="1" fill="#1a1a1a"/>
  <text x="40" y="125" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">DIN VCC GND DOUT</text>
  <text x="65" y="128" text-anchor="middle" font-size="7.5" font-weight="bold" fill="white" font-family="Arial">WS2812 4x4 Matrix</text>
</svg>''')

# Power module (MB102)
save('power-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c62828"/><stop offset="100%" stop-color="#7f0000"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="76" rx="4" fill="url(#bg)" stroke="#7f0000" stroke-width="2" filter="url(#sh)"/>
  <!-- Voltage regulators (LM7805 / AMS1117) -->
  <rect x="16" y="14" width="36" height="30" rx="2" fill="#111" stroke="#333"/>
  <text x="34" y="28" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">LM7805</text>
  <text x="34" y="37" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">5V</text>
  <rect x="60" y="14" width="36" height="30" rx="2" fill="#111" stroke="#333"/>
  <text x="78" y="28" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">AMS1117</text>
  <text x="78" y="37" text-anchor="middle" font-size="5" fill="#666" font-family="monospace">3.3V</text>
  <!-- Output jumpers (select 5V or 3.3V per rail) -->
  <rect x="106" y="14" width="44" height="30" rx="2" fill="#333" stroke="#555"/>
  <text x="128" y="24" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">RAIL1</text>
  <rect x="110" y="26" width="14" height="8" rx="1" fill="#555" stroke="#777"/>
  <rect x="110" y="28" width="6" height="4" rx="1" fill="#ffeb3b"/>
  <text x="130" y="32" font-size="5" fill="#aaa" font-family="Arial">5V/3V3</text>
  <!-- USB input connector (5.5V) + DC jack -->
  <rect x="4" y="52" width="20" height="16" rx="3" fill="#888" stroke="#666"/>
  <rect x="7" y="55" width="14" height="10" rx="1" fill="#444"/>
  <text x="14" y="72" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">USB</text>
  <!-- Output rails on top: +5V GND GND +3.3V per column -->
  <rect x="28" y="52" width="126" height="22" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="91" y="60" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">+5V  GND  GND  +3.3V  +5V  GND  GND  +3.3V</text>
  <text x="80" y="78" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">MB102 Breadboard Power</text>
</svg>''')

# BTS7960 motor driver
save('bts7960.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110" width="180" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="176" height="106" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- BTS7960 ICs (2 half bridges) -->
  <rect x="30" y="14" width="52" height="50" rx="2" fill="#333" stroke="#555"/>
  <rect x="36" y="8" width="40" height="12" rx="1" fill="#999" stroke="#777"/>
  <text x="56" y="42" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">BTS7960</text>
  <text x="56" y="52" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">H-Bridge</text>
  <!-- Current sense shunt -->
  <rect x="96" y="28" width="32" height="18" rx="2" fill="#888" stroke="#666"/>
  <text x="112" y="40" text-anchor="middle" font-size="5.5" fill="#555" font-family="monospace">SENSE</text>
  <!-- Motor output terminals (screw) -->
  <rect x="138" y="18" width="36" height="46" rx="2" fill="#444" stroke="#333"/>
  <circle cx="152" cy="32" r="6" fill="#888" stroke="#666"/><line x1="147" y1="32" x2="157" y2="32" stroke="#555" stroke-width="1.5"/>
  <circle cx="166" cy="32" r="6" fill="#888" stroke="#666"/><line x1="161" y1="32" x2="171" y2="32" stroke="#555" stroke-width="1.5"/>
  <circle cx="152" cy="52" r="6" fill="#888" stroke="#666"/><line x1="147" y1="52" x2="157" y2="52" stroke="#555" stroke-width="1.5"/>
  <circle cx="166" cy="52" r="6" fill="#888" stroke="#666"/><line x1="161" y1="52" x2="171" y2="52" stroke="#555" stroke-width="1.5"/>
  <text x="152" y="14" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">M+</text>
  <text x="166" y="14" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">M-</text>
  <!-- 8-pin logic header: VCC GND IS_R IS_L EN_R EN_L PWM_R PWM_L -->
  <rect x="14" y="68" width="150" height="16" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="89" y="79" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VCC GND IS_R IS_L EN_R EN_L PWM_R PWM_L</text>
  <text x="89" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">BTS7960 43A Motor Driver</text>
</svg>''')

# Generic sensor module (for fallback)
save('sensor-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0a3d7a"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#0a3d7a" stroke-width="1.5" filter="url(#sh)"/>
  <rect x="26" y="32" width="68" height="42" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="29" cy="35" r="2" fill="#555"/>
  <text x="60" y="57" text-anchor="middle" font-size="10" fill="#888" font-family="monospace">SENSOR</text>
  <!-- 4-pin header: VCC GND SIG DO -->
  <rect x="18" y="6" width="84" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="54" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="70" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="43" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">SIG</text>
  <text x="75" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DO</text>
  <text x="60" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">Sensor Module</text>
</svg>''')

# Communication module (generic - 433MHz/RF)
save('comm-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474f"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#263238" stroke-width="1.5" filter="url(#sh)"/>
  <!-- RF antenna (spring/whip) -->
  <path d="M112,60 L112,12" stroke="#aaa" stroke-width="2" stroke-dasharray="3,2"/>
  <line x1="108" y1="12" x2="116" y2="12" stroke="#aaa" stroke-width="2"/>
  <!-- Generic RF module -->
  <rect x="14" y="28" width="88" height="48" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="18" y="32" width="80" height="40" rx="2" fill="#666" stroke="#888"/>
  <text x="58" y="52" text-anchor="middle" font-size="9" fill="#aaa" font-family="monospace">RF MODULE</text>
  <text x="58" y="62" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">433 MHz</text>
  <!-- 4-pin header: VCC GND DATA ANT -->
  <rect x="18" y="6" width="84" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="22" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="38" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="54" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="70" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="27" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="43" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="59" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">DATA</text>
  <text x="75" y="3" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">ANT</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">RF Comm Module</text>
</svg>''')

# Max6675 thermocouple
save('max6675.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#b71c1c"/><stop offset="100%" stop-color="#7f0000"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="124" height="68" rx="4" fill="url(#bg)" stroke="#7f0000" stroke-width="1.5" filter="url(#sh)"/>
  <!-- MAX6675 SOP-8 chip -->
  <rect x="34" y="30" width="62" height="38" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="37" cy="33" r="2" fill="#555"/>
  <text x="65" y="50" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">MAX6675</text>
  <text x="65" y="60" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">K-Type TC</text>
  <!-- Thermocouple screw terminals -->
  <rect x="4" y="38" width="26" height="22" rx="2" fill="#444" stroke="#333"/>
  <circle cx="12" cy="46" r="5.5" fill="#888" stroke="#666"/><line x1="8" y1="46" x2="16" y2="46" stroke="#555" stroke-width="1.5"/>
  <circle cx="24" cy="46" r="5.5" fill="#888" stroke="#666"/><line x1="20" y1="46" x2="28" y2="46" stroke="#555" stroke-width="1.5"/>
  <text x="12" y="56" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">T+</text>
  <text x="24" y="56" text-anchor="middle" font-size="4.5" fill="#ddd" font-family="Arial">T-</text>
  <!-- 5-pin header: SO SCK CS GND VCC -->
  <rect x="14" y="6" width="102" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <rect x="18" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="34" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="50" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="66" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="82" y="8" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="23" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SO</text>
  <text x="39" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">SCK</text>
  <text x="55" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">CS</text>
  <text x="71" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="87" y="3" text-anchor="middle" font-size="5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="65" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">MAX6675 Thermocouple</text>
</svg>''')

# BMS 3S balance board
save('bms-3s.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="160" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a237e"/><stop offset="100%" stop-color="#0d1452"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="96" rx="4" fill="url(#bg)" stroke="#0d1452" stroke-width="2" filter="url(#sh)"/>
  <!-- DW01 protection ICs -->
  <rect x="14" y="16" width="28" height="20" rx="1" fill="#111" stroke="#333"/>
  <text x="28" y="29" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">DW01</text>
  <rect x="14" y="42" width="28" height="20" rx="1" fill="#111" stroke="#333"/>
  <text x="28" y="55" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">DW01</text>
  <!-- MOSFETs -->
  <rect x="52" y="16" width="22" height="46" rx="1" fill="#333" stroke="#555"/>
  <text x="63" y="42" text-anchor="middle" font-size="5" fill="#888" font-family="monospace" transform="rotate(-90 63 42)">MOSFET</text>
  <rect x="80" y="16" width="22" height="46" rx="1" fill="#333" stroke="#555"/>
  <!-- Balance resistors -->
  <rect x="110" y="20" width="32" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <rect x="110" y="34" width="32" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <rect x="110" y="48" width="32" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <!-- Cell terminals (B+, B1, B2, B-) -->
  <rect x="14" y="70" width="128" height="22" rx="2" fill="#333" stroke="#555"/>
  <text x="78" y="82" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">B+ B1 B2 B- | P+ P- (Load)</text>
  <text x="78" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">BMS 3S 10A Li-Ion</text>
</svg>''')

# LCD-12864 Graphical
save('lcd-12864.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB -->
  <rect x="2" y="2" width="196" height="96" rx="4" fill="#1565C0" stroke="#0a3d7a" stroke-width="2" filter="url(#sh)"/>
  <!-- Screen area -->
  <rect x="14" y="10" width="172" height="60" rx="3" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
  <!-- Graphical pixel area -->
  <rect x="16" y="12" width="168" height="56" rx="2" fill="#388e3c"/>
  <!-- Simulated text and simple graphic -->
  <text x="18" y="24" font-family="Courier New" font-size="8" fill="#1b5e20">TinkerAI System</text>
  <text x="18" y="34" font-family="Courier New" font-size="7" fill="#1b5e20">128x64 Graphical</text>
  <!-- Simple waveform graphic -->
  <path d="M18,46 L28,42 L38,50 L48,42 L58,50 L68,42 L78,50 L88,42 L98,50" stroke="#1b5e20" stroke-width="1.5" fill="none"/>
  <!-- 20-pin header -->
  <rect x="14" y="74" width="172" height="14" rx="1" fill="#1a1a1a"/>
  <text x="100" y="83" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VSS VDD V0 RS R/W E DB0..DB7 CS1 CS2 RST VEE A K</text>
  <text x="100" y="97" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">LCD 128x64 Graphical</text>
</svg>''')

# Nextion display
save('nextion-24.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" width="200" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Display bezel -->
  <rect x="2" y="2" width="196" height="126" rx="8" fill="#333" stroke="#111" stroke-width="3" filter="url(#sh)"/>
  <!-- TFT screen -->
  <rect x="10" y="10" width="180" height="98" rx="4" fill="#001933" stroke="#1565C0" stroke-width="2"/>
  <!-- Screen UI mockup (Nextion style touch buttons) -->
  <rect x="16" y="16" width="78" height="40" rx="4" fill="#1565C0" stroke="#2196f3" stroke-width="1.5"/>
  <text x="55" y="40" text-anchor="middle" font-size="9" fill="white" font-family="Arial" font-weight="bold">ON / OFF</text>
  <rect x="100" y="16" width="84" height="40" rx="4" fill="#e53935" stroke="#ef5350" stroke-width="1.5"/>
  <text x="142" y="40" text-anchor="middle" font-size="9" fill="white" font-family="Arial" font-weight="bold">MENU</text>
  <rect x="16" y="64" width="168" height="38" rx="4" fill="#1a1a1a" stroke="#333"/>
  <text x="100" y="87" text-anchor="middle" font-size="11" fill="#4caf50" font-family="Courier New" font-weight="bold">Nextion HMI 2.4"</text>
  <!-- 4-pin UART connector: VCC GND TX RX -->
  <rect x="60" y="112" width="80" height="14" rx="2" fill="#1a1a1a"/>
  <rect x="64" y="114" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="80" y="114" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="96" y="114" width="10" height="10" rx="1" fill="#c8b400"/>
  <rect x="112" y="114" width="10" height="10" rx="1" fill="#c8b400"/>
  <text x="69" y="111" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">VCC</text>
  <text x="85" y="111" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">GND</text>
  <text x="101" y="111" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">TX</text>
  <text x="117" y="111" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial" font-weight="bold">RX</text>
</svg>''')

# L298N mini
save('l298n-mini.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- PCB (smaller than full L298N) -->
  <rect x="3" y="3" width="114" height="94" rx="4" fill="#4caf50" stroke="#1b5e20" stroke-width="2" filter="url(#sh)"/>
  <!-- L298N chip (smaller footprint PSOP20) -->
  <rect x="34" y="18" width="52" height="50" rx="2" fill="#111" stroke="#333"/>
  <text x="60" y="44" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">L298N</text>
  <text x="60" y="55" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Mini</text>
  <!-- Motor output (2 terminals) -->
  <rect x="4" y="24" width="26" height="36" rx="2" fill="#333" stroke="#222"/>
  <circle cx="12" cy="36" r="5" fill="#888" stroke="#666"/><line x1="8" y1="36" x2="16" y2="36" stroke="#555" stroke-width="1.5"/>
  <circle cx="24" cy="36" r="5" fill="#888" stroke="#666"/><line x1="20" y1="36" x2="28" y2="36" stroke="#555" stroke-width="1.5"/>
  <circle cx="12" cy="52" r="5" fill="#888" stroke="#666"/>
  <circle cx="24" cy="52" r="5" fill="#888" stroke="#666"/>
  <rect x="90" y="24" width="26" height="36" rx="2" fill="#333" stroke="#222"/>
  <circle cx="100" cy="36" r="5" fill="#888" stroke="#666"/>
  <circle cx="112" cy="36" r="5" fill="#888" stroke="#666"/>
  <circle cx="100" cy="52" r="5" fill="#888" stroke="#666"/>
  <circle cx="112" cy="52" r="5" fill="#888" stroke="#666"/>
  <!-- Bottom header pins -->
  <rect x="14" y="72" width="92" height="22" rx="2" fill="#1a1a1a"/>
  <text x="60" y="82" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">ENA IN1 IN2 IN3 IN4 ENB 12V GND 5V</text>
  <text x="60" y="95" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">L298N Mini</text>
</svg>''')

# Misc: TFT module, OV7670, Pi Camera, Jetson, Microbit, etc.
save('tft-module.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <rect x="2" y="2" width="176" height="116" rx="4" fill="#222" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- ILI9341 TFT display panel -->
  <rect x="8" y="8" width="164" height="92" rx="3" fill="#001a33" stroke="#1565C0" stroke-width="1.5"/>
  <!-- Simple UI on TFT -->
  <rect x="12" y="12" width="76" height="44" rx="2" fill="#1565C0" opacity="0.8"/>
  <text x="50" y="36" text-anchor="middle" font-size="8" fill="white" font-family="Arial" font-weight="bold">TFT 2.8"</text>
  <text x="50" y="48" text-anchor="middle" font-size="6.5" fill="#90CAF9" font-family="Arial">240x320</text>
  <rect x="96" y="12" width="70" height="44" rx="2" fill="#e53935" opacity="0.7"/>
  <text x="131" y="38" text-anchor="middle" font-size="8" fill="white" font-family="Arial" font-weight="bold">ILI9341</text>
  <!-- Touch panel -->
  <rect x="12" y="62" width="154" height="32" rx="2" fill="#333" opacity="0.7"/>
  <text x="89" y="82" text-anchor="middle" font-size="7.5" fill="#90CAF9" font-family="Arial">Resistive Touch Screen</text>
  <!-- SPI+Touch pin header (8-pin) -->
  <rect x="12" y="104" width="156" height="12" rx="1" fill="#1a1a1a"/>
  <text x="90" y="112" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VCC GND CS RESET DC SDI SCK LED (SPI)</text>
</svg>''')

save('ov7670.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Camera module PCB -->
  <rect x="4" y="4" width="92" height="112" rx="5" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Lens module (black cylinder) -->
  <circle cx="50" cy="42" r="30" fill="#222" stroke="#444" stroke-width="2"/>
  <circle cx="50" cy="42" r="22" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="50" cy="42" r="16" fill="#0d0d0d" stroke="#222"/>
  <circle cx="50" cy="42" r="10" fill="#1a1a1a"/>
  <ellipse cx="42" cy="34" rx="6" ry="5" fill="white" opacity="0.1"/>
  <!-- OV7670 sensor label -->
  <text x="50" y="58" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">OV7670</text>
  <text x="50" y="68" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">VGA Camera</text>
  <!-- 18-pin header (2 rows of 9) on bottom -->
  <rect x="4" y="82" width="92" height="32" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="50" y="92" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">3V3 GND SIOC SIOD VSYNC</text>
  <text x="50" y="101" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">HREF PCLK XCLK D7..D0</text>
  <text x="50" y="112" text-anchor="middle" font-size="7.5" font-weight="bold" fill="white" font-family="Arial">OV7670 Camera</text>
</svg>''')

save('pi-camera-v2.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" width="110" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- Raspberry Pi camera module v2 PCB -->
  <rect x="4" y="4" width="102" height="86" rx="5" fill="#007a2f" stroke="#004d1a" stroke-width="2" filter="url(#sh)"/>
  <!-- Lens barrel (Sony IMX219) -->
  <circle cx="55" cy="40" r="28" fill="#111" stroke="#333" stroke-width="2"/>
  <circle cx="55" cy="40" r="20" fill="#0d0d0d" stroke="#222" stroke-width="1.5"/>
  <circle cx="55" cy="40" r="13" fill="#1a1a1a"/>
  <circle cx="55" cy="40" r="6" fill="#222"/>
  <ellipse cx="46" cy="32" rx="7" ry="6" fill="white" opacity="0.12"/>
  <!-- IMX219 sensor label -->
  <text x="55" y="57" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">IMX219</text>
  <text x="55" y="66" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">8MP NoIR</text>
  <!-- FFC connector (flat flex cable) at bottom -->
  <rect x="30" y="76" width="50" height="12" rx="2" fill="#888" stroke="#666" stroke-width="1.5"/>
  <rect x="34" y="78" width="42" height="8" rx="1" fill="#444"/>
  <text x="55" y="85" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">CSI Flat Cable</text>
  <text x="55" y="96" text-anchor="middle" font-size="7.5" font-weight="bold" fill="white" font-family="Arial">Pi Camera v2</text>
</svg>''')

save('microbit.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="180" height="120">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/>
  </linearGradient></defs>
  <rect x="4" y="4" width="172" height="112" rx="8" fill="url(#bg)" stroke="#b71c1c" stroke-width="2" filter="url(#sh)"/>
  <!-- 5x5 LED matrix (25 LEDs) -->
  <g fill="#ffeb3b">
    <circle cx="50" cy="30" r="4"/><circle cx="64" cy="30" r="4"/><circle cx="78" cy="30" r="4"/><circle cx="92" cy="30" r="4"/><circle cx="106" cy="30" r="4"/>
    <circle cx="50" cy="44" r="4"/><circle cx="64" cy="44" r="4" opacity="0.3"/><circle cx="78" cy="44" r="4"/><circle cx="92" cy="44" r="4" opacity="0.3"/><circle cx="106" cy="44" r="4"/>
    <circle cx="50" cy="58" r="4"/><circle cx="64" cy="58" r="4"/><circle cx="78" cy="58" r="4"/><circle cx="92" cy="58" r="4"/><circle cx="106" cy="58" r="4"/>
    <circle cx="50" cy="72" r="4" opacity="0.3"/><circle cx="64" cy="72" r="4"/><circle cx="78" cy="72" r="4" opacity="0.3"/><circle cx="92" cy="72" r="4"/><circle cx="106" cy="72" r="4" opacity="0.3"/>
    <circle cx="50" cy="86" r="4"/><circle cx="64" cy="86" r="4"/><circle cx="78" cy="86" r="4"/><circle cx="92" cy="86" r="4"/><circle cx="106" cy="86" r="4"/>
  </g>
  <!-- A and B buttons -->
  <rect x="14" y="44" width="24" height="24" rx="12" fill="#f8bbd9" stroke="#e91e63" stroke-width="2"/>
  <text x="26" y="59" text-anchor="middle" font-size="9" fill="#c2185b" font-family="Arial" font-weight="bold">A</text>
  <rect x="142" y="44" width="24" height="24" rx="12" fill="#f8bbd9" stroke="#e91e63" stroke-width="2"/>
  <text x="154" y="59" text-anchor="middle" font-size="9" fill="#c2185b" font-family="Arial" font-weight="bold">B</text>
  <!-- Edge connector (25 pins) -->
  <rect x="4" y="100" width="172" height="16" rx="3" fill="#c8a800"/>
  <text x="90" y="111" text-anchor="middle" font-size="7" fill="#7a5c00" font-family="Arial" font-weight="bold">P0 P1 P2 3V GND (25-pin)</text>
</svg>''')

save('jetson-nano.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width="220" height="180">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="216" height="176" rx="5" fill="url(#bg)" stroke="#111" stroke-width="3" filter="url(#sh)"/>
  <!-- Tegra X1 SoC + heatsink -->
  <rect x="70" y="50" width="80" height="80" rx="3" fill="#444" stroke="#555" stroke-width="2"/>
  <!-- Heatsink fins -->
  <rect x="72" y="42" width="76" height="14" rx="1" fill="#888" stroke="#666"/>
  <line x1="82" y1="42" x2="82" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="92" y1="42" x2="92" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="102" y1="42" x2="102" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="112" y1="42" x2="112" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="122" y1="42" x2="122" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="132" y1="42" x2="132" y2="56" stroke="#666" stroke-width="2.5"/>
  <line x1="142" y1="42" x2="142" y2="56" stroke="#666" stroke-width="2.5"/>
  <text x="110" y="82" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">NVIDIA</text>
  <text x="110" y="94" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">Jetson Nano</text>
  <text x="110" y="106" text-anchor="middle" font-size="6" fill="#666" font-family="monospace">4GB LPDDR4</text>
  <!-- USB 3.0 x4 ports (right side) -->
  <rect x="186" y="42" width="30" height="20" rx="2" fill="#333" stroke="#555"/>
  <rect x="186" y="66" width="30" height="20" rx="2" fill="#333" stroke="#555"/>
  <rect x="186" y="90" width="30" height="20" rx="2" fill="#1565C0" stroke="#0d47a1"/>
  <rect x="186" y="114" width="30" height="20" rx="2" fill="#1565C0" stroke="#0d47a1"/>
  <text x="201" y="55" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">USB 3.0</text>
  <text x="201" y="103" text-anchor="middle" font-size="5.5" fill="#90CAF9" font-family="Arial">USB3</text>
  <!-- HDMI -->
  <rect x="2" y="42" width="24" height="14" rx="1" fill="#222" stroke="#555"/>
  <text x="14" y="51" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">HDMI</text>
  <!-- Ethernet -->
  <rect x="2" y="60" width="24" height="20" rx="1" fill="#333" stroke="#555"/>
  <text x="14" y="72" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">ETH</text>
  <!-- GPIO 40-pin header -->
  <rect x="70" y="138" width="80" height="32" rx="1" fill="#1a1a1a" stroke="#333"/>
  <text x="110" y="152" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">40-pin GPIO</text>
  <text x="110" y="162" text-anchor="middle" font-size="4.5" fill="#888" font-family="Arial">3V3 5V SDA SCL PWR GND GPIO...</text>
  <!-- MicroSD -->
  <rect x="2" y="138" width="30" height="18" rx="2" fill="#888" stroke="#666"/>
  <text x="17" y="149" text-anchor="middle" font-size="5.5" fill="#444" font-family="Arial">µSD</text>
  <!-- Power jack -->
  <circle cx="14" cy="166" r="8" fill="#333" stroke="#555"/>
  <circle cx="14" cy="166" r="4" fill="#222"/>
  <text x="14" y="177" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">5V DC</text>
  <text x="110" y="178" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Arial">NVIDIA Jetson Nano</text>
</svg>''')

# Misc: PZEM-004T, BMS, MT3608, XL4015, AMS1117 modules
save('pzem-004t.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" width="160" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#bf360c"/><stop offset="100%" stop-color="#7f0000"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="106" rx="4" fill="url(#bg)" stroke="#7f0000" stroke-width="2" filter="url(#sh)"/>
  <!-- PZEM chip -->
  <rect x="24" y="14" width="70" height="54" rx="2" fill="#111" stroke="#333"/>
  <text x="59" y="40" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">PZEM-004T</text>
  <text x="59" y="52" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">AC V+A+W+kWh</text>
  <!-- Current transformer (donut shape) -->
  <circle cx="118" cy="42" r="24" fill="#555" stroke="#777" stroke-width="2"/>
  <circle cx="118" cy="42" r="14" fill="#333" stroke="#555"/>
  <circle cx="118" cy="42" r="7" fill="#222"/>
  <!-- AC screw terminals -->
  <rect x="4" y="74" width="148" height="30" rx="2" fill="#333" stroke="#555"/>
  <circle cx="16" cy="86" r="6" fill="#888" stroke="#666"/><line x1="11" y1="86" x2="21" y2="86" stroke="#555" stroke-width="1.5"/>
  <circle cx="36" cy="86" r="6" fill="#888" stroke="#666"/>
  <circle cx="56" cy="86" r="6" fill="#888" stroke="#666"/>
  <circle cx="76" cy="86" r="6" fill="#888" stroke="#666"/>
  <text x="16" y="96" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">L</text>
  <text x="36" y="96" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">N</text>
  <text x="56" y="96" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">Out-L</text>
  <text x="76" y="96" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">Out-N</text>
  <!-- UART pins: VCC GND TX RX -->
  <rect x="94" y="74" width="58" height="30" rx="2" fill="#1a1a1a"/>
  <text x="123" y="86" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VCC GND TX RX</text>
  <text x="80" y="108" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">PZEM-004T AC Meter</text>
</svg>''')

save('mt3608.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90" width="130" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="126" height="86" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- MT3608 SOT-23-6 chip (tiny) -->
  <rect x="38" y="22" width="30" height="24" rx="1" fill="#111" stroke="#333"/>
  <text x="53" y="36" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">MT3608</text>
  <!-- Schottky diode -->
  <rect x="80" y="28" width="22" height="12" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="91" y="37" text-anchor="middle" font-size="4.5" fill="#888" font-family="monospace">SS34</text>
  <!-- Inductor -->
  <rect x="10" y="28" width="22" height="12" rx="2" fill="#888" stroke="#666"/>
  <path d="M13,34 a3,3 0 0,1 6,0 a3,3 0 0,1 6,0 a3,3 0 0,1 6,0" stroke="#c8a800" stroke-width="2" fill="none"/>
  <!-- Feedback resistors -->
  <rect x="80" y="50" width="22" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <rect x="80" y="62" width="22" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <!-- Multi-turn trim pot -->
  <circle cx="110" cy="54" r="10" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <circle cx="110" cy="54" r="6" fill="#ccc"/>
  <line x1="110" y1="44" x2="110" y2="50" stroke="#555" stroke-width="2"/>
  <!-- Screw input / output terminals -->
  <rect x="4" y="58" width="28" height="24" rx="2" fill="#333" stroke="#555"/>
  <circle cx="12" cy="66" r="4.5" fill="#888" stroke="#666"/>
  <circle cx="24" cy="66" r="4.5" fill="#888" stroke="#666"/>
  <text x="12" y="76" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN+</text>
  <text x="24" y="76" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN-</text>
  <text x="65" y="85" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">MT3608 Boost 2A</text>
</svg>''')

save('xl4015.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="146" height="96" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- XL4015 SOP8 chip with exposed pad + big heatsink -->
  <rect x="46" y="18" width="56" height="42" rx="2" fill="#333" stroke="#555"/>
  <rect x="52" y="12" width="44" height="12" rx="1" fill="#999" stroke="#777"/>
  <text x="74" y="38" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">XL4015</text>
  <text x="74" y="50" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Buck 5A</text>
  <!-- Diode -->
  <rect x="8" y="26" width="30" height="16" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="23" y="37" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">SS56</text>
  <!-- Inductor (large, rated 5A) -->
  <rect x="106" y="26" width="36" height="16" rx="2" fill="#555" stroke="#333"/>
  <path d="M110,34 a5,5 0 0,1 10,0 a5,5 0 0,1 10,0 a5,5 0 0,1 10,0" stroke="#c8a800" stroke-width="2.5" fill="none"/>
  <text x="124" y="50" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">33µH 5A</text>
  <!-- Electrolytic caps -->
  <rect x="8" y="50" width="14" height="24" rx="3" fill="#111" stroke="#333"/>
  <rect x="26" y="50" width="14" height="24" rx="3" fill="#111" stroke="#333"/>
  <!-- Trim pot x2 (CV + CC) -->
  <circle cx="74" cy="74" r="9" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="74" y1="65" x2="74" y2="71" stroke="#555" stroke-width="2"/>
  <text x="74" y="86" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">CV</text>
  <circle cx="110" cy="74" r="9" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <line x1="110" y1="65" x2="110" y2="71" stroke="#555" stroke-width="2"/>
  <text x="110" y="86" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">CC</text>
  <text x="75" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">XL4015 CC/CV Buck</text>
</svg>''')

# CH340G USB-TTL converter
save('ch340g.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#880e4f"/><stop offset="100%" stop-color="#560027"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="76" rx="4" fill="url(#bg)" stroke="#560027" stroke-width="2" filter="url(#sh)"/>
  <!-- CH340G SOP-16 chip -->
  <rect x="44" y="14" width="72" height="44" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="47" cy="17" r="2" fill="#555"/>
  <text x="80" y="36" text-anchor="middle" font-size="8" fill="#888" font-family="monospace">CH340G</text>
  <text x="80" y="48" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">USB-Serial</text>
  <!-- USB-A connector on left -->
  <rect x="4" y="22" width="36" height="26" rx="3" fill="#888" stroke="#666" stroke-width="1.5"/>
  <rect x="8" y="26" width="28" height="18" rx="1" fill="#444"/>
  <text x="22" y="68" text-anchor="middle" font-size="5.5" fill="#ddd" font-family="Arial">USB-A</text>
  <!-- TX RX LEDs -->
  <circle cx="126" cy="24" r="5" fill="#4caf50"/><text x="126" y="34" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">TX</text>
  <circle cx="142" cy="24" r="5" fill="#f44336"/><text x="142" y="34" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">RX</text>
  <!-- 6-pin header: 3.3V 5V TXD RXD GND DTR -->
  <rect x="44" y="60" width="112" height="14" rx="1" fill="#1a1a1a"/>
  <text x="100" y="70" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">3V3 5V TXD RXD GND DTR</text>
</svg>''')

save('cp2102.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 75" width="150" height="75">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#37474f"/><stop offset="100%" stop-color="#263238"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="146" height="71" rx="4" fill="url(#bg)" stroke="#263238" stroke-width="2" filter="url(#sh)"/>
  <!-- CP2102 QFN chip -->
  <rect x="50" y="12" width="50" height="38" rx="1" fill="#111" stroke="#333"/>
  <circle cx="53" cy="15" r="1.5" fill="#555"/>
  <text x="75" y="30" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">CP2102</text>
  <text x="75" y="42" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">USB-UART</text>
  <!-- Micro USB -->
  <rect x="6" y="22" width="38" height="18" rx="3" fill="#888" stroke="#666"/>
  <rect x="10" y="25" width="30" height="12" rx="1" fill="#444"/>
  <!-- LEDs -->
  <circle cx="112" cy="20" r="4" fill="#4caf50"/>
  <circle cx="126" cy="20" r="4" fill="#f44336"/>
  <!-- 6-pin header -->
  <rect x="44" y="54" width="108" height="14" rx="1" fill="#1a1a1a"/>
  <text x="98" y="64" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">3V3 GND TXD RXD 5V DTR</text>
</svg>''')

save('max232.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs>
  <!-- DIP-16 body -->
  <rect x="22" y="10" width="56" height="72" rx="3" fill="#111" stroke="#333" stroke-width="2" filter="url(#sh)"/>
  <!-- Notch -->
  <ellipse cx="50" cy="10" rx="8" ry="5" fill="#222" stroke="#444"/>
  <circle cx="28" cy="17" r="2.5" fill="#555"/>
  <!-- Left DIP pins 1-8 -->
  <line x1="8" y1="18" x2="22" y2="18" stroke="#bbb" stroke-width="2"/><text x="6" y="21" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">C1+</text>
  <line x1="8" y1="28" x2="22" y2="28" stroke="#bbb" stroke-width="2"/><text x="6" y="31" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">V+</text>
  <line x1="8" y1="38" x2="22" y2="38" stroke="#bbb" stroke-width="2"/><text x="6" y="41" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">C1-</text>
  <line x1="8" y1="48" x2="22" y2="48" stroke="#bbb" stroke-width="2"/><text x="6" y="51" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">C2+</text>
  <line x1="8" y1="58" x2="22" y2="58" stroke="#bbb" stroke-width="2"/><text x="6" y="61" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">C2-</text>
  <line x1="8" y1="68" x2="22" y2="68" stroke="#bbb" stroke-width="2"/><text x="6" y="71" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">V-</text>
  <line x1="8" y1="78" x2="22" y2="78" stroke="#bbb" stroke-width="2"/><text x="6" y="81" text-anchor="end" font-size="4.5" fill="#888" font-family="Arial">T2out</text>
  <!-- Right DIP pins 9-16 -->
  <line x1="78" y1="18" x2="92" y2="18" stroke="#bbb" stroke-width="2"/><text x="94" y="21" font-size="4.5" fill="#888" font-family="Arial">VCC</text>
  <line x1="78" y1="28" x2="92" y2="28" stroke="#bbb" stroke-width="2"/><text x="94" y="31" font-size="4.5" fill="#888" font-family="Arial">GND</text>
  <line x1="78" y1="38" x2="92" y2="38" stroke="#bbb" stroke-width="2"/><text x="94" y="41" font-size="4.5" fill="#888" font-family="Arial">T1in</text>
  <line x1="78" y1="48" x2="92" y2="48" stroke="#bbb" stroke-width="2"/><text x="94" y="51" font-size="4.5" fill="#888" font-family="Arial">R1out</text>
  <line x1="78" y1="58" x2="92" y2="58" stroke="#bbb" stroke-width="2"/><text x="94" y="61" font-size="4.5" fill="#888" font-family="Arial">R2in</text>
  <line x1="78" y1="68" x2="92" y2="68" stroke="#bbb" stroke-width="2"/><text x="94" y="71" font-size="4.5" fill="#888" font-family="Arial">T2in</text>
  <line x1="78" y1="78" x2="92" y2="78" stroke="#bbb" stroke-width="2"/><text x="94" y="81" font-size="4.5" fill="#888" font-family="Arial">R1in</text>
  <text x="50" y="55" text-anchor="middle" font-size="7" fill="#888" font-family="monospace">MAX232</text>
</svg>''')

# Logic analyzer 8ch
save('logic-analyzer-8ch.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" width="160" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a237e"/><stop offset="100%" stop-color="#0d1452"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="86" rx="6" fill="url(#bg)" stroke="#0d1452" stroke-width="2" filter="url(#sh)"/>
  <!-- USB connector -->
  <rect x="6" y="30" width="28" height="20" rx="3" fill="#888" stroke="#666" stroke-width="1.5"/>
  <rect x="9" y="33" width="22" height="14" rx="1" fill="#444"/>
  <text x="20" y="60" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">USB</text>
  <!-- Cypress FX2 chip -->
  <rect x="44" y="14" width="66" height="52" rx="2" fill="#111" stroke="#333"/>
  <text x="77" y="38" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">CY7C68013</text>
  <text x="77" y="50" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Cypress FX2</text>
  <!-- 10-pin test hook header: CH0-CH7 GND GND -->
  <rect x="118" y="10" width="36" height="68" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="136" y="17" text-anchor="middle" font-size="4.5" fill="#f44336" font-family="Arial">CH0</text>
  <text x="136" y="25" text-anchor="middle" font-size="4.5" fill="#ff9800" font-family="Arial">CH1</text>
  <text x="136" y="33" text-anchor="middle" font-size="4.5" fill="#ffeb3b" font-family="Arial">CH2</text>
  <text x="136" y="41" text-anchor="middle" font-size="4.5" fill="#4caf50" font-family="Arial">CH3</text>
  <text x="136" y="49" text-anchor="middle" font-size="4.5" fill="#00bcd4" font-family="Arial">CH4</text>
  <text x="136" y="57" text-anchor="middle" font-size="4.5" fill="#2196f3" font-family="Arial">CH5</text>
  <text x="136" y="65" text-anchor="middle" font-size="4.5" fill="#9c27b0" font-family="Arial">CH6</text>
  <text x="136" y="73" text-anchor="middle" font-size="4.5" fill="#e91e63" font-family="Arial">CH7</text>
  <text x="80" y="80" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">8CH Logic Analyzer</text>
</svg>''')

# TCA9548A I2C Multiplexer
save('tca9548a.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#4a148c"/><stop offset="100%" stop-color="#2e0060"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="146" height="96" rx="4" fill="url(#bg)" stroke="#2e0060" stroke-width="2" filter="url(#sh)"/>
  <!-- TCA9548A TSSOP-24 chip -->
  <rect x="36" y="18" width="78" height="58" rx="2" fill="#111" stroke="#333" stroke-width="1.5"/>
  <circle cx="39" cy="21" r="2" fill="#555"/>
  <text x="75" y="44" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">TCA9548A</text>
  <text x="75" y="55" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">I2C Mux 1-to-8</text>
  <text x="75" y="65" text-anchor="middle" font-size="5" fill="#555" font-family="monospace">0x70..0x77</text>
  <!-- 10-pin header: VIN GND SDA SCL A0 A1 A2 RST SD0-7 SC0-7 -->
  <rect x="4" y="80" width="142" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="75" y="90" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VIN GND SDA SCL A0 A1 A2 RST | SD0..7 SC0..7</text>
  <text x="75" y="98" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">TCA9548A I2C Mux</text>
</svg>''')

# INA219 (already done above)

# TCS3200 Color sensor
save('tcs3200.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110" width="120" height="110">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="3" y="3" width="114" height="104" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- TCS3200 chip (SOIC-8 with photosensor array) -->
  <rect x="14" y="18" width="92" height="68" rx="3" fill="#333" stroke="#555"/>
  <!-- 4 white LEDs (illumination) at corners -->
  <circle cx="26" cy="30" r="7" fill="#fffde7" stroke="#f5f5dc" stroke-width="1.5"/>
  <circle cx="94" cy="30" r="7" fill="#fffde7" stroke="#f5f5dc" stroke-width="1.5"/>
  <circle cx="26" cy="76" r="7" fill="#fffde7" stroke="#f5f5dc" stroke-width="1.5"/>
  <circle cx="94" cy="76" r="7" fill="#fffde7" stroke="#f5f5dc" stroke-width="1.5"/>
  <!-- Sensor window (center) with RGB filter pattern -->
  <rect x="38" y="38" width="44" height="32" rx="2" fill="#1a1a1a" stroke="#555"/>
  <rect x="40" y="40" width="10" height="14" rx="1" fill="#f44336" opacity="0.7"/>
  <rect x="52" y="40" width="10" height="14" rx="1" fill="#4caf50" opacity="0.7"/>
  <rect x="64" y="40" width="10" height="14" rx="1" fill="#2196f3" opacity="0.7"/>
  <rect x="40" y="56" width="10" height="12" rx="1" fill="#fff" opacity="0.7"/>
  <rect x="52" y="56" width="10" height="12" rx="1" fill="#f44336" opacity="0.7"/>
  <rect x="64" y="56" width="10" height="12" rx="1" fill="#4caf50" opacity="0.7"/>
  <!-- 8-pin header: OE S3 S2 S1 S0 OUT VCC GND -->
  <rect x="8" y="8" width="104" height="12" rx="1" fill="#1a1a1a"/>
  <text x="60" y="16" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">OE S3 S2 S1 S0 OUT VCC GND</text>
  <text x="60" y="100" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">TCS3200 Color</text>
</svg>''')

# 4WD chassis
save('4wd-car-chassis.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="180" height="140">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Chassis plate -->
  <rect x="20" y="24" width="140" height="90" rx="8" fill="#444" stroke="#222" stroke-width="3" filter="url(#sh)"/>
  <!-- 4 wheels (DC motors with rubber tires) -->
  <!-- Front Left -->
  <rect x="2" y="22" width="28" height="44" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="7" y="30" width="18" height="28" rx="5" fill="#555" stroke="#333"/>
  <text x="16" y="47" text-anchor="middle" font-size="6.5" fill="#888" font-family="Arial">FL</text>
  <!-- Front Right -->
  <rect x="150" y="22" width="28" height="44" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="155" y="30" width="18" height="28" rx="5" fill="#555" stroke="#333"/>
  <text x="164" y="47" text-anchor="middle" font-size="6.5" fill="#888" font-family="Arial">FR</text>
  <!-- Rear Left -->
  <rect x="2" y="74" width="28" height="44" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="7" y="82" width="18" height="28" rx="5" fill="#555" stroke="#333"/>
  <text x="16" y="99" text-anchor="middle" font-size="6.5" fill="#888" font-family="Arial">RL</text>
  <!-- Rear Right -->
  <rect x="150" y="74" width="28" height="44" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="155" y="82" width="18" height="28" rx="5" fill="#555" stroke="#333"/>
  <text x="164" y="99" text-anchor="middle" font-size="6.5" fill="#888" font-family="Arial">RR</text>
  <!-- Mounting hole pattern -->
  <circle cx="46" cy="46" r="4" fill="none" stroke="#666" stroke-width="1.5"/>
  <circle cx="134" cy="46" r="4" fill="none" stroke="#666" stroke-width="1.5"/>
  <circle cx="46" cy="94" r="4" fill="none" stroke="#666" stroke-width="1.5"/>
  <circle cx="134" cy="94" r="4" fill="none" stroke="#666" stroke-width="1.5"/>
  <text x="90" y="73" text-anchor="middle" font-size="10" font-weight="bold" fill="#888" font-family="Arial">4WD CHASSIS</text>
  <text x="90" y="87" text-anchor="middle" font-size="7" fill="#666" font-family="Arial">Smart Car Robot</text>
</svg>''')

# Robot car chassis (simpler 2WD version)
save('robot-car-chassis.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 130" width="180" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
  <!-- Chassis plate (acrylic/PCB style) -->
  <rect x="20" y="14" width="140" height="100" rx="8" fill="#1a237e" stroke="#0d1452" stroke-width="3" filter="url(#sh)"/>
  <!-- 2 drive wheels + caster -->
  <rect x="2" y="26" width="24" height="52" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="6" y="34" width="16" height="36" rx="5" fill="#555" stroke="#333"/>
  <rect x="154" y="26" width="24" height="52" rx="8" fill="#333" stroke="#111" stroke-width="2"/>
  <rect x="156" y="34" width="16" height="36" rx="5" fill="#555" stroke="#333"/>
  <!-- Caster (front ball) -->
  <circle cx="90" cy="106" r="10" fill="#888" stroke="#666" stroke-width="2"/>
  <circle cx="90" cy="106" r="6" fill="#999"/>
  <!-- Sensors / component placeholders -->
  <rect x="50" y="24" width="80" height="32" rx="4" fill="#111" stroke="#333"/>
  <text x="90" y="40" text-anchor="middle" font-size="7" fill="#888" font-family="Arial">Sensor Bay</text>
  <!-- Motor labels -->
  <text x="14" y="55" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial" transform="rotate(-90 14 55)">Motor L</text>
  <text x="166" y="55" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial" transform="rotate(90 166 55)">Motor R</text>
  <text x="90" y="88" text-anchor="middle" font-size="9" font-weight="bold" fill="#aaa" font-family="Arial">2WD Robot Car</text>
</svg>''')

# Google Coral
save('google-coral.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" width="200" height="130">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="196" height="126" rx="5" fill="url(#bg)" stroke="#111" stroke-width="3" filter="url(#sh)"/>
  <!-- Edge TPU chip (Google branding) -->
  <rect x="60" y="20" width="80" height="60" rx="3" fill="#333" stroke="#555" stroke-width="2"/>
  <!-- Google color dots -->
  <circle cx="84" cy="44" r="8" fill="#4285f4"/>
  <circle cx="100" cy="44" r="8" fill="#ea4335"/>
  <circle cx="116" cy="44" r="8" fill="#fbbc05"/>
  <circle cx="92" cy="58" r="8" fill="#34a853"/>
  <circle cx="108" cy="58" r="8" fill="#4285f4"/>
  <text x="100" y="76" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">Edge TPU</text>
  <!-- USB-C port -->
  <rect x="84" y="88" width="32" height="12" rx="3" fill="#888" stroke="#666"/>
  <rect x="88" y="91" width="24" height="6" rx="1" fill="#444"/>
  <text x="100" y="106" text-anchor="middle" font-size="6" fill="#aaa" font-family="Arial">USB-C</text>
  <!-- GPIO -->
  <rect x="2" y="50" width="54" height="24" rx="1" fill="#1a1a1a" stroke="#333"/>
  <text x="29" y="64" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">GPIO (40-pin)</text>
  <!-- Label -->
  <text x="100" y="120" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="Arial">Google Coral Dev</text>
</svg>''')

# Sipeed Maix
save('sipeed-maix-duino.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 80" width="190" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2d3748"/><stop offset="100%" stop-color="#1a2233"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="186" height="76" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- K210 AI chip module with metal shield -->
  <rect x="50" y="8" width="90" height="52" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="54" y="12" width="82" height="44" rx="2" fill="#666" stroke="#888"/>
  <text x="95" y="30" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">Sipeed Maix</text>
  <text x="95" y="42" text-anchor="middle" font-size="6" fill="#888" font-family="monospace">K210 RISC-V AI</text>
  <!-- Camera connector + speaker -->
  <rect x="148" y="14" width="24" height="14" rx="2" fill="#888" stroke="#666"/>
  <text x="160" y="23" text-anchor="middle" font-size="5" fill="#444" font-family="Arial">CAM</text>
  <!-- USB -->
  <rect x="84" y="64" width="24" height="10" rx="3" fill="#888" stroke="#666"/>
  <rect x="87" y="66" width="18" height="6" rx="1" fill="#444"/>
  <!-- Left pins -->
  <rect x="0" y="6" width="14" height="68" rx="1" fill="#1a1a1a"/>
  <text x="7" y="14" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO32</text>
  <text x="7" y="22" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO31</text>
  <text x="7" y="30" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO30</text>
  <text x="7" y="38" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="7" y="46" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <!-- Right pins -->
  <rect x="176" y="6" width="14" height="68" rx="1" fill="#1a1a1a"/>
  <text x="183" y="14" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO0</text>
  <text x="183" y="22" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO1</text>
  <text x="183" y="30" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">IO2</text>
  <text x="183" y="38" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">GND</text>
  <text x="183" y="46" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="Arial">3V3</text>
  <text x="95" y="75" text-anchor="middle" font-size="8" font-weight="bold" fill="white" font-family="Arial">Sipeed Maix Duino</text>
</svg>''')

# Remaining few: CC2530, RX470/TX118SA (RF chips)
save('cc2530.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="120" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#263238"/><stop offset="100%" stop-color="#102027"/>
  </linearGradient></defs>
  <rect x="3" y="18" width="114" height="68" rx="4" fill="url(#bg)" stroke="#102027" stroke-width="1.5" filter="url(#sh)"/>
  <!-- CC2530 ZigBee module with chip antenna -->
  <rect x="18" y="28" width="84" height="48" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="22" y="32" width="76" height="40" rx="2" fill="#666" stroke="#888"/>
  <!-- Chip trace antenna pattern -->
  <path d="M80,36 L96,36 L96,44 L90,44 L90,52 L96,52 L96,60 L80,60" stroke="#aaa" stroke-width="2" fill="none"/>
  <!-- CC2530 chip -->
  <rect x="28" y="38" width="44" height="28" rx="1" fill="#111" stroke="#333"/>
  <text x="50" y="52" text-anchor="middle" font-size="6.5" fill="#888" font-family="monospace">CC2530</text>
  <text x="50" y="61" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">ZigBee</text>
  <!-- Antenna + LED -->
  <circle cx="100" cy="28" r="5" fill="#4caf50"/>
  <!-- Pin headers: VCC GND P0.0-P0.7 etc -->
  <rect x="18" y="6" width="84" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="60" y="14" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">VCC GND RST P0.0 P0.1 P1.0 P1.1</text>
  <text x="60" y="80" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">CC2530 ZigBee</text>
</svg>''')

save('rx470.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 80" width="110" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#263238"/><stop offset="100%" stop-color="#102027"/>
  </linearGradient></defs>
  <rect x="3" y="14" width="104" height="62" rx="4" fill="url(#bg)" stroke="#102027" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Receiver module body -->
  <rect x="10" y="20" width="68" height="48" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="14" y="24" width="60" height="40" rx="2" fill="#666" stroke="#888"/>
  <text x="44" y="46" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">RX470</text>
  <text x="44" y="56" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">433MHz Rx</text>
  <!-- Antenna (helical spring) -->
  <path d="M86,20 L86,72" stroke="#aaa" stroke-width="2" stroke-dasharray="3,2"/>
  <line x1="83" y1="20" x2="89" y2="20" stroke="#aaa" stroke-width="2"/>
  <!-- LED indicator -->
  <circle cx="100" cy="26" r="5" fill="#4caf50"/>
  <!-- 3-pin header: VCC GND DATA -->
  <rect x="14" y="6" width="60" height="10" rx="1" fill="#1a1a1a"/>
  <text x="44" y="13" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">VCC GND DATA</text>
</svg>''')

save('tx118sa.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#263238"/><stop offset="100%" stop-color="#102027"/>
  </linearGradient></defs>
  <rect x="3" y="10" width="94" height="66" rx="4" fill="url(#bg)" stroke="#102027" stroke-width="1.5" filter="url(#sh)"/>
  <!-- Transmitter module -->
  <rect x="8" y="16" width="62" height="52" rx="3" fill="#555" stroke="#777" stroke-width="1.5"/>
  <rect x="12" y="20" width="54" height="44" rx="2" fill="#666" stroke="#888"/>
  <text x="39" y="43" text-anchor="middle" font-size="8" fill="#aaa" font-family="monospace">TX118SA</text>
  <text x="39" y="53" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">433MHz Tx</text>
  <!-- Coil antenna (circular) -->
  <circle cx="82" cy="42" r="12" fill="none" stroke="#aaa" stroke-width="2"/>
  <circle cx="82" cy="42" r="8" fill="none" stroke="#888" stroke-width="1.5"/>
  <!-- 3-pin header: VCC GND DATA -->
  <rect x="12" y="2" width="54" height="10" rx="1" fill="#1a1a1a"/>
  <text x="39" y="9" text-anchor="middle" font-size="5.5" fill="#aaa" font-family="Arial">VCC GND DATA</text>
</svg>''')

save('xt60-connector.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter></defs>
  <!-- XT60 male connector body (yellow-orange) -->
  <rect x="12" y="18" width="66" height="58" rx="6" fill="#f57f17" stroke="#e65100" stroke-width="2.5" filter="url(#sh)"/>
  <!-- Two circular ports -->
  <circle cx="34" cy="48" r="16" fill="#222" stroke="#111" stroke-width="2"/>
  <circle cx="34" cy="48" r="10" fill="#333" stroke="#444"/>
  <circle cx="56" cy="48" r="16" fill="#222" stroke="#111" stroke-width="2"/>
  <circle cx="56" cy="48" r="10" fill="#333" stroke="#444"/>
  <!-- + / - labels on ports -->
  <text x="34" y="52" text-anchor="middle" font-size="12" fill="#f44336" font-family="Arial" font-weight="bold">+</text>
  <text x="56" y="52" text-anchor="middle" font-size="12" fill="#bbb" font-family="Arial" font-weight="bold">-</text>
  <!-- Strain relief wings -->
  <rect x="2" y="32" width="12" height="26" rx="2" fill="#e65100" stroke="#bf360c"/>
  <rect x="76" y="32" width="12" height="26" rx="2" fill="#e65100" stroke="#bf360c"/>
  <text x="45" y="15" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#333" font-family="Arial">XT60 Connector</text>
  <text x="45" y="85" text-anchor="middle" font-size="7.5" fill="#555" font-family="Arial">60A Lipo Battery</text>
</svg>''')

# Neopixel ring already done in gen_accurate_svgs.py. Let's do:
save('bms-3s.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="160" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a237e"/><stop offset="100%" stop-color="#0d1452"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="156" height="96" rx="4" fill="url(#bg)" stroke="#0d1452" stroke-width="2" filter="url(#sh)"/>
  <!-- DW01 ICs (protection) -->
  <rect x="10" y="14" width="30" height="20" rx="1" fill="#111" stroke="#333"/>
  <text x="25" y="27" text-anchor="middle" font-size="5.5" fill="#888" font-family="monospace">DW01x3</text>
  <!-- MOSFETs (large TO-252) -->
  <rect x="50" y="10" width="24" height="54" rx="1" fill="#333" stroke="#555"/>
  <text x="62" y="40" text-anchor="middle" font-size="5" fill="#888" font-family="monospace" transform="rotate(-90 62 40)">N-MOS</text>
  <rect x="78" y="10" width="24" height="54" rx="1" fill="#333" stroke="#555"/>
  <!-- Thermal pad / heatsink area -->
  <rect x="52" y="12" width="48" height="8" rx="1" fill="#888" stroke="#666"/>
  <!-- Balancing resistors -->
  <rect x="110" y="18" width="36" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <rect x="110" y="32" width="36" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <rect x="110" y="46" width="36" height="8" rx="3" fill="#c8a800" stroke="#a07800"/>
  <!-- Terminal blocks (7 pins: B- B1 B2 B+ P- P+) -->
  <rect x="10" y="68" width="136" height="24" rx="2" fill="#333" stroke="#555"/>
  <circle cx="22" cy="78" r="5.5" fill="#888" stroke="#666"/>
  <circle cx="40" cy="78" r="5.5" fill="#888" stroke="#666"/>
  <circle cx="58" cy="78" r="5.5" fill="#888" stroke="#666"/>
  <circle cx="76" cy="78" r="5.5" fill="#888" stroke="#666"/>
  <circle cx="94" cy="78" r="5.5" fill="#f44336" stroke="#c62828"/>
  <circle cx="112" cy="78" r="5.5" fill="#111" stroke="#333"/>
  <circle cx="130" cy="78" r="5.5" fill="#111" stroke="#333"/>
  <text x="22" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">B-</text>
  <text x="40" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">B1</text>
  <text x="58" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">B2</text>
  <text x="76" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">B+</text>
  <text x="94" y="88" text-anchor="middle" font-size="4.5" fill="#f44336" font-family="Arial">P+</text>
  <text x="112" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">C+</text>
  <text x="130" y="88" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">P-</text>
  <text x="80" y="98" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">BMS 3S 10A Li-Ion</text>
</svg>''')

save('lm2596.svg', '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs><filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#111111"/>
  </linearGradient></defs>
  <rect x="2" y="2" width="146" height="96" rx="4" fill="url(#bg)" stroke="#111" stroke-width="2" filter="url(#sh)"/>
  <!-- LM2596 SOT-263-5 chip with heatsink fins -->
  <rect x="46" y="18" width="58" height="42" rx="2" fill="#333" stroke="#555"/>
  <rect x="52" y="10" width="46" height="14" rx="1" fill="#888" stroke="#666"/>
  <line x1="60" y1="10" x2="60" y2="24" stroke="#666" stroke-width="2.5"/>
  <line x1="70" y1="10" x2="70" y2="24" stroke="#666" stroke-width="2.5"/>
  <line x1="80" y1="10" x2="80" y2="24" stroke="#666" stroke-width="2.5"/>
  <line x1="90" y1="10" x2="90" y2="24" stroke="#666" stroke-width="2.5"/>
  <text x="75" y="38" text-anchor="middle" font-size="7.5" fill="#888" font-family="monospace">LM2596</text>
  <text x="75" y="50" text-anchor="middle" font-size="5.5" fill="#666" font-family="monospace">Buck 3A</text>
  <!-- SS34 Schottky diode -->
  <rect x="10" y="30" width="28" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  <text x="24" y="40" text-anchor="middle" font-size="5" fill="#888" font-family="monospace">SS34</text>
  <!-- 100µH inductor -->
  <rect x="108" y="28" width="32" height="18" rx="2" fill="#444" stroke="#333"/>
  <path d="M112,37 a5,4 0 0,1 10,0 a5,4 0 0,1 10,0 a5,4 0 0,1 8,0" stroke="#c8a800" stroke-width="2" fill="none"/>
  <!-- Electrolytics -->
  <rect x="10" y="52" width="14" height="22" rx="3" fill="#111" stroke="#333"/>
  <rect x="28" y="52" width="14" height="22" rx="3" fill="#111" stroke="#333"/>
  <text x="21" y="50" text-anchor="middle" font-size="4.5" fill="#aaa" font-family="Arial">100µF</text>
  <!-- Multi-turn trim pot -->
  <circle cx="120" cy="72" r="11" fill="#e0e0e0" stroke="#aaa" stroke-width="1.5"/>
  <circle cx="120" cy="72" r="7" fill="#ccc"/>
  <line x1="120" y1="61" x2="120" y2="68" stroke="#555" stroke-width="2.5"/>
  <text x="120" y="88" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">ADJ VOLT</text>
  <!-- Input screw terminal -->
  <rect x="2" y="62" width="40" height="30" rx="2" fill="#333" stroke="#555"/>
  <circle cx="12" cy="72" r="6" fill="#f44336" stroke="#c62828"/>
  <circle cx="30" cy="72" r="6" fill="#111" stroke="#333"/>
  <text x="12" y="84" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN+</text>
  <text x="30" y="84" text-anchor="middle" font-size="5" fill="#aaa" font-family="Arial">IN-</text>
  <text x="75" y="96" text-anchor="middle" font-size="8.5" font-weight="bold" fill="white" font-family="Arial">LM2596 Buck Converter</text>
</svg>''')

print("\nAll SVGs written to:", OUT)
