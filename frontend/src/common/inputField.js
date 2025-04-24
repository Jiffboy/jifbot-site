import './css/inputField.css'

interface fieldProps {
    field: String;
    value: String;
    valueSetter: () => void;
    required: false;
}

export default function InputField(fieldProps) {
    return (
        <div className="submit-text-container">
            <p className="submit-text-label">{fieldProps.field}</p>
            <input
                className="submit-text"
                type="text"
                name={fieldProps.field}
                autocomplete="off"
                value={fieldProps.value}
                onChange={e => fieldProps.valueSetter(e.target.value)}
                required={fieldProps.required}
            />
        </div>
    )
}