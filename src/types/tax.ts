export interface TaxModel {
    id?: number | null;
    name: string;
    percentage: string;
    is_archive: boolean;
    is_default: number;
}