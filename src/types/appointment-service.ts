interface AppointmentDetails {
    doctor_id: number;
    location_id: number;
    fee: string;
    duration: number;
}

export interface AppointmentServiceModel {
    id?: number | null;
    name: string;
    code: string;
    fee: string;
    duration: number;
    color_code: string;
    is_available_online: boolean;
    notes: string;
    is_archive: boolean;
    appointment_type_details: AppointmentDetails[];
}