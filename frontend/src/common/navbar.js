import { NavLink } from 'react-router-dom'
import './css/navbar.css'

export default function Navbar() {
    return <nav className="navbar">
        <NavLink to="/" className='navbar-link' isActive={true}>About</NavLink>
        <NavLink to="/commands" className='navbar-link'>Commands</NavLink>
        <NavLink to="/changelog" className='navbar-link'>Changelog</NavLink>
        <NavLink to="/setup" className='navbar-link'>Setup</NavLink>
    </nav>
}