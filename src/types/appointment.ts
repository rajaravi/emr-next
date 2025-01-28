export interface AppointmentModel {
    id?: number | null;
    patient_id: number;
    patient: [ { value: number, label: string}];
    encounter_id: number;
    doctor_id: number;
    location_id: number;
    appointment_type_id: number;
    date: string;
    from_time: string;
    to_time: string;
    notes: string;
    status_id: number;
}