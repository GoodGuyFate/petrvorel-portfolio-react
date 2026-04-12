import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'

function buildFlickrImageUrl(farm, server, id, secret, size = 'b') {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`
}

function AlbumView({ currentAlbum, activeIndex, setActiveIndex }) {
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
            <div className="swiper-slide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '2rem' }}>
              <img
                src={buildFlickrImageUrl(photo.farm, photo.server, photo.id, photo.secret, 'b')}
                alt={photo.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-caption">
        <span id="photo-title">{currentPhoto?.title || ''}</span>
        <span id="photo-subtitle">{currentPhoto?.description?._content || ''}</span>
        <span id="photo-counter">{counter || `1 of ${currentAlbum.length}`}</span>
      </div>
    </div>
  )
}

export default AlbumView