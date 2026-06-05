import { componentRegistry } from "../ai/componentRegistry.js"
import { getComponentIcon } from "./componentIcons.js"

export function renderSidebar() {
    return componentRegistry.getAll().map(component => `
        <div
            class="component"
            draggable="true"
            data-type="${component.id}"
        >
            <div class="component-icon" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
                ${getComponentIcon(component.id)}
            </div>
            <span style="font-size: 11px; text-align: center; margin-top: 5px; width: 100%; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; user-select: none; pointer-events: none;" title="${component.name}">${component.name}</span>
        </div>
    `).join("")
}