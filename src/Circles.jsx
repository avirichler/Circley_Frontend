// src/Circles.jsx
import React, { useMemo, useState } from "react";
import { useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";
import CardStack from "./CardStack";

export default function Circles() {
  const [sosOpen, setSosOpen] = useSosToggle();

  const [circles, setCircles] = useState([
    {
      id: 1,
      name: "New Parents in NJ",
      description: "Share tips, vent, and support each other through toddler chaos.",
      visibility: "public",
      members: 42,
      isMember: false,
    },
    {
      id: 2,
      name: "Anxiety + CBT Tools",
      description: "Practice CBT skills together with weekly check-ins and prompts.",
      visibility: "private",
      members: 18,
      isMember: false,
    },
  ]);

  // Create form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Explore controls
  const [query, setQuery] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all"); // all | public | private

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
      isMember: true, // creator is a member
    };

    setCircles((prev) => [newCircle, ...prev]);
    setName("");
    setDescription("");
    setVisibility("public");
    setSuccess("Circle created successfully!");

    window.setTimeout(() => setSuccess(""), 3000);
  };

  const handleToggleMembership = (circleId) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;

        const joining = !c.isMember;
        const nextMembers = Math.max(0, (c.members || 0) + (joining ? 1 : -1));

        return { ...c, isMember: joining, members: nextMembers };
      })
    );
  };

  const filteredCircles = useMemo(() => {
    const q = query.trim().toLowerCase();

    return circles.filter((c) => {
      const matchesVisibility =
        filterVisibility === "all" ? true : c.visibility === filterVisibility;

      const matchesQuery = !q
        ? true
        : `${c.name} ${c.description}`.toLowerCase().includes(q);

      return matchesVisibility && matchesQuery;
    });
  }, [circles, query, filterVisibility]);

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
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "#6b7280",
                        margin: "0.3rem 0 0",
                      }}
                    >
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
                  Swipe or drag to browse circles.
                </p>

                {/* Search + Filter */}
                <div style={{ display: "flex", gap: "0.5rem", margin: "0.6rem 0 0.9rem" }}>
                  <input
                    className="input"
                    placeholder="Search circles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <div className="pill-toggle-row" style={{ margin: 0 }}>
                    <button
                      type="button"
                      className={
                        "pill-toggle" + (filterVisibility === "all" ? " pill-toggle--active" : "")
                      }
                      onClick={() => setFilterVisibility("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={
                        "pill-toggle" +
                        (filterVisibility === "public" ? " pill-toggle--active" : "")
                      }
                      onClick={() => setFilterVisibility("public")}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      className={
                        "pill-toggle" +
                        (filterVisibility === "private" ? " pill-toggle--active" : "")
                      }
                      onClick={() => setFilterVisibility("private")}
                    >
                      Private
                    </button>
                  </div>
                </div>

                <CardStack
                  items={filteredCircles}
                  renderCard={(circle) => {
                    const isPublic = circle.visibility === "public";
                    const isMember = !!circle.isMember;

                    return (
                      <>
                        <div>
                          <p
                            style={{
                              fontSize: "0.65rem",
                              color: "#6b7280",
                              margin: "0 0 0.3rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {isPublic ? "Public" : "Private"}
                          </p>

                          <h4
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              margin: "0 0 0.5rem",
                              color: "#111827",
                            }}
                          >
                            {circle.name}
                          </h4>

                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#4b5563",
                              margin: "0 0 1rem",
                              lineHeight: "1.5",
                            }}
                          >
                            {circle.description}
                          </p>
                        </div>

                        <div>
                          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0 0 0.6rem" }}>
                            <span style={{ fontWeight: "600" }}>{circle.members}</span> member
                            {circle.members === 1 ? "" : "s"}
                            {isMember ? (
                              <span style={{ marginLeft: "0.5rem", fontWeight: 600, color: "#059669" }}>
                                • Joined
                              </span>
                            ) : null}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleToggleMembership(circle.id)}
                            disabled={false}
                            style={{
                              width: "100%",
                              borderRadius: "999px",
                              border: "none",
                              padding: "0.5rem",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              background: isMember ? "#e5e7eb" : "#22c55e",
                              color: isMember ? "#111827" : "#ffffff",
                              cursor: "pointer",
                              boxShadow: isMember ? "none" : "0 8px 16px rgba(34, 197, 94, 0.3)",
                            }}
                          >
                            {isMember ? "Leave Circle" : "Join Circle"}
                          </button>
                        </div>
                      </>
                    );
                  }}
                  onEmptyAction={() => (
                    <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      No matches. Try a different search, or create a Circle.
                    </p>
                  )}
                />
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
