import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import './Onboarding.css'

// ===== Constants =====
const TOTAL_STEPS = 5; // Account, Campus, Courses, Goals & style, Availability
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const GOAL_OPTIONS = [
  "Maintain a 3.5 GPA or higher",
  "Prepare for exams",
  "Study weekly",
  "Finish assignments early",
  "Learn new material",
];
const STYLE_OPTIONS = ["Quiet", "Focused", "Collaborative", "Discussion-heavy", "Relaxed"];

// Heading and subtitle for each step of the questionnaire
const COPY = 
{
  2: { title: "What is your campus?", sub: "We use this to match you with students on your campus." },
  3: { title: "Which courses are you taking?", sub: "Add the classes you'd like study partners for." },
  4: { title: "What are your goals and study style?", sub: "Pick as many as you like." },
};

export default function Onboarding() {
  const navigate = useNavigate();

  // ===== State =====
  // step: which question is showing (2 = Campus, 3 = Courses, 4 = Goals & style)
  const [step, setStep] = useState(2);
  const [campus, setCampus] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseInput, setCourseInput] = useState("");
  const [goals, setGoals] = useState([]);
  const [style, setStyle] = useState([]);

  // ===== Helpers =====
  // Adds a value to a list if it's missing, removes it if it's already there
  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  // Adds the typed course (like "CSCI 135") to the list, skipping blanks and duplicates
  const addCourse = () => {
    const value = courseInput.trim().toUpperCase();
    if (value && !courses.includes(value)) setCourses([...courses, value]);
    setCourseInput("");
  };

  // Pressing Enter in the course box adds the course instead of submitting
  const handleCourseKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCourse();
    }
  };

  // ===== Validation =====
  // The Next button stays disabled until the current step has an answer
  const canContinue =
    (step === 2 && campus.trim() !== "") ||
    (step === 3 && courses.length > 0) ||
    (step === 4 && goals.length > 0 && style.length > 0);

  // ===== Navigation =====
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    // Last question: save answers, then go to the availability page
    // TODO: save this to the API instead of (or as well as) localStorage
    localStorage.setItem(
      "profile",
      JSON.stringify({ campus, year, major, courses, goals, style })
    );
    navigate("/availability");
  };

  const handleBack = () => {
    if (step > 2) setStep(step - 1);
    else navigate("/register");
  };

  // ===== Sidebar steps =====
  // Details fill in with the user's answers as they go
  const steps = [
    { title: "Account", detail: "Created" },
    { title: "Campus", detail: campus || "Where you study" },
    { title: "Courses", detail: courses.length ? courses.join(" - ") : "Your classes" },
    {
      title: "Goals & style",
      detail: goals.length || style.length ? [...style].join(" - ") || "Your goals" : "How you like to study",
    },
    { title: "Availability", detail: "Coming up next" },
  ];

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
            {steps.map((s, i) => {
              const n = i + 1;
              const state = n < step ? "done" : n === step ? "current" : "todo";
              return (
                <li key={s.title} className={`step ${state}`} aria-current={state === "current" ? "step" : undefined}>
                  <span className="marker" aria-hidden="true">
                    {state === "done" ? "✓" : ""}
                  </span>
                  <span>
                    <strong>{s.title}</strong>
                    <small>{s.detail}</small>
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="privacy">
            Your availability is shown only as matching windows, never your full calendar.
          </p>
        </div>
      </aside>

      {/* Right: current question */}
      <main className="onb-main q-main">
        <p className="step-label">Step {step} of {TOTAL_STEPS}</p>
        <h1>{COPY[step].title}</h1>
        <p className="onb-sub">{COPY[step].sub}</p>

        <section className="panel q-panel">
          <div className="q-form">
            {/* ----- Step 2: Campus ----- */}
            {step === 2 && (
              <>
                <div className="q-field">
                  <label htmlFor="campus">Campus</label>
                  <input
                    id="campus"
                    className="input"
                    placeholder="e.g. Hunter College - CUNY"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                  />
                </div>

                <div className="q-field">
                  <label htmlFor="year">Year</label>
                  <select id="year" className="input" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select your year</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>

                <div className="q-field">
                  <label htmlFor="major">Major (optional)</label>
                  <input
                    id="major"
                    className="input"
                    placeholder="e.g. Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ----- Step 3: Courses ----- */}
            {step === 3 && (
              <>
                <div className="q-field">
                  <label htmlFor="course">Add a course</label>
                  <div className="q-add-row">
                    <input
                      id="course"
                      className="input"
                      placeholder="e.g. CSCI 135"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      onKeyDown={handleCourseKey}
                    />
                    <button type="button" className="btn" onClick={addCourse}>Add</button>
                  </div>
                </div>

                {/* Added courses: click one to remove it */}
                <div className="q-chips">
                  {courses.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="q-chip on"
                      aria-label={`Remove ${c}`}
                      onClick={() => setCourses(courses.filter((x) => x !== c))}
                    >
                      {c} ×
                    </button>
                  ))}
                  {courses.length === 0 && <p className="q-hint">No courses added yet.</p>}
                </div>
              </>
            )}

            {/* ----- Step 4: Goals & style ----- */}
            {step === 4 && (
              <>
                <div className="q-field">
                  <span>Semester goals</span>
                  <div className="q-chips">
                    {GOAL_OPTIONS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`q-chip ${goals.includes(g) ? "on" : ""}`}
                        aria-pressed={goals.includes(g)}
                        onClick={() => toggle(goals, setGoals, g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="q-field">
                  <span>Study style</span>
                  <div className="q-chips">
                    {STYLE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`q-chip ${style.includes(s) ? "on" : ""}`}
                        aria-pressed={style.includes(s)}
                        onClick={() => toggle(style, setStyle, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ----- Back / Next buttons ----- */}
          <div className="q-actions">
            <button type="button" className="btn" onClick={handleBack}>Back</button>
            <button type="button" className="btn btn-primary" onClick={handleNext} disabled={!canContinue}>
              {step === 4 ? "Continue to availability" : "Next"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}