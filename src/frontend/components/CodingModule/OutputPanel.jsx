import React, { useState } from 'react';
import { FaTerminal, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaHourglassHalf, FaFlask } from 'react-icons/fa';

const OutputPanel = ({ result, submissionResults, loading }) => {
  const [activeTab, setActiveTab] = useState('console'); // 'console' or 'testcases'

  const getStatusColor = (status) => {
    switch (status?.description) {
      case 'Accepted': return 'text-emerald-400';
      case 'Wrong Answer': return 'text-rose-400';
      case 'Time Limit Exceeded': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.description) {
      case 'Accepted': return <FaCheckCircle className="text-emerald-400 shrink-0" />;
      case 'Wrong Answer': return <FaTimesCircle className="text-rose-400 shrink-0" />;
      case 'Time Limit Exceeded': return <FaHourglassHalf className="text-amber-400 shrink-0" />;
      default: return <FaTerminal className="text-slate-400 shrink-0" />;
    }
  };

  const decodeContent = (content) => {
    if (!content) return null;
    try {
      return atob(content);
    } catch {
      return content;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#020617] text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-[bounce_1s_infinite_0ms]"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-[bounce_1s_infinite_200ms]"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-[bounce_1s_infinite_400ms]"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Executing Build...</span>
        </div>
      </div>
    );
  }

  // If we have submission results, they should take priority or have a clear tab
  const hasSubmissions = submissionResults && submissionResults.length > 0;

  return (
    <div className="h-full flex flex-col bg-[#020617] font-mono selection:bg-yellow-500/20">
      {/* Tab Header */}
      <div className="flex justify-between items-center px-4 border-b border-white/5 bg-white/2 shrink-0">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'console' ? 'border-yellow-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <FaTerminal className="text-[12px]" />
            Console Output
          </button>
          {hasSubmissions && (
            <button 
              onClick={() => setActiveTab('testcases')}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'testcases' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaFlask className="text-[12px]" />
              Test Results
            </button>
          )}
        </div>
        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Runtime logs</div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === 'console' && (
          <div className="animate-fadeIn">
            {!result && !hasSubmissions ? (
              <div className="h-40 flex items-center justify-center text-slate-600">
                <p className="text-xs uppercase tracking-widest font-bold">Waiting for input...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {result?.status && (
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                    result.status.id === 3 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'
                  }`}>
                    {getStatusIcon(result.status)}
                    <span className={`text-sm font-bold ${getStatusColor(result.status)}`}>
                      {result.status.description}
                    </span>
                    {result.time && <span className="text-[10px] text-slate-500 font-bold ml-auto">RUNTIME: {result.time}s</span>}
                  </div>
                )}

                {/* Stdout / Stderr / Compile Logs */}
                <div className="space-y-4">
                  {decodeContent(result?.stdout) && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Stdout</p>
                      <pre className="text-slate-300 text-xs whitespace-pre-wrap bg-white/2 p-3 rounded-lg border border-white/5 leading-relaxed">
                        {decodeContent(result.stdout)}
                      </pre>
                    </div>
                  )}

                  {decodeContent(result?.stderr) && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <FaExclamationTriangle /> Stderr
                      </p>
                      <pre className="text-rose-400 text-xs whitespace-pre-wrap bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 leading-relaxed">
                        {decodeContent(result.stderr)}
                      </pre>
                    </div>
                  )}

                  {decodeContent(result?.compile_output) && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <FaExclamationTriangle /> Compilation Logs
                      </p>
                      <pre className="text-amber-400 text-xs whitespace-pre-wrap bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 leading-relaxed">
                        {decodeContent(result.compile_output)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'testcases' && hasSubmissions && (
          <div className="space-y-3 animate-fadeIn">
            {submissionResults.map((tc, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border transition-all ${
                tc.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${tc.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Test Case {idx + 1}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ml-auto ${
                    tc.passed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tc.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                
                {!tc.passed && (
                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-1.5">
                      <span className="text-slate-500 font-bold uppercase tracking-[0.05em]">Expected</span>
                      <pre className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-slate-300 truncate">{tc.expectedOutput}</pre>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-rose-400/70 font-bold uppercase tracking-[0.05em]">Actual</span>
                      <pre className="bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/10 text-rose-300 truncate">{tc.actualOutput || 'N/A'}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
