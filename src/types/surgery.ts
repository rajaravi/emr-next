interface Procedures {
    procedure_id: number;    
}

export interface SurgeryModel {
    id?: number | null;
    patient_id: number,
    patient: [ { value: number, label: string}];
    episode_id: number,
    doctor_id: number,
    location_id: number,
    date: string,
    from_time: string,
    to_time: string,
    admission_date: string ,
    discharge_date: string,
    discharge_time: string,
    notes: string,
    status_id: number,
    surgery_details: Procedures[]
}  