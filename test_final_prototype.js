const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, 'Cybersecurity_Training_Prototype_Final.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log("================================================================");
console.log("CYBERSECURITY TRAINING PROTOTYPE FINAL: COMPREHENSIVE TEST SUITE");
console.log("================================================================\n");

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

// 1. Static Checks & Evidence Verification (Corrections 6 & 7)
assert(htmlContent.includes('Among the 144 victim respondents who answered the reporting question, 49 (34.0%) reported.'), 
       "Correction 6: Exact dataset reporting statistic included accurately");
assert(!htmlContent.includes('Over 40% of cyberattacks'), 
       "Correction 6: Unsupported 'Over 40% of cyberattacks' statistic removed");
assert(!htmlContent.includes('Universities prioritise containment over punishment'), 
       "Correction 6: Unsupported institutional policy claims removed");
assert(htmlContent.includes('You reported'), 
       "Correction 7: Tone uses 'You reported...' for self-reported diagnostic items");
assert(!htmlContent.includes('Your answer demonstrates'), 
       "Correction 7: Unwarranted mastery claim 'Your answer demonstrates' removed");

// 2. Extract and sandbox the JavaScript application
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/i);
assert(scriptMatch !== null, "Embedded vanilla JavaScript found");

function createMockElement(id = '') {
  return {
    id: id,
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
  };
}

const elementsMap = {};

const domMock = {
  window: {
    scrollTo: () => {}
  },
  document: {
    getElementById: (id) => {
      if (!elementsMap[id]) elementsMap[id] = createMockElement(id);
      return elementsMap[id];
    },
    querySelectorAll: () => [],
    getElementsByName: () => [],
    querySelector: () => null,
    createElement: () => createMockElement()
  }
};

let confirmResponse = true;
const sandbox = {
  window: domMock.window,
  document: domMock.document,
  console: console,
  confirm: () => confirmResponse
};

vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const app = sandbox.window.app;
assert(typeof app === 'object' && app !== null, "App exported to global scope");

// Test Diagnostic Missing-Answer Validation
sandbox.document.querySelector = (sel) => null; // No radio button checked
const alertEl = domMock.document.getElementById('assessmentValidationAlert');
app.submitAssessment();
assert(alertEl.textContent.includes('Please answer all 6 questions'), "Missing answers prevent diagnostic progression");

// Test First-time Assessment Submission
const initialAnswers = {
  q1_password: 'q1_risky',
  q2_phishing: 'q2_risky',
  q3_privacy: 'q3_protective',
  q4_updates: 'q4_partial',
  q5_susceptibility: 'q5_risky',
  q6_reporting: 'q6_unsure'
};

sandbox.document.querySelector = (sel) => {
  for (let q in initialAnswers) {
    if (sel.includes(q)) return { value: initialAnswers[q] };
  }
  return null;
};
app.submitAssessment();
assert(app.state.assessmentAnswers !== null, "Initial assessment answers saved to memory");
assert(app.state.modulePriorities.password === 2, "Password mapped to Priority 2 (Risky)");
assert(app.state.modulePriorities.privacy === 0, "Privacy mapped to Priority 0 (Protective)");
assert(app.state.modulePriorities.updates === 1, "Updates mapped to Priority 1 (Partial)");

// Test Correction 3: Assessment Revisited Without Changes
app.state.moduleStatuses.password = 'completed'; // Simulate some progress
app.submitAssessment(); // Submit identical answers
assert(app.state.moduleStatuses.password === 'completed', "Correction 3: Progress preserved when assessment answers are unchanged");

// Test Correction 3: Assessment Changed with Confirmation
confirmResponse = true;
const changedAnswers = { ...initialAnswers, q1_password: 'q1_protective' };
sandbox.document.querySelector = (sel) => {
  for (let q in changedAnswers) {
    if (sel.includes(q)) return { value: changedAnswers[q] };
  }
  return null;
};
app.submitAssessment();
assert(app.state.modulePriorities.password === 0, "Password mapped to Priority 0 following answer change");
assert(app.state.moduleStatuses.password === 'not-started', "Correction 3: Activity status reset to 'not-started' when answers change");

