/*
 * Loads the logged-in user once
 */

import { useEffect, useState } from "react";
import { apiFetch, getToken } from "../api/client";

// status: "loading" | "anon" (no token) | "ready" | "error"
export default function useMe() {
    const [state, setState] = useState(() => ({
        status: getToken() ? "loading" : "anon",
        user: null,
    }));

    useEffect(() => {
        if (!getToken()) return;
        apiFetch("/auth/me", { auth: true })
            .then((user) => setState({ status: "ready", user }))
            .catch(() => setState({ status: "error", user: null }));
    }, []);

    return state;
}