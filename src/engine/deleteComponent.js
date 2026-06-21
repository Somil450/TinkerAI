export function deleteComponent(
  component,
  wireObjects,
  renderWires
){

  if(!component) return

  const pins =
    component.querySelectorAll('.pin')

  // Iterate backwards to safely splice elements from the array
  for (let i = wireObjects.length - 1; i >= 0; i--) {
    const wire = wireObjects[i];
    let shouldDelete = false;
    
    pins.forEach(pin => {
      if (wire.pin1 === pin || wire.pin2 === pin) {
        shouldDelete = true;
      }
    });

    if (shouldDelete) {
      wireObjects.splice(i, 1);
    }
  }

  component.remove()

  renderWires()

}