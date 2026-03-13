import React, {useState, useEffect, useRef} from 'react'
import { NavLink } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import './css/edit.css'
import Selector from '../common/selector'
import InputField from '../common/inputField'
import BigInputField from '../common/bigInputField'


export default function EditPage() {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token') ?? sessionStorage.getItem('access_token')
    const tokenType = params.get('token_type') ?? sessionStorage.getItem('token_type')

    if (accessToken != null && tokenType != null) {
        sessionStorage.setItem('access_token', accessToken)
        sessionStorage.setItem('token_type', tokenType)
    }


    // So it works for dev and prod
    const returnUrl = window.location.protocol + "//" + window.location.host + "/blorbopedia/edit"
    const endpoint = "https://discord.com/oauth2/authorize?client_id=315569278101225483&response_type=token&redirect_uri=" + returnUrl + "&scope=identify"

    const [username, setUsername] = useState("")
    const [globalName, setGlobalName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [characterData, setCharacterData] = useState([{}])
    const [characterOptions, setCharacterOptions] = useState([{value: "", label: ""}])
    const [currCharacter, setCurrCharacter] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [disableSelect, setDisableSelect] = useState(true)

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

    const fileInputRef = useRef(null)

    const [cropSrc, setCropSrc] = useState(null)
    const [showCropper, setShowCropper] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

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
                    if (Object.entries(data.characters).length > 0) {
                        setCharacterData(data.characters)
                        const options = Object.entries(data.characters).map(([key, arr]) =>
                            ({value: key, label: arr.name})
                        )
                        setCharacterOptions(options)
                        updateCharacter(Object.keys(data.characters)[0], Object.values(data.characters)[0])
                        setDisableSelect(false)
                    } else {
                        newCharacter()
                    }
            })
        })
	}, [])

	const handleSubmit = async (event) => {
	    event.preventDefault()
	    const formData = buildFormData()
	    setSuccess("")
	    setError("")
	    try {
            const response = await fetch('/api/characters/submit', {
                method: 'POST',
                body: formData
            })
            .then(async res => {
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error)
                    setSuccess("")
                } else {
                    setError("")
                    setSuccess("Character updated successfully!")

                    delete characterData[origKey]
                    characterData[key] = data['characters'][key]

                    const options = characterOptions.filter(item => item.value != origKey)
                    const option = {value: key, label: name}
                    options.push(option)
                    options.sort((a, b) => a.value.localeCompare(b.value));
                    setCharacterOptions(options)
                    setCurrCharacter(option)
                    setOrigKey(key)
                    setDisableSelect(false)
                }
            })
        } catch (error) {
            console.error('Error:', error);
        }
	}

	const updateCharacter = (charKey, character) => {
	    setKey(charKey)
	    setOrigKey(charKey)
        setCurrCharacter({value: charKey, label: character.name})
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
                const file = new File([blob], "character-image." + blob.type.split("/")[1], { type: blob.type });
                setImage(file)
            })
        } else {
            setImage(null)
        }
        setSuccess("")
        setError("")
	}

	const newCharacter = () => {
        updateCharacter("", {name: ""})
	}

	const deleteCharacter = async () => {
	    if (origKey == "") return;
	    const confirmed = window.confirm("Are you sure you want to delete " + origKey + "?");
        if (!confirmed) return;
        const response = await fetch('/api/characters/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: origKey,
                tokenType: tokenType,
                accessToken: accessToken
            })
        })
        .then(async res => {
            if (res.ok) {
                const data = await res.json()
                delete characterData[origKey]
                // This is a problem, for some reason. I don't want to find out the source so here we are
                if (characterData[0]) {
                    delete characterData[0]
                }
                const options = characterOptions.filter(item => item.value != origKey)
                setCharacterOptions(options)
                if (Object.keys(characterData).length > 0) {
                    const currKey = Object.keys(characterData)[0]
                    updateCharacter(currKey, characterData[currKey])
                } else {
                    setDisableSelect(true)
                    newCharacter()
                }
                setSuccess("Character deleted successfully!")
            }
        })
	}

	const uploadImage = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setCropSrc(reader.result)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
                setShowCropper(true)
            })
            reader.readAsDataURL(event.target.files[0])
            event.target.value = ''
        }
	}

	const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = new Image()
        image.src = imageSrc
        await new Promise((resolve) => { image.onload = resolve })
        const canvas = document.createElement('canvas')
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
        return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg'))
	}

	const handleCropConfirm = async () => {
        const blob = await getCroppedImg(cropSrc, croppedAreaPixels)
        const file = new File([blob], 'character-image.jpg', { type: 'image/jpeg' })
        setImage(file)
        setImageUrl(URL.createObjectURL(blob))
        setShowCropper(false)
        setCropSrc(null)
	}

	const handleCropCancel = () => {
        setShowCropper(false)
        setCropSrc(null)
	}

	const deleteImage = (event) => {
	    setImageUrl("")
	    setImage(null)
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
            {showCropper && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal">
                        <p className="crop-title">Crop Image</p>
                        <div className="crop-container">
                            <Cropper
                                image={cropSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                            />
                        </div>
                        <div className="crop-controls">
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="crop-zoom-slider"
                            />
                            <div className="crop-buttons">
                                <input className="save-button" type="button" value="Upload" onClick={handleCropConfirm}/>
                                <input className="save-button" type="button" value="Cancel" onClick={handleCropCancel}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="page-container">
                <NavLink to="/blorbopedia" className='page-button'>Browse Characters</NavLink>
            </div>
            {accessToken == null || tokenType == null ?
            <div class='text-page-container'>
                <div className="page-container">
                <a href={endpoint} className="sign-in-button">Please sign in to continue</a>
                </div>
            </div> :
            <div class='text-page-container'>
                <div className='user-container'>
                    <p className="user-name">
                        <img className="user-img" src={avatar}/>
                        {globalName}
                    </p>
                </div>

                <div className='character-select-row'>
                    <Selector
                        onChangeCall={e => updateCharacter(e['value'], characterData[e['value']])}
                        options={characterOptions}
                        value={currCharacter}
                        defaultValue={characterOptions.length > 0 ? characterOptions[0].value : ""}
                        defaultLabel={characterOptions.length > 0 ? characterOptions[0].label : ""}
                        isDisabled={disableSelect}
                    />
                </div>
                <div className='new-button-row'>
                    <input className="save-button" type="button" value="New" onClick={() => newCharacter()}/>
                </div>
                <form className="submit-form" onSubmit={handleSubmit}>
                    <div className='upper-fields'>
                        <div className="field-inputs">
                            <InputField field="Key *" value={key} valueSetter={setKey} required={true}/>
                            <InputField field="Name *" value={name} valueSetter={setName} required={true}/>
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
                            {imageUrl != "" ? <img className="image" src={imageUrl}/> : <div className="image-placeholder">No image</div>}
                            <div className="image-buttons">
                                <input className="save-button" type="button" value="Upload" onClick={() => fileInputRef.current.click()}/>
                                {imageUrl != "" && <input className="save-button" type="button" value="Remove" onClick={() => deleteImage()}/>}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadImage} style={{display: 'none'}}/>
                        </div>
                    </div>
                    <BigInputField value={description} valueSetter={setDescription}/>
                    <p className='error-text'>{error}</p>
                    <p className='success-text'>{success}</p>
                    <div className='buttons'>
                        <input className="save-button" type="submit" value="Save" onSubmit={() => handleSubmit()}/>
                        <input className="save-button" type="button" value="Delete" onClick={() => deleteCharacter()}/>
                    </div>
                </form>
            </div>}
        </div>
    )
}
