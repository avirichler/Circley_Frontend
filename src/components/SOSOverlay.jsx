import '../pages/Home.css';

export default function SOSOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="home-sos-overlay" onClick={onClose}>
      <div className="home-sos-shell" onClick={(e) => e.stopPropagation()}>
        <div className="home-sos-card">
          <h2 className="home-sos-title">Emergency Support</h2>
          <p className="home-sos-subtitle">
            You are not alone. Choose an option below for immediate help.
          </p>
          <div className="home-sos-actions">
            <a
              href="tel:988"
              className="home-sos-btn home-sos-btn--red"
            >
              Call 988 Lifeline
            </a>
            <button className="home-sos-btn home-sos-btn--primary">
              Contact My Sponsor
            </button>
            <button className="home-sos-btn home-sos-btn--primary">
              Distress Flare
            </button>
            <button className="home-sos-btn home-sos-btn--primary">
              Grounding Exercises
            </button>
            <button className="home-sos-btn home-sos-btn--primary">
              Nearest Meeting
            </button>
            <button className="home-sos-btn home-sos-btn--outline-red">
              Chat
            </button>
          </div>
          <button className="home-sos-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
