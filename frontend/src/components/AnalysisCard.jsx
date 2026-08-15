import AnimatedCard from './AnimatedCard'

// Shows one section of the resume analysis (like "Skills" or
// "Weaknesses") as a simple card with a title and a bullet list. Pass
// `delay` so a row of these cards animates in one after another.
function AnalysisCard({ title, items, delay = 0 }) {
  return (
    <AnimatedCard className="p-5" delay={delay}>
      <h2 className="text-lg font-semibold text-slate-800 mb-3">{title}</h2>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">Nothing to show</p>
      )}
    </AnimatedCard>
  )
}

export default AnalysisCard
