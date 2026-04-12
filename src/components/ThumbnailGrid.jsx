function ThumbnailGrid({ photos, activeIndex, onThumbnailClick }) {
  function buildFlickrImageUrl(farm, server, id, secret, size = 'b') {
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`
  }

  return (
    <div className="thumbnail-grid">
      {photos.map((photo, index) => (
        <img
          key={photo.id}
          src={buildFlickrImageUrl(photo.farm, photo.server, photo.id, photo.secret, 'q')}
          alt={photo.title}
          className={activeIndex === index ? 'active' : ''}
          onClick={() => onThumbnailClick(index)}
        />
      ))}
    </div>
  )
}

export default ThumbnailGrid