import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RequireOnboarding from "./components/RequireOnboarding.jsx";
import PublicOnly from "./components/PublicOnly.jsx";
import OnboardingOnly from "./components/OnboardingOnly.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Availability from "./pages/Availability.jsx";
import Matches from "./pages/Matches.jsx";
import Groups from "./pages/Groups.jsx";
import Schedule from "./pages/Schedule.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Profile from "./pages/Profile.jsx";
import Status from "./pages/Status.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* idk if this should be public */}
      <Route path="/status" element={<Status />} />

      {/* Public (logged out only) */}
      <Route element={<PublicOnly/>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Require logged in user (registered counts too) */}
      <Route element={<ProtectedRoute/>}>
        {/* Logged in but onboarding NOT finished */}
        <Route element={<OnboardingOnly />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/availability" element={<Availability />} />
        </Route>
        
        {/* Logged in AND onboarding is finished */}
        <Route element={<RequireOnboarding/>}>
          <Route path="/matches" element={<Matches />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;