import React from 'react';
import 'chart.js/auto';
import './css/statspage.css'
import { Doughnut } from "react-chartjs-2";

interface DoughnutProps {
    data: {};
    title: string;
}

export default function DoughnutChart<DoughnutProps>(props) {
    const palette = [
        "#ffa200",
        "#7d4829",
        "#f1eadf",
        "#ecaa94"

    ]
    const doughnutData = {
        labels: Object.keys(props.data),
        datasets: [{
            label: "Calls",
            data: Object.values(props.data),
            backgroundColor: palette,
            borderColor: "#15161c"
        }]
    }

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                },
                position: 'right'
            },
            title: {
                text: props.title,
                display: true,
                color: 'white'
            }
        },
        responsive: true
    }

    return (
        <div className='donut-container'>
            <Doughnut data={doughnutData} options={options}/>
        </div>
    )
}