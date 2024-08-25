import React, {useState, useEffect} from 'react'
import Changelog from './changelog'
import LoadingSpinner from '../common/loadingSpinner'
import '../common/css/textPageContainer.css'

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
        <div class='text-page-container'>
            {(typeof changelogs.changelogs === 'undefined') ? (
                <LoadingSpinner/>
            ) : (
                Object.entries(changelogs.changelogs).map(([key, arr]) =>
                    <Changelog date={key}
                    changes={arr}/>
                )
            )}
		</div>
		)
}