const LoginInput = ({ onChange, label, id, value, type }
    : {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        label: string;
        id: string;
        value: string;
        type: string
    }) => (
    <div className="input-container">
        <label htmlFor={id}>{label}:</label>
        <input
            type={type}
            id={id}
            placeholder={label}
            value={value}
            onChange={onChange} />
    </div>
)

export default LoginInput;