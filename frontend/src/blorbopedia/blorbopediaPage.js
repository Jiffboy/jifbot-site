import React, {useState, useEffect} from 'react'
import '../common/css/textPageContainer.css'
import LoadingSpinner from '../common/loadingSpinner'
import Character from './character'

export default function BlorbopediaPage() {
    const [data, setData] = React.useState([{}])
    const [message, setMessage] = React.useState("Search for Characters!")
    const [render, setRender] = React.useState(false)
    const [button, setButton] = React.useState("submit")

    const handleSubmit = (event) => {
        event.preventDefault()
        var endpoint = ""
        if (button == "submit"){
            const formData = new FormData(event.target)
            const character = formData.get("character")
            endpoint = "/api/characters/search/" + character
        } else if (button == "random") {
            endpoint = "/api/characters/random"
        }

        fetch(endpoint).then(
            res => res.json()
        ).then(
            data => {
                setData(data)
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

    return (
        <div class='text-page-container'>
            <form className="submit-form" onSubmit={handleSubmit}>
                <input className="submit-text" type="text" name="character"/>
                <input className="submit-button" type="submit" value="submit" onClick={() => setButton("submit")}/>
                <input className="submit-button" type="submit" value="random" onClick={() => setButton("random")}/>
            </form>
            <p className="submit-form">{message}</p>
            { render && Object.entries(data.characters).map(([key, arr]) =>
                <div>
                    <Character
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
                        imageUrl={arr.image}/>
                </div>
            )}
		</div>
		)
}