export interface SOAPNoteModel {
    id: number | null;
    patient_id: number | null;
    subjective: string;
    objective: string;
    assesment: string;
    plan: string;
}