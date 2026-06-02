export function deleteComponent(
  component,
  wireObjects,
  renderWires
){

  if(!component) return

  const pins =
    component.querySelectorAll('.pin')

  wireObjects.forEach((wire,index)=>{

    pins.forEach(pin=>{

      if(
        wire.pin1 === pin ||
        wire.pin2 === pin
      ){

        wireObjects.splice(index,1)

      }

    })

  })

  component.remove()

  renderWires()

}