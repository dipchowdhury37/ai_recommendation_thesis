# Prototype Design and Adaptation Specification

**Dissertation Title:** *Adaptive Cybersecurity Awareness Training for University Students: A Data-Driven Framework for Personalised Learning Design*  
**Research Artefact Type:** Standalone Low-Fidelity Interactive Training Prototype (`Cybersecurity_Training_Prototype.html`)  
**Alignment:** Master's Dissertation Research — Objective 3, Research Question 3 (RQ3), and Research Question 4 (RQ4)  
**Author:** MSc Candidate  

---

## 1. Purpose, Scope, and Research Alignment

### 1.1 Research Aim and Objectives
The overarching aim of this research is:
> *"To analyse cybersecurity awareness patterns among university students using public data, identify learner profiles, and use them to derive requirements for, design and evaluate a personalised cybersecurity awareness training framework with a low-fidelity prototype."*

Within this Design Science Research (DSR) workflow, this prototype represents the functional implementation component of **Objective 3**:
* **Objective 1 (RQ1):** Review adaptive learning techniques and cybersecurity awareness training systems to establish initial candidate requirements.
* **Objective 2 (RQ2):** Statistically analyse the secondary public dataset (*Cybersecurity Issues in University and College Students in India*, $n=615$, Mendeley Data, DOI: 10.17632/c88wycrdzy.1) to discover behavioural practices, risk paradoxes, and exploratory learner profiles.
* **Objective 3 (RQ3 & RQ4):** Translate empirical findings into adaptive training requirements, design a multi-layer framework and prototype (RQ3), and conduct a formative evaluation of usability, relevance, and design quality (RQ4).

### 1.2 Distinguishing Public Dataset Analysis from Prototype Adaptations
A fundamental scientific distinction must be maintained between the secondary dataset analysis in Chapter 4 and the interactive logic of this prototype:
1. **Secondary Dataset Analysis (Chapter 4):** Identified statistical associations and three exploratory, overlapping learner profiles across $n=615$ students. The silhouette coefficient ($0.17$) and negative silhouette values ($12.1\%$) prove that these profiles are heuristic design aids rather than discrete, mutually exclusive clinical classifications.
2. **Prototype Diagnostic Instrument (Screen 2):** The six-question initial assessment is a *proposed research instrument* informed by the empirical patterns. It is **not** a psychometrically validated cluster classifier. The prototype does not claim to assign new students to statistical clusters; rather, it applies transparent, deterministic adaptation rules directly to observed diagnostic answers.
3. **Absence of Longitudinal Tracking:** The cross-sectional secondary dataset contains no intervention data or repeated measures. Consequently, adaptation rules are formulated as design hypotheses to be formatively evaluated (RQ4).

---

## 2. Five-Screen Learner Journey

The prototype is architected as a lightweight, single-page application (SPA) executing entirely on the client side with five sequential screens:

```
[Screen 1: Welcome & Scope]
            │
            ▼
[Screen 2: Initial Diagnostic (6 Questions)]
            │
            ▼
[Screen 3: Personalised Pathway (Ranked 6 Modules)]
            │
            ▼
[Screen 4: Training Module (Content + Scenario + Reassessment)]
            │
            ▼
[Screen 5: Feedback & Pathway Adaptation]
```

### Screen 1: Welcome & Privacy Statement
* **Purpose:** Sets learner expectations regarding training scope, estimated duration (approx. 6 diagnostic questions and 6 focused modules), and operational boundaries.
* **Privacy & Data Handling:** Explicitly guarantees zero data transmission. No personal identifiable information (PII)—such as names, student IDs, email addresses, passwords, institution names, age, or gender—is collected. Data persists exclusively in temporary browser memory and is cleared upon restart or tab closure.
* **Consent Boundary:** Clarifies that launching the diagnostic does not constitute formal research consent; evaluation consent is administered independently.

### Screen 2: Initial Diagnostic Assessment
* **Structure:** Six targeted questions corresponding to the core awareness dimensions identified in Chapter 4:
  1. Password practices (Self-reported practice).
  2. Phishing and suspicious links (Scenario decision).
  3. Privacy settings and app permissions (Self-reported practice).
  4. Operating system and software updates (Self-reported practice).
  5. Perceived threat susceptibility (Attitude and belief).
  6. Incident reporting action (Scenario decision).
