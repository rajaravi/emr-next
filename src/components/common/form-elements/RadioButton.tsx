import React from 'react';

interface RadioButtonOption {
  label: string;
  value: string;
}

interface RadioButtonProps {
  label: string;
  name: string;
  options: RadioButtonOption[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  colClassName?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, name, options, required, value, onChange, error, colClassName = 'col-sm-12' }) => (
  <div className={`${colClassName} mb-3`}>
    <label className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    {options.map((option, index) => (
      <div key={index} className="form-check">
        <input
          type="radio"
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          checked={value === option.value}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          required={required}
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
          {option.label}
        </label>
      </div>
    ))}
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default RadioButton;
