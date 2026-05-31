import { PALETTE, TYPOGRAPHY, GRADIENTS } from '../../tokens'

export default function PainSlide({ slide }) {
  return (
    <div
      className="slide-inner"
      style={{
        background: GRADIENTS.grad_mist,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '40px 32px',
      }}
    >
      <div style={{ marginTop: 'auto', marginBottom: 'auto', width: '100%' }}>
        {slide.headline && (
          <h2
            style={{
              fontFamily: TYPOGRAPHY.display,
              fontSize: '30px',
              fontWeight: 700,
              color: PALETTE.ink,
              lineHeight: 1.2,
              marginBottom: '18px',
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
