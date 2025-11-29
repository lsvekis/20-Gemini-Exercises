/**
 * Gemini + Google Docs Examples
 *
 * REQUIREMENT:
 *  - This project must be bound to a Google Doc (open a Doc → Extensions → Apps Script).
 *  - SharedHelpers.gs must be in the same project (for callGemini()).
 */

/**
 * Utility – Get selected text from the current Google Doc.
 */
function getSelectedText_() {
  const doc = DocumentApp.getActiveDocument();
  const sel = doc.getSelection();

  if (!sel) {
    DocumentApp.getUi().alert('Select some text first.');
    return '';
  }

  let text = '';
  sel.getRangeElements().forEach(el => {
    const element = el.getElement();
    if (element.editAsText) {
      text += element.asText().getText() + '\n';
    }
  });

  if (!text.trim()) {
    DocumentApp.getUi().alert('Selected text is empty.');
    return '';
  }

  return text;
}

/**
 * EXAMPLE 1 — Summarize selected text
 */
function docs_summarizeSelection() {
  const text = getSelectedText_();
  if (!text) return;

  const summary = callGemini(
    'Summarize this text in a short paragraph:\n\n' + text
  );
  DocumentApp.getUi().alert(summary);
}

/**
 * EXAMPLE 2 — Rewrite selected text in simpler language
 */
function docs_rewriteSimpler() {
  const text = getSelectedText_();
  if (!text) return;

  const simpler = callGemini(
    'Rewrite the following text at a Grade 6 reading level:\n\n' + text
  );
  DocumentApp.getUi().alert(simpler);
}

/**
 * EXAMPLE 3 — Generate outline from a topic (prompt dialog)
 */
function docs_generateOutlineFromTopic() {
  const ui = DocumentApp.getUi();
  const response = ui.prompt(
    'Outline Generator',
    'Enter a topic:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const topic = response.getResponseText().trim();
  if (!topic) {
    ui.alert('Please enter a topic.');
    return;
  }

  const outline = callGemini(
    'Create a short bullet-point outline for this topic:\n\n' + topic
  );

  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.appendParagraph('\nOutline for: ' + topic).setBold(true);
  body.appendParagraph(outline);
}

/**
 * EXAMPLE 4 — Create quiz questions from selected text
 */
function docs_quizFromSelection() {
  const text = getSelectedText_();
  if (!text) return;

  const quiz = callGemini(
    'Based on the text below, create 5 multiple choice questions with 4 options each and mark the correct answer:\n\n' +
      text
  );

  const body = DocumentApp.getActiveDocument().getBody();
  body.appendParagraph('\nGenerated Quiz:').setBold(true);
  body.appendParagraph(quiz);
}

/**
 * EXAMPLE 5 — Suggest a constructive comment for selected text
 */
function docs_suggestComment() {
  const text = getSelectedText_();
  if (!text) return;

  const comment = callGemini(
    'You are a helpful writing coach. Suggest one constructive comment to improve this text:\n\n' +
      text
  );

  DocumentApp.getUi().alert('Suggested comment:\n\n' + comment);
}

/**
 * EXAMPLE 6 — Expand selected text with more detail
 */
function docs_expandSelectionDetail() {
  const text = getSelectedText_();
  if (!text) return;

  const expanded = callGemini(
    'Expand the following text with more detail, explanations, and one or two examples. ' +
      'Keep it clear and easy to read:\n\n' +
      text
  );

  DocumentApp.getUi().alert(expanded);
}

/**
 * EXAMPLE 7 — Rewrite in more professional tone
 */
function docs_rewriteProfessionalTone() {
  const text = getSelectedText_();
  if (!text) return;

  const rewritten = callGemini(
    'Rewrite the following text in a more professional, polite tone. ' +
      'Keep the meaning the same:\n\n' +
      text
  );

  DocumentApp.getUi().alert(rewritten);
}

/**
 * EXAMPLE 8 — Generate title ideas from selection
 */
function docs_generateTitleIdeas() {
  const text = getSelectedText_();
  if (!text) return;

  const ideas = callGemini(
    'Based on the text below, suggest 5 short, catchy title ideas. ' +
      'Each title should be on its own line:\n\n' +
      text
  );

  DocumentApp.getUi().alert('Suggested titles:\n\n' + ideas);
}

/**
 * EXAMPLE 9 — Convert selection to key bullet-point takeaways
 */
function docs_bulletSummaryFromSelection() {
  const text = getSelectedText_();
  if (!text) return;

  const bullets = callGemini(
    'Read the text below and extract 5–10 key bullet-point takeaways. ' +
      'Return them as a simple bullet list:\n\n' +
      text
  );

  const body = DocumentApp.getActiveDocument().getBody();
  body.appendParagraph('\nKey Takeaways:').setBold(true);
  body.appendParagraph(bullets);
}

/**
 * EXAMPLE 10 — Proofread & suggest improvements
 */
function docs_proofreadSelection() {
  const text = getSelectedText_();
  if (!text) return;

  const feedback = callGemini(
    'You are a careful editor. Read the text below and list any grammar, clarity, or tone issues. ' +
      'For each issue, suggest an improved version. Format your answer as a numbered list:\n\n' +
      text
  );

  DocumentApp.getUi().alert('Proofreading suggestions:\n\n' + feedback);
}
