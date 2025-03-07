export interface EncounterModel {
    id?: number | null;
    patient_id: number | null;
    name: string;
    start_date: string;
    is_active: boolean;
}