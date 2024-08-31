import React from 'react';
import 'chart.js/auto';
import { Line } from "react-chartjs-2";

interface lineChartProps {
    data: {};
}

export default function LineChart(lineChartProps) {
    const lineData = {
        labels: Object.keys(lineChartProps.data),
        datasets: [{
            label: "Command Calls Last 30 Days",
            data: Object.values(lineChartProps.data),
            borderColor: "#ffa200",
            fill: true,
            pointBackgroundColor: "#ffa200"
        }]
    }
    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        },
        scales: {
            y: {
                ticks: { color: 'white' }
            },
            x: {
                ticks: {
                    color: 'white',
                    minRotation: 45,
                    maxRotation: 45
                }
            }
        }
    }

    return (
        <div>
            <Line data={lineData} options={options}/>
        </div>
    )
}