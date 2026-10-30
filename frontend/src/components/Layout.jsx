import { NavLink, useNavigate } from 'react-router-dom'
import { clearToken } from '../api/client.js'
import Logo from './Logo.jsx'
import './Layout.css'

const NAV = [
    { to: '/matches', label: 'Matches' },
    { to: '/groups', label: 'Groups'},
    { to: '/schedule', label: 'Schedule'},
    { to: '/flashcards', label: 'Flashcards'},
    { to: '/profile', label: 'Profile'},
    
]

export default function Layout({ title, description }) 
{
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate('/login', { replace: true });
    };

    return (
        <div>
            <header className = "shell-nav">
                <Logo />
                <nav aria-label = "Main">
                    {NAV.map((item) => (
                        <NavLink key = {item.to} to ={item.to} className = {({ isActive}) => (isActive ? 'active' : '')}>
                            {item.label}
                        </NavLink>
                    ))}

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>

            <main className = "shell-main">
                <h1> {title} </h1>
                <p className = "shell-description"> {description} </p>
                <div className = "shell-todo"> TODO: implement this page</div>
            </main>
        </div>
    )
}