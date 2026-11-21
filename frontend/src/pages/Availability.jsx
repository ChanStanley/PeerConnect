// ===== Imports =====
import { useState } from 'react'
import { useNavigate, useLocation, Navigate, useOutletContext } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import '../components/flow-layout.css' // shared sidebar layout
import './Availability.css'
import { apiFetch } from '../api/client.js'
import { clearDraft, loadDraft, nextOnboardingStep } from '../utils/onboardingDraft.js'

// ===== Constants =====
const CURRENT_STEP = 5 // Availability is the last step
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM']

// Click a cell to cycle: unavailable -> preferred -> possible -> unavailable
const NEXT = { unavailable: 'preferred', preferred: 'possible', possible: 'unavailable' }

const LENGTHS = ['30–45 minutes', '45–60 minutes', '60–90 minutes', '90+ minutes']
const GROUP_SIZES = ['2–3 students', '2–4 students', '4–6 students']
const PLACES = ['Library', 'Online']

// ===== Helpers =====
// Shows answers saved on the sidebar (summary).
// If nothing is saved, it will be blank. Probably won't be shown anyways since there are new guards in place
function summarize(saved) {
  return {
    campus: saved.campus ?? '',
    courses: saved.courses?.join (' - ') ?? '',
    style: saved.style?.join(' - ') ?? '',
  }
}

// Turns the cell map (e.g. "Sun-9 AM": "preferred") into one row per day.
// 'preferred' and 'possible' are bitmasks: bit h is set when hour h (0-23, 24-hour clock) is picked.
function toBlocks(availability) {
  const byDay = {}
  for (const [key, level] of Object.entries(availability)) {
    if (level === 'unavailable') continue
    const [day, time] = key.split('-')
    const d = DAYS.indexOf(day)
    const hour = 9 + TIMES.indexOf(time) // grid starts at 9 AM
    byDay[d] ??= { day: d, preferred: 0, possible: 0 } // default
    byDay[d][level] |= 1 << hour // bitmask to store t/f flags
  }
  return Object.values(byDay)
}

export default function Availability() {
  const navigate = useNavigate()
  const { user } = useOutletContext()
  const notice = useLocation().state?.notice
  // ===== State =====
  // computed once on the first render, so clearing the draft after saving doesn't trigger a redirect
  const [saved] = useState(() => loadDraft(user.id))
  // availability: map of "Day-Time" -> 'preferred' | 'possible' (missing = unavailable)
  const [availability, setAvailability] = useState({})
  const [length, setLength] = useState('60–90 minutes')
  const [groupSize, setGroupSize] = useState('2–4 students')
  const [places, setPlaces] = useState(['Library', 'Online'])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const next = nextOnboardingStep(saved)
  const profile = summarize(saved)

  // How many time windows are selected (shown in the sidebar)
  const windowCount = Object.values(availability).filter((v) => v !== 'unavailable').length

  // ===== Sidebar steps =====
  // Steps 1-4 are done by the time the user gets here; Availability is current
  const steps = [
    { title: 'Account', detail: 'Created' },
    { title: 'Campus', detail: profile.campus },
    { title: 'Courses', detail: profile.courses },
    { title: 'Goals & style', detail: profile.style },
    { title: 'Availability', detail: `${windowCount} weekly windows` },
  ]

  // ===== Handlers =====
  // Cycles a calendar cell to its next state
  const cycleCell = (key) => {
    setAvailability((prev) => ({ ...prev, [key]: NEXT[prev[key] ?? 'unavailable'] }))
  }

  // Adds or removes a place from the "Where?" list
  const togglePlace = (place) => {
    setPlaces((prev) => (prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]))
  }

  // Finish: save availability, then go to matches
  const handleFinish = async () => {
    const blocks = toBlocks(availability)
    if (blocks.length === 0) {
      setError('Pick at least one time window.')
      return
    }

    setError('')
    setSaving(true)
    try {
      await apiFetch('/profile/onboarding', {
        method: 'PUT',
        auth: true,
        body: {
          ...saved, // campus, year, major, courses, goals, style
          courses: saved.courses.map((name) => ({ name, description: '' })),
          availability: blocks,
          session_length: length,
          group_size: groupSize,
          places,
        },
      })
      clearDraft(user.id) // no need for drafts after saving
      navigate('/matches')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }

    
  }

  // Earlier steps aren't done yet, send user back with message
  if (next.path !== '/availability') {
    return (
      <Navigate
        to="/onboarding"
        replace
        state={{ notice: `Add ${next.label} before choosing your availability.` }}
      />
    )
  }

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
            {steps.map((step, i) => {
              const n = i + 1
              const state = n < CURRENT_STEP ? 'done' : n === CURRENT_STEP ? 'current' : 'todo'
              return (
                <li key={step.title} className={`step ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                  <span className="marker" aria-hidden="true">
                    {state === 'done' ? '✓' : ''}
                  </span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </span>
                </li>
              )
            })}
          </ol>

          <p className="privacy">
            Your availability is shown only as matching windows, never your full calendar.
          </p>
        </div>
      </aside>

      {/* Right: calendar step */}
      <main className="onb-main">
        {notice && <p className="flow-notice" role="status">{notice}</p>}
        <p className="step-label">Step {CURRENT_STEP} of {steps.length}</p>
        <h1>When do you like to study?</h1>
        <p className="onb-sub">Choose typical windows. You can fine-tune these anytime.</p>

        <div className="avail-layout">
          {/* ----- Weekly availability calendar ----- */}
          <section className="panel">
            <div className="panel-head">
              <h2>Weekly availability</h2>
              <button type="button" className="link-btn" onClick={() => setAvailability({})}>
                Clear all
              </button>
            </div>

            {/* Legend for the three cell states */}
            <div className="legend">
              <span className="chip preferred">Preferred</span>
              <span className="chip possible">Possible</span>
              <span className="chip unavailable">Unavailable</span>
            </div>

            {/* Day headers + one button per day/time cell */}
            <div className="avail-grid">
              {DAYS.map((day) => (
                <div key={day} className="day-head">{day}</div>
              ))}
              {TIMES.map((time) =>
                DAYS.map((day) => {
                  const key = `${day}-${time}`
                  const state = availability[key] ?? 'unavailable'
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`cell ${state}`}
                      aria-label={`${day} ${time}: ${state}`}
                      onClick={() => cycleCell(key)}
                    >
                      {time}
                    </button>
                  )
                })
              )}
            </div>
          </section>

          {/* ----- Session preferences + buttons ----- */}
          <aside className="avail-side">
            <section className="panel prefs">
              <h2>Session preferences</h2>

              {/* Session length */}
              <label className="pref">
                <span>Ideal session length</span>
                <select className="input" value={length} onChange={(e) => setLength(e.target.value)}>
                  {LENGTHS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>

              {/* Group size */}
              <label className="pref">
                <span>Group size</span>
                <select className="input" value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
                  {GROUP_SIZES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </label>

              {/* Where to meet */}
              <div className="pref">
                <span>Where?</span>
                <div className="chips">
                  {PLACES.map((place) => (
                    <button
                      key={place}
                      type="button"
                      className={`chip-btn ${places.includes(place) ? 'on' : ''}`}
                      aria-pressed={places.includes(place)}
                      onClick={() => togglePlace(place)}
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Finish / Back buttons */}
            {error && <p className="avail-error" role="alert">{error}</p>}
            <button type="button" className="btn btn-primary" onClick={handleFinish} disabled={saving}>
              {saving ? 'Saving...' : 'Finish & see my matches'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/onboarding')}>
              Back
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}