export default function PlaceholderPanel() {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[480px] gap-6 animate-fade-in">
      {/* Animated icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-slate-600/50 flex items-center justify-center pulse-slow">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {/* Orbiting dot */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-xs">
        <h3 className="text-lg font-semibold text-slate-300">No Data Yet</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Paste unstructured student text on the left, then click{' '}
          <span className="text-blue-400 font-medium">"Process Data"</span>{' '}
          to extract it with Groq AI.
        </p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3 mt-2">
        {[
          { step: '01', label: 'Paste raw text', icon: '📋' },
          { step: '02', label: 'AI extracts structured data', icon: '🤖' },
          { step: '03', label: 'Review & approve', icon: '✅' },
          { step: '04', label: 'Saved to MongoDB + Excel', icon: '💾' },
        ].map(({ step, label, icon }) => (
          <div key={step} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-lg">{icon}</span>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Step {step}</div>
              <div className="text-xs text-slate-300 font-medium">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
