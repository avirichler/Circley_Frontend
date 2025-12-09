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
    if (route) {
      navigate(route);
    }
    setActiveModal(null);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modals = {
      find: {
        pills: [
          {
            label: "Therapist",
            position: "top",
            route: "/find/therapist/",
          },
          {
            label: "Sober Living",
            position: "right",
            route: "/find/sober-living/",
          },
          {
            label: "Treatment",
            position: "bottom",
            route: "/find/treatment/",
          },
          {
            label: "Meetings",
            position: "left",
            route: "/find/meetings/",
          },
        ],
        centerLabel: "FIND",
      },

      circles: {
        pills: [
          {
            label: "My Circles",
            position: "top",
            route: "/circles/",
          },
          {
            label: "Join Circle",
            position: "right",
            route: "/circles/join/",
          },
          {
            label: "Create Circle",
            position: "bottom",
            route: "/circles/create/",
          },
          {
            label: "Invites",
            position: "left",
            route: "/circles/invites/",
          },
        ],
        centerLabel: "CIRCLES",
      },

      log: {
        // Use path segments instead of query params
        pills: [
          {
            label: "Milestone",
            position: "top",
            route: "/log/milestone/",
          },
          {
            label: "Trigger",
            position: "right",
            route: "/log/trigger/",
          },
          {
            label: "Goal",
            position: "bottom",
            route: "/log/goal/",
          },
          {
            label: "Daily Log",
            position: "left",
            route: "/log/",
          },
        ],
        centerLabel: "LOG",
      },
    };

    const modalData = modals[activeModal];

    return (
      <div className="home-modal__backdrop" onClick={handleBackdropClick}>
        <div className="home-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="home-modal__close"
            onClick={() => setActiveModal(null)}
          >
            Close
          </button>
          <div
            className="home-modal__circle-layout"
            data-mode={activeModal}
          >
            <div className="home-modal__center-circle">
              {modalData.centerLabel}
            </div>
            {modalData.pills.map((pill, idx) => (
              <button
                key={idx}
                className={`home-modal__pill home-modal__pill--${pill.position}`}
                onClick={() => handlePillClick(pill.route)}
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
            >
              CIRCLES
            </button>
            <button
              className="home-circle-button home-circle-button--find"
              onClick={() => setActiveModal("find")}
            >
              FIND
            </button>
            <button
              className="home-circle-button home-circle-button--log"
              onClick={() => setActiveModal("log")}
            >
              LOG
            </button>
          </div>

          <div className="home-phone__quote">
            <p>
              "Recovery is not a race. You don’t have to feel guilty if it takes
              you longer than you thought it would."
            </p>
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
