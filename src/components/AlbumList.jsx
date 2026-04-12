import { useEffect, useState } from "react";

const EXCLUDED_ALBUMS = [
  "72157683009116294", // Kate Ri
  "72157701085527565", // Pejsci
  "72177720333044693", // Film Collection
];

function buildFlickrImageUrl(farm, server, id, secret, size = "b") {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

function AlbumList({ setCurrentView, setCurrentAlbum, activeNav, albums, setAlbums, photoCache, setPhotoCache }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (albums.length > 0) return;

    async function fetchAlbums() {
      setLoading(true);
      try {
        const response = await fetch("/api/albums");
        const data = await response.json();
        const filtered = data.photosets.photoset.filter(
          (album) => !EXCLUDED_ALBUMS.includes(album.id)
        );
        setAlbums(filtered);
      } catch (err) {
        setError("Failed to load albums.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  async function handleAlbumHover(albumId) {
    if (photoCache[albumId]) return;
    try {
      const response = await fetch(`/api/photos?albumId=${albumId}`);
      const data = await response.json();
      setPhotoCache(prev => ({
        ...prev,
        [albumId]: data.photoset.photo
      }));
    } catch (err) {
      console.error(`Failed to preload album ${albumId}`, err);
    }
  }

  async function handleAlbumClick(albumId) {
    if (photoCache[albumId]) {
      setCurrentAlbum(photoCache[albumId]);
      setCurrentView("album");
      return;
    }

    try {
      const response = await fetch(`/api/photos?albumId=${albumId}`);
      const data = await response.json();
      setCurrentAlbum(data.photoset.photo);
      setCurrentView("album");
    } catch (err) {
      console.error("Failed to load photos:", err);
    }
  }

  if (loading)
    return (
      <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1.5rem" }}>
        Loading albums...
      </p>
    );
  if (error)
    return <p style={{ color: "#aaa", marginTop: "1.5rem" }}>{error}</p>;

  return (
    <div className="album-list">
      {albums.map((album) => (
        <div
          key={album.id}
          className="album-item"
          onClick={() => handleAlbumClick(album.id)}
          onMouseEnter={() => handleAlbumHover(album.id)}
        >
          <img
            src={buildFlickrImageUrl(
              album.farm,
              album.server,
              album.primary,
              album.secret,
              "q"
            )}
            alt={album.title._content}
          />
          <div className="album-item-info">
            <span className="album-title">{album.title._content}</span>
            <span className="album-desc">
              {album.description._content || ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlbumList;