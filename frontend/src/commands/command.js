import React from 'react'
import CommandParameter from './commandParameter'

interface commandProps {
    name: String;
    category: String;
    description: String;
    parameters: {};
}

export default function Command(commandProps) {
    return <div>
        <h1>{commandProps.name}</h1>
        <ul>
            <li>{commandProps.category}</li>
            <li>{commandProps.description}</li>
        </ul>
            {Object.entries(commandProps.parameters).map(([key, arr]) =>
                <CommandParameter
                    name={key}
                    description={arr.description}
                    required={arr.required}
                />
            )
        }
    </div>
}