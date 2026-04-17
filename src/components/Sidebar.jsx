import { useEffect, useState } from "react";
import AlbumList from "./AlbumList";
import ThumbnailGrid from "./ThumbnailGrid";
import AboutContent from "./AboutContent";
import ContactForm from "./ContactForm";

const FINE_ART_ALBUM_ID = "72177720333063653";

function buildFlickrThumbUrl(farm, server, id, secret) {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_q.jpg`;
}

function PaintingsPreview({ photos, onThumbClick, photoCache, setPhotoCache }) {
  const [loading, setLoading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos || []);

  useEffect(() => {
    if (photos && photos.length > 0) {
      setLocalPhotos(photos);
      return;
    }
    if (photoCache[FINE_ART_ALBUM_ID]) {
      setLocalPhotos(photoCache[FINE_ART_ALBUM_ID]);
      return;
    }
    setLoading(true);
    fetch(`/api/photos?albumId=${FINE_ART_ALBUM_ID}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.photoset.photo;
        setLocalPhotos(p);
        setPhotoCache((prev) => ({ ...prev, [FINE_ART_ALBUM_ID]: p }));
      })
      .catch((err) => console.error("Failed to load paintings preview:", err))
      .finally(() => setLoading(false));
  }, [photos]);

  if (loading)
    return (
      <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1.5rem" }}>
        Loading paintings...
      </p>
    );

  return (
    <div className="thumbnail-grid" style={{ marginTop: "1.5rem" }}>
      {localPhotos.map((photo, index) => (
        <img
          key={photo.id}
          src={buildFlickrThumbUrl(
            photo.farm,
            photo.server,
            photo.id,
            photo.secret,
          )}
          alt={photo.title}
          onClick={() => onThumbClick(index, localPhotos)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
}

function Sidebar({
  currentView,
  setCurrentView,
  currentAlbum,
  setCurrentAlbum,
  activeNav,
  setActiveNav,
  activeIndex,
  setActiveIndex,
  albums,
  setAlbums,
  photoCache,
  setPhotoCache,
  isPaintings,
  setIsPaintings,
  navigateTo,
  isMobile,
}) {
  function goToPaintingsPreview() {
    navigateTo("paintings-preview", "paintings", true, null);
  }

  function goToPhotography() {
    navigateTo("landing", "photography", false, null);
  }

  function goBack() {
    window.history.back();
  }

  function handlePaintingThumbClick(index, photos) {
    setCurrentAlbum(photos);
    setActiveIndex(index);
    navigateTo("album", "paintings", true);
  }

  // On mobile album-grid view, tapping a thumbnail goes to the swiper
  function handleMobileGridThumbClick(index) {
    setActiveIndex(index);
    navigateTo("album", "photography", false);
  }

  const paintingPhotos = photoCache[FINE_ART_ALBUM_ID] || null;

  return (
    <aside className="sidebar">
      {/* Desktop-only header block */}
      <div className="sidebar-header desktop-only">
        <div className="name-row">
          <h1>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToPaintingsPreview();
              }}
            >
              Petr Vorel
            </a>
          </h1>
          <div className="social-links">
            <a
              href="https://www.facebook.com/vorel.art"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/rtepvo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.flickr.com/photos/petrvorel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Flickr"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 12c0 3.314 2.686 6 6 6s6-2.686 6-6-2.686-6-6-6-6 2.686-6 6zm12 0c0 3.314 2.686 6 6 6s6-2.686 6-6-2.686-6-6-6-6 2.686-6 6z" />
              </svg>
            </a>
          </div>
        </div>

        <nav>
          <a
            href="#"
            className={activeNav === "paintings" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goToPaintingsPreview();
            }}
          >
            Paintings
          </a>
          <a
            href="#"
            className={activeNav === "photography" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goToPhotography();
            }}
          >
            Photography
          </a>
          <a
            href="#"
            className={activeNav === "about" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigateTo("about", "about", false);
            }}
          >
            About
          </a>
          <a
            href="#"
            className={activeNav === "contact" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigateTo("contact", "contact", false);
            }}
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Mobile nav (no name row — that's in MobileLayout header) */}
      <div className="sidebar-header mobile-only">
        <nav>
          <a
            href="#"
            className={activeNav === "paintings" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goToPaintingsPreview();
            }}
          >
            Paintings
          </a>
          <a
            href="#"
            className={activeNav === "photography" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              goToPhotography();
            }}
          >
            Photography
          </a>
          <a
            href="#"
            className={activeNav === "about" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigateTo("about", "about", false);
            }}
          >
            About
          </a>
          <a
            href="#"
            className={activeNav === "contact" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigateTo("contact", "contact", false);
            }}
          >
            Contact
          </a>
        </nav>
      </div>

      <div className="sidebar-content" key={currentView}>
        {/* Desktop back button only */}
        {currentView === "album" && (
          <div className="sidebar-back desktop-only" onClick={goBack}>
            ← BACK
          </div>
        )}

        {currentView === "paintings-preview" && (
          <PaintingsPreview
            photos={paintingPhotos}
            onThumbClick={handlePaintingThumbClick}
            photoCache={photoCache}
            setPhotoCache={setPhotoCache}
          />
        )}

        {currentView === "landing" && (
          <AlbumList
            setCurrentView={setCurrentView}
            setCurrentAlbum={setCurrentAlbum}
            activeNav={activeNav}
            albums={albums}
            setAlbums={setAlbums}
            photoCache={photoCache}
            setPhotoCache={setPhotoCache}
            setIsPaintings={setIsPaintings}
            navigateTo={navigateTo}
            isMobile={isMobile}
          />
        )}

        {/* Desktop: thumbnail strip while in swiper view */}
        {currentView === "album" && currentAlbum && (
          <ThumbnailGrid
            photos={currentAlbum}
            activeIndex={activeIndex}
            onThumbnailClick={setActiveIndex}
          />
        )}

        {/* Mobile: full thumbnail grid before entering swiper */}
        {currentView === "album-grid" && currentAlbum && (
          <ThumbnailGrid
            photos={currentAlbum}
            activeIndex={-1}
            onThumbnailClick={handleMobileGridThumbClick}
          />
        )}

        {currentView === "about" && <AboutContent />}
        {currentView === "contact" && <ContactForm />}
      </div>
    </aside>
  );
}

export default Sidebar;
