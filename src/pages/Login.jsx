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

export default function Login({ error }) {
  const csrftoken = getCookie('csrftoken');

  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Recovery Network</p>
            <h1 className="home-phone__title">Login</h1>
          </div>
        </header>

        {error && (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', marginTop: '1rem' }}>
            <p style={{ margin: 0, color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <form method="POST" action="/login/" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

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
