import Header from '@/components/layout/Header';
import { Container } from 'postcss';
import axios from 'axios';
import DynamicForm from '@/components/core-components/DynamicForm';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import { PatientFormElements } from '@/data/PatientFormElements';
import { PatientForm } from '@/data/PatientForm';

// import { useTranslation } from '@/hooks/useTranslation';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialPatientValues = {
    name: '',
    age: 0,
    address: '',
    phone: '',
    email: ''
};

const CreatePatient = () => {
    const { t } = useTranslation('common');

    const handleCreate = async (values: any) => {
        // Logic to create a new patient
        console.log('Creating patient with values:', values);
        try {
            const response = await execute_axios_post(ENDPOINTS.POST_CREATE_PATIENT, values, {
                headers: {
                  "content-type": "application/json",
                  'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
                }
            });
            // const response = await axios.post('/api/createPatient', values);
            console.log('GET data:', response);

            //   res.status(200).json({ message: 'Success', response });
        } catch (error: any) {
            console.error('Error creating patient:', error);
            //   res.status(500).json({ message: error.message });
        }
    };

    return (
        <div className="mt-4">
            {/* <h2>Add Patient</h2>
            <h1>Static Form </h1>
          <PatientForm
              initialValues={initialPatientValues} // Pass the initial values
              onSubmit={handleCreate}
          /> */}
            <div className="container-fluid">
                <h1>Add Patient </h1>
                <DynamicForm
                    formData={PatientFormElements}
                    onSubmit={handleCreate}
                />
            </div>
        </div>
    );
};

export default CreatePatient;
