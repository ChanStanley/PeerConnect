/*
 * Keeps a finished users from the setup pages
 */

import { Navigate, Outlet } from "react-router-dom";
import useMe from "../hooks/useMe";

export default function OnboardingOnly() {
    const { status, user } = useMe();

    if (status === "loading") { return null; }
    if (status === "error") { return <p>Could not load your account. Is the backend running?</p>; }
    if (status === "anon") { return <Navigate to="/login" replace />; }
    // change to dashboard when it exists
    if (user.onboarding_completed) { return <Navigate to="matches" replace />; }

    return <Outlet context={{ user }} />;
}