import { Routes, Route, Navigate } from "react-router-dom";
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/status" element={<Status />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;