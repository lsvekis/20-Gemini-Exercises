/**
 * Gemini + Google Sheets Examples
 *
 * This file is self-contained and GitHub-ready.
 * It includes:
 *  - Gemini helpers (API key + HTTP call)
 *  - 1 custom function (=GEMINI)
 *  - 8 example automation functions
 *  - 1 setup function to populate sample data for all exercises
 *  - 1 optional test runner
 *
 * SETUP:
 * 1. Open a Google Sheet → Extensions → Apps Script.
 * 2. Replace any default code with this entire file (Code.gs).
 * 3. In the Script Editor, go to:
 *       Project Settings → Script properties → Add script property
 *    - Key:   GEMINI_API_KEY
 *    - Value: your Gemini API key
 * 4. Save.
 * 5. Run setupGeminiExampleData() once to populate sample data.
 * 6. Try the functions on each sheet (see README for details).
 */

const GEMINI_MODEL_ID = 'gemini-2.5-flash';

/* =====================================================================
 * SHARED HELPERS
 * ===================================================================== */

/**
 * Get Gemini API key from Script Properties.
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
function callGemini_(prompt) {
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
 * Get active sheet or throw a clear error if this isn't bound to a Sheet.
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

/* =====================================================================
 * CUSTOM FUNCTION
 * ===================================================================== */

/**
 * =GEMINI("Write a haiku about coding.")
 *
 * @param {string} prompt
 * @return {string}
 * @customfunction
 */
function GEMINI(prompt) {
  if (typeof prompt !== 'string') {
    return 'Prompt must be a string.';
  }
  return callGemini_(prompt);
}

/**
 * Simple test for GEMINI() from the editor.
 */
function test_GEMINI() {
  const out = GEMINI('Write a short motivational message for new coders.');
  Logger.log(out);
}

/* =====================================================================
 * EXAMPLE 1 – A1 topic → A2 ideas (single cell)
 * Sheet: Ideas_Emails
 * ===================================================================== */

function sheets_topicIdeas() {
  const sheet = getActiveSheetOrError_();
  const topic = sheet.getRange('A1').getValue();

  if (!topic) {
    sheet.getRange('A2').setValue('Please enter a topic in A1.');
    return;
  }

  const ideas = callGemini_('Give me 5 creative ideas about: ' + topic);
  sheet.getRange('A2').setValue(ideas);
}

/* =====================================================================
 * EXAMPLE 2 – A1 topic → A3:A7 (one idea per row)
 * Sheet: Ideas_Emails
 * ===================================================================== */

function sheets_topicIdeasPerRow() {
  const sheet = getActiveSheetOrError_();
  const topic = sheet.getRange('A1').getValue();

  if (!topic) {
    sheet.getRange('A2').setValue('Please enter a topic in A1.');
    return;
  }

  const response = callGemini_(
    'Give me 5 short bullet-point ideas (one per line) about: ' + topic
  );

  const lines = response
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => [line.replace(/^\-+\s*/, '').trim()]);

  if (lines.length === 0) {
    sheet.getRange('A3').setValue('No ideas generated.');
    return;
  }

  sheet.getRange(3, 1, lines.length, 1).setValues(lines);
}

/* =====================================================================
 * EXAMPLE 3 – Explain formula in active cell
 * Sheet: any (but easiest on Ideas_Emails)
 * ===================================================================== */

function sheets_explainFormula() {
  const sheet = getActiveSheetOrError_();
  const cell = sheet.getActiveCell();
  const formula = cell.getFormula();

  if (!formula) {
    SpreadsheetApp.getUi().alert('Active cell does not contain a formula.');
    return;
  }

  const explanation = callGemini_(
    'Explain what this Google Sheets formula does in simple terms:\n\n' +
      formula
  );
  SpreadsheetApp.getUi().alert(explanation);
}

/* =====================================================================
 * EXAMPLE 4 – Translate A2:A → B2:B into chosen language
 * Sheet: Translate_Summary
 * ===================================================================== */

