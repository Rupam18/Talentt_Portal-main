import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemPanel from './ProblemPanel';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import CameraCornerPreview from '../../CameraCornerPreview';
import { useProctoring } from '../../hooks/useProctoring';
import ViolationModal from '../ViolationModal';
import CustomDialog from '../CustomDialog';
import { FaPlay, FaPaperPlane, FaSignOutAlt, FaRocket } from 'react-icons/fa';

const CodingModule = () => {
  const navigate = useNavigate();
  
  // State
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proctoring State
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [currentViolation, setCurrentViolation] = useState(null);

  // Custom Dialog State
  const [dialog, setDialog] = useState({
    show: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // User Info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const candidateEmail = user.email || 'candidate@example.com';

  // Proctoring Hook
  const { attemptsLeft, violationCount } = useProctoring({
    candidateId: candidateEmail,
    testId: 'leetcode_coding_test',
    onViolation: (v) => {
      setCurrentViolation(v);
      setShowViolationModal(true);
    },
    onAutoSubmit: () => {
      setDialog({
        show: true,
        title: 'Security Violation',
        message: 'Security violation: Auto-submitting the test.',
        type: 'alert',
        onConfirm: () => {
          setDialog(prev => ({ ...prev, show: false }));
          handleSubmit();
        }
      });
    }
  });

  // Fetch Question
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/code-execution/coding-question');
        if (!response.ok) throw new Error('Ready to pick a question? Check your connection.');
        const data = await response.json();
        setQuestion(data);
        if (data.solutionCode) setCode(data.solutionCode);
        else setCode(getDefaultTemplate(data.programmingLanguage || 'javascript'));
      } catch (err) {
        console.error('Error fetching question:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const getDefaultTemplate = (lang) => {
    const templates = {
      javascript: 'function solution() {\n  // Write your code here\n}',
      python: 'def solution():\n    # Write your code here\n    pass',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write code\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}'
    };
    return templates[lang.toLowerCase()] || templates.javascript;
  };

  const handleRun = async () => {
    if (!question) return;
    setIsExecuting(true);
    setExecutionResult(null);
    setSubmissionResults(null);

    try {
      const response = await fetch('/api/code-execution/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          language: language.toUpperCase(),
          stdin: question.sampleInput
        })
      });

      if (!response.ok) throw new Error('Run failed: ' + response.statusText);
      const result = await response.json();
      setExecutionResult(result);
    } catch (err) {
      console.error('Error running code:', err);
      setExecutionResult({ stderr: err.message, status: { description: 'Error' } });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;
    setIsExecuting(true);
    setSubmissionResults(null);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/code-execution/submit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          code: code,
          language: language.toUpperCase()
        })
      });

      if (!response.ok) throw new Error('Submission failed');
      const results = await response.json();
      setSubmissionResults(results);
    } catch (err) {
      console.error('Error submitting code:', err);
      setError('Submission failed. Check your API key.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleFinish = () => {
    setDialog({
      show: true,
      title: 'Finish Assessment',
      message: 'Are you sure you want to finish the assessment? Make sure you have submitted your final solution.',
      type: 'confirm',
      onConfirm: () => {
        setDialog(prev => ({ ...prev, show: false }));
        navigate('/all-tests-completed');
      },
      onCancel: () => setDialog(prev => ({ ...prev, show: false }))
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-[#0f172a] font-bold p-2 rounded transform hover:scale-110 transition-transform">
            {"{cv}"}
          </div>
        </div>
        <p className="mt-8 text-xl font-medium tracking-widest animate-pulse">PREPARING ASSESSMENT...</p>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white p-6">
        <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl text-center max-w-lg shadow-2xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Assessment Unavailable</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] px-8 py-3 rounded-xl font-bold transition-all hover:scale-105">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white overflow-hidden selection:bg-yellow-500/30">
      <ViolationModal 
        show={showViolationModal} 
        onClose={() => setShowViolationModal(false)} 
        violationCount={violationCount} 
      />

      {/* TOP HEADER */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 text-[#0f172a] font-bold px-2 py-1 rounded text-sm shadow-lg shadow-yellow-500/20">{"{cv}"}</div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            Codeverge Coding Assessment
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRun}
            disabled={isExecuting}
            className="group relative flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-900/40 text-white px-5 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 overflow-hidden"
          >
            {isExecuting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FaPlay className="text-[10px] group-hover:translate-x-0.5 transition-transform" />}
            Run
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/40 text-white px-5 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95"
          >
            <FaRocket className="text-[10px]" />
            Submit
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button 
            onClick={handleFinish}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-5 py-1.5 rounded-lg text-sm font-bold transition-all"
          >
            <FaSignOutAlt className="text-xs" />
            Finish Test
          </button>
        </div>
      </header>

      {/* MAIN SPLIT */}
      <main className="flex flex-1 overflow-hidden min-h-0">
        {/* LEFT: QUESTION PANEL */}
        <section className="w-1/2 overflow-y-auto border-r border-white/5 bg-[#0f172a]/40 scrollbar-thin scrollbar-thumb-white/10">
          <ProblemPanel question={question} />
        </section>

        {/* RIGHT: EDITOR */}
        <section className="w-1/2 flex flex-col bg-[#020617]/40">
          <div className="px-4 py-2 border-b border-white/5 bg-white/2 backdrop-blur-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Compiler:</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-300 outline-none cursor-pointer hover:text-white transition-colors capitalize"
              >
                <option value="javascript" className="bg-[#0f172a]">JavaScript (Node.js)</option>
                <option value="python" className="bg-[#0f172a]">Python 3.x</option>
                <option value="java" className="bg-[#0f172a]">Java (OpenJDK)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
          </div>
          <div className="flex-grow overflow-hidden relative">
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={language}
              isExecuting={isExecuting}
            />
          </div>
        </section>
      </main>

      {/* OUTPUT PANEL */}
      <footer className="h-48 shrink-0 bg-[#020617] border-t border-white/10 z-10 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
        <OutputPanel 
          result={executionResult} 
          submissionResults={submissionResults}
          loading={isExecuting} 
        />
      </footer>

      {/* OVERLAYS */}
      <CameraCornerPreview />
      
      <CustomDialog 
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </div>
  );
};

export default CodingModule;
