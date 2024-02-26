import React, {useState, useEffect} from 'react'
import Command from './command'
import './css/command.css'

export default function CommandsPage() {

	const[commands, setCommands] = useState([{}])

	useEffect(() => {
		fetch("/commands").then(
			res => res.json()
		).then(
			data => {
				setCommands(data)
				console.log(data)
			}
		)
	}, [])

	return (
		<div className='commands-page'>
            {(typeof commands.commands === 'undefined') ? (
                <p>Loading...</p>
            ) : (
                Object.entries(commands.commands).map(([key, arr]) =>
                    <Command name={key}
                    category={arr.category}
                    description={arr.description}
                    parameters={
                        (typeof arr.parameters === 'undefined') ? (
                            {}
                        ) : (
                            arr.parameters
                        )}/>
                )
            )}
		</div>
	)
}