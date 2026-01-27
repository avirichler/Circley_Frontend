// src/Log.jsx
import React, { useMemo, useState } from "react";
import { useSosToggle, useNavigation, normalizePath } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function Log() {
  const [sosOpen, setSosOpen] = useSosToggle();
  const { path, navigate } = useNavigation();

  // Normalize the current path (works with your hash-based router)
  const currentPath = normalizePath(path || "/");

  // Helper: treat "/x" and "/x/" as the same
  const stripTrailingSlash = (p) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);
  const route = stripTrailingSlash(currentPath);

  // Decide which sub-screen to show based on the path
  let view = "daily";
  if (route === "/log/milestone") view = "milestone";
  else if (route === "/log/goal") view = "goal";
  else if (route === "/log/trigger") view = "trigger";
  else view = "daily";

  // ---------- localStorage helpers (v1 persistence) ----------
  const LS_KEY = "cirkely_log_entries_v1";

  const readEntries = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const writeEntries = (entries) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries));
    } catch {
      // no-op
    }
  };

  const appendEntry = (entry) => {
    const existing = readEntries();
    const next = [{ id: crypto?.randomUUID?.() || String(Date.now()), ...entry }, ...existing];
    writeEntries(next);
    return next;
  };

  // ---------- Daily Log state ----------
  const moodOptions = useMemo(
    () => [
      { key: "grateful", label: "🙏 Grateful" },
      { key: "okay", label: "🙂 Okay" },
      { key: "stressed", label: "😟 Stressed" },
      { key: "low", label: "😞 Low" },
      { key: "energized", label: "🔥 Energized" },
    ],
    []
  );

  const [dailyDate, setDailyDate] = useState("Today");
  const [dailyMood, setDailyMood] = useState("grateful");
  const [dailyCravings, setDailyCravings] = useState("");
  const [dailyWins, setDailyWins] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2200);
  };

  const saveDaily = () => {
    appendEntry({
      type: "daily",
      dateLabel: dailyDate,
      mood: dailyMood,
      cravings: dailyCravings,
      wins: dailyWins,
      createdAt: new Date().toISOString(),
    });
    showToast("Saved your daily check-in ✅");
    setDailyCravings("");
    setDailyWins("");
  };

  // ---------- Milestone state ----------
  const [msTitle, setMsTitle] = useState("");
  const [msDate, setMsDate] = useState("");
  const [msNotes, setMsNotes] = useState("");

  const saveMilestone = () => {
    if (!msTitle.trim()) return showToast("Add a milestone title first.");
    appendEntry({
      type: "milestone",
      title: msTitle.trim(),
      date: msDate || null,
      notes: msNotes.trim() || null,
      createdAt: new Date().toISOString(),
    });
    showToast("Milestone saved 🏁");
    setMsTitle("");
    setMsDate("");
    setMsNotes("");
    navigate("/log/");
  };

  // ---------- Goal state ----------
  const reminderOptions = useMemo(
    () => [
      { key: "daily", label: "Daily" },
      { key: "weekly", label: "Weekly" },
      { key: "target_only", label: "On target date only" },
      { key: "none", label: "No reminders" },
    ],
    []
  );

  const [goalText, setGoalText] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalWhy, setGoalWhy] = useState("");
  const [goalReminder, setGoalReminder] = useState("weekly");

  const saveGoal = () => {
    if (!goalText.trim()) return showToast("Add a goal first.");
    appendEntry({
      type: "goal",
      goal: goalText.trim(),
      targetDate: goalTargetDate || null,
      why: goalWhy.trim() || null,
      reminder: goalReminder,
      createdAt: new Date().toISOString(),
    });
    showToast("Goal saved 🎯");
    setGoalText("");
    setGoalTargetDate("");
    setGoalWhy("");
    setGoalReminder("weekly");
    navigate("/log/");
  };

  // ---------- Trigger state ----------
  const triggerTypes = useMemo(
    () => [
      { key: "person", label: "Person" },
      { key: "place", label: "Place" },
      { key: "thing", label: "Thing" },
      { key: "date_event", label: "Date / event" },
    ],
    []
  );

  const [triggerType, setTriggerType] = useState("person");
  const [triggerName, setTriggerName] = useState("");
  const [triggerDetails, setTriggerDetails] = useState("");
  const [triggerLocation, setTriggerLocation] = useState("");
  const [triggerEventDate, setTriggerEventDate] = useState("");

  const [notifyOnEnter, setNotifyOnEnter] = useState(false);
  const [notifyOnEvent, setNotifyOnEvent] = useState(false);
  const [notifyMorning, setNotifyMorning] = useState(false);

  const saveTrigger = () => {
    if (!triggerName.trim()) return showToast("Name the trigger first.");
    appendEntry({
      type: "trigger",
      triggerType,
      name: triggerName.trim(),
      details: triggerDetails.trim() || null,
      location: triggerLocation.trim() || null,
      eventDate: triggerEventDate || null,
      reminders: {
        notifyOnEnter,
        notifyOnEvent,
        notifyMorning,
      },
      createdAt: new Date().toISOString(),
    });
    showToast("Trigger saved 🧠");
    setTriggerName("");
    setTriggerDetails("");
    setTriggerLocation("");
    setTriggerEventDate("");
    setNotifyOnEnter(false);
    setNotifyOnEvent(false);
    setNotifyMorning(false);
    navigate("/log/");
  };

  // ---------- navigation helpers ----------
  const goToDaily = () => navigate("/log/");
  const goToMilestone = () => navigate("/log/milestone/");
  const goToGoal = () => navigate("/log/goal/");
  const goToTrigger = () => navigate("/log/trigger/");

  // ---------- renderers ----------
  const renderDailyLog = () => (
    <section style={{ marginBottom: "1.2rem" }}>
      <h2 className="section-title">
        Log today
        <span className="section-title__pill">Daily check-in</span>
      </h2>
      <p className="section-subtitle">
        Capture how you’re feeling and any triggers, cravings, or wins from today.
      </p>

      {/* Quick actions */}
      <div className="form-field">
        <label className="form-label">Quick actions</label>
        <div className="pill-toggle-row">
          <button type="button" className="pill-toggle" onClick={goToMilestone}>
            Milestone
          </button>
          <button type="button" className="pill-toggle" onClick={goToGoal}>
            Goal
          </button>
          <button type="button" className="pill-toggle" onClick={goToTrigger}>
            Trigger
          </button>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Date</label>
        <input
          className="input"
          value={dailyDate}
          onChange={(e) => setDailyDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">How are you feeling?</label>
        <div className="mood-row">
          {moodOptions.map((m) => {
            const active = dailyMood === m.key;
            return (
              <button
                key={m.key}
                type="button"
                className={`mood-pill ${active ? "mood-pill--strong" : ""}`}
                onClick={() => setDailyMood(m.key)}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Cravings / triggers</label>
        <textarea
          className="textarea"
          placeholder="What came up for you today?"
          value={dailyCravings}
          onChange={(e) => setDailyCravings(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Wins you want to remember</label>
        <textarea
          className="textarea"
          placeholder="Big or small, they all count."
          value={dailyWins}
          onChange={(e) => setDailyWins(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
        onClick={saveDaily}
      >
        Save entry
      </button>

      {toast ? (
        <div
          style={{
            marginTop: "0.55rem",
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          {toast}
        </div>
      ) : null}

      <div className="divider" />

      <h3 style={{ fontSize: "0.9rem", margin: "0.1rem 0 0.3rem" }}>
        This week at a glance
      </h3>
      <div className="log-week-grid">
        <div className="log-day log-day--good">
          Mon<br />
          <strong>😊</strong>
        </div>
        <div className="log-day log-day--ok">
          Tue<br />
          <strong>😐</strong>
        </div>
        <div className="log-day log-day--good">
          Wed<br />
          <strong>🙂</strong>
        </div>
        <div className="log-day log-day--bad">
          Thu<br />
          <strong>😟</strong>
        </div>
        <div className="log-day log-day--good">
          Fri<br />
          <strong>🔥</strong>
        </div>
        <div className="log-day log-day--ok">
          Sat<br />
          <strong>😌</strong>
        </div>
        <div className="log-day log-day--good">
          Sun<br />
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
          value={msTitle}
          onChange={(e) => setMsTitle(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Date</label>
        <input
          className="input"
          type="date"
          value={msDate}
          onChange={(e) => setMsDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="textarea"
          placeholder="What does this milestone mean to you?"
          value={msNotes}
          onChange={(e) => setMsNotes(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
        onClick={saveMilestone}
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
        Set clear goals for your recovery so Cirkely can help you stay on track.
      </p>

      <div className="form-field">
        <label className="form-label">Goal</label>
        <input
          className="input"
          placeholder="e.g., Go to 3 meetings this week"
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Target date (optional)</label>
        <input
          className="input"
          type="date"
          value={goalTargetDate}
          onChange={(e) => setGoalTargetDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Why this matters (optional)</label>
        <textarea
          className="textarea"
          placeholder="How will this goal support your recovery?"
          value={goalWhy}
          onChange={(e) => setGoalWhy(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">How often should we remind you?</label>
        <div className="pill-toggle-row">
          {reminderOptions.map((r) => {
            const active = goalReminder === r.key;
            return (
              <button
                key={r.key}
                type="button"
                className={`pill-toggle ${active ? "pill-toggle--active" : ""}`}
                onClick={() => setGoalReminder(r.key)}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.4rem" }}
        onClick={saveGoal}
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

      <div className="form-field">
        <label className="form-label">Trigger type</label>
        <div className="pill-toggle-row">
          {triggerTypes.map((t) => {
            const active = triggerType === t.key;
            return (
              <button
                key={t.key}
                type="button"
                className={`pill-toggle ${active ? "pill-toggle--active" : ""}`}
                onClick={() => setTriggerType(t.key)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">What is the trigger?</label>
        <input
          className="input"
          placeholder="e.g., Sports game, Cousin Mike, Liquor aisle"
          value={triggerName}
          onChange={(e) => setTriggerName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Details (optional)</label>
        <textarea
          className="textarea"
          placeholder="Describe why this is a trigger or what usually happens."
          value={triggerDetails}
          onChange={(e) => setTriggerDetails(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Location (optional)</label>
        <input
          className="input"
          placeholder="e.g., Prudential Center, home, bar on Main St"
          value={triggerLocation}
          onChange={(e) => setTriggerLocation(e.target.value)}
        />
      </div>

      <h3 style={{ fontSize: "0.9rem", margin: "0.4rem 0 0.25rem" }}>
        Reminder settings
      </h3>
      <p className="section-subtitle" style={{ marginTop: 0 }}>
        Choose how proactive you want Cirkely to be around this trigger.
      </p>

      <div className="checkbox-list">
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={notifyOnEnter}
            onChange={(e) => setNotifyOnEnter(e.target.checked)}
          />
          <span>Notify me when I enter this location</span>
        </label>
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={notifyOnEvent}
            onChange={(e) => setNotifyOnEvent(e.target.checked)}
          />
          <span>Send a reminder the next time this event occurs</span>
        </label>
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={notifyMorning}
            onChange={(e) => setNotifyMorning(e.target.checked)}
          />
          <span>Send a morning awareness reminder</span>
        </label>
      </div>

      <div className="form-field">
        <label className="form-label">Event date (optional)</label>
        <input
          className="input"
          type="date"
          value={triggerEventDate}
          onChange={(e) => setTriggerEventDate(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ width: "100%", marginTop: "0.6rem" }}
        onClick={saveTrigger}
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
              <h1 className="home-phone__title">Cirkely</h1>
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
