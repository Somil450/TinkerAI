/**
 * Builds per-component visual metadata (all pins + layout) from the registry.
 * Run: node scripts/build-component-visuals.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const { componentRegistry } = await import(pathToFileURL(path.join(root, 'src/ai/componentRegistry.js')))
const { expandRegistryPins } = await import(pathToFileURL(path.join(root, 'src/ui/registryPinExpansion.js')))
const { resolveSvgAsset } = await import(pathToFileURL(path.join(root, 'src/ui/componentArchetypes.js')))
const { BOARD_LAYOUTS } = await import(pathToFileURL(path.join(root, 'src/ui/boardPinLayouts.js')))

function extractSvgPins(archetype, pinIds, compWidth, compHeight) {
  const svgPath = path.join(root, 'src/assets/components', `${archetype}.svg`)
  if (!fs.existsSync(svgPath)) return null
  
  const content = fs.readFileSync(svgPath, 'utf8')
  
  let svgWidth = compWidth
  let svgHeight = compHeight
  const vbMatch = content.match(/viewBox="0 0 ([\d\.]+) ([\d\.]+)"/)
  if (vbMatch) {
    svgWidth = parseFloat(vbMatch[1])
    svgHeight = parseFloat(vbMatch[2])
  } else {
    const wMatch = content.match(/width="([\d\.]+)"/)
    const hMatch = content.match(/height="([\d\.]+)"/)
    if (wMatch && hMatch) {
      svgWidth = parseFloat(wMatch[1])
      svgHeight = parseFloat(hMatch[2])
    }
  }

  const scaleX = compWidth / svgWidth
  const scaleY = compHeight / svgHeight

  const foundPins = []
  const placedIds = new Set()
  const textRegex = /<text\s+x="([^"]+)"\s+y="([^"]+)"[^>]*>([^<]+)<\/text>/g
  let match
  
  while ((match = textRegex.exec(content)) !== null) {
    const cx = parseFloat(match[1]) * scaleX
    const cy = parseFloat(match[2]) * scaleY
    const label = match[3].trim()
    
    const matchedId = pinIds.find(id => !placedIds.has(id) && (id.toUpperCase() === label.toUpperCase() || id.toUpperCase().startsWith(label.toUpperCase() + '_')))
    if (matchedId) {
      let py = cy
      let labelSide = 'top'
      
      if (cy < svgHeight / 2) {
         py += 9 * scaleY
         labelSide = 'bottom'
      } else {
         py -= 9 * scaleY
         labelSide = 'top'
      }
      
      foundPins.push({
        id: matchedId,
        x: Math.round(cx),
        y: Math.round(py),
        labelSide
      })
      placedIds.add(matchedId)
    }
  }
  
  return foundPins.length > 0 ? foundPins : null
}

function layoutPins(pinIds, width, height, layout = 'auto') {
  if (!pinIds.length) return []

  if (pinIds.length === 2) {
    return [
      { id: pinIds[0], x: 4, y: Math.round(height / 2), labelSide: 'left' },
      { id: pinIds[1], x: width - 4, y: Math.round(height / 2), labelSide: 'right' },
    ]
  }

  if (pinIds.length === 3) {
    return [
      { id: pinIds[0], x: 8, y: Math.round(height * 0.25), labelSide: 'left' },
      { id: pinIds[1], x: 8, y: Math.round(height * 0.5), labelSide: 'left' },
      { id: pinIds[2], x: 8, y: Math.round(height * 0.75), labelSide: 'left' },
    ]
  }

  if (pinIds.length <= 8) {
    const margin = Math.max(16, width * 0.1)
    const step = (width - 2 * margin) / Math.max(pinIds.length - 1, 1)
    return pinIds.map((id, i) => ({
      id,
      x: Math.round(margin + i * step),
      y: 12,
      labelSide: 'top',
    }))
  }

  if (pinIds.length <= 16) {
    const half = Math.ceil(pinIds.length / 2)
    const top = pinIds.slice(0, half)
    const bottom = pinIds.slice(half)
    const margin = Math.max(14, width * 0.08)
    const stepTop = top.length > 1 ? (width - 2 * margin) / (top.length - 1) : 0
    const stepBot = bottom.length > 1 ? (width - 2 * margin) / (bottom.length - 1) : 0
    return [
      ...top.map((id, i) => ({ id, x: Math.round(margin + i * stepTop), y: 12, labelSide: 'top' })),
      ...bottom.map((id, i) => ({
        id,
        x: Math.round(margin + i * stepBot),
        y: height - 12,
        labelSide: 'bottom',
      })),
    ]
  }

  // Large components: wrap around all 4 edges to avoid meshing
  const perimeter = pinIds.length
  const topC = Math.ceil(perimeter * 0.35)
  const botC = Math.ceil(perimeter * 0.35)
  const leftC = Math.floor((perimeter - topC - botC) / 2)
  const rightC = perimeter - topC - botC - leftC

  let offset = 0
  const top = pinIds.slice(offset, offset += topC)
  const right = pinIds.slice(offset, offset += rightC)
  const bottom = pinIds.slice(offset, offset += botC)
  const left = pinIds.slice(offset, offset += leftC)

  const margin = 20
  const stepT = top.length > 1 ? (width - 2 * margin) / (top.length - 1) : 0
  const stepB = bottom.length > 1 ? (width - 2 * margin) / (bottom.length - 1) : 0
  const stepR = right.length > 1 ? (height - 2 * margin) / (right.length - 1) : 0
  const stepL = left.length > 1 ? (height - 2 * margin) / (left.length - 1) : 0

  return [
    ...top.map((id, i) => ({ id, x: Math.round(margin + i * stepT), y: 12, labelSide: 'top' })),
    ...right.map((id, i) => ({ id, x: width - 12, y: Math.round(margin + i * stepR), labelSide: 'right' })),
    ...bottom.map((id, i) => ({ id, x: Math.round(margin + i * stepB), y: height - 12, labelSide: 'bottom' })),
    ...left.map((id, i) => ({ id, x: 12, y: Math.round(margin + i * stepL), labelSide: 'left' }))
  ]

}

function computeSize(pinCount, archetype) {
  const base = {
    'arduino-uno': [300, 220],
    'arduino-mega': [360, 220],
    'arduino-nano': [200, 80],
    'breadboard': [200, 140],
    'hc-sr04': [130, 88],
    'led-red': [60, 120],
    'resistor': [120, 40],
    'servo': [120, 95],
    'sensor-module': [130, 78],
    'lcd-16x2': [200, 90],
    'ic-dip': [100, 60],
    'esp32-devkit': [280, 100],
    'l298n': [150, 100],
    'dht-module': [80, 110],
    'mpu6050': [130, 78],
    'pir-sensor': [120, 100],
    'mq2-gas': [130, 95],
    'rpi-pico': [220, 95],
    '4wd-car-chassis': [200, 250],
  }[archetype] || [130, 78]

  let [w, h] = base
  if (pinCount > 8) w = Math.max(w, 120 + pinCount * 6)
  if (pinCount > 16) w = Math.max(w, 200 + pinCount * 4)
  if (pinCount > 12) h = Math.max(h, 100 + Math.floor(pinCount / 8) * 20)
  return { width: Math.min(w, 420), height: Math.min(h, 280) }
}

function mergeBoardPins(componentId, archetype, pinIds) {
  const board = BOARD_LAYOUTS[componentId] || BOARD_LAYOUTS[archetype]
  if (!board) return null

  if (board.pins?.length) {
    return board.pins.map((p) => ({ ...p, labelSide: p.labelSide ?? 'top' }))
  }

  if (board.pinPositions) {
    const mapped = pinIds
      .map((id) => {
        const pos = board.pinPositions[id] || board.pinPositions[id.toUpperCase()]
        return pos ? { id, ...pos, labelSide: pos.labelSide ?? 'top' } : null
      })
      .filter(Boolean)
    return mapped.length ? mapped : null
  }
  return null
}

const visuals = {}

for (const comp of componentRegistry.getAll()) {
  const archetype = resolveSvgAsset(comp.id)
  const pinIds = expandRegistryPins(comp.pins, comp.id)
  let width, height
  const board = BOARD_LAYOUTS[comp.id] || BOARD_LAYOUTS[archetype]
  if (board && board.width && board.height) {
    width = board.width
    height = board.height
  } else {
    const computed = computeSize(pinIds.length, archetype)
    width = computed.width
    height = computed.height
  }

  let pins = mergeBoardPins(comp.id, archetype, pinIds)
  if (!pins) {
    // Try to extract from SVG if no board layout is specified
    const extracted = extractSvgPins(archetype, pinIds, width, height)
    if (extracted && extracted.length > 0) {
      pins = extracted
    }
  }
  
  if (!pins) {
    pins = layoutPins(pinIds, width, height)
  }

  visuals[comp.id] = {
    archetype,
    width,
    height,
    pins,
    pinCount: pinIds.length,
  }
}

const outPath = path.join(root, 'src/data/componentVisuals.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(visuals, null, 2))
console.log(`Wrote ${Object.keys(visuals).length} component visuals to ${outPath}`)
