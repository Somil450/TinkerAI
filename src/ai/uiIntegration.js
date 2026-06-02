// TinkerAI UI Integration
import { safetyEngine, circuitGenerator, autoCorrectionEngine, whatIfAnalyzer, expandedRegistry, projectBuilder } from './index.js'

export class AIUIManager {
    constructor(circuit) {
        this.circuit = circuit
        this.monitoringInterval = null
    }

    createAIPanel() {
        const panel = document.createElement('div')
        panel.id = 'ai-panel'
        panel.className = 'ai-panel'
        panel.innerHTML = this.buildHTML()
        return panel
    }

    buildHTML() {
        let html = '<div class="ai-header"><h3>🤖 TinkerAI</h3><button id="toggle-ai" class="toggle-btn">▼</button></div>'
        html += '<div class="ai-content">'
        html += '<div class="ai-section"><h4>⚠️ Safety</h4><div id="safety-status">Ready...</div></div>'
        html += '<div class="ai-section"><h4>🎯 Generate Circuit</h4>'
        html += '<input type="text" id="nlp-input" placeholder="E.g., Blink LED" class="nlp-input">'
        html += '<button id="generate-btn" class="generate-btn">Generate</button>'
        html += '<div id="generation-output" style="display:none;"></div></div>'
        html += '<div class="ai-section" id="correction-section" style="display:none;"><h4>💡 Fixes</h4><div id="fixes-list"></div></div>'
        html += '<div class="ai-section"><h4>🔍 Components</h4>'
        html += '<input type="text" id="component-search" placeholder="Search..." class="component-search">'
        html += '<div id="search-results"></div></div>'
        html += '<div class="ai-section"><h4>🔮 What-If</h4>'
        html += '<button class="whatif-btn" data-scenario="voltage">Change Voltage</button>'
        html += '<button class="whatif-btn" data-scenario="component">Replace Component</button>'
        html += '<div id="whatif-results"></div></div>'
        html += '<div class="ai-section"><h4>📚 Projects</h4><div id="projects-list"></div>'
        html += '<button id="show-all-projects-btn" class="projects-btn">View All (12+)</button>'
        html += '<div id="projects-modal" style="display:none;" class="projects-modal">'
        html += '<div class="projects-modal-content"><span id="close-projects-modal" class="close-modal">&times;</span>'
        html += '<h3>Projects</h3><div id="all-projects" class="all-projects-grid"></div></div></div></div>'
        html += '</div>'
        return html
    }

    static createStyles() {
        const style = document.createElement('style')
        style.textContent = `.ai-panel{position:fixed;right:0;top:0;width:350px;height:100vh;background:#1a1a2e;color:#e0e0e0;box-shadow:-2px 0 10px rgba(0,0,0,0.3);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;z-index:1000;overflow-y:auto;transition:right 0.3s ease}.ai-panel.collapsed{right:-320px}.ai-header{display:flex;justify-content:space-between;align-items:center;background:#0f3460;padding:15px;border-bottom:2px solid #00ff88}.ai-header h3{margin:0;font-size:16px}.toggle-btn{background:none;border:none;color:#00ff88;font-size:18px;cursor:pointer;padding:5px 10px}.toggle-btn:hover{background:rgba(0,255,136,0.1);border-radius:4px}.ai-content{padding:15px}.ai-section{margin-bottom:20px;padding:12px;background:#16213e;border-left:3px solid #00ff88;border-radius:4px}.ai-section h4{margin:0 0 10px 0;font-size:14px;color:#00ff88}#safety-status{padding:10px;background:#0f1419;border-radius:3px;font-size:12px}.nlp-input,.component-search{width:100%;padding:8px;background:#0f1419;border:1px solid #00ff88;border-radius:3px;color:#e0e0e0;font-size:12px;margin-bottom:8px}.nlp-input:focus,.component-search:focus{outline:none;box-shadow:0 0 8px rgba(0,255,136,0.3)}.generate-btn,.projects-btn{padding:8px 12px;background:#00ff88;color:#000;border:none;border-radius:3px;font-weight:bold;cursor:pointer;font-size:12px;width:100%;transition:all 0.3s}.generate-btn:hover,.projects-btn:hover{background:#00dd77}.whatif-btn{padding:8px;background:#16213e;color:#00ff88;border:1px solid #00ff88;border-radius:3px;cursor:pointer;font-size:11px;font-weight:bold;margin:5px 0;width:100%;transition:all 0.3s}.whatif-btn:hover{background:#00ff88;color:#000}#search-results{max-height:250px;overflow-y:auto}.component-card{background:#0f1419;padding:8px;border-radius:3px;border:1px solid #00ff88;font-size:11px;margin:5px 0}.component-card h5{margin:0 0 3px 0;color:#00ff88}.projects-modal{position:fixed;z-index:2000;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:none}.projects-modal-content{background:#1a1a2e;margin:5% auto;padding:20px;border-radius:8px;border:2px solid #00ff88;max-width:800px;max-height:80vh;overflow-y:auto;position:relative}.close-modal{position:absolute;right:15px;top:10px;font-size:28px;font-weight:bold;color:#00ff88;cursor:pointer}.all-projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px;margin-top:15px}.project-template{background:#16213e;border:1px solid #00ff88;padding:12px;border-radius:5px;cursor:pointer;transition:all 0.3s}.project-template:hover{background:#0f3460;box-shadow:0 0 10px rgba(0,255,136,0.3)}.project-template h4{margin:0 0 5px 0;color:#00ff88;font-size:14px}.project-load-btn{width:100%;padding:5px;background:#00ff88;color:#000;border:none;border-radius:3px;font-weight:bold;cursor:pointer;font-size:10px;margin-top:8px}.project-load-btn:hover{background:#00dd77}.ai-panel::-webkit-scrollbar{width:6px}.ai-panel::-webkit-scrollbar-track{background:#16213e}.ai-panel::-webkit-scrollbar-thumb{background:#00ff88;border-radius:3px}@media(max-width:768px){.ai-panel{width:100%;right:-100%}}`
        return style
    }

