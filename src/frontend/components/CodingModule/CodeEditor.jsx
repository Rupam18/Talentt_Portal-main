import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, isExecuting }) => {
  const getMonacoLanguage = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'java': return 'java';
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full flex flex-col bg-[#020617]">
      <div className="flex-grow">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            padding: { top: 20, bottom: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            renderLineHighlight: 'all',
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-[#020617] text-slate-500">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-slate-500 rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Initialising IDE...</span>
              </div>
            </div>
          }
        />
      </div>
      
      {/* Subtle overlay when executing */}
      {isExecuting && (
        <div className="absolute inset-0 bg-[#020617]/20 backdrop-blur-[1px] pointer-events-none z-10"></div>
      )}
    </div>
  );
};

export default CodeEditor;
