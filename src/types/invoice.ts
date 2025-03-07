interface InvoiceDetails {
    procedure_id: number;
    procedure_date: string;
    procedure_code: string;
    procedure_name: string;
    quantity: number;
    amount: string;
    total: string
}

export interface InvoiceModel {
    id?: number | null;   
    patient_id: number;
    patients: [{value: number, label: string}],
    date: string;
    doctor_id: number;
    location_id: number;
    module_type_id: number;
    module_id: number;
    tags: string;
    payee_id: number;
    tax_id: number;
    purchaser_id: number;
    purchaser_plan_id: number;
    contact_id: number | null;
    discount: string;
    tax_percentage: string;
    tax_rate: number;
    waived_rate: string;
    grand_total: string;
    net_total: number;
    balance: string;
    notes: string;
    invoice_details: InvoiceDetails[]
}