import React from 'react'

interface commandParameterProps {
    name: String;
    description: String;
    required: Boolean;
}

export default function CommandParameter(commandParameterProps) {
    const requiredTag = commandParameterProps.required ? ("[Required] "): ("")

    return <div>
        <p>{requiredTag}{commandParameterProps.name}: {commandParameterProps.description}</p>
    </div>
}