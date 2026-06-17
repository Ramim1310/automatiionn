import { useState, useEffect } from 'react';

/**
 * A single field row in the review table.
 */
function FieldRow({ label, value, highlight }) {
  const display = value !== null && value !== undefined && value !== '' ? String(value) : '—';
  const isEmpty = display === '—';

  return (
    <tr className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${highlight ? 'bg-blue-50/50' : ''}`}>
      <td className="py-2.5 px-4 field-label text-slate-400 w-44 whitespace-nowrap">{label}</td>
      <td className={`py-2.5 px-4 text-sm font-medium ${isEmpty ? 'text-slate-400 italic' : 'text-slate-800'}`}>
        {display}
      </td>
    </tr>
  );
}

/**
 * Section header row inside the table.
 */
function SectionRow({ title, icon }) {
  return (
    <tr>
      <td colSpan={2} className="pt-5 pb-1 px-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
      </td>
    </tr>
  );
}

export default function ReviewPanel({ data, onSave, onDataChange, isSaving }) {
  const academic = data?.academic || {};
  const ssc = academic.ssc || {};
  const hsc = academic.hsc || {};
  const bsc = academic.bsc || {};

  // ── Editable JSON state ───────────────────────────────────────────────────
  const [jsonText, setJsonText] = useState('');
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonError, setJsonError] = useState('');

  // ── Feedback state ────────────────────────────────────────────────────────
  const [feedback, setFeedback] = useState(data?.feedback ?? '');

  // Sync jsonText whenever data changes from outside (new parse)
  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2));
    setJsonError('');
    setFeedback(data?.feedback ?? '');
  }, [data]);

  // Apply edited JSON back to parent
  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonError('');
      onDataChange({ ...parsed, feedback });
    } catch {
      setJsonError('⚠ Invalid JSON — please fix syntax errors before applying.');
    }
  };

  // Apply feedback change to parent data
  const handleFeedbackChange = (e) => {
    const val = e.target.value;
    setFeedback(val);
    onDataChange({ ...data, feedback: val });
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4 h-full animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Review Extracted Data</h2>
          <p className="text-xs text-slate-500 mt-0.5">Verify the AI extraction before saving</p>
        </div>
        <span className="badge bg-blue-50 text-blue-700 border border-blue-200">
          ✦ AI Extracted
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin rounded-xl border border-slate-200">
        <table className="w-full">
          <tbody>
            {/* Personal Info */}
            <SectionRow title="Personal Information" icon="👤" />
            <FieldRow label="Full Name" value={data?.name} highlight />
            <FieldRow label="Birth Year" value={data?.birth_year} />
            <FieldRow label="Phone" value={data?.phone} />
            <FieldRow label="Passport" value={data?.passport} />
            <FieldRow label="Language Test" value={data?.language} />
            <FieldRow label="Subject Interest" value={data?.subject} />
            <FieldRow label="Preferred Degree" value={data?.preferred_degree} />

            {/* Academic — SSC */}
            <SectionRow title="SSC" icon="📘" />
            <FieldRow label="SSC Result" value={ssc.result} />
            <FieldRow label="SSC Year" value={ssc.year} />

            {/* Academic — HSC */}
            <SectionRow title="HSC" icon="📗" />
            <FieldRow label="HSC Result" value={hsc.result} />
            <FieldRow label="HSC Year" value={hsc.year} />

            {/* Academic — Bachelor */}
            <SectionRow title="Bachelor" icon="🎓" />
            <FieldRow label="Bachelor Result" value={bsc.result} />
            <FieldRow label="Bachelor Year" value={bsc.year} />
          </tbody>
        </table>
      </div>

      {/* ── Feedback field ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
          💬 Feedback / Notes
        </label>
        <textarea
          id="field-feedback"
          rows={2}
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Add any notes or feedback for this record…"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* ── Editable JSON ───────────────────────────────────────────────────── */}
      <details
        className="text-xs"
        open={jsonOpen}
        onToggle={(e) => setJsonOpen(e.target.open)}
      >
        <summary className="cursor-pointer text-slate-500 hover:text-slate-700 transition-colors select-none">
          {jsonOpen ? '▾ Hide' : '▸ Edit'} raw JSON
        </summary>

        <div className="mt-2 flex flex-col gap-2">
          <textarea
            id="field-raw-json"
            rows={10}
            value={jsonText}
            onChange={(e) => { setJsonText(e.target.value); setJsonError(''); }}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {jsonError && (
            <p className="text-[11px] text-red-600">{jsonError}</p>
          )}
          <button
            id="btn-apply-json"
            onClick={handleApplyJson}
            className="self-end px-4 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all"
          >
            ✓ Apply JSON changes
          </button>
        </div>
      </details>

      {/* Save button */}
      <button
        id="btn-approve-save"
        onClick={onSave}
        disabled={isSaving}
        className="btn-success w-full py-3.5 text-base"
      >
        {isSaving ? (
          <>
            <svg className="animate-spin-slow w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving to Google Sheets…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
            Approve &amp; Export to Google Sheets
          </>
        )}
      </button>
    </div>
  );
}
