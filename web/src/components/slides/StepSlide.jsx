import { PALETTE, TYPOGRAPHY, GRADIENTS } from '../../tokens'

export default function StepSlide({ slide }) {
  const badge = slide.badge || (slide.step_number ? `Step ${slide.step_number}` : null)
    || (slide.item_number ? `${slide.item_number}` : null)

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
        {badge && (
          <span
            style={{
              display: 'inline-block',
              background: PALETTE.accentPrimary,
              color: '#fff',
              fontFamily: TYPOGRAPHY.body,
              fontSize: '13px',
              fontWeight: 600,
              padding: '5px 16px',
              borderRadius: '999px',
              marginBottom: '18px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </span>
        )}
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
