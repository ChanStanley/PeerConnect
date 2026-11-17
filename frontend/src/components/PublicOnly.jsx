/*
 * Keeps a logged-in user off login and register
 * This prevents a user from doing onboarding and jumping back out
 * or a logged-in user from jumping out without logging out
 */

import { Navigate, Outlet } from "react-router-dom";
import useMe from "../hooks/useMe";
import { loadDraft, nextOnboardingStep } from "../utils/onboardingDraft";

export default function PublicOnly() {
    const { status, user } = useMe();

    if (status === "loading") { return null; }
    if (status === "ready") {
        if (user.onboarding_completed){ return <Navigate to="/matches" replace />;}
        return <Navigate to={nextOnboardingStep(loadDraft(user.id)).path} replace />;
    }
    return <Outlet />; // logged out (or backend unreachable)
}