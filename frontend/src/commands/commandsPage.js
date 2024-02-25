import React, {useState, useEffect} from 'react'
import Command from './command'

export default function CommandsPage() {

	const[commands, setCommands] = useState([{}])

	useEffect(() => {
		fetch("/commands").then(
			res => res.json()
		).then(
			data => {
				setCommands(data)
			}
		)
	}, [])

	return (
		<div>
            {(typeof commands.commands === 'undefined') ? (
                <p>Loading...</p>
            ) : (
                Object.entries(commands.commands).map(([key, arr]) =>
                    <Command name={key}
                    category={arr.category}
                    description={arr.description}/>
                )
            )}
		</div>
	)
}