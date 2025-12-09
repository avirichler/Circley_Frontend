// src/pages.jsx
import React, { useState } from "react";
import { Link, useSosToggle } from "./navigation";
import BottomNav, { SOSOverlay } from "./BottomNav";

//////////////////////////
// AUTH PAGES
//////////////////////////

export function Login({ error, onLogin }) {
  const [formError, setFormError] = useState(error || null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get("login") || "";
    const password = form.get("password") || "";

    if (!email || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    setFormError(null);
    if (onLogin) onLogin({ email });
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
          <div
            style={{
              padding: "1rem",
              background: "#fee2e2",
              borderRadius: "12px",
              marginTop: "1rem",
            }}
          >
            <p style={{ margin: 0, color: "#dc2626" }}>{formError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              htmlFor="login"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="login"
              name="login"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "0.875rem",
              background: "#1e40af",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Link href="/signup/" style={{ color: "#1e40af", fontWeight: 600 }}>
            Create an account
          </Link>
          <Link href="/" style={{ color: "#6b7280" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

//////////////////////////
// ACCOUNT / ADMIN / MISC
//////////////////////////

export function UserAccount({ username, email, dateJoined, onLogout }) {
  const [accountData] = useState({ username, email, dateJoined });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [sosOpen, setSosOpen] = useSosToggle();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setPasswordStatus({
      type: "success",
      message: "Password updated successfully (demo only)",
    });
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
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

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Username
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "1rem",
                  color: "#111827",
                  fontWeight: 600,
                }}
              >
                {accountData.username}
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Email
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "1rem",
                  color: "#111827",
                  fontWeight: 600,
                }}
              >
                {accountData.email}
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Member Since
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "1rem",
                  color: "#111827",
                  fontWeight: 600,
                }}
              >
                {accountData.dateJoined}
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                padding: "0.875rem",
                background: "#1e40af",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Reset Password
            </button>

            <Link
              href="/logout/"
              onClick={onLogout}
              style={{
                padding: "0.875rem",
                background: "#ef4444",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                textAlign: "center",
                display: "block",
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div
          className="home-modal__backdrop"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>
              Reset Password
            </h2>

            {passwordStatus && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  background:
                    passwordStatus.type === "success" ? "#d1fae5" : "#fee2e2",
                  color:
                    passwordStatus.type === "success" ? "#065f46" : "#dc2626",
                }}
              >
                {passwordStatus.message}
              </div>
            )}

            <form
              onSubmit={handlePasswordChange}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#1e40af",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
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

export function AdminHome({ username }) {
  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Administration</p>
            <h1 className="home-phone__title">Admin Portal</h1>
          </div>
        </header>

        <div style={{ marginTop: "2rem", padding: "2rem 1rem" }}>
          {username && (
            <p
              style={{
                fontSize: "1.1rem",
                color: "#374151",
                marginBottom: "1.5rem",
              }}
            >
              Welcome, <strong>{username}</strong>
            </p>
          )}
          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                color: "#111827",
                margin: "0 0 1rem",
              }}
            >
              Admin Dashboard
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              This is the administrative portal for Circley. Use this area to
              manage users, moderate content, and configure system settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaceholderPage({ title, description }) {
  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Circley</p>
            <h1 className="home-phone__title">{title}</h1>
          </div>
        </header>

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            padding: "2rem 1rem",
          }}
        >
          <p
            style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.6 }}
          >
            {description}
          </p>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.875rem 1.5rem",
              background: "#1e40af",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <PlaceholderPage
      title="Not Found"
      description="We couldn't find that page. Try heading back home to continue exploring Circley."
    />
  );
}
