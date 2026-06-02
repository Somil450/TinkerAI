export function renderProperties(component){

    if(!component){

        return `
        <h3>Properties</h3>
        <p>Select Component</p>
        `
    }

    return `
        <h3>${component.type}</h3>

        <p>ID:
        ${component.id}
        </p>

        <p>Pins:
        ${component.pinCount}
        </p>
    `
}