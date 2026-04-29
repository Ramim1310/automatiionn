const Groq = require('groq-sdk');
const Student = require('../models/Student');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { google } = require('googleapis');

// ─── Groq Client ────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_INSTRUCTION = `You are a precise data extraction assistant. 
Extract student information from the given unstructured text and return ONLY a valid JSON object with the following exact structure:

{
  "name": "string or null",
  "academic": {
    "ssc": { "result": "string or null", "year": number or null },
    "hsc": { "result": "string or null", "year": number or null },
    "bsc": { "result": "string or null", "year": number or null }
  },
  "passport": "Yes / No / passport number or null",
  "language": "test name and score string, or Yes / No, or null",
  "subject": "string or null",
  "preferred_degree": "string or null",
  "birth_year": number or null,
  "phone": "string or null"
}

Rules:
- If a field is missing or cannot be determined, set its value to null.
- For academic results, look for GPA, CGPA, grades like A+, or percentage scores.
- For academic years, extract 4-digit years only.
- Phone numbers must be stored as strings (to preserve leading zeros or country codes).
- Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

// ─── Controller: Parse Text with Groq ──────────────────────────────────────
const parseText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Input text is required.' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "{}";

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Groq response was not valid JSON:', responseText);
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.' });
    }

    return res.status(200).json({ data: parsedData });
  } catch (error) {
    console.error('Parse error:', error);

    // Distinguish quota errors for the frontend
    const isQuota =
      error?.status === 429 ||
      error?.message?.toLowerCase().includes('quota') ||
      error?.message?.toLowerCase().includes('rate limit');

    if (isQuota) {
      return res.status(429).json({
        error: 'Groq API quota exceeded. You are on the free tier — please wait 1–2 minutes and try again.',
      });
    }

    return res.status(500).json({ error: error.message || 'Failed to parse text with AI.' });
  }
};

// ─── Controller: Save Student Record ─────────────────────────────────────────
const saveStudent = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Student data is required.' });
    }

    // 1. Save to MongoDB
    const student = new Student(data);
    await student.save();
    console.log(`✅ Saved to MongoDB: ${student._id}`);

    // 2. Save to Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Access the first worksheet

    // Ensure headers exist
    try {
      await sheet.loadHeaderRow();
    } catch (err) {
      // If no headers exist, set them
      await sheet.setHeaderRow([
        'Name',
        'Birth Year',
        'SSC Result',
        'SSC Year',
        'HSC Result',
        'HSC Year',
        'BSc Result',
        'BSc Year',
        'Passport',
        'Language',
        'Interested Subject',
        'Preferred Degree',
        'Phone',
      ]);
    }

    const newRow = {
      'Name': data.name ?? '',
      'Birth Year': data.birth_year ?? '',
      'SSC Result': data.academic?.ssc?.result ?? '',
      'SSC Year': data.academic?.ssc?.year ?? '',
      'HSC Result': data.academic?.hsc?.result ?? '',
      'HSC Year': data.academic?.hsc?.year ?? '',
      'BSc Result': data.academic?.bsc?.result ?? '',
      'BSc Year': data.academic?.bsc?.year ?? '',
      'Passport': data.passport ?? '',
      'Language': data.language ?? '',
      'Interested Subject': data.subject ?? '',
      'Preferred Degree': data.preferred_degree ?? '',
      'Phone': data.phone ? `'${data.phone}` : '',
    };

    const addedRow = await sheet.addRow(newRow);
    console.log(`✅ Appended to Google Sheet: ${doc.title}`);

    // Format the header and the newly added row
    try {
      // Load a single range covering both the header row and the newly added row
      await sheet.loadCells(`A1:M${addedRow.rowNumber}`);

      // Format Header (Row 0)
      for (let i = 0; i < 13; i++) {
        const cell = sheet.getCell(0, i);
        cell.backgroundColor = { red: 59/255, green: 130/255, blue: 246/255 }; // Blue background
        cell.textFormat = { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }; // White text
        cell.horizontalAlignment = 'CENTER';
        cell.verticalAlignment = 'MIDDLE';
        cell.wrapStrategy = 'WRAP';
      }

      // Format New Data Row — wrap text and center align
      for (let i = 0; i < 13; i++) {
        const cell = sheet.getCell(addedRow.rowNumber - 1, i);
        cell.horizontalAlignment = 'CENTER';
        cell.verticalAlignment = 'MIDDLE';
        cell.wrapStrategy = 'WRAP';
      }

      await sheet.saveUpdatedCells();

      // Set minimum column widths for Interested Subject (col 10 = K) and Phone (col 12 = M)
      const sheetsApi = google.sheets({ version: 'v4', auth: serviceAccountAuth });
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
          requests: [
            {
              updateDimensionProperties: {
                range: { sheetId: sheet.sheetId, dimension: 'COLUMNS', startIndex: 10, endIndex: 11 }, // Interested Subject
                properties: { pixelSize: 160 },
                fields: 'pixelSize',
              },
            },
            {
              updateDimensionProperties: {
                range: { sheetId: sheet.sheetId, dimension: 'COLUMNS', startIndex: 12, endIndex: 13 }, // Phone
                properties: { pixelSize: 160 },
                fields: 'pixelSize',
              },
            },
          ],
        },
      });
    } catch (formatErr) {
      console.error('Warning: Could not apply cell formatting:', formatErr);
    }

    return res.status(201).json({
      message: '✅ Saved to Database & Google Sheets!',
      id: student._id,
    });
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({ error: error.message || 'Failed to save student record.' });
  }
};

module.exports = { parseText, saveStudent };
