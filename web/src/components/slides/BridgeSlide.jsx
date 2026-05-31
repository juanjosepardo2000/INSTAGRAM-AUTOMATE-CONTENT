import { useSlideImage } from '../../hooks/useSlideImage'
import { PALETTE, TYPOGRAPHY, GRADIENTS } from '../../tokens'

export default function BridgeSlide({ slide, design, imageProvider, higgsApiKey }) {
  const gradient = design?.cover_gradient || GRADIENTS.grad_aura
  const { url: imgUrl, loading } = useSlideImage(slide.image_prompt, imageProvider, higgsApiKey)

  return (
    <div
      className="slide-inner"
      style={{
        background: gradient,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px',
        textAlign: 'center',
      }}
    >
      {slide.image_prompt && (
        <div
          className="slide-bg-image"
          style={{
            backgroundImage: imgUrl ? `url(${imgUrl})` : 'none',
            opacity: imgUrl ? 0.35 : 0,
          }}
        />
      )}
      {loading && <div className="slide-skeleton-overlay" />}

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {slide.headline && (
          <h2
            style={{
              fontFamily: TYPOGRAPHY.display,
              fontSize: '28px',
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1.2,
              marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            {slide.headline}
          </h2>
        )}
        {slide.body && (
          <p
            style={{
              fontFamily: TYPOGRAPHY.body,
              fontSize: '16px',
              fontWeight: 400,
              color: PALETTE.inkSoft,
              lineHeight: 1.6,
            }}
          >
            {slide.body}
          </p>
        )}
      </div>
    </div>
  )
}
