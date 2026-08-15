// A gray pulsing block used as a placeholder while real data is still
// loading, so the page doesn't look empty or broken.
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
}

export default Skeleton
