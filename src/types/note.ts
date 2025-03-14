export interface NoteModel {
    id: number | null;
    patient_id: number | null;
    date: string;
    notes: string;
    status_id: number | null;
}