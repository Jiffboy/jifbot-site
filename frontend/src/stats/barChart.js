import React from 'react';
import 'chart.js/auto';
import './css/statspage.css'
import { Bar } from "react-chartjs-2";

interface BarChartProps {
    data: {};
    title: string;
}

export default function BarChart<BarChartProps>(props) {
    var labels = props.data.map(function(e) { return e.month})
    var data = props.data.map(function(e) { return e.count})
    const barData = {
        labels: labels,
        datasets: [{
            label: "Calls",
            data: data,
            borderColor: "#ffa200",
            fill: true,
            backgroundColor: "#ffa200"
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
                    color: 'white'
                },
                grid: {
                    color: "#15161c"
                }
            }
        },
        responsive:true
    }

    return (
        <div className='bar-container'>
            <Bar data={barData} options={options}/>
        </div>
    )
}