/**
 * Lay out connection points with readable spacing and label positions.
 */
import { expandRegistryPins } from './registryPinExpansion.js'
import componentVisuals from '../data/componentVisuals.json'

const POWER_PINS = new Set(['VCC', '5V', '3V3', '3.3V', 'VIN', 'VDD', '+', 'V+', 'VOUT', 'ENA', 'ENB', '12V', 'LV', 'HV'])
const GROUND_PINS = new Set(['GND', 'VSS', 'Gnd', '-', 'V-', 'VSS'])

export function pinLabelClass(pinId) {
  const u = pinId.toUpperCase()
  if (GROUND_PINS.has(u) || u === 'GND') return 'pin-label-gnd'
  if (POWER_PINS.has(u) || u.includes('VCC') || u.endsWith('V')) return 'pin-label-power'
  return 'pin-label-signal'
}

export function layoutPinRow(ids, width, height, edge = 'top') {
  if (!ids.length) return []
  const margin = Math.max(18, Math.min(28, width * 0.12))
  const usable = width - 2 * margin
  const step = ids.length > 1 ? usable / (ids.length - 1) : 0
  const y = edge === 'top' ? 14 : height - 14
  const labelSide = edge === 'top' ? 'top' : 'bottom'
  return ids.map((id, i) => ({
    id,
    x: Math.round(margin + i * step),
    y,
    labelSide,
  }))
}

export function layoutPinDualRow(ids, width, height) {
  if (ids.length <= 8) return layoutPinRow(ids, width, height, 'top')
  const half = Math.ceil(ids.length / 2)
  const top = layoutPinRow(ids.slice(0, half), width, Math.round(height * 0.35), 'top')
  const bottom = layoutPinRow(ids.slice(half), width, height, 'bottom')
  return [...top, ...bottom]
}

/**
 * Build every pin for a component (from generated visuals + registry fallback).
 */
export function buildPins(componentId, visual, registry) {
  const generated = componentVisuals[componentId]
  if (generated?.pins?.length) {
    return generated.pins.map((p) => ({
      ...p,
      labelSide: p.labelSide ?? 'top',
    }))
  }

  const pinIds = expandRegistryPins(registry.get(componentId)?.pins, componentId)
  if (!pinIds.length) return visual.pins?.map((p) => ({ ...p, labelSide: p.labelSide ?? 'top' })) ?? []

  return layoutPinDualRow(pinIds, visual.width, visual.height)
}
