const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/emr-backend/public/api';

const ENDPOINTS = {
    // GET METHODS
    GET_PATIENT: `${BASE_API_URL}/patient/index`,
    GET_APPOINTMENTS: `${BASE_API_URL}/appointments`,
    GET_PATIENT_HISTORY: `${BASE_API_URL}/patient-history`,
    GET_EXAMINATION: `${BASE_API_URL}/examination`,
    GET_DOCTOR: `${BASE_API_URL}/doctor/index`,
    GET_SPECIALITY: `${BASE_API_URL}/speciality/index`,
    GET_REREFENCE_LIST: `${BASE_API_URL}/reference/get-list`,    

    // POST METHODS
    POST_CREATE_PATIENT: `${BASE_API_URL}/store`,
    POST_CREATE_DOCTOR: `${BASE_API_URL}/doctor/store`,
    POST_CREATE_SPECIALITY: `${BASE_API_URL}/speciality/store`,
    
    // PATCH METHODS
    PATCH_PATIENT: `${BASE_API_URL}/updatePatient`,

    // DELETE METHODS
    DELETE_PATIENT: `${BASE_API_URL}/deletePatient`,
};

export default ENDPOINTS;
