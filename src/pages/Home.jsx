import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import BottomNav from '../components/BottomNav';
import SOSOverlay from '../components/SOSOverlay';
import './Home.css';

export default function Home({ username, isAuthenticated, sobrietyDays = 45 }) {
  const [activeModal, setActiveModal] = useState(null);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener('sos-open', handleSOSOpen);
    return () => window.removeEventListener('sos-open', handleSOSOpen);
  }, []);

  const handleBackdropClick = () => {
    setActiveModal(null);
  };

  const handlePillClick = (route) => {
    router.visit(route);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modals = {
      find: {
        pills: [
          { label: 'All Resources', position: 'top', route: '/find/' },
          { label: 'Therapist', position: 'right', route: '/find/therapist/' },
          { label: 'Sober Living', position: 'bottom', route: '/find/sober-living/' },
          { label: 'Meetings', position: 'left', route: '/find/meetings/' },
        ],
        centerLabel: 'FIND',
      },
      circles: {
        pills: [
          { label: 'Placeholder 1', position: 'top' },
          { label: 'Placeholder 2', position: 'right' },
          { label: 'Placeholder 3', position: 'bottom' },
          { label: 'Placeholder 4', position: 'left' },
        ],
        centerLabel: 'CIRCLES',
      },
      log: {
        pills: [
          { label: 'Placeholder 1', position: 'top' },
          { label: 'Placeholder 2', position: 'right' },
          { label: 'Placeholder 3', position: 'bottom' },
          { label: 'Placeholder 4', position: 'left' },
        ],
        centerLabel: 'LOG',
      },
    };

    const modalData = modals[activeModal];

    return (
      <div className="home-modal__backdrop" onClick={handleBackdropClick}>
        <div className="home-modal" onClick={(e) => e.stopPropagation()}>
          <button className="home-modal__close" onClick={() => setActiveModal(null)}>
            Close
          </button>
          <div className="home-modal__circle-layout" data-mode={activeModal}>
            <div className="home-modal__center-circle">{modalData.centerLabel}</div>
            {modalData.pills.map((pill, idx) => (
              <button
                key={idx}
                className={`home-modal__pill home-modal__pill--${pill.position}`}
                onClick={() => pill.route && handlePillClick(pill.route)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">Recovery Network</p>
              <h1 className="home-phone__title">Circley</h1>
            </div>
            {isAuthenticated ? (
              <div className="home-phone__auth">
                <p className="home-phone__welcome">
                  Welcome back, <span>{username}</span>
                </p>
              </div>
            ) : (
              <div className="home-phone__auth">
                <a href="/login/" className="home-phone__auth-link">
                  Login
                </a>
                <a href="/signup/" className="home-phone__auth-link home-phone__auth-link--primary">
                  Join
                </a>
              </div>
            )}
          </header>

          <div className="home-phone__sobriety">
            <p className="home-phone__sobriety-label">Days Sober</p>
            <p className="home-phone__sobriety-value">{sobrietyDays}</p>
          </div>

          <div className="home-phone__actions">
            <button
              className="home-circle-button home-circle-button--circles"
              onClick={() => setActiveModal('circles')}
            >
              Circles
            </button>
            <button
              className="home-circle-button home-circle-button--find"
              onClick={() => setActiveModal('find')}
            >
              Find
            </button>
            <button
              className="home-circle-button home-circle-button--log"
              onClick={() => setActiveModal('log')}
            >
              Log
            </button>
          </div>

          <div className="home-phone__quote">
            <p>
              "One day at a time. Progress, not perfection."
            </p>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
      {renderModal()}
    </>
  );
}
