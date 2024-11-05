import React from 'react';
import 'chart.js/auto';
import './css/statspage.css'
import { Line } from "react-chartjs-2";

interface LineChartProps {
    data: {};
    title: string;
}

export default function LineChart<LineChartProps>(props) {
    var labels = props.data.map(function(e) { return e.date})
    var data = props.data.map(function(e) { return e.count})
    const lineData = {
        labels: labels,
        datasets: [{
            label: "Calls",
            data: data,
            borderColor: "#ffa200",
            fill: true,
            pointBackgroundColor: "#ffa200"
        }]
    }
    const options = {
        plugins: {
            legend: {
                display: false
            },
            title: {
                text: props.title,
                display: true,
                color: 'white'
            }
        },
        scales: {
            y: {
                ticks: { color: 'white' },
                grid: {
                    color: "#15161c"
                }
            },
            x: {
                ticks: {
                    color: 'white',
                    minRotation: 45,
                    maxRotation: 45
                },
                grid: {
                    color: "#15161c"
                }
            }
        },
        responsive:true
    }

    return (
        <div className='line-container'>
            <Line data={lineData} options={options}/>
        </div>
    )
}