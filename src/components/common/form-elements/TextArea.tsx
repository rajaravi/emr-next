import React from 'react';

interface TextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  colClassName: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  placeholder,
  required,
  value,
  rows,
  onChange,
  error,
  colClassName
}) => (
  <div className={`${colClassName} mb-3`}>
    <label htmlFor="name" className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <textarea
      className={`form-control ${error ? 'is-invalid' : ''}`}
      name={name}
      id={name}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      rows={rows ? rows: 4}></textarea>
    {error && <div className="text-danger">{error}</div>}
  </div>
  
);

export default TextArea;
