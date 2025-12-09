/* eslint-disable no-unused-vars */
const { useState, useEffect, useRef, useCallback, useContext, createContext } = React;

function normalizePath(path = '/') {
  const safePath = path || '/';
  let next = safePath.replace(/^#/, '');
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }
  if (next.length > 1 && !next.endsWith('/')) {
    next = `${next}/`;
  }
  return next;
}

function useHashNavigation() {
  const getPath = () => {
    const hash = window.location.hash || '#/';
    const rawPath = hash.replace(/^#/, '');
    return normalizePath(rawPath || '/');
  };

  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handleHashChange = () => setPath(getPath());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = path;
    }
  }, [path]);

  const navigate = useCallback((nextPath) => {
    const normalized = normalizePath(nextPath);
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    } else {
      setPath(normalized);
    }
  }, []);

  return { path, navigate };
}

const NavigationContext = createContext(null);

function NavigationProvider({ children }) {
  const navigation = useHashNavigation();
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
}

function useNavigation() {
  return useContext(NavigationContext);
}

function Link({ href = '/', onClick, children, ...rest }) {
  const { navigate } = useNavigation();

  const handleClick = (event) => {
    event.preventDefault();
    if (onClick) {
      onClick(event);
    }
    navigate(href);
  };

  return (
    <a
      href={`#${normalizePath(href)}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

function usePage() {
  const { path } = useNavigation();
  return { url: path };
}

function useSosToggle() {
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener('sos-open', handleSOSOpen);
    return () => window.removeEventListener('sos-open', handleSOSOpen);
  }, []);

  return [sosOpen, setSosOpen];
}

function SOSOverlay({ isOpen, onClose }) {
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

function BottomNav({ active }) {
  const { url } = usePage();
  const currentPath = normalizePath(active || url);

  const isActive = (path) => {
    const target = normalizePath(path);
    if (target === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(target);
  };

  return (
    <nav className="home-global-nav">
      <Link
        href="/"
        className={`home-bottom-nav__item ${isActive('/') ? 'is-active' : ''}`}
      >
        Home
      </Link>
      <Link
        href="/account/"
        className={`home-bottom-nav__item ${isActive('/account/') ? 'is-active' : ''}`}
      >
        Account
      </Link>
      <Link
        href="/rate/"
        className={`home-bottom-nav__item ${isActive('/rate/') ? 'is-active' : ''}`}
      >
        Rate
      </Link>
      <Link
        href="/verify/"
        className={`home-bottom-nav__item ${isActive('/verify/') ? 'is-active' : ''}`}
      >
        Verify
      </Link>
      <button
        className="home-bottom-nav__item home-bottom-nav__item--sos"
        onClick={() => {
          const event = new CustomEvent('sos-open');
          window.dispatchEvent(event);
        }}
      >
        SOS
      </button>
    </nav>
  );
}

function Home({ username, isAuthenticated, sobrietyDays = 45 }) {
  const { navigate } = useNavigation();
  const [activeModal, setActiveModal] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  const handleBackdropClick = () => {
    setActiveModal(null);
  };

  const handlePillClick = (route) => {
    navigate(route);
    setActiveModal(null);
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
                <Link href="/login/" className="home-phone__auth-link">
                  Login
                </Link>
                <Link href="/signup/" className="home-phone__auth-link home-phone__auth-link--primary">
                  Join
                </Link>
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

const demoLocations = [
  { id: 1, name: 'Hope Center', city: 'San Francisco', status: 'Open', distance: '2.3 mi', lat: 37.7749, lng: -122.4194 },
  { id: 2, name: 'Recovery House', city: 'Los Angeles', status: 'Open', distance: '5.1 mi', lat: 34.0522, lng: -118.2437 },
  { id: 3, name: 'Serenity Place', city: 'San Diego', status: 'Closed', distance: '8.7 mi', lat: 32.7157, lng: -117.1611 },
  { id: 4, name: 'New Beginnings', city: 'Oakland', status: 'Open', distance: '3.2 mi', lat: 37.8044, lng: -122.2712 },
  { id: 5, name: 'Safe Harbor', city: 'Sacramento', status: 'Open', distance: '12.4 mi', lat: 38.5816, lng: -121.4944 },
];

function Locations({
  isAuthenticated,
  viewMode = 'map',
  focusedLocation,
  onRequestFocusLocation,
  username,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstanceRef.current && typeof L !== 'undefined') {
      const map = L.map(mapRef.current, {
        center: [37.0902, -95.7129],
        zoom: 4,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      demoLocations.forEach((loc) => {
        const icon = L.divIcon({
          html: '<div class="location-marker">★</div>',
          className: '',
          iconSize: [30, 30],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${loc.name}</strong><br>${loc.city}<br>${loc.status}`);

        markersRef.current.push({ id: loc.id, marker });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  useEffect(() => {
    if (focusedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([focusedLocation.lat, focusedLocation.lng], 12);

      const marker = markersRef.current.find((m) => m.id === focusedLocation.id);
      if (marker) {
        marker.marker.openPopup();
      }
    }
  }, [focusedLocation]);

  const panelClass = viewMode === 'list'
    ? 'locations__panel locations__panel--card'
    : 'locations__panel locations__panel--ghost';

  return (
    <div className="locations">
      <div ref={mapRef} className="locations__map" />

      <div className="locations__content">
        <div className={panelClass}>
          <h2>{viewMode === 'list' ? 'Nearby Resources' : 'Explore the Map'}</h2>
          <p>
            {viewMode === 'list'
              ? 'Browse all locations below'
              : 'Use the map to explore locations near you'}
          </p>

          {viewMode === 'list' && (
            <>
              <ul className="locations__list">
                {demoLocations.map((loc) => (
                  <li key={loc.id} className="locations__list-item">
                    <div>
                      <p className="locations__list-name">{loc.name}</p>
                      <p className="locations__list-meta">
                        {loc.city} • {loc.status}
                      </p>
                    </div>
                    <div className="locations__list-actions">
                      <span className="locations__list-distance">{loc.distance}</span>
                      <button
                        className="locations__map-button"
                        onClick={() => onRequestFocusLocation && onRequestFocusLocation(loc)}
                      >
                        Map
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {!isAuthenticated && (
                <p className="locations__cta">
                  Sign in to save your favorite locations and get personalized recommendations.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Find({ isAuthenticated, username }) {
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

function LocationsWrapper({ isAuthenticated, username }) {
  const [sosOpen, setSosOpen] = useSosToggle();

  return (
    <>
      <Locations
        isAuthenticated={isAuthenticated}
        viewMode="list"
        username={username}
      />
      <BottomNav active="/find/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

function Circles({ username }) {
  const [sosOpen, setSosOpen] = useSosToggle();

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

function UserLog({ username }) {
  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Activity Tracker</p>
            <h1 className="home-phone__title">My Log</h1>
          </div>
        </header>

        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem 1rem' }}>
          {username && (
            <p style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '1rem' }}>
              Hello, <strong>{username}</strong>
            </p>
          )}
          <h2 style={{ fontSize: '1.5rem', color: '#111827', margin: '0 0 1rem' }}>
            Activity Log Coming Soon
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
            Track your daily activities, milestones, and progress in your recovery journey.
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
  );
}

function Login({ error, onLogin }) {
  const [formError, setFormError] = useState(error);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get('login') || '';
    const password = form.get('password') || '';

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    setFormError(null);
    if (onLogin) {
      onLogin({ email });
    }
  };

  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Recovery Network</p>
            <h1 className="home-phone__title">Login</h1>
          </div>
        </header>

        {formError && (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', marginTop: '1rem' }}>
            <p style={{ margin: 0, color: '#dc2626' }}>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="login" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              id="login"
              name="login"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.875rem',
              background: '#1e40af',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/signup/" style={{ color: '#1e40af', fontWeight: 600 }}>
            Create an account
          </Link>
          <Link href="/" style={{ color: '#6b7280' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Signup({ error, onSignup }) {
  const [formError, setFormError] = useState(error);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get('email') || '';
    const password = form.get('password1') || '';
    const confirm = form.get('password2') || '';

    if (!email || !password || !confirm) {
      setFormError('Please fill out all fields.');
      return;
    }

    if (password !== confirm) {
      setFormError('Passwords do not match.');
      return;
    }

    setFormError(null);
    if (onSignup) {
      onSignup({ email });
    }
  };

  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Recovery Network</p>
            <h1 className="home-phone__title">Sign Up</h1>
          </div>
        </header>

        {formError && (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', marginTop: '1rem' }}>
            <p style={{ margin: 0, color: '#dc2626' }}>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            />
          </div>

          <div>
            <label htmlFor="password1" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            />
          </div>

          <div>
            <label htmlFor="password2" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.875rem',
              background: '#1e40af',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#1e40af', fontWeight: 600 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function UserAccount({ username, email, dateJoined, onLogout }) {
  const [accountData, setAccountData] = useState({ username, email, dateJoined });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setPasswordStatus({ type: 'success', message: 'Password updated successfully (demo only)' });
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordStatus(null);
    }, 1500);
  };

  return (
    <>
      <div className="home-page">
        <div className="home-phone">
          <header className="home-phone__header">
            <div className="home-phone__brand">
              <p className="home-phone__eyebrow">My Profile</p>
              <h1 className="home-phone__title">Account</h1>
            </div>
          </header>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', boxShadow: '0 8px 16px rgba(15,23,42,0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Username</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                {accountData.username}
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', boxShadow: '0 8px 16px rgba(15,23,42,0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Email</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                {accountData.email}
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', boxShadow: '0 8px 16px rgba(15,23,42,0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Member Since</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                {accountData.dateJoined}
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                padding: '0.875rem',
                background: '#1e40af',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Reset Password
            </button>

            <Link
              href="/logout/"
              onClick={onLogout}
              style={{
                padding: '0.875rem',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'block',
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="home-modal__backdrop" onClick={() => setShowPasswordModal(false)}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem' }}>Reset Password</h2>

            {passwordStatus && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: passwordStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: passwordStatus.type === 'success' ? '#065f46' : '#dc2626',
                }}
              >
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#1e40af',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav active="/account/" />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}

function AdminHome({ username }) {
  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Administration</p>
            <h1 className="home-phone__title">Admin Portal</h1>
          </div>
        </header>

        <div style={{ marginTop: '2rem', padding: '2rem 1rem' }}>
          {username && (
            <p style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '1.5rem' }}>
              Welcome, <strong>{username}</strong>
            </p>
          )}
          <div style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(15,23,42,0.08)',
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#111827', margin: '0 0 1rem' }}>
              Admin Dashboard
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
              This is the administrative portal for Circley. Use this area to manage users,
              moderate content, and configure system settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Circley</p>
            <h1 className="home-phone__title">{title}</h1>
          </div>
        </header>

        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem 1rem' }}>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
            {description}
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
  );
}

function NotFound() {
  return (
    <PlaceholderPage
      title="Not Found"
      description="We couldn't find that page. Try heading back home to continue exploring Circley."
    />
  );
}

function App() {
  const { path, navigate } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    username: 'Alex Mercer',
    email: 'alex@circley.com',
    dateJoined: 'Jan 12, 2024',
  });

  const currentPath = normalizePath(path);

  const handleLogin = ({ email }) => {
    setIsAuthenticated(true);
    setUser({
      username: email ? email.split('@')[0] : 'Member',
      email: email || user.email,
      dateJoined: 'Today',
    });
    navigate('/');
  };

  const handleSignup = ({ email }) => {
    setIsAuthenticated(true);
    setUser({
      username: email ? email.split('@')[0] : 'Member',
      email: email || user.email,
      dateJoined: 'Today',
    });
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({
      username: 'Guest',
      email: 'guest@example.com',
      dateJoined: '—',
    });
    navigate('/');
  };

  let page = null;

  switch (currentPath) {
    case '/':
      page = (
        <Home
          username={user.username}
          isAuthenticated={isAuthenticated}
          sobrietyDays={45}
        />
      );
      break;
    case '/login/':
      page = <Login onLogin={handleLogin} />;
      break;
    case '/signup/':
      page = <Signup onSignup={handleSignup} />;
      break;
    case '/find/':
    case '/find/therapist/':
    case '/find/sober-living/':
    case '/find/meetings/':
      page = <Find isAuthenticated={isAuthenticated} username={user.username} />;
      break;
    case '/locations/':
      page = <LocationsWrapper isAuthenticated={isAuthenticated} username={user.username} />;
      break;
    case '/circles/':
      page = <Circles username={user.username} />;
      break;
    case '/log/':
      page = <UserLog username={user.username} />;
      break;
    case '/account/':
      page = (
        <UserAccount
          username={user.username}
          email={user.email}
          dateJoined={user.dateJoined}
          onLogout={handleLogout}
        />
      );
      break;
    case '/admin/':
      page = <AdminHome username={user.username} />;
      break;
    case '/verify/':
      page = (
        <PlaceholderPage
          title="Verify"
          description="User verification tools will live here. For now, return home to keep exploring."
        />
      );
      break;
    case '/rate/':
      page = (
        <PlaceholderPage
          title="Rate"
          description="Rating and feedback tools are coming soon."
        />
      );
      break;
    case '/logout/':
      handleLogout();
      page = (
        <PlaceholderPage
          title="Logged Out"
          description="You have been signed out of this demo experience."
        />
      );
      break;
    default:
      page = <NotFound />;
  }

  return page;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <NavigationProvider>
      <App />
    </NavigationProvider>
  );
}
