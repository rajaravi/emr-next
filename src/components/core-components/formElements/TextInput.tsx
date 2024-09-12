import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
  };
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  colClassName: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder,
  required,
  value,
  validation,
  onChange,
  error,
  colClassName
}) => (
  <div className={`${colClassName} mb-3`}>
    <label htmlFor="name" className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      placeholder={placeholder}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      required={required}
      value={value}
      minLength={validation?.minLength}
      maxLength={validation?.maxLength}
      onChange={onChange}
      aria-describedby={`${name}Help`}
    />
    {error && <div className="text-danger">{error}</div>}
  </div>
  
);

export default TextInput;
