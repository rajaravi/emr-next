export interface LetterModel {
    id?: number | null;
    patient_id: number | null;
    encounter_id: number;
    doctor_id: number;
    category_id: number;
    template_id: number;
    description: string;
    date: string;
    module_type_id: string;
    module_id: string;
    content: string;
}