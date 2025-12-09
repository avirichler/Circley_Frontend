// src/Circles.jsx
import React, { useState } from "react";
import { useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

export default function Circles() {
  const [sosOpen, setSosOpen] = useSosToggle();
  const [circles, setCircles] = useState([
    {
      id: 1,
      name: "New Parents in NJ",
      description: "Share tips, vent, and support each other through toddler chaos.",
      visibility: "public",
      members: 42,
    },
    {
      id: 2,
      name: "Anxiety + CBT Tools",
      description: "Practice CBT skills together with weekly check-ins and prompts.",
      visibility: "private",
      members: 18,
    },
  ]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateCircle = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please give your Circle a name.");
      return;
    }

    const newCircle = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      visibility,
      members: 1,
    };

    setCircles((prev) => [newCircle, ...prev]);
    setName("");
    setDescription("");
    setVisibility("public");
    setSuccess("Circle created successfully!");

    setTimeout(() => setSuccess(""), 3000);
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
          </header>

          <main style={{ paddingTop: "0.5rem" }}>
            <section>
              <h2 className="section-title">
                Circles
                <span className="section-title__pill">Community</span>
              </h2>
              <p className="section-subtitle">
                Join existing Circles or start your own safe space for support.
              </p>

              <div className="card">
                <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
                  Create a Circle
                </h3>
                <p className="section-subtitle" style={{ marginTop: 0 }}>
                  Circles are small, focused groups for ongoing support.
                </p>

                <form onSubmit={handleCreateCircle}>
                  <div className="form-field">
                    <label className="form-label" htmlFor="circle-name">
                      Circle name
                    </label>
                    <input
                      id="circle-name"
                      type="text"
                      className="input"
                      placeholder="e.g. Young Parents in Recovery"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="circle-description">
                      Short description
                    </label>
                    <textarea
                      id="circle-description"
                      className="textarea"
                      placeholder="What is this Circle about?"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Visibility</label>
                    <div className="pill-toggle-row">
                      <button
                        type="button"
                        className={
                          "pill-toggle" +
                          (visibility === "public" ? " pill-toggle--active" : "")
                        }
                        onClick={() => setVisibility("public")}
                      >
                        Public
                      </button>
                      <button
                        type="button"
                        className={
                          "pill-toggle" +
                          (visibility === "private" ? " pill-toggle--active" : "")
                        }
                        onClick={() => setVisibility("private")}
                      >
                        Private
                      </button>
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "0.3rem 0 0" }}>
                      {visibility === "public"
                        ? "Discoverable in search. Anyone can request to join."
                        : "Only people with an invite link can find and join."}
                    </p>
                  </div>

                  {error && (
                    <div
                      style={{
                        padding: "0.5rem 0.7rem",
                        background: "#fee2e2",
                        borderRadius: "8px",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <p style={{ margin: 0, color: "#dc2626", fontSize: "0.8rem" }}>
                        {error}
                      </p>
                    </div>
                  )}

                  {success && (
                    <div
                      style={{
                        padding: "0.5rem 0.7rem",
                        background: "#dcfce7",
                        borderRadius: "8px",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <p style={{ margin: 0, color: "#059669", fontSize: "0.8rem" }}>
                        {success}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: "100%", marginTop: "0.4rem" }}
                  >
                    Create Circle
                  </button>
                </form>
              </div>

              <div className="divider" />

              <div className="card">
                <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>
                  Explore Circles
                </h3>
                <p className="section-subtitle" style={{ marginTop: 0 }}>
                  Join existing support circles in your area.
                </p>

                {circles.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}>
                    No Circles yet. Be the first to create one!
                  </p>
                ) : (
                  <ul className="results-list">
                    {circles.map((circle) => (
                      <li key={circle.id} className="results-item">
                        <div>
                          <p className="results-item__name">{circle.name}</p>
                          <p className="results-item__meta">
                            {circle.description}
                          </p>
                          <p className="results-item__meta">
                            {circle.visibility === "public" ? "Public" : "Private"} • {circle.members} member{circle.members === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="results-item__actions">
                          <button type="button" className="btn-ghost">
                            Join
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      <BottomNav active="/circles/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
