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
import { componentRegistry as aiComponentRegistry } from './ai/componentRegistry.js'
import { initializeAIUI } from './ai/uiIntegration.js'
import { safetyEngine } from './ai/safetyEngine.js'
import { autoCorrectionEngine } from './ai/autoCorrectionEngine.js'
import { simulator } from './engine/simulator.js'
import { initCodeEditor, getCode, setCompilerStatus } from './ui/codeEditor.js'
import { compileCode } from './engine/compiler.js'
import { connectToBoard, disconnectFromBoard, flashToBoard, getPort } from './engine/flasher.js'
import { startSerialMonitor, sendSerialData, stopSerialMonitor } from './engine/serialMonitor.js'

document.querySelector('#app').innerHTML = `
<div class="app-layout">
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo">TinkerAI</div>
      <div class="project-name">My Brilliant Circuit</div>
    </div>
    <div class="nav-right">
      <button class="nav-btn primary" id="code-btn">Code</button>
      <button class="nav-btn success" id="start-sim-btn">Start Simulation</button>
      <button class="nav-btn upload" id="upload-btn" title="Upload sketch to physical Arduino">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        Upload
      </button>
      <button class="nav-btn serial" id="serial-btn">Serial Monitor</button>
      <button class="nav-btn outline" id="connect-btn">Connect Board</button>
      <button class="nav-btn outline">Export</button>
      <button class="nav-btn outline" id="toggle-sidebar-btn" title="Toggle Component Panel" style="padding: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      </button>
    </div>
  </nav>

  <div class="main-workspace">
    
    <!-- Code Editor Panel (Hidden by default) -->
    <div id="code-panel" class="code-panel hidden">
      <div class="code-panel-header">
        <span class="code-panel-title">main.cpp</span>
        <button id="close-code-panel" class="close-btn">&times;</button>
      </div>
      <div id="editor-container"></div>
      <div id="compiler-output" class="compiler-output">Ready to compile.</div>
    </div>

    <!-- Serial Monitor Panel (Hidden by default) -->
    <div id="serial-panel" class="serial-panel hidden">
      <div class="serial-panel-header">
        <span class="serial-panel-title">Serial Monitor</span>
        <div class="serial-controls">
          <select id="baud-rate" class="baud-select">
            <option value="300">300</option>
            <option value="1200">1200</option>
            <option value="2400">2400</option>
            <option value="4800">4800</option>
            <option value="9600" selected>9600</option>
            <option value="19200">19200</option>
            <option value="38400">38400</option>
            <option value="57600">57600</option>
            <option value="115200">115200</option>
          </select>
          <button id="clear-serial" class="serial-action-btn">Clear</button>
          <button id="close-serial" class="close-btn">&times;</button>
        </div>
      </div>
      <div id="serial-output" class="serial-output"></div>
      <div class="serial-input-row">
        <input type="text" id="serial-input" class="serial-input" placeholder="Type a message and press Enter..." />
        <button id="serial-send" class="serial-send-btn">Send</button>
      </div>
    </div>

    <!-- Canvas -->
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

    <div class="sidebar-resizer" id="sidebar-resizer" role="separator" aria-orientation="vertical" aria-label="Resize component panel"></div>
    <div class="right-sidebar" id="right-sidebar">
      <div class="sidebar-header">
        <select class="category-select">
          <option>Basic</option>
          <option>All</option>
          <option>Arduino</option>
        </select>
        <input type="text" placeholder="Search..." class="search-input"/>
      </div>
      <div class="component-list" id="component-list">
        <div class="component-list-grid">
          ${renderSidebar()}
        </div>
      </div>
    </div>
  </div>
</div>
`

const componentList = document.getElementById('component-list')
const components = componentList.querySelectorAll('.component')
const canvas = document.getElementById('canvas')
const wireLayer = document.getElementById('wireLayer')
const rightSidebar = document.getElementById('right-sidebar')
const sidebarResizer = document.getElementById('sidebar-resizer')

