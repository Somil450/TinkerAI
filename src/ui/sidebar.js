import { COMPONENTS } from "../components/index.js"

export function renderSidebar() {
    return COMPONENTS.map(component => `
        <div
            class="component"
            draggable="true"
            data-type="${component.type}"
        >
            <div class="component-icon">
                <img src="/src/assets/${component.type.toLowerCase()}.svg" alt="${component.name}" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <span style="display: none; font-weight: 700; font-size: 18px; color: #1a73e8;">${component.name.charAt(0)}</span>
            </div>
            <span>${component.name}</span>
        </div>
    `).join("")
}