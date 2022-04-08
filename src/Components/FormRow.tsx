type Props = {
    type: string,
    name: string,
    value: string,
    handleChange: any,
    horizontal?: any,
    placeholder?: any
}

function FormRow({ type,
    name,
    value,
    handleChange,
    horizontal,
    placeholder, }: Props) {
    return (
        <div className='form-row'>
            {!horizontal && (
                <label htmlFor={name} className='form-label'>
                    {name}
                </label>
            )}
            <input
                type={type}
                value={value}
                name={name}
                onChange={handleChange}
                className='form-input'
                placeholder={placeholder}
            />
        </div>
    );
}
export default FormRow