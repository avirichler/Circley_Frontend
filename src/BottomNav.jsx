// src/BottomNav.jsx
import React, { useEffect, useState } from "react";
import { Link, usePage } from "./navigation";
import "./Home.css";

/* ────────────────────────────────────────────────
   SOS Overlay Component (named export)
──────────────────────────────────────────────────*/
export function SOSOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="home-sos-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency Support"
      onClick={onClose}
    >
      <div
        className="home-sos-shell"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="home-sos-card">
          <h2 className="home-sos-title">Emergency Support</h2>
          <p className="home-sos-subtitle">
            You are not alone. Choose an option below:
          </p>

          <div className="home-sos-actions">
            <a href="tel:988" className="home-sos-btn home-sos-btn--red">
              Call 988 (Crisis Hotline)
            </a>

            <button className="home-sos-btn home-sos-btn--primary">
              Contact My Sponsor
            </button>

            <button className="home-sos-btn home-sos-btn--outline-red">
              Distress Flare
            </button>

            <button className="home-sos-btn">Grounding Exercises</button>
            <button className="home-sos-btn">Nearest Meeting</button>
            <button className="home-sos-btn">Chat</button>
          </div>

          <button
            type="button"
            className="home-sos-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Bottom Navigation Component (default export)
──────────────────────────────────────────────────*/
export default function BottomNav({ active }) {
  const { url } = usePage();
  const current = active || url || "/";
  const [isSosOpen, setIsSosOpen] = useState(false);

  useEffect(() => {
    setIsSosOpen(false);
  }, [current]);

  const isActive = (href) => {
    if (href === "/") return current === "/";
    return current.startsWith(href);
  };

  const closeSos = () => setIsSosOpen(false);

  return (
    <>
      <nav className="home-global-nav" aria-label="Primary navigation">
        <Link
          href="/"
          className={`home-bottom-nav__item ${
            isActive("/") ? "is-active" : ""
          }`}
          onClick={closeSos}
        >
          Home
        </Link>

        <Link
          href="/account/"
          className={`home-bottom-nav__item ${
            isActive("/account/") ? "is-active" : ""
          }`}
          onClick={closeSos}
        >
          Account
        </Link>

        <button
          type="button"
          className="home-bottom-nav__item home-bottom-nav__item--sos"
          onClick={() => setIsSosOpen(true)}
        >
          SOS
        </button>

        <Link
          href="/rate/"
          className={`home-bottom-nav__item ${
            isActive("/rate/") ? "is-active" : ""
          }`}
          onClick={closeSos}
        >
          Rate
        </Link>

        {/* 🔄 Updated from Verify → Check-In */}
        <Link
          href="/checkin/"
          className={`home-bottom-nav__item ${
            isActive("/checkin/") ? "is-active" : ""
          }`}
          onClick={closeSos}
        >
          Check-In
        </Link>
      </nav>

      <SOSOverlay isOpen={isSosOpen} onClose={closeSos} />
    </>
  );
}
