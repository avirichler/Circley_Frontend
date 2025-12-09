import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import SOSOverlay from '../components/SOSOverlay';
import './Home.css';

export default function UserAccount({ username, email, dateJoined }) {
  const [accountData, setAccountData] = useState({ username, email, dateJoined });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const handleSOSOpen = () => setSosOpen(true);
    window.addEventListener('sos-open', handleSOSOpen);
    return () => window.removeEventListener('sos-open', handleSOSOpen);
  }, []);

  useEffect(() => {
    axios.get('/api/account/')
      .then((response) => {
        if (response.data) {
          setAccountData(response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to refresh account data:', error);
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      await axios.post('/api/account/password/', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStatus(null);
      }, 2000);
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update password',
      });
    }
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
