// src/Log.jsx
import React from "react";
import { useSosToggle, useNavigation, normalizePath } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function Log() {
  const [sosOpen, setSosOpen] = useSosToggle();
  const { path, navigate } = useNavigation();

  // Normalize the current path (works with your hash-based router)
  const currentPath = normalizePath(path || "/");

  // Decide which sub-screen to show based on the path
  let view = "daily";
  if (currentPath === "/log/milestone/") {
    view = "milestone";
  } else if (currentPath === "/log/goal/") {
    view = "goal";
  } else if (currentPath === "/log/trigger/") {
    view = "trigger";
  } else {
    view = "daily"; // "/log/" or anything else falls back to daily
  }

  const goToDaily = () => {
    navigate("/log/");
  };

  const renderDailyLog = () => (
    <section style={{ marginBottom: "1.2rem" }}>
      <h2 className="section-title">
        Log today
        <span className="section-title__pill">Daily check-in</span>
      </h2>
      <p className="section-subtitle">
        Capture how you’re feeling and any triggers, cravings, or wins from today.
      </p>

      <div className="form-field">
        <label className="form-label">Date</label>
        <input className="input" defaultValue="Today" />
      </div>

      <div className="form-field">
        <label className="form-label">How are you feeling?</label>
        <div className="mood-row">
          <span className="mood-pill mood-pill--strong">🙏 Grateful</span>
          <span className="mood-pill">🙂 Okay</span>
          <span className="mood-pill">😟 Stressed</span>
          <span className="mood-pill">😞 Low</span>
          <span className="mood-pill">🔥 Energized</span>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Cravings / triggers</label>
        <textarea
          className="textarea"
          placeholder="What came up for you today?"
        ></textarea>
      </div>

      <div className="form-field">
        <label className="form-label">Wins you want to remember</label>
        <textarea
          className="textarea"
          placeholder="Big or small, they all count."
        ></textarea>
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
      >
        Save entry
      </button>

      <div className="divider" />

      <h3
        style={{
          fontSize: "0.9rem",
          margin: "0.1rem 0 0.3rem",
        }}
      >
        This week at a glance
      </h3>
      <div className="log-week-grid">
        <div className="log-day log-day--good">
          Mon
          <br />
          <strong>😊</strong>
        </div>
        <div className="log-day log-day--ok">
          Tue
          <br />
          <strong>😐</strong>
        </div>
        <div className="log-day log-day--good">
          Wed
          <br />
          <strong>🙂</strong>
        </div>
        <div className="log-day log-day--bad">
          Thu
          <br />
          <strong>😟</strong>
        </div>
        <div className="log-day log-day--good">
          Fri
          <br />
          <strong>🔥</strong>
        </div>
        <div className="log-day log-day--ok">
          Sat
          <br />
          <strong>😌</strong>
        </div>
        <div className="log-day log-day--good">
          Sun
          <br />
          <strong>😊</strong>
        </div>
      </div>
    </section>
  );

  const renderMilestone = () => (
    <section style={{ marginBottom: "1.4rem" }}>
      <button
        type="button"
        className="btn-ghost"
        style={{ padding: "0.25rem 0.6rem", marginBottom: "0.4rem" }}
        onClick={goToDaily}
      >
        ← Back
      </button>

      <h2 className="section-title">
        Milestones
        <span className="section-title__pill">Progress</span>
      </h2>
      <p className="section-subtitle">
        Save key sobriety milestones so you can look back on how far you’ve come.
      </p>

      <div className="form-field">
        <label className="form-label">Milestone title</label>
        <input
          className="input"
          placeholder="e.g., 30 days sober, 1 year, first sober holiday"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Date</label>
        <input className="input" type="date" />
      </div>

      <div className="form-field">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="textarea"
          placeholder="What does this milestone mean to you?"
        ></textarea>
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
      >
        Save milestone
      </button>
    </section>
  );

  const renderGoal = () => (
    <section style={{ marginBottom: "1.4rem" }}>
      <button
        type="button"
        className="btn-ghost"
        style={{ padding: "0.25rem 0.6rem", marginBottom: "0.4rem" }}
        onClick={goToDaily}
      >
        ← Back
      </button>

      <h2 className="section-title">
        Goals
        <span className="section-title__pill">Intentions</span>
      </h2>
      <p className="section-subtitle">
        Set clear goals for your recovery so Circely can help you stay on track.
      </p>

      <div className="form-field">
        <label className="form-label">Goal</label>
        <input
          className="input"
          placeholder="e.g., Go to 3 meetings this week"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Target date (optional)</label>
        <input className="input" type="date" />
      </div>

      <div className="form-field">
        <label className="form-label">Why this matters (optional)</label>
        <textarea
          className="textarea"
          placeholder="How will this goal support your recovery?"
        ></textarea>
      </div>

      <div className="form-field">
        <label className="form-label">How often should we remind you?</label>
        <div className="pill-toggle-row">
          <button className="pill-toggle">Daily</button>
          <button className="pill-toggle">Weekly</button>
          <button className="pill-toggle">On target date only</button>
          <button className="pill-toggle">No reminders</button>
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
      >
        Save goal
      </button>
    </section>
  );

  const renderTrigger = () => (
    <section style={{ marginBottom: "0.4rem" }}>
      <button
        type="button"
        className="btn-ghost"
        style={{ padding: "0.25rem 0.6rem", marginBottom: "0.4rem" }}
        onClick={goToDaily}
      >
        ← Back
      </button>

      <h2 className="section-title">
        Log a Trigger
        <span className="section-title__pill">Awareness</span>
      </h2>
      <p className="section-subtitle">
        Identify the people, places, things, or dates that increase your risk.
        We’ll help remind you next time.
      </p>

      {/* Trigger type */}
      <div className="form-field">
        <label className="form-label">Trigger type</label>
        <div className="pill-toggle-row">
          <button className="pill-toggle">Person</button>
          <button className="pill-toggle">Place</button>
          <button className="pill-toggle">Thing</button>
          <button className="pill-toggle">Date / event</button>
        </div>
      </div>

      {/* Trigger name */}
      <div className="form-field">
        <label className="form-label">What is the trigger?</label>
        <input
          className="input"
          placeholder="e.g., Sports game, Cousin Mike, Liquor aisle"
        />
      </div>

      {/* Description */}
      <div className="form-field">
        <label className="form-label">Details (optional)</label>
        <textarea
          className="textarea"
          placeholder="Describe why this is a trigger or what usually happens."
        ></textarea>
      </div>

      {/* Location */}
      <div className="form-field">
        <label className="form-label">Location (optional)</label>
        <input
          className="input"
          placeholder="e.g., Prudential Center, home, bar on Main St"
        />
      </div>

      {/* Reminder settings */}
      <h3
        style={{
          fontSize: "0.9rem",
          margin: "0.4rem 0 0.25rem",
        }}
      >
        Reminder settings
      </h3>
      <p className="section-subtitle" style={{ marginTop: 0 }}>
        Choose how proactive you want Circely to be around this trigger.
      </p>

      <div className="checkbox-list">
        <label className="checkbox-item">
          <input type="checkbox" />
          <span>Notify me when I enter this location</span>
        </label>
        <label className="checkbox-item">
          <input type="checkbox" />
          <span>Send a reminder the next time this event occurs</span>
        </label>
        <label className="checkbox-item">
          <input type="checkbox" />
          <span>Send a morning awareness reminder</span>
        </label>
      </div>

      <div className="form-field">
        <label className="form-label">Event date (optional)</label>
        <input className="input" type="date" />
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.6rem" }}
      >
        Save trigger
      </button>
    </section>
  );

  let content;
  if (view === "milestone") content = renderMilestone();
  else if (view === "goal") content = renderGoal();
  else if (view === "trigger") content = renderTrigger();
  else content = renderDailyLog();

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          {/* Header – same as other screens */}
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">NextCircle.org</p>
              <h1 className="home-phone__title">Circely</h1>
            </div>
          </header>

          <main style={{ paddingTop: "0.5rem" }}>{content}</main>
        </div>
      </div>

      <BottomNav active="/log/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Log;
export { Log };
