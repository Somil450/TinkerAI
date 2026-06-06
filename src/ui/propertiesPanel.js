export function renderProperties(component, safetyStatus = null){

    if(!component){

        return `
        <h3>Properties</h3>
        <p>Select Component</p>
        `
    }

    let safetyHtml = '';
    if (safetyStatus) {
        // Filter issues relevant to this component
        const componentIssues = safetyStatus.issues?.filter(i => i.component === component.id) || [];
        const componentWarnings = safetyStatus.warnings?.filter(w => w.component === component.id) || [];
        
        if (componentIssues.length > 0) {
            safetyHtml = `<div style="margin-top: 15px; padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;">
                <strong style="color: #d32f2f;">🚨 Safety Hazards</strong>
                <ul style="margin: 5px 0 0 15px; padding: 0; font-size: 12px; color: #b71c1c;">
                    ${componentIssues.map(i => `<li>${i.message}</li>`).join('')}
                </ul>
            </div>`;
        } else if (componentWarnings.length > 0) {
            safetyHtml = `<div style="margin-top: 15px; padding: 10px; background-color: #fff8e1; border-left: 4px solid #ffb300; border-radius: 4px;">
                <strong style="color: #f57f17;">⚠️ Warnings</strong>
                <ul style="margin: 5px 0 0 15px; padding: 0; font-size: 12px; color: #e65100;">
                    ${componentWarnings.map(w => `<li>${w.message}</li>`).join('')}
                </ul>
            </div>`;
        } else {
            safetyHtml = `<div style="margin-top: 15px; padding: 10px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                <strong style="color: #2e7d32;">✅ Component Safe</strong>
            </div>`;
        }
    }

    return `
        <h3>${component.type}</h3>

        <p>ID:
        ${component.id}
        </p>

        <p>Pins:
        ${component.pinCount}
        </p>

        <div style="margin-top: 15px;">
            <label for="comp-scale" style="font-size: 14px; font-weight: bold; color: #333;">Scale Component:</label>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                <input type="range" id="comp-scale" min="0.5" max="3" step="0.1" value="${component.scale || 1}" style="flex-grow: 1;">
                <span id="comp-scale-val" style="font-size: 12px; color: #666; min-width: 30px;">${component.scale || 1}x</span>
            </div>
        </div>

        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
            <label style="font-size: 14px; font-weight: bold; color: #333; display: block; margin-bottom: 8px;">Layering (Z-Index)</label>
            <div style="display: flex; gap: 8px;">
                <button id="btn-bring-forward" style="flex: 1; padding: 6px; font-size: 12px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px;">Bring Forward</button>
                <button id="btn-send-backward" style="flex: 1; padding: 6px; font-size: 12px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px;">Send Backward</button>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button id="btn-bring-front" style="flex: 1; padding: 6px; font-size: 12px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px;">Bring to Front</button>
                <button id="btn-send-back" style="flex: 1; padding: 6px; font-size: 12px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 4px;">Send to Back</button>
            </div>
        </div>

        ${safetyHtml}
    `
}

export function renderWireProperties(wire) {
    const comp1 = wire.pin1.closest('.placed-component');
    const comp2 = wire.pin2.closest('.placed-component');
    
    const name1 = comp1 ? (comp1.querySelector('.component-name-badge')?.innerText || comp1.dataset.componentId) : 'Unknown';
    const name2 = comp2 ? (comp2.querySelector('.component-name-badge')?.innerText || comp2.dataset.componentId) : 'Unknown';

    return `
        <h3>Wire Properties</h3>
        <p style="margin-bottom: 5px;"><strong>From:</strong> ${name1} (${wire.pin1.dataset.pin})</p>
        <p><strong>To:</strong> ${name2} (${wire.pin2.dataset.pin})</p>
        <div style="margin-top: 15px;">
            <label for="wire-color" style="font-size: 14px; font-weight: bold; color: #333;">Wire Color:</label>
            <select id="wire-color" style="margin-top: 5px; width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc;">
                <option value="#ff3333" ${wire.color === '#ff3333' ? 'selected' : ''}>Red (Power)</option>
                <option value="#333333" ${wire.color === '#333333' ? 'selected' : ''}>Black (Ground)</option>
                <option value="#00cc66" ${wire.color === '#00cc66' ? 'selected' : ''}>Green (Signal)</option>
                <option value="#ffaa00" ${wire.color === '#ffaa00' ? 'selected' : ''}>Orange</option>
                <option value="#3399ff" ${wire.color === '#3399ff' ? 'selected' : ''}>Blue</option>
                <option value="#cccc00" ${wire.color === '#cccc00' ? 'selected' : ''}>Yellow</option>
                <option value="#9933cc" ${wire.color === '#9933cc' ? 'selected' : ''}>Purple</option>
                <option value="#ffffff" ${wire.color === '#ffffff' ? 'selected' : ''}>White</option>
                <option value="#999999" ${wire.color === '#999999' ? 'selected' : ''}>Gray</option>
                <option value="#8b4513" ${wire.color === '#8b4513' ? 'selected' : ''}>Brown</option>
            </select>
        </div>
    `;
}