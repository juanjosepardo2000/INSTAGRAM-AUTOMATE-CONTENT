import { PALETTE, TYPOGRAPHY, GRADIENTS } from '../../tokens'

export default function CtaSlide({ slide }) {
  return (
    <div
      className="slide-inner"
      style={{
        background: GRADIENTS.grad_mist,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%' }}>
        {slide.headline && (
          <h2
            style={{
              fontFamily: TYPOGRAPHY.display,
              fontSize: '32px',
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1.15,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            {slide.headline}
          </h2>
        )}

        {slide.keyword && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: PALETTE.accentPrimary,
              color: '#fff',
              fontFamily: TYPOGRAPHY.display,
              fontSize: '36px',
              fontWeight: 900,
              padding: '14px 36px',
              borderRadius: '999px',
              marginBottom: '24px',
              letterSpacing: '0.05em',
            }}
          >
            {slide.keyword}
          </div>
        )}

        {slide.offer && (
          <p
            style={{
              fontFamily: TYPOGRAPHY.body,
              fontSize: '15px',
              fontWeight: 600,
              color: PALETTE.accentPrimary,
              marginBottom: '14px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {slide.offer}
          </p>
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
