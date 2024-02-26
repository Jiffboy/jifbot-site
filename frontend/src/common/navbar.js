import { Link } from 'react-router-dom'
import './css/navbar.css'

export default function Navbar() {
    return <nav className="navbar">
        <Link to="/" className='navbar-link'>About</Link>
        <Link to="/commands" className='navbar-link'>Commands</Link>
        <Link to="/changelog" className='navbar-link'>Changelog</Link>
        <Link to="/setup" className='navbar-link'>Setup</Link>
    </nav>
}