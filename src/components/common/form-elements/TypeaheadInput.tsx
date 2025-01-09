import React from 'react';
import { Typeahead, TypeaheadMenuProps } from 'react-bootstrap-typeahead';
import styles from '../_style.module.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
// Import the Option type from the library
type Option = TypeaheadMenuProps['options'][number];

interface TypeaheadInputProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: Option[]; // Selected value(s) as an array of objects
  options: Option[]; // List of available options as objects with label and value
  onChange: (selected: any[], name: string, label: string) => void;
  onInputChange: (selected: string, name: string, label: string, isClicked: boolean) => void; // Notify parent when user types
  error?: string;
  colClassName?: string;
}

const TypeaheadInput: React.FC<TypeaheadInputProps> = ({
  label,
  name,
  placeholder,
  required,
  value,
  options,
  onChange,
  onInputChange,
  error,
  colClassName = 'col-sm-12',
}) => (
  <div className={`${colClassName} mb-3`}>
    <label htmlFor={name} className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <Typeahead
      id={name}
      options={options}
      placeholder={placeholder || 'Enter min 3 chars for patient'}
      selected={value || []}
      onChange={(val) => onChange(val, name, label)} // Map selected values to strings
      onInputChange={(val) => onInputChange(val, name, label, false) }
      multiple={false} // Set to true if you want to allow multiple selections
      className={`form-control ${styles.paddingUnset} ${error ? 'is-invalid' : ''}`}
    />
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default TypeaheadInput;