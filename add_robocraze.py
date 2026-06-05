import os
import re

components_data = [
    # Cameras & Vision
    {'id': 'esp32-cam', 'name': 'ESP32-CAM Module', 'cat': 'Microcontroller', 'sub': 'IoT', 'pins': ['5V', 'GND', 'U0R', 'U0T', 'IO0', 'IO16']},
    {'id': 'ov7670', 'name': 'OV7670 Camera Module', 'cat': 'Sensor', 'sub': 'Vision', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'VSYNC', 'HREF', 'PCLK', 'D0-D7']},
    {'id': 'pi-camera-v2', 'name': 'Raspberry Pi Camera V2', 'cat': 'Sensor', 'sub': 'Vision', 'pins': ['CSI']},

    # Advanced/Specialized Sensors
    {'id': 'mpu9250', 'name': 'MPU9250 9-DOF IMU', 'cat': 'Sensor', 'sub': 'Motion', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'EDA', 'ECL', 'AD0', 'INT']},
    {'id': 'vl53l0x', 'name': 'VL53L0X ToF Laser Ranging Sensor', 'cat': 'Sensor', 'sub': 'Distance', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'XSHUT', 'GPIO1']},
    {'id': 'mlx90614', 'name': 'MLX90614 IR Temperature Sensor', 'cat': 'Sensor', 'sub': 'Temperature', 'pins': ['VIN', 'GND', 'SCL', 'SDA']},
    {'id': 'mq3-gas', 'name': 'MQ-3 Alcohol Sensor', 'cat': 'Sensor', 'sub': 'Gas', 'pins': ['VCC', 'GND', 'AO', 'DO']},
    {'id': 'mq7-gas', 'name': 'MQ-7 CO Sensor', 'cat': 'Sensor', 'sub': 'Gas', 'pins': ['VCC', 'GND', 'AO', 'DO']},
    {'id': 'mq8-gas', 'name': 'MQ-8 Hydrogen Sensor', 'cat': 'Sensor', 'sub': 'Gas', 'pins': ['VCC', 'GND', 'AO', 'DO']},
    {'id': 'max6675', 'name': 'MAX6675 Thermocouple Amp', 'cat': 'Sensor', 'sub': 'Temperature', 'pins': ['VCC', 'GND', 'SCK', 'CS', 'SO']},
    {'id': 'hmc5883l', 'name': 'HMC5883L Magnetometer', 'cat': 'Sensor', 'sub': 'Motion', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'DRDY']},
    {'id': 'ina219', 'name': 'INA219 Current/Power Sensor', 'cat': 'Sensor', 'sub': 'Power', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'VIN+', 'VIN-']},
    {'id': 'bh1750', 'name': 'BH1750 Light Sensor', 'cat': 'Sensor', 'sub': 'Light', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'ADDR']},
    {'id': 'tsl2561', 'name': 'TSL2561 Luminosity Sensor', 'cat': 'Sensor', 'sub': 'Light', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'INT']},
    {'id': 'pzem-004t', 'name': 'PZEM-004T AC Power Sensor', 'cat': 'Sensor', 'sub': 'Power', 'pins': ['5V', 'RX', 'TX', 'GND']},
    {'id': 'cny70', 'name': 'CNY70 Reflective Optical Sensor', 'cat': 'Sensor', 'sub': 'Optical', 'pins': ['A', 'K', 'E', 'C']},
    {'id': 'ky-038', 'name': 'KY-038 Sound Sensor', 'cat': 'Sensor', 'sub': 'Audio', 'pins': ['AO', 'GND', 'VCC', 'DO']},
    {'id': 'ph-sensor', 'name': 'pH Sensor Module', 'cat': 'Sensor', 'sub': 'Liquid', 'pins': ['V+', 'G', 'G', 'Po', 'Do', 'To']},
    {'id': 'turbidity-sensor', 'name': 'Turbidity Sensor', 'cat': 'Sensor', 'sub': 'Liquid', 'pins': ['VCC', 'GND', 'AOUT', 'DOUT']},

    # IoT, Comm & Wireless
    {'id': 'sim900a', 'name': 'SIM900A GSM/GPRS Module', 'cat': 'Communication', 'sub': 'GSM', 'pins': ['5V', 'GND', 'TXD', 'RXD']},
    {'id': 'hc-12', 'name': 'HC-12 433MHz Transceiver', 'cat': 'Communication', 'sub': 'RF', 'pins': ['VCC', 'GND', 'RXD', 'TXD', 'SET']},
    {'id': 'nrf24l01-pa-lna', 'name': 'NRF24L01+PA+LNA', 'cat': 'Communication', 'sub': 'RF', 'pins': ['GND', 'VCC', 'CE', 'CSN', 'SCK', 'MOSI', 'MISO', 'IRQ']},
    {'id': 'cc2530', 'name': 'CC2530 Zigbee Module', 'cat': 'Communication', 'sub': 'Zigbee', 'pins': ['VCC', 'GND', 'TX', 'RX']},
    {'id': 'rx470', 'name': '433MHz RF Receiver', 'cat': 'Communication', 'sub': 'RF', 'pins': ['VCC', 'DATA', 'DATA', 'GND']},
    {'id': 'tx118sa', 'name': '433MHz RF Transmitter', 'cat': 'Communication', 'sub': 'RF', 'pins': ['ATAD', 'VCC', 'GND']},

    # Advanced Displays
    {'id': 'nextion-24', 'name': 'Nextion 2.4" HMI Display', 'cat': 'Display', 'sub': 'Touch', 'pins': ['5V', 'TX', 'RX', 'GND']},
    {'id': 'lcd-12864', 'name': '12864 Graphic LCD', 'cat': 'Display', 'sub': 'LCD', 'pins': ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D0-D7', 'A', 'K']},
    {'id': 'max7219-matrix', 'name': 'MAX7219 8x8 LED Matrix', 'cat': 'Display', 'sub': 'LED', 'pins': ['VCC', 'GND', 'DIN', 'CS', 'CLK']},
    {'id': 'tm1637', 'name': 'TM1637 4-Digit Display', 'cat': 'Display', 'sub': 'LED', 'pins': ['CLK', 'DIO', 'VCC', 'GND']},

    # Actuators & Motor Drivers
    {'id': 'bts7960', 'name': 'BTS7960 43A Motor Driver', 'cat': 'Motor Driver', 'sub': 'High Power', 'pins': ['VCC', 'GND', 'R_EN', 'L_EN', 'RPWM', 'LPWM']},
    {'id': 'pca9685', 'name': 'PCA9685 16-Ch PWM Driver', 'cat': 'Motor Driver', 'sub': 'PWM', 'pins': ['VCC', 'GND', 'SDA', 'SCL', 'OE']},
    {'id': 'l298n-mini', 'name': 'Mini L298N Motor Driver', 'cat': 'Motor Driver', 'sub': 'DC Motor', 'pins': ['VCC', 'GND', 'IN1', 'IN2', 'IN3', 'IN4', 'MOTA', 'MOTB']},
    {'id': 'mg90s', 'name': 'MG90S Metal Gear Servo', 'cat': 'Actuator', 'sub': 'Servo', 'pins': ['GND', 'VCC', 'SIG']},
    {'id': 'sg90s-360', 'name': 'SG90s 360° Continuous Servo', 'cat': 'Actuator', 'sub': 'Servo', 'pins': ['GND', 'VCC', 'SIG']},
    {'id': 'ws2812-matrix', 'name': 'WS2812 8x8 LED Matrix', 'cat': 'Display', 'sub': 'LED', 'pins': ['DIN', '5V', 'GND']},

    # IC & Breakout Boards
    {'id': 'ds18b20-waterproof', 'name': 'DS18B20 Waterproof Probe', 'cat': 'Sensor', 'sub': 'Temperature', 'pins': ['VCC', 'DATA', 'GND']},
    {'id': 'tca9548a', 'name': 'TCA9548A I2C Multiplexer', 'cat': 'IC', 'sub': 'Multiplexer', 'pins': ['VIN', 'GND', 'SDA', 'SCL', 'A0', 'A1', 'A2']},
    {'id': 'max232', 'name': 'MAX232 RS232 to TTL', 'cat': 'IC', 'sub': 'Interface', 'pins': ['VCC', 'GND', 'TXD', 'RXD', 'T1OUT', 'R1IN']},
    {'id': 'ch340g', 'name': 'CH340G USB to TTL', 'cat': 'IC', 'sub': 'Interface', 'pins': ['5V', '3.3V', 'TXD', 'RXD', 'GND']},
    {'id': 'cp2102', 'name': 'CP2102 USB to UART', 'cat': 'IC', 'sub': 'Interface', 'pins': ['3V3', 'TXD', 'RXD', 'GND', '5V']},
    {'id': 'logic-analyzer-8ch', 'name': '24MHz 8Ch Logic Analyzer', 'cat': 'Tool', 'sub': 'Logic Analyzer', 'pins': ['CH0-CH7', 'GND']},

    # Power & Connectors
    {'id': 'mt3608', 'name': 'MT3608 Boost Converter', 'cat': 'Power', 'sub': 'Boost', 'pins': ['VIN+', 'VIN-', 'VOUT+', 'VOUT-']},
    {'id': 'xl4015', 'name': 'XL4015 Step-Down Buck', 'cat': 'Power', 'sub': 'Buck', 'pins': ['IN+', 'IN-', 'OUT+', 'OUT-']},
    {'id': 'lm2596', 'name': 'LM2596 Buck Converter', 'cat': 'Power', 'sub': 'Buck', 'pins': ['IN+', 'IN-', 'OUT+', 'OUT-']},
    {'id': 'bms-3s', 'name': '3S 12V BMS Protection Board', 'cat': 'Power', 'sub': 'Battery', 'pins': ['0V', '4.2V', '8.4V', '12.6V', 'P+', 'P-']},
    {'id': 'xt60-connector', 'name': 'XT60 Connector Pair', 'cat': 'Connector', 'sub': 'Power', 'pins': ['+', '-']},
    {'id': 'barrel-jack', 'name': '5.5mm DC Barrel Jack', 'cat': 'Connector', 'sub': 'Power', 'pins': ['+', '-']},

    # AI / Edge Compute
    {'id': 'jetson-nano', 'name': 'NVIDIA Jetson Nano', 'cat': 'Microcontroller', 'sub': 'SBC', 'pins': ['5V', '3.3V', 'GND', 'GPIOx40']},
    {'id': 'google-coral', 'name': 'Google Coral USB', 'cat': 'IC', 'sub': 'AI', 'pins': ['USB']},
    {'id': 'sipeed-maix-duino', 'name': 'Sipeed Maixduino', 'cat': 'Microcontroller', 'sub': 'AI', 'pins': ['3.3V', '5V', 'GND', 'A0-A5', 'D0-D13']}
]


