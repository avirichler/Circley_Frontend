// src/Find.jsx
import React, { useState } from "react";
import { useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

function Find() {
  const [sosOpen, setSosOpen] = useSosToggle();
  const [activeTab, setActiveTab] = useState("therapist");
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          {/* Header – same shell as other screens */}
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">NextCircle.org</p>
              <h1 className="home-phone__title">Circely</h1>
            </div>
          </header>

          <main style={{ paddingTop: "0.5rem" }}>
            <section>
              <h2 className="section-title">
                Find support
                <span className="section-title__pill">Browse &amp; filter</span>
              </h2>
              <p className="section-subtitle">
                Search therapists, treatment centers, meetings and sober living near you.
              </p>

              {/* Tabs row */}
              <div className="tabs">
                <button
                  type="button"
                  className={
                    "tab-pill" +
                    (activeTab === "therapist" ? " tab-pill--active" : "")
                  }
                  onClick={() => setActiveTab("therapist")}
                >
                  Therapists
                </button>
                <button
                  type="button"
                  className={
                    "tab-pill" +
                    (activeTab === "treatment" ? " tab-pill--active" : "")
                  }
                  onClick={() => setActiveTab("treatment")}
                >
                  Treatment
                </button>
                <button
                  type="button"
                  className={
                    "tab-pill" +
                    (activeTab === "meetings" ? " tab-pill--active" : "")
                  }
                  onClick={() => setActiveTab("meetings")}
                >
                  Meetings
                </button>
                <button
                  type="button"
                  className={
                    "tab-pill" +
                    (activeTab === "sober" ? " tab-pill--active" : "")
                  }
                  onClick={() => setActiveTab("sober")}
                >
                  Sober living
                </button>
              </div>

              {/* Search row */}
              <div className="search-row">
                <input
                  className="search-input"
                  placeholder="Search by name, city, or keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className="btn-primary">
                  Filter
                </button>
              </div>

              {/* Results list – static sample cards, same as prototype */}
              <ul className="results-list">
                <li className="results-item">
                  <div>
                    <p className="results-item__name">Hope Recovery Therapy</p>
                    <p className="results-item__meta">
                      Outpatient • 0.8 miles • Accepts Medicaid
                    </p>
                  </div>
                  <div className="results-item__actions">
                    <span className="badge-rating">4.7 ★</span>
                    <button type="button" className="btn-ghost">
                      View
                    </button>
                  </div>
                </li>

                <li className="results-item">
                  <div>
                    <p className="results-item__name">Northside Counseling</p>
                    <p className="results-item__meta">
                      Therapist • Telehealth available
                    </p>
                  </div>
                  <div className="results-item__actions">
                    <span className="badge-rating">4.9 ★</span>
                    <button type="button" className="btn-ghost">
                      View
                    </button>
                  </div>
                </li>

                <li className="results-item">
                  <div>
                    <p className="results-item__name">Downtown Recovery Center</p>
                    <p className="results-item__meta">
                      Residential • 15 beds • Sliding scale
                    </p>
                  </div>
                  <div className="results-item__actions">
                    <span className="badge-rating">4.5 ★</span>
                    <button type="button" className="btn-ghost">
                      View
                    </button>
                  </div>
                </li>
              </ul>
            </section>
          </main>
        </div>
      </div>

      <BottomNav active="/find/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

export default Find;
export { Find };
