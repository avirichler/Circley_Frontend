import '../pages/Home.css';

export default function AdminHome({ username }) {
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