def create_svgs():
    base_dir = r'src/assets/components'
    os.makedirs(base_dir, exist_ok=True)
    
    for comp in components_data:
        cid = comp['id']
        file_path = os.path.join(base_dir, cid + '.svg')
        
        pins_svg = ''
        pin_spacing = 14
        total_width = len(comp['pins']) * pin_spacing
        pin_x_start = 65 - (total_width / 2)
        for i, pin in enumerate(comp['pins']):
            x = pin_x_start + (i * pin_spacing)
            pins_svg += f"""
            <rect x="{x}" y="7" width="8" height="10" fill="#bdbdbd" rx="1"/>
            <text x="{x+4}" y="5" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" font-family="Arial,sans-serif">{pin}</text>
            """

        color = '#006064' # default dark teal
        fill = '#0097a7'
        if comp['cat'] == 'Sensor':
            color = '#1b5e20'
            fill = '#4caf50'
        elif comp['cat'] == 'Power':
            color = '#b71c1c'
            fill = '#f44336'
        elif comp['cat'] == 'Microcontroller':
            color = '#311b92'
            fill = '#512da8'
        elif comp['cat'] == 'Display':
            color = '#e65100'
            fill = '#ff9800'

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 95" width="130" height="95">
      <defs>
        <filter id="sh-{cid}" x="-8%" y="-8%" width="116%" height="116%"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.28"/></filter>
      </defs>
      <rect x="5" y="15" width="120" height="75" rx="4" fill="{fill}" stroke="{color}" stroke-width="1.5" filter="url(#sh-{cid})"/>
      
      <!-- PIN HEADER BLACK BASE -->
      <rect x="{pin_x_start-4}" y="6" width="{total_width + 4}" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
      {pins_svg}
      
      <!-- COMPONENT NAME -->
      <text x="65" y="55" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold" font-family="Arial,sans-serif">{comp['name']}</text>
    </svg>"""
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
            
    print(f"Created {len(components_data)} SVGs in {base_dir}")


def update_registry():
    path = r'src/ai/componentRegistry.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    registrations = []
    for comp in components_data:
        pins_obj = []
        for p in comp['pins']:
            pins_obj.append(f"'{p}': {{ type: 'generic' }}")
        pins_str = ", ".join(pins_obj)
        reg = f"        this.register({{ id: '{comp['id']}', name: '{comp['name']}', category: '{comp['cat']}', subcategory: '{comp['sub']}', price: 5, pins: {{ {pins_str} }} }});"
        registrations.append(reg)
        
    regs_str = "\n".join(registrations)
    
    # We want to insert regs_str right before the end of _initializeComponents()
    # It ends with: 
    #              specs: { channels: 4, lowVoltage: '1.8-3.3V', highVoltage: '3.3-5V' } });
    #     }
    
    pattern = r"(specs: \{ channels: 4, lowVoltage: '1\.8-3\.3V', highVoltage: '3\.3-5V' \} \}\);\s*\n)(\s*\})"
    replacement = r"\1\n        // === ROBOCRAZE EXPANSION ===\n" + regs_str + r"\n\2"
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content == content:
        print("Failed to update componentRegistry.js (pattern not found)")
    else:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated componentRegistry.js")


def update_archetypes():
    path = r'src/ui/componentArchetypes.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    svg_mappings = []
    for comp in components_data:
        svg_mappings.append(f"  '{comp['id']}': '{comp['id']}',")
        
    maps_str = "\n".join(svg_mappings)
    
    pattern = r"(export const COMPONENT_SVG = \{)"
    replacement = r"\1\n" + maps_str
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content == content:
        print("Failed to update componentArchetypes.js (pattern not found)")
    else:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated componentArchetypes.js")

if __name__ == '__main__':
    create_svgs()
    update_registry()
    update_archetypes()
