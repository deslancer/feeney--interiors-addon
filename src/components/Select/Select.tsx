interface SelectProps {
    withLabel: boolean;
    labelText?: string;
    options: Array<{ value: string, text: string }>
    disabled?: boolean
}

export function Select(props: SelectProps) {
    const {options, labelText, withLabel = true, disabled = false} = props
    return (
        <div className={"my-4"}>
            {withLabel && (
                <label htmlFor={labelText}
                       className={`block mb-2 w-full text-left text-sm font-medium ${disabled ? "text-gray-400" : "text-white"} `}>{labelText}</label>
            )}
            <select
                id={labelText}
                disabled={disabled}
                className={`
                 border border-feeney_secondary_dark
                  text-white text-sm
                   rounded-lg
                    block w-full p-2.5
                     ${disabled ? "bg-feeney_disabled text-feeney_disabled_light border-feeney_disabled" : "bg-feeney_secondary_dark"}
                     `}>
                {options.map((option, index) => (
                    <option key={option.value + index} value={option.value}>{option.text}</option>
                ))}
            </select>
        </div>
    )
}