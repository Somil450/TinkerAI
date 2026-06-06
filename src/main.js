import './style.css'
import { isValidConnection } from './engine/pinRules.js'
import { renderSidebar } from './ui/sidebar.js'
import { selectPin, getConnections } from './engine/wires.js'
import { buildGraph } from './engine/graph.js'
import { validateCircuit } from './engine/validator.js'
import { renderProperties, renderWireProperties } from './ui/propertiesPanel.js'
import { deleteComponent } from './engine/deleteComponent.js'
import { componentRegistry } from './engine/componentRegistry.js'
import { getComponentHTML } from './ui/svgRenderer.js'
// Force HMR reload to ensure CSS updates propagate
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
import { circuitChatAI } from './ai/circuitChatAI.js'
import { getComponentVisual } from './ui/componentSvgCatalog.js'
import { getSvgUrl } from './ui/componentSvg.js'
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
      <button class="nav-btn outline" id="clear-board-btn" title="Delete all components and wires">Clear Board</button>
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
          <div style="display: flex; gap: 12px; align-items: center;">
            <button id="delete-selected" title="Delete selected item" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
            <button id="close-properties">&times;</button>
          </div>
        </div>
        <div class="properties-content" id="properties-content">
          <p>Select Component</p>
        </div>
      </div>
    </div>

    <!-- AI Chat FAB & Panel -->
    <button id="ai-chat-fab" title="Ask AI about your circuit" aria-label="Open AI Chat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span class="fab-label">AI Chat</span>
    </button>
    <div id="ai-chat-panel" class="ai-chat-panel hidden">
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-avatar">🤖</div>
          <div>
            <div class="ai-chat-title">TinkerAI Assistant</div>
            <div class="ai-chat-subtitle">Circuit & wiring expert · Self-trained</div>
          </div>
        </div>
        <button id="ai-chat-close" class="ai-chat-close">&times;</button>
      </div>
      <div class="ai-chat-messages" id="ai-chat-messages">
        <div class="ai-msg ai">
          <div class="ai-msg-bubble">
            👋 Hi! I'm <strong>TinkerAI</strong>, your built-in circuit AI.<br><br>
            I give <strong>exact pin-to-pin wiring</strong> for any components and can design full systems. Try:
          </div>
        </div>
      </div>
      <div class="ai-chat-chips" id="ai-chat-chips">
        <button class="ai-chip" data-msg="Make a 4WD robot car">🚗 Make a car</button>
        <button class="ai-chip" data-msg="Connect ESP32 to LCD display">🖥️ ESP32 + LCD</button>
        <button class="ai-chip" data-msg="Connect ESP32 to DHT22 and OLED">🌡️ ESP32 + DHT22</button>
        <button class="ai-chip" data-msg="Make a weather station">🌤️ Weather station</button>
        <button class="ai-chip" data-msg="Connect L298N motor driver to Arduino">⚙️ Motor driver</button>
        <button class="ai-chip" data-msg="Connect HC-SR04 ultrasonic sensor to Arduino">📡 Ultrasonic</button>
        <button class="ai-chip" data-msg="What is on my canvas">🔍 My canvas</button>
        <button class="ai-chip" data-msg="Connect all components on my canvas">🔌 Wire all</button>
      </div>
      <div class="ai-chat-input-row">
        <input id="ai-chat-input" class="ai-chat-input" type="text" placeholder="e.g. connect ESP32 to LCD and DHT22..." />
        <button id="ai-chat-send" class="ai-chat-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
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
        <button id="close-sidebar-mobile" class="close-btn" style="display: none;">&times;</button>
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

document.getElementById('delete-selected').addEventListener('click', () => {
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
      propertiesPanel.classList.add('hidden')
      propertiesContent.innerHTML = `<p>Select Component</p>`
    }
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

const closeSidebarMobileBtn = document.getElementById('close-sidebar-mobile');
if (closeSidebarMobileBtn) {
  closeSidebarMobileBtn.addEventListener('click', () => {
    rightSidebar.classList.add('hidden');
    sidebarResizer.classList.add('hidden');
  });
}

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

// ── Clear Board ──
const clearBoardBtn = document.getElementById('clear-board-btn');
if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to completely clear the board?")) {
            document.querySelectorAll('.placed-component').forEach(el => el.remove());
            wireObjects.length = 0;
            componentRegistry.length = 0;
            canvas.querySelectorAll('.wire-segment, .wire-waypoint').forEach(el => el.remove());
            renderWires();
            if (isSimulating) {
                document.getElementById('start-sim-btn').click(); // Stop simulation
            }
            if (selectedComponent) {
                selectedComponent = null;
                propertiesPanel.classList.add('hidden');
            }
        }
    });
}

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
  let activeWaypoints = []
  
  const wireObjects = []

