import { useState, useEffect } from "react";
import Stage from "./components/Stage";
import Sidebar from "./components/Sidebar";
import MobileLayout from "./components/MobileLayout";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

function scrollToTop() {
  window.scrollTo({ top: 0 });
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.scrollTop = 0;
  const mobileContent = document.querySelector(".mobile-content");
  if (mobileContent) mobileContent.scrollTop = 0;
}

function App() {
  const [currentView, setCurrentView] = useState("paintings-preview");
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [activeNav, setActiveNav] = useState("paintings");
  const [activeIndex, setActiveIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [photoCache, setPhotoCache] = useState({});
  const [isPaintings, setIsPaintings] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.history.replaceState(
      {
        view: "paintings-preview",
        nav: "paintings",
        isPaintings: true,
        album: null,
      },
      "",
    );
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        const { view, nav, isPaintings, album } = event.state;
        setCurrentView(view);
        setActiveNav(nav);
        setIsPaintings(isPaintings);
        if (album) setCurrentAlbum(album);
      } else {
        setCurrentView("paintings-preview");
        setActiveNav("paintings");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(view, nav, paintings, album = null) {
    setCurrentView(view);
    setActiveNav(nav);
    setIsPaintings(paintings);
    if (album) setCurrentAlbum(album);

    window.history.pushState({ view, nav, isPaintings: paintings, album }, "");

    scrollToTop();
  }

  function handleSetCurrentAlbum(photos) {
    setCurrentAlbum(photos);
    setActiveIndex(0);
    scrollToTop();
  }

  const sidebarProps = {
    currentView,
    setCurrentView,
    currentAlbum,
    setCurrentAlbum: handleSetCurrentAlbum,
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
  };

  if (isMobile) {
    return (
      <MobileLayout
        currentView={currentView}
        currentAlbum={currentAlbum}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isPaintings={isPaintings}
        navigateTo={navigateTo}
        activeNav={activeNav}
      >
        <Sidebar {...sidebarProps} />
      </MobileLayout>
    );
  }

  return (
    <div className="container">
      <Stage
        currentView={currentView}
        currentAlbum={currentAlbum}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isPaintings={isPaintings}
        activeNav={activeNav}
      />
      <Sidebar {...sidebarProps} />
    </div>
  );
}

export default App;
