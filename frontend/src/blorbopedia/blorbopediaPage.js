import React, {useState, useEffect} from 'react'
import '../common/css/textPageContainer.css'
import LoadingSpinner from '../common/loadingSpinner'
import Character from './character'
import { NavLink } from 'react-router-dom'

export default function BlorbopediaPage() {
    const [data, setData] = React.useState([{}])
    const [message, setMessage] = React.useState("Search for Characters!")
    const [render, setRender] = React.useState(false)
    const [button, setButton] = React.useState("submit")
    const [option, setOption] = React.useState("character")

    const handleSubmit = (event) => {
        event.preventDefault()
        var endpoint = ""
        if (button == "submit"){
            const formData = new FormData(event.target)
            const text = formData.get("text")
            if (option == "character") {
                endpoint = "/api/characters/search/" + text
            } else if (option == "author") {
                endpoint = "/api/characters/author/" + text
            }

        } else if (button == "random") {
            endpoint = "/api/characters/random"
        }

        fetch(endpoint).then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
                const count = Object.keys(data.characters).length
                if (button == "random") {
                    setMessage("")
                    setRender(true)
                } else if (count == 1 ) {
                    setMessage("Found 1 result")
                    setRender(true)
                } else if (count >= 1) {
                    setMessage("Found " + count + " results")
                    setRender(true)
                } else {
                    setMessage("No results!")
                    setRender(false)
                }
            }
        )
    }

    const handleRadio = (event) => {
        setOption(event.target.value)
    }

    return (
        <div>
            <div className="page-container">
                <NavLink to="/blorbopedia/edit" className='page-button'>Edit Characters</NavLink>
            </div>
            <div class='text-page-container'>
                <form className="submit-form" onSubmit={handleSubmit}>
                    <input className="submit-text" type="text" name="text"/>
                    <input className="submit-button" type="submit" value="search" onClick={() => setButton("submit")}/>
                    <input className="submit-button" type="submit" value="random" onClick={() => setButton("random")}/>
                    <div className="submit-options-div">
                        <input
                            className="submit-option-radio"
                            type="radio"
                            id="character"
                            name="options"
                            value="character"
                            onChange={handleRadio}
                            checked={option === "character"}
                        />
                        <label className="submit-option-label" for="character">Character</label>
                        <input
                            className="submit-option-radio"
                            type="radio"
                            id="author"
                            name="options"
                            value="author"
                            onChange={handleRadio}
                            checked={option === "author"}
                        />
                        <label className="submit-option-label" for="author">Author</label>
                    </div>
                </form>
                <p className="submit-form">{message}</p>
                { render && Object.entries(data.characters).map(([charKey, arr]) =>
                    <div>
                        <Character
                            characterKey={charKey}
                            name={arr.name}
                            title={arr.title}
                            occupation={arr.occupation}
                            age={arr.age}
                            race={arr.race}
                            pronouns={arr.pronouns}
                            sexuality={arr.sexuality}
                            origin={arr.origin}
                            residence={arr.residence}
                            description={arr.description}
                            tags={arr.tags}
                            aliases={arr.aliases}
                            author={arr.author}
                            resources={arr.resources}
                            imageUrl={arr.image}
                            showOpenButton={true}/>
                    </div>
                )}
            </div>
		</div>
		)
}
