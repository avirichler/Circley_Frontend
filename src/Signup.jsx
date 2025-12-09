// src/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link } from "./navigation";

const USER_TYPES = [
  {
    id: "seeker",
    label: "Looking for Help",
    description: "Guided support, meetings, and a gentle start to recovery.",
    accent: "#2563eb",
  },
  {
    id: "organization",
    label: "Business or Institution",
    description: "Bring Circley to your teams, members, or community programs.",
    accent: "#0ea5e9",
  },
  {
    id: "sponsor",
    label: "Sponsor",
    description: "Match with people you can mentor and keep them accountable.",
    accent: "#22c55e",
  },
  {
    id: "provider",
    label: "Healthcare Professional",
    description: "Share expertise, host groups, and collaborate on care plans.",
    accent: "#f97316",
  },
];

export default function Signup({ error, onSignup }) {
  const [formError, setFormError] = useState(error || null);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const activeUserLabel = useMemo(() => {
    const found = USER_TYPES.find((t) => t.id === userType);
    return found ? found.label : "Choose who you are";
  }, [userType]);

  const handleTypeContinue = () => {
    if (!userType) {
      setFormError("Pick the option that best describes you.");
      return;
    }
    setFormError(null);
    setStep(2);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password, confirm } = formState;

    if (!email || !password || !confirm) {
      setFormError("Please fill out all fields.");
      return;
    }

    if (!userType) {
      setFormError("Select your role to continue.");
      return;
    }

    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);
    if (onSignup) onSignup({ email, userType });
  };

  const handleFieldChange = (key) => (event) => {
    setFormState((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const renderStepOne = () => (
    <>
      <p
        style={{
          margin: "0.25rem 0 1rem",
          color: "#4b5563",
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}
      >
        Tell us a bit about how you'll use Circley so we can personalize the
        journey.
      </p>

      <div style={{ display: "grid", gap: "0.8rem" }}>
        {USER_TYPES.map((type) => {
          const isActive = type.id === userType;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setUserType(type.id)}
              style={{
                textAlign: "left",
                borderRadius: "14px",
                border: `2px solid ${
                  isActive ? type.accent : "rgba(209,213,219,0.9)"
                }`,
                background: isActive ? "rgba(37, 99, 235, 0.06)" : "#ffffff",
                padding: "0.9rem 1rem",
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(15,23,42,0.06)",
                transition: "transform 120ms ease, box-shadow 120ms ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#0f172a",
                    }}
                  >
                    {type.label}
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {type.description}
                  </p>
                </div>
                <span
                  aria-hidden
                  style={{
                    minWidth: "2.1rem",
                    height: "2.1rem",
                    borderRadius: "999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: type.accent,
                    color: "#ffffff",
                    fontWeight: 800,
                    boxShadow: `0 10px 20px ${type.accent}44`,
                  }}
                >
                  {isActive ? "✓" : "→"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleTypeContinue}
        style={{
          marginTop: "1.25rem",
          padding: "0.9rem",
          width: "100%",
          borderRadius: "10px",
          border: "none",
          background: "#1e40af",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </>
  );

  const renderStepTwo = () => (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          padding: "0.7rem 0.9rem",
          background: "#e0e7ff",
          borderRadius: "10px",
          border: "1px solid #c7d2fe",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#312e81" }}>
          Signing up as
        </p>
        <p
          style={{
            margin: "0.15rem 0 0",
            fontWeight: 800,
            color: "#1e1b4b",
            fontSize: "1.05rem",
          }}
        >
          {activeUserLabel}
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Work or personal email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleFieldChange("email")}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password1"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Create password
        </label>
        <input
          type="password"
          id="password1"
          name="password1"
          value={formState.password}
          onChange={handleFieldChange("password")}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password2"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Confirm password
        </label>
        <input
          type="password"
          id="password2"
          name="password2"
          value={formState.confirm}
          onChange={handleFieldChange("confirm")}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem" }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            flex: 1,
            padding: "0.85rem",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#0f172a",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: "0.85rem",
            borderRadius: "10px",
            border: "none",
            background: "#1e40af",
            color: "#ffffff",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 12px 22px rgba(30,64,175,0.35)",
          }}
        >
          Create account
        </button>
      </div>
    </form>
  );

  return (
    <div className="home-page">
      <div className="home-phone">
        <header className="home-phone__header">
          <div className="home-phone__brand">
            <p className="home-phone__eyebrow">Recovery Network</p>
            <h1 className="home-phone__title">
              {step === 1 ? "Who are you?" : "Sign Up"}
            </h1>
          </div>
          <div className="home-phone__auth">
            <Link
              href="/login/"
              className="home-phone__auth-link"
              style={{ textDecoration: "none" }}
            >
              Login
            </Link>
          </div>
        </header>

        {formError && (
          <div
            style={{
              padding: "1rem",
              background: "#fee2e2",
              borderRadius: "12px",
              marginTop: "0.75rem",
            }}
          >
            <p style={{ margin: 0, color: "#dc2626" }}>{formError}</p>
          </div>
        )}

        <div style={{ marginTop: "1.25rem" }}>
          {step === 1 ? renderStepOne() : renderStepTwo()}
        </div>

        <div
          style={{
            marginTop: "1.4rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Link href="/" style={{ color: "#1e40af", fontWeight: 700 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
