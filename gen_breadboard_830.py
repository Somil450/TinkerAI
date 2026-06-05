import sys

def main():
    # Breadboard dimensions and spacing
    pitch = 12
    margin_x = 24
    margin_y = 24
    
    cols = 19
    rows = 63
    width = margin_x * 2 + (cols - 1) * pitch
    height = margin_y * 2 + (rows - 1) * pitch
    
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">\n'
    svg += '  <defs>\n'
    svg += '    <filter id="bb-shadow" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>\n'
    svg += '  </defs>\n'
    # Base board
    svg += f'  <rect x="4" y="4" width="{width-8}" height="{height-8}" rx="8" fill="#fcfcfc" stroke="#d0d0d0" stroke-width="2" filter="url(#bb-shadow)"/>\n'
    
    pins = []
    
    def add_hole(id, x, y, is_power=False):
        color = '#333' if is_power else '#444'
        svg_str = f'  <rect x="{x - 2.5}" y="{y - 2.5}" width="5" height="5" rx="1" fill="{color}" stroke="#ddd" stroke-width="1"/>\n'
        pins.append({'id': id, 'x': x, 'y': y, 'labelSide': 'none'})
        return svg_str
        
    x_minus_left = margin_x
    x_plus_left = margin_x + pitch
    svg += f'  <line x1="{x_minus_left - 4}" y1="{margin_y}" x2="{x_minus_left - 4}" y2="{height - margin_y}" stroke="#1E88E5" stroke-width="2"/>\n'
    svg += f'  <line x1="{x_plus_left + 4}" y1="{margin_y}" x2="{x_plus_left + 4}" y2="{height - margin_y}" stroke="#E53935" stroke-width="2"/>\n'
    
    # Full breadboard: 10 blocks of 5 holes for power = 50 holes per column
    for block in range(10):
        for h in range(5):
            row_idx = block * 6 + h + 1 
            y = margin_y + row_idx * pitch
            svg += add_hole(f'pL_neg_{block*5 + h}', x_minus_left, y, True)
            svg += add_hole(f'pL_pos_{block*5 + h}', x_plus_left, y, True)
            
    x_plus_right = margin_x + (cols - 2) * pitch
    x_minus_right = margin_x + (cols - 1) * pitch
    svg += f'  <line x1="{x_plus_right - 4}" y1="{margin_y}" x2="{x_plus_right - 4}" y2="{height - margin_y}" stroke="#E53935" stroke-width="2"/>\n'
    svg += f'  <line x1="{x_minus_right + 4}" y1="{margin_y}" x2="{x_minus_right + 4}" y2="{height - margin_y}" stroke="#1E88E5" stroke-width="2"/>\n'

    for block in range(10):
        for h in range(5):
            row_idx = block * 6 + h + 1
            y = margin_y + row_idx * pitch
            svg += add_hole(f'pR_pos_{block*5 + h}', x_plus_right, y, True)
            svg += add_hole(f'pR_neg_{block*5 + h}', x_minus_right, y, True)
            
    x_center = margin_x + 8.5 * pitch
    svg += f'  <rect x="{x_center - 3}" y="{margin_y}" width="6" height="{height - 2*margin_y}" fill="#e8e8e8" rx="2"/>\n'

    labels_left = ['a','b','c','d','e']
    labels_right = ['f','g','h','i','j']
    
    for r in range(63):
        y = margin_y + r * pitch
        if r % 5 == 0 or r == 62:
            svg += f'  <text x="{margin_x + 2*pitch + 6}" y="{y + 4}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{r+1}</text>\n'
            svg += f'  <text x="{margin_x + 16*pitch - 6}" y="{y + 4}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{r+1}</text>\n'

        for c in range(5):
            x_l = margin_x + (3 + c) * pitch
            svg += add_hole(f'{r+1}{labels_left[c]}', x_l, y)
            
            x_r = margin_x + (11 + c) * pitch
            svg += add_hole(f'{r+1}{labels_right[c]}', x_r, y)
            
    for c in range(5):
        x_l = margin_x + (3 + c) * pitch
        svg += f'  <text x="{x_l}" y="{margin_y - 8}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{labels_left[c]}</text>\n'
        svg += f'  <text x="{x_l}" y="{height - margin_y + 12}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{labels_left[c]}</text>\n'
        x_r = margin_x + (11 + c) * pitch
        svg += f'  <text x="{x_r}" y="{margin_y - 8}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{labels_right[c]}</text>\n'
        svg += f'  <text x="{x_r}" y="{height - margin_y + 12}" font-family="sans-serif" font-size="8" fill="#666" text-anchor="middle">{labels_right[c]}</text>\n'

    svg += '</svg>\n'
    
    with open('public/assets/components/breadboard-830.svg', 'w') as f:
        f.write(svg)
        
    print(f"SVG saved. Width: {width}, Height: {height}, Pins count: {len(pins)}")
    
    import json
    js_snippet = f"'breadboard-830': {{\n  width: {width},\n  height: {height},\n  pins: {json.dumps(pins, indent=2)}\n}}"
    with open('breadboard-830-pins.txt', 'w') as f:
        f.write(js_snippet)
    print("Pin mapping written to breadboard-830-pins.txt")

if __name__ == "__main__":
    main()
