import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const { componentRegistry } = await import(pathToFileURL(path.join(root, 'src/ai/componentRegistry.js')))
const { expandRegistryPins } = await import(pathToFileURL(path.join(root, 'src/ui/registryPinExpansion.js')))
const { resolveSvgAsset } = await import(pathToFileURL(path.join(root, 'src/ui/componentArchetypes.js')))
const { BOARD_LAYOUTS } = await import(pathToFileURL(path.join(root, 'src/ui/boardPinLayouts.js')))

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

const missing = []
const partial = []

for (const comp of componentRegistry.getAll()) {
  const archetype = resolveSvgAsset(comp.id)
  const pinIds = expandRegistryPins(comp.pins, comp.id)
  if (pinIds.length === 0) continue

  const pins = mergeBoardPins(comp.id, archetype, pinIds)
  if (!pins) {
    missing.push({ id: comp.id, archetype, pins: pinIds })
  } else {
    const placedIds = new Set(pins.map((p) => p.id))
    const missingPins = pinIds.filter((id) => !placedIds.has(id))
    if (missingPins.length) {
      partial.push({ id: comp.id, archetype, missingPins, placedCount: pins.length })
    }
  }
}

console.log('=== COMPLETELY MISSING LAYOUTS ===')
missing.forEach(m => console.log(`- ${m.id} (archetype: ${m.archetype}): ${m.pins.join(', ')}`))
console.log('\n=== PARTIAL LAYOUTS (Pins missed by mapping) ===')
partial.forEach(p => console.log(`- ${p.id} (archetype: ${p.archetype}) missed: ${p.missingPins.join(', ')}`))
