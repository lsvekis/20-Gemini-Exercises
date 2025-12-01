# Gemini + Google Sheets AI Toolkit

This repo contains a **Google Sheets–only** Gemini toolkit with:

- `SharedHelpers.gs` — Gemini API helpers (API key management + HTTP call + sheet helper)
- `SheetsExamples.gs` — 13 Gemini-powered Sheets functions
- `SheetsMenu.gs` — Custom **"Gemini AI"** menu for easy access

## Features

Inside Google Sheets, you can:

### Core Tools

1. `=GEMINI("prompt")` custom function
2. A1 topic → A2 ideas (single cell)
3. A1 topic → A3:A7 one idea per row
4. Explain the active cell formula
5. Translate A2:A → B2:B into a chosen language
6. Extract TODOs from meeting notes in A1 → B2:B
7. Generate email drafts from A1/B1/C1 → D1
8. Summarize meeting notes from A2:A10 → B1
9. Tutor-style answers from A1 question → B1

### New Toolkit Extensions

10. Categorize text in A2:A → category labels in B2:B
11. Summarize notes in A2:A → short summaries in B2:B
12. Extract keywords/tags from A2:A → comma-separated tags in B2:B
13. Suggest column headers from topic in A1 → headers in row 2
14. Generate a Google Sheets formula from a plain-language description in A1 → B1

All functions use the shared `callGemini(prompt)` helper.

## Setup

1. Open a Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Create three files in the script editor:
   - `SharedHelpers.gs`
   - `SheetsExamples.gs`
   - `SheetsMenu.gs`
4. Copy each file's content from this repo into the matching Apps Script file.

### Add your Gemini API key

In the Apps Script editor:

1. Open **Project Settings**.
2. Under **Script properties**, click **Add script property**.
3. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key string
4. Save.

## Use in Google Sheets

1. Reload the Sheet (or run `onOpen()` once from the script editor).
2. You will see a new **"Gemini AI"** menu.
3. Try the examples:

- Put a topic in **A1** and run:
  - **Idea: A1 → A2 (block)**
  - **Ideas: A1 → A3:A7 (rows)**

- Put text in **A2:A** and run:
  - **Translate A2:A → B2:B**
  - **Categorize A2:A → B2:B**
  - **Summarize notes A2:A → B2:B**
  - **Keywords from A2:A → B2:B**

- Put meeting notes in **A1** or **A2:A10** and run:
  - **TODOs from notes in A1**
  - **Meeting summary A2:A10 → B1**

- Put an email topic/recipient/context in **A1/B1/C1** and run:
  - **Email draft from A1/B1/C1 → D1**

- Put a question in **A1** and run:
  - **Tutor answer from A1 → B1**

- Put a sheet topic in **A1** and run:
  - **Suggest headers from topic in A1**

- Put a natural-language formula description in **A1** and run:
  - **Generate formula from description in A1 → B1**

You now have an AI-powered data assistant living directly inside Google Sheets.
