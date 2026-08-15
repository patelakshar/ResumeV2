import { useLocation, Link } from 'react-router-dom'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import AnalysisCard from '../components/AnalysisCard'
import AnimatedCard from '../components/AnimatedCard'

// Shows the result of a Gemini resume analysis: the ATS score as a
// gauge chart, a couple more charts breaking the resume down visually,
// and every field in its own card. The analysis data is passed in
// through the router link that sent us here.
function ResumeAnalysis() {
  const location = useLocation()
  const analysis = location.state?.analysis

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <p className="text-slate-600 mb-4">No analysis data to show yet.</p>
        <Link to="/upload" className="text-indigo-600 hover:underline">
          Upload a resume to get started
        </Link>
      </div>
    )
  }

  // Recharts needs the score wrapped in an array of data points, one
  // per bar, so we build that here from the ATS score.
  const gaugeData = [{ name: 'ATS Score', value: analysis.atsScore, fill: '#4f46e5' }]

  // Turns the skills/missingSkills arrays into two bars we can compare
  // side by side.
  const skillsBarData = [
    { name: 'Skills Found', count: analysis.skills.length },
    { name: 'Missing Skills', count: analysis.missingSkills.length },
  ]

  // Builds one radar chart point per section of the analysis, using
  // how many items are in each list. This gives a quick shape of where
  // the resume is strong (bigger points) versus where it's thin.
  const radarData = [
    { category: 'Strengths', count: analysis.strengths.length },
    { category: 'Weaknesses', count: analysis.weaknesses.length },
    { category: 'Skills', count: analysis.skills.length },
    { category: 'Missing Skills', count: analysis.missingSkills.length },
    { category: 'Keywords', count: analysis.keywords.length },
    { category: 'Missing Keywords', count: analysis.missingKeywords.length },
  ]

  // Every AnalysisCard below in the grid, bundled with its data, so we
  // can render them in a loop and stagger their entrance animation by
  // index instead of repeating the same JSX eight times.
  const analysisSections = [
    { title: 'Skills Found', items: analysis.skills },
    { title: 'Missing Skills', items: analysis.missingSkills },
    { title: 'Keywords Found', items: analysis.keywords },
    { title: 'Missing Keywords', items: analysis.missingKeywords },
    { title: 'Strengths', items: analysis.strengths },
    { title: 'Weaknesses', items: analysis.weaknesses },
    { title: 'Grammar Suggestions', items: analysis.grammarSuggestions },
    { title: 'Improvement Suggestions', items: analysis.improvementSuggestions },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Resume Analysis</h1>

        <AnimatedCard className="p-6 mb-6 flex flex-col items-center">
          <div className="relative w-56 h-56">
            <RadialBarChart
              width={224}
              height={224}
              innerRadius="70%"
              outerRadius="100%"
              data={gaugeData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-slate-800">{analysis.atsScore}</p>
              <p className="text-slate-500 text-sm">out of 100</p>
            </div>
          </div>
          <p className="text-slate-600 mt-2">ATS Score</p>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnimatedCard className="p-5" delay={0.1}>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Skills Matched vs Missing
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillsBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>

          <AnimatedCard className="p-5" delay={0.2}>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Resume Breakdown</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Radar dataKey="count" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {analysisSections.map((section, index) => (
            <AnalysisCard
              key={section.title}
              title={section.title}
              items={section.items}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalysis
