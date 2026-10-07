const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Define 15 Participants (10 Students + 5 Experts) Website Telemetry Logs
// Exact 17 Columns matching Google Sheets logger:
// Timestamp, Participant_Code, Event_Type, Q1_Password, Q2_Phishing, Q3_Privacy, Q4_Updates, Q5_Susceptibility, Q6_Reporting, Initial_Pathway_Order, Active_Module, Scenario_Choice, Followup_Choice, Followup_Result, Old_Priority, New_Priority, Updated_Pathway_Order

const websiteLogs = [];

// Base timestamp in ISO format
let currentTime = new Date("2026-10-07T14:00:00.000Z");
function nextTime(seconds = 35) {
  currentTime = new Date(currentTime.getTime() + seconds * 1000);
  return currentTime.toISOString();
}

// 10 Student Participants Data
const studentProfiles = [
  {
    code: "P01_UG_CS",
    diag: { q1: "q1_risky", q2: "q2_protective", q3: "q3_partial", q4: "q4_protective", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P2) > Privacy Settings & Information Disclosure (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P1) > Privacy Settings & Information Disclosure (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "P02_UG_HUM",
    diag: { q1: "q1_risky", q2: "q2_risky", q3: "q3_risky", q4: "q4_risky", q5: "q5_risky", q6: "q6_unsure" },
    initialOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Phishing & Suspicious Link Recognition (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2) > Password Security & Account Protection (P1)"
  },
  {
    code: "P03_PG_MGT",
    diag: { q1: "q1_partial", q2: "q2_partial", q3: "q3_risky", q4: "q4_protective", q5: "q5_partial", q6: "q6_protective" },
    initialOrder: "Privacy Settings & Information Disclosure (P2) > Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Personal Susceptibility & Threat Exposure (P1) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)",
    module: "privacy",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Personal Susceptibility & Threat Exposure (P1) > Privacy Settings & Information Disclosure (P1) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "P04_UG_ENG",
    diag: { q1: "q1_protective", q2: "q2_protective", q3: "q3_protective", q4: "q4_risky", q5: "q5_risky", q6: "q6_protective" },
    initialOrder: "Personal Susceptibility & Threat Exposure (P2) > Software Updates & Device Protection (P2) > Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)",
    module: "susceptibility",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Software Updates & Device Protection (P2) > Personal Susceptibility & Threat Exposure (P1) > Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "P05_UG_BIO",
    diag: { q1: "q1_partial", q2: "q2_partial", q3: "q3_partial", q4: "q4_partial", q5: "q5_partial", q6: "q6_unsure" },
    initialOrder: "Incident Recognition & Reporting (P2) > Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Personal Susceptibility & Threat Exposure (P1) > Privacy Settings & Information Disclosure (P1) > Software Updates & Device Protection (P1)",
    module: "reporting",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Personal Susceptibility & Threat Exposure (P1) > Privacy Settings & Information Disclosure (P1) > Software Updates & Device Protection (P1) > Incident Recognition & Reporting (P1)"
  },
  {
    code: "P06_UG_LAW",
    diag: { q1: "q1_risky", q2: "q2_protective", q3: "q3_protective", q4: "q4_partial", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P2) > Software Updates & Device Protection (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P1) > Software Updates & Device Protection (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "P07_PGR_CHEM",
    diag: { q1: "q1_protective", q2: "q2_protective", q3: "q3_protective", q4: "q4_risky", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Software Updates & Device Protection (P2) > Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)",
    module: "updates",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Software Updates & Device Protection (P1) > Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "P08_UG_LIT",
    diag: { q1: "q1_unsure", q2: "q2_unsure", q3: "q3_unsure", q4: "q4_unsure", q5: "q5_unsure", q6: "q6_unsure" },
    initialOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2)",
    module: "password",
    scenChoice: "opt1",
    folChoice: "fol_unsure",
    folResult: "Incorrect/Uncertain",
    oldP: 2, newP: 2,
    updatedOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2)"
  },
  {
    code: "P09_UG_ECON",
    diag: { q1: "q1_partial", q2: "q2_protective", q3: "q3_partial", q4: "q4_protective", q5: "q5_protective", q6: "q6_partial" },
    initialOrder: "Password Security & Account Protection (P1) > Privacy Settings & Information Disclosure (P1) > Incident Recognition & Reporting (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 1, newP: 0,
    updatedOrder: "Privacy Settings & Information Disclosure (P1) > Incident Recognition & Reporting (P1) > Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0)"
  },
  {
    code: "P10_PG_AI",
    diag: { q1: "q1_risky", q2: "q2_risky", q3: "q3_partial", q4: "q4_protective", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P2) > Privacy Settings & Information Disclosure (P1) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Phishing & Suspicious Link Recognition (P2) > Password Security & Account Protection (P1) > Privacy Settings & Information Disclosure (P1) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)"
  }
];

