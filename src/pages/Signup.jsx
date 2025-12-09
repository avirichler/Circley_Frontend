import { Link } from '@inertiajs/react';
import './Home.css';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function Signup({ error }) {
  const csrftoken = getCookie('csrftoken');

  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Recovery Network</p>
            <h1 className="home-phone__title">Sign Up</h1>
          </div>
        </header>

        {error && (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', marginTop: '1rem' }}>
            <p style={{ margin: 0, color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <form method="POST" action="/signup/" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

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
