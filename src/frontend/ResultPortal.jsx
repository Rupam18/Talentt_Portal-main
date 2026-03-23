import React, { useEffect } from 'react'
import { Badge } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FaTrophy, 
  FaChartLine, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHome,
  FaRocket,
  FaBook,
  FaChartBar,
  FaClipboardCheck,
  FaHourglassHalf,
  FaExclamationTriangle
} from 'react-icons/fa'
import './ResultPortal.css'

// Professional SVG Circular Progress - Refactored for Dark Theme
const ScoreChart = ({ score, total, label, color }) => {
  const percentage = Math.round((score / total) * 100)
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="bg-[#111827] rounded-xl p-6 border border-gray-800/50 shadow-md text-center transition-all hover:scale-[1.02] min-h-[180px] flex flex-col items-center justify-center">
      <h6 className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-4">{label}</h6>
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg viewBox="0 0 80 80" className="w-20 h-20 transform -rotate-90">
          <circle 
            className="text-gray-800" 
            strokeWidth="6" 
            stroke="currentColor" 
            fill="transparent" 
            r={radius} cx="40" cy="40" 
          />
          <circle 
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            strokeWidth="6" 
            strokeLinecap="round" 
            stroke={color} 
            fill="transparent" 
            r={radius} cx="40" cy="40" 
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-white">
          <span className="text-sm font-bold leading-none">{percentage}%</span>
          <span className="text-[0.6rem] text-gray-500 mt-0.5">{score}/{total}</span>
        </div>
      </div>
      <div>
        <span className={`px-2 py-0.5 text-[0.6rem] font-bold rounded-full border ${
          percentage >= 75 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
          percentage >= 50 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
          'bg-orange-500/10 text-orange-400 border-orange-500/20'
        }`}>
          {percentage >= 75 ? 'EXCEPTIONAL' : percentage >= 50 ? 'PROFICIENT' : 'LEARNING'}
        </span>
      </div>
    </div>
  )
}

const PerformanceMeter = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100)
  
  return (
    <div className="bg-[#111827] rounded-xl shadow-md p-4 border border-gray-800/50 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/10 p-2 rounded-lg">
            <FaChartLine className="text-orange-500 text-lg" />
          </div>
          <div>
            <p className="text-[0.65rem] font-bold text-gray-500 tracking-widest uppercase">AGGREGATE STRENGTH</p>
            <p className="text-xl font-bold text-white leading-none mt-1">{percentage}%</p>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[0.65rem] text-gray-500 leading-none mb-1">ACCURACY</p>
            <p className="text-xs font-semibold text-gray-300">High</p>
        </div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function ResultPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Removed frontend email trigger to unify logic in backend
  /*
  useEffect(() => {
    const sendNotification = async () => {
      if (!result) return
      ...
    }
    sendNotification()
  }, [result, user.email, user.firstName])
  */

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2B] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#111827] rounded-2xl p-8 text-center shadow-2xl border border-gray-800">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-6">
            <FaTimesCircle className="text-red-500" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">It seems you haven't completed the assessment or your session has expired.</p>
          <button 
            onClick={() => navigate('/test-instructions')} 
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2B] p-4 md:p-8 font-sans text-gray-200 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="relative flex flex-col items-center text-center pt-8 pb-4">
          <div className="absolute top-0 right-0 hidden md:block">
            <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wider border ${
              result.pass 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {result.pass ? 'REQUIREMENT MET' : 'REQUIREMENT NOT MET'}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Assessment Performance Analytics
          </h1>
          <p className="text-base text-gray-400 mt-2">
            Candidate: <span className="text-gray-200 font-medium">{user.firstName || 'User'} {user.lastName || ''}</span>
          </p>

          <div className="mt-4 md:hidden">
            <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wider border ${
              result.pass 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {result.pass ? 'REQUIREMENT MET' : 'REQUIREMENT NOT MET'}
            </span>
          </div>
        </header>

        {/* Status Card / Recommendation */}
        <div className="bg-[#111827] rounded-xl border border-gray-800/50 p-6 shadow-xl overflow-hidden relative transition-all hover:border-gray-700/50">
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${result.pass ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`p-4 rounded-2xl ${result.pass ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
               {result.pass ? <FaCheckCircle className="text-green-500 text-3xl" /> : <FaExclamationTriangle className="text-red-500 text-3xl" />}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-2">
                {result.pass ? 'Excellent Competency Demonstrated' : 'Structured Improvement Recommended'}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                {result.pass 
                  ? "Your assessment results indicate a high level of analytical reasoning and numerical proficiency. You have been advanced in the selection process."
                  : "The current assessment reveals areas that require structured learning. We encourage you to focus on fundamental reasoning concepts for future attempts."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformanceMeter score={result.totalScore} total={result.totalQuestions} />
          
          <div className="bg-[#111827] rounded-xl shadow-md p-4 border border-gray-800/50 flex items-center gap-4 transition-all hover:shadow-lg">
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold text-gray-500 tracking-widest uppercase">POINT ACCUMULATION</p>
              <p className="text-2xl font-bold text-white leading-none mt-1">
                {result.totalScore} <span className="text-gray-600 text-lg font-medium">/ {result.totalQuestions}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center gap-2 px-1">
            <div className="bg-blue-500/20 p-1.5 rounded">
              <FaChartBar className="text-blue-400 text-sm" />
            </div>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Detailed Competency Breakdown</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.sectionResults.map((section) => (
              <ScoreChart 
                key={section.section}
                score={section.score}
                total={section.total}
                label={section.section}
                color={section.score >= (section.total * 0.75) ? '#10b981' : section.score >= (section.total * 0.5) ? '#3b82f6' : '#f97316'}
              />
            ))}
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111827] rounded-xl shadow-md p-4 border border-gray-800/50 flex items-center gap-4 transition-all hover:shadow-lg">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <FaClipboardCheck className="text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold text-gray-500 tracking-widest uppercase">TEST ENGAGEMENT</p>
              <p className="text-xl font-bold text-white leading-none mt-1">
                {result.totalAnswered} <span className="text-gray-600 font-medium">/ {result.totalQuestions}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-md p-4 border border-gray-800/50 flex items-center gap-4 transition-all hover:shadow-lg">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <FaHourglassHalf className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold text-gray-500 tracking-widest uppercase">TOTAL EFFICIENCY</p>
              <p className="text-xl font-bold text-white leading-none mt-1">
                {result.totalTimeMinutes || Math.floor((result.totalTimeTaken || 0) / 60)}m {String(result.totalTimeSeconds || ((result.totalTimeTaken || 0) % 60)).padStart(2, '0')}s
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-gray-800/50">
          <button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto h-11 px-6 border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            <FaHome className="inline-block mr-2 -mt-0.5" /> End Session
          </button>
          
          <button 
            onClick={() => navigate('/test-instructions')} 
            className="w-full sm:w-auto h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            <FaBook className="inline-block mr-2 -mt-0.5" /> View Guidelines
          </button>

          {result.pass && (
            <button 
              onClick={() => navigate('/technical-test-relaxation')} 
              className="w-full sm:w-auto h-11 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-green-500/20 active:scale-[0.98]"
            >
              <FaRocket className="inline-block mr-2 -mt-0.5" /> Start Technical Round
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ResultPortal
