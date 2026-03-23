import React from 'react';

const ProblemPanel = ({ question }) => {
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 animate-pulse bg-[#0f172a]/20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-700 border-t-slate-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium tracking-wide">Syncing problem data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-10 text-slate-200 scroll-smooth selection:bg-yellow-500/30">
      {/* Title & Difficulty */}
      <div className="flex flex-col gap-3 mb-10">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            question.difficultyLevel === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            question.difficultyLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {question.difficultyLevel}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{question.questionType || 'Algorithm'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{question.title || 'Coding Challenge'}</h1>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Description</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed text-[15px] whitespace-pre-wrap font-medium">
            {question.questionText}
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-10">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] -mb-4">Examples</h2>
        
        {/* We can parse sample data if it's JSON or just show it as text */}
        <div className="group space-y-4">
          <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10 hover:bg-[#020617]/80 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Example Instance</span>
            </div>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold shrink-0">Input:</span>
                <span className="text-slate-200">{question.sampleInput || "N/A"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 font-bold shrink-0">Output:</span>
                <span className="text-slate-200">{question.expectedOutput || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Constraints */}
      {question.constraints && (
        <div className="mt-12 pt-12 border-t border-white/5">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Constraints</h2>
          <div className="grid gap-3">
            {question.constraints.split('\n').filter(c => c.trim()).map((c, i) => (
              <div key={i} className="flex gap-3 items-start animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0"></div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {question.hints && (
        <div className="mt-12 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-indigo-400">💡</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Helpful Hint</span>
          </div>
          <p className="font-mono text-xs text-indigo-200/60 leading-relaxed italic">" {question.hints.split('\n')[0]} "</p>
        </div>
      )}

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProblemPanel;
