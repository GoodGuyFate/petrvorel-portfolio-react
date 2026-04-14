import { useState, useEffect } from "react";
import Stage from "./components/Stage";
import Sidebar from "./components/Sidebar";
import MobileSheet from "./components/MobileSheet";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

function scrollSheetToTop() {
  const el = document.querySelector(".mobile-sheet-inner");
  if (el) el.scrollTop = 0;
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.scrollTop = 0;
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

  // Push a fake history entry so browser back button fires popstate
  // instead of navigating away from the site
  useEffect(() => {
    window.history.pushState({ view: "paintings-preview" }, "");
  }, []);

  // Intercept browser back button — navigate within the app instead
  useEffect(() => {
    function handlePopState() {
      // Always push a new state so we never run out of history entries
      window.history.pushState({ view: currentView }, "");

      if (viewHistory.length > 0) {
        const prev = viewHistory[viewHistory.length - 1];
        setViewHistory((h) => h.slice(0, -1));
        // Restore previous state
        setCurrentView(prev.view);
        setActiveNav(prev.activeNav);
        setIsPaintings(prev.isPaintings);
        if (prev.view !== "album") {
          setCurrentAlbum(null);
        }
        scrollSheetToTop();
      }
      // If no history, we're already at the root — do nothing (stay on site)
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [viewHistory, currentView]);

  // Wrap setCurrentView to record history
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
    scrollSheetToTop();
    window.history.pushState({ view }, "");
  }

  function handleSetCurrentAlbum(photos) {
    setCurrentAlbum(photos);
    setActiveIndex(0);
    scrollSheetToTop();
  }

  useEffect(() => {
    scrollSheetToTop();
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

  return (
    <div className="container">
      <Stage
        currentView={currentView}
        currentAlbum={currentAlbum}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isPaintings={isPaintings}
      />
      {isMobile ? (
        <MobileSheet currentView={currentView} activeIndex={activeIndex}>
          <Sidebar {...sidebarProps} />
        </MobileSheet>
      ) : (
        <Sidebar {...sidebarProps} />
      )}
    </div>
  );
}

export default App;
