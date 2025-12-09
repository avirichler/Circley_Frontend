// src/Circles.jsx
import React from "react";
import { useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function Circles({ username }) {
  const [sosOpen, setSosOpen] = useSosToggle();

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          {/* Header */}
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">NextCircle.org</p>
              <h1 className="home-phone__title">Circely</h1>
            </div>
          </header>

          {/* Circles Screen Content */}
          <main style={{ paddingTop: "0.75rem" }}>
            {username && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#4b5563",
                  margin: "0 0 0.4rem",
                }}
              >
                Hello, <strong>{username}</strong>
              </p>
            )}

            <h2 className="section-title">
              My circles
              <span className="section-title__pill">Community</span>
            </h2>
            <p className="section-subtitle">
              Stay connected with the people and groups that support your
              recovery.
            </p>

            {/* Card 1 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>Morning Check-In</strong>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Daily at 8:00 AM • 12 members
                  </div>
                </div>
                <span className="pill-soft">Active</span>
              </div>
              <div className="card-meta-row">
                <span>Next: Today, 8:00 AM</span>
                <span>Host: Alex</span>
              </div>
              <div className="button-row">
                <button type="button" className="btn-ghost">
                  Open chat
                </button>
                <button type="button" className="btn-ghost">
                  View schedule
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>
                    Weekend Sober Activities
                  </strong>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Saturdays • 7 members
                  </div>
                </div>
                <span className="pill-soft">Invited</span>
              </div>
              <div className="card-meta-row">
                <span>Next: Sat 4:00 PM</span>
                <span>Host: Jamie</span>
              </div>
              <div className="button-row">
                <button type="button" className="btn-ghost">
                  View details
                </button>
                <button type="button" className="btn-ghost">
                  Respond
                </button>
              </div>
            </div>

            <div className="divider" />

            <div className="button-row">
              <button
                type="button"
                className="btn-primary"
                // Future: gate by verification / open create-circle flow
              >
                Create new circle
              </button>
              <button
                type="button"
                className="btn-ghost"
                // Future: open "join with invite code" flow
              >
                Join with invite code
              </button>
            </div>
          </main>
        </div>
      </div>

      <BottomNav active="/circles/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Circles;
export { Circles };
