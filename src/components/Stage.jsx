import { lazy, Suspense } from "react";

const AlbumView = lazy(() => import("./AlbumView"));

function Stage({
  currentView,
  currentAlbum,
  activeIndex,
  setActiveIndex,
  isPaintings,
}) {
  // paintings-preview keeps the hero visible (same as landing)
  const showHero =
    currentView === "landing" || currentView === "paintings-preview";

  return (
    <main className="stage">
      <div className={`landing-view ${showHero ? "active" : ""}`}>
        <div className="hero">
          <img
            src="/images/background.webp"
            alt=""
            fetchPriority="high"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      <div className={`album-view ${currentView === "album" ? "active" : ""}`}>
        <Suspense fallback={null}>
          <AlbumView
            currentAlbum={currentAlbum}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isPaintings={isPaintings}
          />
        </Suspense>
      </div>

      <div className={`about-view ${currentView === "about" ? "active" : ""}`}>
        <div
          className="about-hero"
          style={{ backgroundImage: "url(/images/background-about.webp)" }}
        />
      </div>

      <div
        className={`contact-view ${currentView === "contact" ? "active" : ""}`}
      >
        <div
          className="contact-hero"
          style={{ backgroundImage: "url(/images/background-contact.webp)" }}
        />
      </div>
    </main>
  );
}

export default Stage;
