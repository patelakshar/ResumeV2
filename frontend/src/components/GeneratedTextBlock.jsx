import AnimatedCard from './AnimatedCard'
import MotionButton from './MotionButton'

// Shows a block of AI-generated text (like a cover letter or rewritten
// resume) with a Copy button, and an optional Download button.
function GeneratedTextBlock({ title, text, fileName, showDownload = true }) {
  // Copies the generated text to the clipboard so the user can paste
  // it wherever they need it.
  function handleCopy() {
    navigator.clipboard.writeText(text)
  }

  // Downloads the generated text as a plain .txt file.
  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <AnimatedCard className="p-6 mt-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <div className="flex gap-2">
          <MotionButton
            onClick={handleCopy}
            className="bg-slate-200 text-slate-700 text-sm rounded px-3 py-1 hover:bg-slate-300"
          >
            Copy
          </MotionButton>
          {showDownload && (
            <MotionButton
              onClick={handleDownload}
              className="bg-slate-800 text-white text-sm rounded px-3 py-1 hover:bg-slate-900"
            >
              Download
            </MotionButton>
          )}
        </div>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">{text}</pre>
    </AnimatedCard>
  )
}

export default GeneratedTextBlock
