import { useState } from 'react'
import './App.css'
import SlideRenderer from './components/SlideRenderer'
import AccountsPanel from './components/AccountsPanel'
import { useAccounts } from './hooks/useAccounts'

const SAMPLE_JSON = `{
  "meta": {
    "topic": "Box Breathing",
    "format": "TUTORIAL",
    "hook": "Navy SEALs use this 2-minute trick to stay calm under pressure"
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
      "index": 1, "type": "cover", "layout": "center_stack", "background": "grad_aura",
      "headline_segments": ["Navy SEALs", "use this", "2-min trick"],
      "body": null, "badge": null,
      "image_prompt": "A glowing human silhouette seated in stillness at the center of a vast soft-gradient field, surrounded by slow-expanding rings of mint and sky-blue light, warm gold light rising from below, lavender mist dissolving at the edges, aura palette pastels, everything emits light nothing casts shadow, subtle film grain, 9:16 vertical format"
    },
    {
      "index": 2, "type": "pain",
      "headline": "Reset your mind in 2 minutes flat.",
      "body": "Box Breathing activates your body's natural calm response so stress drops and focus returns fast.",
      "image_prompt": null
    },
    {
      "index": 3, "type": "step", "headline": "Inhale for 4 counts.",
      "step_number": 1, "badge": "Step 1",
      "body": "Breathe in slowly through your nose while counting to 4, filling your lungs completely.",
      "image_prompt": null
    },
    {
      "index": 4, "type": "step", "headline": "Hold for 4 counts.",
      "step_number": 2, "badge": "Step 2",
      "body": "Keep the air in and hold still for 4 counts, letting your nervous system begin to slow down.",
      "image_prompt": null
    },
    {
      "index": 5, "type": "step", "headline": "Exhale and hold 4 counts.",
      "step_number": 3, "badge": "Step 3",
      "body": "Breathe out fully for 4 counts, then hold empty for 4 counts before starting the next round.",
      "image_prompt": null
    },
    {
      "index": 6, "type": "proof",
      "headline": "2 minutes. Measurable calm.",
      "body": "Studies show controlled breathing reduces cortisol levels and lowers heart rate within 2 minutes.",
      "image_prompt": "A luminous geometric orb pulsing with soft concentric rings of mint, gold, and sky blue light, floating in a deep indigo-lavender gradient field, each ring expanding outward in slow rhythmic waves, warm peach glow at the core, no text no labels, film grain overlay, 9:16 vertical format"
    },
    {
      "index": 7, "type": "bridge",
      "headline": "Thousands use this before high-pressure moments.",
      "body": "Before presentations, exams, hard conversations, and interviews — Box Breathing is the reset that needs no equipment.",
      "image_prompt": "A warm atmospheric aerial landscape at golden hour, soft rolling hills bathed in peach and coral light, a single glowing figure standing on a ridge facing an open horizon, lavender sky dissolving into mint at the top, everything glows with inner light, no shadows no text, film grain, 9:16 vertical format"
    },
    {
      "index": 8, "type": "cta",
      "headline": "Want the full guide?",
      "keyword": "CALM",
      "offer": "Free Box Breathing Guide",
      "body": "Comment CALM and get the free step-by-step Box Breathing guide delivered straight to your inbox."
    }
  ]
}`

export default function App() {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON)
  const [spec, setSpec] = useState(() => {
    try { return JSON.parse(SAMPLE_JSON) } catch { return null }
  })
  const [error, setError] = useState(null)
  const [imageProvider, setImageProvider] = useState('pollinations')

  const { accounts, activeAccount, addAccount, removeAccount, selectAccount } = useAccounts()

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
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRender()
  }

  const meta = spec?.meta || {}
  const slides = spec?.slides || []
  const design = spec?.design || {}

  const effectiveProvider = imageProvider === 'higgsfield' && !activeAccount
    ? 'pollinations'
    : imageProvider

  return (
    <div className="app">
      {/* ── Left Panel ── */}
      <div className="panel-left">
        <div className="panel-left-header">
          <h1>Carousel Preview</h1>
          <AccountsPanel
            accounts={accounts}
            activeAccount={activeAccount}
            onAdd={addAccount}
            onRemove={removeAccount}
            onSelect={selectAccount}
          />
        </div>

        <p className="subtitle">
          Paste the JSON spec from the <code>/carousel</code> skill, then press Render.
        </p>

        <textarea
          className="json-textarea"
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste carousel JSON spec here…"
          spellCheck={false}
        />

        {error && <div className="error-msg">{error}</div>}

        <div className="provider-row">
          <span className="provider-label">Image provider:</span>
          <label className={`provider-opt ${effectiveProvider === 'pollinations' ? 'provider-opt--active' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="pollinations"
              checked={imageProvider === 'pollinations'}
              onChange={() => setImageProvider('pollinations')}
            />
            Pollinations (free)
          </label>
          <label className={`provider-opt ${imageProvider === 'higgsfield' ? 'provider-opt--active' : ''} ${!activeAccount ? 'provider-opt--disabled' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="higgsfield"
              checked={imageProvider === 'higgsfield'}
              onChange={() => setImageProvider('higgsfield')}
              disabled={!activeAccount}
            />
            Higgsfield {!activeAccount && '(no account)'}
          </label>
        </div>

        {imageProvider === 'higgsfield' && !activeAccount && (
          <div className="provider-warning">
            Add a Higgsfield account above to use this provider.
          </div>
        )}

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
              imageProvider={effectiveProvider}
              higgsApiKey={activeAccount?.apiKey || null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
