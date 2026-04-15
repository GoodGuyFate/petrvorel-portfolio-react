import { useState, useEffect } from "react";
import Stage from "./components/Stage";
import Sidebar from "./components/Sidebar";
import MobileLayout from "./components/MobileLayout";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

function scrollToTop() {
  window.scrollTo({ top: 0 });
  // desktop sidebar scroll
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.scrollTop = 0;
  // mobile content scroll
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
  const [viewHistory, setViewHistory] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.history.pushState({ view: "paintings-preview" }, "");
  }, []);

  useEffect(() => {
    function handlePopState() {
      window.history.pushState({ view: currentView }, "");

      if (viewHistory.length > 0) {
        const prev = viewHistory[viewHistory.length - 1];
        setViewHistory((h) => h.slice(0, -1));
        setCurrentView(prev.view);
        setActiveNav(prev.activeNav);
        setIsPaintings(prev.isPaintings);
        if (prev.view !== "album") {
          setCurrentAlbum(null);
        }
        scrollToTop();
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [viewHistory, currentView]);

  function navigateTo(view, nav, paintings, album = null) {
    setViewHistory((h) => [
      ...h,
      { view: currentView, activeNav, isPaintings },
    ]);
    setCurrentView(view);
    if (nav !== undefined) setActiveNav(nav);
    if (paintings !== undefined) setIsPaintings(paintings);
    if (album !== null) {
      setCurrentAlbum(album);
      setActiveIndex(0);
    }
    scrollToTop();
    window.history.pushState({ view }, "");
  }

  function handleSetCurrentAlbum(photos) {
    setCurrentAlbum(photos);
    setActiveIndex(0);
    scrollToTop();
  }

  useEffect(() => {
    scrollToTop();
  }, [currentView]);

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
      />
      <Sidebar {...sidebarProps} />
    </div>
  );
}

export default App;