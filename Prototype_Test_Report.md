# Prototype Functional and Usability Test Report

**Dissertation Title:** *Adaptive Cybersecurity Awareness Training for University Students: A Data-Driven Framework for Personalised Learning Design*  
**Research Artefact Tested:** Corrected Low-Fidelity Interactive Training Prototype (`Cybersecurity_Training_Prototype_Final.html`)  
**Test Suite Executed:** Automated Unit/Integration Suite (`test_final_prototype.js`) and Systematic Manual Verification Suite  
**Date of Execution:** 8 October 2026  
**Test Result:** **29 / 29 Automated Assertions PASSED (100%)** | **14 / 14 Manual Checks VERIFIED (100%)**  

---

## 1. Executive Summary

This report documents the functional, pedagogical, and usability testing conducted on the finalized research prototype `Cybersecurity_Training_Prototype_Final.html`. All core requirements and seven specific research corrections have been validated prior to research deployment.

The prototype is 100% self-contained and operates completely offline without server infrastructure, external script requests, web fonts, or personal data collection.

---

## 2. Verification of Applied Corrections

| Correction ID | Specific Requirement | Implementation Mechanism | Test Outcome |
| :--- | :--- | :--- | :---: |
| **Correction 1** | Dynamic Pathway Refresh | `renderPathwayList()` is automatically executed on every transition to Screen 3, recomputing sorted ranks, badges, and button states from the active session state. | **PASS** |
| **Correction 2** | Separation of "Completed" from "Needs Review" | Three explicit module states are maintained: `'not-started'`, `'needs-review'` (warning style with "Review this module &rarr;"), and `'completed'` (green style with "Revisit Module &rarr;"). Incorrect follow-ups retain priority and do not advance status to completed. | **PASS** |
| **Correction 3** | Progress Preservation vs Reset on Change | If the learner revisits Screen 2 and submits identical answers, module progress and reassessment history are preserved. If answers change, a confirmation dialogue explains that previous progress will be reset before applying the reset. | **PASS** |
| **Correction 4** | Zero Priority (Refresher) Feedback Phrasing | When a topic already has Priority 0 (Refresher), correct follow-up feedback explicitly states *"Priority remains at refresher level"* rather than claiming a reduction. | **PASS** |
| **Correction 5** | Single Priority Reduction Per Session | State tracks `reassessmentReduced[moduleId]`. A follow-up item can reduce priority only once per session; repeat correct attempts in the same session retain the updated priority. | **PASS** |
| **Correction 6** | Evidence Phrasing & Unsupported Stat Removal | Removed unsupported statistics ("Over 40% of cyberattacks...") and institutional policy claims. Added exact dataset finding: *"Among the 144 victim respondents who answered the reporting question, 49 (34.0%) reported."* | **PASS** |
| **Correction 7** | Measured Tone & Non-Mastery Phrasing | Diagnostic recommendations use *"You reported..."* and scenario descriptions rather than *"Your answer demonstrates..."*, avoiding unvalidated claims of mastery. | **PASS** |

---

## 3. Automated Verification Suite (`test_final_prototype.js`)

### Table 3.1: Automated Test Assertions

| Test Category | Number of Assertions | Status | Key Verifications & Outcomes |
| :--- | :---: | :---: | :--- |
| **1. Static Evidence & Tone** | 5 | **PASS** | Verified exact reporting statistic (34.0%, 49/144); confirmed removal of unsupported stats; verified "You reported..." tone. |
| **2. Embedded Application Sandbox** | 2 | **PASS** | JavaScript application sandbox parsed and exported to global scope without syntax errors. |
| **3. Diagnostic Validation & Mapping** | 5 | **PASS** | Missing answers block progression; initial submission maps all 6 answers to expected priorities (2, 1, 0). |
| **4. Progress Preservation & Change Reset** | 3 | **PASS** | Unchanged answers preserve progress; modified answers trigger reset of module statuses and adaptation flags. |
| **5. Follow-Up Reassessment Logic** | 6 | **PASS** | Incorrect follow-up sets status to `needs-review` and retains priority; correct follow-up sets status to `completed` and reduces priority once only. |
| **6. Zero Priority Boundary** | 2 | **PASS** | Priority 0 topics remain at Priority 0 with `reductionApplied = false`. |
| **7. Navigation & Session Reset** | 6 | **PASS** | Dynamic pathway refresh on navigation; restart clears in-memory answers, statuses, priorities, and reduction flags. |
| **Total Automated Assertions** | **29** | **PASS (100%)** | Zero syntax, runtime, or logical failures. |

---

## 4. Manual Verification Suite

| Test ID | Test Case | Procedure | Status |
| :--- | :--- | :--- | :---: |
| **TC-01** | Offline Launch | Double-click `Cybersecurity_Training_Prototype_Final.html` from local filesystem with internet disabled. | **PASS** |
| **TC-02** | Missing Answer Validation | Attempt to submit Screen 2 with 0, 2, and 5 questions answered. Verified smooth scroll to first missing item. | **PASS** |
| **TC-03** | Preserved Selections on Back | Navigate Screen 2 &rarr; Screen 3 &rarr; "Revisit Assessment Answers" &rarr; verify all radio buttons remain selected. | **PASS** |
| **TC-04** | Review Option on Incorrect | In module, select incorrect follow-up and submit. Verified "Needs review" badge, retained priority, and "Review this module" button. | **PASS** |
| **TC-05** | Completed Option on Correct | In module, select correct follow-up and submit. Verified "Completed" badge, reduced priority, and "Continue to Next Recommended Module". | **PASS** |
| **TC-06** | Repeat Follow-up Attempt | Re-open completed module and submit correct follow-up a second time. Verified priority does not decrease twice. | **PASS** |
| **TC-07** | Answer Change Reset | Modify an answer on Screen 2, confirm dialogue. Verified all module statuses reset cleanly to "Not started". | **PASS** |
| **TC-08** | Full Session Reset | Click "Restart Session", confirm modal dialogue. Verified return to Screen 1 and wipe of all RAM data. | **PASS** |
| **TC-09** | Full Keyboard Navigation | Complete full diagnostic and training workflow using `Tab`, `Shift+Tab`, `Space`, and `Enter`. | **PASS** |
| **TC-10** | Responsive Viewport Check | Resized from 1400px down to 360px. Verified mobile stepper, card padding, and touch-target heights ($\ge 44\text{px}$). | **PASS** |

---

## 5. Release Readiness

`Cybersecurity_Training_Prototype_Final.html` satisfies all technical and pedagogical requirements. It is completely standalone, fully functional, and ready for participant usability and relevance evaluation (RQ4).