* **Measurement Design:** Clearly separates self-reported habits from scenario-based decisions. Incorporates an explicit *"I am not sure"* option for every question to distinguish deliberate risky behaviour from knowledge deficits.
* **Validation:** Prevents form submission until all six items are completed, with accessible focus management guiding the learner to any omitted item.

### Screen 3: Personalised Learning Pathway
* **Deterministic Prioritisation:** Evaluates assessment responses and sorts all six training modules in descending order of urgency:
  * **Priority 2 (High Priority / Priority Need):** Risky practice, incorrect scenario choice, or stated uncertainty.
  * **Priority 1 (Recommended Next / Intermediate Need):** Partially protective practice or incomplete understanding.
  * **Priority 0 (Refresher):** Verified protective practice or correct scenario answer.
* **Transparency & Explanations:** Displays a dedicated explanation for every module, directly linking the recommendation to the learner's specific assessment choice.
* **Refresher Branching:** If all responses are protective, presents an affirmative *"Refresher Pathway"* preserving learning engagement.

### Screen 4: Training Module & Interactive Reassessment
* **Modular Structure:** Each of the six modules contains:
  1. *Authoritative Guidance:* Plain-language summaries drawn from NCSC UK, NIST SP 800-50r1, CISA, and ENISA.
  2. *Practical Scenario Decision:* A realistic campus context with instant formative feedback explaining correct and incorrect options.
  3. *Follow-Up Reassessment Item:* A distinct diagnostic question to measure immediate comprehension.
* **Safe Sandbox:** Uses strictly reserved domain names (`example.com`, `.invalid`) and hypothetical institutional contact points (*"your university's verified IT or security reporting channel"*).

### Screen 5: Feedback & Pathway Adaptation
* **Adaptive Recalculation:**
  * **Correct Reassessment:** Reduces the module's priority level by one step ($\text{Priority } 2 \to 1$ or $\text{Priority } 1 \to 0$, bounded at $0$).
  * **Incorrect / Uncertain Reassessment:** Retains the existing priority level and provides remedial feedback.
* **Dynamic Re-sorting:** Re-sorts the entire learning pathway in real time using the canonical tie-breaking rule.
* **Separation of Completion vs Performance:** Module completion status is recorded independently; completing an activity without demonstrating correct reassessment does not lower its priority.
* **Research Disclaimer:** Explicitly notes that a single correct answer does not constitute proof of long-term behavioural change or permanent mastery.

---

## 3. Comprehensive Diagnostic Mapping and Rule Specifications

Every diagnostic response is mapped deterministically to an internal priority level ($2, 1, 0$), a learner-facing label, and an explanatory justification.

### Table 3.1: Complete Answer-to-Priority Mapping Rules

