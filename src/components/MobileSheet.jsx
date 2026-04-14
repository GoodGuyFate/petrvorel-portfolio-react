import { useEffect, useRef, useState, useCallback } from "react";

// Snap points: fraction of viewport height the sheet occupies
// 0.08 = peeking  |  0.50 = default half  |  0.92 = near-full
const SNAPS = [0.10, 0.50, 0.92];
const DEFAULT_SNAP = 0; // start at half

function getClosestSnap(fraction) {
  let closest = 0;
  let minDist = Infinity;
  SNAPS.forEach((s, i) => {
    const d = Math.abs(s - fraction);
    if (d < minDist) { minDist = d; closest = i; }
  });
  return closest;
}

export default function MobileSheet({ children }) {
  const [snapIndex, setSnapIndex] = useState(DEFAULT_SNAP);
  const [dragging, setDragging] = useState(false);
  const [dragFraction, setDragFraction] = useState(null);
  const startY = useRef(0);
  const startFraction = useRef(0);
  const contentRef = useRef(null);

  const currentFraction = dragging && dragFraction !== null
    ? dragFraction
    : SNAPS[snapIndex];

  const onTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
    startFraction.current = SNAPS[snapIndex];
    setDragging(true);
  }, [snapIndex]);

  const onTouchMove = useCallback((e) => {
    if (!dragging) return;
    const dy = startY.current - e.touches[0].clientY;
    const deltaFraction = dy / window.innerHeight;
    const raw = Math.min(0.96, Math.max(0.06, startFraction.current + deltaFraction));
    setDragFraction(raw);
  }, [dragging]);

  const onTouchEnd = useCallback(() => {
    const fraction = dragFraction ?? SNAPS[snapIndex];
    const newSnap = getClosestSnap(fraction);
    setSnapIndex(newSnap);
    setDragging(false);
    setDragFraction(null);
  }, [dragFraction, snapIndex]);

  return (
    <div
      className="mobile-sheet"
      style={{
        height: `${currentFraction * 100}vh`,
        transition: dragging ? "none" : "height 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* Drag handle — only this area triggers drag */}
      <div
        className="mobile-sheet-handle"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="mobile-sheet-pill" />
      </div>

      <div className="mobile-sheet-content">
        <div ref={contentRef} className="mobile-sheet-inner">
          {children}
        </div>
      </div>
    </div>
  );
}