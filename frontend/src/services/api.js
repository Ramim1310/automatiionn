import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Send raw unstructured text to Groq for parsing.
 * @param {string} text - The raw student data text.
 * @returns {Promise<Object>} The parsed student JSON.
 */
export const parseStudentText = async (text) => {
  try {
    const { data } = await api.post('/parse', { text });
    return data.data;
  } catch (err) {
    // Re-throw with a clean message the UI can display directly
    const msg =
      err?.response?.data?.error ||
      (err?.response?.status === 429
        ? '⏳ Groq quota exceeded. Please wait 1–2 minutes and try again.'
        : 'Failed to process text. Check server or API key.');
    throw new Error(msg);
  }
};

/**
 * Save approved student data to MongoDB + Excel.
 * @param {Object} studentData - The parsed and reviewed student object.
 * @returns {Promise<Object>} Success message and MongoDB id.
 */
export const saveStudent = async (studentData) => {
  const { data } = await api.post('/save', studentData);
  return data;
};
