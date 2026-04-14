import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'

function buildFallbackUrl(farm, server, id, secret, size = 'b') {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`
}

function getPhotoUrl(photo) {
  const w = window.innerWidth * (window.devicePixelRatio || 1)
  // Minimum quality: url_c (800px) — never go below that even on small phones.
  // url_c = 800, url_b = 1024, url_h = 1600, url_k = 2048
  if (w <= 1000 && photo.url_c) return photo.url_c   // phones & small tablets: 800px
  if (w <= 1400 && photo.url_b) return photo.url_b   // tablets & standard desktop: 1024px
  if (w <= 2000 && photo.url_h) return photo.url_h   // large desktop: 1600px
  if (photo.url_k) return photo.url_k                // 4K / retina: 2048px
  // fallback chain — always prefer larger
  return (
    photo.url_h ||
    photo.url_b ||
    photo.url_c ||
    buildFallbackUrl(photo.farm, photo.server, photo.id, photo.secret, 'b')
  )
}

function AlbumView({ currentAlbum, activeIndex, setActiveIndex, isPaintings }) {
  const swiperRef = useRef(null)
  const [counter, setCounter] = useState('1')

  useEffect(() => {
    if (swiperRef.current && activeIndex !== undefined) {
      swiperRef.current.slideTo(activeIndex)
    }
  }, [activeIndex])

  useEffect(() => {
    if (currentAlbum && currentAlbum.length > 0) {
      setCounter(`1 of ${currentAlbum.length}`)
    }
  }, [currentAlbum])

  if (!currentAlbum || currentAlbum.length === 0) return null

  const currentPhoto = currentAlbum[activeIndex] || currentAlbum[0]
  const title = currentPhoto?.title || ''
  const description = currentPhoto?.description?._content || ''

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Swiper
        modules={[Keyboard]}
        keyboard={{ enabled: true }}
        speed={800}
        style={{ width: '100%', height: '100%' }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
          setCounter(`${swiper.activeIndex + 1} of ${currentAlbum.length}`)
        }}
      >
        {currentAlbum.map((photo, index) => (
          <SwiperSlide key={photo.id}>
            <div
              className="swiper-slide"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                padding: '1rem',
              }}
            >
              <img
                src={getPhotoUrl(photo)}
                alt={photo.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-caption">
        {/* Title and description ONLY for Paintings — never for Photography */}
        {isPaintings && title && <span id="photo-title">{title}</span>}
        {isPaintings && description && <span id="photo-subtitle">{description}</span>}
        <span id="photo-counter">{counter || `1 of ${currentAlbum.length}`}</span>
      </div>
    </div>
  )
}

export default AlbumView