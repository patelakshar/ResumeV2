// A small, simple logo mark for "Resume Analyzer": a document shape
// with a checkmark badge, drawn as plain SVG so we don't need an image file.
function Logo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="14" height="20" rx="2" fill="#4f46e5" />
      <rect x="6" y="6" width="8" height="1.5" rx="0.75" fill="white" />
      <rect x="6" y="9.5" width="8" height="1.5" rx="0.75" fill="white" />
      <rect x="6" y="13" width="5" height="1.5" rx="0.75" fill="white" />
      <circle cx="17" cy="17" r="6" fill="#22c55e" />
      <path
        d="M14.3 17.2l1.7 1.7 3-3.4"
        stroke="white"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Logo
