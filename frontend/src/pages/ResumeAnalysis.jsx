import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from 'recharts'
import AnalysisCard from '../components/AnalysisCard'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

function ResumeAnalysis() {
  const location = useLocation()
  const navigate = useNavigate()
  const analysis = location.state?.analysis
  const [activeTab, setActiveTab] = useState('all')
  const [isActionsOpen, setIsActionsOpen] = useState(false)

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 p-8 rounded-xl shadow-lg text-center">
            <p className="text-slate-500 mb-4">No analysis data to show yet.</p>
            <MotionButton onClick={() => navigate('/upload')} className="bg-teal-600 text-white px-4 py-2 rounded-lg">Upload a resume</MotionButton>
          </motion.div>
        </div>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-teal-500 to-emerald-500'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (score >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
    return 'bg-gradient-to-r from-rose-500 to-red-500'
  }

  const gaugeData = [{ name: 'ATS Score', value: analysis.atsScore, fill: '#0d9488' }]
  const skillsBarData = [
    { name: 'Skills Found', count: analysis.skills.length },
    { name: 'Missing Skills', count: analysis.missingSkills.length },
  ]
  const radarData = [
    { category: 'Strengths', count: analysis.strengths.length },
    { category: 'Weaknesses', count: analysis.weaknesses.length },
    { category: 'Skills', count: analysis.skills.length },
    { category: 'Missing Skills', count: analysis.missingSkills.length },
    { category: 'Keywords', count: analysis.keywords.length },
    { category: 'Missing Keywords', count: analysis.missingKeywords.length },
  ]

  const tabs = [
   // { id: 'all', label: 'All', count: 8 },
    { id: 'strengths', label: 'Strengths', items: analysis.strengths, category: 'Analysis' },
    { id: 'weaknesses', label: 'Weaknesses', items: analysis.weaknesses, category: 'Analysis' },
    { id: 'skills', label: 'Skills Found', items: analysis.skills, category: 'Skills' },
    { id: 'missing', label: 'Missing Skills', items: analysis.missingSkills, category: 'Skills' },
    { id: 'keywords', label: 'Keywords Found', items: analysis.keywords, category: 'Keywords' },
    { id: 'missingkw', label: 'Missing Keywords', items: analysis.missingKeywords, category: 'Keywords' },
    { id: 'grammar', label: 'Grammar', items: analysis.grammarSuggestions, category: 'Suggestions' },
    { id: 'improve', label: 'Suggestions', items: analysis.improvementSuggestions, category: 'Suggestions' },
  ]

  const selectedTab = tabs.find(t => t.id === activeTab) || tabs[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex gap-3 mb-8 flex-wrap">
          <MotionButton onClick={() => navigate('/upload')} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 text-sm">Upload Another</MotionButton>
          <MotionButton onClick={() => navigate('/history')} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 text-sm">View History</MotionButton>
          
          {/* Actions Dropdown (Click-based) */}
          <div className="relative">
            <MotionButton 
              onClick={() => setIsActionsOpen(!isActionsOpen)} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-sm flex items-center gap-1"
            >
              Actions
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isActionsOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </MotionButton>
            
            {/* Dropdown Menu (Click-based) */}
            {isActionsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.2 }} 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10"
              >
                <button onClick={() => { navigate('/jobmatch'); setIsActionsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Job Match
                </button>
                <button onClick={() => { navigate('/rewrite'); setIsActionsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Rewrite Resume
                </button>
                <button onClick={() => { navigate('/generate'); setIsActionsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h1a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0v-.5a1 1 0 00-1-1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h1a1 1 0 001-1V3.5z" />
                  </svg>
                  Generate Cover Letter
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-8">
          <AnimatedCard className="p-6 flex flex-col items-center">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-semibold text-slate-800 mb-4">ATS Score</motion.h2>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }} className="relative w-56 h-56">
              <RadialBarChart width={224} height={224} innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }} className="text-3xl font-bold text-slate-900">{analysis.atsScore}</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-slate-600 text-sm">out of 100</motion.p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className={`flex items-center gap-2 mt-4`}>
              <span className="text-sm text-slate-600">Score:</span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(analysis.atsScore)}`}>{analysis.atsScore}/100</span>
              {analysis.keywordsMatched && <span className="text-xs text-slate-500">Keywords: {analysis.keywordsMatched}</span>}
            </motion.div>
          </AnimatedCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-8">
          <AnimatedCard className="p-5" delay={0.1}>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg font-semibold text-slate-800 mb-3">
              Categorized Summary
            </motion.h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead className="text-left text-slate-800 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 px-4">Items</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Skills Found */}
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">Skills Found</td>
                    <td className="py-2 px-4">{analysis.skills.length}</td>
                    <td className="py-2 pl-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Found</span>
                    </td>
                  </tr>
                  {/* Missing Skills */}
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">Missing Skills</td>
                    <td className="py-2 px-4">{analysis.missingSkills.length}</td>
                    <td className="py-2 pl-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Missing</span>
                    </td>
                  </tr>
                  {/* Keywords Found */}
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">Keywords Found</td>
                    <td className="py-2 px-4">{analysis.keywords.length}</td>
                    <td className="py-2 pl-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Found</span>
                    </td>
                  </tr>
                  {/* Missing Keywords */}
                  <tr>
                    <td className="py-2 pr-4 font-medium text-slate-800">Missing Keywords</td>
                    <td className="py-2 px-4">{analysis.missingKeywords.length}</td>
                    <td className="py-2 pl-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Missing</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Radar Chart for Overall Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-8">
          <AnimatedCard className="p-5" delay={0.2}>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg font-semibold text-slate-800 mb-3">
              Resume Breakdown
            </motion.h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#475569' }} />
                <Radar dataKey="count" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-6">
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {tabs.map((tab) => (
              <MotionButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-lg text-sm ${activeTab === tab.id ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {tab.label}{tab.id !== '' && tab.items && tab.items.length > 0 && ` (${tab.items.length})`}
              </MotionButton>
            ))}
          </div>
        </motion.div>
        {activeTab === '' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Group tabs by category */}
            {Object.entries(
              tabs.filter(t => t.id !== 'all').reduce((acc, tab) => {
                if (!acc[tab.category]) acc[tab.category] = [];
                acc[tab.category].push(tab);
                return acc;
              }, {})
            ).map(([category, categoryTabs], index) => (
              <AnimatedCard key={category} delay={index * 0.1} className="p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {category}
                </h3>
                <div className="space-y-4">
                  {categoryTabs.map((tab) => (
                    <div key={tab.id} className="border-t border-slate-100 pt-3">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">{tab.label} ({tab.items.length})</h4>
                      {tab.items.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                          {tab.items.map((item, idx) => (
                            <motion.li key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="pl-4">
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500">No items found</p>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedTab.items && selectedTab.items.length > 0 ? (
              <AnimatedCard delay={0} className="p-5 col-span-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">{selectedTab.label}</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                    {selectedTab.items.length} items
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  {selectedTab.items.map((item, idx) => (
                    <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="pl-4">
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </AnimatedCard>
            ) : (
              <AnimatedCard className="p-8 text-center">
                <p className="text-slate-500">No items in this category</p>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ResumeAnalysis
