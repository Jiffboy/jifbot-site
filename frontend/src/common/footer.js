import { NavLink } from 'react-router-dom'
import './css/footer.css'

export default function Footer() {
    return <div className='footer-container'>
    <hr className='footer-line'/>
        <footer className='footer'>
            <p className="footer-text">A bot by Jiffboy</p>
            <nav className="footer-navbar">
                <NavLink to="/tos" className='footer-link' isActive={true}>Terms of Service</NavLink>
                <NavLink to="/privacy" className='footer-link'>Privacy Policy</NavLink>
            </nav>
        </footer>
    </div>
}