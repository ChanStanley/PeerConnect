import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import "../components/flow-layout.css"; // shared sidebar layout
import "./Register.css";

// Base URL of the FastAPI backend
const API = "http://127.0.0.1:8000";

// Steps shown in the sidebar (Account is the current one on this page)
const STEPS = [
  { title: "Account", detail: "School or personal email" },
  { title: "Campus", detail: "Coming up next" },
  { title: "Courses", detail: "Coming up next" },
  { title: "Goals & style", detail: "Coming up next" },
  { title: "Availability", detail: "Coming up next" },
];
const CURRENT_STEP = 1;

// ===== Helpers =====
// Turns a backend error response into a readable message.
// FastAPI sends either a string ("detail": "...") or a list of validation errors.
function getMessage(data) 
{
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) return data.detail.map((d) => d.msg).join(" ");
  return "Something went wrong. Please try again.";
}

export default function Register() 
{
  const navigate = useNavigate();

  // ===== State =====
  // form: values typed into the inputs (keys match what /auth/register expects)
  // error: message shown under the form if something fails
  // loading: disables the button while a request is in progress
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Input handler =====
  // Updates the matching field in `form` using the input's name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Submit handler =====
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");
    setLoading(true);
    try {
      // Step 1: create the account
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(getMessage(data));
        return;
      }

      // Step 2: log in right away to get a token (register doesn't return one)
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, remember: true }),
      });
      if (!loginRes.ok) {
        navigate("/login"); // account exists, so let them log in manually
        return;
      }

      // Step 3: save the token and continue to onboarding
      const { access_token } = await loginRes.json();
      localStorage.setItem("token", access_token);
      navigate("/onboarding");
    } catch {
      // Network failure (backend off, wrong address, etc.)
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false); // always re-enable the button
    }
  };

  // ===== Page layout =====
  return (
    <div className="onb">
      {/* Left: progress sidebar */}
      <aside className="onb-side">
        <Logo />

        <div className="onb-side-body">
          <h2>Build your study profile</h2>
          <p className="onb-side-sub">A few details help us find classmates who fit your rhythm.</p>

          {/* Step list: steps before the current one show as done */}
          <ol className="steps">
            {STEPS.map((step, i) => {
              const n = i + 1;
              const state = n < CURRENT_STEP ? "done" : n === CURRENT_STEP ? "current" : "todo";
              return (
                <li key={step.title} className={`step ${state}`} aria-current={state === "current" ? "step" : undefined}>
                  <span className="marker" aria-hidden="true">
                    {state === "done" ? "✓" : ""}
                  </span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="privacy">
            Your email is only used to sign in and to match you with classmates.
          </p>
        </div>
      </aside>

      {/* Right: create account form */}
      <main className="onb-main reg-main">
        <p className="step-label">Step {CURRENT_STEP} of {STEPS.length}</p>
        <h1>Create your account</h1>
        <p className="onb-sub">It only takes a minute. You'll set up your study profile next.</p>

        <section className="panel reg-panel">
          <form className="reg-form" onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="reg-field">
              <label htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                className="input"
                autoComplete="name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="reg-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                autoComplete="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="reg-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error message (only shows when there is one) */}
            {error && <p className="reg-error" role="alert">{error}</p>}

            {/* Submit button */}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          {/* Link back to login */}
          <p className="reg-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}