const SIDEBAR_WIDTH_MIN = 200
const SIDEBAR_WIDTH_MAX = () => Math.min(560, window.innerWidth * 0.5)

function setSidebarWidth(px) {
  const width = Math.round(Math.min(SIDEBAR_WIDTH_MAX(), Math.max(SIDEBAR_WIDTH_MIN, px)))
  rightSidebar.style.setProperty('--sidebar-width', `${width}px`)
  return width
}

let isResizingSidebar = false

sidebarResizer.addEventListener('mousedown', (e) => {
  e.preventDefault()
  isResizingSidebar = true
  sidebarResizer.classList.add('is-dragging')
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
})

document.addEventListener('mousemove', (e) => {
  if (!isResizingSidebar) return
  const workspace = document.querySelector('.main-workspace')
  const rect = workspace.getBoundingClientRect()
  setSidebarWidth(rect.right - e.clientX)
})

document.addEventListener('mouseup', () => {
  if (!isResizingSidebar) return
  isResizingSidebar = false
  sidebarResizer.classList.remove('is-dragging')
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

const searchInput = document.querySelector('.search-input');
const categorySelect = document.querySelector('.category-select');

function filterComponents() {
  const term = searchInput ? searchInput.value.toLowerCase() : '';
  const category = categorySelect ? categorySelect.value : 'All';
  const components = document.querySelectorAll('.component-list-grid .component');
  
  components.forEach(comp => {
    const nameSpan = comp.querySelector('span');
    const compId = comp.dataset.type;
    const registryComp = aiComponentRegistry.getAll().find(c => c.id === compId);
    
    let matchesSearch = false;
    if (nameSpan && nameSpan.textContent.toLowerCase().includes(term)) {
      matchesSearch = true;
    }
    
    let matchesCategory = true;
    if (category !== 'All' && registryComp) {
       // simple hack: if category is 'Basic', maybe show passive components, else match string
       if (category === 'Basic') {
          matchesCategory = ['Passive', 'Basic', 'Connector', 'Power'].includes(registryComp.category);
       } else if (category === 'Arduino') {
          matchesCategory = registryComp.category === 'Microcontroller' || registryComp.name.includes('Arduino');
       } else {
          matchesCategory = registryComp.category === category || registryComp.subcategory === category;
       }
    }
    
    if (matchesSearch && matchesCategory) {
      comp.style.display = '';
    } else {
      comp.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterComponents);
}
if (categorySelect) {
  categorySelect.addEventListener('change', filterComponents);
}

window.showToast = function(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.color = '#fff';
  toast.style.background = type === 'error' ? '#f44336' : (type === 'warn' ? '#ff9800' : '#2196F3');
  toast.style.zIndex = '9999';
  toast.style.transition = 'opacity 0.3s';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const propertiesPanel = document.getElementById('properties')
const propertiesContent = document.getElementById('properties-content')
document.getElementById('close-properties').addEventListener('click', () => {
  propertiesPanel.classList.add('hidden')
  if (selectedComponent) {
    selectedComponent.classList.remove('selected')
    selectedComponent = null
  }
})

let globalMaxZIndex = 20;
let globalMinZIndex = 10;

function attachPropertiesListeners(componentElement) {
  const scaleInput = document.getElementById('comp-scale');
  const scaleVal = document.getElementById('comp-scale-val');
  if (scaleInput) {
    scaleInput.addEventListener('input', (e) => {
      const scale = parseFloat(e.target.value);
      scaleVal.textContent = `${scale}x`;
      componentElement.dataset.scale = scale;
      
      let transformStr = `scale(${scale})`;
      if (componentElement.physics && componentElement.physics.rotation) {
        transformStr += ` rotate(${componentElement.physics.rotation}rad)`;
      }
      componentElement.style.transform = transformStr;
      
      renderWires(); // Redraw wires since pins have moved
    });
  }

  const btnBringForward = document.getElementById('btn-bring-forward');
  if (btnBringForward) {
    btnBringForward.addEventListener('click', () => {
      const currentZ = parseInt(componentElement.style.zIndex || getComputedStyle(componentElement).zIndex || 10);
      componentElement.style.zIndex = currentZ + 1;
      if (currentZ + 1 > globalMaxZIndex) globalMaxZIndex = currentZ + 1;
    });
  }

  const btnSendBackward = document.getElementById('btn-send-backward');
  if (btnSendBackward) {
    btnSendBackward.addEventListener('click', () => {
      const currentZ = parseInt(componentElement.style.zIndex || getComputedStyle(componentElement).zIndex || 10);
      componentElement.style.zIndex = currentZ - 1;
      if (currentZ - 1 < globalMinZIndex) globalMinZIndex = currentZ - 1;
    });
  }

  const btnBringFront = document.getElementById('btn-bring-front');
  if (btnBringFront) {
    btnBringFront.addEventListener('click', () => {
      globalMaxZIndex++;
      componentElement.style.zIndex = globalMaxZIndex;
    });
  }

  const btnSendBack = document.getElementById('btn-send-back');
  if (btnSendBack) {
    btnSendBack.addEventListener('click', () => {
      globalMinZIndex--;
      componentElement.style.zIndex = globalMinZIndex;
    });
  }
}

let isSimulating = false;
let isBoardConnected = false;
const startSimBtn = document.getElementById('start-sim-btn');
const codeBtn = document.getElementById('code-btn');
const codePanel = document.getElementById('code-panel');
const uploadBtn = document.getElementById('upload-btn');
const connectBtn = document.getElementById('connect-btn');
const serialBtn = document.getElementById('serial-btn');
const serialPanel = document.getElementById('serial-panel');
const serialOutput = document.getElementById('serial-output');
const serialInput = document.getElementById('serial-input');
const serialSendBtn = document.getElementById('serial-send');
const baudRateSelect = document.getElementById('baud-rate');
const clearSerialBtn = document.getElementById('clear-serial');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

toggleSidebarBtn.addEventListener('click', () => {
  rightSidebar.classList.toggle('hidden');
  sidebarResizer.classList.toggle('hidden');
});

const closeSerialBtn = document.getElementById('close-serial');

// Initialize Code Editor
setTimeout(() => {
    initCodeEditor('editor-container');
}, 100);

codeBtn.addEventListener('click', () => {
    codePanel.classList.toggle('hidden');
});

document.getElementById('close-code-panel').addEventListener('click', () => {
    codePanel.classList.add('hidden');
});

// ── Connect Board ──
connectBtn.addEventListener('click', async () => {
    if (isBoardConnected) {
        await disconnectFromBoard();
        await stopSerialMonitor();
        isBoardConnected = false;
        connectBtn.innerText = 'Connect Board';
        connectBtn.classList.remove('connected');
        setCompilerStatus('Board disconnected.');
        return;
    }

    try {
        await connectToBoard(115200);
        isBoardConnected = true;
        connectBtn.innerText = 'Disconnect';
        connectBtn.classList.add('connected');
        setCompilerStatus('Board connected successfully!');
    } catch (e) {
        setCompilerStatus(e.message, true);
    }
});

// ── Upload to Board ──
uploadBtn.addEventListener('click', async () => {
    if (!isBoardConnected) {
        setCompilerStatus('No board connected. Click "Connect Board" first.', true);
        if (codePanel.classList.contains('hidden')) codePanel.classList.remove('hidden');
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.innerText = 'Compiling...';
    setCompilerStatus('Compiling...');

    const code = getCode();
    const compileResult = await compileCode(code);

    if (compileResult.compilerError || compileResult.stderr) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Upload';
        setCompilerStatus(compileResult.compilerError || compileResult.stderr, true);
        if (codePanel.classList.contains('hidden')) codePanel.classList.remove('hidden');
        return;
    }

    setCompilerStatus(compileResult.stdout || 'Compiled. Flashing to board...');
    uploadBtn.innerText = 'Uploading...';

    try {
        await stopSerialMonitor();
        await flashToBoard(compileResult.hex, (msg) => {
            setCompilerStatus(msg);
        });
        setCompilerStatus('Done! Sketch uploaded successfully.');
    } catch (e) {
        setCompilerStatus('Flash error: ' + e.message, true);
    }

    uploadBtn.disabled = false;
    uploadBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Upload';
});

// ── Serial Monitor ──
serialBtn.addEventListener('click', async () => {
    serialPanel.classList.toggle('hidden');
    if (!serialPanel.classList.contains('hidden') && isBoardConnected) {
        const baudRate = parseInt(baudRateSelect.value);
        try {
            await startSerialMonitor(getPort(), (text) => {
                serialOutput.innerText += text;
                serialOutput.scrollTop = serialOutput.scrollHeight;
            }, baudRate);
        } catch (e) {
            serialOutput.innerText += `\n[Error: ${e.message}]\n`;
        }
    } else if (serialPanel.classList.contains('hidden')) {
        await stopSerialMonitor();
    }
});

closeSerialBtn.addEventListener('click', async () => {
    serialPanel.classList.add('hidden');
    await stopSerialMonitor();
});

clearSerialBtn.addEventListener('click', () => {
    serialOutput.innerText = '';
});

async function handleSerialSend() {
    const text = serialInput.value;
    if (!text || !isBoardConnected) return;
    try {
        await sendSerialData(getPort(), text + '\n');
        serialOutput.innerText += `> ${text}\n`;
        serialOutput.scrollTop = serialOutput.scrollHeight;
        serialInput.value = '';
    } catch (e) {
        serialOutput.innerText += `\n[Send Error: ${e.message}]\n`;
    }
}

serialSendBtn.addEventListener('click', handleSerialSend);
serialInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSerialSend();
});

startSimBtn.addEventListener('click', async () => {
  if (isSimulating) {
    isSimulating = false;
    startSimBtn.innerText = 'Start Simulation';
    startSimBtn.style.background = '#00d26a';
    setCompilerStatus('Simulation stopped.');
    simulator.stopSimulation();
    
    document.querySelectorAll('.placed-component').forEach(el => {
      el.classList.remove('led-lit');
    });
    return;
  }

  const connections = getConnections();
  const circuitGraph = {
    components: componentRegistry.map(c => ({ id: c.id, type: c.type })),
    connections: connections.map(c => ({ from: c.from, to: c.to })),
  };

  const safetyStatus = validateCircuit(connections);
  
  if (!safetyStatus.valid) {
    const issue = safetyStatus.issues[0];
    const corrections = autoCorrectionEngine.analyze(circuitGraph);
    
    let fixMsg = '';
    if (corrections.suggestions && corrections.suggestions.length > 0) {
        const fix = corrections.suggestions[0];
        fixMsg = `\n\nSuggestion: ${fix.suggestion}`;
    }
    
    alert(`SIMULATION HALTED! Safety Hazard Detected: ${issue.message}${fixMsg}`);
    return;
  }

  startSimBtn.innerText = 'Compiling...';
  startSimBtn.style.background = '#f39c12';
  setCompilerStatus('Compiling on remote server...');
  
  const code = getCode();
  const compileResult = await compileCode(code);
  
  if (compileResult.compilerError || compileResult.stderr) {
      startSimBtn.innerText = 'Start Simulation';
      startSimBtn.style.background = '#00d26a';
      setCompilerStatus(compileResult.compilerError || compileResult.stderr, true);
      if (!codePanel.classList.contains('hidden')) {
          // Keep panel open to see error
      }
      return;
  }
  
  setCompilerStatus(compileResult.stdout || 'Compiled successfully. Running AVR CPU...');

  isSimulating = true;
  startSimBtn.innerText = 'Stop Simulation';
  startSimBtn.style.background = '#d32f2f'; 

  simulator.startSimulation(compileResult.hex, connections);
});

// Initialize AI UI (Commented out to prevent overlapping new Tinkercad sidebar)
// const circuitState = { components: [], connections: [] }
// const aiManager = initializeAIUI(circuitState)

  let firstPinElement = null
  let componentCounter = 0
  let selectedComponent = null
  let selectedWire = null
  let activeWireLine = null
  
  const wireObjects = []

components.forEach(comp => {
  comp.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', comp.dataset.type)
  })
})

canvas.addEventListener('dragover', e => {
  e.preventDefault()
})

  canvas.addEventListener('click', (e) => {
    // If we click directly on the canvas background, deselect everything
    if (e.target === canvas || e.target === wireLayer) {
      if (selectedComponent) {
        selectedComponent.classList.remove('selected')
        selectedComponent = null
        propertiesPanel.classList.add('hidden')
        propertiesContent.innerHTML = `<p>Select Component</p>`
      }
      if (selectedWire) {
        selectedWire = null
        renderWires()
      }
      
      // Cancel active wire drawing
      if (firstPinElement) {
        firstPinElement.style.background = ''
        firstPinElement = null
        if (activeWireLine) {
          activeWireLine.remove()
          activeWireLine = null
        }
      }
    }
  })

  // Active wire drawing preview
  canvas.addEventListener('mousemove', (e) => {
    if (firstPinElement) {
      if (!activeWireLine) {
        activeWireLine = document.createElementNS("http://www.w3.org/2000/svg", "path")
        activeWireLine.setAttribute("stroke", "#ff9900") // Orange for active drawing
        activeWireLine.setAttribute("stroke-width", "3")
        activeWireLine.setAttribute("stroke-dasharray", "5,5")
        activeWireLine.setAttribute("fill", "none")
        activeWireLine.style.pointerEvents = "none"
        wireLayer.appendChild(activeWireLine)
      }
      
      const rect1 = firstPinElement.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      const x1 = rect1.left - canvasRect.left + 6
      const y1 = rect1.top - canvasRect.top + 6
      const x2 = e.clientX - canvasRect.left
      const y2 = e.clientY - canvasRect.top
      
      const cpX = (x1 + x2) / 2
      activeWireLine.setAttribute("d", `M ${x1} ${y1} C ${cpX} ${y1}, ${cpX} ${y2}, ${x2} ${y2}`)
    }
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

  item.innerHTML = getComponentHTML(type)

  canvas.appendChild(item)
  componentRegistry.push({
    id: item.dataset.componentId,
    type,
    element: item
  })
    item.addEventListener('click', (e) => {
      e.stopPropagation()
      if (selectedComponent) selectedComponent.classList.remove('selected')
      selectedComponent = item
      selectedComponent.classList.add('selected')
      
      if (selectedWire) {
        selectedWire = null
        renderWires()
      }
      
      const safetyStatus = validateCircuit(getConnections())
    propertiesContent.innerHTML = renderProperties({
      type,
      id: item.dataset.componentId,
      pinCount: item.querySelectorAll('.pin').length,
      scale: item.dataset.scale || 1
    }, safetyStatus)
    attachPropertiesListeners(item)
    propertiesPanel.classList.remove('hidden')
  })

  const pins = item.querySelectorAll('.pin')
  pins.forEach(pin => {
    pin.addEventListener('mousedown', (event) => {
      event.stopPropagation()
    })
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

      wireObjects.push({ pin1: firstPinElement, pin2: pin })

        renderWires()
        firstPinElement.style.background = ''
        firstPinElement = null
        
        if (activeWireLine) {
          activeWireLine.remove()
          activeWireLine = null
        }

      console.clear()
      console.log("Connections:", getConnections())
      console.log("Graph:", buildGraph(getConnections()))
      const validation = validateCircuit(getConnections())
      console.log("Validation:", validation)
      if (selectedComponent) {
        const type = componentRegistry.find(c => c.id === selectedComponent.dataset.componentId)?.type || "Unknown";
        propertiesContent.innerHTML = renderProperties({
          type,
          id: selectedComponent.dataset.componentId,
          pinCount: selectedComponent.querySelectorAll('.pin').length,
          scale: selectedComponent.dataset.scale || 1
        }, validation)
        attachPropertiesListeners(selectedComponent)
      }
    })
  })

  let isDragging = false
  let dragOffsetX = 0
  let dragOffsetY = 0
  
  item.addEventListener('mousedown', (e) => {
    isDragging = true
    const itemRect = item.getBoundingClientRect()
    dragOffsetX = e.clientX - itemRect.left
    dragOffsetY = e.clientY - itemRect.top
  })
  
  document.addEventListener('mouseup', () => {
    isDragging = false
  })
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return
  
    const rect = canvas.getBoundingClientRect()
    let newLeft = e.clientX - rect.left - dragOffsetX
    let newTop = e.clientY - rect.top - dragOffsetY
    
    // Snap to 20px grid
    newLeft = Math.round(newLeft / 20) * 20
    newTop = Math.round(newTop / 20) * 20
    
    item.style.left = `${newLeft}px`
    item.style.top = `${newTop}px`
    renderWires()
  })
})

