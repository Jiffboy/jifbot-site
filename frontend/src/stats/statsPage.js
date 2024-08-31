import React, {useState, useEffect} from 'react'
import '../common/css/textPageContainer.css'
import LineChart from './lineChart.js'

export default function StatsPage() {
    const[callCounts, setCallCounts] = useState([{}]);

    useEffect(() => {
		fetch("/api/stats").then(
			res => res.json()
		).then(
			data => {
				setCallCounts(data.thirtyDay.callsByDay)
            }
		)
	}, [])

    return <div className="text-page-container">
        <p>More Data Soon TM</p>
        <LineChart data = {callCounts} />
    </div>
}