# Gemini Apps Script Examples – Shared Helpers, Docs, and Sheets

This repo contains a small, modular setup for using **Gemini** with **Google Apps Script** across:

- Google Docs (content assistance, summaries, quizzes, comments)
- Google Sheets (ideas, translations, summaries, emails, tutor answers)

All examples share the same **SharedHelpers.gs** file so you only configure your Gemini API key once.

## Files

- `SharedHelpers.gs` — Core helpers:
  - `getGeminiApiKey_()`
  - `callGemini(prompt)`
  - `getActiveSheetOrError_()`
- `DocsExamples.gs` — 5 examples for Google Docs
- `SheetsExamples.gs` — 8 examples for Google Sheets
- `appsscript.json` — Script manifest with required scopes

> You can use the same three files in either a Docs-bound or Sheets-bound project.  
> Docs examples will only work when bound to a Doc. Sheets examples only when bound to a Sheet.

## Setup

### 1. Create a new Apps Script project

For **Docs**:

1. Open a Google Doc.
2. Go to **Extensions → Apps Script**.

For **Sheets**:

1. Open a Google Sheet.
2. Go to **Extensions → Apps Script**.

### 2. Add the files

In the Apps Script editor:

1. Create three script files:
   - `SharedHelpers.gs`
   - `DocsExamples.gs`
   - `SheetsExamples.gs`
2. Paste the matching contents from this repo into each file.
3. (Optional) Update `appsscript.json` in **Project Settings → Script manifest** so scopes match.

### 3. Add your Gemini API key

In the Apps Script editor:

1. Open **Project Settings**.
2. Under **Script properties**, click **Add script property**.
3. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key string
4. Save.

Now the `callGemini(prompt)` helper can use your key to call the Gemini API.

---

## Docs Examples (DocsExamples.gs)

These require a **Docs-bound** script.

- `docs_summarizeSelection()`  
  Summarize selected text into a short paragraph.

- `docs_rewriteSimpler()`  
  Rewrite selected text at a lower reading level.

- `docs_generateOutlineFromTopic()`  
  Prompt for a topic and insert a bullet-point outline into the document.

- `docs_quizFromSelection()`  
  Generate multiple-choice questions from selected text.

- `docs_suggestComment()`  
  Suggest one constructive comment for the selected text.

Usage:

1. Select some text in your Doc (for selection-based examples).
2. In the Script editor, run one of the above functions.
3. Authorize the script the first time you run it.

---

## Sheets Examples (SheetsExamples.gs)

These require a **Sheets-bound** script.

- `GEMINI(prompt)` – custom function  
  Use in any cell, e.g.:
  ```none
  =GEMINI("Write a haiku about JavaScript.")
  ```

- `sheets_topicIdeas()`  
  A1 topic → A2 ideas (single cell).

- `sheets_topicIdeasPerRow()`  
  A1 topic → A3:A7 one idea per row.

- `sheets_explainActiveFormula()`  
  Explain the formula in the active cell in plain language.

- `sheets_translateAtoB()`  
  Translate texts in `A2:A` into `B2:B` for a chosen language.

- `sheets_todosFromNotes()`  
  Meeting notes in `A1` → TODO items in `B2:B`.

- `sheets_emailDraftFromInputs()`  
  A1 topic, B1 recipient, C1 context → email draft in `D1`.

- `sheets_meetingSummaryFromRange()`  
  Notes in `A2:A10` → summary in `B1`.

- `sheets_tutorAnswerFromQuestion()`  
  Question in `A1` → step-by-step answer in `B1`.

---

## Tips

- Use one Apps Script project per container:
  - For Docs: include `SharedHelpers.gs` + `DocsExamples.gs`.
  - For Sheets: include `SharedHelpers.gs` + `SheetsExamples.gs`.
- Reuse `SharedHelpers.gs` across many projects to keep your logic DRY.
- You can extend `callGemini(prompt)` with extra parameters (model, temperature, system instructions) as you grow.

Enjoy experimenting with **Gemini + Apps Script** for Docs and Sheets!
