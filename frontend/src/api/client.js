const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "peerconnect_token";

export function saveToken(token, remember){
    clearToken();
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function getToken(){
    // localStorage survives closing the browser and sessionStorage is cleared when tab closes 
    // (depends on "Remember me" being ticked)
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(){
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, {method = "GET", body, auth = false} = {}){
    const headers = {};
    if (body) {headers["Content-Type"] = "application/json";}
    
    if (auth){
        const token = getToken();
        if (token) {headers.Authorization = `Bearer $(token)`};
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401 && auth){
        clearToken();
        window.location.href = "/login";
        throw new Error("Your session has expired. Please log in again");
    }

    if (!res.ok){
        let message = "Something went wrong";
        if (typeof data?.detail === "string"){message = data.detail;}
        else if (Array.isArray(data?.detail)){message = data.detail.map((d) => d.msg).join(", ");}
        throw new Error(message);
    }
    return data;
}