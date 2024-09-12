import React, { forwardRef, useEffect, useState, Ref } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextInput from './formElements/TextInput';
import Dropdown from './formElements/Dropdown';
import DatePicker from './formElements/DatePicker';
import RadioButton from './formElements/RadioButton';
import Checkbox from './formElements/Checkbox';
import { useRouter } from 'next/router';
import { FormField } from '@/types/form';


export interface DynamicFormHandle {
  validateModelForm: any;
}

interface DynamicFormProps {
  formData: FormField[];
  onSubmit?: (values: { [key: string]: any }) => void;
  isEditMode?: boolean;
  initialValues?: { [key: string]: any }; 
  colClass?: string;
  modelFormInputs?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}

const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps> (({
    initialValues = {},
    formData,
    onSubmit,
    isEditMode = false,
    colClass = 'col-md-6',
    modelFormInputs
  },
    ref: Ref<DynamicFormHandle>
  ) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (isEditMode) {
      setFormValues(initialValues);
    } else {
      // const defaultValues: { [key: string]: any } = {};
      // console.log("🚀 ~ useEffect ~ formData:", formData)
      // formData.forEach(field => {
      //   defaultValues[field.name] = field.defaultValue || '';
      // });
      // setFormValues(defaultValues);
    }
  }, [formData, initialValues, isEditMode]);

  // Set initial invoice date
  useEffect(() => {
    setFormValues((prevFormData) => ({
      ...prevFormData,
      invDate: new Date().toISOString().split('T')[0],  // Set initial value to current date
    }));
  }, []);

  React.useImperativeHandle(ref, () => ({
    validateModelForm
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    console.log("🚀 ~ DynamicForm handleChange ~ name, value:", name, value, typeof event)
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

  const validateModelForm = () => {
    validate();
  }

  const validate = () => {
    const errors: { [key: string]: string } = {};
    formData.forEach(field => {
      if (field.required && !formValues[field.name]) {
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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 ~ handleSubmit ~ formValues:", formValues)
    e.preventDefault();

    if (validate()) {
        onSubmit?.(formValues);
    }
  };

  const handleCancel = () => {
    router.push('/patient'); // Redirect to the desired page, e.g., the patient list or patient details page
  };

  const sortedFormData = [...formData].sort((a, b) => a.order - b.order);
  // console.log("🚀 ~ sortedFormData:", sortedFormData)

  return (
    <form onSubmit={handleSubmit} className="container">
      <div className="row">
        {sortedFormData.map((field, index) => {
          const commonProps = {
            label: field.label || '',
            name: field.name,
            required: field.required,
            onChange: handleChange,
            value: formValues[field.name] || '',
            error: formErrors[field.name],
          };

          switch (field.type) {
            case 'text':
              return <TextInput key={index} {...commonProps} placeholder={field.placeholder} validation={field.validation} colClassName={colClass} />;
            case 'dropdown':
              return <Dropdown key={index} {...commonProps} options={field.options!} colClassName={colClass}/>;
            case 'date':
              return (
              <DatePicker 
                key={index} 
                {...commonProps} 
                disablePrevDate={field.disablePrevDate} 
                disableFutureDate={field.disableFutureDate} 
                colClassName={colClass}
              />);
            case 'radio':
              return <RadioButton key={index} {...commonProps} options={field.options!} colClassName={colClass}/>;
            case 'checkbox':
              return <Checkbox key={index} {...commonProps} options={field.options!} colClassName={colClass}/>;
            case 'submit':
              return (
                <div key={index} className="col-12">
                  <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                    Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update Patient' : 'Save Patient'}
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
