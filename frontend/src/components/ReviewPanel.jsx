/**
 * A single field row in the review table.
 */
function FieldRow({ label, value, highlight }) {
  const display = value !== null && value !== undefined && value !== '' ? String(value) : '—';
  const isEmpty = display === '—';

  return (
    <tr className={`border-b border-slate-700/60 transition-colors hover:bg-slate-800/40 ${highlight ? 'bg-blue-950/20' : ''}`}>
      <td className="py-2.5 px-4 field-label text-slate-400 w-44 whitespace-nowrap">{label}</td>
      <td className={`py-2.5 px-4 text-sm font-medium ${isEmpty ? 'text-slate-600 italic' : 'text-slate-100'}`}>
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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
      </td>
    </tr>
  );
}

export default function ReviewPanel({ data, onSave, isSaving }) {
  const academic = data?.academic || {};
  const ssc = academic.ssc || {};
  const hsc = academic.hsc || {};
  const bsc = academic.bsc || {};

  return (
    <div className="glass-card p-6 flex flex-col gap-4 h-full animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Review Extracted Data</h2>
          <p className="text-xs text-slate-400 mt-0.5">Verify the AI extraction before saving</p>
        </div>
        <span className="badge bg-blue-500/15 text-blue-300 border border-blue-500/30">
          ✦ AI Extracted
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin rounded-xl border border-slate-700/50">
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

            {/* Academic — BSc */}
            <SectionRow title="BSc" icon="🎓" />
            <FieldRow label="BSc Result" value={bsc.result} />
            <FieldRow label="BSc Year" value={bsc.year} />
          </tbody>
        </table>
      </div>

      {/* Raw JSON toggle (developer view) */}
      <details className="text-xs">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors select-none">
          View raw JSON
        </summary>
        <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-slate-300 overflow-auto scrollbar-thin max-h-48 text-[11px] leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
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
            Saving to MongoDB & Google Sheets...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
            Approve & Export to Google Sheets
          </>
        )}
      </button>
    </div>
  );
}
