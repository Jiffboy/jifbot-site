import React from 'react'
import './css/changelog.css'

interface changelogProps {
    date: String;
    changes: [];
}

export default function Changelog(changelogProps) {
    const getTypeClass = (type) => {
        switch(type.toLowerCase()) {
            case 'new': return 'changelog-type-new';
            case 'improved': return 'changelog-type-improved';
            case 'bug fix': return 'changelog-type-bugfix';
            case 'removed': return 'changelog-type-removed';
            default: return 'changelog-type-default';
        }
    };

    return (
        <div className='changelog-section'>
            <h2 className='changelog-header'>{changelogProps.date}</h2>
            <ul className='changelog-list'>
                {changelogProps.changes.map((change, i) => (
                    <li className={`changelog-entry ${getTypeClass(change.type)}`} key={i}>
                        {change.change}
                    </li>
                ))}
            </ul>
        </div>
    )
}
