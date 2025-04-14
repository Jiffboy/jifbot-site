import React from 'react'
import '../blorbopedia/css/blorbopedia.css'
import CharacterField from './characterField'

interface characterProps {
    name: String;
    title: String;
    occupation: String;
    age: String;
    race: String;
    pronouns: String;
    sexuality: String;
    origin: String;
    residence: String;
    description: String;
    tags: [];
    aliases: [];
    author: String;
    resources: String;
    imageUrl: String;
}

export default function Character(characterProps) {
    const isValidUrl = (string) => {
        // Very scuffed and very cool
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    const aliases = (characterProps.aliases == undefined) ? "" : " - AKA: " + characterProps.aliases.join(", ")

    return <div className='character-card'>
        <img src={characterProps.imageUrl}/>
        <div className='character-info'>
            <p className='title'>{characterProps.title}{aliases}</p>
            <h1 className='name'>{characterProps.name}</h1>

            <div className='character-fields'>
                <CharacterField field="Occupation" value={characterProps.occupation}/>
                <CharacterField field="Race" value={characterProps.race}/>
                <CharacterField field="Age" value={characterProps.age}/>
                <CharacterField field="Pronouns" value={characterProps.pronouns}/>
                <CharacterField field="Sexuality" value={characterProps.sexuality}/>
                <CharacterField field="Origin" value={characterProps.origin}/>
                <CharacterField field="Residence" value={characterProps.residence}/>
            </div>

            <p> {characterProps.description} </p>

            { characterProps.resources != undefined && isValidUrl(characterProps.resources) &&
                <a className="character-link" target="_blank" href={characterProps.resources}>More information</a>
            }

            {characterProps.tags != undefined &&
                Object.entries(characterProps.tags).map(([key, arr]) =>
                    <div className='tags'>
                        <p className='tag'>{arr}</p>
                    </div>
                )
            }

            <p>Made by {characterProps.author}</p>
        </div>

    </div>
}