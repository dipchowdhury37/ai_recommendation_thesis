/**
 * Google Apps Script for Automated Dissertation Response Logging
 * 
 * Instructions:
 * 1. Open your Google Sheet -> Extensions -> Apps Script.
 * 2. Paste this entire code into Code.gs.
 * 3. Click "Deploy" -> "New deployment" -> Select "Web app".
 * 4. Execute as: "Me", Who has access: "Anyone".
 * 5. Copy the Web App URL and set it in your Vercel Environment Variables as GOOGLE_SHEET_WEBAPP_URL
 *    (or paste it directly in the prototype settings).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write collisions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawContent = e.postData.contents;
    var data = JSON.parse(rawContent);

    // Initialize header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Participant_Code",
        "Event_Type",
        "Q1_Password",
        "Q2_Phishing",
        "Q3_Privacy",
        "Q4_Updates",
        "Q5_Susceptibility",
        "Q6_Reporting",
        "Initial_Pathway_Order",
        "Active_Module",
        "Scenario_Choice",
        "Followup_Choice",
        "Followup_Result",
        "Old_Priority",
        "New_Priority",
        "Updated_Pathway_Order"
      ]);
      sheet.getRange(1, 1, 1, 17).setFontWeight("bold").setBackground("#E8F1F8");
    }

    // Append participant record
    sheet.appendRow([
      new Date().toISOString(),
      data.participantCode || "Anonymous",
      data.eventType || "Submission",
      data.q1_password || "",
      data.q2_phishing || "",
      data.q3_privacy || "",
      data.q4_updates || "",
      data.q5_susceptibility || "",
      data.q6_reporting || "",
      data.initialPathwayOrder || "",
      data.activeModule || "",
      data.scenarioChoice || "",
      data.followupChoice || "",
      data.followupResult || "",
      data.oldPriority !== undefined ? data.oldPriority : "",
      data.newPriority !== undefined ? data.newPriority : "",
      data.updatedPathwayOrder || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data logged successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "Cybersecurity Awareness Training Prototype Logger"
  })).setMimeType(ContentService.MimeType.JSON);
}
