import React, {useState, useEffect} from 'react'
import './css/edit.css'
import Selector from '../common/selector'
import InputField from '../common/inputField'


export default function EditPage() {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token')
    const tokenType = params.get('token_type')
    const [username, setUsername] = useState("")
    const [globalName, setGlobalName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [characterData, setCharacterData] = useState([{}])
    const [characterOptions, setCharacterOptions] = useState([{}])
    const [error, setError] = useState("")

    const [origKey, setOrigKey] = useState("")
    const [key, setKey] = useState("")
    const [name, setName] = useState("")
    const [title, setTitle] = useState("")
    const [occupation, setOccupation] = useState("")
    const [age, setAge] = useState("")
    const [race, setRace] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [sexuality, setSexuality] = useState("")
    const [origin, setOrigin] = useState("")
    const [residence, setResidence] = useState("")
    const [resources, setResources] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [image, setImage] = useState(null)

    useEffect(() => {
		fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            setUsername(data.username)
            setGlobalName(data.global_name)
            setAvatar("https://cdn.discordapp.com/avatars/" + data.id +"/" + data.avatar + ".png")

            fetch("/api/characters/author/" + data.username)
                .then(res => res.json())
                .then(data => {
                    setCharacterData(data.characters)
                    const options = Object.entries(data.characters).map(([key, arr]) =>
                        ({value: key, label: arr.name})
                    )
                    setCharacterOptions(options)
                    updateCharacter(Object.keys(data.characters)[0], Object.values(data.characters)[0])
            })
        })
	}, [])

	const handleSubmit = async (event) => {
	    event.preventDefault()
	    const formData = buildFormData()
	    try {
            const response = await fetch('/api/characters/submit', {
                method: 'POST',
                body: formData
            })
            .then(async res => {
                if (!res.ok) {
                    const error = await res.json()
                    setError(error.error)
                } else {
                    setError("")
                }
            })
        } catch (error) {
            console.error('Error:', error);
        }
	}

	const updateCharacter = (charKey, character) => {
	    setKey(charKey)
	    setOrigKey(charKey)
        setName(character.name)
        setTitle(character.title ? character.title : "")
        setOccupation(character.occupation ? character.occupation : "")
        setAge(character.age ? character.age : "")
        setRace(character.race ? character.race : "")
        setPronouns(character.pronouns ? character.pronouns : "")
        setSexuality(character.sexuality ? character.sexuality : "")
        setOrigin(character.origin ? character.origin : "")
        setResidence(character.residence ? character.residence : "")
        setResources(character.resources ? character.resources : "")
        setDescription(character.description ? character.description: "")
        setImageUrl(character.image ? character.image: "")
        if (character.image) {
            fetch(character.image).then((response) => response.blob())
            .then((blob) => {
                console.log("character-image." + blob.type.split("/")[1])
                const file = new File([blob], "character-image." + blob.type.split("/")[1], { type: blob.type });
                setImage(file)
            })
        } else {
            setImage(null)
        }
	}

	const uploadImage = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const url = URL.createObjectURL(event.target.files[0])
            setImageUrl(url)
            setImage(event.target.files[0])
        }
	}

	const buildFormData = () => {
	    const formData = new FormData()
	    formData.append('key', key)
	    formData.append('name', name)
	    formData.append('title', title)
	    formData.append('occupation', occupation)
	    formData.append('age', age)
	    formData.append('race', race)
	    formData.append('pronouns', pronouns)
	    formData.append('sexuality', sexuality)
	    formData.append('origin', origin)
	    formData.append('residence', residence)
	    formData.append('resources', resources)
	    formData.append('description', description)
	    formData.append('tokenType', tokenType)
	    formData.append('accessToken', accessToken)
	    formData.append('originalKey', origKey)
	    if (image) { formData.append('image', image) }
	    return formData
	}

    return (
        <div>
            <div className="page-container">
                <a href="/blorbopedia" className="page-button">Browse Characters</a>
            </div>
            <div class='text-page-container'>
                <div className='user-container'>
                    <p className="user-name">
                        <img className="user-img" src={avatar}/>
                        {globalName}
                    </p>
                </div>
                <div className='character-select'>
                    <Selector
                        onChangeCall={e => updateCharacter(e['value'], characterData[e['value']])}
                        options={characterOptions}
                        defaultValue={Object.values(characterOptions[0]).value}
                        defaultLabel={characterOptions[0].label}
                    />
                </div>
                <form className="submit-form" onSubmit={handleSubmit}>
                    <div className='upper-fields'>
                        <div className="field-inputs">
                            <InputField field="Key" value={key} valueSetter={setKey}/>
                            <InputField field="Name" value={name} valueSetter={setName}/>
                            <InputField field="Title" value={title} valueSetter={setTitle}/>
                            <InputField field="Occupation" value={occupation} valueSetter={setOccupation}/>
                            <InputField field="Age" value={age} valueSetter={setAge}/>
                            <InputField field="Race" value={race} valueSetter={setRace}/>
                            <InputField field="Pronouns" value={pronouns} valueSetter={setPronouns}/>
                            <InputField field="Sexuality" value={sexuality} valueSetter={setSexuality}/>
                            <InputField field="Origin" value={origin} valueSetter={setOrigin}/>
                            <InputField field="Residence" value={residence} valueSetter={setResidence}/>
                            <InputField field="Resources" value={resources} valueSetter={setResources}/>
                        </div>
                        <div className="image-upload">
                            {imageUrl != "" && <img className="image" src={imageUrl}/>}
                            <input className="file-upload" type="file" accept="image/*" onChange={uploadImage}/>
                        </div>
                    </div>
                    <p className="submit-text-label">Description</p>
                    <textarea
                        className="submit-text-big"
                        type="text"
                        name="name"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <p>{error}</p>
                    <input className="save-button" type="submit" value="save" onSubmit={() => handleSubmit()}/>
                </form>
            </div>
        </div>
    )
}