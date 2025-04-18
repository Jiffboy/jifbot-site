import React, {useState, useEffect} from 'react'
import '../common/css/textPageContainer.css'
import './css/statspage.css'
import LineChart from './lineChart.js'
import Doughnut from './doughnutChart.js'
import BarChart from './barChart.js'

export default function StatsPage() {
    const[monthCallCounts, setMonthCallCounts] = useState([{}]);
    const[yearCallCounts, setYearCallCounts] = useState([{}])
    const[monthCommandCounts, setMonthCommandCounts] = useState([{}]);
    const[allTimeCommandCounts, setAllTimeCommandCounts] = useState([{}])

    function FormatCommands(data, setter) {
        const newMap = {}
        var  curr = 0
        var otherTotal = 0
        for (var entry of data){
            if (curr >= 10) {
                otherTotal += entry.count
            } else {
                newMap[entry.command] = entry.count
            }
            curr += 1
        }
        if (otherTotal > 0) {
            newMap['other'] = otherTotal
        }
        setter(newMap)
    }

    useEffect(() => {
		fetch("/api/stats").then(
			res => res.json()
		).then(
			data => {
				setMonthCallCounts(data.thirtyDay.callsByDay)
				setYearCallCounts(data.year.callsByMonth)
				FormatCommands(data.thirtyDay.commandCounts, setMonthCommandCounts)
				FormatCommands(data.allTime.commandCounts, setAllTimeCommandCounts)
            }
		)
	}, [])

    return <div className="text-page-container">
        <div className="stats-page-container">
            <LineChart data = {monthCallCounts} title="Command calls in the last 30 days" />
            <BarChart data = {yearCallCounts} title="Monthly command calls" />
            <div className="donut-line">
                <Doughnut data = {monthCommandCounts} title="Commands last 30 days"/>
                <Doughnut data = {allTimeCommandCounts} title="Commands all time"/>
            </div>
        </div>
    </div>
}