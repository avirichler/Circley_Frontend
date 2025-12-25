import React, { useState, useRef, useEffect } from "react";

export default function CardStack({ items, renderCard, onEmptyAction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const threshold = 50;

    if (currentX > threshold) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (currentX < -threshold) {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setCurrentX(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 50;

    if (currentX > threshold) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (currentX < -threshold) {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setCurrentX(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, currentX, currentIndex]);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.8rem" }}>
          No circles to explore.
        </p>
        {onEmptyAction && onEmptyAction()}
      </div>
    );
  }

  const item = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          position: "relative",
          height: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          perspective: "1000px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            maxWidth: "100%",
            height: "100%",
            transform: `translateX(${currentX}px)`,
            transition: isDragging ? "none" : "transform 200ms ease-out",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "1rem",
              boxShadow: "0 12px 24px rgba(15, 23, 42, 0.15)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              userSelect: "none",
            }}
          >
            {renderCard(item)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.8rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          {currentIndex + 1} of {items.length}
        </span>
        <div style={{ flex: 1, height: "4px", background: "#e5e7eb", borderRadius: "999px" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#1e40af",
              borderRadius: "999px",
              transition: "width 200ms ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}
