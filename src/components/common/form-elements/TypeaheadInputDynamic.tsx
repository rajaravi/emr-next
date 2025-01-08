import React, { useState } from 'react';
import { Typeahead, TypeaheadMenuProps } from 'react-bootstrap-typeahead';
import styles from '../_style.module.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
// Import the Option type from the library
type Option = TypeaheadMenuProps['options'][number];

// interface Option {
//   label: string; // Display name (used for searching)
//   doctor: string; // Unique identifier
// }

interface ColumnHeader {
  key: string;
  name: string;
  show: boolean;
}

interface TypeaheadOption {
  [key: string]: any; // Flexible structure for options
}

interface TypeaheadDynamicProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: TypeaheadOption[]; // Selected value(s) as an array of objects
  options: TypeaheadOption[]; // List of available options as objects with label and value
  onChange: (selected: any[], name: string, label: string, isClicked: boolean) => void;
  onInputChange: (selected: string, name: string, label: string, isClicked: boolean) => void; // Notify parent when user types
  error?: string;
  colClassName?: string;
  columnHeader?: ColumnHeader[];
}

const TypeaheadDynamic: React.FC<TypeaheadDynamicProps> = ({
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
  columnHeader = [],
}) => {
  
  return (
    <div className={`${colClassName} mb-3`}>
      <label htmlFor={name} className="form-label">
        {required && <span className="text-danger">*</span>} {label}
      </label>
      <Typeahead
        id={name}
        labelKey="label"
        options={options}
        placeholder={placeholder || 'Enter min 3 chars for patient'}
        onChange={(val) => onChange(val, name, label, true)} // Map selected values to strings
        selected={value || []}
        multiple={false} // Set to true if you want to allow multiple selections
        className={`form-control ${styles.paddingUnset} ${error ? 'is-invalid' : ''}`}
        onInputChange={(val) => onInputChange(val, name, label, false) }

        renderMenuItemChildren={(option, props, index) => {
          const item = option as Option;
          // Add alternating row colors
          const rowStyle = {
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
            padding: '5px',
            display: 'flex',
            justifyContent: 'space-between',
          };
          return (
            <>
              {index === 0 && <div
                    style={{
                      display: 'table',
                      width: '100%',
                      backgroundColor: '#f1f1f1',
                      fontWeight: 'bold',
                      padding: '5px',
                    }}
                  >
                  <div style={{ display: 'table-row' }}>
                    {columnHeader
                      .filter((col) => col.show)
                      .map((col) => (
                        <div
                          key={col.key}
                          style={{
                            display: 'table-cell',
                            padding: '5px',
                          }}
                        >
                          {col.name}
                        </div>
                      ))}
                  </div>
                </div>
              }
             
              <div style={rowStyle}>
                {columnHeader.map(
                  (col) =>
                    col.show && (
                      <div key={col.key} style={{ flex: 1, textAlign: 'center' }}>
                        {item[col.key as keyof Option]}
                      </div>
                    )
                )}
              </div>
            </>
          );
        }}
      />
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default TypeaheadDynamic;