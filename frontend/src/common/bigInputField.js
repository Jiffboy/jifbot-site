import React, {useState, useEffect} from 'react'
import './css/inputField.css'

interface bigFieldProps {
    value: String;
    valueSetter: () => void;
}

export default function BigInputField(bigFieldProps) {
    const limit = 4000
    const [count, setCount] = useState(limit - bigFieldProps.value.length)

	const onChange = (event) => {
	    const value = event.target.value
	    bigFieldProps.valueSetter(value)
        setCount(limit - value.length)
	}

	useEffect(() => {
        setCount(limit - bigFieldProps.value.length)
	}, [bigFieldProps.value])

    return (
        <div>
            <p className="submit-text-label">Description</p>
            <textarea
                className="submit-text-big"
                type="text"
                name="name"
                value={bigFieldProps.value}
                onChange={onChange}
                maxLength={limit}
            />
            <p className="submit-text-count">{count}</p>
        </div>
    )
}