# Gemini + Google Sheets Examples

This repo contains a **single, self-contained `Code.gs` file** with:

- Gemini helper functions (API key + HTTP calls)
- A custom function: `=GEMINI("your prompt")`
- 8 practical Sheets automations (ideas, translation, summaries, emails, tutor answers)
- A setup helper to populate sample data in three example sheets

## Files

- `Code.gs` — All logic, examples, and setup helpers.
- `appsscript.json` — Manifest with the required scopes.

## Setup

1. Create or open a **Google Sheet**.
2. Go to **Extensions → Apps Script**.
3. Delete any default code and paste the contents of `Code.gs`.
4. In the script editor, open **Project Settings → Script properties → Add script property**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key string
5. Save.

## Populate Sample Data

Run the following function from the Apps Script editor:

```js
setupGeminiExampleData();
```

This will create three sheets (or reset them if they already exist):

- `Ideas_Emails`
- `Translate_Summary`
- `Tutor`

## How to Use the Examples

### 1. Custom Function: =GEMINI()

In any cell, use:

```none
=GEMINI("Write a haiku about learning JavaScript.")
```

The function sends the prompt to Gemini and returns the response as cell text.

### 2. Ideas + Emails (`Ideas_Emails` sheet)

With `Ideas_Emails` active:

- `sheets_topicIdeas()`  
  Uses `A1` as the topic, writes 5 ideas to `A2`.

- `sheets_topicIdeasPerRow()`  
  Uses `A1` as the topic, writes 1 idea per row in `A3:A7`.

- `sheets_todosFromNotes()`  
  Uses `A1` + `A2:A…` meeting notes to extract TODOs into `B2:B…`.

- `sheets_emailDraft()`  
  Uses `A1` (topic), `B1` (recipient), `C1` (extra context) to generate an email in `D1`.

### 3. Translation + Summary (`Translate_Summary` sheet)

With `Translate_Summary` active:

- `sheets_translateColumn()`  
  Prompts for a language, then translates `A2:A` into `B2:B`.

- `sheets_meetingSummary()`  
  Summarizes notes in `A2:A10` into `B1`.

### 4. Tutor Answer (`Tutor` sheet)

With `Tutor` active:

- `sheets_tutorAnswer()`  
  Uses `A1` as the question, writes a step-by-step explanation into `B1`.

## Optional: Quick Test Runner

You can also run:

```js
test_allSheetsExamples();
```

> Make sure you’ve already run `setupGeminiExampleData()` and authorized the script.  
> The test runner will switch between sheets and invoke several examples automatically.

---

Enjoy experimenting with **Gemini + Google Sheets**!
