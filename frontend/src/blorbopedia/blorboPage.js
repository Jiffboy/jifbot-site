import React from 'react'
import { useParams } from "react-router-dom";
import '../common/css/textPageContainer.css'
import Character from "./character";

export default function BlorboPage() {
    const { name } = useParams()
    const [data, setData] = React.useState(null)
    const [hasData, setHasData] = React.useState(false)

    if (!hasData) {
        fetch("/api/characters/" + name).then(
            res => res.json()
        ).then(
            data => {
                setData(Object.values(data.characters)[0])
                setHasData(true)
            }
        )
    }

    if (!data) {
        return <div>
            <div className='text-page-container'>
                <h1 style={{ textAlign: "center" }}>Character not found!</h1>
            </div>
        </div>
    }

    return <div>
        <div className='text-page-container'>
            <Character
                name={data.name}
                title={data.title}
                occupation={data.occupation}
                age={data.age}
                race={data.race}
                pronouns={data.pronouns}
                sexuality={data.sexuality}
                origin={data.origin}
                residence={data.residence}
                description={data.description}
                tags={data.tags}
                aliases={data.aliases}
                author={data.author}
                resources={data.resources}
                imageUrl={data.image}/>
        </div>
    </div>
}