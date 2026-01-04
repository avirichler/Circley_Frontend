// src/Circles.jsx
import React, { useMemo, useRef, useState } from "react";
import { useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";
import CardStack from "./CardStack";

// ✅ Place the uploaded icon here in your project:
// src/assets/CirkelyBellLogo.png
import NewMsgIcon from "./assets/CirkelyBellLogo.png";

export default function Circles() {
  const [sosOpen, setSosOpen] = useSosToggle();

  // Tabs: "my" | "explore" | "create"
  const [tab, setTab] = useState("my");

  // If not null, show chat view for that circle
  const [activeChatId, setActiveChatId] = useState(null);

  // Template circles (for visual)
  const [circles, setCircles] = useState([
    // --- Member circles ---
    {
      id: 101,
      name: "Sober Parents (NJ)",
      description: "Parenting + recovery support. Daily check-ins and wins.",
      visibility: "private",
      members: 27,
      isMember: true,
      unreadCount: 3,
      lastMessage: "New bedtime routine tip shared 👶",
      lastActive: "2h ago",
    },
    {
      id: 102,
      name: "Morning Accountability",
      description: "Quick daily pledge + one goal for today. Keep it simple.",
      visibility: "public",
      members: 114,
      isMember: true,
      unreadCount: 0,
      lastMessage: "Today’s prompt: one thing you’re grateful for.",
      lastActive: "Today",
    },
    {
      id: 103,
      name: "Anxiety + CBT Tools",
      description: "Weekly check-ins, CBT worksheets, and grounding practice.",
      visibility: "private",
      members: 18,
      isMember: true,
      unreadCount: 1,
      lastMessage: "Someone posted a new thought-challenge template.",
      lastActive: "15m ago",
    },

    // --- Explore circles ---
    {
      id: 201,
      name: "Early Recovery — Week 1–4",
      description: "Gentle support for the first month. No judgment. Small steps.",
      visibility: "public",
      members: 326,
      isMember: false,
      unreadCount: 0,
      lastMessage: "New weekly prompt posted.",
      lastActive: "3h ago",
    },
    {
      id: 202,
      name: "Meetings + Rides (Local)",
      description: "Coordinate carpools and reminders for local meetings.",
      visibility: "private",
      members: 63,
      isMember: false,
      unreadCount: 0,
      lastMessage: "Invite-only group.",
      lastActive: "1d ago",
    },
    {
      id: 203,
      name: "New Parents in NJ",
      description: "Share tips, vent, and support each other through toddler chaos.",
      visibility: "public",
      members: 42,
      isMember: false,
      unreadCount: 0,
      lastMessage: "Welcome thread updated.",
      lastActive: "Yesterday",
    },
  ]);

  // --- Chat data (per circle) ---
  const [chatsByCircleId, setChatsByCircleId] = useState(() => ({
    101: [
      { id: "m1", author: "Maya", text: "Morning check-in 🌿 What’s one small win today?", ts: "9:12 AM", mine: false },
      { id: "m2", author: "You", text: "I got up on time and made breakfast.", ts: "9:15 AM", mine: true },
      { id: "m3", author: "Jordan", text: "That’s huge. Routine helps so much.", ts: "9:18 AM", mine: false },
    ],
    102: [
      { id: "m1", author: "Sam", text: "Today’s goal: 10 minutes of movement.", ts: "7:02 AM", mine: false },
      { id: "m2", author: "You", text: "I’m doing a short walk after coffee.", ts: "7:10 AM", mine: true },
    ],
    103: [
      { id: "m1", author: "Ari", text: "Try the 5-4-3-2-1 grounding exercise if you’re spiraling.", ts: "6:44 PM", mine: false },
      { id: "m2", author: "You", text: "Saved. That helps a lot, thank you.", ts: "6:51 PM", mine: true },
    ],
  }));

  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  // --- Create form state ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Explore controls ---
  const [query, setQuery] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all"); // all | public | private

  const myCircles = useMemo(() => circles.filter((c) => c.isMember), [circles]);

  const exploreCircles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return circles.filter((c) => {
      const matchesVisibility = filterVisibility === "all" ? true : c.visibility === filterVisibility;
      const matchesQuery = !q ? true : `${c.name} ${c.description}`.toLowerCase().includes(q);
      return matchesVisibility && matchesQuery;
    });
  }, [circles, query, filterVisibility]);

  const activeCircle = useMemo(() => circles.find((c) => c.id === activeChatId) || null, [circles, activeChatId]);
  const activeMessages = useMemo(() => {
    if (!activeChatId) return [];
    return chatsByCircleId[activeChatId] || [];
  }, [chatsByCircleId, activeChatId]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const openChat = (circleId) => {
    setActiveChatId(circleId);

    // Mark unread as read when opening
    setCircles((prev) =>
      prev.map((c) => (c.id === circleId ? { ...c, unreadCount: 0 } : c))
    );

    // ensure the list scrolls after render
    window.setTimeout(scrollToBottom, 0);
  };

  const closeChat = () => {
    setActiveChatId(null);
    setDraft("");
    window.setTimeout(() => scrollToBottom(), 0);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeChatId) return;

    const ts = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    const newMsg = {
      id: `m-${Date.now()}`,
      author: "You",
      text,
      ts,
      mine: true,
    };

    setChatsByCircleId((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update preview in My Circles row
    setCircles((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, lastMessage: text, lastActive: "Just now" } : c
      )
    );

    setDraft("");
    window.setTimeout(scrollToBottom, 0);
  };

  const handleCreateCircle = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please give your Circle a name.");
      return;
    }

    const id = Date.now();

    const newCircle = {
      id,
      name: name.trim(),
      description: description.trim(),
      visibility,
      members: 1,
      isMember: true, // creator is a member
      unreadCount: 0,
      lastMessage: "Circle created.",
      lastActive: "Just now",
    };

    setCircles((prev) => [newCircle, ...prev]);
    setChatsByCircleId((prev) => ({
      ...prev,
      [id]: [
        {
          id: `m-${id}-welcome`,
          author: "System",
          text: "Welcome! Start the conversation here.",
          ts: "Just now",
          mine: false,
        },
      ],
    }));

    setName("");
    setDescription("");
    setVisibility("public");
    setSuccess("Circle created successfully!");
    setTab("my");
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const handleToggleMembership = (circleId) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;

        const joining = !c.isMember;
        const nextMembers = Math.max(0, (c.members || 0) + (joining ? 1 : -1));

        return {
          ...c,
          isMember: joining,
          members: nextMembers,
          unreadCount: joining ? 0 : c.unreadCount,
          lastActive: "Just now",
          lastMessage: joining ? "You joined this Circle." : "You left this Circle.",
        };
      })
    );
  };

  const NewMessageIndicator = ({ unreadCount }) => {
    const count = unreadCount || 0;
    const hasUnread = count > 0;

    return (
      <span
        aria-label={hasUnread ? `${count} new messages` : "No new messages"}
        title={hasUnread ? `${count} new messages` : "No new messages"}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", flex: "0 0 auto" }}
      >
        <img
          src={NewMsgIcon}
          alt="New messages"
          style={{
            width: 18,
            height: 18,
            opacity: hasUnread ? 1 : 0.35,
            filter: hasUnread ? "none" : "grayscale(100%)",
          }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 800,
            background: hasUnread ? "#111827" : "#e5e7eb",
            color: hasUnread ? "#ffffff" : "#6b7280",
            padding: "0.15rem 0.45rem",
            borderRadius: "999px",
            lineHeight: 1.1,
            minWidth: "2.05rem",
            textAlign: "center",
          }}
        >
          {hasUnread ? (count > 99 ? "99+" : count) : "0"}
        </span>
      </span>
    );
  };

  // --- CHAT VIEW (full-screen within this page) ---
  if (activeChatId && activeCircle) {
    return (
      <>
        <div className="home-page">
          <div className="home-phone" style={{ paddingBottom: "0.9rem" }}>
            <header className="home-phone__header" style={{ alignItems: "center" }}>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Back to My Circles"
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  borderRadius: "999px",
                  padding: "0.35rem 0.6rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ←
              </button>

              <div style={{ flex: 1, minWidth: 0, marginLeft: "0.6rem" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {activeCircle.visibility} • {activeCircle.members} members
                </p>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 900,
                    color: "#111827",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeCircle.name}
                </h1>
              </div>

              <button
                type="button"
                aria-label="Circle notifications"
                title="Circle notifications"
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  borderRadius: "999px",
                  padding: "0.35rem 0.55rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
                onClick={() => {
                  // placeholder: mute / notifications settings
                }}
              >
                <img src={NewMsgIcon} alt="" style={{ width: 18, height: 18 }} />
              </button>
            </header>

            <main style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
              <div
                ref={listRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "0.75rem 0.25rem 0.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}
              >
                {activeMessages.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "82%",
                        borderRadius: "16px",
                        padding: "0.55rem 0.7rem",
                        background: m.mine ? "#22c55e" : "#ffffff",
                        color: m.mine ? "#ffffff" : "#111827",
                        border: m.mine ? "none" : "1px solid #e5e7eb",
                        boxShadow: m.mine
                          ? "0 10px 18px rgba(34, 197, 94, 0.22)"
                          : "0 10px 18px rgba(15, 23, 42, 0.06)",
                      }}
                    >
                      {!m.mine && (
                        <p style={{ margin: "0 0 0.2rem", fontSize: "0.72rem", fontWeight: 800, color: "#111827" }}>
                          {m.author}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.35 }}>{m.text}</p>
                      <p
                        style={{
                          margin: "0.35rem 0 0",
                          fontSize: "0.68rem",
                          opacity: 0.75,
                          textAlign: m.mine ? "right" : "left",
                        }}
                      >
                        {m.ts}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem", paddingTop: "0.4rem" }}>
                <input
                  className="input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.55rem 0.9rem", borderRadius: "999px", whiteSpace: "nowrap" }}
                >
                  Send
                </button>
              </form>

              <p style={{ margin: "0.45rem 0 0", fontSize: "0.68rem", color: "#6b7280" }}>
                Be kind. Keep it supportive. 🫶
              </p>
            </main>
          </div>
        </div>

        <BottomNav active="/circles/" />
        <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
      </>
    );
  }

  // --- MAIN CIRCLES PAGE ---
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
              <p className="section-subtitle">Your support groups, and new groups to discover.</p>

              {/* Tabs */}
              <div className="card" style={{ padding: "0.75rem", marginBottom: "0.9rem" }}>
                <div className="pill-toggle-row" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={"pill-toggle" + (tab === "my" ? " pill-toggle--active" : "")}
                    onClick={() => setTab("my")}
                  >
                    My Circles
                  </button>
                  <button
                    type="button"
                    className={"pill-toggle" + (tab === "explore" ? " pill-toggle--active" : "")}
                    onClick={() => setTab("explore")}
                  >
                    Explore
                  </button>
                  <button
                    type="button"
                    className={"pill-toggle" + (tab === "create" ? " pill-toggle--active" : "")}
                    onClick={() => setTab("create")}
                  >
                    Create a Circle
                  </button>
                </div>
              </div>

              {/* MY CIRCLES */}
              {tab === "my" && (
                <div className="card">
                  <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>My Circles</h3>
                  <p className="section-subtitle" style={{ marginTop: 0 }}>
                    Circles you’re currently a member of.
                  </p>

                  {myCircles.length === 0 ? (
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
                      You haven’t joined any Circles yet. Head to <b>Explore</b> to find one.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {myCircles.map((circle) => (
                        <button
                          key={circle.id}
                          type="button"
                          onClick={() => openChat(circle.id)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                            borderRadius: "14px",
                            padding: "0.75rem 0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            boxShadow: "0 10px 20px rgba(15, 23, 42, 0.06)",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <h4
                                style={{
                                  fontSize: "0.95rem",
                                  fontWeight: 900,
                                  margin: 0,
                                  color: "#111827",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {circle.name}
                              </h4>
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  color: "#6b7280",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {circle.visibility}
                              </span>
                            </div>

                            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: "#4b5563", lineHeight: 1.4 }}>
                              {circle.lastMessage}
                            </p>

                            <p style={{ margin: "0.45rem 0 0", fontSize: "0.72rem", color: "#6b7280" }}>
                              <span style={{ fontWeight: 800 }}>{circle.members}</span> members • {circle.lastActive}
                            </p>
                          </div>

                          <NewMessageIndicator unreadCount={circle.unreadCount} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EXPLORE */}
              {tab === "explore" && (
                <div className="card">
                  <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>Explore Circles</h3>
                  <p className="section-subtitle" style={{ marginTop: 0 }}>
                    Swipe or drag to browse circles.
                  </p>

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
                        className={"pill-toggle" + (filterVisibility === "all" ? " pill-toggle--active" : "")}
                        onClick={() => setFilterVisibility("all")}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={"pill-toggle" + (filterVisibility === "public" ? " pill-toggle--active" : "")}
                        onClick={() => setFilterVisibility("public")}
                      >
                        Public
                      </button>
                      <button
                        type="button"
                        className={"pill-toggle" + (filterVisibility === "private" ? " pill-toggle--active" : "")}
                        onClick={() => setFilterVisibility("private")}
                      >
                        Private
                      </button>
                    </div>
                  </div>

                  <CardStack
                    items={exploreCircles}
                    renderCard={(circle) => {
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
                              {circle.visibility === "public" ? "Public" : "Private"}
                            </p>

                            <h4 style={{ fontSize: "1.1rem", fontWeight: "800", margin: "0 0 0.5rem", color: "#111827" }}>
                              {circle.name}
                            </h4>

                            <p style={{ fontSize: "0.8rem", color: "#4b5563", margin: "0 0 1rem", lineHeight: "1.5" }}>
                              {circle.description}
                            </p>
                          </div>

                          <div>
                            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0 0 0.6rem" }}>
                              <span style={{ fontWeight: "700" }}>{circle.members}</span> member{circle.members === 1 ? "" : "s"}
                              {isMember ? <span style={{ marginLeft: "0.5rem", fontWeight: 800, color: "#059669" }}>• Joined</span> : null}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleToggleMembership(circle.id)}
                              style={{
                                width: "100%",
                                borderRadius: "999px",
                                border: "none",
                                padding: "0.5rem",
                                fontSize: "0.8rem",
                                fontWeight: "700",
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
              )}

              {/* CREATE */}
              {tab === "create" && (
                <div className="card">
                  <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem" }}>Create a Circle</h3>
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
                          className={"pill-toggle" + (visibility === "public" ? " pill-toggle--active" : "")}
                          onClick={() => setVisibility("public")}
                        >
                          Public
                        </button>
                        <button
                          type="button"
                          className={"pill-toggle" + (visibility === "private" ? " pill-toggle--active" : "")}
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
                      <div style={{ padding: "0.5rem 0.7rem", background: "#fee2e2", borderRadius: "8px", marginBottom: "0.6rem" }}>
                        <p style={{ margin: 0, color: "#dc2626", fontSize: "0.8rem" }}>{error}</p>
                      </div>
                    )}

                    {success && (
                      <div style={{ padding: "0.5rem 0.7rem", background: "#dcfce7", borderRadius: "8px", marginBottom: "0.6rem" }}>
                        <p style={{ margin: 0, color: "#059669", fontSize: "0.8rem" }}>{success}</p>
                      </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.4rem" }}>
                      Create Circle
                    </button>
                  </form>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <BottomNav active="/circles/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
