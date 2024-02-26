import React from 'react'
import './css/command.css'

interface commandParameterProps {
    name: String;
    description: String;
    required: Boolean;
}

export default function CommandParameter(commandParameterProps) {
    const requiredTag = commandParameterProps.required ? ("[Required] "): ("")

    return <div className='command-parameter'>
        <p className='parameter-text'>
            <font color="#ffa200">{requiredTag}</font>
            <font color="#ffe199">{commandParameterProps.name}: </font>
            {commandParameterProps.description}
        </p>
    </div>
}