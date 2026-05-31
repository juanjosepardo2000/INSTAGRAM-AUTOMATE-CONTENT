import { useState, useEffect } from 'react'

export function usePollinationsImage(imagePrompt) {
  const [state, setState] = useState({ url: null, loading: false, error: false })

  useEffect(() => {
    if (!imagePrompt) {
      setState({ url: null, loading: false, error: false })
      return
    }

    setState({ url: null, loading: true, error: false })

    const encoded = encodeURIComponent(imagePrompt)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1344&model=flux&nologo=true&seed=42`

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setState({ url, loading: false, error: false })
    img.onerror = () => setState({ url: null, loading: false, error: true })
    img.src = url

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imagePrompt])

  return state
}
