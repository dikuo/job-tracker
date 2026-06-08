interface InputFieldProps {
    label: string
    id?: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
}

export default function InputField({ label, id, type = 'text', value, onChange, placeholder, required }: InputFieldProps) {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
        <div>
            <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
                {label}
            </label>
            <input
                id={fieldId}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input-base"
            />
        </div>
    )
}