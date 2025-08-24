import { NavLink } from 'react-router-dom'
import './css/footer.css'

export default function Footer() {
    return <div className='footer-container'>
    <hr className='footer-line'/>
        <footer className='footer'>
            <nav className="footer-navbar">
                <p className="footer-text">Follow Me</p>
                <NavLink to="https://bsky.app/profile/jifboy.bsky.social" className='footer-link'>Bluesky</NavLink>
                <NavLink to="https://x.com/JifBoy" className='footer-link'>Twitter</NavLink>
                <NavLink to="https://github.com/jiffboy" className='footer-link'>GitHub</NavLink>
            </nav>
            <nav className="footer-navbar">
                <p className="footer-text">Legal Stuff</p>
                <NavLink to="/tos" className='footer-link'>Terms of Service</NavLink>
                <NavLink to="/privacy" className='footer-link'>Privacy Policy</NavLink>
            </nav>

        </footer>
    </div>
}
