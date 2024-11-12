// components/Checkbox.tsx
import React from 'react';

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxProps {
  label: string;
  name: string;
  value: string[];
  options: CheckboxOption[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  colClassName: string
}

const Checkbox: React.FC<CheckboxProps> = ({ label, name, options, required, value, onChange, error, colClassName, ...rest }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: checkboxValue, checked } = e.target;
    let updatedValues = [...value];

    if (checked) {
      // Add value to selected array if checked
      if (!updatedValues.includes(checkboxValue)) {
        updatedValues.push(checkboxValue);
      }
    } else {
      // Remove value from selected array if unchecked
      updatedValues = updatedValues.filter(val => val !== checkboxValue);
    }

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
      <div key={index} className="form-check">
        <input
          type="checkbox"
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          checked={value.includes(option.value)}
          // required={required}
          onChange={handleCheckboxChange}
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
  
  

export default Checkbox;
