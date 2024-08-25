import React from 'react'
import './css/changelog.css'

interface changelogProps {
    date: String;
    changes: [];
}

export default function Changelog(changelogProps) {
    return (
        <div>
            <h1 className='changelog-header'>{changelogProps.date}</h1>
            {changelogProps.changes.map((change, i) => (
                <li key={i}>{change}</li>
            ))}
        </div>
    )
}
