import './style.css'
import { isValidConnection } from './engine/pinRules.js'
import { renderSidebar } from './ui/sidebar.js'
import { selectPin, getConnections } from './engine/wires.js'
import { buildGraph } from './engine/graph.js'
import { validateCircuit } from './engine/validator.js'
import { renderProperties } from './ui/propertiesPanel.js'
import { deleteComponent } from './engine/deleteComponent.js'
import { componentRegistry } from './engine/componentRegistry.js'
import { getComponentHTML } from './ui/svgRenderer.js'
import { autoWire } from './engine/autoWire.js'
import { initializeAIUI } from './ai/uiIntegration.js'
import { safetyEngine } from './ai/safetyEngine.js'
import { simulator } from './engine/simulator.js'

document.querySelector('#app').innerHTML = `
<div class="app-layout">
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo">TinkerAI</div>
      <div class="project-name">My Brilliant Circuit</div>
    </div>
    <div class="nav-right">
      <button class="nav-btn primary">Code</button>
      <button class="nav-btn success" id="start-sim-btn">Start Simulation</button>
      <button class="nav-btn outline">Export</button>
      <button class="nav-btn outline">Share</button>
    </div>
  </nav>

  <div class="main-workspace">
    <div class="canvas" id="canvas">
      <svg id="wireLayer"></svg>
      <div class="floating-properties hidden" id="properties">
        <div class="properties-header">
          <h3>Properties</h3>
          <button id="close-properties">&times;</button>
        </div>
        <div class="properties-content" id="properties-content">
          <p>Select Component</p>
        </div>
      </div>
    </div>

    <div class="right-sidebar">
      <div class="sidebar-header">
        <select class="category-select">
          <option>Basic</option>
          <option>All</option>
          <option>Arduino</option>
        </select>
        <input type="text" placeholder="Search..." class="search-input"/>
      </div>
      <div class="component-list">
        ${renderSidebar()}
      </div>
    </div>
  </div>
</div>
`

const components = document.querySelectorAll('.component')
const canvas = document.getElementById('canvas')
const wireLayer = document.getElementById('wireLayer')

const propertiesPanel = document.getElementById('properties')
const propertiesContent = document.getElementById('properties-content')
document.getElementById('close-properties').addEventListener('click', () => {
  propertiesPanel.classList.add('hidden')
  if (selectedComponent) {
    selectedComponent.classList.remove('selected')
    selectedComponent = null
  }
})

let isSimulating = false;
const startSimBtn = document.getElementById('start-sim-btn');

startSimBtn.addEventListener('click', () => {
  if (isSimulating) {
    isSimulating = false;
    startSimBtn.innerText = 'Start Simulation';
    startSimBtn.style.background = '#00d26a';
    
    document.querySelectorAll('.placed-component').forEach(el => {
      el.classList.remove('led-lit');
    });
    return;
  }

  const connections = getConnections();
  const circuitGraph = { components: componentRegistry, connections };
  
  const safetyStatus = safetyEngine.analyze(circuitGraph);
  
  if (!safetyStatus.isSafe) {
    const criticalIssue = safetyStatus.critical[0];
    alert(`SIMULATION HALTED! Safety Hazard Detected: ${criticalIssue.message}\nImpact: ${criticalIssue.impact}`);
    return;
  }

  isSimulating = true;
  startSimBtn.innerText = 'Stop Simulation';
  startSimBtn.style.background = '#d32f2f'; 

  const poweredComponents = simulator.simulate(connections);
  
  poweredComponents.forEach(compId => {
    const comp = componentRegistry.find(c => c.id === compId);
    if (comp && comp.type === 'LED') {
      comp.element.classList.add('led-lit');
    }
  });
});

// Initialize AI UI (Commented out to prevent overlapping new Tinkercad sidebar)
// const circuitState = { components: [], connections: [] }
// const aiManager = initializeAIUI(circuitState)

let firstPinElement = null
let componentCounter = 0
let selectedComponent = null

const wireObjects = []

components.forEach(comp => {
  comp.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', comp.dataset.type)
  })
})

canvas.addEventListener('dragover', e => {
  e.preventDefault()
})

canvas.addEventListener('drop', e => {
  e.preventDefault()

  const type = e.dataTransfer.getData('type')
  componentCounter++

  const item = document.createElement('div')
  item.className = 'placed-component'
  item.dataset.componentId = `${type}_${componentCounter}`
  item.style.left = `${e.offsetX}px`
  item.style.top = `${e.offsetY}px`

  item.innerHTML = getComponentHTML(type, componentCounter)

  canvas.appendChild(item)
  componentRegistry.push({
    id: item.dataset.componentId,
    type,
    element: item
  })
  item.addEventListener('click', () => {
    if (selectedComponent) selectedComponent.classList.remove('selected')
    selectedComponent = item
    selectedComponent.classList.add('selected')
    
    propertiesContent.innerHTML = renderProperties({
      type,
      id: item.dataset.componentId,
      pinCount: item.querySelectorAll('.pin').length
    })
    propertiesPanel.classList.remove('hidden')
  })

  const pins = item.querySelectorAll('.pin')

  pins.forEach(pin => {
    pin.addEventListener('click', (event) => {
      event.stopPropagation()
      const pinId = pin.dataset.pin
      const componentId = item.dataset.componentId

      selectPin(componentId, pinId, pin)

      if (!firstPinElement) {
        firstPinElement = pin
        pin.style.background = 'yellow'
        return
      }

      const pinA = firstPinElement.dataset.pin
      const pinB = pin.dataset.pin

      if (!isValidConnection(pinA, pinB)) {
        alert(`Invalid Connection: ${pinA} → ${pinB}`)
        firstPinElement.style.background = '#00ff88'
        firstPinElement = null
        return
      }

      wireObjects.push({
        pin1: firstPinElement,
        pin2: pin
      })

      renderWires()
      firstPinElement.style.background = '#00ff88'
      firstPinElement = null

      console.clear()
      console.log("Connections:", getConnections())
      console.log("Graph:", buildGraph(getConnections()))
      console.log("Validation:", validateCircuit(getConnections()))
    })
  })

  let isDragging = false

  item.addEventListener('mousedown', () => {
    isDragging = true
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })

  document.addEventListener('mousemove', e => {
    if (!isDragging) return

    const rect = canvas.getBoundingClientRect()
    item.style.left = `${e.clientX - rect.left}px`
    item.style.top = `${e.clientY - rect.top}px`
    renderWires()
  })
})

function renderWires() {
  wireLayer.innerHTML = ""

  wireObjects.forEach(wire => {
    const rect1 = wire.pin1.getBoundingClientRect()
    const rect2 = wire.pin2.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("x1", rect1.left - canvasRect.left + 6)
    line.setAttribute("y1", rect1.top - canvasRect.top + 6)
    line.setAttribute("x2", rect2.left - canvasRect.left + 6)
    line.setAttribute("y2", rect2.top - canvasRect.top + 6)
    line.setAttribute("stroke", "#00ff88")
    line.setAttribute("stroke-width", "3")
    wireLayer.appendChild(line)
  })
}

document.addEventListener('keydown', e => {
  if (e.key === 'Delete' && selectedComponent) {
    deleteComponent(selectedComponent, wireObjects, renderWires)
    selectedComponent = null
    propertiesPanel.classList.add('hidden')
    propertiesContent.innerHTML = `<p>Select Component</p>`
  }
})