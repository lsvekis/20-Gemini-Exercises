/**
 * Shared Gemini Helpers
 *
 * Used by SheetsExamples.gs (and can also be reused in Docs projects).
 *
 * SETUP:
 * 1. In the Apps Script editor, open Project Settings → Script properties.
 * 2. Add a property:
 *      Key:   GEMINI_API_KEY
 *      Value: your Gemini API key
 * 3. Save.
 */

const GEMINI_MODEL_ID = 'gemini-2.5-flash';

/**
 * Get Gemini API key from Script Properties.
 * Throws a clear error if missing.
 */
function getGeminiApiKey_() {
  const scriptProps = PropertiesService.getScriptProperties();
  const key = scriptProps.getProperty('GEMINI_API_KEY');
  if (!key) {
    throw new Error(
      'GEMINI_API_KEY is not set.\n' +
        'In the Script Editor, open Project Settings → Script properties and add it.'
    );
  }
  return key;
}

/**
 * Core helper: send a text prompt to Gemini and return a text response.
 *
 * @param {string} prompt
 * @returns {string} Plain text response from Gemini.
 */
function callGemini(prompt) {
  const apiKey = getGeminiApiKey_();

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    GEMINI_MODEL_ID +
    ':generateContent?key=' +
    apiKey;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const text = res.getContentText();
  const json = JSON.parse(text);

  try {
    return json.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('Unexpected Gemini response: ' + text);
  }
}

/**
 * Helper: Get active sheet or throw a clear error if this isn't bound to a Sheet.
 */
function getActiveSheetOrError_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'No active spreadsheet found.\n' +
        'Make sure this script is bound to a Google Sheet (Extensions → Apps Script).'
    );
  }
  return ss.getActiveSheet() || ss.getSheets()[0];
}
