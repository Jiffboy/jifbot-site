import React, {useState, useEffect} from 'react'
import Changelog from './changelog'

export default function ChangelogPage() {

	const[changelogs, setChangelogs] = useState([{}])

	useEffect(() => {
		fetch("/api/changelogs").then(
			res => res.json()
		).then(
			data => {
				setChangelogs(data)
			}
		)
	}, [])

    return (
        <div>
            {(typeof changelogs.changelogs === 'undefined') ? (
                <p>Loading...</p>
            ) : (
                Object.entries(changelogs.changelogs).map(([key, arr]) =>
                    <Changelog date={key}
                    changes={arr}/>
                )
            )}
		</div>
		)
}