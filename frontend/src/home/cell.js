import React from 'react'

export default function Cell(props) {
    return <div className="feature-card">
        <div className="feature-content">
            <h3 className="feature-title">{props.title}</h3>
            <p className="feature-description">{props.description}</p>
            <ul className="feature-list">
                {props.list.map((item, index) => (
                    <li key={index} className="feature-item">
                        <span className="feature-bullet">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
}