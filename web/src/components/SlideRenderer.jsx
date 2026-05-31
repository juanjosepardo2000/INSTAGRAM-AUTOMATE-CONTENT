import { useRef } from 'react'
import domtoimage from 'dom-to-image-more'
import CoverSlide from './slides/CoverSlide'
import PainSlide from './slides/PainSlide'
import StepSlide from './slides/StepSlide'
import ProofSlide from './slides/ProofSlide'
import BridgeSlide from './slides/BridgeSlide'
import CtaSlide from './slides/CtaSlide'
import { SLIDE_WIDTH, SLIDE_HEIGHT, BORDER_RADIUS } from '../tokens'

function SlideContent({ slide, design, imageProvider, higgsApiKey }) {
  const imageProps = { imageProvider, higgsApiKey }
  switch (slide.type) {
    case 'cover':   return <CoverSlide slide={slide} design={design} {...imageProps} />
    case 'pain':    return <PainSlide slide={slide} design={design} />
    case 'step':
    case 'list_item': return <StepSlide slide={slide} design={design} />
    case 'proof':   return <ProofSlide slide={slide} design={design} {...imageProps} />
    case 'bridge':  return <BridgeSlide slide={slide} design={design} {...imageProps} />
    case 'cta':     return <CtaSlide slide={slide} design={design} />
    default:        return <PainSlide slide={slide} design={design} />
  }
}

export default function SlideRenderer({ slide, index, design, imageProvider, higgsApiKey }) {
  const slideRef = useRef(null)

  async function handleDownload() {
    if (!slideRef.current) return
    try {
      const dataUrl = await domtoimage.toPng(slideRef.current, {
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        style: { borderRadius: '0' },
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `slide-${slide.index || index + 1}.png`
      a.click()
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  return (
    <div className="slide-wrapper">
      <div className="slide-index-label">
        {slide.index || index + 1} — {slide.type}
      </div>
      <div
        ref={slideRef}
        className="slide-frame"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <SlideContent
          slide={slide}
          design={design}
          imageProvider={imageProvider}
          higgsApiKey={higgsApiKey}
        />
      </div>
      <button className="btn-download" onClick={handleDownload}>
        Download PNG
      </button>
    </div>
  )
}
