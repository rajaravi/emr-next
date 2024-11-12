// components/Checkbox.tsx
import React from 'react';

interface CheckboxOption {
  label: string;
  value: string | number;
}

interface CheckboxProps {
  label: string;
  name: string;
  value: string | number | boolean;
  options: CheckboxOption[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  colClassName?: string;
  checked: boolean
}

const Switch: React.FC<CheckboxProps> = ({ label, name, options, required, value, onChange, error, colClassName = 'col-sm-12', checked, ...rest }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const value = e.target?.checked;
    let updatedValues = value;
    onChange({
      target: {
        name,
        value: updatedValues
      }
    } as any); // Casting to match the expected type for onChange
  };

  return (
    <div className={`${colClassName} mb-3`}>
    <label>
        {required && <span className="text-danger">*</span>}
        {label}
    </label>
    {options.map((option, index) => (
      <div key={index} className="form-check form-switch mt-2">
        <input
          type="checkbox"
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          // required={required}
          onChange={handleCheckboxChange}
          checked={(value) ? true : false}
          {...rest}
        />
        <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
          {option.label}
        </label>
      </div>
    ))}
    {error && <div className="text-danger">{error}</div>}
  </div>
  );
}
  
export default Switch;
