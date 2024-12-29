export interface Patient {
    id: number;
    designation_id: number;
    first_name: string;
    surname: string;
    full_name: string;
    address1: string;
    address2: string;
    address3: string;
    county: string;
    country: string;
    eircode: string;
    mrn_no: string;
    doctor_id: number;
    shared_doctor_ids: string;
    patient_type_id: number;
    dob: Date;
    gender_id: number;
    home_phone_no: string;
    work_phone_no: string;
    mobile_no: string;
    email: string;
    is_archive: boolean;
};

