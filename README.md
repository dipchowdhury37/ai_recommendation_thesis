# Personalised Adaptive Cybersecurity Awareness Training Prototype

> **Research Alignment:** Empirical development prototype for Master's Dissertation: *Adaptive Cybersecurity Awareness Training for University Students: A Data-Driven Framework for Personalised Learning Design* (Objective 3 / RQ3 & RQ4).

## 🚀 Overview
This repository contains the interactive low-fidelity web prototype demonstrating empirical, data-driven personalisation of cybersecurity training for university students. 

The framework diagnoses individual vulnerabilities across **6 empirical priority areas** derived from Chapter 4 data analysis ($N = 407$) and dynamically sequences learning pathways based on baseline performance and ongoing reassessment.

### Key Features
- **Five-Screen Learning Journey:** Diagnostic Assessment ➔ Personalised Pathway ➔ Adaptive Learning Modules ➔ Progress & Reassessment ➔ Usability Evaluation & SUS Survey.
- **Empirically Grounded Adaptation:** 
  - Priority levels (0 to 3) and dynamic tie-breaking hierarchy: `Password (R1)` ➔ `Phishing (R2)` ➔ `Susceptibility (R3)` ➔ `Privacy (R4)` ➔ `Updates (R5)` ➔ `Reporting (R6)`.
  - Dynamic pathway updates upon completion and single-reduction reassessment tracking.
  - Reset protections for reassessment state upon diagnostic modification.
- **Dual-Mode Operation:** 100% offline self-contained operation in session RAM, with automatic background evaluation logging via Vercel Serverless Function (`/api/submit`) when deployed online.
- **Privacy-Preserving:** Zero PII collected; anonymous session identifiers only.

---

## 📁 Repository Structure
```text
├── index.html                                        # Main web application entrypoint (Vercel & local)
├── Cybersecurity_Training_Prototype_Final.html       # Standalone distribution file
├── api/
│   └── submit.js                                     # Vercel serverless function (Google Sheets proxy)
├── vercel.json                                       # Vercel routing configuration
├── google_apps_script.js                             # Google Apps Script code for Google Sheets logging
├── package.json                                      # Project metadata & npm scripts
├── DEPLOYMENT_GUIDE.md                               # Complete Vercel & Google Sheets setup walkthrough
├── Prototype_Design_and_Adaptation.md / .docx        # Full prototype specification & Chapter 4 mapping
├── Prototype_Evaluation_Guide.md / .docx             # User evaluation protocol, persona walkthroughs & SUS template
└── Prototype_Test_Report.md / .docx                  # Verification & automated test report (29/29 passed)
```

---

## 🛠️ Local Development & Testing
To run locally:
```bash
npm start
# Opens local HTTP server on http://localhost:3000
```

To run automated test suite:
```bash
npm test
# Executes 29 automated end-to-end assertions
```

---

## 🌐 Live Deployment on Vercel
1. Deployed automatically via Vercel GitHub integration.
2. Configure `GOOGLE_SHEET_WEBAPP_URL` in Vercel Environment Variables to pipe anonymous participant evaluation responses directly to Google Sheets.
