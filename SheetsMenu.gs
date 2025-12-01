/**
 * Custom "Gemini AI" menu for Google Sheets.
 *
 * Appears when the spreadsheet is opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Gemini AI')
    .addItem('Idea: A1 → A2 (block)', 'sheets_topicIdeas')
    .addItem('Ideas: A1 → A3:A7 (rows)', 'sheets_topicIdeasPerRow')
    .addItem('Explain active formula', 'sheets_explainActiveFormula')
    .addSeparator()
    .addItem('Translate A2:A → B2:B', 'sheets_translateAtoB')
    .addItem('TODOs from notes in A1', 'sheets_todosFromNotes')
    .addSeparator()
    .addItem('Email draft from A1/B1/C1 → D1', 'sheets_emailDraftFromInputs')
    .addItem('Meeting summary A2:A10 → B1', 'sheets_meetingSummaryFromRange')
    .addItem('Tutor answer from A1 → B1', 'sheets_tutorAnswerFromQuestion')
    .addSeparator()
    // New examples
    .addItem('Categorize A2:A → B2:B', 'sheets_categorizeAtoB')
    .addItem('Summarize notes A2:A → B2:B', 'sheets_summarizeNotesAtoB')
    .addItem('Keywords from A2:A → B2:B', 'sheets_keywordsFromAtoB')
    .addItem('Suggest headers from topic in A1', 'sheets_suggestHeadersFromTopic')
    .addItem('Generate formula from description in A1 → B1', 'sheets_generateFormulaFromDescription')
    .addToUi();
}

/**
 * Optional helper if you want to re-add the menu manually.
 */
function showGeminiMenu() {
  onOpen();
}
