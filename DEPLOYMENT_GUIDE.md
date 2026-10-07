# Deployment and Google Sheets Setup Guide

This guide provides step-by-step instructions for deploying the **Personalised Adaptive Cybersecurity Awareness Training Prototype** to **Vercel** via **GitHub** and automatically logging student responses to your **Google Sheet**.

---

## Part 1: Set Up Your Google Sheet (2 Minutes)

1. Open [Google Sheets](https://sheets.google.com/) and create a new blank spreadsheet (e.g. named `Cybersecurity Training Evaluation Logs`).
2. In the top navigation bar, click **Extensions** &rarr; **Apps Script**.
3. In the script editor, delete any existing code and paste the code from [google_apps_script.js](file:///e:/Assignments%202/AI%20Trainer/prototype/google_apps_script.js).
4. Click the blue **Deploy** button (top right) &rarr; **New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set the configuration:
   * **Description:** `Dissertation Data Logger`
   * **Execute as:** `Me` (your Google account)
   * **Who has access:** `Anyone`
7. Click **Deploy** (grant permissions if prompted).
8. Copy the generated **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Part 2: Push the Code to GitHub

Open PowerShell in your prototype directory (`e:\Assignments 2\AI Trainer\prototype`) and run:

```bash
git init
git add .
git commit -m "Initial commit of Vercel-ready cybersecurity training prototype"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

*(Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub repository URL).*

---

## Part 3: Deploy on Vercel

1. Log in to [Vercel](https://vercel.com/) with your GitHub account.
2. Click **Add New...** &rarr; **Project**.
3. Select your GitHub repository (`cybersecurity-training-prototype`) and click **Import**.
4. In the **Environment Variables** section, add:
   * **Key (Name):** `GOOGLE_SHEET_WEBAPP_URL`
   * **Value:** *(Paste your Google Apps Script Web App URL from Part 1)*
5. Click **Deploy**.

---

## Part 4: How It Operates Live

* **Instant Live URL:** Vercel will provide you with a public URL (e.g., `https://cybersecurity-training-prototype.vercel.app`).
* **Automatic Logging:** When participants complete the initial assessment or finish a module on your live site, the responses and pathway adaptations are automatically appended as rows in your Google Sheet in real time.
* **Ethics & Privacy:** Only anonymous responses, optional participant codes (`P01`, `P02`), and interaction telemetry are stored.
* **Offline Fallback:** If opened locally without an internet connection, the prototype functions completely in standalone mode in temporary browser memory.
