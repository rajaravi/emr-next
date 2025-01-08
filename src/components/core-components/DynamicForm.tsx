import React, { forwardRef, useEffect, useState, Ref } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextInput from '@/components/common/form-elements/TextInput';
// import TextInput from './formElements/TextInput';
import Dropdown from '@/components/common/form-elements/Dropdown';
import DatePicker from '@/components/common/form-elements/DatePicker';
import RadioButton from '@/components/common/form-elements/RadioButton';
import Checkbox from '@/components/common/form-elements/Checkbox';
import Switch from '@/components/common/form-elements/Switch';
import TypeaheadInput from '@/components/common/form-elements/TypeaheadInput';
import { useRouter } from 'next/router';
import { FormField } from '@/types/form';
import TextArea from '@/components/common/form-elements/TextArea';
import TypeaheadDynamic from '../common/form-elements/TypeaheadInputDynamic';

interface Option {
  label: string;
  value: string;
}

export interface DynamicFormHandle {
  validateModelForm: any;
  // customModelSubmit: any;
}

interface DynamicFormProps {
  formData: FormField[];
  onSubmit?: (values: { [key: string]: any }) => void;
  formReset?: boolean;
  isEditMode?: boolean;
  initialValues?: { [key: string]: any }; 
  colClass?: string;
  modelFormInputs?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  modelFormTypeahead?: any;
  columHeaderTypeahead?: any;
}

const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps> (({
    initialValues = {},
    formReset = false,
    formData,
    onSubmit,
    isEditMode = false,
    colClass = 'col-md-6',
    modelFormInputs,
    modelFormTypeahead,
    columHeaderTypeahead
  },
    ref: Ref<DynamicFormHandle>
  ) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (isEditMode || formReset) {
      setFormValues(initialValues);
    }
  }, [formData, initialValues, isEditMode]);

  // Set initial invoice date
  useEffect(() => {
    setFormValues((prevFormData) => ({
      ...prevFormData,
      // invDate: new Date().toISOString().split('T')[0],  // Set initial value to current date
    }));
  }, []);

  React.useImperativeHandle(ref, () => ({
    validateModelForm,
    // customModelSubmit,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (modelFormInputs) {
      modelFormInputs?.(event);
      if (value) {
        formErrors[name] = '';
        setFormErrors(formErrors);
      }
    }
  };

  const handleTypeaheadChange = (selected: Option[], name: string, label: string, isCliked = false) => {
    setFormValues({
      ...formValues,
      [name]: selected,
    });

    if (modelFormTypeahead) {
      modelFormTypeahead?.(name, selected, label, isCliked = true)
      if (selected) {
        formErrors[name] = '';
        setFormErrors(formErrors);
      }
    }
  };
  
  
  const validateModelForm = () => {
    return validate();
  }
  
  const validate = () => {
    const errors: { [key: string]: string } = {};
    formData.forEach(field => {
      if (field.required && (!formValues[field.name] || formValues[field.name]?.length === 0)) {
        errors[field.name] = `${field.label} is required`;
      }
      if (field.validation) {
        if (field.validation.minLength && formValues[field.name]?.length < field.validation.minLength) {
          errors[field.name] = `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation.maxLength && formValues[field.name]?.length > field.validation.maxLength) {
          errors[field.name] = `${field.label} must be at most ${field.validation.maxLength} characters`;
        }
      }
    });
    if (Object.keys(errors).length >= 0) {
      setFormErrors(errors);
    }
    return Object.keys(errors).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 ~ handleSubmit ~ formValues:", formValues)
    e.preventDefault();

    onSubmit?.(formValues);
    if (validate()) {
    }
  };

  const handleCancel = () => {
    router.push('/patient'); // Redirect to the desired page, e.g., the patient list or patient details page
  };

  const sortedFormData = [...formData].sort((a, b) => a.order - b.order);
  // console.log("🚀 ~ sortedFormData:", sortedFormData)

  return (
    <form onSubmit={handleSubmit} className="container-fluid p-0">
      <div className="row">
        {sortedFormData.map((field, index) => {
          const commonProps = {
            label: field.label || '',
            name: field.name,
            required: field.required,
            // onChange: handleChange,
            value: formValues[field.name] || '',
            error: formErrors[field.name],
          };

          switch (field.type) {
            case 'text':
              return <TextInput key={index} {...commonProps} placeholder={field.placeholder}
                onChange={handleChange} validation={field.validation} colClassName={field.colClass} />;
            case 'color':
              return <TextInput key={index} {...commonProps} placeholder={field.placeholder}
                onChange={handleChange} validation={field.validation} colClassName={field.colClass} textType={field.type} />;
            case 'email':
              return <TextInput key={index} {...commonProps} placeholder={field.placeholder}
                onChange={handleChange} validation={field.validation} colClassName={field.colClass} textType={field.type} 
                pattern = {field.pattern} />;
            case 'textarea':
              return <TextArea key={index} {...commonProps} placeholder={field.placeholder}
                onChange={handleChange} rows={field.rows} colClassName={field.colClass} />;
            case 'dropdown':
              return <Dropdown key={index} {...commonProps} options={field.options!}
                onChange={handleChange} colClassName={field.colClass} />;
            case 'date':
              return <DatePicker key={index} {...commonProps} disablePrevDate={field.disablePrevDate}
                disableFutureDate={field.disableFutureDate} 
                onChange={handleChange} colClassName={field.colClass} />;
            case 'radio':
              return <RadioButton key={index} {...commonProps} options={field.options!}
                onChange={handleChange} colClassName={field.colClass} />;
            case 'checkbox':
              return <Checkbox key={index} {...commonProps} options={field.options!}
                onChange={handleChange} colClassName={field.colClass} />;
            case 'switch':
              return <Switch key={index} {...commonProps} options={field.options!}
                onChange={handleChange} colClassName={field.colClass} checked={true} />;
            case 'typeahead': 
              return <TypeaheadInput key={index} {...commonProps}
                onChange={handleTypeaheadChange} options={field.options!} colClassName={field.colClass} 
                onInputChange={modelFormTypeahead} />;
            case 'typeaheadDynamic': 
              return <TypeaheadDynamic key={index} {...commonProps} columnHeader={columHeaderTypeahead}
                onChange={handleTypeaheadChange} options={field.options!} colClassName={field.colClass} 
                onInputChange={modelFormTypeahead} />;
            case 'submit':
              return (
                <div key={index} className="col-12">
                  <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-sm btn-secondary rounded-0 me-2" onClick={handleCancel}>
                    Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary rounded-0">
                    {isEditMode ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </form>
  );
});

export default DynamicForm;