| Question & Item ID | Response Option Text | Internal Priority | Learner-Facing Label | Displayed Recommendation Justification |
| :--- | :--- | :---: | :--- | :--- |
| **Q1: Password Practices** (`q1_password`) | `q1_risky`: Use memorable personal details or reuse passwords across multiple accounts. | **2** | High Priority | Your answer indicates that you use memorable personal details or reuse passwords across multiple accounts. |
| | `q1_partial`: Different passwords for main accounts, but no password manager or MFA everywhere. | **1** | Recommended Next | Your answer indicates that you create different passwords but do not consistently use a password manager or MFA. |
| | `q1_protective`: Unique, strong passphrases or password manager, with MFA enabled where available. | **0** | Refresher | Your answer demonstrates protective password habits (unique passphrases, password manager, and MFA). |
| | `q1_unsure`: Not sure what constitutes a secure password management strategy. | **2** | High Priority | You indicated uncertainty about password creation and account protection strategies. |
| **Q2: Phishing Scenario** (`q2_phishing`) | `q2_risky`: Click the urgent portal link immediately to prevent suspension. | **2** | High Priority | In the scenario, you selected clicking an unverified link, which exposes your account to credential theft. |
| | `q2_partial`: Reply directly to the email asking the sender to confirm authenticity. | **1** | Recommended Next | In the scenario, you chose to reply directly to the suspicious sender rather than verifying independently. |
| | `q2_protective`: Do not click the link; navigate independently via bookmarks/official site. | **0** | Refresher | In the scenario, you correctly chose to verify account status independently via official university channels. |
| | `q2_unsure`: Not sure how to verify whether the message is genuine. | **2** | High Priority | You indicated uncertainty about identifying and verifying suspicious messages. |
| **Q3: Privacy Settings** (`q3_privacy`) | `q3_risky`: Rarely or never review permissions; accept defaults and public visibility. | **2** | High Priority | Your answer indicates that you rarely or never review app privacy permissions or restrict default sharing. |
| | `q3_partial`: Occasionally review settings, but only after prompted or after news incidents. | **1** | Recommended Next | Your answer indicates that you occasionally review privacy settings, but only after prompted or in response to news. |
| | `q3_protective`: Regularly restrict profile visibility, location tracking, and third-party sharing. | **0** | Refresher | Your answer demonstrates regular, proactive auditing of app permissions and public visibility. |
| | `q3_unsure`: Not sure where to locate or adjust application privacy permissions. | **2** | High Priority | You indicated uncertainty about where to find or adjust application privacy settings. |
| **Q4: Software Updates** (`q4_updates`) | `q4_risky`: Postpone or ignore updates for weeks or months due to inconvenience. | **2** | High Priority | Your answer indicates that you frequently postpone or ignore critical security updates for weeks or months. |
| | `q4_partial`: Delay updates for several days, installing only when forced to restart. | **1** | Recommended Next | Your answer indicates that you delay security updates for several days before applying them. |
| | `q4_protective`: Install promptly or have automatic updates enabled for OS and apps. | **0** | Refresher | Your answer demonstrates prompt installation of operating system and application security patches. |
| | `q4_unsure`: Not sure whether software updates provide meaningful security protection. | **2** | High Priority | You indicated uncertainty about the security role and importance of software updates. |
| **Q5: Susceptibility Belief** (`q5_susceptibility`) | `q5_risky`: Hackers only target banks and large firms; ordinary students have nothing of value. | **2** | High Priority | Your answer reflects the belief that hackers only target large organisations and that student accounts hold no value. |
| | `q5_partial`: Students targeted occasionally, but only if they have significant savings or high roles. | **1** | Recommended Next | Your answer assumes students are only targeted if they have significant personal savings or high-profile roles. |
| | `q5_protective`: Any student account can be targeted for fraud, credentials, or network gateway access. | **0** | Refresher | Your answer recognises that any student account can be exploited as a valuable gateway into university networks. |
| | `q5_unsure`: Not sure why a cybercriminal would be interested in student accounts or devices. | **2** | High Priority | You indicated uncertainty about why cybercriminals would target university students. |
| **Q6: Incident Reporting** (`q6_reporting`) | `q6_risky`: Do nothing and hope nothing happens, or keep quiet to avoid trouble. | **2** | High Priority | In the scenario, you selected doing nothing or keeping quiet after entering credentials on a suspicious page. |
| | `q6_partial`: Try to fix the problem alone without alerting anyone or changing password. | **1** | Recommended Next | In the scenario, you selected trying to fix the issue alone without reporting or changing your password. |
| | `q6_protective`: Immediately change password and report via university IT security channel. | **0** | Refresher | In the scenario, you correctly identified immediate password change and reporting via verified university channels. |
| | `q6_unsure`: Would not know how or where to report a cybersecurity incident at university. | **2** | High Priority | You indicated uncertainty regarding where or how to report a cybersecurity incident at university. |

---

## 4. Tie-Breaking and Adaptation Logic

### 4.1 Empirical Justification for Canonical Tie-Breaking Order
When multiple modules share identical priority values (e.g. all evaluated at Priority 2), a deterministic tie-breaking hierarchy must resolve their presentation sequence. In this prototype, tie-breaking is explicitly grounded in the empirical evidence strength established in Chapter 4 (Table 4.8):

