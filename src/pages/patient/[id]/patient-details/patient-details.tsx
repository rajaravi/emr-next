import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextApiRequest, NextApiResponse } from 'next';
import { execute_axios_get, execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { uuidToId } from '@/utils/helpers/uuid';
import axios from 'axios';
import DynamicForm from '@/components/core-components/DynamicForm';
import { FormField } from '@/types/form';
import { PatientFormElements } from '@/data/PatientFormElements';
import { PatientForm } from '@/data/PatientForm';
import { useTranslation } from 'next-i18next';

interface PatientDetailsProps {
  patientId: string,
}

// Dummy data to represent fetched patient data. Replace this with actual data fetching logic.
const patientData = {
  name: 'John Doe',
  age: 30,
  address: '123 Main St',
  phone: '555-1234',
  email: 'johndoe@example.com'
};
const initialValues = {
  title: ["mrs"],
  firstName: 'John',
  surName: 'Doe',
  gender: ["male"],
  dob: '1989-11-19',
  address1: 'Dublin',
  sendEmail: '0'
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const { t } = useTranslation('common');
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const response = await execute_axios_get('/mock/getPatientData'); // Replace with your actual API endpoint
        console.log("🚀 ~ fetchInitialValues ~ response:", response.data)
        setInitialValues(response.data);
      } catch (err) {
        setError('Failed to load form data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialValues();
  }, []);

  // const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //   try {
  //     const getData = await execute_axios_get(ENDPOINTS.GET_PATIENT);
  //     console.log('GET data:', getData);

  //     res.status(200).json({ message: 'Success', getData });
  //   } catch (error: any) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };

  const handleUpdate = async (values: any) => {
    console.log('Updating patient with values:ss', values);

    try {
      const response = await execute_axios_post('/api/updatePatient', values);
      console.log(response.data.message); // Display success message or handle success
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };


  if (loading) return <p>Loading form...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="container mt-4">
        <h2>{t('PATIENT.EDIT_HEADER')}</h2>
        {/* <PatientForm
          initialValues={patientData} // Pass the patient data for editing
          onSubmit={handleUpdate}
          isEditMode={true} // Indicates it's an edit form
        /> */}
        
        <DynamicForm
          formData={PatientFormElements}
          initialValues={initialValues}
          onSubmit={handleUpdate}
          isEditMode={true} />
      </div>
    </>
  );
};

export default PatientDetails;
