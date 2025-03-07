export interface PaymentTypeModel {
    id?: number | null;
    name: string;
    type_id: number;
    is_archive: boolean;
    is_default: number;
}