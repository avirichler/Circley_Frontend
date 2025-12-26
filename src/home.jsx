// src/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigation, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function Home({ username, isAuthenticated, sobrietyDays = 45 }) {
  const { navigate } = useNavigation();
  const [activeModal, setActiveModal] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  // Stacked updates state
  const [activeUpdateIndex, setActiveUpdateIndex] = useState(0);

  // Drag state (top card only)
  const drag = useRef({
    isDown: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    axisLocked: false,
    lockAxis: null, // "x" | "y"
  });

  const [dragStyle, setDragStyle] = useState({
    x: 0,
    y: 0,
    rot: 0,
    opacity: 1,
    isAnimating: false,
  });

  const handleBackdropClick = () => setActiveModal(null);

  const handlePillClick = (route) => {
    if (route) navigate(route);
    setActiveModal(null);
  };

  // Updates feed (generic placeholders for now)
  const updates = useMemo(
    () => [
      {
        id: "today",
        type: "today",
        title: "Today summary",
        meta: "Dec 25 • 3 highlights",
        body: "One step at a time — here’s what’s up next.",
        highlights: [
          { icon: "📅", text: "Therapy • 6:30 PM • Telehealth" },
          { icon: "⏰", text: "Reminder • Pack for meeting • In 2 hours" },
          { icon: "👥", text: "Circle • Sam: “Day 90 today… it gets lighter.”" },
        ],
      },
      {
        id: "appt-101",
        type: "appointment",
        title: "Upcoming appointment",
        body: "Therapy session with Dr. Cohen",
        meta: "Today • 6:30 PM • Telehealth",
      },
      {
        id: "rem-204",
        type: "reminder",
        title: "Reminder",
        body: "Pack your meeting book + plan your ride",
        meta: "In 2 hours",
      },
      {
        id: "circle-880",
        type: "circle",
        title: "From your circles",
        body: "“Day 90 today. If you’re at day 1, I promise it gets lighter.”",
        meta: "Sam • Serenity Circle",
      },
      {
        id: "inspo-001",
        type: "inspiration",
        title: "Daily reminder",
        body:
          "Recovery is not a race. You don’t have to feel guilty if it takes you longer than you thought it would.",
        meta: "Reflection • Anytime",
      },
    ],
    []
  );

  const maxIndex = updates.length - 1;

  const resetTopCard = (animate = true) => {
    setDragStyle({ x: 0, y: 0, rot: 0, opacity: 1, isAnimating: animate });
    if (animate) {
      window.setTimeout(() => {
        setDragStyle((s) => ({ ...s, isAnimating: false }));
      }, 220);
    } else {
      setDragStyle((s) => ({ ...s, isAnimating: false }));
    }
  };

  const goNext = () => {
    setActiveUpdateIndex((i) => clamp(i + 1, 0, maxIndex));
    resetTopCard(false);
  };

  const goPrev = () => {
    setActiveUpdateIndex((i) => clamp(i - 1, 0, maxIndex));
    resetTopCard(false);
  };

  const jumpTo = (idx) => {
    setActiveUpdateIndex(clamp(idx, 0, maxIndex));
    resetTopCard(false);
  };

  // Pointer handlers for the top stacked card
  const onPointerDown = (e) => {
    // Only left click / primary pointer
    if (e.button != null && e.button !== 0) return;

    drag.current.isDown = true;
    drag.current.pointerId = e.pointerId;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.dx = 0;
    drag.current.dy = 0;
    drag.current.axisLocked = false;
    drag.current.lockAxis = null;

    setDragStyle((s) => ({ ...s, isAnimating: false }));

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.isDown) return;
    if (drag.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    drag.current.dx = dx;
    drag.current.dy = dy;

    // lock axis to avoid fighting vertical scroll
    if (!drag.current.axisLocked) {
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ax > 8 || ay > 8) {
        drag.current.axisLocked = true;
        drag.current.lockAxis = ax >= ay ? "x" : "y";
      }
    }

    // if user is scrolling vertically, don't drag the card
    if (drag.current.lockAxis === "y") return;

    const rot = clamp(dx / 20, -10, 10);
    const fade = clamp(1 - Math.abs(dx) / 520, 0.25, 1);

    setDragStyle({
      x: dx,
      y: dy * 0.12,
      rot,
      opacity: fade,
      isAnimating: false,
    });
  };

  const onPointerUp = (e) => {
    if (!drag.current.isDown) return;
    if (drag.current.pointerId !== e.pointerId) return;

    drag.current.isDown = false;

    if (drag.current.lockAxis === "y") {
      resetTopCard(true);
      return;
    }

    const dx = drag.current.dx;
    const absDx = Math.abs(dx);
    const threshold = 110;

    if (absDx > threshold) {
      // animate off-screen then reveal next/prev
      const direction = dx > 0 ? 1 : -1;

      setDragStyle({
        x: direction * 520,
        y: 0,
        rot: direction * 14,
        opacity: 0,
        isAnimating: true,
      });

      window.setTimeout(() => {
        // right swipe -> previous, left swipe -> next (natural: swipe left advances)
        if (direction > 0) goPrev();
        else goNext();
        resetTopCard(false);
      }, 180);
    } else {
      resetTopCard(true);
    }
  };

  useEffect(() => {
    // guard if updates length changes
    setActiveUpdateIndex((i) => clamp(i, 0, updates.length - 1));
  }, [updates.length]);

  const renderModal = () => {
    if (!activeModal) return null;

    const modals = {
      find: {
        pills: [
          { label: "Therapist", position: "top", route: "/find/therapist/" },
          {
            label: "Sober Living",
            position: "right",
            route: "/find/sober-living/",
          },
          { label: "Treatment", position: "bottom", route: "/find/treatment/" },
          { label: "Meetings", position: "left", route: "/find/meetings/" },
        ],
        centerLabel: "FIND",
      },
      circles: {
        pills: [
          { label: "My Circles", position: "top", route: "/circles/" },
          { label: "Join Circle", position: "right", route: "/circles/join/" },
          {
            label: "Create Circle",
            position: "bottom",
            route: "/circles/create/",
          },
          { label: "Invites", position: "left", route: "/circles/invites/" },
        ],
        centerLabel: "CIRCLES",
      },
      log: {
        pills: [
          { label: "Milestone", position: "top", route: "/log/milestone/" },
          { label: "Trigger", position: "right", route: "/log/trigger/" },
          { label: "Goal", position: "bottom", route: "/log/goal/" },
          { label: "Daily Log", position: "left", route: "/log/" },
        ],
        centerLabel: "LOG",
      },
    };

    const modalData = modals[activeModal];
    if (!modalData) return null;

    return (
      <div className="home-modal__backdrop" onClick={handleBackdropClick}>
        <div className="home-modal" onClick={(ev) => ev.stopPropagation()}>
          <button
            className="home-modal__close"
            onClick={() => setActiveModal(null)}
            type="button"
          >
            Close
          </button>

          <div className="home-modal__circle-layout" data-mode={activeModal}>
            <div className="home-modal__center-circle">
              {modalData.centerLabel}
            </div>

            {modalData.pills.map((pill, idx) => (
              <button
                key={`${pill.position}-${idx}`}
                className={`home-modal__pill home-modal__pill--${pill.position}`}
                onClick={() => handlePillClick(pill.route)}
                type="button"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render 3 cards: top + two beneath
  const visibleCards = [];
  for (let offset = 0; offset < 3; offset += 1) {
    const idx = activeUpdateIndex + offset;
    if (idx <= maxIndex) visibleCards.push(idx);
  }

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">NextCircle.org</p>
              <h1 className="home-phone__title">Circely</h1>
            </div>

            {isAuthenticated ? (
              <div className="home-phone__auth">
                <p className="home-phone__welcome">
                  Welcome back, <span>{username}</span>
                </p>
              </div>
            ) : (
              <div className="home-phone__auth">
                <Link href="/login/" className="home-phone__auth-link">
                  Login
                </Link>
                <Link
                  href="/signup/"
                  className="home-phone__auth-link home-phone__auth-link--primary"
                >
                  Join now
                </Link>
              </div>
            )}
          </header>

          <div className="home-phone__sobriety">
            <p className="home-phone__sobriety-label">You've been sober for</p>
            <p className="home-phone__sobriety-value">{sobrietyDays} days</p>
          </div>

          <div className="home-phone__actions">
            <button
              className="home-circle-button home-circle-button--circles"
              onClick={() => setActiveModal("circles")}
              type="button"
            >
              CIRCLES
            </button>

            <button
              className="home-circle-button home-circle-button--find"
              onClick={() => setActiveModal("find")}
              type="button"
            >
              FIND
            </button>

            <button
              className="home-circle-button home-circle-button--log"
              onClick={() => setActiveModal("log")}
              type="button"
            >
              LOG
            </button>
          </div>

          {/* Updates: stacked overlay “paper stack” */}
          <div className="home-updates">
            <div className="home-updates__header">
              <span className="home-updates__title">Updates</span>
              <span className="home-updates__hint">Swipe</span>
            </div>

            <div className="home-stack" aria-label="Updates stack" role="list">
              {visibleCards
                .slice()
                .reverse() // bottom first, top last
                .map((idx) => {
                  const u = updates[idx];
                  const isTop = idx === activeUpdateIndex;

                  const depth = idx - activeUpdateIndex; // 0,1,2
                  const scale = depth === 0 ? 1 : depth === 1 ? 0.975 : 0.955;
                  const y = depth === 0 ? 0 : depth === 1 ? 10 : 18;

                  const transform = isTop
                    ? `translate3d(${dragStyle.x}px, ${dragStyle.y}px, 0) rotate(${dragStyle.rot}deg)`
                    : `translate3d(0, ${y}px, 0) scale(${scale})`;

                  const className = [
                    "home-update-card",
                    `home-update-card--${u.type}`,
                    "home-update-card--stacked",
                    isTop ? "is-top" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <article
                      key={`${u.id}-${idx}`}
                      role="listitem"
                      className={className}
                      style={{
                        transform,
                        opacity: isTop ? dragStyle.opacity : 1,
                        transition: isTop
                          ? dragStyle.isAnimating
                            ? "transform 180ms ease, opacity 180ms ease"
                            : "none"
                          : "transform 200ms ease",
                        zIndex: 10 + (3 - depth),
                        pointerEvents: isTop ? "auto" : "none",
                      }}
                      onPointerDown={isTop ? onPointerDown : undefined}
                      onPointerMove={isTop ? onPointerMove : undefined}
                      onPointerUp={isTop ? onPointerUp : undefined}
                      onPointerCancel={isTop ? onPointerUp : undefined}
                    >
                      <div className="home-update-card__top">
                        <span className="home-update-card__pill">{u.title}</span>
                        <span className="home-update-card__meta">{u.meta}</span>
                      </div>

                      <p className="home-update-card__body">{u.body}</p>

                      {u.type === "today" && Array.isArray(u.highlights) ? (
                        <div className="home-update-card__highlights">
                          {u.highlights.map((h, i) => (
                            <div className="home-highlight" key={i}>
                              <span
                                className="home-highlight__icon"
                                aria-hidden="true"
                              >
                                {h.icon}
                              </span>
                              <span className="home-highlight__text">
                                {h.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="home-update-card__actions">
                        <button
                          className="btn-ghost"
                          type="button"
                          onClick={() => navigate(`/updates/${u.id}/`)}
                        >
                          See more
                        </button>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* Dots */}
            <div
              className="home-updates__dots"
              role="tablist"
              aria-label="Update pages"
            >
              {updates.map((u, i) => {
                const isActive = i === activeUpdateIndex;
                return (
                  <button
                    key={`${u.id}-dot`}
                    type="button"
                    className={`home-updates__dot ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to update ${i + 1}`}
                    aria-selected={isActive}
                    role="tab"
                  />
                );
              })}
            </div>

            {/* Optional controls (keep or remove) */}
            <div className="home-stack__controls">
              <button
                className="btn-ghost"
                type="button"
                onClick={goPrev}
                disabled={activeUpdateIndex === 0}
              >
                ← Prev
              </button>
              <button
                className="btn-ghost"
                type="button"
                onClick={goNext}
                disabled={activeUpdateIndex === maxIndex}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
      {renderModal()}
    </>
  );
}

export default Home;
export { Home };
