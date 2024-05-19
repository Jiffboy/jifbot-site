import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import Command from './command'
import LoadingSpinner from '../common/loadingSpinner'
import './css/command.css'

export default function CommandsPage() {
	const[commands, setCommands] = useState([{}]);
	const[commandComponents, setCommandComponents] = useState([]);
	const[currCategory, setCurrCategory] = useState('all');
	const[categories, setCategories] = useState([{value: 'all', label: 'All Categories'}]);

	const styles = {
        singleValue:(provided:any) => ({
          ...provided,
          color:'white',
        }),
  }

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
		<div className='commands-page'>
            {(typeof commands.commands === 'undefined') ? (
                <LoadingSpinner/>
            ) : (
                <div>
                    <div className='category-select'>
                        <Select
                            onChange={e => setCurrCategory(e['value'])}
                            defaultValue={{value: 'all', label: 'All Categories'}}
                            options={categories}
                            theme={(theme) => ({
                                ...theme,
                                backgroundColor: '#15161c',
                                colors: {
                                    ...theme.colors,
                                    primary25: '#ffa200',
                                    primary: '#ffe199',
                                    neutral0: '#15161c',
                                },
                            })}
                            styles={styles}
                        />
                    </div>
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
            )}
		</div>
	)
}