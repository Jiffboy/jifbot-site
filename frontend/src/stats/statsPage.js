import React, {useState, useEffect} from 'react'
import '../common/css/textPageContainer.css'
import './css/statspage.css'
import LineChart from './lineChart.js'
import Doughnut from './doughnutChart.js'

export default function StatsPage() {
    const[monthCallCounts, setMonthCallCounts] = useState([{}]);
    const[monthCommandCounts, setMonthCommandCounts] = useState([{}]);
    const[allTimeCommandCounts, setAllTimeCommandCounts] = useState([{}])

    function FormatCommands(data, setter) {
        const newMap = {}
        var  curr = 0
        var otherTotal = 0
        for (let command in data){
            if (curr >= 10) {
                otherTotal += data[command]
            } else {
                newMap[command] = data[command]
            }
            curr += 1
        }
        newMap['other'] = otherTotal
        setter(newMap)
    }

    useEffect(() => {
		fetch("/api/stats").then(
			res => res.json()
		).then(
			data => {
				setMonthCallCounts(data.thirtyDay.callsByDay)
				FormatCommands(data.thirtyDay.commandCounts, setMonthCommandCounts)
				FormatCommands(data.allTime.commandCounts, setAllTimeCommandCounts)
            }
		)
	}, [])

    return <div className="text-page-container">
        <div className="stats-page-container">
            <LineChart data = {monthCallCounts} title="Command calls in the last 30 days" />
            <div className="donut-line">
                <Doughnut data = {monthCommandCounts} title="Commands last 30 days"/>
                <Doughnut data = {allTimeCommandCounts} title="Commands all time"/>
            </div>
        </div>
    </div>
}