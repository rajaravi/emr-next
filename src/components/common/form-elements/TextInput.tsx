import React from 'react';

interface TextInputProps {
  label: string;
  textType?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
  };
  pattern?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  colClassName?: string;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  textType = 'text',
  name,
  placeholder,
  required,
  value,
  validation,
  pattern,
  onChange,
  error,
  colClassName = 'col-sm-12',
  autoComplete = 'off'
}) => (
  <div className={`${colClassName} mb-3`}>
    <label htmlFor={name} className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <input
      type={textType}
      name={name}
      id={name}
      placeholder={placeholder}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      required={required}
      value={value}
      minLength={validation?.minLength}
      maxLength={validation?.maxLength}
      pattern={pattern}
      onChange={onChange}
      aria-describedby={`${name}Help`}
      autoComplete = {autoComplete}
    />
    {error && <div className="text-danger">{error}</div>}
  </div>
  
);

export default TextInput;
