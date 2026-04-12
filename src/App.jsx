import { useState } from "react";
import Stage from "./components/Stage";
import Sidebar from "./components/Sidebar";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [activeNav, setActiveNav] = useState("photography");
  const [activeIndex, setActiveIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [photoCache, setPhotoCache] = useState({});

  function handleSetCurrentAlbum(photos) {
    setCurrentAlbum(photos);
    setActiveIndex(0);
  }

  return (
    <div className="container">
      <Stage
        currentView={currentView}
        currentAlbum={currentAlbum}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentAlbum={currentAlbum}
        setCurrentAlbum={handleSetCurrentAlbum}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        albums={albums}
        setAlbums={setAlbums}
        photoCache={photoCache}
        setPhotoCache={setPhotoCache}
      />
    </div>
  );
}

export default App;
