// Vercel Serverless Function: /api/submit
// Receives anonymous participant evaluation logs and forwards them to Google Sheets

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    // Check for target Google Apps Script URL from environment variable or body override
    const googleAppsScriptUrl = process.env.GOOGLE_SHEET_WEBAPP_URL || (payload && payload.endpointUrl);

    if (!googleAppsScriptUrl) {
      console.warn('GOOGLE_SHEET_WEBAPP_URL is not configured in Vercel environment variables.');
      return res.status(200).json({
        status: 'received_local_only',
        message: 'Data received by Vercel API. Set GOOGLE_SHEET_WEBAPP_URL in Vercel settings to save into Google Sheets.',
        data: payload
      });
    }

    // Forward to Google Apps Script Web App (follows redirects automatically)
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw: responseText };
    }

    return res.status(200).json({
      status: 'success',
      googleSheetResponse: result
    });

  } catch (error) {
    console.error('Error forwarding data to Google Sheet:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    });
  }
}
