import React, {useState, useEffect} from 'react'
import Command from './command'
import LoadingSpinner from '../common/loadingSpinner'
import './css/command.css'

export default function CommandsPage() {

	const[commands, setCommands] = useState([{}]);
	const[commandComponents, setCommandComponents] = useState([]);
	const[currCategory, setCurrCategory] = useState('all');

	useEffect(() => {
		fetch("/api/commands").then(
			res => res.json()
		).then(
			data => {
				setCommands(data)
            }
		)
	}, [])

	return (
		<div className='commands-page'>
            {(typeof commands.commands === 'undefined') ? (
                <LoadingSpinner/>
            ) : (
                <div>
                    <select
                        value={currCategory}
                        onChange={e => setCurrCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        { commands.categories.map((category, i) =>
                            <option key={i} value={category}>{category}</option>
                        )}
                    </select>
                    {Object.entries(commands.commands).map(([key, arr]) =>
                    <Command name={key}
                        category={arr.category}
                        description={arr.description}
                        parameters={
                            (typeof arr.parameters === 'undefined') ? (
                                {}
                            ) : (
                                arr.parameters
                            )}
                        currCategory={currCategory}
                    />)}
                </div>
            )}
		</div>
	)
}