components.forEach(comp => {
  comp.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', comp.dataset.type)
    
    // Create actual size drag image
    const type = comp.dataset.type
    const visual = getComponentVisual(type)
    const url = getSvgUrl(type)
    
    if (visual && url) {
      const dragImg = new Image()
      dragImg.src = url
      dragImg.style.width = visual.width + 'px'
      dragImg.style.height = visual.height + 'px'
      dragImg.style.position = 'absolute'
      dragImg.style.top = '-9999px'
      document.body.appendChild(dragImg)
      
      e.dataTransfer.setDragImage(dragImg, visual.width / 2, visual.height / 2)
      
      setTimeout(() => {
        if (dragImg.parentNode) dragImg.parentNode.removeChild(dragImg)
      }, 100)
    }
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
      
      // Add waypoint to active wire
      if (firstPinElement) {
        const rect = canvas.getBoundingClientRect()
        activeWaypoints.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    }
  })

  // Escape to cancel wire drawing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && firstPinElement) {
      firstPinElement.style.background = ''
      firstPinElement = null
      activeWaypoints = []
      if (activeWireLine) {
        activeWireLine.remove()
        activeWireLine = null
      }
    }
  })

  // Active wire drawing preview
  canvas.addEventListener('mousemove', (e) => {
    if (firstPinElement) {
      if (!activeWireLine) {
        activeWireLine = document.createElementNS("http://www.w3.org/2000/svg", "path")
        activeWireLine.setAttribute("stroke", "#38bdf8") // Bright blue for active drawing
        activeWireLine.setAttribute("stroke-width", "4")
        activeWireLine.setAttribute("stroke-dasharray", "6,6")
        activeWireLine.setAttribute("stroke-linecap", "round")
        activeWireLine.setAttribute("fill", "none")
        activeWireLine.style.filter = "drop-shadow(0 0 5px rgba(56,189,248,0.6))"
        activeWireLine.style.pointerEvents = "none"
        wireLayer.appendChild(activeWireLine)
      }
      
      const rect1 = firstPinElement.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      const x1 = rect1.left - canvasRect.left + canvas.scrollLeft + 7
      const y1 = rect1.top - canvasRect.top + canvas.scrollTop + 7
      const x2 = e.clientX - canvasRect.left + canvas.scrollLeft
      const y2 = e.clientY - canvasRect.top + canvas.scrollTop
      
      let d = `M ${x1} ${y1} `;
      if (activeWaypoints.length > 0) {
        activeWaypoints.forEach(wp => d += `L ${wp.x} ${wp.y} `)
        d += `L ${x2} ${y2}`
      } else {
        const dist = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
        const droop = Math.min(dist * 0.4, 150);
        d = `M ${x1} ${y1} C ${x1} ${y1 + droop}, ${x2} ${y2 + droop}, ${x2} ${y2}`;
      }
      
      activeWireLine.setAttribute("d", d)
    }
  })

  window.placeComponent = function(type, x, y) {
    componentCounter++

    const item = document.createElement('div')
    item.className = 'placed-component'
    item.dataset.componentId = `${type}_${componentCounter}`
    item.style.left = `${x}px`
    item.style.top = `${y}px`
    
    // Resume existing logic


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

      let defColor = "#00cc66" // Green for signal
      const pinALower = firstPinElement.dataset.pin.toLowerCase()
      const pinBLower = pin.dataset.pin.toLowerCase()
      const isPower = (p) => p.includes("5v") || p.includes("3.3v") || p.includes("vcc") || p.includes("vin") || p.includes("vdd") || p === "v+";
      const isGround = (p) => p.includes("gnd") || p.includes("ground") || p.includes("vss") || p === "-";
      if (isPower(pinALower) || isPower(pinBLower)) defColor = "#ff3333" // Red
      if (isGround(pinALower) || isGround(pinBLower)) defColor = "#333333" // Black

      wireObjects.push({ 
        pin1: firstPinElement, 
        pin2: pin,
        waypoints: [...activeWaypoints],
        color: defColor
      })

        renderWires()
        firstPinElement.style.background = ''
        firstPinElement = null
        activeWaypoints = []
        
        if (activeWireLine) {
          activeWireLine.remove()
          activeWireLine = null
        }

      console.clear()
      console.log("Connections:", getConnections())
      console.log("Graph:", buildGraph(getConnections()))
      const validation = validateCircuit(getConnections())
      console.log("Validation:", validation)
      
      if (!validation.valid) {
        window.showToast(`🚨 HAZARD: ${validation.message}`, 'error')
        // Highlight the latest wire in red
        const latestWire = wireObjects[wireObjects.length - 1]
        if (latestWire) {
          latestWire.color = '#FF1744'
          renderWires()
        }
      } else if (validation.warnings && validation.warnings.length > 0) {
        window.showToast(`⚠️ Warning: ${validation.warnings[0].message}`, 'warn')
      }

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
  
  item.addEventListener('touchstart', (e) => {
    isDragging = true
    const touch = e.touches[0]
    const itemRect = item.getBoundingClientRect()
    dragOffsetX = touch.clientX - itemRect.left
    dragOffsetY = touch.clientY - itemRect.top
  }, {passive: true})
  
  document.addEventListener('mouseup', () => {
    isDragging = false
  })

  document.addEventListener('touchend', () => {
    isDragging = false
  })
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return
  
    const rect = canvas.getBoundingClientRect()
    let newLeft = e.clientX - rect.left - dragOffsetX + canvas.scrollLeft
    let newTop = e.clientY - rect.top - dragOffsetY + canvas.scrollTop
    
    // Snap to 20px grid
    newLeft = Math.round(newLeft / 20) * 20
    newTop = Math.round(newTop / 20) * 20
    
    item.style.left = `${newLeft}px`
    item.style.top = `${newTop}px`
    renderWires()
  })

  document.addEventListener('touchmove', e => {
    if (!isDragging) return
    e.preventDefault() // prevent page scroll while dragging
    const touch = e.touches[0]
  
    const rect = canvas.getBoundingClientRect()
    let newLeft = touch.clientX - rect.left - dragOffsetX + canvas.scrollLeft
    let newTop = touch.clientY - rect.top - dragOffsetY + canvas.scrollTop
    
    // Snap to 20px grid
    newLeft = Math.round(newLeft / 20) * 20
    newTop = Math.round(newTop / 20) * 20
    
    item.style.left = `${newLeft}px`
    item.style.top = `${newTop}px`
    renderWires()
  }, {passive: false})
  } // End of placeComponent

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (!type) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + canvas.scrollLeft;
    const y = e.clientY - rect.top + canvas.scrollTop;
    placeComponent(type, Math.round(x / 20) * 20, Math.round(y / 20) * 20);
  });
