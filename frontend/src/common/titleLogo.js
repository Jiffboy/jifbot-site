import './css/titlelogo.css'
import logo from '../resources/jifbot-logo.png'

export default function TitleLogo() {
    return <div className='title-logo'>
        <h1 className='title-text'>Jif</h1>
        <img src={logo} className='logo'/>
        <h1 className='title-text'>Bot</h1>
    </div>
}