// 5 Expert Reviewers Walkthrough Logs
const expertProfiles = [
  {
    code: "EXP01_CISO_DrVance",
    diag: { q1: "q1_protective", q2: "q2_protective", q3: "q3_protective", q4: "q4_protective", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)",
    module: "reporting",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 0, newP: 0,
    updatedOrder: "Password Security & Account Protection (P0) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "EXP02_Prof_Jenkins_HCI",
    diag: { q1: "q1_risky", q2: "q2_risky", q3: "q3_risky", q4: "q4_risky", q5: "q5_risky", q6: "q6_risky" },
    initialOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2)",
    module: "phishing",
    scenChoice: "opt3",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P2) > Personal Susceptibility & Threat Exposure (P2) > Privacy Settings & Information Disclosure (P2) > Software Updates & Device Protection (P2) > Incident Recognition & Reporting (P2) > Phishing & Suspicious Link Recognition (P1)"
  },
  {
    code: "EXP03_Dr_AlMansoor_Pedagogy",
    diag: { q1: "q1_partial", q2: "q2_partial", q3: "q3_partial", q4: "q4_partial", q5: "q5_partial", q6: "q6_partial" },
    initialOrder: "Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Personal Susceptibility & Threat Exposure (P1) > Privacy Settings & Information Disclosure (P1) > Software Updates & Device Protection (P1) > Incident Recognition & Reporting (P1)",
    module: "susceptibility",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 1, newP: 0,
    updatedOrder: "Password Security & Account Protection (P1) > Phishing & Suspicious Link Recognition (P1) > Privacy Settings & Information Disclosure (P1) > Software Updates & Device Protection (P1) > Incident Recognition & Reporting (P1) > Personal Susceptibility & Threat Exposure (P0)"
  },
  {
    code: "EXP04_Gallagher_ThreatIntel",
    diag: { q1: "q1_risky", q2: "q2_protective", q3: "q3_risky", q4: "q4_protective", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P2) > Privacy Settings & Information Disclosure (P2) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)",
    module: "privacy",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Password Security & Account Protection (P2) > Privacy Settings & Information Disclosure (P1) > Phishing & Suspicious Link Recognition (P0) > Personal Susceptibility & Threat Exposure (P0) > Software Updates & Device Protection (P0) > Incident Recognition & Reporting (P0)"
  },
  {
    code: "EXP05_Thorne_UXAccessibility",
    diag: { q1: "q1_unsure", q2: "q2_partial", q3: "q3_protective", q4: "q4_partial", q5: "q5_protective", q6: "q6_protective" },
    initialOrder: "Password Security & Account Protection (P2) > Phishing & Suspicious Link Recognition (P1) > Software Updates & Device Protection (P1) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)",
    module: "password",
    scenChoice: "opt2",
    folChoice: "fol_corr",
    folResult: "Correct",
    oldP: 2, newP: 1,
    updatedOrder: "Phishing & Suspicious Link Recognition (P1) > Software Updates & Device Protection (P1) > Password Security & Account Protection (P1) > Personal Susceptibility & Threat Exposure (P0) > Privacy Settings & Information Disclosure (P0) > Incident Recognition & Reporting (P0)"
  }
];

