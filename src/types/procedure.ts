interface Procedures {
    purchaser_id: string;
    fee: string;
}

export interface ProcedureModel {
    id?: number | null;
    name: string;
    code: string;
    fee: string;
    color_code: string;
    is_archive: boolean;
    procedure_details: Procedures[];
}  