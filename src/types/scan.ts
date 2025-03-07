export interface ScanModel {
    id?: number | null;
    patient_id: number | null;
    doctor_id: number;
    category_id: number;
    description: string;
    date: string;
    uploads: [];
    is_upload: boolean;
}