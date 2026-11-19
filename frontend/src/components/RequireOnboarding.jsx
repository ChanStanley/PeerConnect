import { Navigate, Outlet } from "react-router-dom";
import useMe from "../hooks/useMe";
import { loadDraft, nextOnboardingStep } from "../utils/onboardingDraft";

export default function RequireOnboarding() {
    const { status, user } = useMe(); // "loading" | "error" | "ready" | "anon"

    if (status === "loading"){ return null; }
    if (status === "error"){ return <p>Could not load your account. Is the backend running?</p>; }
    if (status === "anon"){ return <Navigate to="/login" replace />; }
        
    if (!user.onboarding_completed) { 
        // send user to the step they stopped at
        const next = nextOnboardingStep(loadDraft(user.id));
        const notice = `Finish setting up your profile to see your matches. Current step: ${next.label}`
        return <Navigate to={next.path} replace state={{ notice }} />;
    }

    return <Outlet context={{ user }} />;
}