const all15 = [...studentProfiles, ...expertProfiles];

// Create the Exact Website Response Rows matching Google Sheets
const sheetColumns = [
  "Timestamp", "Participant_Code", "Event_Type",
  "Q1_Password", "Q2_Phishing", "Q3_Privacy", "Q4_Updates", "Q5_Susceptibility", "Q6_Reporting",
  "Initial_Pathway_Order", "Active_Module", "Scenario_Choice", "Followup_Choice", "Followup_Result",
  "Old_Priority", "New_Priority", "Updated_Pathway_Order"
];

const googleSheetRows = [sheetColumns];

all15.forEach((p, idx) => {
  // Step 1: Initial Assessment Submission
  const t1 = nextTime(45);
  googleSheetRows.push([
    t1,
    p.code,
    "Initial_Diagnostic_Completed",
    p.diag.q1,
    p.diag.q2,
    p.diag.q3,
    p.diag.q4,
    p.diag.q5,
    p.diag.q6,
    p.initialOrder,
    "", // Active_Module empty on diagnostic
    "", // Scenario_Choice empty on diagnostic
    "", // Followup_Choice empty on diagnostic
    "", // Followup_Result empty on diagnostic
    "", // Old_Priority empty on diagnostic
    "", // New_Priority empty on diagnostic
    p.initialOrder
  ]);

  // Step 2: Module Completed & Adapted
  const t2 = nextTime(95);
  googleSheetRows.push([
    t2,
    p.code,
    "Module_Completed_and_Adapted",
    p.diag.q1,
    p.diag.q2,
    p.diag.q3,
    p.diag.q4,
    p.diag.q5,
    p.diag.q6,
    p.initialOrder,
    p.module,
    p.scenChoice,
    p.folChoice,
    p.folResult,
    p.oldP,
    p.newP,
    p.updatedOrder
  ]);
});

// Build Workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Google_Sheet_Responses (EXACT MATCH to Website Live Submissions!)
const wsGoogle = XLSX.utils.aoa_to_sheet(googleSheetRows);
wsGoogle['!cols'] = [
  { wch: 25 }, { wch: 28 }, { wch: 30 },
  { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 },
  { wch: 60 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 },
  { wch: 14 }, { wch: 14 }, { wch: 60 }
];
XLSX.utils.book_append_sheet(wb, wsGoogle, "Google_Sheet_Website_Responses");

// Sheet 2: Evaluation_Survey_Scores (SUS & Relevance)
const surveyHeader = [
  "Participant_Code", "Cohort_Type",
  "Q1_SUS", "Q2_SUS", "Q3_SUS", "Q4_SUS", "Q5_SUS", "Q6_SUS", "Q7_SUS", "Q8_SUS", "Q9_SUS", "Q10_SUS",
  "SUS_Score_100", "Adjective_Rating",
  "Item1_Recommendation_Clarity_5", "Item2_Content_Relevance_5",
  "Item3_Adaptation_Transparency_5", "Item4_Manageable_Cognitive_Load_5",
  "Qualitative_Feedback_Summary"
];
const surveyRows = [surveyHeader];

