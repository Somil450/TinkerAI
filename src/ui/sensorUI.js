import { componentRegistry as aiComponentRegistry } from '../ai/componentRegistry.js';

export function initSensorUI() {
    if (!document.getElementById('sensor-ui-panel')) {
        const panel = document.createElement('div');
        panel.id = 'sensor-ui-panel';
        panel.className = 'properties-panel hidden';
        panel.style.left = '20px';
        panel.style.top = '100px';
        panel.style.right = 'auto';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Hardware Simulation</h3>
            </div>
            <div class="panel-content" id="sensor-ui-content">
                <p>No interactive components.</p>
            </div>
        `;
        document.body.appendChild(panel);
    }
    window.sensorData = window.sensorData || {};
}

export function updateSensorUI() {
    const panel = document.getElementById('sensor-ui-panel');
    const content = document.getElementById('sensor-ui-content');
    if (!panel || !content) return;

    const placedIds = Array.from(document.querySelectorAll('.placed-component')).map(el => el.dataset.componentId);
    let html = '';
    let hasSensors = false;

    placedIds.forEach(id => {
        let type = id.substring(0, id.lastIndexOf('_'));
        if (!type) type = id;

        const spec = aiComponentRegistry.get(type);
        if (!spec) return;

        if (spec.category === 'Sensor' || type.includes('button') || type.includes('switch') || type.includes('potentiometer')) {
            hasSensors = true;
            
            // Initialize default data if not present
            if (window.sensorData[id] === undefined) {
                if (type.includes('button') || type.includes('switch')) {
                    window.sensorData[id] = 0; // 0 = unpressed/off, 1 = pressed/on
                } else if (spec.subcategory === 'Distance') {
                    window.sensorData[id] = 100; // default 100cm
                } else if (spec.subcategory === 'Temperature') {
                    window.sensorData[id] = 25; // default 25C
                } else {
                    window.sensorData[id] = 50; // generic analog 0-100%
                }
            }

            const val = window.sensorData[id];
            
            html += `<div class="sensor-control" style="margin-bottom: 15px;">`;
            html += `<h4>${spec.name} <small style="color:#aaa;">(${id})</small></h4>`;
            
            if (type.includes('button') || type.includes('switch')) {
                html += `
                    <label class="switch">
                      <input type="checkbox" onchange="window.sensorData['${id}'] = this.checked ? 1 : 0" ${val ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                    <span style="margin-left: 10px;">Toggle State</span>
                `;
            } else if (spec.subcategory === 'Distance') {
                html += `
                    <input type="range" min="2" max="400" value="${val}" style="width:100%" oninput="document.getElementById('val_${id}').innerText = this.value + ' cm'; window.sensorData['${id}'] = parseInt(this.value);">
                    <div style="text-align:right; font-size:12px;" id="val_${id}">${val} cm</div>
                `;
            } else if (spec.subcategory === 'Temperature' || spec.subcategory === 'Environmental') {
                html += `
                    <input type="range" min="-20" max="80" value="${val}" style="width:100%" oninput="document.getElementById('val_${id}').innerText = this.value + ' °C'; window.sensorData['${id}'] = parseInt(this.value);">
                    <div style="text-align:right; font-size:12px;" id="val_${id}">${val} °C</div>
                `;
            } else {
                html += `
                    <input type="range" min="0" max="100" value="${val}" style="width:100%" oninput="document.getElementById('val_${id}').innerText = this.value + ' %'; window.sensorData['${id}'] = parseInt(this.value);">
                    <div style="text-align:right; font-size:12px;" id="val_${id}">${val} %</div>
                `;
            }
            html += `</div>`;
        }
    });

    if (hasSensors) {
        content.innerHTML = html;
        panel.classList.remove('hidden');
    } else {
        content.innerHTML = '<p>No interactive components.</p>';
        panel.classList.add('hidden');
    }
}

export function hideSensorUI() {
    const panel = document.getElementById('sensor-ui-panel');
    if (panel) panel.classList.add('hidden');
}
