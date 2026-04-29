import { useState } from 'react';
import toast from 'react-hot-toast';
import InputPanel from './components/InputPanel';
import ReviewPanel from './components/ReviewPanel';
import PlaceholderPanel from './components/PlaceholderPanel';
import LoadingPanel from './components/LoadingPanel';
import { parseStudentText, saveStudent } from './services/api';

export default function App() {
  const [studentData, setStudentData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // ── Process: send text to Groq via backend ────────────────────────────────
  const handleProcess = async (text) => {
    if (!text.trim()) return;
    setIsParsing(true);
    setStudentData(null);
    try {
      const data = await parseStudentText(text);
      setStudentData(data);
      toast.success('Data extracted successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to process text.');
    } finally {
      setIsParsing(false);
    }
  };

  // ── Save: persist to MongoDB + Excel ────────────────────────────────────────
  const handleSave = async () => {
    if (!studentData) return;
    setIsSaving(true);
    try {
      const result = await saveStudent(studentData);
      toast.success(result.message || 'Student saved successfully!');
      setSavedCount((c) => c + 1);
      setStudentData(null); // clear for next entry
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to save. Is MongoDB running?');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Right panel state machine ────────────────────────────────────────────────
  const renderRightPanel = () => {
    if (isParsing) return <LoadingPanel />;
    if (studentData) return <ReviewPanel data={studentData} onSave={handleSave} isSaving={isSaving} />;
    return <PlaceholderPanel />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">StudentAI</h1>
              <p className="text-[10px] text-slate-500 leading-none">Automated Data Entry</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {savedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {savedCount} saved this session
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Groq Llama 3.3
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Hero text */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Turn Unstructured Text into Structured Data
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Paste any raw student information — Groq AI will extract name, academic records, passport, language test, and more in seconds.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left — Input */}
          <section aria-label="Input panel">
            <InputPanel onProcess={handleProcess} isLoading={isParsing} />
          </section>

          {/* Right — Review */}
          <section aria-label="Review panel">
            {renderRightPanel()}
          </section>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-4 text-center">
        <p className="text-xs text-slate-600">
          Powered by <span className="text-blue-500">Groq</span> · MongoDB · Express · React
        </p>
      </footer>
    </div>
  );
}