function sheets_translateColumn() {
  const sheet = getActiveSheetOrError_();
  const ui = SpreadsheetApp.getUi();

  const langPrompt = ui.prompt(
    'Translation',
    'Translate to which language? (e.g., Spanish, French)',
    ui.ButtonSet.OK_CANCEL
  );

  if (langPrompt.getSelectedButton() !== ui.Button.OK) return;

  const targetLang = langPrompt.getResponseText().trim();
  if (!targetLang) {
    ui.alert('Please enter a valid language.');
    return;
  }

  const values = sheet.getRange('A2:A').getValues();
  const out = [];

  values.forEach(row => {
    const text = row[0];
    if (!text) {
      out.push(['']);
      return;
    }
    const translated = callGemini_(
      'Translate the following text into ' + targetLang + ':\n\n' + text
    );
    out.push([translated]);
  });

  sheet.getRange(2, 2, out.length, 1).setValues(out);
}

/* =====================================================================
 * EXAMPLE 5 – Extract TODOs from meeting notes in A1 → B2:B
 * Sheet: Ideas_Emails
 * ===================================================================== */

function sheets_todosFromNotes() {
  const sheet = getActiveSheetOrError_();
  const notes = sheet.getRange('A1').getValue();

  if (!notes) {
    sheet.getRange('B1').setValue('Enter meeting notes in A1 first.');
    return;
  }

  const result = callGemini_(
    'From these meeting notes, extract a list of clear action items. ' +
      'Return one item per line:\n\n' +
      notes
  );

  const lines = result
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => [line.replace(/^\-+\s*/, '').trim()]);

  if (lines.length === 0) {
    sheet.getRange('B2').setValue('No action items found.');
    return;
  }

  sheet.getRange(2, 2, lines.length, 1).setValues(lines);
}

/* =====================================================================
 * EXAMPLE 6 – Email draft from topic + recipient (A1, B1, C1 → D1)
 * Sheet: Ideas_Emails
 * ===================================================================== */

function sheets_emailDraft() {
  const sheet = getActiveSheetOrError_();
  const topic = sheet.getRange('A1').getValue();
  const recipient = sheet.getRange('B1').getValue();
  const context = sheet.getRange('C1').getValue();

  if (!topic || !recipient) {
    sheet
      .getRange('D1')
      .setValue('Please enter a topic in A1 and recipient name in B1.');
    return;
  }

  const draft = callGemini_(
    'Write a polite email to ' +
      recipient +
      ' about: ' +
      topic +
      '.\n\nExtra context (optional):\n' +
      (context || '(none)')
  );

  sheet.getRange('D1').setValue(draft);
}

/* =====================================================================
 * EXAMPLE 7 – Meeting summary from A2:A10 → B1
 * Sheet: Translate_Summary
 * ===================================================================== */

function sheets_meetingSummary() {
  const sheet = getActiveSheetOrError_();
  const values = sheet.getRange('A2:A10').getValues();

  const notes = values
    .map(row => row[0])
    .filter(Boolean)
    .map(line => '- ' + line)
    .join('\n');

  if (!notes) {
    sheet.getRange('B1').setValue('Add meeting notes in A2:A10 first.');
    return;
  }

  const summary = callGemini_(
    'Summarize these meeting notes into a short paragraph and 3 bullet points:\n\n' +
      notes
  );

  sheet.getRange('B1').setValue(summary);
}

/* =====================================================================
 * EXAMPLE 8 – Tutor answer from A1 question → B1
 * Sheet: Tutor
 * ===================================================================== */

function sheets_tutorAnswer() {
  const sheet = getActiveSheetOrError_();
  const question = sheet.getRange('A1').getValue();

  if (!question) {
    sheet
      .getRange('B1')
      .setValue('Enter a question in A1, e.g. "What is a JavaScript closure?"');
    return;
  }

  const answer = callGemini_(
    'You are a patient tutor. Answer this question step by step in simple language:\n\n' +
      question
  );

  sheet.getRange('B1').setValue(answer);
}

/* =====================================================================
 * SAMPLE DATA SETUP
 * ===================================================================== */

/**
 * Populate sample data for all Gemini + Sheets examples.
 *
 * Creates (or reuses) three sheets:
 *  - Ideas_Emails        → topic ideas, ideas per row, email draft, TODOS
 *  - Translate_Summary   → translation + meeting summary
 *  - Tutor               → tutor-style Q&A
 */
function setupGeminiExampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Open a Google Sheet and bind this script to it first.');
  }

  setupIdeasEmailsSheet_(ss);
  setupTranslateSummarySheet_(ss);
  setupTutorSheet_(ss);

  SpreadsheetApp.getUi().alert(
    'Sample data created.\n\n' +
      'Sheets:\n' +
      '- Ideas_Emails\n' +
      '- Translate_Summary\n' +
      '- Tutor\n\n' +
      'Switch to a sheet, then run the matching functions (e.g. sheets_topicIdeas).'
  );
}

