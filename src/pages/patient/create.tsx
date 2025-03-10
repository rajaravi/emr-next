import React, { useEffect, useState } from 'react';
import DynamicForm from '@/components/core-components/DynamicForm';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import FormSkeleton from '@/components/suspense/FormSkeleton';
import ToastNotification from '@/components/core-components/ToastNotification';
import { PatientFormElements } from '@/data/PatientFormElements';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

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

const CreatePatient = () => {
    const { t } = useTranslation('common');
    const [initialValues, setInitialValues] = useState<any>(initialValue);  
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [translatedElements, setTranslatedElements] = useState<any>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');  
    const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

    useEffect(() => {
        // Language apply for form label
       const translatedFormElements = PatientFormElements.map((element) => ({
         ...element,
         label: t('PATIENT.DETAILS.'+element.label)
       }));
       
       const fetchInitialValues = async () => {
         try {
           let passData: any = { id: null };
           let response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
           if(response.success) {            
              // for testing select2 purpose
              response.data = Object.assign({}, response.data, {'designation_id_dd': []}) 
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
                if(elements.name == 'designation_id_dd') {
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
           }
         } catch (err) {
           setError('Failed to load form data.');
         } finally {
           setLoading(false);
         }
       };
       const timer = setTimeout(() => {
         fetchInitialValues();
       }, 1000); // Delay to demonstrate Suspense
       return () => clearTimeout(timer);
     }, []);  
     
    const handleCreate = async (formData: any) => {
        try {
            delete formData.designation_id_dd
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
            <div className="container-fluid pt-60 pb-3">
                <h1 className='py-3'>{t('PATIENT.CREATE_HEADER')} </h1>
                <DynamicForm
                    formData={translatedElements}
                    initialValues={initialValues}
                    onSubmit={handleCreate}
                />
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
export default CreatePatient;