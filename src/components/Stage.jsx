import { lazy, Suspense } from "react";

const AlbumView = lazy(() => import("./AlbumView"));

function Stage({
  currentView,
  currentAlbum,
  activeIndex,
  setActiveIndex,
  isPaintings,
  activeNav,
}) {
  // paintings-preview keeps the paintings hero visible
  const showPaintingsHero =
    currentView === "paintings-preview";

  // photography landing (album list) — no album open yet
  const showPhotographyHero =
    currentView === "landing" && activeNav === "photography";

  return (
    <main className="stage" data-view={currentView}>
      {/* Paintings hero */}
      <div className={`landing-view${showPaintingsHero ? " active" : ""}`}>
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

      {/* Photography landing hero */}
      <div className={`photography-view${showPhotographyHero ? " active" : ""}`}>
        <div className="hero">
          <img
            src="/images/background-photography.webp"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      <div className={`album-view${currentView === "album" ? " active" : ""}`}>
        <Suspense fallback={null}>
          <AlbumView
            currentAlbum={currentAlbum}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isPaintings={isPaintings}
          />
        </Suspense>
      </div>

      <div className={`about-view${currentView === "about" ? " active" : ""}`}>
        <img
          src="/images/background-about.webp"
          alt="Petr Vorel"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>

      <div
        className={`contact-view${currentView === "contact" ? " active" : ""}`}
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