import React from 'react'

    interface changelogProps {
        date: String;
        changes: [];
    }

export default function Changelog(changelogProps) {
    return (
        <div>
            <p>{changelogProps.date}</p>
            {changelogProps.changes.map((change, i) => (
                <li key={i}>{change}</li>
            ))}
        </div>
    )
}
