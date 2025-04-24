import Select from 'react-select'

interface selectorProps {
    onChangeCall: () => void;
    options: [{}];
    value: null;
    defaultValue: String;
    defaultLabel: String;
    isDisabled: false;
}

export default function Selector(selectorProps) {
    const styles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#15161c'
        }),
        singleValue:(provided:any) => ({
            ...provided,
            color:'white',
        }),
    }

    return (
        <Select
            onChange={selectorProps.onChangeCall}
            value={selectorProps.value}
            defaultValue={{value: selectorProps.defaultValue, label: selectorProps.defaultLabel}}
            options={selectorProps.options}
            isDisabled={selectorProps.isDisabled}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary25: '#ffa200',
                    primary: '#ffe199',
                    neutral0: '#15161c',
                },
            })}
            styles={styles}
        />
    )
}