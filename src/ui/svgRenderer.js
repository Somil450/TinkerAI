export function getComponentHTML(type, componentCounter) {
  if(type === "LED"){
    return `
      <img src="/src/assets/led.svg" class="svg-component" style="width: 60px; height: 120px;">
      <div class="pin" data-pin="anode" style="left: 24px; top: 110px; transform: translate(-50%, -50%);"></div>
      <div class="pin" data-pin="cathode" style="left: 36px; top: 100px; transform: translate(-50%, -50%);"></div>
    `
  }

  if(type === "Resistor"){
    return `
      <img src="/src/assets/resistor.svg" class="svg-component" style="width: 120px; height: 40px;">
      <div class="pin" data-pin="pin1" style="left: 0px; top: 20px; transform: translate(-50%, -50%);"></div>
      <div class="pin" data-pin="pin2" style="left: 120px; top: 20px; transform: translate(-50%, -50%);"></div>
    `
  }

  if(type === "Arduino"){
    return `
      <img src="/src/assets/arduino.svg" class="svg-component" style="width: 200px; height: 150px;">
      <div class="pin" data-pin="5V" style="left: 60px; top: 11px; transform: translate(-50%, -50%);"></div>
      <div class="pin" data-pin="D13" style="left: 170px; top: 11px; transform: translate(-50%, -50%);"></div>
      <div class="pin" data-pin="GND" style="left: 70px; top: 139px; transform: translate(-50%, -50%);"></div>
      <div class="pin" data-pin="D12" style="left: 160px; top: 139px; transform: translate(-50%, -50%);"></div>
    `
  }

  return type
}