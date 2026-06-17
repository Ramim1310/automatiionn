# Live Demo
https://automatiionn.vercel.app/


# Student Data Entry Automation

A full-stack application that leverages AI to extract structured student information from raw, unstructured text and automatically saves it to a Google Sheet. Built with a React (Vite) frontend and a Node.js (Express) backend.

## Features

- **AI-Powered Data Extraction:** Uses the Groq API (`llama-3.3-70b-versatile` model) to accurately parse raw text into structured JSON data. Extracts names, academic records (SSC, HSC, Bachelor), passport status, language tests, preferred degrees, and more.
- **Google Sheets Integration:** Automatically appends extracted records to a Google Sheet using the Google Sheets API. It also applies styling (background color, text wrapping, and alignment) to ensure the sheet is easy to read.
- **Modern UI:** The frontend is built with React and Tailwind CSS, featuring a clean, dynamic, and responsive UI with glassmorphism elements, toasts for notifications, and smooth animations.
- **Review and Edit:** Users can review the AI-extracted data in a JSON editor panel before committing it to the Google Sheet.

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Hot Toast
- Axios

**Backend:**
- Node.js & Express
- Groq SDK
- Googleapis & Google-auth-library
- Google-spreadsheet
- CORS & Dotenv

## Prerequisites

Before running this application, you need to set up the following:

1. **Groq API Key:** Get an API key from [Groq Console](https://console.groq.com/).
2. **Google Cloud Service Account:** 
   - Create a service account in the Google Cloud Console.
   - Enable the Google Sheets API.
   - Generate and download the JSON key file.
3. **Google Sheet:** Create a blank Google Sheet and share it with the service account email (grant "Editor" access). Note the Spreadsheet ID from the URL.

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_SHEET_ID=your_google_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=http://localhost:5173
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository_url>
cd automatiionn
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```
The backend server will start on `http://localhost:5000`.

### 3. Setup Frontend

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Deployment

This project includes a `render.yaml` file for easy deployment of the backend as a Web Service on [Render](https://render.com/). 

To deploy the frontend, you can use Vercel, Netlify, or Render (configured as a Static Site). Ensure that the `FRONTEND_URL` environment variable is updated in your backend deployment to match your production frontend URL.
