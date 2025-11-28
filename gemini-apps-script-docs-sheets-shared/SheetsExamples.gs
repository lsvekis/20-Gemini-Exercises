/**
 * Gemini + Google Sheets Examples
 *
 * REQUIREMENT:
 *  - This project must be bound to a Google Sheet (open a Sheet → Extensions → Apps Script).
 *  - SharedHelpers.gs must be in the same project (for callGemini() and getActiveSheetOrError_()).
 */

/**
 * CUSTOM FUNCTION — Use directly in Sheets:
 *   =GEMINI("Write a haiku about coding.")
 *
 * @customfunction
 */
function GEMINI(prompt) {
  if (typeof prompt !== 'string') {
    return 'Prompt must be a string.';
  }
  return callGemini(prompt);
}

/**
 * EXAMPLE 1 — A1 topic → A2 ideas (single cell)
 */
function sheets_topicIdeas() {
  const sheet = getActiveSheetOrError_();
  const topic = sheet.getRange('A1').getValue();

  if (!topic) {
    sheet.getRange('A2').setValue('Please enter a topic in A1.');
    return;
  }

  const ideas = callGemini('Give me 5 creative ideas about: ' + topic);
  sheet.getRange('A2').setValue(ideas);
}

/**
 * EXAMPLE 2 — A1 topic → A3:A7 (one idea per row)
 */
function sheets_topicIdeasPerRow() {
  const sheet = getActiveSheetOrError_();
  const topic = sheet.getRange('A1').getValue();

  if (!topic) {
    sheet.getRange('A2').setValue('Please enter a topic in A1.');
    return;
  }

  const response = callGemini(
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

/**
 * EXAMPLE 3 — Explain formula in active cell
 */
function sheets_explainActiveFormula() {
  const sheet = getActiveSheetOrError_();
  const cell = sheet.getActiveCell();
  const formula = cell.getFormula();

  if (!formula) {
    SpreadsheetApp.getUi().alert('Active cell does not contain a formula.');
    return;
  }

  const explanation = callGemini(
    'Explain what this Google Sheets formula does in simple terms:\n\n' +
      formula
  );
  SpreadsheetApp.getUi().alert(explanation);
}

/**
 * EXAMPLE 4 — Translate A2:A → B2:B into chosen language
 */
function sheets_translateAtoB() {
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
    const translated = callGemini(
      'Translate the following text into ' + targetLang + ':\n\n' + text
    );
    out.push([translated]);
  });

  sheet.getRange(2, 2, out.length, 1).setValues(out);
}

/**
 * EXAMPLE 5 — Extract TODOs from meeting notes in A1 → B2:B
 */
function sheets_todosFromNotes() {
  const sheet = getActiveSheetOrError_();
  const notes = sheet.getRange('A1').getValue();

  if (!notes) {
    sheet.getRange('B1').setValue('Enter meeting notes in A1 first.');
    return;
  }

  const result = callGemini(
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

/**
 * EXAMPLE 6 — Email draft from topic + recipient (A1, B1, C1 → D1)
 */
function sheets_emailDraftFromInputs() {
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

  const draft = callGemini(
    'Write a polite email to ' +
      recipient +
      ' about: ' +
      topic +
      '.\n\nExtra context (optional):\n' +
      (context || '(none)')
  );

  sheet.getRange('D1').setValue(draft);
}

/**
 * EXAMPLE 7 — Meeting summary from A2:A10 → B1
 */
function sheets_meetingSummaryFromRange() {
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

  const summary = callGemini(
    'Summarize these meeting notes into a short paragraph and 3 bullet points:\n\n' +
      notes
  );

  sheet.getRange('B1').setValue(summary);
}

/**
 * EXAMPLE 8 — Tutor answer from A1 question → B1
 */
function sheets_tutorAnswerFromQuestion() {
  const sheet = getActiveSheetOrError_();
  const question = sheet.getRange('A1').getValue();

  if (!question) {
    sheet
      .getRange('B1')
      .setValue('Enter a question in A1, e.g. "What is a JavaScript closure?"');
    return;
  }

  const answer = callGemini(
    'You are a patient tutor. Answer this question step by step in simple language:\n\n' +
      question
  );

  sheet.getRange('B1').setValue(answer);
}
