import React from 'react'

interface commandProps {
    name: String;
    category: String;
    description: String;
}

export default function Command(commandProps) {
    return <div>
        <p>{commandProps.name}</p>
        <ul>
            <li>{commandProps.category}</li>
            <li>{commandProps.description}</li>
        </ul>
    </div>
}