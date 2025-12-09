import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import BottomNav from '../components/BottomNav';
import SOSOverlay from '../components/SOSOverlay';
import './Home.css';

export default function Circles({ username }) {
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener('sos-open', handleSOSOpen);
    return () => window.removeEventListener('sos-open', handleSOSOpen);
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">Recovery Network</p>
              <h1 className="home-phone__title">Circles</h1>
            </div>
          </header>

          <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem 1rem' }}>
            {username && (
              <p style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '1rem' }}>
                Hello, <strong>{username}</strong>
              </p>
            )}
            <h2 style={{ fontSize: '1.5rem', color: '#111827', margin: '0 0 1rem' }}>
              Circles Feature Coming Soon
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
              Connect with your recovery circles, share your journey, and support others in their path to wellness.
            </p>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.875rem 1.5rem',
                background: '#1e40af',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <BottomNav active="/circles/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
