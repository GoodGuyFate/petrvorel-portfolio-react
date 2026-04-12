import { lazy, Suspense } from 'react'

const AlbumView = lazy(() => import('./AlbumView'))

function Stage({ currentView, currentAlbum, activeIndex, setActiveIndex }) {
  return (
    <main className="stage">
      <div className={`landing-view ${currentView === 'landing' ? 'active' : ''}`}>
        <div className="hero">
          <img
            src="/images/background.webp"
            alt=""
            fetchpriority="high"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div className="monogram">PV</div>
        </div>
      </div>

      <div className={`album-view ${currentView === 'album' ? 'active' : ''}`}>
        <Suspense fallback={null}>
          <AlbumView
            currentAlbum={currentAlbum}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </Suspense>
      </div>

      <div className={`about-view ${currentView === 'about' ? 'active' : ''}`}>
        <div className="about-hero" style={{ backgroundImage: 'url(/images/background-about.webp)' }} />
      </div>

      <div className={`contact-view ${currentView === 'contact' ? 'active' : ''}`}>
        <div className="contact-hero" style={{ backgroundImage: 'url(/images/background-contact.webp)' }} />
      </div>
    </main>
  )
}

export default Stage