1. **Password Security (`password` - Rank 1):** Supported by the highest proportion of direct reported vulnerability (48.5% of all respondents and 86.5% of Profile 2 reported using personal information in passwords Often/Always; 50.6% of those reporting all four protective habits still exhibited risky password practices). Categorised as **Must (R1)**.
2. **Phishing & Suspicious Links (`phishing` - Rank 2):** Supported by widespread reported caution (85.0%) coupled with significant diagnostic uncertainty (31.2% did not know if they had received phishing; 36.6% did not know about malware). Categorised as **Must (R2)**.
3. **Personal Susceptibility (`susceptibility` - Rank 3):** Supported by 47.2% of respondents endorsing the "not-targeted" belief (Profile 2 susceptibility mean: $1.95$ vs Profile 1: $3.70$). Categorised as **Should (R3)**.
4. **Privacy Settings (`privacy` - Rank 4):** Supported by high baseline self-reported attention (82.1%), but lower in Profile 3 (mean $3.65$) with 39.9% trusting social media platforms. Categorised as **Should (R4)**.
5. **Software Updates (`updates` - Rank 5):** Supported by 9.6% reporting uncertainty about security software updates and limited protective tool diversity (median 2 tool types). Categorised as **Should (R5)**.
6. **Incident Reporting (`reporting` - Rank 6):** Derived from a smaller empirical sub-sample (49 of 144 victims reported; 24 of 91 non-reporters did not know how to describe the incident). Categorised as **Should (R6)**.

### 4.2 Pathway Adaptation and Reassessment Rules
1. **Initial Pathway Generation:**  
   $$\text{Sort modules by: } \text{Priority } (\text{descending: } 2 \to 1 \to 0) \quad \text{THEN} \quad \text{Canonical Rank } (\text{ascending: } 1 \to 2 \to 3 \to 4 \to 5 \to 6)$$
2. **Reassessment Evaluation:**
   * If $\text{Followup Answer} = \text{Correct}$:  
     $$\text{Priority}_{\text{new}} = \max(0, \text{Priority}_{\text{old}} - 1)$$
   * If $\text{Followup Answer} = \text{Incorrect} \lor \text{Uncertain}$:  
     $$\text{Priority}_{\text{new}} = \text{Priority}_{\text{old}}$$
3. **Status Decoupling:**  
   $$\text{Status} \leftarrow \text{'completed'} \quad (\text{Completion alone does NOT reduce priority})$$
4. **Dynamic Resequencing:**  
   Immediately recalculates the full pathway ordering and displays the updated position of all six modules on Screen 5.

---

## 5. Chapter 4 Traceability Matrix

The table below establishes direct traceability between the empirical findings in Chapter 4, the derived requirements (R1–R8), prototype features, adaptation rules, and planned evaluation tasks.

### Table 5.1: Empirical Traceability Matrix

