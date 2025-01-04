import React from 'react'

interface cellProps {
    title: String;
    description: String;
    list: [];
    image: Component;
    left: Boolean;
}

export default function Cell<cellProps>(props) {
    return <div className="cell">
        {!props.left && <img className="cell-image" src={props.image}/>}
        <div className="cell-text">
            <h1 className="cell-header">{props.title}</h1>
            <p>{props.description}</p>
            <ul>
                {props.list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
        {props.left && <img className="cell-image" src={props.image}/>}
    </div>
}