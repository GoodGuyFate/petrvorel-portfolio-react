import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";

function buildFallbackUrl(farm, server, id, secret, size = "b") {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

function getPhotoUrl(photo) {
  const w = window.innerWidth * (window.devicePixelRatio || 1);
  if (w <= 1000 && photo.url_c) return photo.url_c;
  if (w <= 1400 && photo.url_b) return photo.url_b;
  if (w <= 2000 && photo.url_h) return photo.url_h;
  if (photo.url_k) return photo.url_k;
  return (
    photo.url_h ||
    photo.url_b ||
    photo.url_c ||
    buildFallbackUrl(photo.farm, photo.server, photo.id, photo.secret, "b")
  );
}

function AlbumView({
  currentAlbum,
  activeIndex,
  setActiveIndex,
  isPaintings,
  isMobile,
}) {
  const swiperRef = useRef(null);
  const [counter, setCounter] = useState(
    currentAlbum ? `${activeIndex + 1} of ${currentAlbum.length}` : "",
  );

  useEffect(() => {
    if (swiperRef.current && activeIndex !== undefined) {
      swiperRef.current.slideTo(activeIndex, 0);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (currentAlbum && currentAlbum.length > 0) {
      setCounter(`${activeIndex + 1} of ${currentAlbum.length}`);
    }
  }, [activeIndex, currentAlbum]);

  if (!currentAlbum || currentAlbum.length === 0) return null;

  const currentPhoto = currentAlbum[activeIndex] || currentAlbum[0];
  const title = currentPhoto?.title || "";
  const description = currentPhoto?.description?._content || "";

  if (isMobile) {
    // Mobile: flex column — swiper fills space, caption below
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Swiper
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          speed={800}
          style={{ flex: 1, width: "100%", minHeight: 0 }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setCounter(`${swiper.activeIndex + 1} of ${currentAlbum.length}`);
          }}
        >
          {currentAlbum.map((photo, index) => (
            <SwiperSlide key={photo.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  padding: "0.75rem",
                }}
              >
                <img
                  src={getPhotoUrl(photo)}
                  alt={photo.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Caption row — below swiper, never overlapping */}
        <div
          className="swiper-caption"
          style={{
            position: "static",
            padding: "0.6rem 1rem 1rem",
            flexShrink: 0,
          }}
        >
          {isPaintings && title && <span id="photo-title">{title}</span>}
          {isPaintings && description && (
            <span id="photo-subtitle">{description}</span>
          )}
          <span id="photo-counter">
            {counter || `1 of ${currentAlbum.length}`}
          </span>
        </div>
      </div>
    );
  }

  // Desktop: original layout with absolute caption
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Swiper
        initialSlide={activeIndex}
        modules={[Keyboard]}
        keyboard={{ enabled: true }}
        speed={800}
        style={{ width: "100%", height: "100%" }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setCounter(`${swiper.activeIndex + 1} of ${currentAlbum.length}`);
        }}
      >
        {currentAlbum.map((photo, index) => (
          <SwiperSlide key={photo.id}>
            <div
              className="swiper-slide"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "1rem",
              }}
            >
              <img
                src={getPhotoUrl(photo)}
                alt={photo.title}
                loading={index === 0 ? "eager" : "lazy"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80dvh",
                  objectFit: "contain",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-caption">
        {isPaintings && title && <span id="photo-title">{title}</span>}
        {isPaintings && description && (
          <span id="photo-subtitle">{description}</span>
        )}
        <span id="photo-counter">
          {counter || `1 of ${currentAlbum.length}`}
        </span>
      </div>
    </div>
  );
}

export default AlbumView;
