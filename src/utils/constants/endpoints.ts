const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const ENDPOINTS = {
    // GET METHODS
    GET_PATIENT: `${BASE_API_URL}/patient-details`,
    GET_APPOINTMENTS: `${BASE_API_URL}/appointments`,
    GET_PATIENT_HISTORY: `${BASE_API_URL}/patient-history`,
    GET_EXAMINATION: `${BASE_API_URL}/examination`,

    // POST METHODS
    POST_CREATE_PATIENT: `${BASE_API_URL}/createPatient`,
    
    // PATCH METHODS
    PATCH_PATIENT: `${BASE_API_URL}/updatePatient`,

    // DELETE METHODS
    DELETE_PATIENT: `${BASE_API_URL}/deletePatient`,
};

export default ENDPOINTS;
