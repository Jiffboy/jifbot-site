import Select from 'react-select'

interface selectorProps {
    onChangeCall: () => void;
    options: [{}];
    defaultValue: String;
    defaultLabel: String;
}

export default function Selector(selectorProps) {
    const styles = {
        singleValue:(provided:any) => ({
          ...provided,
          color:'white',
        }),
    }

    return (
        <Select
            onChange={selectorProps.onChangeCall}
            defaultValue={{value: selectorProps.defaultValue, label: selectorProps.defaultLabel}}
            options={selectorProps.options}
            theme={(theme) => ({
                ...theme,
                backgroundColor: '#15161c',
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