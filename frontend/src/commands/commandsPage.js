import React, {useState, useEffect} from 'react'

export default function CommandsPage() {

	const[data, setData] = useState([{}])

	useEffect(() => {
		fetch("/commands").then(
			res => res.json()
		).then(
			data => {
				setData(data)
				console.log(data)
			}
		)
	}, [])

	return (
		<div>
            {(typeof data.commands === 'undefined') ? (
                <p>Loading...</p>
            ): (
                data.commands.map((command, i) => (
                    <p key={i}>{command}</p>
                ))
            )}
		</div>
	)
}