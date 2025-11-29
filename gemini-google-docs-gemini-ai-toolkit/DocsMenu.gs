/**
 * Custom "Gemini AI" menu for Google Docs.
 *
 * Appears when the document is opened.
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('Gemini AI')
    // Original 5
    .addItem('Summarize selection', 'docs_summarizeSelection')
    .addItem('Rewrite simpler (Grade 6)', 'docs_rewriteSimpler')
    .addItem('Generate outline from topic', 'docs_generateOutlineFromTopic')
    .addItem('Create quiz from selection', 'docs_quizFromSelection')
    .addItem('Suggest writing comment', 'docs_suggestComment')
    .addSeparator()
    // New 5
    .addItem('Expand selection (more detail)', 'docs_expandSelectionDetail')
    .addItem('Rewrite in professional tone', 'docs_rewriteProfessionalTone')
    .addItem('Generate title ideas', 'docs_generateTitleIdeas')
    .addItem('Key bullet takeaways from selection', 'docs_bulletSummaryFromSelection')
    .addItem('Proofread & suggest improvements', 'docs_proofreadSelection')
    .addToUi();
}

/**
 * Optional helper if you want to re-add the menu manually.
 */
function showGeminiMenu() {
  onOpen();
}
