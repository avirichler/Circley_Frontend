// src/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigation, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

/* ───────────────── Helpers ───────────────── */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pad2(n) {
  const v = Math.floor(Math.abs(n));
  return v < 10 ? `0${v}` : `${v}`;
}

function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetweenLocal(a, b) {
  const A = startOfLocalDay(a).getTime();
  const B = startOfLocalDay(b).getTime();
  return Math.floor((B - A) / (24 * 60 * 60 * 1000));
}

function secondsUntilNextLocalMidnight(now) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

function splitSeconds(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const days = Math.floor(s / 86400);
  const rem1 = s - days * 86400;
  const hours = Math.floor(rem1 / 3600);
  const rem2 = rem1 - hours * 3600;
  const mins = Math.floor(rem2 / 60);
  const secs = rem2 - mins * 60;
  return { days, hours, mins, secs };
}

function resolveStartDate({ sobrietyStart, sobrietyDays }) {
  if (sobrietyStart != null) {
    const d = new Date(sobrietyStart);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const days = Number.isFinite(sobrietyDays) ? sobrietyDays : 0;
  const now = new Date();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function dailyIndex(seedDate, listLength) {
  const d = startOfLocalDay(seedDate);
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return listLength ? hash % listLength : 0;
}

/* ───────────────── Home ───────────────── */
function Home({
  username,
  isAuthenticated,
  sobrietyDays = 45,
  // recommended: pass real sobriety start datetime from user profile
  sobrietyStart, // e.g. "2024-01-12T09:00:00"
}) {
  const { navigate } = useNavigation();
  const [sosOpen, setSosOpen] = useSosToggle();

  /* ───── Dynamic sobriety counter ───── */
  const COUNTER_MODES = useMemo(
    () => [
      { id: "days", label: "Days" },
      { id: "daysHours", label: "Days+Hours" },
      { id: "clock", label: "Clock" },
      { id: "nextDay", label: "Next Day" },
    ],
    []
  );

  const startDate = useMemo(
    () => resolveStartDate({ sobrietyStart, sobrietyDays }),
    [sobrietyStart, sobrietyDays]
  );

  const [now, setNow] = useState(() => new Date());
  const [counterModeIndex, setCounterModeIndex] = useState(2); // default: Clock

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const sobriety = useMemo(() => {
    const elapsedSec = Math.max(
      0,
      Math.floor((now.getTime() - startDate.getTime()) / 1000)
    );
    const elapsed = splitSeconds(elapsedSec);
    const daysLocal = Math.max(0, daysBetweenLocal(startDate, now));
    const untilNext = splitSeconds(secondsUntilNextLocalMidnight(now));
    return { elapsedSec, ...elapsed, daysLocal, untilNext };
  }, [now, startDate]);

  const mode = COUNTER_MODES[counterModeIndex]?.id || "clock";

  const sobrietyDisplay = useMemo(() => {
    if (mode === "days") {
      return { main: `${sobriety.daysLocal}`, sub: "days", aria: `${sobriety.daysLocal} days sober` };
    }

    if (mode === "daysHours") {
      return {
        main: `${sobriety.daysLocal}d ${pad2(sobriety.hours)}h`,
        sub: "sober",
        aria: `${sobriety.daysLocal} days and ${sobriety.hours} hours sober`,
      };
    }

    if (mode === "nextDay") {
      const dd = sobriety.daysLocal;
      const h = pad2(sobriety.untilNext.hours);
      const m = pad2(sobriety.untilNext.mins);
      const s = pad2(sobriety.untilNext.secs);
      return {
        main: `${h}:${m}:${s}`,
        sub: `until day ${dd + 1}`,
        aria: `${h} hours ${m} minutes ${s} seconds until day ${dd + 1}`,
      };
    }

    // clock: DD:HH:MM:SS
    const dd = sobriety.daysLocal;
    const hh = pad2(sobriety.hours);
    const mm = pad2(sobriety.mins);
    const ss = pad2(sobriety.secs);
    return {
      main: `${dd}:${hh}:${mm}:${ss}`,
      sub: "DD:HH:MM:SS",
      aria: `${dd} days ${hh} hours ${mm} minutes ${ss} seconds sober`,
    };
  }, [mode, sobriety]);

  const messages = useMemo(
    () => [
      "You showed up today. That counts.",
      "Small steps, real progress.",
      "One day at a time — you’re building something strong.",
      "Your future self is rooting for you.",
      "Hard days don’t cancel your growth.",
      "Keep it simple. Keep it moving.",
      "Recovery is momentum — you’ve got it.",
      "You’re doing the work. Be proud of that.",
      "Stay close to what helps you stay well.",
      "Today is a win if you stay with it.",
      "You don’t have to do this perfectly — just honestly.",
      "You’re stronger than the urge.",
      "Breathe. Reset. Continue.",
    ],
    []
  );

  const dailyMessage = useMemo(() => {
    const idx = dailyIndex(now, messages.length);
    return messages[idx] || "Keep going.";
  }, [now, messages]);

  const cycleCounterMode = () => {
    setCounterModeIndex((i) => (i + 1) % COUNTER_MODES.length);
  };

  /* ───── Updates: stacked “paper” cards ───── */
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

  const updates = useMemo(
    () => [
      {
        id: "today",
        type: "today",
        title: "Today summary",
        meta: "3 highlights",
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

  const maxUpdateIndex = updates.length - 1;

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

  const goNextUpdate = () => {
    setActiveUpdateIndex((i) => clamp(i + 1, 0, maxUpdateIndex));
    resetTopCard(false);
  };

  const goPrevUpdate = () => {
    setActiveUpdateIndex((i) => clamp(i - 1, 0, maxUpdateIndex));
    resetTopCard(false);
  };

  const jumpToUpdate = (idx) => {
    setActiveUpdateIndex(clamp(idx, 0, maxUpdateIndex));
    resetTopCard(false);
  };

  const onPointerDown = (e) => {
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

    if (!drag.current.axisLocked) {
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ax > 8 || ay > 8) {
        drag.current.axisLocked = true;
        drag.current.lockAxis = ax >= ay ? "x" : "y";
      }
    }

    // allow vertical scroll, don’t drag if user intended to scroll
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
      const direction = dx > 0 ? 1 : -1;

      setDragStyle({
        x: direction * 520,
        y: 0,
        rot: direction * 14,
        opacity: 0,
        isAnimating: true,
      });

      window.setTimeout(() => {
        // right swipe -> previous, left swipe -> next
        if (direction > 0) goPrevUpdate();
        else goNextUpdate();
        resetTopCard(false);
      }, 180);
    } else {
      resetTopCard(true);
    }
  };

  useEffect(() => {
    setActiveUpdateIndex((i) => clamp(i, 0, updates.length - 1));
  }, [updates.length]);

  const visibleCards = [];
  for (let offset = 0; offset < 3; offset += 1) {
    const idx = activeUpdateIndex + offset;
    if (idx <= maxUpdateIndex) visibleCards.push(idx);
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

          {/* Dynamic sobriety counter (tap to change mode) */}
          <div
            className="home-phone__sobriety"
            role="button"
            tabIndex={0}
            onClick={cycleCounterMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") cycleCounterMode();
            }}
            aria-label={`Sobriety counter. Mode: ${
              COUNTER_MODES[counterModeIndex]?.label || "Clock"
            }. ${sobrietyDisplay.aria}. Click to change display.`}
            style={{ cursor: "pointer" }}
          >
            <p className="home-phone__sobriety-label">
              You've been sober for{" "}
              <span style={{ fontWeight: 800 }}>
                {COUNTER_MODES[counterModeIndex]?.label || "Clock"}
              </span>
            </p>

            <p className="home-phone__sobriety-value">{sobrietyDisplay.main}</p>

            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#4b5563",
                letterSpacing: "0.02em",
              }}
            >
              {sobrietyDisplay.sub} • tap to change
            </p>

            <p
              style={{
                margin: "0.6rem 0 0",
                fontSize: "0.85rem",
                color: "#111827",
                fontWeight: 800,
              }}
            >
              {dailyMessage}
            </p>
          </div>

          {/* ✅ UPDATED: buttons go directly to proper paths */}
          <div className="home-phone__actions">
            <button
              className="home-circle-button home-circle-button--circles"
              onClick={() => navigate("/circles/")}
              type="button"
            >
              CIRCLES
            </button>

            <button
              className="home-circle-button home-circle-button--find"
              onClick={() => navigate("/find/")}
              type="button"
            >
              FIND
            </button>

            <button
              className="home-circle-button home-circle-button--log"
              onClick={() => navigate("/log/")}
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
                .reverse()
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
                              <span className="home-highlight__icon" aria-hidden="true">
                                {h.icon}
                              </span>
                              <span className="home-highlight__text">{h.text}</span>
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
            <div className="home-updates__dots" role="tablist" aria-label="Update pages">
              {updates.map((u, i) => {
                const isActive = i === activeUpdateIndex;
                return (
                  <button
                    key={`${u.id}-dot`}
                    type="button"
                    className={`home-updates__dot ${isActive ? "is-active" : ""}`}
                    onClick={() => jumpToUpdate(i)}
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
                onClick={goPrevUpdate}
                disabled={activeUpdateIndex === 0}
              >
                ← Prev
              </button>
              <button
                className="btn-ghost"
                type="button"
                onClick={goNextUpdate}
                disabled={activeUpdateIndex === maxUpdateIndex}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Home;
export { Home };
