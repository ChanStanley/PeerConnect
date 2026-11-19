import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiFetch } from "../api/client";
import { nextOnboardingStep } from "../utils/onboardingDraft";

export default function RequireOnboarding() {
    const [status, setStatus] = useState("loading"); // loading, ready, incomplete, error

    useEffect(() => {
        apiFetch("/auth/me", { auth: true })
        .then((user) => setStatus(user.onboarding_completed ? "ready" : "incomplete"))
        .catch(() => setStatus("error"));
    }, []);

    if (status === "loading"){ return null; }
    if (status === "error"){ return <p>Could not load your account. Is the backend running?</p>; }
    if (status === "incomplete"){ 
        // send user to the step they stopped at
        const { path } = nextOnboardingStep();
        const notice = path === "/availability"
            ? "You're almost done. Add your availability to see your matches."
            : "Finish setting up your profile to see your matches.";
        return <Navigate to={path} replace state={{ notice }} />;
    }

    return <Outlet />;
}