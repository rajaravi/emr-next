import React, { useEffect, useRef } from "react";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js"
import "select2"; 
import $ from "jquery";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  name: string;
  options: DropdownOption[];
  required?: boolean;
  value?: string[]; // Multi-select values
  onChange: (selectedValues: string[], eleName: any) => void;
  error?: string;
  multiple?: boolean;
  defaultValue?: string;
  colClassName?: string;
}

const Select2Dropdown: React.FC<DropdownProps> = ({ label, name, options, required, value = [],
    onChange, error, defaultValue = '', multiple = false, colClassName = 'col-sm-12', ...rest }) => {

    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      if (!selectRef.current) return;

      const $select = $(selectRef.current!);
      
      // Initialize Select2 only if it's not already initialized
      if (!$select.hasClass("select2-hidden-accessible")) {
        $select.select2({
          width: "100%",
          placeholder: label,
          allowClear: true
        });
      }

      // Set initial value ONLY IF IT'S DIFFERENT to prevent resetting
      const currentValue = $select.val() as string[];
      if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
        $select.val(value).trigger("change.select2");
      }

      // Handle change event (without triggering reset)
      const handleChange = () => {
        const selectedValues = $select.val() as string[];
        console.log("🚀 ~ handleChange ~ selectedValues:", selectedValues)
        onChange(selectedValues, name);
      };

      $select.on("change.select2", handleChange);

      return () => {
        $select.off("change.select2", handleChange);
      };
    }, []); // Empty dependency array to run only once
    
    return (
      <div className={`${colClassName} mb-3`}>
        <label htmlFor={name} className="form-label">
          {required && <span className="text-danger">*</span>}
          {label}
        </label>
        <select
          ref={selectRef}
          name={name}
          id={name}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          required={required}
          // value={value || (multiple ? [] : defaultValue)}
          multiple
          {...rest}
        >
          {/* {!multiple && <option value="">Select...</option>} */}
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
      

export default Select2Dropdown;
