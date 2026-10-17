import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import './Login.css'

export default function Login(){

    const navigate = useNavigate()
    const [emailType, setEmailType] = useState('school') // or personal
    const [form, setForm] = useState({ email: '', password: '', remember: true })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        //
        //TODO: call the auth API
        navigate('/matches') //TODO: navigate to the user's dashboard
    }

    const handleGoogle = () => {
        //TODO: start Google OAuth 
    }

    return (
        <div className = "login">
            {/*Left: panel*/}
            <section className = "login-hero">
                <Logo />

                <div className = "login-hero-body">
                    <span className = "pill"> Your study circle, aligned</span>
                    <h1> Connect with others on campus</h1>
                    <p className = "lede">
                        Match with classmates who share your courses, goals, and availability
                    </p>

                    {/*TODO: swap gradient for real photo*/}
                    <figure className = "photo">
                        <figcaption>

                        </figcaption>
                    </figure>
                </div>
            </section>

            {/*Right: panel*/}
            <main className = "login-main">
                <div className = "login-card">
                    <h2> Welcome back </h2>
                    <p className = "sub"> Log in to see your matches and upcoming sessions </p>

                    <div className = "email-toggle" role = "tablist" aria-label = "Email type">
                        <button
                            type = "button"
                            role = "tab"
                            aria-selected = {emailType === 'school'}
                            className = {emailType === 'school' ? 'on' : ''}
                            onClick = {() => setEmailType('school')}
                        >
                            School email
                        </button>
                        <button
                            type = "button"
                            role = "tab"
                            aria-selected = {emailType === 'personal'}
                            className = {emailType === 'personal' ? 'on' : ''}
                            onClick = {() => setEmailType('personal')}
                        >
                            Personal email
                        </button>
                    </div>

                    <form onSubmit = {handleSubmit}>
                        <div className = "field">
                            <label hmtlfor = "email"> Email address </label>   
                            <input
                                id = "email"
                                name = "email"
                                type = "email"
                                className = "input"
                                autoComplete = "email"
                                placeHolder = {emailType === 'school' ? 'you@university.edu' : 'you@gmail.com'}
                                value = {form.email}
                                onChange = {handleChange}
                                required
                                />       
                        </div>

                    <div className = "row">
                        <label className = "check">
                            <input type = "checkbox" name = "remember" checked = {form.remember} onChange = {handleChange} />
                            Remember me
                        </label>
                        <Link to = "/login">Forgot password?</Link>
                        </div>

                        <button type = "submit" className = "btn btn-primary">Log in</button>    
                    </form>

                    <div className = "divider"><span> or </span></div>

                    <button type = "button" className = "btn" onClick = {handleGoogle}>
                        <span className = "g" aria-hidden = "true">G</span>
                        Continue with Google
                    </button>

                    <p className = "foot">
                        New here? <Link to = "/register">Create an account</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}