document.getElementById('component-list').addEventListener('click', (e) => {
  const comp = e.target.closest('.component');
  if (comp) {
    const type = comp.dataset.type;
    const canvasRect = canvas.getBoundingClientRect();
    const x = Math.round((canvasRect.width / 2 - 50) / 20) * 20;
    const y = Math.round((canvasRect.height / 2 - 50) / 20) * 20;
    placeComponent(type, x, y);

    // On mobile, automatically close the sidebar after adding
    if (window.innerWidth <= 1024) {
      rightSidebar.classList.add('hidden');
      sidebarResizer.classList.add('hidden');
    }
  }
});

function renderWires() {
  window.renderWires = renderWires; // Expose for simulator
  wireLayer.style.width = Math.max(canvas.clientWidth, canvas.scrollWidth) + 'px';
  wireLayer.style.height = Math.max(canvas.clientHeight, canvas.scrollHeight) + 'px';
  wireLayer.innerHTML = ""

  wireObjects.forEach((wire, index) => {
      const rect1 = wire.pin1.getBoundingClientRect()
      const rect2 = wire.pin2.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
  
      const x1 = rect1.left - canvasRect.left + canvas.scrollLeft + 6
      const y1 = rect1.top - canvasRect.top + canvas.scrollTop + 6
      const x2 = rect2.left - canvasRect.left + canvas.scrollLeft + 6
      const y2 = rect2.top - canvasRect.top + canvas.scrollTop + 6
      
      const isSelected = selectedWire === wire
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      
      let d = `M ${x1} ${y1} `;
      if (wire.waypoints && wire.waypoints.length > 0) {
        wire.waypoints.forEach(wp => d += `L ${wp.x} ${wp.y} `)
        d += `L ${x2} ${y2}`
      } else {
        const dist = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
        const droop = Math.min(dist * 0.4, 150);
        d = `M ${x1} ${y1} C ${x1} ${y1 + droop}, ${x2} ${y2 + droop}, ${x2} ${y2}`;
      }
      
      path.setAttribute("d", d)
      path.setAttribute("fill", "none")
      path.setAttribute("stroke-linecap", "round")
      
      if (isSelected) {
        path.setAttribute("stroke", "#ff3366")
        path.setAttribute("stroke-width", "6")
        path.style.filter = "drop-shadow(0 0 8px rgba(255,51,102,0.6))"
      } else {
        path.setAttribute("stroke", wire.color || "#0ea5e9")
        path.setAttribute("stroke-width", "4")
        path.style.filter = "drop-shadow(0 4px 4px rgba(0,0,0,0.5))"
      }
      
      path.style.cursor = "pointer"
      path.style.pointerEvents = "auto"
      
      path.addEventListener("click", (e) => {
        e.stopPropagation()
        if (selectedComponent) {
          selectedComponent.classList.remove('selected')
          selectedComponent = null
        }
        selectedWire = wire
        renderWires()
        
        propertiesContent.innerHTML = renderWireProperties(wire)
        propertiesPanel.classList.remove('hidden')
        
        const colorPicker = document.getElementById('wire-color')
        if (colorPicker) {
          colorPicker.addEventListener('change', (evt) => {
             wire.color = evt.target.value
             renderWires()
          })
        }
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
    } else if (selectedComponent && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault() // Prevent page scrolling
      
      const step = e.shiftKey ? 20 : 5 // Snap by 20px if Shift is held, else 5px for fine-tuning
      let top = parseInt(selectedComponent.style.top, 10) || 0
      let left = parseInt(selectedComponent.style.left, 10) || 0
      
      switch(e.key) {
        case 'ArrowUp': top -= step; break
        case 'ArrowDown': top += step; break
        case 'ArrowLeft': left -= step; break
        case 'ArrowRight': left += step; break
      }
      
      selectedComponent.style.top = `${top}px`
      selectedComponent.style.left = `${left}px`
      renderWires() // update wires while moving
    }
  })

  // ── AI Chat ────────────────────────────────────────────────────────────────
  const chatFab = document.getElementById('ai-chat-fab')
  const chatPanel = document.getElementById('ai-chat-panel')
  const chatClose = document.getElementById('ai-chat-close')
  const chatInput = document.getElementById('ai-chat-input')
  const chatSend = document.getElementById('ai-chat-send')
  const chatMessages = document.getElementById('ai-chat-messages')

  function renderMarkdown(text) {
    return text
      .replace(/```([\s\S]*?)```/g, (m, code) => `<pre><code>${code.replace(/^\w+\n/, '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      .replace(/`([^`]+)`/g, (m, code) => `<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^---$/gm, '<hr>')
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^\|[-|:\s]+\|\r?\n/gm, '') // Strip markdown table dividers like |---|---| and their newline
      .replace(/^\| (.+) \|$/gm, m => {
        const cells = m.slice(2, -2).split(' | ').map(c => `<td>${c}</td>`).join('')
        return `<tr>${cells}</tr>`
      })
      .replace(/(<tr>.*<\/tr>\r?\n?)+/g, m => `<table>${m.replace(/\r?\n/g, '')}</table>`)
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\r?\n?)+/g, m => `<ul>${m.replace(/\r?\n/g, '')}</ul>`)
      .replace(/(<\/(h3|h4|table|ul|pre)>|<hr>)\r?\n/g, '$1')
      .replace(/\n/g, '<br>')
  }

  function appendMessage(role, text) {
    const div = document.createElement('div')
    div.className = `ai-msg ${role}`
    const bubble = document.createElement('div')
    bubble.className = 'ai-msg-bubble'
    
    let html = renderMarkdown(text)
    if (/(?:<!--|&lt;!--)\s*ACTION:\s*(\{[\s\S]*?\})\s*(?:-->|--&gt;)/.test(html) && !html.includes('ai-action-btn')) {
        html += '\n<br><button class="ai-action-btn" onclick="window.executeAIAction(this.parentElement)">🚀 Generate Circuit</button>'
    }
    
    bubble.innerHTML = html
    div.appendChild(bubble)
    chatMessages.appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function appendTypingIndicator() {
    const div = document.createElement('div')
    div.className = 'ai-msg ai'
    div.id = 'ai-typing'
    div.innerHTML = '<div class="ai-msg-bubble ai-typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>'
    chatMessages.appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
    return div
  }

  function sendChatMessage() {
    const msg = chatInput.value.trim()
    if (!msg) return
    chatInput.value = ''
    appendMessage('user', msg)
    const typing = appendTypingIndicator()
    
    Promise.resolve(circuitChatAI.respond(msg)).then(reply => {
      typing.remove()
      appendMessage('ai', reply)
    }).catch(err => {
      typing.remove()
      appendMessage('ai', 'Error: ' + err.message)
    })
  }

  window.executeAIAction = function(container) {
    try {
      const html = container.innerHTML;
      const match = html.match(/(?:<!--|&lt;!--)\s*ACTION:\s*(\{[\s\S]*?\})\s*(?:-->|--&gt;)/);
      if (!match) {
        window.showToast("Could not find generation plan", "error");
        return;
      }
      
      const plan = JSON.parse(match[1]);
      
      // Auto-inject missing components from wiring to ensure they are placed
      if (plan.wiring) {
          plan.wiring.forEach(w => {
              [w.fromComp, w.toComp].forEach(compId => {
                  if (!compId || compId === 'mcu') return;
                  const baseId = compId.replace(/_\d+$/, '');
                  
                  // Auto-correct common hallucinations
                  let correctedId = baseId;
                  if (baseId.toLowerCase().includes("motor") && baseId.toLowerCase().includes("driver")) correctedId = "l298n";
                  
                  if (!plan.components.includes(correctedId)) {
                      plan.components.push(correctedId);
                  }
                  
                  // Fix the wiring payload to point to the corrected ID if needed
                  if (compId === w.fromComp && correctedId !== baseId) w.fromComp = correctedId + "_0";
                  if (compId === w.toComp && correctedId !== baseId) w.toComp = correctedId + "_0";
              });
          });
      }
      
      // Close AI chat panel on mobile so the user can see the circuit being generated
      if (window.innerWidth <= 768) {
        const chatPanel = document.getElementById('ai-chat-panel');
        const chatFab = document.getElementById('ai-chat-fab');
        if (chatPanel) chatPanel.classList.add('hidden');
        if (chatFab) chatFab.classList.remove('hidden');
      }
      
      // 1. Clear the canvas and internal registries
      document.querySelectorAll('.placed-component').forEach(el => el.remove());
      wireObjects.length = 0;
      componentRegistry.length = 0;
      
      // Resetting the canvas completely.
      canvas.querySelectorAll('.wire-segment, .wire-waypoint').forEach(el => el.remove());
      renderWires();
      
      const addedComps = {}; // id from plan -> DOM element
      
      // 2. Place MCU in the center
      const canvasRect = canvas.getBoundingClientRect();
      const centerX = Math.round((canvasRect.width / 2) / 20) * 20;
      const centerY = Math.round((canvasRect.height / 2) / 20) * 20;
      
      placeComponent(plan.mcu, centerX - 100, centerY - 100);
      addedComps[plan.mcu] = componentRegistry[componentRegistry.length - 1].element;
      
      // 3. Place other components radially around the MCU
      // Calculate dynamic radius to ensure all components fit entirely inside the screen
      const padding = 110; // Account for component sizes
      const maxRadius = 350;
      const radiusX = Math.max((canvasRect.width / 2) - padding, 90);
      const radiusY = Math.max((canvasRect.height / 2) - padding, 90);
      const radius = Math.min(radiusX, radiusY, maxRadius);
      
      const angleStep = (2 * Math.PI) / plan.components.length;
      const compCounts = {};
      
      // Filter out the MCU itself if the AI mistakenly included it in the components array
      const filteredComponents = plan.components.filter(c => c.replace(/_\d+$/, '') !== plan.mcu);
      
      filteredComponents.forEach((rawCompId, idx) => {
        // Robustness: If the AI accidentally includes the index in the components array, strip it
        const compId = rawCompId.replace(/_\d+$/, '');
        const angle = idx * angleStep;
        // Snap to 20px grid
        const compX = Math.round((centerX + radius * Math.cos(angle)) / 20) * 20;
        const compY = Math.round((centerY + radius * Math.sin(angle)) / 20) * 20;
        
        placeComponent(compId, compX - 50, compY - 50);
        if (!compCounts[compId]) compCounts[compId] = 0;
        const cIdx = compCounts[compId]++;
        addedComps[`${compId}_${cIdx}`] = componentRegistry[componentRegistry.length - 1].element;
      });
      
      // 4. Draw wires with orthogonal routing (Animated)
      const finalizeGeneration = () => {
        // Auto-validate for safety
        const validation = validateCircuit(getConnections());
        if (!validation.valid) {
          window.showToast(`🚨 AI Generated Circuit Hazard: ${validation.message}`, 'error');
        }
        
        // 5. Fill Code Editor
        if (plan.code) {
          const codeEditor = document.getElementById('code-editor');
          if (codeEditor) {
            codeEditor.value = plan.code.trim();
          }
        }
        
        window.showToast("Circuit generated!", "success");
        
        // Attempt to auto-run simulation after 500ms
        setTimeout(() => {
          const runBtn = document.getElementById('start-sim-btn');
          if (runBtn) {
             runBtn.click();
          }
        }, 500);
      };

      if (plan.wiring && plan.wiring.length > 0) {
        let wIdx = 0;
        
        function drawNextWire() {
           if (wIdx >= plan.wiring.length) {
              // After the last wire begins animating, wait for it to finish
              setTimeout(() => {
                renderWires(); // solidify wire paths using standard rendering
                finalizeGeneration();
              }, 1200); // Wait 1.2s for the last animation to complete
              return;
           }
           
           const w = plan.wiring[wIdx];
           let el1, el2;
           
           // Old legacy schema fallback support
           if (w.target && w.pin && w.component) {
               el1 = addedComps[plan.mcu];
               el2 = addedComps[`${w.component}_${w.compIndex}`];
               w.fromPin = w.target;
               w.toPin = w.pin;
           } else {
               // New point-to-point schema
               const getEl = (compId) => {
                   if (!compId) return null;
                   if (compId === 'mcu' || compId === plan.mcu || compId === plan.mcu + '_0') return addedComps[plan.mcu];
                   return addedComps[compId] || addedComps[compId + "_0"] || addedComps[compId.replace(/_\d+$/, '')];
               };
               el1 = getEl(w.fromComp);
               el2 = getEl(w.toComp);
           }

           if (el1 && el2) {
              const pin1Id = w.fromPin.trim();
              const pin2Id = w.toPin.trim();
              
              function findPinFuzzy(el, pinQuery) {
                  if (!el || !pinQuery) return null;
                  const q = pinQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const pins = Array.from(el.querySelectorAll('.pin'));
                  
                  let match = pins.find(p => p.dataset.pin.toLowerCase() === pinQuery.toLowerCase());
                  if (match) return match;
                  
                  match = pins.find(p => p.dataset.pin.toLowerCase().replace(/[^a-z0-9]/g, '') === q);
                  if (match) return match;
                  
                  // Substring matching for hallucinated prefixes (e.g. "Motor Driver OUT1" -> matches "OUT1")
                  const sortedPins = [...pins].sort((a, b) => b.dataset.pin.length - a.dataset.pin.length);
                  match = sortedPins.find(p => pinQuery.toLowerCase().includes(p.dataset.pin.toLowerCase()));
                  if (match) return match;

                  
                  const aliases = {
                     'vcc': ['vdd', '5v', '3v3', 'vin', '+'],
                     'gnd': ['vss', '-', 'ground'],
                     'sda': ['d20', 'a4', 'sdi'],
                     'scl': ['d21', 'a5', 'sck']
                  };
                  if (aliases[q]) {
                      for (const alias of aliases[q]) {
                         match = pins.find(p => p.dataset.pin.toLowerCase().replace(/[^a-z0-9]/g, '') === alias);
                         if (match) return match;
                      }
                  }
                  
                  // Handle D vs GPIO prefix mapping
                  const dMatch = q.match(/^d(\d+)$/);
                  if (dMatch) {
                      const num = dMatch[1];
                      match = pins.find(p => p.dataset.pin.toLowerCase() === `gpio${num}`);
                      if (match) return match;
                  }
                  const gpioMatch = q.match(/^gpio(\d+)$/);
                  if (gpioMatch) {
                      const num = gpioMatch[1];
                      match = pins.find(p => p.dataset.pin.toLowerCase() === `d${num}`);
                      if (match) return match;
                  }
                  
                  match = pins.find(p => p.dataset.pin.toLowerCase().includes(pinQuery.toLowerCase()) || pinQuery.toLowerCase().includes(p.dataset.pin.toLowerCase()));
                  return match || null;
              }

              let pin1El = findPinFuzzy(el1, pin1Id);
              let pin2El = findPinFuzzy(el2, pin2Id);

              if (pin1El && pin2El) {
                const palette = [
                  "#0ea5e9", // sky blue
                  "#10b981", // emerald
                  "#f59e0b", // amber
                  "#8b5cf6", // violet
                  "#ec4899", // pink
                  "#14b8a6", // teal
                  "#f43f5e", // rose
                  "#a855f7", // purple
                  "#eab308"  // yellow
                ];
                let defColor = palette[wIdx % palette.length]; 
                
                const pin1Lower = pin1Id.toLowerCase();
                const pin2Lower = pin2Id.toLowerCase();
                const isPower = (p) => p.includes("5v") || p.includes("3.3v") || p.includes("vcc") || p.includes("vin") || p.includes("vdd") || p === "v+";
                const isGround = (p) => p.includes("gnd") || p.includes("ground") || p.includes("vss") || p === "-";
                
                if (isPower(pin1Lower) || isPower(pin2Lower)) defColor = "#ff3333";
                if (isGround(pin1Lower) || isGround(pin2Lower)) defColor = "#333333";
                
                // Calculate orthogonal waypoints to prevent messy overlaps
                const rect1 = pin1El.getBoundingClientRect();
                const rect2 = pin2El.getBoundingClientRect();
                const cRect = canvas.getBoundingClientRect();
                
                const x1 = rect1.left - cRect.left + canvas.scrollLeft + 6;
                const y1 = rect1.top - cRect.top + canvas.scrollTop + 6;
                const x2 = rect2.left - cRect.left + canvas.scrollLeft + 6;
                const y2 = rect2.top - cRect.top + canvas.scrollTop + 6;
                
                const waypoints = [];
                // Dynamic staggered orthogonal path based on wire index
                // Tighter spread to prevent wires from overflowing the board
                const staggerOffset = ((wIdx % 8) * 4) - 16;
                const midX = ((x1 + x2) / 2) + staggerOffset;
                
                waypoints.push({ x: midX, y: y1 });
                waypoints.push({ x: midX, y: y2 });
                
                wireObjects.push({
                   pin1: pin1El,
                   pin2: pin2El,
                   waypoints: waypoints,
                   color: defColor
                });

                // Create individual animated path
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                let d = `M ${x1} ${y1} `;
                waypoints.forEach(wp => d += `L ${wp.x} ${wp.y} `);
                d += `L ${x2} ${y2}`;
                
                path.setAttribute("d", d);
                path.setAttribute("fill", "none");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke", defColor);
                path.setAttribute("stroke-width", "4");
                path.classList.add("wire-animated");
                wireLayer.appendChild(path);
                
                const len = path.getTotalLength();
                path.style.setProperty('--wire-length', len);
              }
           }
           wIdx++;
           setTimeout(drawNextWire, 150); // Stagger the animation of each wire
        }
        
        drawNextWire();
      } else {
        finalizeGeneration();
      }
    } catch(err) {
      console.error(err);
      window.showToast("Failed to generate circuit", "error");
    }
  }
  chatFab.addEventListener('click', () => {
    chatPanel.classList.remove('hidden')
    chatInput.focus()
    chatFab.classList.add('hidden')
  })
  chatClose.addEventListener('click', () => {
    chatPanel.classList.add('hidden')
    chatFab.classList.remove('hidden')
  })
  chatSend.addEventListener('click', sendChatMessage)
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage() })

  // Suggestion chip clicks
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.dataset.msg
      if (!msg) return
      // Hide chip bar after first use
      const chipsBar = document.getElementById('ai-chat-chips')
      if (chipsBar) chipsBar.style.display = 'none'
      appendMessage('user', msg)
      const typing = appendTypingIndicator()
      
      Promise.resolve(circuitChatAI.respond(msg)).then(reply => {
        typing.remove()
        appendMessage('ai', reply)
      }).catch(err => {
        typing.remove()
        appendMessage('ai', 'Error: ' + err.message)
      })
    })
  })