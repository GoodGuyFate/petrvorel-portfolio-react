import { useEffect, useRef, useState, useCallback } from "react";

// SNAPS indices: 0 = Closed (Header only), 1 = Half, 2 = Full
const SNAPS = [0, 0.5, 0.92];
const DEFAULT_SNAP = 2;
const HEADER_HEIGHT_PX = 90;

export default function MobileSheet({ children, currentView, activeIndex }) {
  const [snapIndex, setSnapIndex] = useState(DEFAULT_SNAP);
  const [dragging, setDragging] = useState(false);
  const [dragFraction, setDragFraction] = useState(null);
  const startY = useRef(0);
  const startFraction = useRef(0);

  const getMinFraction = () => HEADER_HEIGHT_PX / window.innerHeight;

  useEffect(() => {
    if (currentView === "album") {
      setSnapIndex(0); // Snap down to header when viewing an image
    } else if (
      currentView === "landing" ||
      currentView === "paintings-preview"
    ) {
      setSnapIndex(2); // Snap open when browsing lists
    }
  }, [currentView, activeIndex]);

  const getClosestSnap = (fraction) => {
    const min = getMinFraction();
    const dynamicSnaps = [min, 0.5, 0.92];
    let closest = 0;
    let minDist = Infinity;

    dynamicSnaps.forEach((s, i) => {
      const d = Math.abs(s - fraction);
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    });
    return closest;
  };

  const currentFraction =
    dragging && dragFraction !== null
      ? dragFraction
      : snapIndex === 0
        ? getMinFraction()
        : SNAPS[snapIndex];

  const onTouchStart = useCallback(
    (e) => {
      startY.current = e.touches[0].clientY;
      startFraction.current = currentFraction;
      setDragging(true);
    },
    [currentFraction],
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!dragging) return;
      const dy = startY.current - e.touches[0].clientY;
      const deltaFraction = dy / window.innerHeight;

      const min = getMinFraction();
      // Clamping the drag between the floor and the near-top
      const raw = Math.min(
        0.96,
        Math.max(min, startFraction.current + deltaFraction),
      );
      setDragFraction(raw);
    },
    [dragging, currentFraction],
  );

  const onTouchEnd = useCallback(() => {
    const min = getMinFraction();
    const dynamicSnaps = [min, 0.5, 0.92];
    const fraction = dragFraction ?? currentFraction;
    const delta = fraction - dynamicSnaps[snapIndex];

    let newSnap = getClosestSnap(fraction);

    // force it to move one step in the direction of the swipe.
    if (Math.abs(delta) > 0.05) {
      if (
        delta > 0 &&
        newSnap <= snapIndex &&
        snapIndex < dynamicSnaps.length - 1
      ) {
        newSnap = snapIndex + 1;
      } else if (delta < 0 && newSnap >= snapIndex && snapIndex > 0) {
        newSnap = snapIndex - 1;
      }
    }

    setSnapIndex(newSnap);
    setDragging(false);
    setDragFraction(null);
  }, [dragFraction, snapIndex, currentFraction]);

  return (
    <div
      className="mobile-sheet"
      style={{
        height: dragging
          ? `${currentFraction * 100}vh`
          : snapIndex === 0
            ? `${HEADER_HEIGHT_PX}px`
            : `${SNAPS[snapIndex] * 100}vh`,
        transition: dragging
          ? "none"
          : "height 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <div
        className="mobile-sheet-handle"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="mobile-sheet-pill" />
      </div>

      <div className="mobile-sheet-content">
        <div className="mobile-sheet-inner">{children}</div>
      </div>
    </div>
  );
}