    attachEventListeners(panelElement, circuitState) {
        panelElement.querySelector('#toggle-ai').addEventListener('click', () => {
            panelElement.classList.toggle('collapsed')
            panelElement.querySelector('#toggle-ai').textContent = panelElement.classList.contains('collapsed') ? '▲' : '▼'
        })

        panelElement.querySelector('#generate-btn').addEventListener('click', () => {
            const description = panelElement.querySelector('#nlp-input').value
            if (description.trim()) {
                const result = circuitGenerator.generateFromDescription(description)
                const output = panelElement.querySelector('#generation-output')
                output.style.display = 'block'
                output.innerHTML = result.success ? '<strong style="color:#00ff88;">✅ Circuit Generated!</strong>' : '<strong>❌ Error: ' + result.error + '</strong>'
            }
        })

        panelElement.querySelector('#component-search').addEventListener('keyup', (e) => {
            const query = e.target.value
            if (query.trim()) {
                const results = expandedRegistry.search(query).slice(0, 5)
                const resultsDiv = panelElement.querySelector('#search-results')
                resultsDiv.innerHTML = results.map(comp => '<div class="component-card"><h5>' + comp.name + '</h5><div>$' + comp.price + '</div></div>').join('')
            }
        })

        panelElement.querySelectorAll('.whatif-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scenario = btn.dataset.scenario
                const resultsDiv = panelElement.querySelector('#whatif-results')
                resultsDiv.innerHTML = 'Analyzing ' + scenario + '...'
            })
        })

        const projects = projectBuilder.listProjects().slice(0, 3)
        panelElement.querySelector('#projects-list').innerHTML = projects.map(p => '<div class="ai-section"><h5>' + p.name + '</h5><div>' + p.time + '</div></div>').join('')

        panelElement.querySelector('#show-all-projects-btn').addEventListener('click', () => {
            panelElement.querySelector('#projects-modal').style.display = 'block'
            const allProjects = projectBuilder.listProjects()
            panelElement.querySelector('#all-projects').innerHTML = allProjects.map(p => '<div class="project-template"><h4>' + p.name + '</h4><p>' + p.description + '</p><button class="project-load-btn" onclick="window.loadProject(\'' + p.id + '\')">Load</button></div>').join('')
        })

        panelElement.querySelector('#close-projects-modal').addEventListener('click', () => {
            panelElement.querySelector('#projects-modal').style.display = 'none'
        })
    }

    updateSafetyDisplay(circuit, panelElement) {
        const safety = safetyEngine.analyze(circuit)
        const statusDiv = panelElement.querySelector('#safety-status')
        let text = safety.critical.length > 0 ? '🚨 ' + safety.critical.length + ' issues' : safety.warnings.length > 0 ? '⚠️ ' + safety.warnings.length + ' warnings' : '✅ Safe'
        statusDiv.innerHTML = '<strong>' + text + '</strong>'
    }

    startMonitoring(circuit, panelElement) {
        this.updateSafetyDisplay(circuit, panelElement)
        this.monitoringInterval = setInterval(() => {
            this.updateSafetyDisplay(circuit, panelElement)
        }, 2000)
    }

    stopMonitoring() {
        if (this.monitoringInterval) clearInterval(this.monitoringInterval)
    }
}

export function initializeAIUI(circuitState) {
    document.head.appendChild(AIUIManager.createStyles())
    const aiManager = new AIUIManager(circuitState)
    const panel = aiManager.createAIPanel()
    document.body.appendChild(panel)
    aiManager.attachEventListeners(panel, circuitState)
    aiManager.startMonitoring(circuitState, panel)

    window.loadProject = (projectId) => {
        const project = projectBuilder.getTemplate(projectId)
        if (project) {
            const bom = projectBuilder.generateBOM(projectId)
            alert('✅ ' + project.name + '\n\nCost: $' + bom.totalCost.toFixed(2))
        }
    }

    return aiManager
}
