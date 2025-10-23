import React from 'react'
import '../blorbopedia/css/blorbopedia.css'
import CharacterField from './characterField'

interface characterProps {
    characterKey: String;
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
    showOpenButton: Boolean;
}

export default function Character(characterProps) {
    const [copySuccess, setCopySuccess] = React.useState(false);

    const isValidUrl = (string) => {
        // Very scuffed and very cool
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    const getCharacterUrl = () => {
        return `${window.location.origin}/blorbopedia/${encodeURIComponent(characterProps.characterKey)}`;
    }

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(getCharacterUrl()).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }).catch(err => {
            console.error('Failed to copy link:', err);
        });
    }

    const openInNewTab = () => {
        window.open(getCharacterUrl(), '_blank');
    }

    const dash = (characterProps.title == undefined) ? "" : " - "
    const aliases = (characterProps.aliases == undefined) ? "" : dash + "AKA: " + characterProps.aliases.join(", ")

    return <div className='character-card'>
        <div className='link-buttons'>
            <button 
                className='copy-link-button' 
                onClick={copyLinkToClipboard}
                title={copySuccess ? "Link copied!" : "Copy link to character"}
            >
                {copySuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                )}
            </button>
            {characterProps.showOpenButton && (
                <button 
                    className='copy-link-button' 
                    onClick={openInNewTab}
                    title="Open character page in new tab"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </button>
            )}
        </div>
        <img className='character-image-desktop' src={characterProps.imageUrl}/>
        <div className='character-info'>
            <p className='title'>{characterProps.title}{aliases}</p>
            <h1 className='name'>{characterProps.name}</h1>
            <img className='character-image-mobile' src={characterProps.imageUrl}/>
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

            { characterProps.tags != undefined &&
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
