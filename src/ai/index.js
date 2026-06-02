/**
 * TINKERAI AI ENGINES - UNIFIED INDEX
 * 
 * Central hub for all AI functionality
 * 
 * Usage:
 * import { safetyEngine, circuitGenerator, autoCorrectionEngine, whatIfAnalyzer } from './ai'
 */

export { SafetyEngine, safetyEngine } from './safetyEngine.js';
export { ComponentRegistry, componentRegistry } from './componentRegistry.js';
export { CircuitGenerator, circuitGenerator } from './circuitGenerator.js';
export { AutoCorrectionEngine, autoCorrectionEngine } from './autoCorrectionEngine.js';
export { WhatIfAnalyzer, whatIfAnalyzer } from './whatIfAnalyzer.js';
export { ExtendedComponentRegistry, expandedRegistry } from './expandedRegistry.js';
export { ProjectBuilder, projectBuilder } from './projectBuilder.js';

/**
 * Initialize all AI engines
 */
export function initializeAI() {
    console.log('🤖 TinkerAI Engines Initialized');
    console.log(`📦 Component Registry: ${componentRegistry.count()} components loaded`);
    console.log(`📦 Expanded Registry: ${expandedRegistry.count()} components loaded`);
    console.log(`📚 Project Builder: 12+ project templates loaded`);
    return {
        safetyEngine,
        circuitGenerator,
        autoCorrectionEngine,
        whatIfAnalyzer,
        componentRegistry,
        expandedRegistry,
        projectBuilder
    };
}

/**
 * Integrated workflow: Generate circuit, check safety, apply fixes
 */
export async function generateAndValidateCircuit(description) {
    // Step 1: Generate circuit from description
    console.log('📝 Generating circuit from description...');
    const circuit = circuitGenerator.generateFromDescription(description);

    if (!circuit.success) {
        return { error: circuit.error };
    }

    console.log('✅ Circuit generated');

    // Step 2: Analyze for safety issues
    console.log('🔍 Analyzing circuit safety...');
    const safety = safetyEngine.analyze(circuit.circuit);

    console.log(`⚠️ Found ${safety.critical.length} critical issues, ${safety.warnings.length} warnings`);

    // Step 3: Generate corrections
    if (safety.critical.length > 0) {
        console.log('💡 Generating automatic corrections...');
        const corrections = autoCorrectionEngine.analyze(circuit.circuit);
        circuit.corrections = corrections;
    }

    return {
        success: true,
        circuit: circuit.circuit,
        code: circuit.code,
        safety,
        corrections: circuit.corrections,
        description: circuit.description
    };
}

/**
 * Analyze what-if scenarios
 */
export function analyzeScenario(circuit, scenario) {
    console.log(`🔮 Analyzing scenario: ${scenario.type}`);
    return whatIfAnalyzer.analyze(circuit, scenario);
}

/**
 * Get component recommendations
 */
export function recommendComponents(purpose) {
    console.log(`🔎 Searching components for: ${purpose}`);
    return componentRegistry.recommend(purpose);
}

/**
 * Search component database
 */
export function searchComponents(query) {
    console.log(`🔎 Searching: ${query}`);
    return componentRegistry.search(query);
}
