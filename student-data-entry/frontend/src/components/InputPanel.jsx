import { useState } from 'react';

const SAMPLE_TEXT = `Student: Rahim Uddin
DOB: 1999
SSC: GPA 5.00, 2015, Dhaka Board
HSC: GPA 4.75 in 2017 from Rajshahi Board
BSc in Computer Science from BUET, CGPA 3.81, passed 2022
Interested in: Machine Learning
Passport: A1234567
IELTS: 7.0
Phone: +8801712345678`;

export default function InputPanel({ onProcess, isLoading }) {
  const [text, setText] = useState('');

  const handleSample = () => setText(SAMPLE_TEXT);
  const handleClear = () => setText('');

  return (
    <div className="glass-card p-6 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Input Panel</h2>
          <p className="text-xs text-slate-400 mt-0.5">Paste any unstructured student text below</p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-load-sample"
            onClick={handleSample}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            Load Sample
          </button>
          <button
            id="btn-clear-text"
            onClick={handleClear}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        id="student-text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste unstructured student data here...&#10;&#10;e.g. SSC GPA 5.00 in 2015, HSC 4.75 in 2017, BSc CGPA 3.8 from BUET 2022, IELTS 7.0, Passport A1234567, Phone 01712345678, Interested in CS..."
        className="
          flex-1 min-h-[320px] resize-none rounded-xl p-4
          bg-slate-800/60 border border-slate-700
          text-slate-200 placeholder-slate-500 text-sm leading-relaxed
          focus:outline-none focus:border-blue-500/70 transition-all duration-200
          scrollbar-thin
        "
      />

      {/* Character count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{text.length} characters</span>
        {text.length > 0 && (
          <span className="text-emerald-400">Ready to process</span>
        )}
      </div>

      {/* Process button */}
      <button
        id="btn-process-data"
        onClick={() => onProcess(text)}
        disabled={!text.trim() || isLoading}
        className="btn-primary w-full py-3.5 text-base"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin-slow w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing with Groq AI...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Process Data
          </>
        )}
      </button>
    </div>
  );
}