/**
 * Create or reset the Ideas_Emails sheet.
 *
 * Used by:
 *  - sheets_topicIdeas()
 *  - sheets_topicIdeasPerRow()
 *  - sheets_todosFromNotes()
 *  - sheets_emailDraft()
 */
function setupIdeasEmailsSheet_(ss) {
  const name = 'Ideas_Emails';
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);

  // Clear a safe range (don’t nuke entire workbook)
  sheet.getRange('A1:D20').clearContent();

  // A1: topic (for ideas, ideas per row, TODOS, email draft)
  sheet.getRange('A1').setValue('Onboarding new JavaScript students');

  // B1: recipient name (for email draft)
  sheet.getRange('B1').setValue('Alex');

  // C1: extra context (for email draft)
  sheet.getRange('C1').setValue(
    'Alex just enrolled in an online JavaScript bootcamp and is a bit nervous.'
  );

  // A2:A6: sample meeting notes (also work as "things to generate TODOS from")
  const meetingNotes = [
    ['Discussed welcome email sequence for new JS students'],
    ['Need a short orientation message for the LMS'],
    ['Decide on weekly Q&A time for live support'],
    ['Remind students about project-based learning focus'],
    ['Create a quick-start guide with 3 simple exercises']
  ];
  sheet.getRange(2, 1, meetingNotes.length, 1).setValues(meetingNotes);

  // Notes for clarity
  sheet.getRange('A1').setNote('Topic / General context');
  sheet.getRange('B1').setNote('Recipient name for email draft');
  sheet.getRange('C1').setNote('Extra context for email draft');
  sheet
    .getRange('A2')
    .setNote('Meeting notes / content used by sheets_todosFromNotes().');
}

/**
 * Create or reset the Translate_Summary sheet.
 *
 * Used by:
 *  - sheets_translateColumn()
 *  - sheets_meetingSummary()
 */
function setupTranslateSummarySheet_(ss) {
  const name = 'Translate_Summary';
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);

  sheet.getRange('A1:B20').clearContent();

  // A1: label / hint
  sheet.getRange('A1').setValue('Meeting notes & phrases (A2:A)');

  // A2:A7: text used BOTH as phrases to translate and as meeting notes
  const phrases = [
    ['Welcome to the JavaScript online bootcamp.'],
    ['Remember to review the DOM basics before the first project.'],
    ['Office hours are available every Wednesday afternoon.'],
    ['Ask questions early if you feel stuck on an exercise.'],
    ['Collaboration on projects is encouraged, but submit your own code.'],
    ['Watch the intro video before starting Lesson 1.']
  ];
  sheet.getRange(2, 1, phrases.length, 1).setValues(phrases);

  sheet.getRange('A1').setNote(
    'A2:A will be translated by sheets_translateColumn() and summarized by sheets_meetingSummary().'
  );
}

/**
 * Create or reset the Tutor sheet.
 *
 * Used by:
 *  - sheets_tutorAnswer()
 */
function setupTutorSheet_(ss) {
  const name = 'Tutor';
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);

  sheet.getRange('A1:B10').clearContent();

  // A1: question for tutor-style answer
  sheet
    .getRange('A1')
    .setValue('What is a JavaScript closure and why is it useful?');

  sheet
    .getRange('A1')
    .setNote(
      'Used by sheets_tutorAnswer() to generate a step-by-step explanation.'
    );
}

/**
 * Optional helper: quickly switch to a named sheet.
 * Example: switchToSheet_('Ideas_Emails')
 */
function switchToSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet not found: ' + name);
  }
  ss.setActiveSheet(sheet);
}

/* =====================================================================
 * SIMPLE TEST RUNNER
 * ===================================================================== */

/**
 * Run a subset of examples (non-interactive).
 * Make sure data is set up with setupGeminiExampleData() first.
 */
function test_allSheetsExamples() {
  // Assumes you have run setupGeminiExampleData() and are on the right sheets
  switchToSheet_('Ideas_Emails');
  sheets_topicIdeas();
  sheets_topicIdeasPerRow();
  sheets_todosFromNotes();
  sheets_emailDraft();

  switchToSheet_('Translate_Summary');
  sheets_meetingSummary();

  switchToSheet_('Tutor');
  sheets_tutorAnswer();
}
