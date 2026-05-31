import { useSlideImage } from '../../hooks/useSlideImage'
import { GRADIENTS, TYPOGRAPHY, PALETTE } from '../../tokens'

export default function CoverSlide({ slide, design, imageProvider, higgsApiKey }) {
  const gradient = design?.cover_gradient || GRADIENTS.grad_aura
  const { url: imgUrl, loading } = useSlideImage(slide.image_prompt, imageProvider, higgsApiKey)
  const segments = slide.headline_segments || (slide.headline ? [slide.headline] : [])

  return (
    <div className="slide-inner" style={{ background: gradient, justifyContent: 'center', alignItems: 'center' }}>
      {slide.image_prompt && (
        <div
          className="slide-bg-image"
          style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : 'none', opacity: imgUrl ? 0.4 : 0 }}
        />
      )}
      {loading && <div className="slide-skeleton-overlay" />}
      <div className="cover-text-stack">
        {segments.map((seg, i) => (
          <span
            key={i}
            style={{
              fontFamily: TYPOGRAPHY.display,
              fontSize: i === 0 ? '52px' : '48px',
              fontWeight: 900,
              color: PALETTE.ink,
              lineHeight: 1.08,
              display: 'block',
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            {seg}
          </span>
        ))}
      </div>
    </div>
  )
}
