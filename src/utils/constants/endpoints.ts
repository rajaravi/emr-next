const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const ENDPOINTS = {
    GET_PATIENT: `${BASE_API_URL}/patient-details`,
    GET_APPOINTMENTS: `${BASE_API_URL}/appointments`,
    GET_PATIENT_HISTORY: `${BASE_API_URL}/patient-history`,
    GET_EXAMINATION: `${BASE_API_URL}/examination`,
};

export default ENDPOINTS;
