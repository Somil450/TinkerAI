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

        ${safetyHtml}
    `
}