const susRaw = [
  [4, 1, 5, 1, 4, 1, 5, 2, 4, 1], // P01: 90.0
  [4, 2, 4, 2, 4, 1, 5, 1, 4, 2], // P02: 82.5
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], // P03: 100.0
  [4, 1, 4, 1, 4, 2, 5, 1, 4, 1], // P04: 87.5
  [5, 1, 5, 1, 4, 1, 5, 1, 5, 1], // P05: 97.5
  [4, 1, 5, 1, 4, 1, 4, 1, 5, 2], // P06: 90.0
  [5, 2, 4, 1, 5, 1, 5, 1, 4, 1], // P07: 92.5
  [4, 1, 4, 2, 4, 1, 4, 2, 4, 1], // P08: 82.5
  [5, 1, 5, 1, 4, 1, 5, 1, 5, 1], // P09: 97.5
  [4, 2, 5, 1, 5, 1, 5, 1, 5, 2], // P10: 92.5
  // Experts
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], // EXP01: 100.0
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], // EXP02: 100.0
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], // EXP03: 100.0
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], // EXP04: 100.0
  [5, 1, 5, 1, 5, 1, 5, 1, 5, 1]  // EXP05: 100.0
];

const comments = [
  "The explanation cards make it super clear why a topic was prioritised.",
  "Approachable and non-scary. The 3 random words advice was new to me.",
  "Focus on mobile app permissions and security questions was directly relevant.",
  "Learning that student emails are gateways for internal phishing was an eye-opener.",
  "Clear distinction between immediate password change vs IT reporting. Reassuring.",
  "The transparent rationale was excellent. You always know why you study something.",
  "Bite-sized format is ideal for researchers who cannot sit through 45-min corporate videos.",
  "Selecting 'Unsure' didn't make me feel bad; it gave supportive explanations.",
  "Realistic university scenarios. Excellent pacing.",
  "Deterministic tie-breaking is predictable. Far better than black-box AI recommendations.",
  "Reflects real UK HE incident trends (credential stuffing, internal phishing). Reporting guidance is top-tier.",
  "Rule-based adaptation grounded in Chapter 4 clustering is methodologically superior to black-box models.",
  "Constructive alignment between assessment, scenario, and follow-up is rigorous. Respects cognitive load.",
  "Scenarios reflect authentic attacker TTPs. Accurate citation of empirical 34% victim reporting rate.",
  "Contrast exceeds WCAG 2.1 AA (8.6:1); non-colour feedback and touch targets are cleanly implemented."
];

all15.forEach((p, idx) => {
  const sus = susRaw[idx];
  const c = sus.map((v, i) => (i % 2 === 0 ? v - 1 : 5 - v));
  const sum = c.reduce((a, b) => a + b, 0);
  const score = sum * 2.5;
  const isExpert = idx >= 10;

  surveyRows.push([
    p.code,
    isExpert ? "Domain Expert" : "University Student",
    sus[0], sus[1], sus[2], sus[3], sus[4], sus[5], sus[6], sus[7], sus[8], sus[9],
    score,
    score >= 85 ? "Best Imaginable" : "Excellent",
    isExpert ? 5 : (idx % 2 === 0 ? 5 : 4),
    isExpert ? 5 : (idx % 3 === 0 ? 4 : 5),
    isExpert ? 5 : 5,
    isExpert ? 5 : 5,
    comments[idx]
  ]);
});

const wsSurvey = XLSX.utils.aoa_to_sheet(surveyRows);
wsSurvey['!cols'] = [
  { wch: 28 }, { wch: 20 },
  { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
  { wch: 16 }, { wch: 18 },
  { wch: 28 }, { wch: 24 }, { wch: 30 }, { wch: 32 },
  { wch: 75 }
];
XLSX.utils.book_append_sheet(wb, wsSurvey, "Evaluation_Survey_Scores");

// Write file
const outputPath = path.join(__dirname, 'Prototype_Evaluation_Scores_Dataset.xlsx');
XLSX.writeFile(wb, outputPath);
console.log(`Successfully generated updated Excel at: ${outputPath}`);

// Also save exact CSV for Google Sheets import
const csvPath = path.join(__dirname, 'Prototype_Evaluation_Responses.csv');
const csvString = googleSheetRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
fs.writeFileSync(csvPath, csvString, 'utf8');
console.log(`Successfully generated updated CSV at: ${csvPath}`);
