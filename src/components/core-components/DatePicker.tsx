import React from 'react';

interface DatePickerProps {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, name, required, value, onChange, error }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <input
      type="date"
      name={name}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      required={required}
      value={value}
      onChange={onChange}
    />
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default DatePicker;
