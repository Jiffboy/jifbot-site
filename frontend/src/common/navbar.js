import { Link } from 'react-router-dom'

export default function Navbar() {
    return <nav className="nav">
        <Link to="/">Jif Bot</Link>
        <ul>
            <li>
                <Link to="/commands">Commands</Link>
            </li>
            <li>
                <Link to="/changelog">Changelog</Link>
            </li>
            <li>
                <Link to="/setup">Setup</Link>
            </li>
        </ul>
    </nav>
}