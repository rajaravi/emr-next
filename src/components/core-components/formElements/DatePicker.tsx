import React from 'react';

interface DatePickerProps {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disablePrevDate?: boolean;
  disableFutureDate?: boolean;
  colClassName: string;
}

const todayDate = new Date().toISOString().split('T')[0];

const DatePicker: React.FC<DatePickerProps> = ({ 
  label, name, required, value, onChange, error, disablePrevDate = true, disableFutureDate = true, colClassName 
}) => (
  <div className={`${colClassName} mb-3`}>
    <label className="form-label">
      {required && <span className="text-danger">*</span>}
      {label}
    </label>
    <input
      type="date"
      name={name}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      required={required}
      value={value || todayDate}
      min={disablePrevDate ? todayDate: undefined}
      max={disableFutureDate ? todayDate: undefined}
      onChange={onChange}
    />
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default DatePicker;
