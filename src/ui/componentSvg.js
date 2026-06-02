import { getComponentVisual } from './componentSvgCatalog.js'
import { resolveSvgAsset } from './componentArchetypes.js'
import { componentRegistry } from '../ai/componentRegistry.js'
import { buildPins, pinLabelClass } from './pinLayout.js'

const SVG_BASE = '/assets/components'

export function getSvgUrl(componentId) {
  return `${SVG_BASE}/${resolveSvgAsset(componentId)}.svg`
}

export function getComponentIcon(componentId, size = 40) {
  const url = getSvgUrl(componentId)
  const alt = componentRegistry.get(componentId)?.name ?? componentId
  return `<img src="${url}" width="${size}" height="${size}" alt="${alt}" class="component-svg-icon" style="object-fit: contain; max-width: 100%; max-height: 100%;" draggable="false" />`
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderPins(pins) {
  return pins
    .map((p) => {
      const labelCls = pinLabelClass(p.id)
      const side = p.labelSide || 'top'
      return `
        <div class="pin-group" style="left: ${p.x}px; top: ${p.y}px;">
          <span class="pin-label pin-label-${side} ${labelCls}">${escapeHtml(p.id)}</span>
          <div class="pin" data-pin="${escapeHtml(p.id)}" title="${escapeHtml(p.id)}"></div>
        </div>
      `
    })
    .join('')
}

export function getComponentHTML(type) {
  const visual = getComponentVisual(type)
  const url = getSvgUrl(type)
  const pins = buildPins(type, visual, componentRegistry)
  const compName = componentRegistry.get(type)?.name ?? type

  const pinDensity = pins.length > 16 ? 'high' : pins.length > 8 ? 'medium' : 'low'

  return `
    <div class="component-body" data-pin-density="${pinDensity}" style="width: ${visual.width}px; height: ${visual.height}px; position: relative;">
      <img
        src="${url}"
        class="svg-component"
        alt="${escapeHtml(compName)}"
        draggable="false"
        style="width: ${visual.width}px; height: ${visual.height}px; display: block;"
      />
      <div class="component-name-badge" title="${escapeHtml(compName)}">${escapeHtml(compName)}</div>
      ${renderPins(pins)}
    </div>
  `
}
