import os

components = {
    'mq135-air': {'text': 'MQ-135', 'pins': ['VCC', 'GND', 'AO', 'DO'], 'color': '#0a3d7a', 'fill': '#1E88E5', 'gfx': '<circle cx="65" cy="50" r="20" fill="#c0c0c0" stroke="#909090" stroke-width="2"/><circle cx="65" cy="50" r="14" fill="#333" opacity="0.2"/><path d="M55,50 h20 M65,40 v20 M58,43 l14,14 M58,57 l14,-14" stroke="#a0a0a0" stroke-width="1"/>'},
    'water-level': {'text': 'WATER LEVEL', 'pins': ['SIG', 'VCC', 'GND'], 'color': '#c62828', 'fill': '#e53935', 'gfx': '<rect x="15" y="30" width="100" height="45" fill="#c62828"/><path d="M25,35 v35 M35,35 v35 M45,35 v35 M55,35 v35 M65,35 v35 M75,35 v35 M85,35 v35 M95,35 v35 M105,35 v35" stroke="#ffd700" stroke-width="2"/>'},
    'flame-sensor': {'text': 'FLAME', 'pins': ['VCC', 'GND', 'DO', 'AO'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<rect x="30" y="40" width="15" height="15" fill="#111"/><circle cx="15" cy="50" r="8" fill="#212121"/><path d="M15,42 Q25,50 15,58" stroke="#fff" stroke-width="1" fill="none"/><rect x="60" y="45" width="8" height="8" fill="#333"/><circle cx="64" cy="49" r="3" fill="#00bcd4"/>'},
    'sound-sensor': {'text': 'MIC SENSOR', 'pins': ['AO', 'GND', 'VCC', 'DO'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<circle cx="25" cy="45" r="12" fill="#d4af37"/><circle cx="25" cy="45" r="8" fill="#000"/><rect x="50" y="40" width="15" height="15" fill="#111"/><circle cx="80" cy="45" r="4" fill="#1976d2"/>'},
    'bmp280': {'text': 'BMP280', 'pins': ['VCC', 'GND', 'SCL', 'SDA'], 'color': '#4a148c', 'fill': '#7b1fa2', 'gfx': '<rect x="50" y="35" width="25" height="20" fill="silver" stroke="#777"/><circle cx="55" cy="40" r="2" fill="#333"/>'},
    'bme280': {'text': 'BME280', 'pins': ['VCC', 'GND', 'SCL', 'SDA'], 'color': '#4a148c', 'fill': '#7b1fa2', 'gfx': '<rect x="50" y="35" width="25" height="20" fill="silver" stroke="#777"/><circle cx="55" cy="40" r="2" fill="#333"/><rect x="65" y="45" width="5" height="5" fill="#333"/>'},
    'adxl345': {'text': 'ADXL345', 'pins': ['VCC', 'GND', 'SCL', 'SDA', 'SDO', 'CS'], 'color': '#006064', 'fill': '#0097a7', 'gfx': '<rect x="55" y="35" width="20" height="20" fill="#222"/><text x="65" y="45" text-anchor="middle" fill="#999" font-size="5">ADXL</text>'},
    'acs712': {'text': 'ACS712', 'pins': ['VCC', 'OUT', 'GND'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<rect x="10" y="20" width="30" height="60" fill="#111"/><circle cx="25" cy="30" r="5" fill="#d4af37"/><circle cx="25" cy="70" r="5" fill="#d4af37"/><rect x="55" y="35" width="20" height="25" fill="#222"/>'},
    'hx711': {'text': 'HX711', 'pins': ['VCC', 'DT', 'SCK', 'GND'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<rect x="45" y="30" width="40" height="30" fill="#222"/><text x="65" y="45" text-anchor="middle" fill="#999" font-size="6">HX711</text><rect x="10" y="10" width="10" height="70" fill="#333"/><circle cx="15" cy="15" r="2" fill="#d4af37"/><circle cx="15" cy="25" r="2" fill="#d4af37"/><circle cx="15" cy="65" r="2" fill="#d4af37"/><circle cx="15" cy="75" r="2" fill="#d4af37"/>'},
    'max30102': {'text': 'MAX30102', 'pins': ['VIN', 'SCL', 'SDA', 'INT', 'IRD', 'RD', 'GND'], 'color': '#4a148c', 'fill': '#7b1fa2', 'gfx': '<rect x="55" y="35" width="20" height="20" fill="silver" stroke="#333"/><circle cx="65" cy="45" r="6" fill="#000"/><circle cx="65" cy="45" r="3" fill="#e53935" opacity="0.8"/>'}
}

base_dir = r'src/assets/components'

for comp, data in components.items():
    file_path = os.path.join(base_dir, comp + '.svg')
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (does not exist)")
        continue
    
    # build pins svg
    pins_svg = ''
    pin_width = 12
    pin_spacing = 14
    total_width = len(data['pins']) * pin_spacing
    pin_x_start = 65 - (total_width / 2)
    for i, pin in enumerate(data['pins']):
        x = pin_x_start + (i * pin_spacing)
        pins_svg += f"""
        <rect x="{x}" y="7" width="8" height="10" fill="#bdbdbd" rx="1"/>
        <text x="{x+4}" y="5" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" font-family="Arial,sans-serif">{pin}</text>
        """

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 95" width="130" height="95">
  <defs>
    <filter id="sh-{comp}" x="-8%" y="-8%" width="116%" height="116%"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.28"/></filter>
  </defs>
  <rect x="5" y="15" width="120" height="75" rx="4" fill="{data['fill']}" stroke="{data['color']}" stroke-width="1.5" filter="url(#sh-{comp})"/>
  
  <!-- PIN HEADER BLACK BASE -->
  <rect x="{pin_x_start-4}" y="6" width="{total_width + 4}" height="14" rx="2" fill="#1a1a1a" stroke="#333"/>
  {pins_svg}
  
  <!-- CUSTOM GRAPHICS -->
  {data['gfx']}
  
  <!-- COMPONENT NAME -->
  <text x="65" y="85" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold" font-family="Arial,sans-serif" opacity="0.9">{data['text']}</text>
</svg>"""
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
        
    print(f'Wrote {file_path}')