function renderWires() {
  window.renderWires = renderWires; // Expose for simulator
  wireLayer.innerHTML = ""
  
  const getWireColor = (pA, pB) => {
    pA = (pA || "").toLowerCase()
    pB = (pB || "").toLowerCase()
    if (pA.includes("5v") || pA.includes("3.3v") || pA.includes("vcc") || pA.includes("vin") || pB.includes("5v") || pB.includes("3.3v") || pB.includes("vcc") || pB.includes("vin") || pA === "v+" || pB === "v+") return "#ff3333" // Red
    if (pA.includes("gnd") || pA.includes("ground") || pA === "-" || pB.includes("gnd") || pB.includes("ground") || pB === "-") return "#333333" // Black
    return "#00cc66" // Green for signal
  }

  wireObjects.forEach((wire, index) => {
      const rect1 = wire.pin1.getBoundingClientRect()
      const rect2 = wire.pin2.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
  
      const x1 = rect1.left - canvasRect.left + 6
      const y1 = rect1.top - canvasRect.top + 6
      const x2 = rect2.left - canvasRect.left + 6
      const y2 = rect2.top - canvasRect.top + 6
      
      const isSelected = selectedWire === wire
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      
      // Calculate bezier curve for a nicer wire look
      const cpX = (x1 + x2) / 2
      path.setAttribute("d", `M ${x1} ${y1} C ${cpX} ${y1}, ${cpX} ${y2}, ${x2} ${y2}`)
      path.setAttribute("fill", "none")
      
      if (isSelected) {
        path.setAttribute("stroke", "#ff3366")
        path.setAttribute("stroke-width", "5")
      } else {
        const p1Name = wire.pin1.dataset.pin
        const p2Name = wire.pin2.dataset.pin
        path.setAttribute("stroke", getWireColor(p1Name, p2Name))
        path.setAttribute("stroke-width", "3")
      }
      
      path.style.cursor = "pointer"
      path.style.pointerEvents = "auto"
      
      path.addEventListener("click", (e) => {
        e.stopPropagation()
        if (selectedComponent) {
          selectedComponent.classList.remove('selected')
          selectedComponent = null
          propertiesPanel.classList.add('hidden')
        }
        selectedWire = wire
        renderWires()
      })
      
      wireLayer.appendChild(path)
    })
  }
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Delete') {
      if (selectedComponent) {
        deleteComponent(selectedComponent, wireObjects, renderWires)
        selectedComponent = null
        propertiesPanel.classList.add('hidden')
        propertiesContent.innerHTML = `<p>Select Component</p>`
      } else if (selectedWire) {
        const idx = wireObjects.indexOf(selectedWire)
        if (idx > -1) {
          wireObjects.splice(idx, 1)
          selectedWire = null
          renderWires()
          // Update properties validation after wire deletion
          propertiesPanel.classList.add('hidden')
          propertiesContent.innerHTML = `<p>Select Component</p>`
        }
      }
    }
  })