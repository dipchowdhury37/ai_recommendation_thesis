const fs = require('fs');
const path = require('path');

// Read HTML file
const htmlPath = path.join(__dirname, 'Cybersecurity_Training_Prototype.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log("==================================================");
console.log("CYBERSECURITY TRAINING PROTOTYPE AUTOMATED TEST SUITE");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Static Checks
assert(htmlContent.includes('<!DOCTYPE html>'), "File has valid HTML5 DOCTYPE");
assert(!htmlContent.includes('http://') && !htmlContent.includes('https://') || 
       // only example.com or .invalid in scenarios or DOI in footer
       !htmlContent.match(/<script[^>]+src=["'](http|https)/i) &&
       !htmlContent.match(/<link[^>]+href=["'](http|https)/i), 
       "Zero external CDN, CSS, script, or font network dependencies");

assert(htmlContent.includes('Research Prototype'), "Clear research prototype banner present");
assert(htmlContent.includes('Privacy &amp; Data Protection Statement') || htmlContent.includes('Privacy & Data Protection Statement'), "Privacy statement explicitly included");

// 2. Extract Javascript logic from HTML to test determinism and rule mappings
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/i);
assert(scriptMatch !== null, "Found embedded vanilla JavaScript application");

// Mock browser DOM environment minimally for state testing
const { JSDOM } = (() => {
  // Simple custom mock if jsdom is not installed
  return {
    JSDOM: class {
      constructor(html) {
        // We will execute the script in a node VM sandbox
      }
    }
  };
})();

const vm = require('vm');

const domMock = {
  window: {
    scrollTo: () => {}
  },
  document: {
    getElementById: (id) => ({
      style: {},
      classList: { add: () => {}, remove: () => {} },
      setAttribute: () => {},
      addEventListener: () => {},
      scrollIntoView: () => {},
      focus: () => {},
      appendChild: () => {},
      reset: () => {},
      innerHTML: '',
      textContent: ''
    }),
    querySelectorAll: () => [],
    getElementsByName: () => [],
    querySelector: () => null,
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      innerHTML: ''
    })
  }
};

const sandbox = {
  window: domMock.window,
  document: domMock.document,
  console: console,
  confirm: () => true
};

vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const app = sandbox.window.app;
assert(typeof app === 'object' && app !== null, "App object exported successfully to global scope");

// Test Module Definitions
const expectedModules = ['password', 'phishing', 'susceptibility', 'privacy', 'updates', 'reporting'];
assert(Object.keys(app.MODULE_DEFINITIONS).length === 6, "Exactly 6 core training modules defined");
expectedModules.forEach(m => {
  assert(app.MODULE_DEFINITIONS[m] !== undefined, `Module '${m}' is properly defined`);
  assert(app.MODULE_DEFINITIONS[m].practiceScenario !== undefined, `Module '${m}' has practice scenario`);
  assert(app.MODULE_DEFINITIONS[m].followup !== undefined, `Module '${m}' has reassessment follow-up`);
});

// Test Answer Mappings completeness
const expectedQuestions = ['q1_password', 'q2_phishing', 'q3_privacy', 'q4_updates', 'q5_susceptibility', 'q6_reporting'];
let allOptionsHaveRules = true;
expectedQuestions.forEach(q => {
  const options = ['risky', 'partial', 'protective', 'unsure'];
  options.forEach(opt => {
    const key = `${q.split('_')[0]}_${opt}`;
    const mapping = app.ANSWER_MAPPINGS[q][key];
    if (!mapping || mapping.priority === undefined || !mapping.reason) {
      allOptionsHaveRules = false;
      console.error(`Missing mapping for ${q} -> ${key}`);
    }
  });
});
assert(allOptionsHaveRules, "100% of assessment answer choices (24 options) have deterministic priority & explanation rules");

// Test Tie-Breaking Rule (Canonical Order)
app.state.modulePriorities = {
  password: 2,
  phishing: 2,
  susceptibility: 2,
  privacy: 2,
  updates: 2,
  reporting: 2
};
let ordered = app.getOrderedModules();
const tieBreakOrder = ordered.map(m => m.id);
assert(JSON.stringify(tieBreakOrder) === JSON.stringify(['password', 'phishing', 'susceptibility', 'privacy', 'updates', 'reporting']),
       "Tie-breaking rule perfectly resolves identical priorities according to Chapter 4 hierarchy (R1 -> R2 -> R3 -> R4 -> R5 -> R6)");

// Test Deterministic Priority Sorting
app.state.modulePriorities = {
  password: 0,
  phishing: 2,
  susceptibility: 1,
  privacy: 0,
  updates: 2,
  reporting: 1
};
ordered = app.getOrderedModules();
const expectedOrder = ['phishing', 'updates', 'susceptibility', 'reporting', 'password', 'privacy'];
assert(JSON.stringify(ordered.map(m => m.id)) === JSON.stringify(expectedOrder),
       "Priority sort correctly ranks Priority 2 > Priority 1 > Priority 0, with internal tie-breaking preserved");

// Test Adaptation Rule: Correct Followup Reduces Priority
app.state.activeModuleId = 'phishing';
app.state.modulePriorities['phishing'] = 2;
app.state.moduleStatuses['phishing'] = 'not-started';

// Simulate correct follow-up submission
const correctFolOpt = app.MODULE_DEFINITIONS['phishing'].followup.options.find(o => o.correct);
sandbox.document.querySelector = (sel) => {
  if (sel === 'input[name="followupOption"]:checked') {
    return { value: correctFolOpt.id };
  }
  return null;
};
app.submitModuleAndEvaluate();

assert(app.state.modulePriorities['phishing'] === 1, "Correct follow-up successfully reduces module priority from 2 to 1");
assert(app.state.moduleStatuses['phishing'] === 'completed', "Module is marked completed upon evaluation");

// Correct follow-up again (1 -> 0)
app.submitModuleAndEvaluate();
assert(app.state.modulePriorities['phishing'] === 0, "Second correct follow-up reduces priority from 1 to 0 (minimum bound)");

// Test Adaptation Rule: Incorrect Followup Retains Priority
app.state.activeModuleId = 'password';
app.state.modulePriorities['password'] = 2;
const incFolOpt = app.MODULE_DEFINITIONS['password'].followup.options.find(o => !o.correct);
sandbox.document.querySelector = (sel) => {
  if (sel === 'input[name="followupOption"]:checked') {
    return { value: incFolOpt.id };
  }
  return null;
};
app.submitModuleAndEvaluate();
assert(app.state.modulePriorities['password'] === 2, "Incorrect or uncertain follow-up retains module priority at 2");

// Test Session Restart Clears State
app.restartSession();
assert(app.state.currentScreen === 'welcome', "Session restart resets screen to 'welcome'");
assert(Object.keys(app.state.assessmentAnswers).length === 0, "Session restart completely wipes in-memory assessment answers");
assert(app.state.lastReassessmentResult === null, "Session restart wipes previous adaptation history");

console.log("\n==================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
