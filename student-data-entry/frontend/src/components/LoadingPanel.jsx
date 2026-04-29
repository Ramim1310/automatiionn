export default function LoadingPanel() {
  return (
    <div className="glass-card p-6 flex flex-col gap-5 h-full min-h-[480px] animate-fade-in">
      {/* Header shimmer */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="shimmer h-5 w-40 rounded" />
          <div className="shimmer h-3 w-56 rounded" />
        </div>
        <div className="shimmer h-6 w-24 rounded-full" />
      </div>

      {/* Gemini animation */}
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin-slow opacity-30 blur-sm" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-200">Groq is analyzing your text...</p>
          <p className="text-xs text-slate-500 mt-1">Extracting structured student data</p>
        </div>
      </div>

      {/* Shimmer rows */}
      <div className="space-y-3 px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="shimmer h-4 w-28 rounded" style={{ opacity: 1 - i * 0.08 }} />
            <div className="shimmer h-4 flex-1 rounded" style={{ opacity: 1 - i * 0.08 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
