import { useState, useCallback } from 'react'

const HIGGSFIELD_BASE = 'https://api.higgsfield.ai'

export function useHiggsfield(apiKey) {
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkBalance = useCallback(async () => {
    if (!apiKey) return 0
    try {
      const res = await fetch(`${HIGGSFIELD_BASE}/v1/user/balance`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const c = data.credits ?? 0
      setCredits(c)
      return c
    } catch (e) {
      setError(e.message)
      return 0
    }
  }, [apiKey])

  const generateImage = useCallback(async (prompt, aspectRatio = '9:16') => {
    if (!apiKey) throw new Error('No API key provided')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${HIGGSFIELD_BASE}/v1/image/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nano_banana_pro',
          prompt,
          aspect_ratio: aspectRatio,
          resolution: '2k',
        }),
      })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`HTTP ${res.status}: ${body}`)
      }
      const data = await res.json()
      // Poll for job completion if async
      if (data.job_id) {
        return await pollJob(data.job_id, apiKey)
      }
      return data.url || data.image_url || null
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  return { credits, loading, error, checkBalance, generateImage }
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
