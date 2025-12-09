import { useState } from 'react';
import { Link } from '@inertiajs/react';
import Locations from './Locations';
import '../Home.css';

export default function Find({ isAuthenticated, username }) {
  const [viewMode, setViewMode] = useState('map');
  const [focusedLocation, setFocusedLocation] = useState(null);

  const handleFocusLocation = (location) => {
    setViewMode('map');
    setFocusedLocation(location);
  };

  return (
    <>
      <nav className="app-nav app-nav--fixed">
        <div className="app-nav__brand">
          <h1 className="app-nav__logo">Circley</h1>
          <div className="app-nav__tagline-row">
            <p className="app-nav__tagline">Find Resources</p>
            {isAuthenticated && username && (
              <p className="app-nav__welcome">Welcome, {username}</p>
            )}
          </div>
        </div>

        <div className="app-nav__menu">
          <div className="app-nav__view-toggle">
            <button
              className={`app-nav__view-button ${viewMode === 'map' ? 'is-active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Map
            </button>
            <button
              className={`app-nav__view-button ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>

          <div className="app-nav__auth">
            {isAuthenticated ? (
              <>
                <span className="app-nav__user">{username}</span>
                <Link
                  href="/logout/"
                  style={{
                    padding: '0.4rem 0.9rem',
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login/"
                  style={{
                    padding: '0.4rem 0.9rem',
                    background: 'transparent',
                    color: '#1e40af',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: '1px solid #1e40af',
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/signup/"
                  style={{
                    padding: '0.4rem 0.9rem',
                    background: '#1e40af',
                    color: '#ffffff',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Locations
        isAuthenticated={isAuthenticated}
        viewMode={viewMode}
        focusedLocation={focusedLocation}
        onRequestFocusLocation={handleFocusLocation}
        username={username}
      />

      {!isAuthenticated && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
            maxWidth: '400px',
            width: 'calc(100% - 2rem)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Join Circley Today</h3>
          <p style={{ margin: '0 0 1rem', color: '#6b7280', fontSize: '0.95rem' }}>
            Create an account to save locations and connect with your recovery community
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/login/"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                color: '#1e40af',
                borderRadius: '8px',
                fontWeight: 600,
                border: '1px solid #1e40af',
                textAlign: 'center',
              }}
            >
              Login
            </Link>
            <Link
              href="/signup/"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#1e40af',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
