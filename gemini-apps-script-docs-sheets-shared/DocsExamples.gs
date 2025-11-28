/**
 * Gemini + Google Docs Examples
 *
 * REQUIREMENT:
 *  - This project must be bound to a Google Doc (open a Doc → Extensions → Apps Script).
 *  - SharedHelpers.gs must be in the same project (for callGemini()).
 */

/**
 * EXAMPLE 1 — Summarize selected text
 */
function docs_summarizeSelection() {
  const doc = DocumentApp.getActiveDocument();
  const sel = doc.getSelection();

  if (!sel) {
    DocumentApp.getUi().alert('Select some text first.');
    return;
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
    return;
  }

  const summary = callGemini('Summarize this text in a short paragraph:\n\n' + text);
  DocumentApp.getUi().alert(summary);
}

/**
 * EXAMPLE 2 — Rewrite selected text in simpler language
 */
function docs_rewriteSimpler() {
  const doc = DocumentApp.getActiveDocument();
  const sel = doc.getSelection();

  if (!sel) {
    DocumentApp.getUi().alert('Select some text first.');
    return;
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
    return;
  }

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
  const doc = DocumentApp.getActiveDocument();
  const sel = doc.getSelection();

  if (!sel) {
    DocumentApp.getUi().alert('Select some text first.');
    return;
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
    return;
  }

  const quiz = callGemini(
    'Based on the text below, create 5 multiple choice questions with 4 options each and mark the correct answer:\n\n' +
      text
  );

  const body = doc.getBody();
  body.appendParagraph('\nGenerated Quiz:').setBold(true);
  body.appendParagraph(quiz);
}

/**
 * EXAMPLE 5 — Suggest a constructive comment for selected text
 */
function docs_suggestComment() {
  const doc = DocumentApp.getActiveDocument();
  const sel = doc.getSelection();

  if (!sel) {
    DocumentApp.getUi().alert('Select some text first.');
    return;
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
    return;
  }

  const comment = callGemini(
    'You are a helpful writing coach. Suggest one constructive comment to improve this text:\n\n' +
      text
  );

  DocumentApp.getUi().alert('Suggested comment:\n\n' + comment);
}
