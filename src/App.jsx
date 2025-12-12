// src/App.jsx
import React, { useState } from "react";
import { useNavigation, normalizePath } from "./navigation";

// Page components
import Home from "./home";
import Find from "./Find";
import Circles from "./Circles";
import UserLog from "./Log";
// import Verify from "./Verify";   // ❌ no longer in bottom nav
import CheckInPage from "./CheckInPage"; // ✅ NEW

import {
  Login,
  UserAccount,
  AdminHome,
  PlaceholderPage,
  NotFound,
} from "./pages";
import Signup from "./Signup";

export default function App() {
  const { path, navigate } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    username: "Alex Mercer",
    email: "alex@circley.com",
    dateJoined: "Jan 12, 2024",
  });

  const [rawPathname] = (path || "/").split("?");
  const currentPath = normalizePath(rawPathname || "/");

  const handleLogin = ({ email }) => {
    setIsAuthenticated(true);
    setUser({
      username: email ? email.split("@")[0] : "Member",
      email: email || user.email,
      dateJoined: "Today",
    });
    navigate("/");
  };

  const handleSignup = ({ email }) => {
    setIsAuthenticated(true);
    setUser({
      username: email ? email.split("@")[0] : "Member",
      email: email || user.email,
      dateJoined: "Today",
    });
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({
      username: "Guest",
      email: "guest@example.com",
      dateJoined: "—",
    });
    navigate("/");
  };

  let page = null;

  switch (currentPath) {
    case "/":
      page = (
        <Home
          username={user.username}
          isAuthenticated={isAuthenticated}
          sobrietyDays={45}
        />
      );
      break;

    case "/login/":
      page = <Login onLogin={handleLogin} />;
      break;

    case "/signup/":
      page = <Signup onSignup={handleSignup} />;
      break;

    case "/find/":
    case "/find/therapist/":
    case "/find/sober-living/":
    case "/find/meetings/":
      page = (
        <Find
          isAuthenticated={isAuthenticated}
          username={user.username}
        />
      );
      break;

    case "/circles/":
    case "/circles/join/":
    case "/circles/create/":
    case "/circles/invites/":
      page = <Circles username={user.username} />;
      break;

    case "/log/":
    case "/log/milestone/":
    case "/log/goal/":
    case "/log/trigger/":
      page = <UserLog username={user.username} />;
      break;

    // ⭐️ NEW CHECK-IN ROUTE
    case "/checkin/":
      page = <CheckInPage username={user.username} />;
      break;

    // ❌ VERIFY is no longer part of bottom nav, but you can keep/remove
    // case "/verify/":
    //   page = <Verify />;
    //   break;

    case "/account/":
      page = (
        <UserAccount
          username={user.username}
          email={user.email}
          dateJoined={user.dateJoined}
          onLogout={handleLogout}
        />
      );
      break;

    case "/admin/":
      page = <AdminHome username={user.username} />;
      break;

    case "/rate/":
      page = (
        <PlaceholderPage
          title="Rate"
          description="Rating and feedback tools are coming soon."
        />
      );
      break;

    case "/logout/":
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

  return <>{page}</>;
}
