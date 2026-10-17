import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import './Register.css'

//TODO: the values here should come from the user itself
const PROFILE = {
    campus: 'Hunter College - CUNY',
    courses: 'CSCI 135 - CSCI 150 - MATH 150',
    goals: 'Maintain 3.5 GPA or higher - study weekly',
    style: 'Quiet - focused - collaborative',
    availability: 'Weekdays 8pm-10pm - Weekends 12pm-10pm',
}

const CURRENT_STEP = 1 //TODO: this should come from the user itself
const TOTAL_STEPS = 5

const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
const TIMES = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM']

// Click a cell to cycle: unavailable -> preferred -> possible -> unavailable
const NEXT = { unavailable: 'preferred', preferred: 'possible', possible: 'unavailable' }

const LENGTHS = ['30–45 minutes', '45–60 minutes', '60–90 minutes', '90+ minutes']
const GROUP_SIZES = ['2–3 students', '2–4 students', '4–6 students']
const PLACES = ['Library', 'Online']

// Sample selections so the page looks like the design on first load
const INITIAL_AVAILABILITY = {
  'Mon-12 PM': 'preferred',
  'Mon-8 PM': 'preferred',
  'Tue-9 AM': 'preferred',
  'Tue-6 PM': 'preferred',
  'Wed-3 PM': 'preferred',
  'Wed-6 PM': 'preferred',
  'Thu-12 PM': 'preferred',
  'Thu-8 PM': 'preferred',
  'Fri-9 AM': 'preferred',
  'Fri-6 PM': 'preferred',
}

export default function Register() {
  const navigate = useNavigate()
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY)
  const [length, setLength] = useState('60–90 minutes')
  const [groupSize, setGroupSize] = useState('2–4 students')
  const [places, setPlaces] = useState(['Library', 'Online'])

  const windowCount = Object.values(availability).filter((v) => v !== 'unavailable').length

  const steps = [
    { title: 'Account', detail: 'School or personal email' },
    { title: 'Campus', detail: PROFILE.campus },
    { title: 'Courses', detail: PROFILE.courses },
    { title: 'Goals & style', detail: 'Exam prep · collaborative' },
    { title: 'Availability', detail: `${windowCount} weekly windows` },
  ]

  const cycleCell = (key) => {
    setAvailability((prev) => ({ ...prev, [key]: NEXT[prev[key] ?? 'unavailable'] }))
  }

  const togglePlace = (place) => {
    setPlaces((prev) => (prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]))
  }

  const handleFinish = () => {
    // TODO: save { availability, length, groupSize, places } to the API
    navigate('/matches')
  }

  return (
    <div className="onb">
      {/* Left: progress sidebar */}
      <aside className="onb-side">
        <Logo />

        <div className="onb-side-body">
          <h2>Build your study profile</h2>
          <p className="onb-side-sub">A few details help us find classmates who fit your rhythm.</p>

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

      {/* Right: current step */}
      <main className="onb-main">
        <p className="step-label">Step {CURRENT_STEP} of {TOTAL_STEPS}</p>
        <h1>When do you like to study?</h1>
        <p className="onb-sub">Choose typical windows. You can fine-tune these anytime.</p>

        <div className="summary">
          <div><small>Campus</small><strong>{PROFILE.campus}</strong></div>
          <div><small>Courses</small><strong>{PROFILE.courses}</strong></div>
          <div><small>Semester goals</small><strong>{PROFILE.goals}</strong></div>
          <div><small>Study style</small><strong>{PROFILE.style}</strong></div>
        </div>

        <div className="onb-grid">
          {/* Weekly availability */}
          <section className="panel">
            <div className="panel-head">
              <h2>Weekly availability</h2>
              <button type="button" className="link-btn" onClick={() => setAvailability({})}>
                Clear all
              </button>
            </div>

            <div className="legend">
              <span className="chip preferred">Preferred</span>
              <span className="chip possible">Possible</span>
              <span className="chip unavailable">Unavailable</span>
            </div>

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

          {/* Session preferences */}
          <aside className="side-col">
            <section className="panel prefs">
              <h2>Session preferences</h2>

              <label className="pref">
                <span>Ideal session length</span>
                <select className="input" value={length} onChange={(e) => setLength(e.target.value)}>
                  {LENGTHS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>

              <label className="pref">
                <span>Group size</span>
                <select className="input" value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
                  {GROUP_SIZES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </label>

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

            <button type="button" className="btn btn-primary" onClick={handleFinish}>
              Finish &amp; see my matches
            </button>
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Back
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}