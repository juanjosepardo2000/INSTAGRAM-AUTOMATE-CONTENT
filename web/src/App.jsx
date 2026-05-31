import { useState } from 'react'
import './App.css'
import SlideRenderer from './components/SlideRenderer'

const SAMPLE_JSON = `{
  "meta": {
    "topic": "Box Breathing",
    "format": "educational carousel",
    "hook": "Navy SEALs use this 2-min trick to instantly calm down"
  },
  "design": {
    "palette": {
      "background": "#faf6f1",
      "ink": "#2f2c49",
      "ink_soft": "#6f6a89",
      "accent_primary": "#9d7cc4",
      "accent_secondary": "#f3d49a",
      "glow": "#c8f0d8"
    },
    "typography": { "display": "Fraunces", "body": "Hanken Grotesk" },
    "cover_gradient": "linear-gradient(180deg,#8fcddf 0%,#a6ddd5 16%,#f3d49a 36%,#c6d1c3 52%,#fcca8b 70%,#fdb881 86%,#b1cda5 100%)"
  },
  "slides": [
    {
      "index": 1,
      "type": "cover",
      "layout": "center_stack",
      "background": "grad_aura",
      "headline_segments": ["Navy SEALs", "use this", "2-min trick"],
      "body": null,
      "badge": null,
      "image_prompt": null
    },
    {
      "index": 2,
      "type": "pain",
      "headline": "Reset your mind in 2 minutes flat.",
      "body": "Box Breathing activates your parasympathetic nervous system — the built-in calm switch used by elite performers under pressure.",
      "image_prompt": null
    },
    {
      "index": 3,
      "type": "step",
      "headline": "Inhale for 4 counts.",
      "step_number": 1,
      "badge": "Step 1",
      "body": "Breathe in slowly through your nose while counting to four. Feel your chest and belly expand fully.",
      "image_prompt": null
    },
    {
      "index": 4,
      "type": "step",
      "headline": "Hold for 4 counts.",
      "step_number": 2,
      "badge": "Step 2",
      "body": "Hold your breath at the top. Stay relaxed — no tension. This pause lets CO₂ levels balance.",
      "image_prompt": null
    },
    {
      "index": 5,
      "type": "step",
      "headline": "Exhale for 4 counts.",
      "step_number": 3,
      "badge": "Step 3",
      "body": "Release the breath slowly through your mouth. Let tension leave your body with the air.",
      "image_prompt": null
    },
    {
      "index": 6,
      "type": "proof",
      "headline": "2 minutes. Measurable calm.",
      "body": "Studies show box breathing lowers cortisol, reduces heart rate, and improves focus within 4 rounds.",
      "image_prompt": null
    },
    {
      "index": 7,
      "type": "bridge",
      "headline": "Thousands use this daily.",
      "body": "Before presentations, exams, difficult conversations — box breathing works anywhere, anytime.",
      "image_prompt": null
    },
    {
      "index": 8,
      "type": "cta",
      "headline": "Want the full guide?",
      "keyword": "CALM",
      "offer": "Free Box Breathing Guide",
      "body": "Comment CALM below and I'll DM you the complete 7-day breathing protocol — no cost, no catch."
    }
  ]
}`

export default function App() {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON)
  const [spec, setSpec] = useState(() => {
    try { return JSON.parse(SAMPLE_JSON) } catch { return null }
  })
  const [error, setError] = useState(null)

  function handleRender() {
    try {
      const parsed = JSON.parse(jsonText)
      setSpec(parsed)
      setError(null)
    } catch (e) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRender()
    }
  }

  const meta = spec?.meta || {}
  const slides = spec?.slides || []
  const design = spec?.design || {}

  return (
    <div className="app">
      {/* ── Left Panel ── */}
      <div className="panel-left">
        <h1>Carousel Preview</h1>
        <p className="subtitle">
          Paste a carousel JSON spec below, then click Render (or press Ctrl+Enter) to preview all slides.
        </p>
        <textarea
          className="json-textarea"
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Paste carousel JSON spec here…'
          spellCheck={false}
        />
        {error && <div className="error-msg">{error}</div>}
        <button className="btn-render" onClick={handleRender}>
          Render Slides
        </button>
      </div>

      {/* ── Right Panel ── */}
      <div className="panel-right">
        {spec && (
          <div className="meta-bar">
            <div className="meta-topic">{meta.topic || 'Untitled'}</div>
            {meta.format && <div className="meta-detail">Format: {meta.format}</div>}
            {meta.hook && <div className="meta-hook">"{meta.hook}"</div>}
          </div>
        )}

        <div className="slides-scroll">
          {slides.length === 0 && (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="4" width="22" height="38" rx="4" stroke="#9d7cc4" strokeWidth="2" />
                <rect x="18" y="6" width="22" height="38" rx="4" stroke="#9d7cc4" strokeWidth="2" fill="white" />
              </svg>
              <p>No slides to preview yet.</p>
            </div>
          )}
          {slides.map((slide, i) => (
            <SlideRenderer
              key={slide.index ?? i}
              slide={slide}
              index={i}
              design={design}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
