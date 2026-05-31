import { useState, useEffect } from 'react'

const HIGGSFIELD_BASE = 'https://api.higgsfield.ai'

async function generateHiggsfield(prompt, apiKey) {
  const res = await fetch(`${HIGGSFIELD_BASE}/v1/image/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'nano_banana_pro',
      prompt,
      aspect_ratio: '9:16',
      resolution: '2k',
    }),
  })
  if (!res.ok) throw new Error(`Higgsfield HTTP ${res.status}`)
  const data = await res.json()
  if (data.job_id) return await pollJob(data.job_id, apiKey)
  return data.url || data.image_url || null
}

async function pollJob(jobId, apiKey, maxAttempts = 30, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, intervalMs))
    const res = await fetch(`${HIGGSFIELD_BASE}/v1/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) continue
    const data = await res.json()
    if (data.status === 'completed') return data.url || data.image_url || null
    if (data.status === 'failed') throw new Error('Higgsfield job failed')
  }
  throw new Error('Higgsfield job timed out')
}

export function useSlideImage(imagePrompt, provider = 'pollinations', higgsApiKey = null) {
  const [state, setState] = useState({ url: null, loading: false, error: false })

  useEffect(() => {
    if (!imagePrompt) {
      setState({ url: null, loading: false, error: false })
      return
    }

    setState({ url: null, loading: true, error: false })
    let cancelled = false

    if (provider === 'higgsfield' && higgsApiKey) {
      generateHiggsfield(imagePrompt, higgsApiKey)
        .then(url => { if (!cancelled) setState({ url, loading: false, error: !url }) })
        .catch(() => { if (!cancelled) setState({ url: null, loading: false, error: true }) })
    } else {
      // Pollinations
      const encoded = encodeURIComponent(imagePrompt)
      const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1344&model=flux&nologo=true&seed=42`
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => { if (!cancelled) setState({ url, loading: false, error: false }) }
      img.onerror = () => { if (!cancelled) setState({ url: null, loading: false, error: true }) }
      img.src = url
      return () => { cancelled = true; img.onload = null; img.onerror = null }
    }

    return () => { cancelled = true }
  }, [imagePrompt, provider, higgsApiKey])

  return state
}
