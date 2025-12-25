// src/Home.jsx
import React, { useState } from "react";
import { Link, useNavigation, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function Home({ username, isAuthenticated, sobrietyDays = 45 }) {
  const { navigate } = useNavigation();
  const [activeModal, setActiveModal] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  const handleBackdropClick = () => setActiveModal(null);

  const handlePillClick = (route) => {
    if (route) navigate(route);
    setActiveModal(null);
  };

  // Swipeable updates feed (first card = Today Summary w/ appointment + reminder + circle highlight)
  const updates = [
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
  ];

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
        <div className="home-modal" onClick={(e) => e.stopPropagation()}>
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

          {/* Swipeable Updates Carousel */}
          <div className="home-updates">
            <div className="home-updates__header">
              <span className="home-updates__title">Updates</span>
              <span className="home-updates__hint">Swipe</span>
            </div>

            <div className="home-updates__rail" aria-label="Updates carousel">
              {updates.map((u, idx) => (
                <article
                  key={`${u.type}-${u.id}-${idx}`}
                  className={`home-update-card home-update-card--${u.type}`}
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
              ))}
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
