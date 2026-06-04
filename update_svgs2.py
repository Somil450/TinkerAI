import os

components = {
    'rain-sensor': {'text': 'RAIN SENSOR', 'pins': ['VCC', 'GND', 'AO', 'DO'], 'color': '#0d47a1', 'fill': '#1976d2', 'gfx': '<rect x="40" y="30" width="50" height="40" fill="#2196f3"/><path d="M45,40 l40,0 M45,50 l40,0 M45,60 l40,0" stroke="#fff" stroke-width="2"/>'},
    'touch-sensor': {'text': 'TOUCH SENSOR', 'pins': ['VCC', 'GND', 'SIG'], 'color': '#b71c1c', 'fill': '#f44336', 'gfx': '<circle cx="65" cy="50" r="15" fill="#ffcdd2"/><text x="65" y="53" text-anchor="middle" font-size="8" fill="#d32f2f" font-weight="bold">TOUCH</text>'},
    'rotary-encoder': {'text': 'ENCODER', 'pins': ['CLK', 'DT', 'SW', 'VCC', 'GND'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<circle cx="65" cy="50" r="22" fill="silver" stroke="#777" stroke-width="2"/><circle cx="65" cy="50" r="15" fill="#333"/><rect x="62" y="35" width="6" height="30" fill="#555"/>'},
    'hall-effect': {'text': 'HALL SENSOR', 'pins': ['VCC', 'GND', 'DO', 'AO'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<rect x="55" y="40" width="20" height="20" fill="#111"/><text x="65" y="53" text-anchor="middle" font-size="6" fill="#aaa">3144</text>'},
    'vibration-sensor': {'text': 'VIBRATION', 'pins': ['VCC', 'GND', 'DO'], 'color': '#01579b', 'fill': '#03a9f4', 'gfx': '<rect x="50" y="45" width="30" height="10" fill="#111" rx="5"/><circle cx="55" cy="50" r="3" fill="#00bcd4"/>'},
    'uv-sensor': {'text': 'UV SENSOR', 'pins': ['VCC', 'GND', 'OUT'], 'color': '#4a148c', 'fill': '#9c27b0', 'gfx': '<rect x="55" y="40" width="20" height="20" fill="silver"/><circle cx="65" cy="50" r="5" fill="#e1bee7"/>'},
    'flex-sensor': {'text': 'FLEX SENSOR', 'pins': ['VCC', 'GND', 'AO'], 'color': '#212121', 'fill': '#424242', 'gfx': '<path d="M20,50 Q65,10 110,50" stroke="#ffeb3b" stroke-width="8" fill="none"/>'},
    'force-sensor': {'text': 'FORCE SENSOR', 'pins': ['VCC', 'GND', 'AO'], 'color': '#212121', 'fill': '#424242', 'gfx': '<circle cx="65" cy="45" r="20" fill="#616161"/><circle cx="65" cy="45" r="15" fill="#9e9e9e"/>'},
    'tilt-sensor': {'text': 'TILT SENSOR', 'pins': ['VCC', 'GND', 'SIG'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<rect x="55" y="40" width="20" height="15" fill="#111" rx="2"/><circle cx="60" cy="47" r="4" fill="#ffeb3b"/>'},
    'fingerprint-sensor': {'text': 'FINGERPRINT', 'pins': ['VCC', 'GND', 'TX', 'RX'], 'color': '#000000', 'fill': '#212121', 'gfx': '<rect x="45" y="30" width="40" height="40" fill="#424242" rx="4"/><path d="M55,40 A10,10 0 1,1 75,40 M52,45 A13,13 0 1,1 78,45 M49,50 A16,16 0 1,1 81,50" stroke="#00e676" stroke-width="1.5" fill="none"/>'},
    'ir-sensor': {'text': 'IR OBSTACLE', 'pins': ['VCC', 'GND', 'OUT'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<circle cx="50" cy="45" r="8" fill="#111"/><circle cx="80" cy="45" r="8" fill="#fff" stroke="#999" stroke-width="2"/>'},
    'ir-receiver': {'text': 'IR RECEIVER', 'pins': ['OUT', 'GND', 'VCC'], 'color': '#b71c1c', 'fill': '#f44336', 'gfx': '<rect x="55" y="35" width="20" height="25" fill="#111" rx="2"/><circle cx="65" cy="45" r="8" fill="#212121"/>'},
    'mq2-gas': {'text': 'MQ-2 GAS', 'pins': ['VCC', 'GND', 'AO', 'DO'], 'color': '#0a3d7a', 'fill': '#1E88E5', 'gfx': '<circle cx="65" cy="50" r="20" fill="#c0c0c0" stroke="#909090" stroke-width="2"/><circle cx="65" cy="50" r="14" fill="#333" opacity="0.2"/><path d="M55,50 h20 M65,40 v20 M58,43 l14,14 M58,57 l14,-14" stroke="#a0a0a0" stroke-width="1"/>'},
    'soil-moisture': {'text': 'SOIL SENSOR', 'pins': ['VCC', 'GND', 'AO', 'DO'], 'color': '#1b5e20', 'fill': '#4caf50', 'gfx': '<path d="M45,40 v30 M55,40 v30 M65,40 v30 M75,40 v30 M85,40 v30" stroke="#ffeb3b" stroke-width="2"/>'}
}

base_dir = r'src/assets/components'

for comp, data in components.items():
    file_path = os.path.join(base_dir, comp + '.svg')
    
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
