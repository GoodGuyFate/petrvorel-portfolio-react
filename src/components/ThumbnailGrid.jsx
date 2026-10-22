function buildFlickrImageUrl(farm, server, id, secret, size = "b") {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

function ThumbnailGrid({ photos, activeIndex, onThumbnailClick }) {
  return (
    <div className="thumbnail-grid">
      {photos.map((photo, index) => (
        <img
          key={photo.id}
          src={buildFlickrImageUrl(
            photo.farm,
            photo.server,
            photo.id,
            photo.secret,
            "q",
          )}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          className={activeIndex === index ? "active" : ""}
          onClick={() => onThumbnailClick(index)}
        />
      ))}
    </div>
  );
}

export default ThumbnailGrid;