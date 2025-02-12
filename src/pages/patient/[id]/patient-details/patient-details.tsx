import React, { useEffect, useState } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { uuidToId } from '@/utils/helpers/uuid';
import DynamicForm from '@/components/core-components/DynamicForm';
import { useTranslation } from 'next-i18next';
import FormSkeleton from '@/components/suspense/FormSkeleton';
import ToastNotification from '@/components/core-components/ToastNotification';
import { PatientFormElements } from '@/data/PatientFormElements';

const initialValue = {
  id: 0,
  designation_id: 0,
  first_name: '',
  surname: '',
  full_name: '',
  address1: '',
  address2: '',
  address3: '',
  county: '',
  country: '',
  eircode: '',
  mrn_no: '',
  doctor_id: 0,
  shared_doctor_ids: '',
  patient_type_id: 0,
  dob: '',
  gender_id: 0,
  home_phone_no: '',
  work_phone_no: '',
  mobile_no: '',
  send_sms: 0,
  email: '',
  send_email: 0,
  occupation: '',
  marital_status_id: 0,
  religion: '',
  notes: '',
  clinical_notes: '',
  rip: 0,
  is_archive: 0
};

interface PatientDetailsProps {
  patientId: string,
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const { t } = useTranslation('common');
  // const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});
  const [initialValues, setInitialValues] = useState<any>(initialValue);  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  // const initialFormData: Patient = {
  //   "id": 0,
  //   "designation_id": 0,
  //   "first_name": "",
  //   "surname": "",
  //   "full_name": "",
  //   "address1": "",
  //   "address2": "",
  //   "address3": "",
  //   "county": "",
  //   "country": "",
  //   "eircode": "",
  //   "mrn_no": "",
  //   "doctor_id": 0,
  //   "shared_doctor_ids": "",
  //   "patient_type_id": 0,
  //   "dob": "",
  //   "gender_id": 0,
  //   "home_phone_no": "",
  //   "work_phone_no": "",
  //   "mobile_no": "",
  //   "email": "",
  //   "is_archive": false 
  // };

  useEffect(() => {
    if (!patientId) return;
     // Language apply for form label
    const translatedFormElements = PatientFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.DETAILS.'+element.label)
    }));
    
    const fetchPatientDetails = async () => {
      try {
        let passData: any = { id: uuidToId(patientId) };
        const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
        if(response.success) {
          setInitialValues(response.data.data);
        }
        // Designations options assign
        let designation = new Array;
        if(response.data.designations) {
            response.data.designations.map((design: any, s: number) => {
            designation.push({'label':design.description, 'value': design.id});
          })
        }
  
        // Doctors options assign
        let doctor = new Array;
        if(response.data.doctors) {
          response.data.doctors.map((spec: any, s: number) => {
            doctor.push({'label':spec.name, 'value': spec.id});
          })
        }
  
        // Patient types options assign
        let patientType = new Array;
        if(response.data.patient_types) {
          response.data.patient_types.map((ptype: any, s: number) => {
            patientType.push({'label':ptype.name, 'value': ptype.id});
          })
        }
        // Dynamic values options format
        translatedFormElements.map((elements: any, k: number) => {
          if(elements.name == 'designation_id') {
            elements.options = [];
            elements.options = designation;
          }
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
          if(elements.name == 'patient_type_id') {
            elements.options = [];
            elements.options = patientType;
          }        
        })
        setTranslatedElements(translatedFormElements);
      } catch (err) {
        setError('Failed to load form data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
    // const timer = setTimeout(() => {
    //   fetchInitialValues();
    // }, 1000); // Delay to demonstrate Suspense
    // return () => clearTimeout(timer);
  }, [patientId, t]);  

  const handleUpdate = async (formData: any) => {
    try {
      const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_STORE, formData);
      if(response.success) {
        handleShowToast(t('PATIENT.DETAILS.MESSAGES.SAVE_SUCCESS'), 'success');
      }      
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  if (loading) return <><FormSkeleton /></>;
  if (error) return <>{error}</>;

  return (
    <>
      <div className="p-0 patient-form">
        <h1 className={`${styles.title} my-3`}>{t('PATIENT.EDIT_HEADER')}</h1>        
        <DynamicForm
          formData={translatedElements}
          initialValues={initialValues}
          onSubmit={handleUpdate}
          isEditMode={true} />
      </div>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
export default PatientDetails;