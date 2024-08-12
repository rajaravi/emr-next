import { useRouter } from 'next/router';
import React from 'react';

interface PatientFormProps {
  initialValues: {
    name: string;
    age: number;
    address: string;
    phone: string;
    email: string;
    // Add other fields as necessary
  };
  onSubmit: (values: any) => void;
  isEditMode?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ initialValues, onSubmit, isEditMode = false }) => {
  const [formValues, setFormValues] = React.useState(initialValues);
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };
  const handleCancel = () => {
    router.push('/patient'); // Redirect to the desired page, e.g., the patient list or home page
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formValues.age}
            onChange={handleChange}
            placeholder="Enter patient age"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            placeholder="Enter patient address"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="Enter patient phone number"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter patient email"
          />
        </div>
        {/* Add more fields here */}
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Patient' : 'Save Patient'}
        </button>
      </div>
    </form>
  );
};