| Chapter 4 Finding / Req ID | Relevant Learner Pattern | Prototype Feature | Adaptation Rule | Evaluation Task |
| :--- | :--- | :--- | :--- | :--- |
| **R1: Risky Password Practice (Must)** | 48.5% reported personal info in passwords Often/Always (Profile 2: 86.5%). 50.6% of protective respondents did too. | Password Creation & Account Protection Module (`password`). | If `q1_password` is risky or unsure $\to \text{Priority } 2$; ranked 1st in tie-breaks. Correct follow-up reduces to Priority 1 or 0. | **Task 1 & 2:** Verify module is recommended 1st for password-risk persona. |
| **R2: Phishing Caution vs Incident Uncertainty (Must)** | 85.0% reported link caution, but 31.2% were unsure about phishing emails and 36.6% about malware. | Phishing & Suspicious Link Recognition Module (`phishing`). | If `q2_phishing` is risky/unsure $\to \text{Priority } 2$; ranked 2nd in tie-breaks. Correct follow-up reduces to Priority 1 or 0. | **Task 4 & 5:** Complete phishing module and verify interactive scenario feedback. |
| **R3: Perceived Susceptibility Paradox (Should)** | 47.2% held the "not-targeted" belief; Profile 2 susceptibility mean was 1.95 (vs Profile 1: 3.70). | Personal Susceptibility Explainer Module (`susceptibility`). | If `q5_susceptibility` is risky/unsure $\to \text{Priority } 2$; ranked 3rd in tie-breaks. | **Task 3:** Explain why susceptibility module is prioritised based on diagnostic answers. |
| **R4: Privacy and Disclosure (Should)** | Privacy attention 82.1% Often/Always, but lower in Profile 3 (mean 3.65); 39.9% trusted social media. | Privacy Settings & Information Disclosure Module (`privacy`). | If `q3_privacy` is risky/unsure $\to \text{Priority } 2$; ranked 4th in tie-breaks. | **Task 6:** Observe pathway position changes after completing higher-ranked modules. |
| **R5: Software Updating & Device Protection (Should)** | Median 2 tool types used; 9.6% did not know about security software updates. | Software Updates & Device Protection Module (`updates`). | If `q4_updates` is risky/unsure $\to \text{Priority } 2$; ranked 5th in tie-breaks. | **Task 4:** Test update decision scenario and verify authoritative patching advice. |
| **R6: Incident Reporting Deficit (Should)** | Only 34.0% of victims reported incidents; 26.4% of non-reporters cited not knowing how to describe it. | Incident Recognition & Reporting Module (`reporting`). | If `q6_reporting` is risky/unsure $\to \text{Priority } 2$; ranked 6th in tie-breaks. | **Task 5:** Verify plain-language reporting guidance (verified university channel). |
| **R7: Self-Rated Skill Inadequacy (Must)** | Self-rated digital skill showed weak correlation with informedness ($\rho = 0.19$) and checking ($\rho = 0.13$). | 6-item practice & scenario diagnostic; no self-rated skill sorting. | Module priorities determined solely by behavioural practices and scenario decisions, not self-ratings. | **Task 1:** Confirm diagnostic captures specific habits without requesting skill ratings. |
| **R8: Transparency and Feedback (Must / Could)** | Exploratory profiles had low silhouette separation ($0.17$); overlap requires transparent rationale. | Clear explanatory text on every module card and dynamic pathway updates. | Explicit display of the answer reason for each recommendation; dynamic re-ordering on Screen 5. | **Task 6:** Verify learner can explain why pathway changed following correct follow-up. |

---

## 6. Authoritative Educational Content Sources

All educational content, scenario advice, and follow-up rationales are drawn directly from official national and international cybersecurity authorities:

1. **National Cyber Security Centre (NCSC UK):**
   * *Top Tips for Staying Secure Online (2024).* Passwords, two-step verification, and password managers.  
     URL: `https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online` (Accessed: 14 February 2026).
   * *Phishing: Spotting and Reporting Phishing (2024).* Identifying deceptive emails and reporting procedures.  
     URL: `https://www.ncsc.gov.uk/guidance/phishing` (Accessed: 14 February 2026).
2. **National Institute of Standards and Technology (NIST):**
   * *NIST Special Publication 800-50 Revision 1 (2024): Building a Cybersecurity and Privacy Learning Program.* U.S. Department of Commerce.  
     DOI: `https://doi.org/10.6028/NIST.SP.800-50r1` (Accessed: 12 January 2026).
3. **Cybersecurity and Infrastructure Security Agency (CISA):**
   * *Secure Our World: 4 Easy Ways to Stay Safe Online (2024).* Multi-factor authentication, strong passwords, updating software, and phishing recognition.  
     URL: `https://www.cisa.gov/secure-our-world/4-easy-ways-stay-safe-online` (Accessed: 18 January 2026).
4. **European Union Agency for Cybersecurity (ENISA):**
   * *Cybersecurity Culture Guidelines in Higher Education (2023).* Promoting non-punitive incident reporting and threat awareness.  
     URL: `https://www.enisa.europa.eu/publications/cybersecurity-culture-in-organisations` (Accessed: 22 January 2026).

---

## 7. Known Limitations and Research Boundaries

1. **Low-Fidelity Scope:** The prototype is intentionally designed as an exploratory, client-side research tool to evaluate interaction concepts and transparency, not as an enterprise learning management system.
2. **Formative Assessment Granularity:** Six diagnostic questions provide a rapid initial orientation. They do not represent a comprehensive psychometric assessment of student cybersecurity competence.
3. **Immediate vs Longitudinal Impact:** Reassessment measures short-term recall within the session; it does not evaluate long-term behavioural retention or real-world resistance to cyber threats.
