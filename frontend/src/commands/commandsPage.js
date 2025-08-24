import React, {useState, useEffect} from 'react'
import Selector from '../common/selector'
import Command from './command'
import LoadingSpinner from '../common/loadingSpinner'
import '../common/css/textPageContainer.css'
import './css/command.css'

export default function CommandsPage() {
	const[commands, setCommands] = useState([{}]);
	const[currCategory, setCurrCategory] = useState('all');
	const[categories, setCategories] = useState([{value: 'all', label: 'All Categories'}]);

	useEffect(() => {
		fetch("/api/commands").then(
			res => res.json()
		).then(
			data => {
				setCommands(data)
				var catList = data.categories.map((category) => ({value: category, label: category}))
				setCategories(categories.concat(catList))
            }
		)
	}, [])

	return (
		<div className='text-page-container'>
			<div className='commands-page'>
				{(typeof commands.commands === 'undefined') ? (
					<LoadingSpinner/>
				) : (
					<div>
						<div className='category-select'>
							<Selector
								onChangeCall={e => setCurrCategory(e['value'])}
								options={categories}
								defaultValue='all'
								defaultLabel='All Categories'
							/>
						</div>
						<div className='commands-grid'>
							{Object.entries(commands.commands).map(([key, arr]) =>
							<Command
								key={key}
								name={key}
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
					</div>
				)}
			</div>
		</div>
	)
}
