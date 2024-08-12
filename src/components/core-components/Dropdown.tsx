import React from 'react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  name: string;
  options: DropdownOption[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  multiple?: boolean;
  defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, name, options, required, value,
    onChange, error, defaultValue = '', multiple = false, ...rest }) => {
    
    return (
      <div className="col-md-6 mb-3">
        <label className="form-label">
          {required && <span className="text-danger">*</span>}
          {label}
        </label>
        <select
          name={name}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          required={required}
          value={value || (multiple ? [] : defaultValue)}
          multiple={multiple}
          onChange={onChange}
          {...rest}
        >
          {!multiple && <option value="">Select...</option>}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <div className="text-danger">{error}</div>}
      </div>
    );

    }
      

export default Dropdown;
