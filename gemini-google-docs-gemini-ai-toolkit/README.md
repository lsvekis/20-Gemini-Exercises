# Gemini + Google Docs AI Toolkit

This repo contains a **Google Docs–only** Gemini toolkit with:

- `SharedHelpers.gs` — Gemini API helpers (API key management + HTTP call)
- `DocsExamples.gs` — 10 Gemini-powered Docs functions
- `DocsMenu.gs` — Custom **"Gemini AI"** menu for easy access

## Features

Inside Google Docs, you can:

1. Summarize selected text
2. Rewrite text at a Grade 6 reading level
3. Generate a bullet-point outline from a topic
4. Create multiple-choice quiz questions from selected text
5. Suggest one constructive writing comment
6. Expand selected text with more detail
7. Rewrite text in a more professional tone
8. Generate catchy title ideas from selected text
9. Turn selected text into key bullet-point takeaways
10. Proofread selected text and suggest improvements

All functions use the shared `callGemini(prompt)` helper.

## Setup

1. Open a Google Doc.
2. Go to **Extensions → Apps Script**.
3. Create three files in the script editor:
   - `SharedHelpers.gs`
   - `DocsExamples.gs`
   - `DocsMenu.gs`
4. Copy each file's content from this repo into the matching Apps Script file.

### Add your Gemini API key

In the Apps Script editor:

1. Open **Project Settings**.
2. Under **Script properties**, click **Add script property**.
3. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key string
4. Save.

## Use in Google Docs

1. Reload the Doc (or run `onOpen()` once from the script editor).
2. You will see a new **"Gemini AI"** menu.
3. Select some text and choose:
   - **Summarize selection**
   - **Rewrite simpler (Grade 6)**
   - **Create quiz from selection**
   - **Suggest writing comment**
   - **Expand selection (more detail)**
   - **Rewrite in professional tone**
   - **Generate title ideas**
   - **Key bullet takeaways**
   - **Proofread & suggest improvements**
4. For **Outline from topic**, choose the menu item and enter a topic in the prompt dialog.

You now have an AI-powered writing assistant living directly inside Google Docs.
