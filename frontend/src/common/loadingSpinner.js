import './css/loadingSpinner.css'
import spinner from '../resources/jifbot-head.png'

export default function LoadingSpinner() {
    return <div className='loading-container'>
        <img src={spinner} className='loading-spinner'/>
        <p className='loading-text'>Loading...</p>
    </div>
}