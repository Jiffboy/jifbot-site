import React from 'react'
import '../blorbopedia/css/blorbopedia.css'

interface fieldProps {
    field: String;
    value: String;
}

export default function CharacterField(fieldProps) {
    return fieldProps.value != undefined &&
        <div class='character-field'>
            <p class='character-field-title'>{fieldProps.field}:</p>
            <p class='character-field-value'>{fieldProps.value}</p>
        </div>
}