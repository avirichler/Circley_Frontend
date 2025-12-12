// src/CheckIn.jsx
import React, { useMemo, useState } from "react";
import "./Home.css";
import "./App.css";

// Mock locations (replace with real API data later)
const MOCK_LOCATIONS = [
  {
    id: "1",
    name: "Harbor Recovery Center",
    type: "Treatment Center",
    address: "123 Ocean View Rd",
    distance: "0.3 mi",
  },
  {
    id: "2",
    name: "Sanctuary Sober Living",
    type: "Sober Living House",
    address: "45 Maple Street",
    distance: "0.7 mi",
  },
  {
    id: "3",
    name: "Downtown AA – Noon Meeting",
    type: "AA Meeting",
    address: "Community Hall, 2nd Floor",
    distance: "1.1 mi",
  },
  {
    id: "4",
    name: "Evening NA – Hope Group",
    type: "NA Meeting",
    address: "Faith Center, Room B",
    distance: "1.6 mi",
  },
];

export default function CheckIn() {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [notifyCircle, setNotifyCircle] = useState(true);
  const [note, setNote] = useState("");

  const filteredLocations = useMemo(() => {
    if (!query.trim()) return MOCK_LOCATIONS;
    const q = query.toLowerCase();
    return MOCK_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.type.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q)
    );
  }, [query]);

  // Basic submit handler stub (hook into backend later)
  const handleConfirmCheckIn = () => {
    // You can replace this with your actual mutation / API call
    // Example payload idea:
    // {
    //   locationId: selectedLocation.id,
    //   notifyCircle,
    //   note,
    //   timestamp: new Date().toISOString(),
    // }

    // For now, just log it so you can see the flow working:
    console.log("Check-in confirmed:", {
      location: selectedLocation,
      notifyCircle,
      note,
    });
    // You might show a toast, redirect, or clear state here later
  };

  return (
    <main className="home-page">
      <div className="home-phone">
        {/* Top "shell" header */}
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Circely</p>
            <h1 className="home-phone__title">Check-In</h1>
          </div>
          <div className="home-phone__auth">
            <p className="home-phone__welcome">
              Showing up for <span>your recovery</span>.
            </p>
          </div>
        </header>

        {/* Main check-in content */}
        <section>
          <h2 className="section-title">
            Choose a place
            <span className="section-title__pill">Today</span>
          </h2>
          <p className="section-subtitle">
            Check in to a treatment center, sober living house, or meeting.
            Your circle can be notified when you show up.
          </p>

          {/* Search row */}
          <div className="search-row">
            <input
              type="search"
              className="search-input"
              placeholder="Search by name, type, or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary"
              // Search button is mostly visual; filtering happens live
              onClick={() => {}}
            >
              Search
            </button>
          </div>

          {/* Quick action buttons */}
          <div className="button-row">
            <button
              type="button"
              className="btn-ghost"
              // hook this up to geolocation later
              onClick={() => {
                console.log("Use my location clicked");
              }}
            >
              Use my location
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                // for now just reset filters
                setQuery("");
              }}
            >
              Recent places
            </button>
          </div>

          {/* Results list */}
          <ul className="results-list" aria-label="Check-in locations">
            {filteredLocations.map((loc) => (
              <li key={loc.id} className="results-item">
                <div>
                  <h3 className="results-item__name">{loc.name}</h3>
                  <p className="results-item__meta">
                    {loc.type} · {loc.address}
                  </p>
                </div>
                <div className="results-item__actions">
                  <span className="badge-rating">{loc.distance}</span>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {selectedLocation?.id === loc.id
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Confirmation card */}
        {selectedLocation && (
          <>
            <div className="divider" />

            <section className="card" aria-label="Confirm check-in">
              <div className="card-header">
                <h3
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  }}
                >
                  Confirm check-in
                </h3>
              </div>

              <p className="section-subtitle">
                You’re about to check in to{" "}
                <strong>{selectedLocation.name}</strong>. This can help
                you track your journey and keep your circle in the loop.
              </p>

              <div className="form-field">
                <label className="form-label" htmlFor="checkin-note">
                  Optional note to your circle
                </label>
                <textarea
                  id="checkin-note"
                  className="textarea"
                  placeholder="Add a short note (e.g., 'First day of IOP', 'Back at the noon meeting')."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="form-field">
                <span className="form-label">Circle notification</span>
                <div className="checkbox-item">
                  <input
                    id="notify-circle"
                    type="checkbox"
                    checked={notifyCircle}
                    onChange={(e) => setNotifyCircle(e.target.checked)}
                  />
                  <label htmlFor="notify-circle">
                    Let my circle know that I checked in here
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmCheckIn}
                disabled={!selectedLocation}
              >
                Confirm Check-In
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
