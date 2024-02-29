import React from 'react'
import CommandParameter from './commandParameter'
import './css/command.css'

interface commandProps {
    name: String;
    category: String;
    description: String;
    parameters: {};
    currCategory: String;
}

export default function Command(commandProps) {
    if(commandProps.currCategory === commandProps.category || commandProps.currCategory === "all") {
        return <div className='command-card'>
            <h1 className='command-title'>> {commandProps.name}</h1>
            <h3 className='command-description'>{commandProps.description}</h3>
                {Object.entries(commandProps.parameters).map(([key, arr]) =>
                    <CommandParameter
                        key={key}
                        name={key}
                        description={arr.description}
                        required={arr.required}
                    />
                )
            }
        </div>
    }
}