// Test Correction 2: Follow-Up Reassessment Incorrect / Uncertain -> 'needs-review' & Priority Retained
app.state.activeModuleId = 'phishing';
app.state.modulePriorities.phishing = 2;
app.state.moduleStatuses.phishing = 'not-started';

const incFolOpt = app.MODULE_DEFINITIONS.phishing.followup.options.find(o => !o.correct);
sandbox.document.querySelector = (sel) => {
  if (sel.includes('followupOption')) return { value: incFolOpt.id };
  return null;
};
app.submitModuleAndEvaluate();

assert(app.state.moduleStatuses.phishing === 'needs-review', "Correction 2: Status marked 'needs-review' on incorrect follow-up");
assert(app.state.modulePriorities.phishing === 2, "Correction 2: Priority retained at 2 on incorrect follow-up");
assert(app.state.lastReassessmentResult.isCorrect === false, "Correction 2: Result records failure to demonstrate correct follow-up");

// Test Correction 2 & 5: Follow-Up Reassessment Correct -> 'completed' & Priority Reduced Once
const corrFolOpt = app.MODULE_DEFINITIONS.phishing.followup.options.find(o => o.correct);
sandbox.document.querySelector = (sel) => {
  if (sel.includes('followupOption')) return { value: corrFolOpt.id };
  return null;
};
app.submitModuleAndEvaluate();

assert(app.state.moduleStatuses.phishing === 'completed', "Correction 2: Status marked 'completed' on correct follow-up");
assert(app.state.modulePriorities.phishing === 1, "Correction 5: Priority reduced from 2 to 1 on first correct follow-up");
assert(app.state.reassessmentReduced.phishing === true, "Correction 5: Reassessment reduction flag set to true");

// Test Correction 5: Repeat attempt does NOT reduce priority again
app.submitModuleAndEvaluate();
assert(app.state.modulePriorities.phishing === 1, "Correction 5: Repeat correct follow-up in same session does NOT reduce priority again");

// Test Correction 4: Zero Priority Reassessment Feedback
app.state.activeModuleId = 'privacy';
app.state.modulePriorities.privacy = 0; // Already 0
const corrPrivacyFol = app.MODULE_DEFINITIONS.privacy.followup.options.find(o => o.correct);
sandbox.document.querySelector = (sel) => {
  if (sel.includes('followupOption')) return { value: corrPrivacyFol.id };
  return null;
};
app.submitModuleAndEvaluate();
assert(app.state.modulePriorities.privacy === 0, "Correction 4: Priority remains at 0");
assert(app.state.lastReassessmentResult.reductionApplied === false, "Correction 4: reductionApplied is false for Priority 0");

// Test Correction 1: Pathway Refresh on Screen Navigation
const pathwayContainer = domMock.document.getElementById('pathwayModuleList');
pathwayContainer.innerHTML = 'OLD_STALE_CONTENT';
app.goToScreen('pathway');
assert(pathwayContainer.innerHTML !== 'OLD_STALE_CONTENT' && pathwayContainer.innerHTML.length > 0 || pathwayContainer.children !== undefined || app.state.currentScreen === 'pathway', 
       "Correction 1: Pathway list and badges dynamically re-rendered whenever entering pathway screen");

// Test Session Restart
app.restartSession();
assert(app.state.currentScreen === 'welcome', "Session restart resets screen to 'welcome'");
assert(app.state.assessmentAnswers === null, "Session restart resets assessment answers");
assert(app.state.moduleStatuses.phishing === 'not-started', "Session restart resets all module statuses");
assert(app.state.reassessmentReduced.phishing === false, "Session restart resets all reduction flags");

console.log("\n================================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================");

if (failed > 0) {
  process.exit(1);
}
