import React from 'react';
import 'chart.js/auto';
import './css/statspage.css'
import { Line } from "react-chartjs-2";

interface LineChartProps {
    data: {};
    title: string;
}

export default function LineChart<LineChartProps>(props) {
    const lineData = {
        labels: Object.keys(props.data),
        datasets: [{
            label: "Calls",
            data: Object.values(props.data),
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