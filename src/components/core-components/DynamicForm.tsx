import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextInput from './TextInput';
import Dropdown from './Dropdown';
import DatePicker from './DatePicker';
import RadioButton from './RadioButton';
import Checkbox from './Checkbox';
import { useRouter } from 'next/router';
import { FormField } from '@/types/form';

interface DynamicFormProps {
  formData: FormField[];
  onSubmit: (values: { [key: string]: any }) => void;
  isEditMode?: boolean;
  initialValues?: { [key: string]: any }; 
  colClass?: string
}

const DynamicForm: React.FC<DynamicFormProps> = ({ initialValues = {}, formData, onSubmit, isEditMode = false, colClass = 'col-md-6' }) => {
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

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
    e.preventDefault();
    console.log("🚀 ~ handleSubmit ~ formValues:", formValues)

    if (validate()) {
        onSubmit(formValues);
    }
  };

  const handleCancel = () => {
    router.push('/patient'); // Redirect to the desired page, e.g., the patient list or patient details page
  };

  const sortedFormData = [...formData].sort((a, b) => a.order - b.order);

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
              return <DatePicker key={index} {...commonProps} colClassName={colClass}/>;
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
};

export default DynamicForm;
