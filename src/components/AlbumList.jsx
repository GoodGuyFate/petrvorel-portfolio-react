import { useEffect, useState } from "react";

const FINE_ART_ALBUM_ID = "72177720333063653";

function buildFlickrImageUrl(farm, server, id, secret, size = "b") {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

function AlbumList({
  setCurrentView, setCurrentAlbum,
  activeNav, albums, setAlbums,
  photoCache, setPhotoCache,
  setIsPaintings, navigateTo,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (albums.length > 0) return;
    async function fetchCollections() {
      setLoading(true);
      try {
        const response = await fetch("/api/albums");
        const data = await response.json();
        setAlbums(data.collections);
        fetch(`/api/photos?albumId=${FINE_ART_ALBUM_ID}`)
          .then(r => r.json())
          .then(data => {
            setPhotoCache(prev => ({ ...prev, [FINE_ART_ALBUM_ID]: data.photoset.photo }));
          })
          .catch(err => console.error("Failed to preload Fine Art:", err));
      } catch (err) {
        setError("Failed to load albums.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  async function handleAlbumHover(albumId) {
    if (photoCache[albumId]) return;
    try {
      const r = await fetch(`/api/photos?albumId=${albumId}`);
      const data = await r.json();
      setPhotoCache(prev => ({ ...prev, [albumId]: data.photoset.photo }));
    } catch (err) {
      console.error(`Failed to preload album ${albumId}`, err);
    }
  }

  async function handleAlbumClick(albumId) {
    let photos = photoCache[albumId];
    if (!photos) {
      try {
        const r = await fetch(`/api/photos?albumId=${albumId}`);
        const data = await r.json();
        photos = data.photoset.photo;
        setPhotoCache(prev => ({ ...prev, [albumId]: photos }));
      } catch (err) {
        console.error("Failed to load photos:", err);
        return;
      }
    }
    setCurrentAlbum(photos);
    navigateTo("album", "photography", false);
  }

  if (loading) return (
    <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1.5rem" }}>Loading albums...</p>
  );
  if (error) return <p style={{ color: "#aaa", marginTop: "1.5rem" }}>{error}</p>;

  return (
    <div className="album-list">
      {albums.map((collection) => (
        <div key={collection.id}>
          <div className="collection-divider">{collection.title}</div>
          {collection.set.map((album) => (
            <div
              key={album.id}
              className="album-item"
              onClick={() => handleAlbumClick(album.id)}
              onMouseEnter={() => handleAlbumHover(album.id)}
            >
              {album.cover && (
                <img
                  src={buildFlickrImageUrl(album.cover.farm, album.cover.server, album.cover.primary, album.cover.secret, "q")}
                  alt={album.title}
                />
              )}
              <div className="album-item-info">
                <span className="album-title">{album.title}</span>
                <span className="album-desc">{album.description || ""}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AlbumList;